/**
 * Pure JavaScript Lark Open Platform REST API Client
 * Compatible with Node.js 18+ and Cloudflare Workers (V8 Edge Runtime)
 */

class LarkDirectApi {
  constructor(appId, appSecret, baseToken) {
    this.appId = appId || process.env.LARK_APP_ID || "cli_aa9a88a6e7f89ed2";
    this.appSecret = appSecret || process.env.LARK_APP_SECRET || "qmzk77vbQMpFtUP66JRr1ebJPyqHooD5";
    this.baseToken = baseToken || process.env.BASE_TOKEN || "G2IgbTgmmaLnQPs3LPblGz0ngQf";
    this.cachedToken = null;
    this.tokenExpiry = 0;
  }

  async getTenantAccessToken() {
    const now = Date.now();
    if (this.cachedToken && this.tokenExpiry > now + 60000) {
      return this.cachedToken;
    }

    const res = await fetch("https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: this.appId,
        app_secret: this.appSecret
      })
    });

    const data = await res.json();
    if (data.code !== 0) {
      throw new Error(`Lark Auth Error: ${data.msg} (code ${data.code})`);
    }

    this.cachedToken = data.tenant_access_token;
    this.tokenExpiry = now + (data.expire * 1000);
    return this.cachedToken;
  }

  async getAppAccessToken() {
    const res = await fetch("https://open.larksuite.com/open-apis/auth/v3/app_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: this.appId,
        app_secret: this.appSecret
      })
    });
    const data = await res.json();
    if (data.code !== 0) {
      throw new Error(`Lark App Auth Error: ${data.msg} (code ${data.code})`);
    }
    return data.app_access_token;
  }

  async exchangeOAuthCode(code) {
    const appToken = await this.getAppAccessToken();
    const res = await fetch("https://open.larksuite.com/open-apis/authen/v1/access_token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${appToken}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code
      })
    });
    const data = await res.json();
    if (data.code !== 0) {
      // Try OIDC endpoint if v1 returned non-zero
      try {
        const oidcRes = await fetch("https://open.larksuite.com/open-apis/authen/v1/oidc/access_token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grant_type: "authorization_code",
            client_id: this.appId,
            client_secret: this.appSecret,
            code: code
          })
        });
        const oidcData = await oidcRes.json();
        if (oidcData.code === 0 && oidcData.data) {
          return oidcData.data;
        }
      } catch (e) {}
      throw new Error(`OAuth Code Exchange Error: ${data.msg} (code ${data.code})`);
    }
    return data.data;
  }

  async fetchRecords(tableId, pageSize = 500) {
    const token = await this.getTenantAccessToken();
    let allRecords = [];
    let pageToken = "";
    let hasMore = true;

    while (hasMore) {
      const url = new URL(`https://open.larksuite.com/open-apis/bitable/v1/apps/${this.baseToken}/tables/${tableId}/records`);
      url.searchParams.set("page_size", String(pageSize));
      if (pageToken) url.searchParams.set("page_token", pageToken);

      const res = await fetch(url.toString(), {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.code !== 0) {
        throw new Error(`Fetch Records Error: ${data.msg} (code ${data.code})`);
      }

      if (data.data && data.data.items) {
        const mapped = data.data.items.map(item => ({
          record_id: item.record_id,
          ...item.fields
        }));
        allRecords.push(...mapped);
      }

      hasMore = data.data && data.data.has_more;
      pageToken = data.data && data.data.page_token;
    }

    return allRecords;
  }

  async updateRecord(tableId, recordId, fields) {
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${this.baseToken}/tables/${tableId}/records/${recordId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields })
    });
    return res.json();
  }

  async batchUpdateRecords(tableId, records) {
    // records: [ { record_id: "...", fields: { ... } } ]
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${this.baseToken}/tables/${tableId}/records/batch_update`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ records })
    });
    return res.json();
  }

  async createRecord(tableId, fields) {
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${this.baseToken}/tables/${tableId}/records`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields })
    });
    return res.json();
  }

  async deleteRecord(tableId, recordId) {
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${this.baseToken}/tables/${tableId}/records/${recordId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return res.json();
  }

  async batchCreateRecords(tableId, records) {
    // records: [ { fields: { ... } } ]
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${this.baseToken}/tables/${tableId}/records/batch_create`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ records })
    });
    return res.json();
  }

  async batchDeleteRecords(tableId, recordIdList) {
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${this.baseToken}/tables/${tableId}/records/batch_delete`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ records: recordIdList })
    });
    return res.json();
  }

  async sendInteractiveCard(receiveId, cardContent, receiveIdType = "open_id") {
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/im/v1/messages?receive_id_type=${receiveIdType}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        receive_id: receiveId,
        msg_type: "interactive",
        content: typeof cardContent === "string" ? cardContent : JSON.stringify(cardContent)
      })
    });
    return res.json();
  }

  async searchUsers(query) {
    if (!query) return [];
    const token = await this.getTenantAccessToken();
    const res = await fetch(`https://open.larksuite.com/open-apis/contact/v3/users/search`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, page_size: 20 })
    });
    const data = await res.json();
    if (data.code === 0 && data.data && data.data.users) {
      return data.data.users.map(u => ({
        id: u.open_id,
        name: u.name,
        email: u.email || "",
        department: u.department_ids ? u.department_ids.join(", ") : ""
      }));
    }
    return [];
  }
}

module.exports = LarkDirectApi;
