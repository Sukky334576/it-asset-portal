var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
// @__NO_SIDE_EFFECTS__
function notImplementedAsync(name) {
  const fn = /* @__PURE__ */ notImplemented(name);
  fn.__promisify__ = () => /* @__PURE__ */ notImplemented(name + ".__promisify__");
  fn.native = fn;
  return fn;
}
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
var init_utils = __esm({
  "node_modules/unenv/dist/runtime/_internal/utils.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    __name(createNotImplementedError, "createNotImplementedError");
    __name(notImplemented, "notImplemented");
    __name(notImplementedAsync, "notImplementedAsync");
    __name(notImplementedClass, "notImplementedClass");
  }
});

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin, _performanceNow, nodeTiming, PerformanceEntry, PerformanceMark, PerformanceMeasure, PerformanceResourceTiming, PerformanceObserverEntryList, Performance, PerformanceObserver, performance;
var init_performance = __esm({
  "node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
    _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
    nodeTiming = {
      name: "node",
      entryType: "node",
      startTime: 0,
      duration: 0,
      nodeStart: 0,
      v8Start: 0,
      bootstrapComplete: 0,
      environment: 0,
      loopStart: 0,
      loopExit: 0,
      idleTime: 0,
      uvMetricsInfo: {
        loopCount: 0,
        events: 0,
        eventsWaiting: 0
      },
      detail: void 0,
      toJSON() {
        return this;
      }
    };
    PerformanceEntry = class {
      static {
        __name(this, "PerformanceEntry");
      }
      __unenv__ = true;
      detail;
      entryType = "event";
      name;
      startTime;
      constructor(name, options) {
        this.name = name;
        this.startTime = options?.startTime || _performanceNow();
        this.detail = options?.detail;
      }
      get duration() {
        return _performanceNow() - this.startTime;
      }
      toJSON() {
        return {
          name: this.name,
          entryType: this.entryType,
          startTime: this.startTime,
          duration: this.duration,
          detail: this.detail
        };
      }
    };
    PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
      static {
        __name(this, "PerformanceMark");
      }
      entryType = "mark";
      constructor() {
        super(...arguments);
      }
      get duration() {
        return 0;
      }
    };
    PerformanceMeasure = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceMeasure");
      }
      entryType = "measure";
    };
    PerformanceResourceTiming = class extends PerformanceEntry {
      static {
        __name(this, "PerformanceResourceTiming");
      }
      entryType = "resource";
      serverTiming = [];
      connectEnd = 0;
      connectStart = 0;
      decodedBodySize = 0;
      domainLookupEnd = 0;
      domainLookupStart = 0;
      encodedBodySize = 0;
      fetchStart = 0;
      initiatorType = "";
      name = "";
      nextHopProtocol = "";
      redirectEnd = 0;
      redirectStart = 0;
      requestStart = 0;
      responseEnd = 0;
      responseStart = 0;
      secureConnectionStart = 0;
      startTime = 0;
      transferSize = 0;
      workerStart = 0;
      responseStatus = 0;
    };
    PerformanceObserverEntryList = class {
      static {
        __name(this, "PerformanceObserverEntryList");
      }
      __unenv__ = true;
      getEntries() {
        return [];
      }
      getEntriesByName(_name, _type) {
        return [];
      }
      getEntriesByType(type) {
        return [];
      }
    };
    Performance = class {
      static {
        __name(this, "Performance");
      }
      __unenv__ = true;
      timeOrigin = _timeOrigin;
      eventCounts = /* @__PURE__ */ new Map();
      _entries = [];
      _resourceTimingBufferSize = 0;
      navigation = void 0;
      timing = void 0;
      timerify(_fn, _options) {
        throw createNotImplementedError("Performance.timerify");
      }
      get nodeTiming() {
        return nodeTiming;
      }
      eventLoopUtilization() {
        return {};
      }
      markResourceTiming() {
        return new PerformanceResourceTiming("");
      }
      onresourcetimingbufferfull = null;
      now() {
        if (this.timeOrigin === _timeOrigin) {
          return _performanceNow();
        }
        return Date.now() - this.timeOrigin;
      }
      clearMarks(markName) {
        this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
      }
      clearMeasures(measureName) {
        this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
      }
      clearResourceTimings() {
        this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
      }
      getEntries() {
        return this._entries;
      }
      getEntriesByName(name, type) {
        return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
      }
      getEntriesByType(type) {
        return this._entries.filter((e) => e.entryType === type);
      }
      mark(name, options) {
        const entry = new PerformanceMark(name, options);
        this._entries.push(entry);
        return entry;
      }
      measure(measureName, startOrMeasureOptions, endMark) {
        let start;
        let end;
        if (typeof startOrMeasureOptions === "string") {
          start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
          end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
        } else {
          start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
          end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
        }
        const entry = new PerformanceMeasure(measureName, {
          startTime: start,
          detail: {
            start,
            end
          }
        });
        this._entries.push(entry);
        return entry;
      }
      setResourceTimingBufferSize(maxSize) {
        this._resourceTimingBufferSize = maxSize;
      }
      addEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.addEventListener");
      }
      removeEventListener(type, listener, options) {
        throw createNotImplementedError("Performance.removeEventListener");
      }
      dispatchEvent(event) {
        throw createNotImplementedError("Performance.dispatchEvent");
      }
      toJSON() {
        return this;
      }
    };
    PerformanceObserver = class {
      static {
        __name(this, "PerformanceObserver");
      }
      __unenv__ = true;
      static supportedEntryTypes = [];
      _callback = null;
      constructor(callback) {
        this._callback = callback;
      }
      takeRecords() {
        return [];
      }
      disconnect() {
        throw createNotImplementedError("PerformanceObserver.disconnect");
      }
      observe(options) {
        throw createNotImplementedError("PerformanceObserver.observe");
      }
      bind(fn) {
        return fn;
      }
      runInAsyncScope(fn, thisArg, ...args) {
        return fn.call(thisArg, ...args);
      }
      asyncId() {
        return 0;
      }
      triggerAsyncId() {
        return 0;
      }
      emitDestroy() {
        return this;
      }
    };
    performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();
  }
});

// node_modules/unenv/dist/runtime/node/perf_hooks.mjs
var init_perf_hooks = __esm({
  "node_modules/unenv/dist/runtime/node/perf_hooks.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_performance();
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
var init_performance2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs"() {
    init_perf_hooks();
    if (!("__unenv__" in performance)) {
      const proto = Performance.prototype;
      for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== "constructor" && !(key in performance)) {
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          if (desc) {
            Object.defineProperty(performance, key, desc);
          }
        }
      }
    }
    globalThis.performance = performance;
    globalThis.Performance = Performance;
    globalThis.PerformanceEntry = PerformanceEntry;
    globalThis.PerformanceMark = PerformanceMark;
    globalThis.PerformanceMeasure = PerformanceMeasure;
    globalThis.PerformanceObserver = PerformanceObserver;
    globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
    globalThis.PerformanceResourceTiming = PerformanceResourceTiming;
  }
});

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default;
var init_noop = __esm({
  "node_modules/unenv/dist/runtime/mock/noop.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    noop_default = Object.assign(() => {
    }, { __unenv__: true });
  }
});

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";
var _console, _ignoreErrors, _stderr, _stdout, log, info, trace, debug, table, error, warn, createTask, clear, count, countReset, dir, dirxml, group, groupEnd, groupCollapsed, profile, profileEnd, time, timeEnd, timeLog, timeStamp, Console, _times, _stdoutErrorHandler, _stderrErrorHandler;
var init_console = __esm({
  "node_modules/unenv/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_noop();
    init_utils();
    _console = globalThis.console;
    _ignoreErrors = true;
    _stderr = new Writable();
    _stdout = new Writable();
    log = _console?.log ?? noop_default;
    info = _console?.info ?? log;
    trace = _console?.trace ?? info;
    debug = _console?.debug ?? log;
    table = _console?.table ?? log;
    error = _console?.error ?? log;
    warn = _console?.warn ?? error;
    createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
    clear = _console?.clear ?? noop_default;
    count = _console?.count ?? noop_default;
    countReset = _console?.countReset ?? noop_default;
    dir = _console?.dir ?? noop_default;
    dirxml = _console?.dirxml ?? noop_default;
    group = _console?.group ?? noop_default;
    groupEnd = _console?.groupEnd ?? noop_default;
    groupCollapsed = _console?.groupCollapsed ?? noop_default;
    profile = _console?.profile ?? noop_default;
    profileEnd = _console?.profileEnd ?? noop_default;
    time = _console?.time ?? noop_default;
    timeEnd = _console?.timeEnd ?? noop_default;
    timeLog = _console?.timeLog ?? noop_default;
    timeStamp = _console?.timeStamp ?? noop_default;
    Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
    _times = /* @__PURE__ */ new Map();
    _stdoutErrorHandler = noop_default;
    _stderrErrorHandler = noop_default;
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole, assert, clear2, context, count2, countReset2, createTask2, debug2, dir2, dirxml2, error2, group2, groupCollapsed2, groupEnd2, info2, log2, profile2, profileEnd2, table2, time2, timeEnd2, timeLog2, timeStamp2, trace2, warn2, console_default;
var init_console2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_console();
    workerdConsole = globalThis["console"];
    ({
      assert,
      clear: clear2,
      context: (
        // @ts-expect-error undocumented public API
        context
      ),
      count: count2,
      countReset: countReset2,
      createTask: (
        // @ts-expect-error undocumented public API
        createTask2
      ),
      debug: debug2,
      dir: dir2,
      dirxml: dirxml2,
      error: error2,
      group: group2,
      groupCollapsed: groupCollapsed2,
      groupEnd: groupEnd2,
      info: info2,
      log: log2,
      profile: profile2,
      profileEnd: profileEnd2,
      table: table2,
      time: time2,
      timeEnd: timeEnd2,
      timeLog: timeLog2,
      timeStamp: timeStamp2,
      trace: trace2,
      warn: warn2
    } = workerdConsole);
    Object.assign(workerdConsole, {
      Console,
      _ignoreErrors,
      _stderr,
      _stderrErrorHandler,
      _stdout,
      _stdoutErrorHandler,
      _times
    });
    console_default = workerdConsole;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console"() {
    init_console2();
    globalThis.console = console_default;
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime;
var init_hrtime = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
      const now = Date.now();
      const seconds = Math.trunc(now / 1e3);
      const nanos = now % 1e3 * 1e6;
      if (startTime) {
        let diffSeconds = seconds - startTime[0];
        let diffNanos = nanos - startTime[0];
        if (diffNanos < 0) {
          diffSeconds = diffSeconds - 1;
          diffNanos = 1e9 + diffNanos;
        }
        return [diffSeconds, diffNanos];
      }
      return [seconds, nanos];
    }, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
      return BigInt(Date.now() * 1e6);
    }, "bigint") });
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream;
var init_read_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    ReadStream = class {
      static {
        __name(this, "ReadStream");
      }
      fd;
      isRaw = false;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      setRawMode(mode) {
        this.isRaw = mode;
        return this;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream;
var init_write_stream = __esm({
  "node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    WriteStream = class {
      static {
        __name(this, "WriteStream");
      }
      fd;
      columns = 80;
      rows = 24;
      isTTY = false;
      constructor(fd) {
        this.fd = fd;
      }
      clearLine(dir3, callback) {
        callback && callback();
        return false;
      }
      clearScreenDown(callback) {
        callback && callback();
        return false;
      }
      cursorTo(x, y, callback) {
        callback && typeof callback === "function" && callback();
        return false;
      }
      moveCursor(dx, dy, callback) {
        callback && callback();
        return false;
      }
      getColorDepth(env2) {
        return 1;
      }
      hasColors(count3, env2) {
        return false;
      }
      getWindowSize() {
        return [this.columns, this.rows];
      }
      write(str, encoding, cb) {
        if (str instanceof Uint8Array) {
          str = new TextDecoder().decode(str);
        }
        try {
          console.log(str);
        } catch {
        }
        cb && typeof cb === "function" && cb();
        return false;
      }
    };
  }
});

// node_modules/unenv/dist/runtime/node/tty.mjs
var isatty, tty_default;
var init_tty = __esm({
  "node_modules/unenv/dist/runtime/node/tty.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_read_stream();
    init_write_stream();
    init_read_stream();
    init_write_stream();
    isatty = /* @__PURE__ */ __name(function() {
      return false;
    }, "isatty");
    tty_default = {
      ReadStream,
      WriteStream,
      isatty
    };
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION;
var init_node_version = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    NODE_VERSION = "22.14.0";
  }
});

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";
var Process;
var init_process = __esm({
  "node_modules/unenv/dist/runtime/node/internal/process/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    init_utils();
    init_node_version();
    Process = class _Process extends EventEmitter {
      static {
        __name(this, "Process");
      }
      env;
      hrtime;
      nextTick;
      constructor(impl) {
        super();
        this.env = impl.env;
        this.hrtime = impl.hrtime;
        this.nextTick = impl.nextTick;
        for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
          const value = this[prop];
          if (typeof value === "function") {
            this[prop] = value.bind(this);
          }
        }
      }
      // --- event emitter ---
      emitWarning(warning, type, code) {
        console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
      }
      emit(...args) {
        return super.emit(...args);
      }
      listeners(eventName) {
        return super.listeners(eventName);
      }
      // --- stdio (lazy initializers) ---
      #stdin;
      #stdout;
      #stderr;
      get stdin() {
        return this.#stdin ??= new ReadStream(0);
      }
      get stdout() {
        return this.#stdout ??= new WriteStream(1);
      }
      get stderr() {
        return this.#stderr ??= new WriteStream(2);
      }
      // --- cwd ---
      #cwd = "/";
      chdir(cwd2) {
        this.#cwd = cwd2;
      }
      cwd() {
        return this.#cwd;
      }
      // --- dummy props and getters ---
      arch = "";
      platform = "";
      argv = [];
      argv0 = "";
      execArgv = [];
      execPath = "";
      title = "";
      pid = 200;
      ppid = 100;
      get version() {
        return `v${NODE_VERSION}`;
      }
      get versions() {
        return { node: NODE_VERSION };
      }
      get allowedNodeEnvironmentFlags() {
        return /* @__PURE__ */ new Set();
      }
      get sourceMapsEnabled() {
        return false;
      }
      get debugPort() {
        return 0;
      }
      get throwDeprecation() {
        return false;
      }
      get traceDeprecation() {
        return false;
      }
      get features() {
        return {};
      }
      get release() {
        return {};
      }
      get connected() {
        return false;
      }
      get config() {
        return {};
      }
      get moduleLoadList() {
        return [];
      }
      constrainedMemory() {
        return 0;
      }
      availableMemory() {
        return 0;
      }
      uptime() {
        return 0;
      }
      resourceUsage() {
        return {};
      }
      // --- noop methods ---
      ref() {
      }
      unref() {
      }
      // --- unimplemented methods ---
      umask() {
        throw createNotImplementedError("process.umask");
      }
      getBuiltinModule() {
        return void 0;
      }
      getActiveResourcesInfo() {
        throw createNotImplementedError("process.getActiveResourcesInfo");
      }
      exit() {
        throw createNotImplementedError("process.exit");
      }
      reallyExit() {
        throw createNotImplementedError("process.reallyExit");
      }
      kill() {
        throw createNotImplementedError("process.kill");
      }
      abort() {
        throw createNotImplementedError("process.abort");
      }
      dlopen() {
        throw createNotImplementedError("process.dlopen");
      }
      setSourceMapsEnabled() {
        throw createNotImplementedError("process.setSourceMapsEnabled");
      }
      loadEnvFile() {
        throw createNotImplementedError("process.loadEnvFile");
      }
      disconnect() {
        throw createNotImplementedError("process.disconnect");
      }
      cpuUsage() {
        throw createNotImplementedError("process.cpuUsage");
      }
      setUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
      }
      hasUncaughtExceptionCaptureCallback() {
        throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
      }
      initgroups() {
        throw createNotImplementedError("process.initgroups");
      }
      openStdin() {
        throw createNotImplementedError("process.openStdin");
      }
      assert() {
        throw createNotImplementedError("process.assert");
      }
      binding() {
        throw createNotImplementedError("process.binding");
      }
      // --- attached interfaces ---
      permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
      report = {
        directory: "",
        filename: "",
        signal: "SIGUSR2",
        compact: false,
        reportOnFatalError: false,
        reportOnSignal: false,
        reportOnUncaughtException: false,
        getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
        writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
      };
      finalization = {
        register: /* @__PURE__ */ notImplemented("process.finalization.register"),
        unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
        registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
      };
      memoryUsage = Object.assign(() => ({
        arrayBuffers: 0,
        rss: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0
      }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
      // --- undefined props ---
      mainModule = void 0;
      domain = void 0;
      // optional
      send = void 0;
      exitCode = void 0;
      channel = void 0;
      getegid = void 0;
      geteuid = void 0;
      getgid = void 0;
      getgroups = void 0;
      getuid = void 0;
      setegid = void 0;
      seteuid = void 0;
      setgid = void 0;
      setgroups = void 0;
      setuid = void 0;
      // internals
      _events = void 0;
      _eventsCount = void 0;
      _exiting = void 0;
      _maxListeners = void 0;
      _debugEnd = void 0;
      _debugProcess = void 0;
      _fatalException = void 0;
      _getActiveHandles = void 0;
      _getActiveRequests = void 0;
      _kill = void 0;
      _preload_modules = void 0;
      _rawDebug = void 0;
      _startProfilerIdleNotifier = void 0;
      _stopProfilerIdleNotifier = void 0;
      _tickCallback = void 0;
      _disconnect = void 0;
      _handleQueue = void 0;
      _pendingMessage = void 0;
      _channel = void 0;
      _send = void 0;
      _linkedBinding = void 0;
    };
  }
});

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess, getBuiltinModule, workerdProcess, unenvProcess, exit, features, platform, _channel, _debugEnd, _debugProcess, _disconnect, _events, _eventsCount, _exiting, _fatalException, _getActiveHandles, _getActiveRequests, _handleQueue, _kill, _linkedBinding, _maxListeners, _pendingMessage, _preload_modules, _rawDebug, _send, _startProfilerIdleNotifier, _stopProfilerIdleNotifier, _tickCallback, abort, addListener, allowedNodeEnvironmentFlags, arch, argv, argv0, assert2, availableMemory, binding, channel, chdir, config, connected, constrainedMemory, cpuUsage, cwd, debugPort, disconnect, dlopen, domain, emit, emitWarning, env, eventNames, execArgv, execPath, exitCode, finalization, getActiveResourcesInfo, getegid, geteuid, getgid, getgroups, getMaxListeners, getuid, hasUncaughtExceptionCaptureCallback, hrtime3, initgroups, kill, listenerCount, listeners, loadEnvFile, mainModule, memoryUsage, moduleLoadList, nextTick, off, on, once, openStdin, permission, pid, ppid, prependListener, prependOnceListener, rawListeners, reallyExit, ref, release, removeAllListeners, removeListener, report, resourceUsage, send, setegid, seteuid, setgid, setgroups, setMaxListeners, setSourceMapsEnabled, setuid, setUncaughtExceptionCaptureCallback, sourceMapsEnabled, stderr, stdin, stdout, throwDeprecation, title, traceDeprecation, umask, unref, uptime, version, versions, _process, process_default;
var init_process2 = __esm({
  "node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_hrtime();
    init_process();
    globalProcess = globalThis["process"];
    getBuiltinModule = globalProcess.getBuiltinModule;
    workerdProcess = getBuiltinModule("node:process");
    unenvProcess = new Process({
      env: globalProcess.env,
      hrtime,
      // `nextTick` is available from workerd process v1
      nextTick: workerdProcess.nextTick
    });
    ({ exit, features, platform } = workerdProcess);
    ({
      _channel,
      _debugEnd,
      _debugProcess,
      _disconnect,
      _events,
      _eventsCount,
      _exiting,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _handleQueue,
      _kill,
      _linkedBinding,
      _maxListeners,
      _pendingMessage,
      _preload_modules,
      _rawDebug,
      _send,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      arch,
      argv,
      argv0,
      assert: assert2,
      availableMemory,
      binding,
      channel,
      chdir,
      config,
      connected,
      constrainedMemory,
      cpuUsage,
      cwd,
      debugPort,
      disconnect,
      dlopen,
      domain,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exitCode,
      finalization,
      getActiveResourcesInfo,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getMaxListeners,
      getuid,
      hasUncaughtExceptionCaptureCallback,
      hrtime: hrtime3,
      initgroups,
      kill,
      listenerCount,
      listeners,
      loadEnvFile,
      mainModule,
      memoryUsage,
      moduleLoadList,
      nextTick,
      off,
      on,
      once,
      openStdin,
      permission,
      pid,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      reallyExit,
      ref,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      send,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setMaxListeners,
      setSourceMapsEnabled,
      setuid,
      setUncaughtExceptionCaptureCallback,
      sourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      throwDeprecation,
      title,
      traceDeprecation,
      umask,
      unref,
      uptime,
      version,
      versions
    } = unenvProcess);
    _process = {
      abort,
      addListener,
      allowedNodeEnvironmentFlags,
      hasUncaughtExceptionCaptureCallback,
      setUncaughtExceptionCaptureCallback,
      loadEnvFile,
      sourceMapsEnabled,
      arch,
      argv,
      argv0,
      chdir,
      config,
      connected,
      constrainedMemory,
      availableMemory,
      cpuUsage,
      cwd,
      debugPort,
      dlopen,
      disconnect,
      emit,
      emitWarning,
      env,
      eventNames,
      execArgv,
      execPath,
      exit,
      finalization,
      features,
      getBuiltinModule,
      getActiveResourcesInfo,
      getMaxListeners,
      hrtime: hrtime3,
      kill,
      listeners,
      listenerCount,
      memoryUsage,
      nextTick,
      on,
      off,
      once,
      pid,
      platform,
      ppid,
      prependListener,
      prependOnceListener,
      rawListeners,
      release,
      removeAllListeners,
      removeListener,
      report,
      resourceUsage,
      setMaxListeners,
      setSourceMapsEnabled,
      stderr,
      stdin,
      stdout,
      title,
      throwDeprecation,
      traceDeprecation,
      umask,
      uptime,
      version,
      versions,
      // @ts-expect-error old API
      domain,
      initgroups,
      moduleLoadList,
      reallyExit,
      openStdin,
      assert: assert2,
      binding,
      send,
      exitCode,
      channel,
      getegid,
      geteuid,
      getgid,
      getgroups,
      getuid,
      setegid,
      seteuid,
      setgid,
      setgroups,
      setuid,
      permission,
      mainModule,
      _events,
      _eventsCount,
      _exiting,
      _maxListeners,
      _debugEnd,
      _debugProcess,
      _fatalException,
      _getActiveHandles,
      _getActiveRequests,
      _kill,
      _preload_modules,
      _rawDebug,
      _startProfilerIdleNotifier,
      _stopProfilerIdleNotifier,
      _tickCallback,
      _disconnect,
      _handleQueue,
      _pendingMessage,
      _channel,
      _send,
      _linkedBinding
    };
    process_default = _process;
  }
});

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
var init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process = __esm({
  "node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process"() {
    init_process2();
    globalThis.process = process_default;
  }
});

// services/larkDirectApi.js
var require_larkDirectApi = __commonJS({
  "services/larkDirectApi.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var LarkDirectApi2 = class {
      static {
        __name(this, "LarkDirectApi");
      }
      constructor(appId, appSecret, baseToken) {
        this.appId = appId || process.env.LARK_APP_ID || "cli_aa9a88a6e7f89ed2";
        this.appSecret = appSecret || process.env.LARK_APP_SECRET || "qmzk77vbQMpFtUP66JRr1ebJPyqHooD5";
        this.baseToken = baseToken || process.env.BASE_TOKEN || "G2IgbTgmmaLnQPs3LPblGz0ngQf";
        this.cachedToken = null;
        this.tokenExpiry = 0;
      }
      async getTenantAccessToken() {
        const now = Date.now();
        if (this.cachedToken && this.tokenExpiry > now + 6e4) {
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
        this.tokenExpiry = now + data.expire * 1e3;
        return this.cachedToken;
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
            const mapped = data.data.items.map((item) => ({
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
      async batchCreateRecords(tableId, records) {
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
          return data.data.users.map((u) => ({
            id: u.open_id,
            name: u.name,
            email: u.email || "",
            department: u.department_ids ? u.department_ids.join(", ") : ""
          }));
        }
        return [];
      }
    };
    module.exports = LarkDirectApi2;
  }
});

// node-built-in-modules:node:crypto
import libDefault from "node:crypto";
var require_node_crypto = __commonJS({
  "node-built-in-modules:node:crypto"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault;
  }
});

// node-built-in-modules:node:net
import libDefault2 from "node:net";
var require_node_net = __commonJS({
  "node-built-in-modules:node:net"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault2;
  }
});

// node_modules/ip-address/dist/address-error.js
var require_address_error = __commonJS({
  "node_modules/ip-address/dist/address-error.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AddressError = void 0;
    var AddressError = class extends Error {
      static {
        __name(this, "AddressError");
      }
      constructor(message, parseMessage) {
        super(message);
        this.name = "AddressError";
        this.parseMessage = parseMessage;
      }
    };
    exports.AddressError = AddressError;
  }
});

// node_modules/ip-address/dist/common.js
var require_common = __commonJS({
  "node_modules/ip-address/dist/common.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isInSubnet = isInSubnet;
    exports.isHostInSubnet = isHostInSubnet;
    exports.isCorrect = isCorrect;
    exports.prefixLengthFromMask = prefixLengthFromMask;
    exports.assertByteArray = assertByteArray;
    exports.numberToPaddedHex = numberToPaddedHex;
    exports.stringToPaddedHex = stringToPaddedHex;
    exports.testBit = testBit;
    var address_error_1 = require_address_error();
    function isInSubnet(address) {
      if (this.subnetMask < address.subnetMask) {
        return false;
      }
      return isHostInSubnet.call(this, address);
    }
    __name(isInSubnet, "isInSubnet");
    function isHostInSubnet(address) {
      return this.mask(address.subnetMask) === address.mask();
    }
    __name(isHostInSubnet, "isHostInSubnet");
    function isCorrect(defaultBits) {
      return /* @__PURE__ */ __name(function isCorrectForm() {
        if (this.addressMinusSuffix !== this.correctForm()) {
          return false;
        }
        if (this.subnetMask === defaultBits && !this.parsedSubnet) {
          return true;
        }
        return this.parsedSubnet === String(this.subnetMask);
      }, "isCorrectForm");
    }
    __name(isCorrect, "isCorrect");
    function prefixLengthFromMask(value, totalBits) {
      const binary = value.toString(2).padStart(totalBits, "0");
      if (binary.length > totalBits) {
        throw new address_error_1.AddressError("Invalid subnet mask.");
      }
      const firstZero = binary.indexOf("0");
      if (firstZero === -1) {
        return totalBits;
      }
      if (binary.slice(firstZero).includes("1")) {
        throw new address_error_1.AddressError("Invalid subnet mask.");
      }
      return firstZero;
    }
    __name(prefixLengthFromMask, "prefixLengthFromMask");
    function assertByteArray(bytes, byteCount, family, minimum) {
      if (bytes.length !== byteCount) {
        throw new address_error_1.AddressError(`${family} addresses require exactly ${byteCount} bytes`);
      }
      for (let i = 0; i < bytes.length; i++) {
        if (!Number.isInteger(bytes[i]) || bytes[i] < minimum || bytes[i] > 255) {
          throw new address_error_1.AddressError(`All bytes must be integers between ${minimum} and 255`);
        }
      }
    }
    __name(assertByteArray, "assertByteArray");
    function numberToPaddedHex(number) {
      return number.toString(16).padStart(2, "0");
    }
    __name(numberToPaddedHex, "numberToPaddedHex");
    function stringToPaddedHex(numberString) {
      return numberToPaddedHex(parseInt(numberString, 10));
    }
    __name(stringToPaddedHex, "stringToPaddedHex");
    function testBit(binaryValue, position) {
      const { length } = binaryValue;
      if (position > length) {
        return false;
      }
      const positionInString = length - position;
      return binaryValue.substring(positionInString, positionInString + 1) === "1";
    }
    __name(testBit, "testBit");
  }
});

// node_modules/ip-address/dist/v4/constants.js
var require_constants = __commonJS({
  "node_modules/ip-address/dist/v4/constants.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RE_SUBNET_STRING = exports.RE_ADDRESS = exports.GROUPS = exports.BITS = void 0;
    exports.BITS = 32;
    exports.GROUPS = 4;
    exports.RE_ADDRESS = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/g;
    exports.RE_SUBNET_STRING = /\/\d{1,2}$/;
  }
});

// node_modules/ip-address/dist/ipv4.js
var require_ipv4 = __commonJS({
  "node_modules/ip-address/dist/ipv4.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Address4 = void 0;
    var common = __importStar(require_common());
    var constants = __importStar(require_constants());
    var address_error_1 = require_address_error();
    var isCorrect4 = common.isCorrect(constants.BITS);
    var Address4 = class _Address4 {
      static {
        __name(this, "Address4");
      }
      constructor(address) {
        this.addressMinusSuffix = "";
        this.groups = constants.GROUPS;
        this.parsedAddress = [];
        this.parsedSubnet = "";
        this.subnet = "/32";
        this.subnetMask = 32;
        this.v4 = true;
        this.isCorrect = isCorrect4;
        this.isInSubnet = common.isInSubnet;
        this.isHostInSubnet = common.isHostInSubnet;
        this.address = address;
        const subnet = constants.RE_SUBNET_STRING.exec(address);
        if (subnet) {
          this.parsedSubnet = subnet[0].replace("/", "");
          this.subnetMask = parseInt(this.parsedSubnet, 10);
          this.subnet = `/${this.subnetMask}`;
          if (this.subnetMask < 0 || this.subnetMask > constants.BITS) {
            throw new address_error_1.AddressError("Invalid subnet mask.");
          }
          address = address.replace(constants.RE_SUBNET_STRING, "");
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(address);
      }
      /**
       * Returns true if the given string is a valid IPv4 address (with optional
       * CIDR subnet), false otherwise. Host bits in the subnet portion are
       * allowed (e.g. `192.168.1.5/24` is valid); for strict network-address
       * validation compare `correctForm()` to `startAddress().correctForm()`,
       * or use `networkForm()`.
       */
      static isValid(address) {
        try {
          new _Address4(address);
          return true;
        } catch {
          return false;
        }
      }
      /**
       * Parses an IPv4 address string into its four octet groups and stores the
       * result on `this.parsedAddress`. Called automatically by the constructor;
       * you typically don't need to call it directly. Throws `AddressError` if
       * the input is not a valid IPv4 address.
       */
      parse(address) {
        const groups = address.split(".");
        if (groups.some((group3) => /^0\d/.test(group3))) {
          throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.");
        }
        if (!address.match(constants.RE_ADDRESS)) {
          throw new address_error_1.AddressError("Invalid IPv4 address.");
        }
        return groups;
      }
      /**
       * Returns the address in correct form: octets joined with `.` and any
       * leading zeros stripped (e.g. `192.168.1.1`). For IPv4 this matches the
       * canonical dotted-decimal representation.
       */
      correctForm() {
        return this.parsedAddress.map((part) => parseInt(part, 10)).join(".");
      }
      /**
       * Construct an `Address4` from an address and a dotted-decimal subnet
       * mask given as separate strings (e.g. as returned by Node's
       * `os.networkInterfaces()`). Throws `AddressError` if the mask is
       * non-contiguous (e.g. `255.0.255.0`).
       * @example
       * var address = Address4.fromAddressAndMask('192.168.1.1', '255.255.255.0');
       * address.subnetMask; // 24
       */
      static fromAddressAndMask(address, mask) {
        const bits = common.prefixLengthFromMask(new _Address4(mask).bigInt(), constants.BITS);
        return new _Address4(`${address}/${bits}`);
      }
      /**
       * Construct an `Address4` from an address and a Cisco-style wildcard mask
       * given as separate strings (e.g. `0.0.0.255` for a `/24`). The wildcard
       * mask is the bitwise inverse of the subnet mask. Throws `AddressError`
       * if the mask is non-contiguous (e.g. `0.255.0.255`).
       * @example
       * var address = Address4.fromAddressAndWildcardMask('10.0.0.1', '0.0.0.255');
       * address.subnetMask; // 24
       */
      static fromAddressAndWildcardMask(address, wildcardMask) {
        const wildcard = new _Address4(wildcardMask).bigInt();
        const allOnes = (BigInt(1) << BigInt(constants.BITS)) - BigInt(1);
        const mask = wildcard ^ allOnes;
        const bits = common.prefixLengthFromMask(mask, constants.BITS);
        return new _Address4(`${address}/${bits}`);
      }
      /**
       * Construct an `Address4` from a wildcard pattern with trailing `*`
       * octets. The number of trailing wildcards determines the prefix
       * length: each `*` represents 8 bits.
       *
       * Only trailing whole-octet wildcards are supported. Partial-octet
       * wildcards (e.g. `192.168.0.1*`) and interior wildcards (e.g.
       * `192.*.0.1`) throw `AddressError`.
       * @example
       * Address4.fromWildcard('192.168.0.*').subnet;   // '/24'
       * Address4.fromWildcard('192.168.*.*').subnet;   // '/16'
       * Address4.fromWildcard('*.*.*.*').subnet;       // '/0'
       */
      static fromWildcard(input) {
        const groups = input.split(".");
        if (groups.length !== constants.GROUPS) {
          throw new address_error_1.AddressError("Wildcard pattern must have 4 octets");
        }
        let firstWildcard = -1;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i] === "*") {
            if (firstWildcard === -1) {
              firstWildcard = i;
            }
          } else if (firstWildcard !== -1) {
            throw new address_error_1.AddressError("Wildcard `*` must only appear in trailing octets (e.g. `192.168.0.*`)");
          }
        }
        const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
        const replaced = groups.map((g) => g === "*" ? "0" : g);
        const subnetBits = constants.BITS - trailing * 8;
        return new _Address4(`${replaced.join(".")}/${subnetBits}`);
      }
      /**
       * Converts a hex string to an IPv4 address object. Accepts 8 hex digits
       * with optional `:` separators (e.g. `'7f000001'` or `'7f:00:00:01'`).
       * Throws `AddressError` for any other length or for non-hex characters.
       * @param {string} hex - a hex string to convert
       * @returns {Address4}
       */
      static fromHex(hex) {
        const stripped = hex.replace(/:/g, "");
        if (!/^[0-9a-fA-F]{8}$/.test(stripped)) {
          throw new address_error_1.AddressError("IPv4 hex must be exactly 8 hex digits");
        }
        const groups = [];
        for (let i = 0; i < 8; i += 2) {
          groups.push(parseInt(stripped.slice(i, i + 2), 16));
        }
        return new _Address4(groups.join("."));
      }
      /**
       * Converts an integer into a IPv4 address object. The integer must be a
       * non-negative safe integer in the range `[0, 2**32 - 1]`; otherwise
       * `AddressError` is thrown.
       * @param {integer} integer - a number to convert
       * @returns {Address4}
       */
      static fromInteger(integer) {
        if (!Number.isInteger(integer) || integer < 0 || integer > 4294967295) {
          throw new address_error_1.AddressError("IPv4 integer must be in the range 0 to 2**32 - 1");
        }
        return _Address4.fromHex(integer.toString(16).padStart(8, "0"));
      }
      /**
       * Return an address from in-addr.arpa form
       * @param {string} arpaFormAddress - an 'in-addr.arpa' form ipv4 address
       * @returns {Adress4}
       * @example
       * var address = Address4.fromArpa(42.2.0.192.in-addr.arpa.)
       * address.correctForm(); // '192.0.2.42'
       */
      static fromArpa(arpaFormAddress) {
        const leader = arpaFormAddress.replace(/(\.in-addr\.arpa)?\.$/, "");
        const address = leader.split(".").reverse().join(".");
        return new _Address4(address);
      }
      /**
       * Converts an IPv4 address object to a hex string
       * @returns {String}
       */
      toHex() {
        return this.parsedAddress.map((part) => common.stringToPaddedHex(part)).join(":");
      }
      /**
       * Converts an IPv4 address object to an array of bytes.
       *
       * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toArray())`.
       * @returns {Array}
       */
      toArray() {
        return this.parsedAddress.map((part) => parseInt(part, 10));
      }
      /**
       * Converts an IPv4 address object to an IPv6 address group
       * @returns {String}
       */
      toGroup6() {
        const output = [];
        let i;
        for (i = 0; i < constants.GROUPS; i += 2) {
          output.push(`${common.stringToPaddedHex(this.parsedAddress[i])}${common.stringToPaddedHex(this.parsedAddress[i + 1])}`);
        }
        return output.join(":");
      }
      /**
       * Returns the address as a `bigint`
       * @returns {bigint}
       */
      bigInt() {
        return BigInt(`0x${this.parsedAddress.map((n) => common.stringToPaddedHex(n)).join("")}`);
      }
      /**
       * Helper function getting start address.
       * @returns {bigint}
       */
      _startAddress() {
        return BigInt(`0b${this.mask() + "0".repeat(constants.BITS - this.subnetMask)}`);
      }
      /**
       * The first address in the range given by this address' subnet.
       * Often referred to as the Network Address.
       * @returns {Address4}
       */
      startAddress() {
        return _Address4.fromBigInt(this._startAddress());
      }
      /**
       * The first host address in the range given by this address's subnet ie
       * the first address after the Network Address
       * @returns {Address4}
       */
      startAddressExclusive() {
        const adjust = BigInt("1");
        return _Address4.fromBigInt(this._startAddress() + adjust);
      }
      /**
       * Helper function getting end address.
       * @returns {bigint}
       */
      _endAddress() {
        return BigInt(`0b${this.mask() + "1".repeat(constants.BITS - this.subnetMask)}`);
      }
      /**
       * The last address in the range given by this address' subnet
       * Often referred to as the Broadcast
       * @returns {Address4}
       */
      endAddress() {
        return _Address4.fromBigInt(this._endAddress());
      }
      /**
       * The last host address in the range given by this address's subnet ie
       * the last address prior to the Broadcast Address
       * @returns {Address4}
       */
      endAddressExclusive() {
        const adjust = BigInt("1");
        return _Address4.fromBigInt(this._endAddress() - adjust);
      }
      /**
       * The dotted-decimal form of the subnet mask, e.g. `255.255.240.0` for
       * a `/20`. Returns an `Address4`; call `.correctForm()` for the string.
       * @returns {Address4}
       */
      subnetMaskAddress() {
        return _Address4.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants.BITS - this.subnetMask)}`));
      }
      /**
       * The Cisco-style wildcard mask, e.g. `0.0.0.255` for a `/24`. This is
       * the bitwise inverse of `subnetMaskAddress()`. Returns an `Address4`;
       * call `.correctForm()` for the string.
       * @returns {Address4}
       */
      wildcardMask() {
        return _Address4.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants.BITS - this.subnetMask)}`));
      }
      /**
       * The network address in CIDR string form, e.g. `192.168.1.0/24` for
       * `192.168.1.5/24`. For an address with no explicit subnet the prefix is
       * `/32`, e.g. `networkForm()` on `192.168.1.5` returns `192.168.1.5/32`.
       * @returns {string}
       */
      networkForm() {
        return `${this.startAddress().correctForm()}/${this.subnetMask}`;
      }
      /**
       * Converts a BigInt to a v4 address object. The value must be in the
       * range `[0, 2**32 - 1]`; otherwise `AddressError` is thrown.
       * @param {bigint} bigInt - a BigInt to convert
       * @returns {Address4}
       */
      static fromBigInt(bigInt) {
        if (bigInt < BigInt(0) || bigInt > BigInt(4294967295)) {
          throw new address_error_1.AddressError("IPv4 BigInt must be in the range 0 to 2**32 - 1");
        }
        return _Address4.fromHex(bigInt.toString(16).padStart(8, "0"));
      }
      /**
       * Convert a byte array to an Address4 object. Throws `AddressError` unless
       * given exactly 4 integers from 0 to 255. Signed bytes are rejected, so
       * this differs from `Address6.fromByteArray`, which folds them; the two
       * contracts converge on this stricter form in the next major version.
       *
       * To convert from a Node.js `Buffer`, spread it: `Address4.fromByteArray([...buf])`.
       * @param {Array<number>} bytes - an array of 4 bytes (0-255)
       * @returns {Address4}
       */
      static fromByteArray(bytes) {
        common.assertByteArray(bytes, 4, "IPv4", 0);
        return this.fromUnsignedByteArray(bytes);
      }
      /**
       * Convert an unsigned byte array to an Address4 object. Throws
       * `AddressError` unless given exactly 4 bytes, and rejects values outside
       * 0 to 255 when parsing the resulting address.
       *
       * To convert from a Node.js `Buffer`, spread it:
       * `Address4.fromUnsignedByteArray([...buf])`.
       * @param {Array<number>} bytes - an array of 4 unsigned bytes (0-255)
       * @returns {Address4}
       */
      static fromUnsignedByteArray(bytes) {
        if (bytes.length !== 4) {
          throw new address_error_1.AddressError("IPv4 addresses require exactly 4 bytes");
        }
        const address = bytes.join(".");
        return new _Address4(address);
      }
      /**
       * Returns the first n bits of the address, defaulting to the
       * subnet mask
       * @returns {String}
       */
      mask(mask) {
        if (mask === void 0) {
          mask = this.subnetMask;
        }
        return this.getBitsBase2(0, mask);
      }
      /**
       * Returns the bits in the given range as a base-2 string
       * @returns {string}
       */
      getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
      }
      /**
       * Return the reversed in-addr.arpa form of the address, e.g.
       * `42.2.0.192.in-addr.arpa.` for `192.0.2.42`.
       * @param {Object} options
       * @param {boolean} options.omitSuffix - omit the "in-addr.arpa" suffix
       * @returns {String}
       */
      reverseForm(options) {
        if (!options) {
          options = {};
        }
        const reversed = this.correctForm().split(".").reverse().join(".");
        if (options.omitSuffix) {
          return reversed;
        }
        return `${reversed}.in-addr.arpa.`;
      }
      /**
       * Returns true if the given address is a multicast address
       * @returns {boolean}
       */
      isMulticast() {
        return this.isHostInSubnet(MULTICAST_V4);
      }
      /**
       * Returns true if the address is in one of the [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private address ranges (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
       * @returns {boolean}
       */
      isPrivate() {
        return PRIVATE_V4.some((subnet) => this.isHostInSubnet(subnet));
      }
      /**
       * Returns true if the address is in the loopback range `127.0.0.0/8` ([RFC 1122](https://datatracker.ietf.org/doc/html/rfc1122)).
       * @returns {boolean}
       */
      isLoopback() {
        return this.isHostInSubnet(LOOPBACK_V4);
      }
      /**
       * Returns true if the address is in the link-local range `169.254.0.0/16` ([RFC 3927](https://datatracker.ietf.org/doc/html/rfc3927)).
       * @returns {boolean}
       */
      isLinkLocal() {
        return this.isHostInSubnet(LINK_LOCAL_V4);
      }
      /**
       * Returns true if the address is the unspecified address `0.0.0.0`.
       * @returns {boolean}
       */
      isUnspecified() {
        return this.isHostInSubnet(UNSPECIFIED_V4);
      }
      /**
       * Returns true if the address is the limited broadcast address `255.255.255.255` ([RFC 919](https://datatracker.ietf.org/doc/html/rfc919)).
       * @returns {boolean}
       */
      isBroadcast() {
        return this.isHostInSubnet(BROADCAST_V4);
      }
      /**
       * Returns true if the address is in the carrier-grade NAT range `100.64.0.0/10` ([RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598)).
       * @returns {boolean}
       */
      isCGNAT() {
        return this.isHostInSubnet(CGNAT_V4);
      }
      /**
       * Returns a zero-padded base-2 string representation of the address
       * @returns {string}
       */
      binaryZeroPad() {
        if (this._binaryZeroPad === void 0) {
          this._binaryZeroPad = this.bigInt().toString(2).padStart(constants.BITS, "0");
        }
        return this._binaryZeroPad;
      }
      /**
       * Groups an IPv4 address for inclusion at the end of an IPv6 address.
       *
       * Returns an HTML fragment: each half of the address is wrapped in a
       * `<span>` carrying the group classes an address-inspector UI hovers on.
       * The address content is HTML-escaped; anything you concatenate around it
       * is your responsibility.
       * @returns {String}
       */
      groupForV6() {
        const segments = this.parsedAddress;
        return this.correctForm().replace(constants.RE_ADDRESS, `<span class="hover-group group-v4 group-6">${segments.slice(0, 2).join(".")}</span>.<span class="hover-group group-v4 group-7">${segments.slice(2, 4).join(".")}</span>`);
      }
    };
    exports.Address4 = Address4;
    var MULTICAST_V4 = new Address4("224.0.0.0/4");
    var PRIVATE_V4 = [
      new Address4("10.0.0.0/8"),
      new Address4("172.16.0.0/12"),
      new Address4("192.168.0.0/16")
    ];
    var LOOPBACK_V4 = new Address4("127.0.0.0/8");
    var LINK_LOCAL_V4 = new Address4("169.254.0.0/16");
    var UNSPECIFIED_V4 = new Address4("0.0.0.0/32");
    var BROADCAST_V4 = new Address4("255.255.255.255/32");
    var CGNAT_V4 = new Address4("100.64.0.0/10");
  }
});

// node_modules/ip-address/dist/v6/constants.js
var require_constants2 = __commonJS({
  "node_modules/ip-address/dist/v6/constants.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RE_URL_WITH_PORT = exports.RE_URL = exports.RE_ZONE_STRING = exports.RE_SUBNET_STRING = exports.RE_BAD_ADDRESS = exports.RE_BAD_CHARACTERS = exports.TYPES = exports.SCOPES = exports.GROUPS = exports.BITS = void 0;
    exports.BITS = 128;
    exports.GROUPS = 8;
    exports.SCOPES = {
      0: "Reserved",
      1: "Interface local",
      2: "Link local",
      4: "Admin local",
      5: "Site local",
      8: "Organization local",
      14: "Global",
      15: "Reserved"
    };
    exports.TYPES = {
      "ff01::1/128": "Multicast (All nodes on this interface)",
      "ff01::2/128": "Multicast (All routers on this interface)",
      "ff02::1/128": "Multicast (All nodes on this link)",
      "ff02::2/128": "Multicast (All routers on this link)",
      "ff05::2/128": "Multicast (All routers in this site)",
      "ff02::5/128": "Multicast (OSPFv3 AllSPF routers)",
      "ff02::6/128": "Multicast (OSPFv3 AllDR routers)",
      "ff02::9/128": "Multicast (RIP routers)",
      "ff02::a/128": "Multicast (EIGRP routers)",
      "ff02::d/128": "Multicast (PIM routers)",
      "ff02::16/128": "Multicast (MLDv2 reports)",
      "ff01::fb/128": "Multicast (mDNSv6)",
      "ff02::fb/128": "Multicast (mDNSv6)",
      "ff05::fb/128": "Multicast (mDNSv6)",
      "ff02::1:2/128": "Multicast (All DHCP servers and relay agents on this link)",
      "ff05::1:2/128": "Multicast (All DHCP servers and relay agents in this site)",
      "ff02::1:3/128": "Multicast (All DHCP servers on this link)",
      "ff05::1:3/128": "Multicast (All DHCP servers in this site)",
      "::/128": "Unspecified",
      "::1/128": "Loopback",
      "::ffff:0:0/96": "IPv4-mapped",
      "ff00::/8": "Multicast",
      "fe80::/10": "Link-local unicast",
      "fc00::/7": "Unique local",
      "2002::/16": "6to4",
      "2001:db8::/32": "Documentation",
      "64:ff9b::/96": "NAT64 (well-known)",
      "64:ff9b:1::/48": "NAT64 (local-use)"
    };
    exports.RE_BAD_CHARACTERS = /([^0-9a-f:/%])/gi;
    exports.RE_BAD_ADDRESS = /([0-9a-f]{5,}|:{3,}|[^:]:$|^:[^:]|\/$)/gi;
    exports.RE_SUBNET_STRING = /\/\d{1,3}(?=%|$)/;
    exports.RE_ZONE_STRING = /%.*$/;
    exports.RE_URL = /^(?:\[([0-9a-f:.]+)\]|([0-9a-f:.]+))(?:[/?#].*)?$/i;
    exports.RE_URL_WITH_PORT = /^\[([0-9a-f:.]+)\]:([0-9]{1,5})(?:[/?#].*)?$/i;
  }
});

// node_modules/ip-address/dist/v6/helpers.js
var require_helpers = __commonJS({
  "node_modules/ip-address/dist/v6/helpers.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeHtml = escapeHtml;
    exports.spanAllZeroes = spanAllZeroes;
    exports.spanAll = spanAll;
    exports.spanLeadingZeroes = spanLeadingZeroes;
    exports.simpleGroup = simpleGroup;
    function escapeHtml(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }
    __name(escapeHtml, "escapeHtml");
    function spanAllZeroes(s) {
      return escapeHtml(s).replace(/(0+)/g, '<span class="zero">$1</span>');
    }
    __name(spanAllZeroes, "spanAllZeroes");
    function spanAll(s, offset = 0) {
      const letters = s.split("");
      return letters.map((n, i) => `<span class="digit value-${escapeHtml(n)} position-${i + offset}">${spanAllZeroes(n)}</span>`).join("");
    }
    __name(spanAll, "spanAll");
    function spanLeadingZeroesSimple(group3) {
      return escapeHtml(group3).replace(/^(0+)/, '<span class="zero">$1</span>');
    }
    __name(spanLeadingZeroesSimple, "spanLeadingZeroesSimple");
    function spanLeadingZeroes(address) {
      const groups = address.split(":");
      return groups.map((g) => spanLeadingZeroesSimple(g)).join(":");
    }
    __name(spanLeadingZeroes, "spanLeadingZeroes");
    function simpleGroup(addressString, offset = 0) {
      const groups = addressString.split(":");
      return groups.map((g, i) => {
        if (/group-v4/.test(g)) {
          return g;
        }
        return `<span class="hover-group group-${i + offset}">${spanLeadingZeroesSimple(g)}</span>`;
      });
    }
    __name(simpleGroup, "simpleGroup");
  }
});

// node_modules/ip-address/dist/v6/regular-expressions.js
var require_regular_expressions = __commonJS({
  "node_modules/ip-address/dist/v6/regular-expressions.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ADDRESS_BOUNDARY = void 0;
    exports.groupPossibilities = groupPossibilities;
    exports.padGroup = padGroup;
    exports.simpleRegularExpression = simpleRegularExpression;
    exports.possibleElisions = possibleElisions;
    var v6 = __importStar(require_constants2());
    function groupPossibilities(possibilities) {
      return `(${possibilities.join("|")})`;
    }
    __name(groupPossibilities, "groupPossibilities");
    function padGroup(group3) {
      if (group3.length < 4) {
        return `0{0,${4 - group3.length}}${group3}`;
      }
      return group3;
    }
    __name(padGroup, "padGroup");
    exports.ADDRESS_BOUNDARY = "[^A-Fa-f0-9:]";
    function simpleRegularExpression(groups) {
      const zeroIndexes = [];
      groups.forEach((group3, i) => {
        const groupInteger = parseInt(group3, 16);
        if (groupInteger === 0) {
          zeroIndexes.push(i);
        }
      });
      const possibilities = zeroIndexes.map((zeroIndex) => groups.map((group3, i) => {
        if (i === zeroIndex) {
          const elision = i === 0 || i === v6.GROUPS - 1 ? ":" : "";
          return groupPossibilities([padGroup(group3), elision]);
        }
        return padGroup(group3);
      }).join(":"));
      possibilities.push(groups.map(padGroup).join(":"));
      return groupPossibilities(possibilities);
    }
    __name(simpleRegularExpression, "simpleRegularExpression");
    function possibleElisions(elidedGroups, moreLeft, moreRight) {
      const left = moreLeft ? "" : ":";
      const right = moreRight ? "" : ":";
      const possibilities = [];
      if (!moreLeft && !moreRight) {
        possibilities.push("::");
      }
      if (moreLeft && moreRight) {
        possibilities.push("");
      }
      if (moreRight && !moreLeft || !moreRight && moreLeft) {
        possibilities.push(":");
      }
      possibilities.push(`${left}(:0{1,4}){1,${elidedGroups - 1}}`);
      possibilities.push(`(0{1,4}:){1,${elidedGroups - 1}}${right}`);
      possibilities.push(`(0{1,4}:){${elidedGroups - 1}}0{1,4}`);
      for (let groups = 1; groups < elidedGroups - 1; groups++) {
        for (let position = 1; position < elidedGroups - groups; position++) {
          possibilities.push(`(0{1,4}:){${position}}:(0{1,4}:){${elidedGroups - position - groups - 1}}0{1,4}`);
        }
      }
      return groupPossibilities(possibilities);
    }
    __name(possibleElisions, "possibleElisions");
  }
});

// node_modules/ip-address/dist/ipv6.js
var require_ipv6 = __commonJS({
  "node_modules/ip-address/dist/ipv6.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Address6 = void 0;
    var common = __importStar(require_common());
    var constants4 = __importStar(require_constants());
    var constants6 = __importStar(require_constants2());
    var helpers = __importStar(require_helpers());
    var ipv4_1 = require_ipv4();
    var regular_expressions_1 = require_regular_expressions();
    var address_error_1 = require_address_error();
    var common_1 = require_common();
    var isCorrect6 = common.isCorrect(constants6.BITS);
    function assert3(condition) {
      if (!condition) {
        throw new Error("Assertion failed.");
      }
    }
    __name(assert3, "assert");
    function addCommas(number) {
      const r = /(\d+)(\d{3})/;
      while (r.test(number)) {
        number = number.replace(r, "$1,$2");
      }
      return number;
    }
    __name(addCommas, "addCommas");
    function spanLeadingZeroes4(n) {
      n = n.replace(/^(0{1,})([1-9]+)$/, '<span class="parse-error">$1</span>$2');
      n = n.replace(/^(0{1,})(0)$/, '<span class="parse-error">$1</span>$2');
      return n;
    }
    __name(spanLeadingZeroes4, "spanLeadingZeroes4");
    function compact(address, slice) {
      const s1 = [];
      const s2 = [];
      let i;
      for (i = 0; i < address.length; i++) {
        if (i < slice[0]) {
          s1.push(address[i]);
        } else if (i > slice[1]) {
          s2.push(address[i]);
        }
      }
      return s1.concat(["compact"]).concat(s2);
    }
    __name(compact, "compact");
    function paddedHex(octet) {
      return parseInt(octet, 16).toString(16).padStart(4, "0");
    }
    __name(paddedHex, "paddedHex");
    function unsignByte(b) {
      return b & 255;
    }
    __name(unsignByte, "unsignByte");
    var Address6 = class _Address6 {
      static {
        __name(this, "Address6");
      }
      constructor(address, optionalGroups) {
        this.addressMinusSuffix = "";
        this.parsedSubnet = "";
        this.subnet = "/128";
        this.subnetMask = 128;
        this.v4 = false;
        this.zone = "";
        this.isInSubnet = common.isInSubnet;
        this.isHostInSubnet = common.isHostInSubnet;
        this.isCorrect = isCorrect6;
        if (optionalGroups === void 0) {
          this.groups = constants6.GROUPS;
        } else {
          this.groups = optionalGroups;
        }
        this.address = address;
        const subnet = constants6.RE_SUBNET_STRING.exec(address);
        if (subnet) {
          this.parsedSubnet = subnet[0].replace("/", "");
          this.subnetMask = parseInt(this.parsedSubnet, 10);
          this.subnet = `/${this.subnetMask}`;
          if (Number.isNaN(this.subnetMask) || this.subnetMask < 0 || this.subnetMask > constants6.BITS) {
            throw new address_error_1.AddressError("Invalid subnet mask.");
          }
          address = address.replace(constants6.RE_SUBNET_STRING, "");
        }
        if (/\//.test(address)) {
          throw new address_error_1.AddressError("Invalid subnet mask.");
        }
        const zone = constants6.RE_ZONE_STRING.exec(address);
        if (zone) {
          this.zone = zone[0];
          address = address.replace(constants6.RE_ZONE_STRING, "");
        }
        this.addressMinusSuffix = address;
        this.parsedAddress = this.parse(this.addressMinusSuffix);
      }
      /**
       * Returns true if the given string is a valid IPv6 address (with optional
       * CIDR subnet and zone identifier), false otherwise. Host bits in the
       * subnet portion are allowed (e.g. `2001:db8::1/32` is valid); for strict
       * network-address validation compare `correctForm()` to
       * `startAddress().correctForm()`, or use `networkForm()`.
       */
      static isValid(address) {
        try {
          new _Address6(address);
          return true;
        } catch {
          return false;
        }
      }
      /**
       * Convert a BigInt to a v6 address object. The value must be in the
       * range `[0, 2**128 - 1]`; otherwise `AddressError` is thrown.
       * @param {bigint} bigInt - a BigInt to convert
       * @returns {Address6}
       * @example
       * var bigInt = BigInt('1000000000000');
       * var address = Address6.fromBigInt(bigInt);
       * address.correctForm(); // '::e8:d4a5:1000'
       */
      static fromBigInt(bigInt) {
        if (bigInt < BigInt(0) || bigInt > (BigInt(1) << BigInt(constants6.BITS)) - BigInt(1)) {
          throw new address_error_1.AddressError("IPv6 BigInt must be in the range 0 to 2**128 - 1");
        }
        const hex = bigInt.toString(16).padStart(32, "0");
        const groups = [];
        for (let i = 0; i < constants6.GROUPS; i++) {
          groups.push(hex.slice(i * 4, (i + 1) * 4));
        }
        return new _Address6(groups.join(":"));
      }
      /**
       * Parse a URL (with optional bracketed host and port) into an address and
       * port. Returns either `{ address, port }` on success or
       * `{ error, address: null, port: null }` if the URL could not be parsed.
       * Ports are returned as numbers (or `null` if absent or out of range).
       * @example
       * var addressAndPort = Address6.fromURL('http://[ffff::]:8080/foo/');
       * addressAndPort.address.correctForm(); // 'ffff::'
       * addressAndPort.port; // 8080
       */
      static fromURL(url) {
        var _a;
        let host;
        let port = null;
        let result;
        let error3;
        const stripped = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
        if (stripped.indexOf("[") !== -1 && stripped.indexOf("]:") !== -1) {
          error3 = "failed to parse address with port";
          result = constants6.RE_URL_WITH_PORT.exec(stripped);
          if (result === null) {
            return { error: error3, address: null, port: null };
          }
          host = result[1];
          port = result[2];
        } else {
          error3 = "failed to parse address from URL";
          result = constants6.RE_URL.exec(stripped);
          if (result === null) {
            return { error: error3, address: null, port: null };
          }
          host = (_a = result[1]) !== null && _a !== void 0 ? _a : result[2];
        }
        if (port) {
          port = parseInt(port, 10);
          if (port < 0 || port > 65535) {
            port = null;
          }
        } else {
          port = null;
        }
        let address;
        try {
          address = new _Address6(host);
        } catch {
          return { error: error3, address: null, port: null };
        }
        return { address, port };
      }
      /**
       * Construct an `Address6` from an address and a hex subnet mask given as
       * separate strings (e.g. as returned by Node's `os.networkInterfaces()`).
       * Throws `AddressError` if the mask is non-contiguous (e.g.
       * `ffff::ffff`).
       * @example
       * var address = Address6.fromAddressAndMask('fe80::1', 'ffff:ffff:ffff:ffff::');
       * address.subnetMask; // 64
       */
      static fromAddressAndMask(address, mask) {
        const bits = common.prefixLengthFromMask(new _Address6(mask).bigInt(), constants6.BITS);
        return new _Address6(`${address}/${bits}`);
      }
      /**
       * Construct an `Address6` from an address and a Cisco-style wildcard mask
       * given as separate strings (e.g. `::ffff:ffff:ffff:ffff` for a `/64`).
       * The wildcard mask is the bitwise inverse of the subnet mask. Throws
       * `AddressError` if the mask is non-contiguous.
       * @example
       * var address = Address6.fromAddressAndWildcardMask('fe80::1', '::ffff:ffff:ffff:ffff');
       * address.subnetMask; // 64
       */
      static fromAddressAndWildcardMask(address, wildcardMask) {
        const wildcard = new _Address6(wildcardMask).bigInt();
        const allOnes = (BigInt(1) << BigInt(constants6.BITS)) - BigInt(1);
        const mask = wildcard ^ allOnes;
        const bits = common.prefixLengthFromMask(mask, constants6.BITS);
        return new _Address6(`${address}/${bits}`);
      }
      /**
       * Construct an `Address6` from a wildcard pattern with trailing `*`
       * groups. The number of trailing wildcards determines the prefix
       * length: each `*` represents 16 bits. `::` is expanded to zero groups
       * (not wildcards) before evaluating trailing wildcards.
       *
       * Only trailing whole-group wildcards are supported. Partial-group
       * wildcards (e.g. `2001:db8::0*`) and interior wildcards (e.g.
       * `*::1`) throw `AddressError`.
       * @example
       * Address6.fromWildcard('2001:db8:*:*:*:*:*:*').subnet;  // '/32'
       * Address6.fromWildcard('2001:db8::*').subnet;           // '/112'
       * Address6.fromWildcard('*:*:*:*:*:*:*:*').subnet;       // '/0'
       */
      static fromWildcard(input) {
        if (input.includes("%") || input.includes("/")) {
          throw new address_error_1.AddressError("Wildcard pattern must not include a zone or CIDR suffix");
        }
        const halves = input.split("::");
        if (halves.length > 2) {
          throw new address_error_1.AddressError("Wildcard pattern cannot contain more than one '::'");
        }
        let groups;
        if (halves.length === 2) {
          const left = halves[0] === "" ? [] : halves[0].split(":");
          const right = halves[1] === "" ? [] : halves[1].split(":");
          const remaining = constants6.GROUPS - left.length - right.length;
          if (remaining < 1) {
            throw new address_error_1.AddressError("Wildcard pattern with '::' has too many groups");
          }
          groups = [...left, ...new Array(remaining).fill("0"), ...right];
        } else {
          groups = input.split(":");
        }
        if (groups.length !== constants6.GROUPS) {
          throw new address_error_1.AddressError("Wildcard pattern must have 8 groups");
        }
        let firstWildcard = -1;
        for (let i = 0; i < groups.length; i++) {
          if (groups[i] === "*") {
            if (firstWildcard === -1) {
              firstWildcard = i;
            }
          } else if (firstWildcard !== -1) {
            throw new address_error_1.AddressError("Wildcard `*` must only appear in trailing groups (e.g. `2001:db8:*:*:*:*:*:*`)");
          }
        }
        const trailing = firstWildcard === -1 ? 0 : groups.length - firstWildcard;
        const replaced = groups.map((g) => g === "*" ? "0" : g);
        const subnetBits = constants6.BITS - trailing * 16;
        return new _Address6(`${replaced.join(":")}/${subnetBits}`);
      }
      /**
       * Create an IPv6-mapped address given an IPv4 address
       * @param {string} address - An IPv4 address string
       * @returns {Address6}
       * @example
       * var address = Address6.fromAddress4('192.168.0.1');
       * address.correctForm(); // '::ffff:c0a8:1'
       * address.to4in6(); // '::ffff:192.168.0.1'
       */
      static fromAddress4(address) {
        const address4 = new ipv4_1.Address4(address);
        const mask6 = constants6.BITS - (constants4.BITS - address4.subnetMask);
        return new _Address6(`::ffff:${address4.correctForm()}/${mask6}`);
      }
      /**
       * Return an address from ip6.arpa form
       * @param {string} arpaFormAddress - an 'ip6.arpa' form address
       * @returns {Adress6}
       * @example
       * var address = Address6.fromArpa(e.f.f.f.3.c.2.6.f.f.f.e.6.6.8.e.1.0.6.7.9.4.e.c.0.0.0.0.1.0.0.2.ip6.arpa.)
       * address.correctForm(); // '2001:0:ce49:7601:e866:efff:62c3:fffe'
       */
      static fromArpa(arpaFormAddress) {
        let address = arpaFormAddress.replace(/(\.ip6\.arpa)?\.$/, "");
        const semicolonAmount = 7;
        if (address.length !== 63) {
          throw new address_error_1.AddressError("Invalid 'ip6.arpa' form.");
        }
        const parts = address.split(".").reverse();
        for (let i = semicolonAmount; i > 0; i--) {
          const insertIndex = i * 4;
          parts.splice(insertIndex, 0, ":");
        }
        address = parts.join("");
        return new _Address6(address);
      }
      /**
       * Return the Microsoft UNC transcription of the address
       * @returns {String} the Microsoft UNC transcription of the address
       */
      microsoftTranscription() {
        return `${this.correctForm().replace(/:/g, "-")}.ipv6-literal.net`;
      }
      /**
       * Return the first n bits of the address, defaulting to the subnet mask
       * @param {number} [mask=subnet] - the number of bits to mask
       * @returns {String} the first n bits of the address as a string
       */
      mask(mask = this.subnetMask) {
        return this.getBitsBase2(0, mask);
      }
      /**
       * Return the number of possible subnets of a given size in the address
       * @param {number} [subnetSize=128] - the subnet size
       * @returns {String}
       */
      // TODO: probably useful to have a numeric version of this too
      possibleSubnets(subnetSize = 128) {
        const availableBits = constants6.BITS - this.subnetMask;
        const subnetBits = Math.abs(subnetSize - constants6.BITS);
        const subnetPowers = availableBits - subnetBits;
        if (subnetPowers < 0) {
          return "0";
        }
        return addCommas((BigInt("2") ** BigInt(subnetPowers)).toString(10));
      }
      /**
       * Helper function getting start address.
       * @returns {bigint}
       */
      _startAddress() {
        return BigInt(`0b${this.mask() + "0".repeat(constants6.BITS - this.subnetMask)}`);
      }
      /**
       * The first address in the range given by this address' subnet
       * Often referred to as the Network Address.
       * @returns {Address6}
       */
      startAddress() {
        return _Address6.fromBigInt(this._startAddress());
      }
      /**
       * The first host address in the range given by this address's subnet ie
       * the first address after the Network Address
       * @returns {Address6}
       */
      startAddressExclusive() {
        const adjust = BigInt("1");
        return _Address6.fromBigInt(this._startAddress() + adjust);
      }
      /**
       * Helper function getting end address.
       * @returns {bigint}
       */
      _endAddress() {
        return BigInt(`0b${this.mask() + "1".repeat(constants6.BITS - this.subnetMask)}`);
      }
      /**
       * The last address in the range given by this address' subnet
       * Often referred to as the Broadcast
       * @returns {Address6}
       */
      endAddress() {
        return _Address6.fromBigInt(this._endAddress());
      }
      /**
       * The last host address in the range given by this address's subnet ie
       * the last address prior to the Broadcast Address
       * @returns {Address6}
       */
      endAddressExclusive() {
        const adjust = BigInt("1");
        return _Address6.fromBigInt(this._endAddress() - adjust);
      }
      /**
       * The hex form of the subnet mask, e.g. `ffff:ffff:ffff:ffff::` for a
       * `/64`. Returns an `Address6`; call `.correctForm()` for the string.
       * @returns {Address6}
       */
      subnetMaskAddress() {
        return _Address6.fromBigInt(BigInt(`0b${"1".repeat(this.subnetMask)}${"0".repeat(constants6.BITS - this.subnetMask)}`));
      }
      /**
       * The Cisco-style wildcard mask, e.g. `::ffff:ffff:ffff:ffff` for a
       * `/64`. This is the bitwise inverse of `subnetMaskAddress()`. Returns
       * an `Address6`; call `.correctForm()` for the string.
       * @returns {Address6}
       */
      wildcardMask() {
        return _Address6.fromBigInt(BigInt(`0b${"0".repeat(this.subnetMask)}${"1".repeat(constants6.BITS - this.subnetMask)}`));
      }
      /**
       * The network address in CIDR string form, e.g. `2001:db8::/32` for
       * `2001:db8::1/32`. For an address with no explicit subnet the prefix
       * is `/128`, e.g. `networkForm()` on `2001:db8::1` returns
       * `2001:db8::1/128`.
       * @returns {string}
       */
      networkForm() {
        return `${this.startAddress().correctForm()}/${this.subnetMask}`;
      }
      /**
       * Return the scope of the address. The 4-bit scope field
       * ([RFC 4291 §2.7](https://datatracker.ietf.org/doc/html/rfc4291#section-2.7))
       * is only defined for multicast addresses; for unicast addresses the scope
       * is derived from the address type per
       * [RFC 4007 §6](https://datatracker.ietf.org/doc/html/rfc4007#section-6).
       * @returns {String}
       */
      getScope() {
        const type = this.getType();
        if (type === "Multicast" || type.startsWith("Multicast ")) {
          const scope = constants6.SCOPES[parseInt(this.getBits(12, 16).toString(10), 10)];
          return scope || "Unknown";
        }
        if (type === "Link-local unicast" || type === "Loopback") {
          return "Link local";
        }
        if (type === "Unspecified") {
          return "Unknown";
        }
        return "Global";
      }
      /**
       * Return the type of the address
       * @returns {String}
       */
      getType() {
        for (let i = 0; i < TYPE_SUBNETS.length; i++) {
          const entry = TYPE_SUBNETS[i];
          if (this.isHostInSubnet(entry[0])) {
            return entry[1];
          }
        }
        return "Global unicast";
      }
      /**
       * Return the bits in the given range as a BigInt
       * @returns {bigint}
       */
      getBits(start, end) {
        return BigInt(`0b${this.getBitsBase2(start, end)}`);
      }
      /**
       * Return the bits in the given range as a base-2 string
       * @returns {String}
       */
      getBitsBase2(start, end) {
        return this.binaryZeroPad().slice(start, end);
      }
      /**
       * Return the bits in the given range as a base-16 string
       * @returns {String}
       */
      getBitsBase16(start, end) {
        const length = end - start;
        if (length % 4 !== 0) {
          throw new Error("Length of bits to retrieve must be divisible by four");
        }
        return this.getBits(start, end).toString(16).padStart(length / 4, "0");
      }
      /**
       * Return the bits that are set past the subnet mask length
       * @returns {String}
       */
      getBitsPastSubnet() {
        return this.getBitsBase2(this.subnetMask, constants6.BITS);
      }
      /**
       * Return the reversed ip6.arpa form of the address
       * @param {Object} options
       * @param {boolean} options.omitSuffix - omit the "ip6.arpa" suffix
       * @returns {String}
       */
      reverseForm(options) {
        if (!options) {
          options = {};
        }
        const characters = Math.floor(this.subnetMask / 4);
        const reversed = this.canonicalForm().replace(/:/g, "").split("").slice(0, characters).reverse().join(".");
        if (characters > 0) {
          if (options.omitSuffix) {
            return reversed;
          }
          return `${reversed}.ip6.arpa.`;
        }
        if (options.omitSuffix) {
          return "";
        }
        return "ip6.arpa.";
      }
      /**
       * Returns the address in correct form, per
       * [RFC 5952](https://datatracker.ietf.org/doc/html/rfc5952): leading zeros
       * stripped, the longest run of zero groups collapsed to `::`, and hex digits
       * lowercased (e.g. `2001:db8::1`). This is the recommended form for display.
       */
      correctForm() {
        let i;
        let groups = [];
        let zeroCounter = 0;
        const zeroes = [];
        for (i = 0; i < this.parsedAddress.length; i++) {
          const value = parseInt(this.parsedAddress[i], 16);
          if (value === 0) {
            zeroCounter++;
          }
          if (value !== 0 && zeroCounter > 0) {
            if (zeroCounter > 1) {
              zeroes.push([i - zeroCounter, i - 1]);
            }
            zeroCounter = 0;
          }
        }
        if (zeroCounter > 1) {
          zeroes.push([this.parsedAddress.length - zeroCounter, this.parsedAddress.length - 1]);
        }
        const zeroLengths = zeroes.map((n) => n[1] - n[0] + 1);
        if (zeroes.length > 0) {
          const index = zeroLengths.indexOf(Math.max(...zeroLengths));
          groups = compact(this.parsedAddress, zeroes[index]);
        } else {
          groups = this.parsedAddress;
        }
        for (i = 0; i < groups.length; i++) {
          if (groups[i] !== "compact") {
            groups[i] = parseInt(groups[i], 16).toString(16);
          }
        }
        let correct = groups.join(":");
        correct = correct.replace(/^compact$/, "::");
        correct = correct.replace(/(^compact)|(compact$)/, ":");
        correct = correct.replace(/compact/, "");
        return correct;
      }
      /**
       * Return a zero-padded base-2 string representation of the address
       * @returns {String}
       * @example
       * var address = new Address6('2001:4860:4001:803::1011');
       * address.binaryZeroPad();
       * // '0010000000000001010010000110000001000000000000010000100000000011
       * //  0000000000000000000000000000000000000000000000000001000000010001'
       */
      binaryZeroPad() {
        if (this._binaryZeroPad === void 0) {
          this._binaryZeroPad = this.bigInt().toString(2).padStart(constants6.BITS, "0");
        }
        return this._binaryZeroPad;
      }
      /**
       * Parses a v4-in-v6 string (e.g. `::ffff:192.168.0.1`) by extracting the
       * trailing IPv4 address into `this.address4` / `this.parsedAddress4` and
       * returning the address with the v4 portion converted to two v6 groups.
       * Used internally by `parse()`.
       */
      // TODO: Improve the semantics of this helper function
      parse4in6(address) {
        if (address.indexOf(".") === -1) {
          return address;
        }
        const groups = address.split(":");
        const lastGroup = groups.slice(-1)[0];
        const v4Octets = lastGroup.split(".");
        if (v4Octets.length === constants4.GROUPS && v4Octets.every((octet) => /^\d{1,3}$/.test(octet))) {
          if (v4Octets.some((octet) => /^0\d/.test(octet))) {
            const highlighted = v4Octets.map(spanLeadingZeroes4).join(".");
            const prefix = groups.slice(0, -1).map(helpers.escapeHtml).join(":");
            const separator = groups.length > 1 ? ":" : "";
            throw new address_error_1.AddressError("IPv4 addresses can't have leading zeroes.", `${prefix}${separator}${highlighted}`);
          }
        }
        const address4 = lastGroup.match(constants4.RE_ADDRESS);
        if (address4) {
          this.parsedAddress4 = address4[0];
          const v4Suffix = this.subnetMask >= 96 ? `/${this.subnetMask - 96}` : "";
          this.address4 = new ipv4_1.Address4(`${this.parsedAddress4}${v4Suffix}`);
          this.v4 = true;
          groups[groups.length - 1] = this.address4.toGroup6();
          address = groups.join(":");
        }
        return address;
      }
      /**
       * Parses an IPv6 address string into its 8 hexadecimal groups (expanding
       * any `::` elision and any trailing v4-in-v6 portion) and stores the result
       * on `this.parsedAddress`. Called automatically by the constructor; you
       * typically don't need to call it directly. Throws `AddressError` if the
       * input is malformed.
       */
      // TODO: Make private?
      parse(address) {
        address = this.parse4in6(address);
        const badCharacters = address.match(constants6.RE_BAD_CHARACTERS);
        if (badCharacters) {
          throw new address_error_1.AddressError(`Bad character${badCharacters.length > 1 ? "s" : ""} detected in address: ${badCharacters.join("")}`, address.replace(constants6.RE_BAD_CHARACTERS, '<span class="parse-error">$1</span>'));
        }
        const badAddress = address.match(constants6.RE_BAD_ADDRESS);
        if (badAddress) {
          throw new address_error_1.AddressError(`Address failed regex: ${badAddress.join("")}`, address.replace(constants6.RE_BAD_ADDRESS, '<span class="parse-error">$1</span>'));
        }
        let groups = [];
        const halves = address.split("::");
        if (halves.length === 2) {
          let first = halves[0].split(":");
          let last = halves[1].split(":");
          if (first.length === 1 && first[0] === "") {
            first = [];
          }
          if (last.length === 1 && last[0] === "") {
            last = [];
          }
          const remaining = this.groups - (first.length + last.length);
          if (!remaining) {
            throw new address_error_1.AddressError("Error parsing groups");
          }
          this.elidedGroups = remaining;
          this.elisionBegin = first.length;
          this.elisionEnd = first.length + this.elidedGroups;
          groups = groups.concat(first);
          for (let i = 0; i < remaining; i++) {
            groups.push("0");
          }
          groups = groups.concat(last);
        } else if (halves.length === 1) {
          groups = address.split(":");
          this.elidedGroups = 0;
        } else {
          throw new address_error_1.AddressError("Too many :: groups found");
        }
        groups = groups.map((group3) => parseInt(group3, 16).toString(16));
        if (groups.length !== this.groups) {
          throw new address_error_1.AddressError("Incorrect number of groups found");
        }
        return groups;
      }
      /**
       * Returns the canonical (fully expanded) form of the address: all 8 groups,
       * each padded to 4 hex digits, with no `::` collapsing
       * (e.g. `2001:0db8:0000:0000:0000:0000:0000:0001`). Useful for sorting and
       * byte-exact comparison.
       */
      canonicalForm() {
        return this.parsedAddress.map(paddedHex).join(":");
      }
      /**
       * Return the decimal form of the address
       * @returns {String}
       */
      decimal() {
        return this.parsedAddress.map((n) => parseInt(n, 16).toString(10).padStart(5, "0")).join(":");
      }
      /**
       * Return the address as a BigInt
       * @returns {bigint}
       */
      bigInt() {
        return BigInt(`0x${this.parsedAddress.map(paddedHex).join("")}`);
      }
      /**
       * Return the last two groups of this address as an IPv4 address string.
       * If this address carries a CIDR prefix that covers the trailing 32 bits
       * (i.e. `subnetMask >= 96`), the resulting `Address4` inherits the
       * corresponding v4 prefix (`subnetMask - 96`); otherwise it defaults to
       * `/32`.
       * @returns {Address4}
       * @example
       * var address = new Address6('2001:4860:4001::1825:bf11');
       * address.to4().correctForm(); // '24.37.191.17'
       */
      to4() {
        const binary = this.binaryZeroPad().split("");
        const hex = BigInt(`0b${binary.slice(96, 128).join("")}`).toString(16).padStart(8, "0");
        if (this.subnetMask >= 96) {
          const v4Mask = this.subnetMask - 96;
          const groups = [];
          for (let i = 0; i < 8; i += 2) {
            groups.push(parseInt(hex.slice(i, i + 2), 16));
          }
          return new ipv4_1.Address4(`${groups.join(".")}/${v4Mask}`);
        }
        return ipv4_1.Address4.fromHex(hex);
      }
      /**
       * Return the v4-in-v6 form of the address
       * @returns {String}
       */
      to4in6() {
        const address4 = this.to4();
        const address6 = new _Address6(this.parsedAddress.slice(0, 6).join(":"), 6);
        const correct = address6.correctForm();
        let infix = "";
        if (!/:$/.test(correct)) {
          infix = ":";
        }
        return correct + infix + address4.correctForm();
      }
      /**
       * Decodes the Teredo tunneling fields embedded in this address. Returns the
       * Teredo prefix, server IPv4, client IPv4, raw flag bits, cone-NAT flag,
       * UDP port, and Microsoft-format flag breakdown (reserved, universal/local,
       * group/individual, nonce). Only meaningful for addresses in `2001::/32`.
       */
      inspectTeredo() {
        const prefix = this.getBitsBase16(0, 32);
        const bitsForUdpPort = this.getBits(80, 96);
        const udpPort = (bitsForUdpPort ^ BigInt("0xffff")).toString();
        const server4 = ipv4_1.Address4.fromHex(this.getBitsBase16(32, 64));
        const bitsForClient4 = this.getBits(96, 128);
        const client4 = ipv4_1.Address4.fromHex((bitsForClient4 ^ BigInt("0xffffffff")).toString(16).padStart(8, "0"));
        const flagsBase2 = this.getBitsBase2(64, 80);
        const coneNat = (0, common_1.testBit)(flagsBase2, 15);
        const reserved = (0, common_1.testBit)(flagsBase2, 14);
        const groupIndividual = (0, common_1.testBit)(flagsBase2, 8);
        const universalLocal = (0, common_1.testBit)(flagsBase2, 9);
        const nonce = BigInt(`0b${flagsBase2.slice(2, 6) + flagsBase2.slice(8, 16)}`).toString(10);
        return {
          prefix: `${prefix.slice(0, 4)}:${prefix.slice(4, 8)}`,
          server4: server4.address,
          client4: client4.address,
          flags: flagsBase2,
          coneNat,
          microsoft: {
            reserved,
            universalLocal,
            groupIndividual,
            nonce
          },
          udpPort
        };
      }
      /**
       * Decodes the 6to4 tunneling fields embedded in this address. Returns the
       * 6to4 prefix and the embedded IPv4 gateway address. Only meaningful for
       * addresses in `2002::/16`.
       */
      inspect6to4() {
        const prefix = this.getBitsBase16(0, 16);
        const gateway = ipv4_1.Address4.fromHex(this.getBitsBase16(16, 48));
        return {
          prefix: prefix.slice(0, 4),
          gateway: gateway.address
        };
      }
      /**
       * Return a v6 6to4 address from a v6 v4inv6 address
       * @returns {Address6}
       */
      to6to4() {
        if (!this.is4()) {
          return null;
        }
        const addr6to4 = [
          "2002",
          this.getBitsBase16(96, 112),
          this.getBitsBase16(112, 128),
          "",
          "/16"
        ].join(":");
        return new _Address6(addr6to4);
      }
      /**
       * Embed an IPv4 address into a NAT64 IPv6 address using the encoding
       * defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
       * The default prefix is the well-known prefix `64:ff9b::/96`. The prefix
       * length must be one of 32, 40, 48, 56, 64, or 96; for prefixes shorter
       * than /64 the IPv4 octets are split around the reserved bits 64–71.
       * @example
       * Address6.fromAddress4Nat64('192.0.2.33').correctForm(); // '64:ff9b::c000:221'
       * Address6.fromAddress4Nat64('192.0.2.33', '2001:db8::/32').correctForm(); // '2001:db8:c000:221::'
       */
      static fromAddress4Nat64(address, prefix = "64:ff9b::/96") {
        const v4 = new ipv4_1.Address4(address);
        const prefix6 = new _Address6(prefix);
        const pl = prefix6.subnetMask;
        if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
          throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
        }
        const prefixBits = prefix6.binaryZeroPad();
        const v4Bits = v4.binaryZeroPad();
        let bits;
        if (pl === 96) {
          bits = prefixBits.slice(0, 96) + v4Bits;
        } else {
          const beforeU = 64 - pl;
          bits = [
            prefixBits.slice(0, pl),
            v4Bits.slice(0, beforeU),
            // Bits 64 to 71 are the reserved u octet and are always zero.
            "00000000",
            v4Bits.slice(beforeU),
            "0".repeat(128 - 72 - (32 - beforeU))
          ].join("");
        }
        const hex = BigInt(`0b${bits}`).toString(16).padStart(32, "0");
        const groups = [];
        for (let i = 0; i < 8; i++) {
          groups.push(hex.slice(i * 4, (i + 1) * 4));
        }
        return new _Address6(groups.join(":"));
      }
      /**
       * Extract the embedded IPv4 address from a NAT64 IPv6 address using the
       * encoding defined by [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052).
       * The default prefix is the well-known prefix `64:ff9b::/96`. Returns
       * `null` if this address is not contained within the given prefix.
       * @example
       * new Address6('64:ff9b::c000:221').toAddress4Nat64()!.correctForm(); // '192.0.2.33'
       */
      toAddress4Nat64(prefix = "64:ff9b::/96") {
        const prefix6 = new _Address6(prefix);
        const pl = prefix6.subnetMask;
        if (pl !== 32 && pl !== 40 && pl !== 48 && pl !== 56 && pl !== 64 && pl !== 96) {
          throw new address_error_1.AddressError("NAT64 prefix length must be 32, 40, 48, 56, 64, or 96");
        }
        if (!this.isHostInSubnet(prefix6)) {
          return null;
        }
        const bits = this.binaryZeroPad();
        let v4Bits;
        if (pl === 96) {
          v4Bits = bits.slice(96, 128);
        } else {
          const beforeU = 64 - pl;
          v4Bits = bits.slice(pl, pl + beforeU) + bits.slice(72, 72 + (32 - beforeU));
        }
        const octets = [];
        for (let i = 0; i < 4; i++) {
          octets.push(parseInt(v4Bits.slice(i * 8, (i + 1) * 8), 2).toString());
        }
        return new ipv4_1.Address4(octets.join("."));
      }
      /**
       * Return a byte array.
       *
       * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toByteArray())`.
       * @returns {Array}
       */
      toByteArray() {
        const value = this.bigInt().toString(16).padStart(constants6.BITS / 4, "0");
        const bytes = [];
        for (let i = 0, length = value.length; i < length; i += 2) {
          bytes.push(parseInt(value.substring(i, i + 2), 16));
        }
        return bytes;
      }
      /**
       * Return an unsigned byte array.
       *
       * To get a Node.js `Buffer`, wrap the result: `Buffer.from(address.toUnsignedByteArray())`.
       * @returns {Array}
       */
      toUnsignedByteArray() {
        return this.toByteArray().map(unsignByte);
      }
      /**
       * Convert a byte array to an Address6 object.
       *
       * Accepts unsigned bytes (0 to 255) or signed bytes (-128 to 127, as an
       * `Int8Array` or a Java `byte[]` holds them), folding signed values to their
       * unsigned equivalent. Throws `AddressError` unless given exactly 16
       * integers from -128 to 255.
       *
       * To convert from a Node.js `Buffer`, spread it: `Address6.fromByteArray([...buf])`.
       * @returns {Address6}
       */
      static fromByteArray(bytes) {
        common.assertByteArray(bytes, 16, "IPv6", -128);
        return this.fromUnsignedByteArray(bytes.map(unsignByte));
      }
      /**
       * Convert an unsigned byte array to an Address6 object.
       *
       * Throws `AddressError` unless given exactly 16 integers from 0 to 255.
       *
       * To convert from a Node.js `Buffer`, spread it: `Address6.fromUnsignedByteArray([...buf])`.
       * @returns {Address6}
       */
      static fromUnsignedByteArray(bytes) {
        common.assertByteArray(bytes, 16, "IPv6", 0);
        const BYTE_MAX = BigInt("256");
        let result = BigInt("0");
        let multiplier = BigInt("1");
        for (let i = bytes.length - 1; i >= 0; i--) {
          result += multiplier * BigInt(bytes[i].toString(10));
          multiplier *= BYTE_MAX;
        }
        return _Address6.fromBigInt(result);
      }
      /**
       * Returns true if the address is in the canonical form, false otherwise
       * @returns {boolean}
       */
      isCanonical() {
        return this.addressMinusSuffix === this.canonicalForm();
      }
      /**
       * Returns true if the address is a link local address, false otherwise
       * @returns {boolean}
       */
      isLinkLocal() {
        const embedded = this.embeddedIPv4();
        if (embedded) {
          return embedded.isLinkLocal();
        }
        if (this.getBitsBase2(0, 64) === "1111111010000000000000000000000000000000000000000000000000000000") {
          return true;
        }
        return false;
      }
      /**
       * Returns true if the address is a multicast address, false otherwise
       * @returns {boolean}
       */
      isMulticast() {
        const embedded = this.embeddedIPv4();
        if (embedded) {
          return embedded.isMulticast();
        }
        const type = this.getType();
        return type === "Multicast" || type.startsWith("Multicast ");
      }
      /**
       * Returns true if the address was written in v4-in-v6 dotted-quad notation
       * (e.g. `::ffff:127.0.0.1`), false otherwise. This is a notation-level flag
       * and does not reflect whether the address bits lie in the IPv4-mapped
       * (`::ffff:0:0/96`) subnet — for that, see {@link isMapped4}.
       * @returns {boolean}
       */
      is4() {
        return this.v4;
      }
      /**
       * Returns true if the address is an IPv4-mapped IPv6 address in
       * `::ffff:0:0/96` ([RFC 4291 §2.5.5.2](https://datatracker.ietf.org/doc/html/rfc4291#section-2.5.5.2)),
       * false otherwise. Unlike {@link is4}, this checks the underlying address
       * bits rather than the textual notation, so `::ffff:127.0.0.1` and
       * `::ffff:7f00:1` both return true.
       * @returns {boolean}
       */
      isMapped4() {
        return this.isHostInSubnet(IPV4_MAPPED_SUBNET);
      }
      /**
       * If this address embeds a routable IPv4 address — i.e. it is IPv4-mapped
       * (`::ffff:0:0/96`) or sits in the NAT64 well-known prefix (`64:ff9b::/96`,
       * [RFC 6052](https://datatracker.ietf.org/doc/html/rfc6052)) — return that
       * embedded address as an {@link Address4}; otherwise return null.
       *
       * The special-property checks (`isLoopback`, `isLinkLocal`, `isMulticast`,
       * `isUnspecified`, `isPrivate`, `isCGNAT`, `isBroadcast`) call this first and
       * delegate to the embedded {@link Address4} when present, so a literal such as
       * `::ffff:127.0.0.1` is classified by what it actually reaches (loopback)
       * rather than by its IPv6 wrapper (which `getType()` reports as IPv4-mapped).
       * This matters wherever the checks back a trust-boundary decision (e.g. an
       * SSRF allow/deny filter): without normalization, `::ffff:10.0.0.1`,
       * `::ffff:169.254.169.254`, `64:ff9b::7f00:1`, etc. would all read as
       * non-internal.
       * @returns {Address4 | null}
       */
      embeddedIPv4() {
        if (this.isMapped4() || this.isHostInSubnet(NAT64_WELL_KNOWN_SUBNET)) {
          return this.to4();
        }
        return null;
      }
      /**
       * Returns true if the address is a Teredo address, false otherwise
       * @returns {boolean}
       */
      isTeredo() {
        return this.isHostInSubnet(TEREDO_SUBNET);
      }
      /**
       * Returns true if the address is a 6to4 address, false otherwise
       * @returns {boolean}
       */
      is6to4() {
        return this.isHostInSubnet(SIX_TO_FOUR_SUBNET);
      }
      /**
       * Returns true if the address is a loopback address, false otherwise
       * @returns {boolean}
       */
      isLoopback() {
        const embedded = this.embeddedIPv4();
        if (embedded) {
          return embedded.isLoopback();
        }
        return this.getType() === "Loopback";
      }
      /**
       * Returns true if the address is a Unique Local Address in `fc00::/7` ([RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193)). ULAs are the IPv6 equivalent of IPv4 [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private addresses.
       * @returns {boolean}
       */
      isULA() {
        return this.isHostInSubnet(ULA_SUBNET);
      }
      /**
       * Returns true if the address is private, i.e. a Unique Local Address in
       * `fc00::/7` ([RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193)) or an
       * IPv4-mapped / NAT64 address whose embedded IPv4 address is in one of the
       * [RFC 1918](https://datatracker.ietf.org/doc/html/rfc1918) private ranges
       * (e.g. `::ffff:10.0.0.1`). This is the IPv6 counterpart to
       * {@link Address4.isPrivate}; use it instead of {@link isULA} when you need to
       * catch mapped RFC 1918 addresses as well as native ULAs.
       * @returns {boolean}
       */
      isPrivate() {
        const embedded = this.embeddedIPv4();
        if (embedded) {
          return embedded.isPrivate();
        }
        return this.isULA();
      }
      /**
       * Returns true if the address is an IPv4-mapped / NAT64 address whose embedded
       * IPv4 address is in the carrier-grade NAT range `100.64.0.0/10`
       * ([RFC 6598](https://datatracker.ietf.org/doc/html/rfc6598)), false
       * otherwise. There is no native IPv6 CGNAT range, so this only ever returns
       * true for an embedded IPv4 address (e.g. `::ffff:100.64.0.1`).
       * @returns {boolean}
       */
      isCGNAT() {
        const embedded = this.embeddedIPv4();
        if (embedded) {
          return embedded.isCGNAT();
        }
        return false;
      }
      /**
       * Returns true if the address is an IPv4-mapped / NAT64 address whose embedded
       * IPv4 address is the limited broadcast address `255.255.255.255`
       * ([RFC 919](https://datatracker.ietf.org/doc/html/rfc919)), false otherwise.
       * There is no IPv6 broadcast, so this only ever returns true for an embedded
       * IPv4 address (e.g. `::ffff:255.255.255.255`).
       * @returns {boolean}
       */
      isBroadcast() {
        const embedded = this.embeddedIPv4();
        if (embedded) {
          return embedded.isBroadcast();
        }
        return false;
      }
      /**
       * Returns true if the address is the unspecified address `::`.
       * @returns {boolean}
       */
      isUnspecified() {
        const embedded = this.embeddedIPv4();
        if (embedded) {
          return embedded.isUnspecified();
        }
        return this.getType() === "Unspecified";
      }
      /**
       * Returns true if the address is in the documentation prefix `2001:db8::/32` ([RFC 3849](https://datatracker.ietf.org/doc/html/rfc3849)).
       * @returns {boolean}
       */
      isDocumentation() {
        return this.isHostInSubnet(DOCUMENTATION_SUBNET);
      }
      // #endregion
      // #region HTML
      /**
       * Returns the address as an HTTP URL with the host bracketed, e.g.
       * `http://[2001:db8::1]/`. If `optionalPort` is provided it is appended,
       * e.g. `http://[2001:db8::1]:8080/`.
       */
      href(optionalPort) {
        if (optionalPort === void 0) {
          optionalPort = "";
        } else {
          optionalPort = `:${optionalPort}`;
        }
        return `http://[${this.correctForm()}]${optionalPort}/`;
      }
      /**
       * Returns an HTML `<a>` element whose `href` encodes the address in a URL
       * hash fragment (default prefix `/#address=`). Useful for linking between
       * pages of an address-inspector UI.
       * @param options.className - CSS class for the rendered `<a>` element
       * @param options.prefix - hash prefix prepended to the address (default `/#address=`)
       * @param options.v4 - when true, render the address in v4-in-v6 form
       */
      link(options) {
        if (!options) {
          options = {};
        }
        if (options.className === void 0) {
          options.className = "";
        }
        if (options.prefix === void 0) {
          options.prefix = "/#address=";
        }
        if (options.v4 === void 0) {
          options.v4 = false;
        }
        let formFunction = this.correctForm;
        if (options.v4) {
          formFunction = this.to4in6;
        }
        const form = formFunction.call(this);
        const safeHref = helpers.escapeHtml(`${options.prefix}${form}`);
        const safeForm = helpers.escapeHtml(form);
        if (options.className) {
          const safeClass = helpers.escapeHtml(options.className);
          return `<a href="${safeHref}" class="${safeClass}">${safeForm}</a>`;
        }
        return `<a href="${safeHref}">${safeForm}</a>`;
      }
      /**
       * Groups an address.
       *
       * Returns an HTML fragment: each group is wrapped in a `<span>` carrying
       * the group classes an address-inspector UI hovers on. The address content
       * is HTML-escaped; anything you concatenate around it is your
       * responsibility.
       * @returns {String}
       */
      group() {
        if (this.elidedGroups === 0) {
          return helpers.simpleGroup(this.addressMinusSuffix).join(":");
        }
        assert3(typeof this.elidedGroups === "number");
        assert3(typeof this.elisionBegin === "number");
        const output = [];
        const [left, right] = this.addressMinusSuffix.split("::");
        if (left.length) {
          output.push(...helpers.simpleGroup(left));
        } else {
          output.push("");
        }
        const classes = ["hover-group"];
        for (let i = this.elisionBegin; i < this.elisionBegin + this.elidedGroups; i++) {
          classes.push(`group-${i}`);
        }
        output.push(`<span class="${classes.join(" ")}"></span>`);
        if (right.length) {
          output.push(...helpers.simpleGroup(right, this.elisionEnd));
        } else {
          output.push("");
        }
        if (this.is4()) {
          assert3(this.address4 instanceof ipv4_1.Address4);
          output.pop();
          output.push(this.address4.groupForV6());
        }
        return output.join(":");
      }
      // #endregion
      // #region Regular expressions
      /**
       * Generate a regular expression string that can be used to find or validate
       * all variations of this address
       * @param {boolean} substringSearch
       * @returns {string}
       */
      regularExpressionString(substringSearch = false) {
        let output = [];
        const address6 = new _Address6(this.correctForm());
        if (address6.elidedGroups === 0) {
          output.push((0, regular_expressions_1.simpleRegularExpression)(address6.parsedAddress));
        } else if (address6.elidedGroups === constants6.GROUPS) {
          output.push((0, regular_expressions_1.possibleElisions)(constants6.GROUPS));
        } else {
          const halves = address6.address.split("::");
          if (halves[0].length) {
            output.push((0, regular_expressions_1.simpleRegularExpression)(halves[0].split(":")));
          }
          assert3(typeof address6.elidedGroups === "number");
          output.push((0, regular_expressions_1.possibleElisions)(address6.elidedGroups, halves[0].length !== 0, halves[1].length !== 0));
          if (halves[1].length) {
            output.push((0, regular_expressions_1.simpleRegularExpression)(halves[1].split(":")));
          }
          output = [output.join(":")];
        }
        if (!substringSearch) {
          output = [
            "(?=^|",
            regular_expressions_1.ADDRESS_BOUNDARY,
            "|[^\\w\\:])(",
            ...output,
            ")(?=[^\\w\\:]|",
            regular_expressions_1.ADDRESS_BOUNDARY,
            "|$)"
          ];
        }
        return output.join("");
      }
      /**
       * Generate a regular expression that can be used to find or validate all
       * variations of this address.
       * @param {boolean} substringSearch
       * @returns {RegExp}
       */
      regularExpression(substringSearch = false) {
        return new RegExp(this.regularExpressionString(substringSearch), "i");
      }
    };
    exports.Address6 = Address6;
    var TYPE_SUBNETS = Object.keys(constants6.TYPES).map((subnet) => [
      new Address6(subnet),
      constants6.TYPES[subnet]
    ]);
    var TEREDO_SUBNET = new Address6("2001::/32");
    var SIX_TO_FOUR_SUBNET = new Address6("2002::/16");
    var ULA_SUBNET = new Address6("fc00::/7");
    var DOCUMENTATION_SUBNET = new Address6("2001:db8::/32");
    var IPV4_MAPPED_SUBNET = new Address6("::ffff:0:0/96");
    var NAT64_WELL_KNOWN_SUBNET = new Address6("64:ff9b::/96");
  }
});

// node_modules/ip-address/dist/ip-address.js
var require_ip_address = __commonJS({
  "node_modules/ip-address/dist/ip-address.js"(exports) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: /* @__PURE__ */ __name(function() {
          return m[k];
        }, "get") };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports && exports.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.v6 = exports.AddressError = exports.Address6 = exports.Address4 = void 0;
    var ipv4_1 = require_ipv4();
    Object.defineProperty(exports, "Address4", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ipv4_1.Address4;
    }, "get") });
    var ipv6_1 = require_ipv6();
    Object.defineProperty(exports, "Address6", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return ipv6_1.Address6;
    }, "get") });
    var address_error_1 = require_address_error();
    Object.defineProperty(exports, "AddressError", { enumerable: true, get: /* @__PURE__ */ __name(function() {
      return address_error_1.AddressError;
    }, "get") });
    var helpers = __importStar(require_helpers());
    exports.v6 = { helpers };
  }
});

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isNaN(val) === false) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    __name(parse, "parse");
    function fmtShort(ms) {
      if (ms >= d) {
        return Math.round(ms / d) + "d";
      }
      if (ms >= h) {
        return Math.round(ms / h) + "h";
      }
      if (ms >= m) {
        return Math.round(ms / m) + "m";
      }
      if (ms >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    __name(fmtShort, "fmtShort");
    function fmtLong(ms) {
      return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
    }
    __name(fmtLong, "fmtLong");
    function plural(ms, n, name) {
      if (ms < n) {
        return;
      }
      if (ms < n * 1.5) {
        return Math.floor(ms / n) + " " + name;
      }
      return Math.ceil(ms / n) + " " + name + "s";
    }
    __name(plural, "plural");
  }
});

// node_modules/debug/src/debug.js
var require_debug = __commonJS({
  "node_modules/debug/src/debug.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    exports = module.exports = createDebug.debug = createDebug["default"] = createDebug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = require_ms();
    exports.names = [];
    exports.skips = [];
    exports.formatters = {};
    var prevTime;
    function selectColor(namespace) {
      var hash = 0, i;
      for (i in namespace) {
        hash = (hash << 5) - hash + namespace.charCodeAt(i);
        hash |= 0;
      }
      return exports.colors[Math.abs(hash) % exports.colors.length];
    }
    __name(selectColor, "selectColor");
    function createDebug(namespace) {
      function debug3() {
        if (!debug3.enabled) return;
        var self = debug3;
        var curr = +/* @__PURE__ */ new Date();
        var ms = curr - (prevTime || curr);
        self.diff = ms;
        self.prev = prevTime;
        self.curr = curr;
        prevTime = curr;
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        args[0] = exports.coerce(args[0]);
        if ("string" !== typeof args[0]) {
          args.unshift("%O");
        }
        var index = 0;
        args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
          if (match === "%%") return match;
          index++;
          var formatter = exports.formatters[format];
          if ("function" === typeof formatter) {
            var val = args[index];
            match = formatter.call(self, val);
            args.splice(index, 1);
            index--;
          }
          return match;
        });
        exports.formatArgs.call(self, args);
        var logFn = debug3.log || exports.log || console.log.bind(console);
        logFn.apply(self, args);
      }
      __name(debug3, "debug");
      debug3.namespace = namespace;
      debug3.enabled = exports.enabled(namespace);
      debug3.useColors = exports.useColors();
      debug3.color = selectColor(namespace);
      if ("function" === typeof exports.init) {
        exports.init(debug3);
      }
      return debug3;
    }
    __name(createDebug, "createDebug");
    function enable(namespaces) {
      exports.save(namespaces);
      exports.names = [];
      exports.skips = [];
      var split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
      var len = split.length;
      for (var i = 0; i < len; i++) {
        if (!split[i]) continue;
        namespaces = split[i].replace(/\*/g, ".*?");
        if (namespaces[0] === "-") {
          exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
        } else {
          exports.names.push(new RegExp("^" + namespaces + "$"));
        }
      }
    }
    __name(enable, "enable");
    function disable() {
      exports.enable("");
    }
    __name(disable, "disable");
    function enabled(name) {
      var i, len;
      for (i = 0, len = exports.skips.length; i < len; i++) {
        if (exports.skips[i].test(name)) {
          return false;
        }
      }
      for (i = 0, len = exports.names.length; i < len; i++) {
        if (exports.names[i].test(name)) {
          return true;
        }
      }
      return false;
    }
    __name(enabled, "enabled");
    function coerce(val) {
      if (val instanceof Error) return val.stack || val.message;
      return val;
    }
    __name(coerce, "coerce");
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    exports = module.exports = require_debug();
    exports.log = log3;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
    exports.colors = [
      "lightseagreen",
      "forestgreen",
      "goldenrod",
      "dodgerblue",
      "darkorchid",
      "crimson"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && window.process.type === "renderer") {
        return true;
      }
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && "Cloudflare-Workers" && "Cloudflare-Workers".toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && "Cloudflare-Workers" && "Cloudflare-Workers".toLowerCase().match(/applewebkit\/(\d+)/);
    }
    __name(useColors, "useColors");
    exports.formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (err) {
        return "[UnexpectedJSONParseError]: " + err.message;
      }
    };
    function formatArgs(args) {
      var useColors2 = this.useColors;
      args[0] = (useColors2 ? "%c" : "") + this.namespace + (useColors2 ? " %c" : " ") + args[0] + (useColors2 ? "%c " : " ") + "+" + exports.humanize(this.diff);
      if (!useColors2) return;
      var c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      var index = 0;
      var lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, function(match) {
        if ("%%" === match) return;
        index++;
        if ("%c" === match) {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    __name(formatArgs, "formatArgs");
    function log3() {
      return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
    }
    __name(log3, "log");
    function save(namespaces) {
      try {
        if (null == namespaces) {
          exports.storage.removeItem("debug");
        } else {
          exports.storage.debug = namespaces;
        }
      } catch (e) {
      }
    }
    __name(save, "save");
    function load() {
      var r;
      try {
        r = exports.storage.debug;
      } catch (e) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    __name(load, "load");
    exports.enable(load());
    function localstorage() {
      try {
        return window.localStorage;
      } catch (e) {
      }
    }
    __name(localstorage, "localstorage");
  }
});

// node-built-in-modules:tty
var require_tty = __commonJS({
  "node-built-in-modules:tty"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_tty();
    module.exports = tty_default;
  }
});

// node-built-in-modules:util
import libDefault3 from "util";
var require_util = __commonJS({
  "node-built-in-modules:util"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault3;
  }
});

// node_modules/unenv/dist/runtime/node/internal/fs/promises.mjs
var access, copyFile, cp, open, opendir, rename, truncate, rm, rmdir, mkdir, readdir, readlink, symlink, lstat, stat, link, unlink, chmod, lchmod, lchown, chown, utimes, lutimes, realpath, mkdtemp, writeFile, appendFile, readFile, watch, statfs, glob;
var init_promises = __esm({
  "node_modules/unenv/dist/runtime/node/internal/fs/promises.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    access = /* @__PURE__ */ notImplemented("fs.access");
    copyFile = /* @__PURE__ */ notImplemented("fs.copyFile");
    cp = /* @__PURE__ */ notImplemented("fs.cp");
    open = /* @__PURE__ */ notImplemented("fs.open");
    opendir = /* @__PURE__ */ notImplemented("fs.opendir");
    rename = /* @__PURE__ */ notImplemented("fs.rename");
    truncate = /* @__PURE__ */ notImplemented("fs.truncate");
    rm = /* @__PURE__ */ notImplemented("fs.rm");
    rmdir = /* @__PURE__ */ notImplemented("fs.rmdir");
    mkdir = /* @__PURE__ */ notImplemented("fs.mkdir");
    readdir = /* @__PURE__ */ notImplemented("fs.readdir");
    readlink = /* @__PURE__ */ notImplemented("fs.readlink");
    symlink = /* @__PURE__ */ notImplemented("fs.symlink");
    lstat = /* @__PURE__ */ notImplemented("fs.lstat");
    stat = /* @__PURE__ */ notImplemented("fs.stat");
    link = /* @__PURE__ */ notImplemented("fs.link");
    unlink = /* @__PURE__ */ notImplemented("fs.unlink");
    chmod = /* @__PURE__ */ notImplemented("fs.chmod");
    lchmod = /* @__PURE__ */ notImplemented("fs.lchmod");
    lchown = /* @__PURE__ */ notImplemented("fs.lchown");
    chown = /* @__PURE__ */ notImplemented("fs.chown");
    utimes = /* @__PURE__ */ notImplemented("fs.utimes");
    lutimes = /* @__PURE__ */ notImplemented("fs.lutimes");
    realpath = /* @__PURE__ */ notImplemented("fs.realpath");
    mkdtemp = /* @__PURE__ */ notImplemented("fs.mkdtemp");
    writeFile = /* @__PURE__ */ notImplemented("fs.writeFile");
    appendFile = /* @__PURE__ */ notImplemented("fs.appendFile");
    readFile = /* @__PURE__ */ notImplemented("fs.readFile");
    watch = /* @__PURE__ */ notImplemented("fs.watch");
    statfs = /* @__PURE__ */ notImplemented("fs.statfs");
    glob = /* @__PURE__ */ notImplemented("fs.glob");
  }
});

// node_modules/unenv/dist/runtime/node/internal/fs/constants.mjs
var constants_exports = {};
__export(constants_exports, {
  COPYFILE_EXCL: () => COPYFILE_EXCL,
  COPYFILE_FICLONE: () => COPYFILE_FICLONE,
  COPYFILE_FICLONE_FORCE: () => COPYFILE_FICLONE_FORCE,
  EXTENSIONLESS_FORMAT_JAVASCRIPT: () => EXTENSIONLESS_FORMAT_JAVASCRIPT,
  EXTENSIONLESS_FORMAT_WASM: () => EXTENSIONLESS_FORMAT_WASM,
  F_OK: () => F_OK,
  O_APPEND: () => O_APPEND,
  O_CREAT: () => O_CREAT,
  O_DIRECT: () => O_DIRECT,
  O_DIRECTORY: () => O_DIRECTORY,
  O_DSYNC: () => O_DSYNC,
  O_EXCL: () => O_EXCL,
  O_NOATIME: () => O_NOATIME,
  O_NOCTTY: () => O_NOCTTY,
  O_NOFOLLOW: () => O_NOFOLLOW,
  O_NONBLOCK: () => O_NONBLOCK,
  O_RDONLY: () => O_RDONLY,
  O_RDWR: () => O_RDWR,
  O_SYNC: () => O_SYNC,
  O_TRUNC: () => O_TRUNC,
  O_WRONLY: () => O_WRONLY,
  R_OK: () => R_OK,
  S_IFBLK: () => S_IFBLK,
  S_IFCHR: () => S_IFCHR,
  S_IFDIR: () => S_IFDIR,
  S_IFIFO: () => S_IFIFO,
  S_IFLNK: () => S_IFLNK,
  S_IFMT: () => S_IFMT,
  S_IFREG: () => S_IFREG,
  S_IFSOCK: () => S_IFSOCK,
  S_IRGRP: () => S_IRGRP,
  S_IROTH: () => S_IROTH,
  S_IRUSR: () => S_IRUSR,
  S_IRWXG: () => S_IRWXG,
  S_IRWXO: () => S_IRWXO,
  S_IRWXU: () => S_IRWXU,
  S_IWGRP: () => S_IWGRP,
  S_IWOTH: () => S_IWOTH,
  S_IWUSR: () => S_IWUSR,
  S_IXGRP: () => S_IXGRP,
  S_IXOTH: () => S_IXOTH,
  S_IXUSR: () => S_IXUSR,
  UV_DIRENT_BLOCK: () => UV_DIRENT_BLOCK,
  UV_DIRENT_CHAR: () => UV_DIRENT_CHAR,
  UV_DIRENT_DIR: () => UV_DIRENT_DIR,
  UV_DIRENT_FIFO: () => UV_DIRENT_FIFO,
  UV_DIRENT_FILE: () => UV_DIRENT_FILE,
  UV_DIRENT_LINK: () => UV_DIRENT_LINK,
  UV_DIRENT_SOCKET: () => UV_DIRENT_SOCKET,
  UV_DIRENT_UNKNOWN: () => UV_DIRENT_UNKNOWN,
  UV_FS_COPYFILE_EXCL: () => UV_FS_COPYFILE_EXCL,
  UV_FS_COPYFILE_FICLONE: () => UV_FS_COPYFILE_FICLONE,
  UV_FS_COPYFILE_FICLONE_FORCE: () => UV_FS_COPYFILE_FICLONE_FORCE,
  UV_FS_O_FILEMAP: () => UV_FS_O_FILEMAP,
  UV_FS_SYMLINK_DIR: () => UV_FS_SYMLINK_DIR,
  UV_FS_SYMLINK_JUNCTION: () => UV_FS_SYMLINK_JUNCTION,
  W_OK: () => W_OK,
  X_OK: () => X_OK
});
var UV_FS_SYMLINK_DIR, UV_FS_SYMLINK_JUNCTION, O_RDONLY, O_WRONLY, O_RDWR, UV_DIRENT_UNKNOWN, UV_DIRENT_FILE, UV_DIRENT_DIR, UV_DIRENT_LINK, UV_DIRENT_FIFO, UV_DIRENT_SOCKET, UV_DIRENT_CHAR, UV_DIRENT_BLOCK, EXTENSIONLESS_FORMAT_JAVASCRIPT, EXTENSIONLESS_FORMAT_WASM, S_IFMT, S_IFREG, S_IFDIR, S_IFCHR, S_IFBLK, S_IFIFO, S_IFLNK, S_IFSOCK, O_CREAT, O_EXCL, UV_FS_O_FILEMAP, O_NOCTTY, O_TRUNC, O_APPEND, O_DIRECTORY, O_NOATIME, O_NOFOLLOW, O_SYNC, O_DSYNC, O_DIRECT, O_NONBLOCK, S_IRWXU, S_IRUSR, S_IWUSR, S_IXUSR, S_IRWXG, S_IRGRP, S_IWGRP, S_IXGRP, S_IRWXO, S_IROTH, S_IWOTH, S_IXOTH, F_OK, R_OK, W_OK, X_OK, UV_FS_COPYFILE_EXCL, COPYFILE_EXCL, UV_FS_COPYFILE_FICLONE, COPYFILE_FICLONE, UV_FS_COPYFILE_FICLONE_FORCE, COPYFILE_FICLONE_FORCE;
var init_constants = __esm({
  "node_modules/unenv/dist/runtime/node/internal/fs/constants.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    UV_FS_SYMLINK_DIR = 1;
    UV_FS_SYMLINK_JUNCTION = 2;
    O_RDONLY = 0;
    O_WRONLY = 1;
    O_RDWR = 2;
    UV_DIRENT_UNKNOWN = 0;
    UV_DIRENT_FILE = 1;
    UV_DIRENT_DIR = 2;
    UV_DIRENT_LINK = 3;
    UV_DIRENT_FIFO = 4;
    UV_DIRENT_SOCKET = 5;
    UV_DIRENT_CHAR = 6;
    UV_DIRENT_BLOCK = 7;
    EXTENSIONLESS_FORMAT_JAVASCRIPT = 0;
    EXTENSIONLESS_FORMAT_WASM = 1;
    S_IFMT = 61440;
    S_IFREG = 32768;
    S_IFDIR = 16384;
    S_IFCHR = 8192;
    S_IFBLK = 24576;
    S_IFIFO = 4096;
    S_IFLNK = 40960;
    S_IFSOCK = 49152;
    O_CREAT = 64;
    O_EXCL = 128;
    UV_FS_O_FILEMAP = 0;
    O_NOCTTY = 256;
    O_TRUNC = 512;
    O_APPEND = 1024;
    O_DIRECTORY = 65536;
    O_NOATIME = 262144;
    O_NOFOLLOW = 131072;
    O_SYNC = 1052672;
    O_DSYNC = 4096;
    O_DIRECT = 16384;
    O_NONBLOCK = 2048;
    S_IRWXU = 448;
    S_IRUSR = 256;
    S_IWUSR = 128;
    S_IXUSR = 64;
    S_IRWXG = 56;
    S_IRGRP = 32;
    S_IWGRP = 16;
    S_IXGRP = 8;
    S_IRWXO = 7;
    S_IROTH = 4;
    S_IWOTH = 2;
    S_IXOTH = 1;
    F_OK = 0;
    R_OK = 4;
    W_OK = 2;
    X_OK = 1;
    UV_FS_COPYFILE_EXCL = 1;
    COPYFILE_EXCL = 1;
    UV_FS_COPYFILE_FICLONE = 2;
    COPYFILE_FICLONE = 2;
    UV_FS_COPYFILE_FICLONE_FORCE = 4;
    COPYFILE_FICLONE_FORCE = 4;
  }
});

// node_modules/unenv/dist/runtime/node/fs/promises.mjs
var promises_default;
var init_promises2 = __esm({
  "node_modules/unenv/dist/runtime/node/fs/promises.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_promises();
    init_constants();
    init_promises();
    promises_default = {
      constants: constants_exports,
      access,
      appendFile,
      chmod,
      chown,
      copyFile,
      cp,
      glob,
      lchmod,
      lchown,
      link,
      lstat,
      lutimes,
      mkdir,
      mkdtemp,
      open,
      opendir,
      readFile,
      readdir,
      readlink,
      realpath,
      rename,
      rm,
      rmdir,
      stat,
      statfs,
      symlink,
      truncate,
      unlink,
      utimes,
      watch,
      writeFile
    };
  }
});

// node_modules/unenv/dist/runtime/node/internal/fs/classes.mjs
var Dir, Dirent, Stats, ReadStream2, WriteStream2, FileReadStream, FileWriteStream;
var init_classes = __esm({
  "node_modules/unenv/dist/runtime/node/internal/fs/classes.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    Dir = /* @__PURE__ */ notImplementedClass("fs.Dir");
    Dirent = /* @__PURE__ */ notImplementedClass("fs.Dirent");
    Stats = /* @__PURE__ */ notImplementedClass("fs.Stats");
    ReadStream2 = /* @__PURE__ */ notImplementedClass("fs.ReadStream");
    WriteStream2 = /* @__PURE__ */ notImplementedClass("fs.WriteStream");
    FileReadStream = ReadStream2;
    FileWriteStream = WriteStream2;
  }
});

// node_modules/unenv/dist/runtime/node/internal/fs/fs.mjs
function callbackify(fn) {
  const fnc = /* @__PURE__ */ __name(function(...args) {
    const cb = args.pop();
    fn().catch((error3) => cb(error3)).then((val) => cb(void 0, val));
  }, "fnc");
  fnc.__promisify__ = fn;
  fnc.native = fnc;
  return fnc;
}
var access2, appendFile2, chown2, chmod2, copyFile2, cp2, lchown2, lchmod2, link2, lstat2, lutimes2, mkdir2, mkdtemp2, realpath2, open2, opendir2, readdir2, readFile2, readlink2, rename2, rm2, rmdir2, stat2, symlink2, truncate2, unlink2, utimes2, writeFile2, statfs2, close, createReadStream, createWriteStream, exists, fchown, fchmod, fdatasync, fstat, fsync, ftruncate, futimes, lstatSync, read, readv, realpathSync, statSync, unwatchFile, watch2, watchFile, write, writev, _toUnixTimestamp, openAsBlob, glob2, appendFileSync, accessSync, chownSync, chmodSync, closeSync, copyFileSync, cpSync, existsSync, fchownSync, fchmodSync, fdatasyncSync, fstatSync, fsyncSync, ftruncateSync, futimesSync, lchownSync, lchmodSync, linkSync, lutimesSync, mkdirSync, mkdtempSync, openSync, opendirSync, readdirSync, readSync, readvSync, readFileSync, readlinkSync, renameSync, rmSync, rmdirSync, symlinkSync, truncateSync, unlinkSync, utimesSync, writeFileSync, writeSync, writevSync, statfsSync, globSync;
var init_fs = __esm({
  "node_modules/unenv/dist/runtime/node/internal/fs/fs.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_utils();
    init_promises();
    __name(callbackify, "callbackify");
    access2 = callbackify(access);
    appendFile2 = callbackify(appendFile);
    chown2 = callbackify(chown);
    chmod2 = callbackify(chmod);
    copyFile2 = callbackify(copyFile);
    cp2 = callbackify(cp);
    lchown2 = callbackify(lchown);
    lchmod2 = callbackify(lchmod);
    link2 = callbackify(link);
    lstat2 = callbackify(lstat);
    lutimes2 = callbackify(lutimes);
    mkdir2 = callbackify(mkdir);
    mkdtemp2 = callbackify(mkdtemp);
    realpath2 = callbackify(realpath);
    open2 = callbackify(open);
    opendir2 = callbackify(opendir);
    readdir2 = callbackify(readdir);
    readFile2 = callbackify(readFile);
    readlink2 = callbackify(readlink);
    rename2 = callbackify(rename);
    rm2 = callbackify(rm);
    rmdir2 = callbackify(rmdir);
    stat2 = callbackify(stat);
    symlink2 = callbackify(symlink);
    truncate2 = callbackify(truncate);
    unlink2 = callbackify(unlink);
    utimes2 = callbackify(utimes);
    writeFile2 = callbackify(writeFile);
    statfs2 = callbackify(statfs);
    close = /* @__PURE__ */ notImplementedAsync("fs.close");
    createReadStream = /* @__PURE__ */ notImplementedAsync("fs.createReadStream");
    createWriteStream = /* @__PURE__ */ notImplementedAsync("fs.createWriteStream");
    exists = /* @__PURE__ */ notImplementedAsync("fs.exists");
    fchown = /* @__PURE__ */ notImplementedAsync("fs.fchown");
    fchmod = /* @__PURE__ */ notImplementedAsync("fs.fchmod");
    fdatasync = /* @__PURE__ */ notImplementedAsync("fs.fdatasync");
    fstat = /* @__PURE__ */ notImplementedAsync("fs.fstat");
    fsync = /* @__PURE__ */ notImplementedAsync("fs.fsync");
    ftruncate = /* @__PURE__ */ notImplementedAsync("fs.ftruncate");
    futimes = /* @__PURE__ */ notImplementedAsync("fs.futimes");
    lstatSync = /* @__PURE__ */ notImplementedAsync("fs.lstatSync");
    read = /* @__PURE__ */ notImplementedAsync("fs.read");
    readv = /* @__PURE__ */ notImplementedAsync("fs.readv");
    realpathSync = /* @__PURE__ */ notImplementedAsync("fs.realpathSync");
    statSync = /* @__PURE__ */ notImplementedAsync("fs.statSync");
    unwatchFile = /* @__PURE__ */ notImplementedAsync("fs.unwatchFile");
    watch2 = /* @__PURE__ */ notImplementedAsync("fs.watch");
    watchFile = /* @__PURE__ */ notImplementedAsync("fs.watchFile");
    write = /* @__PURE__ */ notImplementedAsync("fs.write");
    writev = /* @__PURE__ */ notImplementedAsync("fs.writev");
    _toUnixTimestamp = /* @__PURE__ */ notImplementedAsync("fs._toUnixTimestamp");
    openAsBlob = /* @__PURE__ */ notImplementedAsync("fs.openAsBlob");
    glob2 = /* @__PURE__ */ notImplementedAsync("fs.glob");
    appendFileSync = /* @__PURE__ */ notImplemented("fs.appendFileSync");
    accessSync = /* @__PURE__ */ notImplemented("fs.accessSync");
    chownSync = /* @__PURE__ */ notImplemented("fs.chownSync");
    chmodSync = /* @__PURE__ */ notImplemented("fs.chmodSync");
    closeSync = /* @__PURE__ */ notImplemented("fs.closeSync");
    copyFileSync = /* @__PURE__ */ notImplemented("fs.copyFileSync");
    cpSync = /* @__PURE__ */ notImplemented("fs.cpSync");
    existsSync = /* @__PURE__ */ __name(() => false, "existsSync");
    fchownSync = /* @__PURE__ */ notImplemented("fs.fchownSync");
    fchmodSync = /* @__PURE__ */ notImplemented("fs.fchmodSync");
    fdatasyncSync = /* @__PURE__ */ notImplemented("fs.fdatasyncSync");
    fstatSync = /* @__PURE__ */ notImplemented("fs.fstatSync");
    fsyncSync = /* @__PURE__ */ notImplemented("fs.fsyncSync");
    ftruncateSync = /* @__PURE__ */ notImplemented("fs.ftruncateSync");
    futimesSync = /* @__PURE__ */ notImplemented("fs.futimesSync");
    lchownSync = /* @__PURE__ */ notImplemented("fs.lchownSync");
    lchmodSync = /* @__PURE__ */ notImplemented("fs.lchmodSync");
    linkSync = /* @__PURE__ */ notImplemented("fs.linkSync");
    lutimesSync = /* @__PURE__ */ notImplemented("fs.lutimesSync");
    mkdirSync = /* @__PURE__ */ notImplemented("fs.mkdirSync");
    mkdtempSync = /* @__PURE__ */ notImplemented("fs.mkdtempSync");
    openSync = /* @__PURE__ */ notImplemented("fs.openSync");
    opendirSync = /* @__PURE__ */ notImplemented("fs.opendirSync");
    readdirSync = /* @__PURE__ */ notImplemented("fs.readdirSync");
    readSync = /* @__PURE__ */ notImplemented("fs.readSync");
    readvSync = /* @__PURE__ */ notImplemented("fs.readvSync");
    readFileSync = /* @__PURE__ */ notImplemented("fs.readFileSync");
    readlinkSync = /* @__PURE__ */ notImplemented("fs.readlinkSync");
    renameSync = /* @__PURE__ */ notImplemented("fs.renameSync");
    rmSync = /* @__PURE__ */ notImplemented("fs.rmSync");
    rmdirSync = /* @__PURE__ */ notImplemented("fs.rmdirSync");
    symlinkSync = /* @__PURE__ */ notImplemented("fs.symlinkSync");
    truncateSync = /* @__PURE__ */ notImplemented("fs.truncateSync");
    unlinkSync = /* @__PURE__ */ notImplemented("fs.unlinkSync");
    utimesSync = /* @__PURE__ */ notImplemented("fs.utimesSync");
    writeFileSync = /* @__PURE__ */ notImplemented("fs.writeFileSync");
    writeSync = /* @__PURE__ */ notImplemented("fs.writeSync");
    writevSync = /* @__PURE__ */ notImplemented("fs.writevSync");
    statfsSync = /* @__PURE__ */ notImplemented("fs.statfsSync");
    globSync = /* @__PURE__ */ notImplemented("fs.globSync");
  }
});

// node_modules/unenv/dist/runtime/node/fs.mjs
var fs_default;
var init_fs2 = __esm({
  "node_modules/unenv/dist/runtime/node/fs.mjs"() {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_promises2();
    init_classes();
    init_fs();
    init_constants();
    init_constants();
    init_fs();
    init_classes();
    fs_default = {
      F_OK,
      R_OK,
      W_OK,
      X_OK,
      constants: constants_exports,
      promises: promises_default,
      Dir,
      Dirent,
      FileReadStream,
      FileWriteStream,
      ReadStream: ReadStream2,
      Stats,
      WriteStream: WriteStream2,
      _toUnixTimestamp,
      access: access2,
      accessSync,
      appendFile: appendFile2,
      appendFileSync,
      chmod: chmod2,
      chmodSync,
      chown: chown2,
      chownSync,
      close,
      closeSync,
      copyFile: copyFile2,
      copyFileSync,
      cp: cp2,
      cpSync,
      createReadStream,
      createWriteStream,
      exists,
      existsSync,
      fchmod,
      fchmodSync,
      fchown,
      fchownSync,
      fdatasync,
      fdatasyncSync,
      fstat,
      fstatSync,
      fsync,
      fsyncSync,
      ftruncate,
      ftruncateSync,
      futimes,
      futimesSync,
      glob: glob2,
      lchmod: lchmod2,
      globSync,
      lchmodSync,
      lchown: lchown2,
      lchownSync,
      link: link2,
      linkSync,
      lstat: lstat2,
      lstatSync,
      lutimes: lutimes2,
      lutimesSync,
      mkdir: mkdir2,
      mkdirSync,
      mkdtemp: mkdtemp2,
      mkdtempSync,
      open: open2,
      openAsBlob,
      openSync,
      opendir: opendir2,
      opendirSync,
      read,
      readFile: readFile2,
      readFileSync,
      readSync,
      readdir: readdir2,
      readdirSync,
      readlink: readlink2,
      readlinkSync,
      readv,
      readvSync,
      realpath: realpath2,
      realpathSync,
      rename: rename2,
      renameSync,
      rm: rm2,
      rmSync,
      rmdir: rmdir2,
      rmdirSync,
      stat: stat2,
      statSync,
      statfs: statfs2,
      statfsSync,
      symlink: symlink2,
      symlinkSync,
      truncate: truncate2,
      truncateSync,
      unlink: unlink2,
      unlinkSync,
      unwatchFile,
      utimes: utimes2,
      utimesSync,
      watch: watch2,
      watchFile,
      write,
      writeFile: writeFile2,
      writeFileSync,
      writeSync,
      writev,
      writevSync
    };
  }
});

// node-built-in-modules:fs
var require_fs = __commonJS({
  "node-built-in-modules:fs"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    init_fs2();
    module.exports = fs_default;
  }
});

// node-built-in-modules:net
import libDefault4 from "net";
var require_net = __commonJS({
  "node-built-in-modules:net"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault4;
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var tty = require_tty();
    var util = require_util();
    exports = module.exports = require_debug();
    exports.init = init;
    exports.log = log3;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.colors = [6, 2, 3, 4, 5, 1];
    exports.inspectOpts = Object.keys(process.env).filter(function(key) {
      return /^debug_/i.test(key);
    }).reduce(function(obj, key) {
      var prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, function(_, k) {
        return k.toUpperCase();
      });
      var val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
      else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
      else if (val === "null") val = null;
      else val = Number(val);
      obj[prop] = val;
      return obj;
    }, {});
    var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
    if (1 !== fd && 2 !== fd) {
      util.deprecate(function() {
      }, "except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)")();
    }
    var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
    function useColors() {
      return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(fd);
    }
    __name(useColors, "useColors");
    exports.formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map(function(str) {
        return str.trim();
      }).join(" ");
    };
    exports.formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
    function formatArgs(args) {
      var name = this.namespace;
      var useColors2 = this.useColors;
      if (useColors2) {
        var c = this.color;
        var prefix = "  \x1B[3" + c + ";1m" + name + " \x1B[0m";
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push("\x1B[3" + c + "m+" + exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = (/* @__PURE__ */ new Date()).toUTCString() + " " + name + " " + args[0];
      }
    }
    __name(formatArgs, "formatArgs");
    function log3() {
      return stream.write(util.format.apply(util, arguments) + "\n");
    }
    __name(log3, "log");
    function save(namespaces) {
      if (null == namespaces) {
        delete process.env.DEBUG;
      } else {
        process.env.DEBUG = namespaces;
      }
    }
    __name(save, "save");
    function load() {
      return process.env.DEBUG;
    }
    __name(load, "load");
    function createWritableStdioStream(fd2) {
      var stream2;
      var tty_wrap = process.binding("tty_wrap");
      switch (tty_wrap.guessHandleType(fd2)) {
        case "TTY":
          stream2 = new tty.WriteStream(fd2);
          stream2._type = "tty";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        case "FILE":
          var fs = require_fs();
          stream2 = new fs.SyncWriteStream(fd2, { autoClose: false });
          stream2._type = "fs";
          break;
        case "PIPE":
        case "TCP":
          var net = require_net();
          stream2 = new net.Socket({
            fd: fd2,
            readable: false,
            writable: true
          });
          stream2.readable = false;
          stream2.read = null;
          stream2._type = "pipe";
          if (stream2._handle && stream2._handle.unref) {
            stream2._handle.unref();
          }
          break;
        default:
          throw new Error("Implement me. Unknown stream file type!");
      }
      stream2.fd = fd2;
      stream2._isStdio = true;
      return stream2;
    }
    __name(createWritableStdioStream, "createWritableStdioStream");
    function init(debug3) {
      debug3.inspectOpts = {};
      var keys = Object.keys(exports.inspectOpts);
      for (var i = 0; i < keys.length; i++) {
        debug3.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
      }
    }
    __name(init, "init");
    exports.enable(load());
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    if (typeof process !== "undefined" && process.type === "renderer") {
      module.exports = require_browser();
    } else {
      module.exports = require_node();
    }
  }
});

// node-built-in-modules:node:buffer
import libDefault5 from "node:buffer";
var require_node_buffer = __commonJS({
  "node-built-in-modules:node:buffer"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    module.exports = libDefault5;
  }
});

// node_modules/express-rate-limit/dist/index.cjs
var require_dist = __commonJS({
  "node_modules/express-rate-limit/dist/index.cjs"(exports, module) {
    "use strict";
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var __create = Object.create;
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __getProtoOf = Object.getPrototypeOf;
    var __hasOwnProp = Object.prototype.hasOwnProperty;
    var __export2 = /* @__PURE__ */ __name((target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    }, "__export");
    var __copyProps = /* @__PURE__ */ __name((to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp.call(to, key) && key !== except)
            __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
      }
      return to;
    }, "__copyProps");
    var __toESM = /* @__PURE__ */ __name((mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
      // If the importer is in node compatibility mode or this is not an ESM
      // file that has been converted to a CommonJS file using a Babel-
      // compatible transform (i.e. "__esModule" has not been set), then set
      // "default" to the CommonJS "module.exports" for node compatibility.
      isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
      mod
    )), "__toESM");
    var __toCommonJS = /* @__PURE__ */ __name((mod) => __copyProps(__defProp2({}, "__esModule", { value: true }), mod), "__toCommonJS");
    var index_exports = {};
    __export2(index_exports, {
      DAY: /* @__PURE__ */ __name(() => DAY, "DAY"),
      HOUR: /* @__PURE__ */ __name(() => HOUR, "HOUR"),
      MINUTE: /* @__PURE__ */ __name(() => MINUTE, "MINUTE"),
      MemoryStore: /* @__PURE__ */ __name(() => MemoryStore, "MemoryStore"),
      SECOND: /* @__PURE__ */ __name(() => SECOND, "SECOND"),
      default: /* @__PURE__ */ __name(() => rate_limit_default, "default"),
      ipKeyGenerator: /* @__PURE__ */ __name(() => ipKeyGenerator, "ipKeyGenerator"),
      rateLimit: /* @__PURE__ */ __name(() => rate_limit_default, "rateLimit")
    });
    module.exports = __toCommonJS(index_exports);
    var import_node_net2 = require_node_net();
    var import_ip_address = require_ip_address();
    var ipv4CompatibleSubnet = new import_ip_address.Address6("::/96");
    function ipKeyGenerator(ip, ipv6Subnet = 56) {
      if ((0, import_node_net2.isIPv6)(ip)) {
        const address = new import_ip_address.Address6(ip);
        if (address.isMapped4() || // The deprecated IPv4-compatible notation keeps its existing behavior.
        // Its range is shared with addresses that embed no IPv4 address at all
        // (`::`, `::1`), so here the notation is what tells them apart.
        address.is4() && address.isInSubnet(ipv4CompatibleSubnet))
          return address.to4().correctForm();
        if (ipv6Subnet) {
          const subnet = new import_ip_address.Address6(`${ip}/${ipv6Subnet}`);
          return subnet.networkForm();
        }
      }
      return ip;
    }
    __name(ipKeyGenerator, "ipKeyGenerator");
    var MemoryStore = class {
      static {
        __name(this, "MemoryStore");
      }
      constructor(validations2) {
        this.validations = validations2;
        this.previous = /* @__PURE__ */ new Map();
        this.current = /* @__PURE__ */ new Map();
        this.localKeys = true;
      }
      /**
       * Method that initializes the store.
       *
       * @param options {Options} - The options used to setup the middleware.
       */
      init(options) {
        this.windowMs = options.windowMs;
        this.validations?.windowMs(this.windowMs);
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => {
          this.clearExpired();
        }, this.windowMs);
        this.interval.unref?.();
      }
      /**
       * Method to fetch a client's hit count and reset time.
       *
       * @param key {string} - The identifier for a client.
       *
       * @returns {ClientRateLimitInfo | undefined} - The number of hits and reset time for that client.
       *
       * @public
       */
      async get(key) {
        return this.current.get(key) ?? this.previous.get(key);
      }
      /**
       * Method to increment a client's hit counter.
       *
       * @param key {string} - The identifier for a client.
       *
       * @returns {ClientRateLimitInfo} - The number of hits and reset time for that client.
       *
       * @public
       */
      async increment(key) {
        const client = this.getClient(key);
        const now = Date.now();
        if (client.resetTime.getTime() <= now) {
          this.resetClient(client, now);
        }
        client.totalHits++;
        return client;
      }
      /**
       * Method to decrement a client's hit counter.
       *
       * @param key {string} - The identifier for a client.
       *
       * @public
       */
      async decrement(key) {
        const client = this.getClient(key);
        if (client.totalHits > 0) client.totalHits--;
      }
      /**
       * Method to reset a client's hit counter.
       *
       * @param key {string} - The identifier for a client.
       *
       * @public
       */
      async resetKey(key) {
        this.current.delete(key);
        this.previous.delete(key);
      }
      /**
       * Method to reset everyone's hit counter.
       *
       * @public
       */
      async resetAll() {
        this.current.clear();
        this.previous.clear();
      }
      /**
       * Method to stop the timer (if currently running) and prevent any memory
       * leaks.
       *
       * @public
       */
      shutdown() {
        clearInterval(this.interval);
        void this.resetAll();
      }
      /**
       * Recycles a client by setting its hit count to zero, and reset time to
       * `windowMs` milliseconds from now.
       *
       * NOT to be confused with `#resetKey()`, which removes a client from both the
       * `current` and `previous` maps.
       *
       * @param client {Client} - The client to recycle.
       * @param now {number} - The current time, to which the `windowMs` is added to get the `resetTime` for the client.
       *
       * @return {Client} - The modified client that was passed in, to allow for chaining.
       */
      resetClient(client, now = Date.now()) {
        client.totalHits = 0;
        client.resetTime.setTime(now + this.windowMs);
        return client;
      }
      /**
       * Retrieves or creates a client, given a key. Also ensures that the client being
       * returned is in the `current` map.
       *
       * @param key {string} - The key under which the client is (or is to be) stored.
       *
       * @returns {Client} - The requested client.
       */
      getClient(key) {
        if (this.current.has(key)) return this.current.get(key);
        let client;
        if (this.previous.has(key)) {
          client = this.previous.get(key);
          this.previous.delete(key);
        } else {
          client = { totalHits: 0, resetTime: /* @__PURE__ */ new Date() };
          this.resetClient(client);
        }
        this.current.set(key, client);
        return client;
      }
      /**
       * Move current clients to previous, create a new map for current.
       *
       * This function is called every `windowMs`.
       */
      clearExpired() {
        this.previous = this.current;
        this.current = /* @__PURE__ */ new Map();
      }
    };
    var import_node_net3 = require_node_net();
    var import_debug = __toESM(require_src(), 1);
    var ConsoleLogger = {
      warn(...args) {
        console.warn(...args.reverse());
      },
      error(...args) {
        console.error(...args.reverse());
      }
    };
    var import_node_buffer2 = require_node_buffer();
    var import_node_crypto2 = require_node_crypto();
    var SUPPORTED_DRAFT_VERSIONS = [
      "draft-6",
      "draft-7",
      "draft-8"
    ];
    var getResetSeconds = /* @__PURE__ */ __name((windowMs, resetTime) => {
      let resetSeconds;
      if (resetTime) {
        const deltaSeconds = Math.ceil((resetTime.getTime() - Date.now()) / 1e3);
        resetSeconds = Math.max(0, deltaSeconds);
      } else {
        resetSeconds = Math.ceil(windowMs / 1e3);
      }
      return resetSeconds;
    }, "getResetSeconds");
    var getPartitionKey = /* @__PURE__ */ __name((key) => {
      const hash = (0, import_node_crypto2.createHash)("sha256");
      hash.update(key);
      const partitionKey = hash.digest("hex").slice(0, 12);
      return import_node_buffer2.Buffer.from(partitionKey).toString("base64");
    }, "getPartitionKey");
    var setLegacyHeaders = /* @__PURE__ */ __name((response, info3) => {
      if (response.headersSent) return;
      response.setHeader("X-RateLimit-Limit", info3.limit.toString());
      response.setHeader("X-RateLimit-Remaining", info3.remaining.toString());
      if (info3.resetTime instanceof Date) {
        response.setHeader("Date", (/* @__PURE__ */ new Date()).toUTCString());
        response.setHeader(
          "X-RateLimit-Reset",
          Math.ceil(info3.resetTime.getTime() / 1e3).toString()
        );
      }
    }, "setLegacyHeaders");
    var setDraft6Headers = /* @__PURE__ */ __name((response, info3, windowMs) => {
      if (response.headersSent) return;
      const windowSeconds = Math.ceil(windowMs / 1e3);
      const resetSeconds = getResetSeconds(windowMs, info3.resetTime);
      response.setHeader("RateLimit-Policy", `${info3.limit};w=${windowSeconds}`);
      response.setHeader("RateLimit-Limit", info3.limit.toString());
      response.setHeader("RateLimit-Remaining", info3.remaining.toString());
      if (typeof resetSeconds === "number")
        response.setHeader("RateLimit-Reset", resetSeconds.toString());
    }, "setDraft6Headers");
    var setDraft7Headers = /* @__PURE__ */ __name((response, info3, windowMs) => {
      if (response.headersSent) return;
      const windowSeconds = Math.ceil(windowMs / 1e3);
      const resetSeconds = getResetSeconds(windowMs, info3.resetTime);
      response.setHeader("RateLimit-Policy", `${info3.limit};w=${windowSeconds}`);
      response.setHeader(
        "RateLimit",
        `limit=${info3.limit}, remaining=${info3.remaining}, reset=${resetSeconds}`
      );
    }, "setDraft7Headers");
    var setDraft8Headers = /* @__PURE__ */ __name((response, info3, windowMs, name, key) => {
      if (response.headersSent) return;
      const windowSeconds = Math.ceil(windowMs / 1e3);
      const resetSeconds = getResetSeconds(windowMs, info3.resetTime);
      const partitionKey = getPartitionKey(key);
      const header = `r=${info3.remaining}; t=${resetSeconds}`;
      const policy = `q=${info3.limit}; w=${windowSeconds}; pk=:${partitionKey}:`;
      response.append("RateLimit", `"${name}"; ${header}`);
      response.append("RateLimit-Policy", `"${name}"; ${policy}`);
    }, "setDraft8Headers");
    var setRetryAfterHeader = /* @__PURE__ */ __name((response, info3, windowMs) => {
      if (response.headersSent) return;
      const resetSeconds = getResetSeconds(windowMs, info3.resetTime);
      response.setHeader("Retry-After", resetSeconds.toString());
    }, "setRetryAfterHeader");
    var omitUndefinedProperties = /* @__PURE__ */ __name((passedOptions) => {
      const omittedOptions = {};
      for (const k of Object.keys(passedOptions)) {
        const key = k;
        if (passedOptions[key] !== void 0) {
          omittedOptions[key] = passedOptions[key];
        }
      }
      return omittedOptions;
    }, "omitUndefinedProperties");
    var import_node_net22 = require_node_net();
    var ValidationError = class extends Error {
      static {
        __name(this, "ValidationError");
      }
      /**
       * The code must be a string, in snake case and all capital, that starts with
       * the substring `ERR_ERL_`.
       *
       * The message must be a string, starting with an uppercase character,
       * describing the issue in detail.
       */
      constructor(code, message) {
        const url = `https://express-rate-limit.github.io/${code}/`;
        super(`${message} See ${url} for more information.`);
        this.name = this.constructor.name;
        this.code = code;
        this.help = url;
      }
    };
    var ChangeWarning = class extends ValidationError {
      static {
        __name(this, "ChangeWarning");
      }
    };
    var usedStores = /* @__PURE__ */ new Set();
    var singleCountKeys = /* @__PURE__ */ new WeakMap();
    var validations = {
      enabled: {
        default: true
      },
      // Should be EnabledValidations type, but that's a circular reference
      disable() {
        for (const k of Object.keys(this.enabled)) this.enabled[k] = false;
      },
      /**
       * Checks whether the IP address is valid, and that it does not have a port
       * number in it.
       *
       * See https://github.com/express-rate-limit/express-rate-limit/wiki/Error-Codes#err_erl_invalid_ip_address.
       *
       * @param ip {string | undefined} - The IP address provided by Express as request.ip.
       *
       * @returns {void}
       */
      ip(ip) {
        if (ip === void 0) {
          throw new ValidationError(
            "ERR_ERL_UNDEFINED_IP_ADDRESS",
            `An undefined 'request.ip' was detected. This might indicate a misconfiguration or the connection being destroyed prematurely.`
          );
        }
        if (!(0, import_node_net22.isIP)(ip)) {
          throw new ValidationError(
            "ERR_ERL_INVALID_IP_ADDRESS",
            `An invalid 'request.ip' (${ip}) was detected. Consider passing a custom 'keyGenerator' function to the rate limiter.`
          );
        }
      },
      /**
       * Makes sure the trust proxy setting is not set to `true`.
       *
       * See https://github.com/express-rate-limit/express-rate-limit/wiki/Error-Codes#err_erl_permissive_trust_proxy.
       *
       * @param request {Request} - The Express request object.
       *
       * @returns {void}
       */
      trustProxy(request) {
        if (request.app.get("trust proxy") === true) {
          throw new ValidationError(
            "ERR_ERL_PERMISSIVE_TRUST_PROXY",
            `The Express 'trust proxy' setting is true, which allows anyone to trivially bypass IP-based rate limiting.`
          );
        }
      },
      /**
       * Makes sure the trust proxy setting is set in case the `X-Forwarded-For`
       * header is present.
       *
       * See https://github.com/express-rate-limit/express-rate-limit/wiki/Error-Codes#err_erl_unset_trust_proxy.
       *
       * @param request {Request} - The Express request object.
       *
       * @returns {void}
       */
      xForwardedForHeader(request) {
        if (request.headers["x-forwarded-for"] && request.app.get("trust proxy") === false) {
          throw new ValidationError(
            "ERR_ERL_UNEXPECTED_X_FORWARDED_FOR",
            `The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default). This could indicate a misconfiguration which would prevent express-rate-limit from accurately identifying users.`
          );
        }
      },
      /**
       * Alert the user if the Forwarded header is set (standardized version of X-Forwarded-For - not supported by express as of version 5.1.0)
       *
       * @param request {Request} - The Express request object.
       *
       * @returns {void}
       */
      forwardedHeader(request) {
        if (request.headers.forwarded && request.ip === request.socket?.remoteAddress) {
          throw new ValidationError(
            "ERR_ERL_FORWARDED_HEADER",
            `The 'Forwarded' header (standardized X-Forwarded-For) is set but currently being ignored. Add a custom keyGenerator to use a value from this header.`
          );
        }
      },
      /**
       * Ensures totalHits value from store is a positive integer.
       *
       * @param hits {any} - The `totalHits` returned by the store.
       */
      positiveHits(hits) {
        if (typeof hits !== "number" || hits < 1 || hits !== Math.round(hits)) {
          throw new ValidationError(
            "ERR_ERL_INVALID_HITS",
            `The totalHits value returned from the store must be a positive integer, got ${hits}`
          );
        }
      },
      /**
       * Ensures a single store instance is not used with multiple express-rate-limit instances
       */
      unsharedStore(store) {
        if (usedStores.has(store)) {
          const maybeUniquePrefix = store?.localKeys ? "" : " (with a unique prefix)";
          throw new ValidationError(
            "ERR_ERL_STORE_REUSE",
            `A Store instance must not be shared across multiple rate limiters. Create a new instance of ${store.constructor.name}${maybeUniquePrefix} for each limiter instead.`
          );
        }
        usedStores.add(store);
      },
      /**
       * Ensures a given key is incremented only once per request.
       *
       * @param request {Request} - The Express request object.
       * @param store {Store} - The store class.
       * @param key {string} - The key used to store the client's hit count.
       *
       * @returns {void}
       */
      singleCount(request, store, key) {
        let storeKeys = singleCountKeys.get(request);
        if (!storeKeys) {
          storeKeys = /* @__PURE__ */ new Map();
          singleCountKeys.set(request, storeKeys);
        }
        const storeKey = store.localKeys ? store : store.constructor.name;
        let keys = storeKeys.get(storeKey);
        if (!keys) {
          keys = [];
          storeKeys.set(storeKey, keys);
        }
        const prefixedKey = `${store.prefix ?? ""}${key}`;
        if (keys.includes(prefixedKey)) {
          throw new ValidationError(
            "ERR_ERL_DOUBLE_COUNT",
            `The hit count for ${key} was incremented more than once for a single request.`
          );
        }
        keys.push(prefixedKey);
      },
      /**
       * Warns the user that the behaviour for `max: 0` / `limit: 0` is
       * changing in the next major release.
       *
       * @param limit {number} - The maximum number of hits per client.
       *
       * @returns {void}
       */
      limit(limit) {
        if (limit === 0) {
          throw new ChangeWarning(
            "WRN_ERL_MAX_ZERO",
            "Setting limit or max to 0 disables rate limiting in express-rate-limit v6 and older, but will cause all requests to be blocked in v7"
          );
        }
      },
      /**
       * Warns the user that the `draft_polli_ratelimit_headers` option is deprecated
       * and will be removed in the next major release.
       *
       * @param draft_polli_ratelimit_headers {any | undefined} - The now-deprecated setting that was used to enable standard headers.
       *
       * @returns {void}
       */
      draftPolliHeaders(draft_polli_ratelimit_headers) {
        if (draft_polli_ratelimit_headers) {
          throw new ChangeWarning(
            "WRN_ERL_DEPRECATED_DRAFT_POLLI_HEADERS",
            `The draft_polli_ratelimit_headers configuration option is deprecated and has been removed in express-rate-limit v7, please set standardHeaders: 'draft-6' instead.`
          );
        }
      },
      /**
       * Warns the user that the `onLimitReached` option is deprecated and
       * will be removed in the next major release.
       *
       * @param onLimitReached {any | undefined} - The maximum number of hits per client.
       *
       * @returns {void}
       */
      onLimitReached(onLimitReached) {
        if (onLimitReached) {
          throw new ChangeWarning(
            "WRN_ERL_DEPRECATED_ON_LIMIT_REACHED",
            "The onLimitReached configuration option is deprecated and has been removed in express-rate-limit v7."
          );
        }
      },
      /**
       * Warns the user when an invalid/unsupported version of the draft spec is passed.
       *
       * @param version {any | undefined} - The version passed by the user.
       *
       * @returns {void}
       */
      headersDraftVersion(version2) {
        if (typeof version2 !== "string" || // @ts-expect-error This is fine. If version is not in the array, it will just return false.
        !SUPPORTED_DRAFT_VERSIONS.includes(version2)) {
          const versionString = SUPPORTED_DRAFT_VERSIONS.join(", ");
          throw new ValidationError(
            "ERR_ERL_HEADERS_UNSUPPORTED_DRAFT_VERSION",
            `standardHeaders: only the following versions of the IETF draft specification are supported: ${versionString}.`
          );
        }
      },
      /**
       * Warns the user when the selected headers option requires a reset time but
       * the store does not provide one.
       *
       * @param resetTime {Date | undefined} - The timestamp when the client's hit count will be reset.
       *
       * @returns {void}
       */
      headersResetTime(resetTime) {
        if (!resetTime) {
          throw new ValidationError(
            "ERR_ERL_HEADERS_NO_RESET",
            `standardHeaders:  'draft-7' requires a 'resetTime', but the store did not provide one. The 'windowMs' value will be used instead, which may cause clients to wait longer than necessary.`
          );
        }
      },
      knownOptions(passedOptions) {
        if (!passedOptions) return;
        const optionsMap = {
          windowMs: true,
          limit: true,
          message: true,
          statusCode: true,
          legacyHeaders: true,
          standardHeaders: true,
          identifier: true,
          requestPropertyName: true,
          skipFailedRequests: true,
          skipSuccessfulRequests: true,
          keyGenerator: true,
          ipv6Subnet: true,
          handler: true,
          skip: true,
          requestWasSuccessful: true,
          store: true,
          validate: true,
          headers: true,
          max: true,
          passOnStoreError: true,
          logger: true
        };
        const validOptions = Object.keys(optionsMap).concat(
          "draft_polli_ratelimit_headers",
          // not a valid option anymore, but we have a more specific check for this one, so don't warn for it here
          // from express-slow-down - https://github.com/express-rate-limit/express-slow-down/blob/main/source/types.ts#L65
          "delayAfter",
          "delayMs",
          "maxDelayMs"
        );
        for (const key of Object.keys(passedOptions)) {
          if (!validOptions.includes(key)) {
            throw new ValidationError(
              "ERR_ERL_UNKNOWN_OPTION",
              `Unexpected configuration option: ${key}`
              // todo: suggest a valid option with a short levenstein distance?
            );
          }
        }
      },
      /**
       * Checks the options.validate setting to ensure that only recognized
       * validations are enabled or disabled.
       *
       * If any unrecognized values are found, an error is logged that
       * includes the list of supported validations.
       */
      validationsConfig() {
        const supportedValidations = Object.keys(this).filter(
          (k) => !["enabled", "disable"].includes(k)
        );
        supportedValidations.push("default");
        for (const key of Object.keys(this.enabled)) {
          if (!supportedValidations.includes(key)) {
            throw new ValidationError(
              "ERR_ERL_UNKNOWN_VALIDATION",
              `options.validate.${key} is not recognized. Supported validate options are: ${supportedValidations.join(
                ", "
              )}.`
            );
          }
        }
      },
      /**
       * Checks to see if the instance was created inside of a request handler,
       * which would prevent it from working correctly, with the default memory
       * store (or any other store with localKeys.)
       */
      creationStack(store) {
        const { stack } = new Error(
          "express-rate-limit validation check (set options.validate.creationStack=false to disable)"
        );
        if (stack?.includes("Layer.handle [as handle_request]") || // express v4
        stack?.includes("Layer.handleRequest")) {
          if (!store.localKeys) {
            throw new ValidationError(
              "ERR_ERL_CREATED_IN_REQUEST_HANDLER",
              "express-rate-limit instance should *usually* be created at app initialization, not when responding to a request."
            );
          }
          throw new ValidationError(
            "ERR_ERL_CREATED_IN_REQUEST_HANDLER",
            "express-rate-limit instance should be created at app initialization, not when responding to a request."
          );
        }
      },
      ipv6Subnet(ipv6Subnet) {
        if (ipv6Subnet === false) {
          return;
        }
        if (!Number.isInteger(ipv6Subnet) || ipv6Subnet < 32 || ipv6Subnet > 64) {
          throw new ValidationError(
            "ERR_ERL_IPV6_SUBNET",
            `Unexpected ipv6Subnet value: ${ipv6Subnet}. Expected an integer between 32 and 64 (usually 48-64).`
          );
        }
      },
      ipv6SubnetOrKeyGenerator(options) {
        if (options.ipv6Subnet !== void 0 && options.keyGenerator) {
          throw new ValidationError(
            "ERR_ERL_IPV6SUBNET_OR_KEYGENERATOR",
            `Incompatible options: the 'ipv6Subnet' option is ignored when a custom 'keyGenerator' function is also set.`
          );
        }
      },
      keyGeneratorIpFallback(keyGenerator) {
        if (!keyGenerator) {
          return;
        }
        const src = keyGenerator.toString();
        if ((src.includes("req.ip") || src.includes("request.ip")) && !src.includes("ipKeyGenerator")) {
          throw new ValidationError(
            "ERR_ERL_KEY_GEN_IPV6",
            "Custom keyGenerator appears to use request IP without calling the ipKeyGenerator helper function for IPv6 addresses. This could allow IPv6 users to bypass limits."
          );
        }
      },
      /**
       * Checks to see if the window duration is greater than 2^32 - 1. This is only
       * called by the default MemoryStore, since it uses Node's setInterval method.
       *
       * See https://nodejs.org/api/timers.html#setintervalcallback-delay-args.
       */
      windowMs(windowMs) {
        const SET_TIMEOUT_MAX = 2 ** 31 - 1;
        if (typeof windowMs !== "number" || Number.isNaN(windowMs) || windowMs < 1 || windowMs > SET_TIMEOUT_MAX) {
          throw new ValidationError(
            "ERR_ERL_WINDOW_MS",
            `Invalid windowMs value: ${windowMs}${typeof windowMs !== "number" ? ` (${typeof windowMs})` : ""}, must be a number between 1 and ${SET_TIMEOUT_MAX} when using the default MemoryStore`
          );
        }
      }
    };
    function validateLogger(logger) {
      if (typeof logger !== "object" || typeof logger.error !== "function" || typeof logger.warn !== "function") {
        throw new TypeError(
          "Provided logger does not implement the Logger interface"
        );
      }
    }
    __name(validateLogger, "validateLogger");
    var getValidations = /* @__PURE__ */ __name((_enabled, logger) => {
      validateLogger(logger);
      let enabled;
      if (typeof _enabled === "boolean") {
        enabled = {
          default: _enabled
        };
      } else {
        enabled = {
          default: true,
          ..._enabled
        };
      }
      const wrappedValidations = { enabled };
      for (const [name, validation] of Object.entries(validations)) {
        if (typeof validation === "function")
          wrappedValidations[name] = (...args) => {
            if (!(enabled[name] ?? enabled.default)) {
              return;
            }
            enabled[name] = false;
            try {
              ;
              validation.apply(
                wrappedValidations,
                args
              );
            } catch (error3) {
              if (error3 instanceof ChangeWarning) logger.warn(error3);
              else logger.error(error3);
            }
          };
      }
      const inspect = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
      if (inspect)
        wrappedValidations[inspect] = () => wrappedValidations.enabled;
      return wrappedValidations;
    }, "getValidations");
    var isLegacyStore = /* @__PURE__ */ __name((store) => (
      // Check that `incr` exists but `increment` does not - store authors might want
      // to keep both around for backwards compatibility.
      typeof store.incr === "function" && typeof store.increment !== "function"
    ), "isLegacyStore");
    var promisifyStore = /* @__PURE__ */ __name((passedStore) => {
      if (!isLegacyStore(passedStore)) {
        return passedStore;
      }
      const legacyStore = passedStore;
      class PromisifiedStore {
        static {
          __name(this, "PromisifiedStore");
        }
        async increment(key) {
          return new Promise((resolve, reject) => {
            legacyStore.incr(
              key,
              (error3, totalHits, resetTime) => {
                if (error3) reject(error3);
                resolve({ totalHits, resetTime });
              }
            );
          });
        }
        async decrement(key) {
          return legacyStore.decrement(key);
        }
        async resetKey(key) {
          return legacyStore.resetKey(key);
        }
        /* istanbul ignore next */
        async resetAll() {
          if (typeof legacyStore.resetAll === "function")
            return legacyStore.resetAll();
        }
      }
      return new PromisifiedStore();
    }, "promisifyStore");
    var getOptionsFromConfig = /* @__PURE__ */ __name((config2) => {
      const { validations: validations2, ...directlyPassableEntries } = config2;
      return {
        ...directlyPassableEntries,
        validate: validations2.enabled
      };
    }, "getOptionsFromConfig");
    var parseOptions = /* @__PURE__ */ __name((passedOptions) => {
      const notUndefinedOptions = omitUndefinedProperties(passedOptions);
      const logger = passedOptions.logger ?? ConsoleLogger;
      const validations2 = getValidations(
        notUndefinedOptions?.validate ?? true,
        logger
      );
      validations2.validationsConfig();
      validations2.knownOptions(passedOptions);
      validations2.draftPolliHeaders(
        // @ts-expect-error see the note above.
        notUndefinedOptions.draft_polli_ratelimit_headers
      );
      validations2.onLimitReached(notUndefinedOptions.onLimitReached);
      if (notUndefinedOptions.ipv6Subnet !== void 0 && typeof notUndefinedOptions.ipv6Subnet !== "function") {
        validations2.ipv6Subnet(notUndefinedOptions.ipv6Subnet);
      }
      validations2.keyGeneratorIpFallback(notUndefinedOptions.keyGenerator);
      validations2.ipv6SubnetOrKeyGenerator(notUndefinedOptions);
      let standardHeaders = notUndefinedOptions.standardHeaders ?? false;
      if (standardHeaders === true) standardHeaders = "draft-6";
      const config2 = {
        windowMs: 60 * 1e3,
        limit: passedOptions.max ?? 5,
        // `max` is deprecated, but support it anyways.
        message: "Too many requests, please try again later.",
        statusCode: 429,
        legacyHeaders: passedOptions.headers ?? true,
        identifier(request, _response) {
          let duration = "";
          const property = config2.requestPropertyName;
          const { limit } = request[property];
          const seconds = config2.windowMs / 1e3;
          const minutes = config2.windowMs / (1e3 * 60);
          const hours = config2.windowMs / (1e3 * 60 * 60);
          const days = config2.windowMs / (1e3 * 60 * 60 * 24);
          if (seconds < 60) duration = `${seconds}sec`;
          else if (minutes < 60) duration = `${minutes}min`;
          else if (hours < 24) duration = `${hours}hr${hours > 1 ? "s" : ""}`;
          else duration = `${days}day${days > 1 ? "s" : ""}`;
          return `${limit}-in-${duration}`;
        },
        requestPropertyName: "rateLimit",
        skipFailedRequests: false,
        skipSuccessfulRequests: false,
        requestWasSuccessful: /* @__PURE__ */ __name((_request, response) => response.statusCode < 400, "requestWasSuccessful"),
        skip: /* @__PURE__ */ __name((_request, _response) => false, "skip"),
        async keyGenerator(request, response) {
          validations2.ip(request.ip);
          validations2.trustProxy(request);
          validations2.xForwardedForHeader(request);
          validations2.forwardedHeader(request);
          const ip = request.ip;
          let subnet = 56;
          if ((0, import_node_net3.isIPv6)(ip)) {
            subnet = typeof config2.ipv6Subnet === "function" ? await config2.ipv6Subnet(request, response) : config2.ipv6Subnet;
            if (typeof config2.ipv6Subnet === "function")
              validations2.ipv6Subnet(subnet);
          }
          return ipKeyGenerator(ip, subnet);
        },
        ipv6Subnet: 56,
        async handler(request, response, _next, _optionsUsed) {
          response.status(config2.statusCode);
          const message = typeof config2.message === "function" ? await config2.message(
            request,
            response
          ) : config2.message;
          if (!response.writableEnded) response.send(message);
        },
        passOnStoreError: false,
        // Allow the default options to be overridden by the passed options.
        ...notUndefinedOptions,
        // `standardHeaders` is resolved into a draft version above, use that.
        standardHeaders,
        // Note that this field is declared after the user's options are spread in,
        // so that this field doesn't get overridden with an un-promisified store!
        store: promisifyStore(
          notUndefinedOptions.store ?? new MemoryStore(validations2)
        ),
        // Print an error to the console if a few known misconfigurations are detected.
        validations: validations2,
        logger
      };
      if (typeof config2.store.increment !== "function" || typeof config2.store.decrement !== "function" || typeof config2.store.resetKey !== "function" || config2.store.resetAll !== void 0 && typeof config2.store.resetAll !== "function" || config2.store.init !== void 0 && typeof config2.store.init !== "function") {
        throw new TypeError(
          "An invalid store was passed. Please ensure that the store is a class that implements the `Store` interface."
        );
      }
      return config2;
    }, "parseOptions");
    var handleAsyncErrors = /* @__PURE__ */ __name((fn) => async (request, response, next) => {
      try {
        await Promise.resolve(fn(request, response, next)).catch(next);
      } catch (error3) {
        next(error3);
      }
    }, "handleAsyncErrors");
    var rateLimit = /* @__PURE__ */ __name((passedOptions) => {
      const config2 = parseOptions(passedOptions ?? {});
      const options = getOptionsFromConfig(config2);
      const debug3 = (0, import_debug.default)("express-rate-limit");
      debug3("creating new rate limiter with %o", config2.store.constructor.name);
      for (const [key, val] of Object.entries(config2))
        debug3("set %s to %o", key, val);
      config2.validations.creationStack(config2.store);
      config2.validations.unsharedStore(config2.store);
      if (typeof config2.store.init === "function") {
        debug3("executing init for store");
        try {
          const storeInit = config2.store.init(options);
          if (storeInit instanceof Promise) {
            storeInit.catch(
              (error3) => config2.logger.error(
                error3,
                "express-rate-limit: async error during store initialization."
              )
            );
          }
        } catch (error3) {
          config2.logger.error(
            error3,
            "express-rate-limit: error during store initialization."
          );
        }
      }
      const middleware = handleAsyncErrors(
        async (request, response, next) => {
          const closePromise = config2.skipFailedRequests && new Promise((resolve) => response.once("close", resolve));
          const finishPromise = (config2.skipFailedRequests || config2.skipSuccessfulRequests) && new Promise((resolve) => response.once("finish", resolve));
          const errorPromise = config2.skipFailedRequests && new Promise((resolve) => response.once("error", resolve));
          debug3("requested %o", request.originalUrl);
          debug3("request from ip %o", request.ip);
          const skip = await config2.skip(request, response);
          if (skip) {
            debug3("skipping request");
            next();
            return;
          }
          const augmentedRequest = request;
          const key = await config2.keyGenerator(request, response);
          debug3("computed key %o", key);
          debug3("incrementing count");
          let totalHits = 0;
          let resetTime;
          try {
            const incrementResult = await config2.store.increment(key);
            totalHits = incrementResult.totalHits;
            resetTime = incrementResult.resetTime;
          } catch (error3) {
            if (config2.passOnStoreError) {
              config2.logger.error(
                error3,
                "express-rate-limit: error from store, allowing request without rate-limiting."
              );
              next();
              return;
            }
            throw error3;
          }
          config2.validations.positiveHits(totalHits);
          config2.validations.singleCount(request, config2.store, key);
          const retrieveLimit = typeof config2.limit === "function" ? config2.limit(request, response) : config2.limit;
          const limit = await retrieveLimit;
          config2.validations.limit(limit);
          const info3 = {
            limit,
            used: totalHits,
            remaining: Math.max(limit - totalHits, 0),
            resetTime,
            key
          };
          for (const [key2, val] of Object.entries(info3))
            debug3(
              "set request.%s.%s to be %o",
              config2.requestPropertyName,
              key2,
              val
            );
          Object.defineProperty(info3, "current", {
            configurable: false,
            enumerable: false,
            value: totalHits
          });
          augmentedRequest[config2.requestPropertyName] = info3;
          if (config2.legacyHeaders && !response.headersSent) {
            debug3("set legacy headers");
            setLegacyHeaders(response, info3);
          }
          if (config2.standardHeaders && !response.headersSent) {
            switch (config2.standardHeaders) {
              case "draft-6": {
                debug3("set ietf draft 6 headers");
                setDraft6Headers(response, info3, config2.windowMs);
                break;
              }
              case "draft-7": {
                debug3("set ietf draft 7 headers");
                config2.validations.headersResetTime(info3.resetTime);
                setDraft7Headers(response, info3, config2.windowMs);
                break;
              }
              case "draft-8": {
                const retrieveName = typeof config2.identifier === "function" ? config2.identifier(request, response) : config2.identifier;
                const name = await retrieveName;
                debug3("set ietf draft 8 headers");
                debug3("set name to %o", name);
                config2.validations.headersResetTime(info3.resetTime);
                setDraft8Headers(response, info3, config2.windowMs, name, key);
                break;
              }
              default: {
                config2.validations.headersDraftVersion(config2.standardHeaders);
                break;
              }
            }
          }
          if (config2.skipFailedRequests || config2.skipSuccessfulRequests) {
            let decremented = false;
            const decrementKey = /* @__PURE__ */ __name(async () => {
              if (!decremented) {
                if (resetTime && Date.now() >= resetTime.getTime()) {
                  return;
                }
                debug3("decrementing count");
                await config2.store.decrement(key);
                decremented = true;
              }
            }, "decrementKey");
            if (config2.skipFailedRequests) {
              if (finishPromise) {
                void finishPromise.then(async () => {
                  const success = await config2.requestWasSuccessful(
                    request,
                    response
                  );
                  debug3("computed requestWasSuccessful as %o", success);
                  if (!success) await decrementKey();
                });
              }
              if (closePromise) {
                void closePromise.then(async () => {
                  if (!response.writableEnded) await decrementKey();
                });
              }
              if (errorPromise) {
                void errorPromise.then(async () => {
                  await decrementKey();
                });
              }
            }
            if (config2.skipSuccessfulRequests) {
              if (finishPromise) {
                void finishPromise.then(async () => {
                  const success = await config2.requestWasSuccessful(
                    request,
                    response
                  );
                  debug3("computed requestWasSuccessful as %o", success);
                  if (success) await decrementKey();
                });
              }
            }
          }
          if (totalHits > limit) {
            debug3("limit exceeded");
            if (config2.legacyHeaders || config2.standardHeaders) {
              debug3("set retry-after header");
              setRetryAfterHeader(response, info3, config2.windowMs);
            }
            config2.handler(request, response, next, options);
            return;
          }
          next();
        }
      );
      const getThrowFn = /* @__PURE__ */ __name(() => {
        throw new Error("The current store does not support the get/getKey method");
      }, "getThrowFn");
      middleware.resetKey = config2.store.resetKey.bind(config2.store);
      middleware.getKey = typeof config2.store.get === "function" ? config2.store.get.bind(config2.store) : getThrowFn;
      return middleware;
    }, "rateLimit");
    var rate_limit_default = rateLimit;
    var SECOND = 1e3;
    var MINUTE = 60 * SECOND;
    var HOUR = 60 * MINUTE;
    var DAY = 24 * HOUR;
    module.exports = Object.assign(rateLimit, module.exports);
  }
});

// middleware/security.js
var require_security = __commonJS({
  "middleware/security.js"(exports, module) {
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
    init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
    init_performance2();
    var crypto = require_node_crypto();
    var rateLimit = require_dist();
    var SECURITY_SECRET = process.env.APP_SECURITY_SECRET || "it_asset_hub_enterprise_secret_key_2026_q98f4h";
    var loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1e3,
      // 15 minutes
      max: 10,
      // Limit each IP to 10 login requests per 15 mins
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        ok: false,
        message: "\u26A0\uFE0F \u0E21\u0E35\u0E01\u0E32\u0E23\u0E1E\u0E22\u0E32\u0E22\u0E32\u0E21\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E21\u0E32\u0E01\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B \u0E01\u0E23\u0E38\u0E13\u0E32\u0E23\u0E2D 15 \u0E19\u0E32\u0E17\u0E35\u0E41\u0E25\u0E49\u0E27\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07 (Rate limit exceeded)"
      }
    });
    var apiLimiter = rateLimit({
      windowMs: 1 * 60 * 1e3,
      // 1 minute
      max: 300,
      // Limit each IP to 300 requests per minute
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        ok: false,
        message: "\u26A0\uFE0F \u0E04\u0E33\u0E02\u0E2D\u0E16\u0E35\u0E48\u0E40\u0E01\u0E34\u0E19\u0E44\u0E1B \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07\u0E43\u0E19\u0E20\u0E32\u0E22\u0E2B\u0E25\u0E31\u0E07"
      }
    });
    function generateSignedToken2(payloadObj, expiresInHours = 24) {
      const exp = Date.now() + expiresInHours * 60 * 60 * 1e3;
      const payloadStr = JSON.stringify({ ...payloadObj, exp, nonce: crypto.randomBytes(8).toString("hex") });
      const b64Payload = Buffer.from(payloadStr).toString("base64url");
      const signature = crypto.createHmac("sha256", SECURITY_SECRET).update(b64Payload).digest("base64url");
      return `${b64Payload}.${signature}`;
    }
    __name(generateSignedToken2, "generateSignedToken");
    function verifySignedToken2(tokenStr) {
      if (!tokenStr || typeof tokenStr !== "string") return { valid: false, reason: "Missing token" };
      const parts = tokenStr.trim().replace(/^Bearer\s+/i, "").split(".");
      if (parts.length !== 2) return { valid: false, reason: "Malformed token" };
      const [b64Payload, signature] = parts;
      const expectedSig = crypto.createHmac("sha256", SECURITY_SECRET).update(b64Payload).digest("base64url");
      if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
        try {
          const payload = JSON.parse(Buffer.from(b64Payload, "base64url").toString("utf8"));
          if (Date.now() > payload.exp) {
            return { valid: false, reason: "Token expired" };
          }
          return { valid: true, payload };
        } catch (e) {
          return { valid: false, reason: "Corrupt payload" };
        }
      }
      return { valid: false, reason: "Invalid signature" };
    }
    __name(verifySignedToken2, "verifySignedToken");
    function requireAdminAuth(req, res, next) {
      const authHeader = req.headers.authorization || req.headers["x-admin-token"] || req.query.token;
      const verification = verifySignedToken2(authHeader);
      if (!verification.valid) {
        return res.status(401).json({
          ok: false,
          code: "UNAUTHORIZED",
          message: "\u26A0\uFE0F \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15: \u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u0E2B\u0E23\u0E37\u0E2D Session \u0E2B\u0E21\u0E14\u0E2D\u0E32\u0E22\u0E38 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E2D\u0E14\u0E21\u0E34\u0E19\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07"
        });
      }
      const role = verification.payload.role;
      if (role !== "ADMIN" && role !== "IT") {
        return res.status(403).json({
          ok: false,
          code: "FORBIDDEN",
          message: "\u26A0\uFE0F \u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E44\u0E21\u0E48\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E1E\u0E2D: \u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E14\u0E33\u0E40\u0E19\u0E34\u0E19\u0E01\u0E32\u0E23\u0E02\u0E2D\u0E07\u0E1C\u0E39\u0E49\u0E14\u0E39\u0E41\u0E25\u0E23\u0E30\u0E1A\u0E1A (Admin Only)"
        });
      }
      req.user = verification.payload;
      next();
    }
    __name(requireAdminAuth, "requireAdminAuth");
    function requireLifecycleAuth(req, res, next) {
      const authHeader = req.headers.authorization || req.headers["x-lifecycle-token"] || req.query.token;
      const verification = verifySignedToken2(authHeader);
      if (!verification.valid) {
        return res.status(401).json({
          ok: false,
          code: "UNAUTHORIZED",
          message: "\u26A0\uFE0F \u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15: \u0E01\u0E23\u0E38\u0E13\u0E32\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E15\u0E31\u0E27\u0E15\u0E19\u0E40\u0E08\u0E49\u0E32\u0E2B\u0E19\u0E49\u0E32\u0E17\u0E35\u0E48 (HR / Admin / IT) \u0E01\u0E48\u0E2D\u0E19\u0E17\u0E33\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23"
        });
      }
      const role = verification.payload.role;
      if (!["HR", "ADMIN", "IT"].includes(role)) {
        return res.status(403).json({
          ok: false,
          code: "FORBIDDEN",
          message: "\u26A0\uFE0F \u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E44\u0E21\u0E48\u0E40\u0E1E\u0E35\u0E22\u0E07\u0E1E\u0E2D: \u0E1A\u0E31\u0E0D\u0E0A\u0E35\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E21\u0E35\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E40\u0E02\u0E49\u0E32\u0E16\u0E36\u0E07\u0E2A\u0E48\u0E27\u0E19\u0E2A\u0E48\u0E07\u0E15\u0E48\u0E2D\u0E07\u0E32\u0E19 3 \u0E1D\u0E48\u0E32\u0E22"
        });
      }
      req.user = verification.payload;
      next();
    }
    __name(requireLifecycleAuth, "requireLifecycleAuth");
    function sanitizeString2(str, maxLength = 255) {
      if (typeof str !== "string") return "";
      return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim().slice(0, maxLength);
    }
    __name(sanitizeString2, "sanitizeString");
    module.exports = {
      loginLimiter,
      apiLimiter,
      generateSignedToken: generateSignedToken2,
      verifySignedToken: verifySignedToken2,
      requireAdminAuth,
      requireLifecycleAuth,
      sanitizeString: sanitizeString2
    };
  }
});

// worker.js
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_process();
init_virtual_unenv_global_polyfill_cloudflare_unenv_preset_node_console();
init_performance2();
var LarkDirectApi = require_larkDirectApi();
var { generateSignedToken, verifySignedToken, sanitizeString } = require_security();
var TABLE_MASTER = "tblA1JXS2dWC9a5b";
var TABLE_AUDIT = "tblzKjtJuoAifQKS";
var TABLE_LOAN = "tblwL0cJzvv1qsj3";
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "X-Content-Type-Options": "nosniff"
    }
  });
}
__name(jsonResponse, "jsonResponse");
function getSingleValue(val) {
  if (!val) return "";
  if (Array.isArray(val)) return val[0] || "";
  if (typeof val === "object" && val.text) return val.text;
  return String(val);
}
__name(getSingleValue, "getSingleValue");
function getHolderName(holder) {
  if (!holder) return "";
  if (Array.isArray(holder) && holder[0]) return holder[0].name || holder[0].id || "";
  if (typeof holder === "object" && holder.name) return holder.name;
  return String(holder);
}
__name(getHolderName, "getHolderName");
function requireAdmin(request) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const verified = verifySignedToken(token);
  if (!verified || verified.role !== "ADMIN") {
    return false;
  }
  return verified;
}
__name(requireAdmin, "requireAdmin");
function requireLifecycle(request) {
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const verified = verifySignedToken(token);
  if (!verified || !verified.role) {
    return false;
  }
  return verified;
}
__name(requireLifecycle, "requireLifecycle");
var worker_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();
    if (method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    const appSecret = env2.LARK_APP_SECRET || "qmzk77vbQMpFtUP66JRr1ebJPyqHooD5";
    const lark = new LarkDirectApi(env2.LARK_APP_ID, appSecret, env2.BASE_TOKEN || "G2IgbTgmmaLnQPs3LPblGz0ngQf");
    try {
      if (pathname === "/api/assets" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_MASTER);
        return jsonResponse({ ok: true, count: records.length, data: records });
      }
      if (pathname === "/api/employees" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_MASTER);
        let resignedNames = [];
        if (env2.IT_ASSET_KV) {
          const resJson = await env2.IT_ASSET_KV.get("resigned_staff");
          if (resJson) resignedNames = JSON.parse(resJson);
        }
        const employeeMap = {};
        records.forEach((a) => {
          const holder = a["Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)"];
          let empName = "\u0E2A\u0E48\u0E27\u0E19\u0E01\u0E25\u0E32\u0E07 (Unassigned / Central Stock)";
          let openId = "";
          let org = getSingleValue(a["Organization (\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14)"]) || "XPO";
          if (Array.isArray(holder) && holder[0]) {
            empName = holder[0].name || holder[0].id;
            openId = holder[0].id || "";
          } else if (typeof holder === "object" && holder.name) {
            empName = holder.name;
            openId = holder.id || "";
          }
          if (!employeeMap[empName]) {
            employeeMap[empName] = {
              id: openId,
              name: empName,
              organization: org,
              isResigned: empName.includes("(\u0E25\u0E32\u0E2D\u0E2D\u0E01)") || empName.includes("Closed") || resignedNames.includes(empName),
              devices: []
            };
          }
          employeeMap[empName].devices.push(a);
        });
        const list = Object.values(employeeMap).sort((a, b) => a.name.localeCompare(b.name));
        return jsonResponse({ ok: true, count: list.length, data: list });
      }
      if (pathname === "/api/verify" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { record_id, status, notes, photoUrl, assetTag, serialNumber } = body;
        if (!record_id) return jsonResponse({ ok: false, message: "record_id is required" }, 400);
        const patch = {
          "Audit Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19)": status || "\u{1F7E2} \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27 (Verified)"
        };
        if (notes) patch["Specs / Notes (\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14/\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38)"] = sanitizeString(notes, 500);
        if (assetTag) patch["Asset Tag (\u0E40\u0E25\u0E02\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E2A\u0E34\u0E19)"] = sanitizeString(assetTag, 50);
        if (serialNumber) patch["Serial Number (S/N)"] = sanitizeString(serialNumber, 50);
        await lark.updateRecord(TABLE_MASTER, record_id, patch);
        await lark.createRecord(TABLE_AUDIT, {
          "Brand & Model (\u0E22\u0E35\u0E48\u0E2B\u0E49\u0E2D\u0E41\u0E25\u0E30\u0E23\u0E38\u0E48\u0E19)": `Verified: ${record_id}`,
          "IT Review Status (\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E42\u0E14\u0E22 IT)": status || "\u{1F7E2} Verified & Locked (\u0E2D\u0E19\u0E38\u0E21\u0E31\u0E15\u0E34\u0E40\u0E02\u0E49\u0E32 Master)",
          "Notes (\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38\u0E08\u0E32\u0E01\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19)": sanitizeString(notes, 500)
        }).catch(() => null);
        return jsonResponse({ ok: true, message: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27!" });
      }
      if (pathname === "/api/register" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { brand, deviceName, deviceType, organization, serialNumber, assetTag, missingTag, holderName, notes } = body;
        const newRec = {
          "Brand (\u0E22\u0E35\u0E48\u0E2B\u0E49\u0E2D)": brand || "Other",
          "Device Name (\u0E0A\u0E37\u0E48\u0E2D\u0E23\u0E38\u0E48\u0E19/\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)": deviceName || "IT Asset",
          "Device Type (\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)": deviceType || "Laptop (NB)",
          "Organization (\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14)": organization || "XPO",
          "Serial Number (S/N)": serialNumber || "-",
          "Asset Tag (\u0E40\u0E25\u0E02\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E2A\u0E34\u0E19)": missingTag ? "\u0E44\u0E21\u0E48\u0E17\u0E23\u0E32\u0E1A" : assetTag || "\u0E44\u0E21\u0E48\u0E17\u0E23\u0E32\u0E1A",
          "Missing Tag? (\u0E44\u0E21\u0E48\u0E21\u0E35\u0E40\u0E25\u0E02\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E2A\u0E34\u0E19)": Boolean(missingTag),
          "Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)": "\u{1F7E2} \u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E1B\u0E23\u0E30\u0E08\u0E33\u0E15\u0E31\u0E27 (In Use)",
          "Audit Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19)": missingTag ? "\u{1F3F7}\uFE0F \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E34\u0E14\u0E1B\u0E49\u0E32\u0E22\u0E40\u0E25\u0E02\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E2A\u0E34\u0E19\u0E43\u0E2B\u0E21\u0E48 (Missing Tag)" : "\u{1F7E2} \u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27 (Verified)",
          "Specs / Notes (\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14/\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38)": sanitizeString(notes, 500)
        };
        if (holderName) {
          newRec["Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)"] = [{ name: holderName }];
        }
        await lark.createRecord(TABLE_MASTER, newRec);
        return jsonResponse({ ok: true, message: "\u0E25\u0E07\u0E17\u0E30\u0E40\u0E1A\u0E35\u0E22\u0E19\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E43\u0E2B\u0E21\u0E48\u0E40\u0E02\u0E49\u0E32\u0E23\u0E30\u0E1A\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27!" });
      }
      if (pathname === "/api/loans" && method === "GET") {
        const records = await lark.fetchRecords(TABLE_LOAN);
        return jsonResponse({ ok: true, count: records.length, data: records });
      }
      if (pathname === "/api/loans/borrow" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { borrowerName, organization, assetRecordId, startDate, expectedReturnDate, purpose, accessories } = body;
        await lark.createRecord(TABLE_LOAN, {
          "Action Type (\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23)": "\u0E22\u0E37\u0E21\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C (Borrow)",
          "Borrower (\u0E1C\u0E39\u0E49\u0E02\u0E2D\u0E22\u0E37\u0E21/\u0E1C\u0E39\u0E49\u0E04\u0E37\u0E19)": [{ name: borrowerName }],
          "Organization (\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14)": organization || "XPO",
          "Linked Asset (\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E17\u0E35\u0E48\u0E22\u0E37\u0E21)": assetRecordId ? [assetRecordId] : [],
          "Borrow Date (\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E23\u0E34\u0E48\u0E21\u0E22\u0E37\u0E21)": startDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
          "Expected Return Date (\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E2A\u0E48\u0E07\u0E04\u0E37\u0E19)": expectedReturnDate,
          "Purpose (\u0E27\u0E31\u0E15\u0E16\u0E38\u0E1B\u0E23\u0E30\u0E2A\u0E07\u0E04\u0E4C\u0E01\u0E32\u0E23\u0E22\u0E37\u0E21)": purpose || "\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27",
          "Accessories Included (\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E2A\u0E48\u0E27\u0E19\u0E04\u0E27\u0E1A)": accessories || "\u0E2A\u0E32\u0E22\u0E0A\u0E32\u0E23\u0E4C\u0E08/\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E04\u0E23\u0E1A",
          "Loan Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E22\u0E37\u0E21-\u0E04\u0E37\u0E19)": "\u{1F7E1} On Loan (\u0E01\u0E33\u0E25\u0E31\u0E07\u0E22\u0E37\u0E21)"
        });
        if (assetRecordId) {
          await lark.updateRecord(TABLE_MASTER, assetRecordId, {
            "Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)": "\u{1F7E1} \u0E22\u0E37\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E0A\u0E31\u0E48\u0E27\u0E04\u0E23\u0E32\u0E27 (On Loan)",
            "Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)": [{ name: borrowerName }]
          }).catch(() => null);
        }
        return jsonResponse({ ok: true, message: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E01\u0E32\u0E23\u0E22\u0E37\u0E21\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27!" });
      }
      if (pathname === "/api/loans/return" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const { loanRecordId, assetRecordId, returnCondition, returnNotes } = body;
        if (loanRecordId) {
          await lark.updateRecord(TABLE_LOAN, loanRecordId, {
            "Actual Return Date (\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E2A\u0E48\u0E07\u0E04\u0E37\u0E19\u0E08\u0E23\u0E34\u0E07)": (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            "Loan Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E22\u0E37\u0E21-\u0E04\u0E37\u0E19)": "\u{1F535} Returned - Complete (\u0E04\u0E37\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22 \u0E2A\u0E21\u0E1A\u0E39\u0E23\u0E13\u0E4C)",
            "Notes (\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38)": sanitizeString(returnNotes, 500)
          }).catch(() => null);
        }
        if (assetRecordId) {
          await lark.updateRecord(TABLE_MASTER, assetRecordId, {
            "Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)": "\u{1F535} \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E43\u0E19\u0E04\u0E25\u0E31\u0E07 (Available in Stock)",
            "Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)": null,
            "Specs / Notes (\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14/\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38)": `\u0E04\u0E37\u0E19\u0E40\u0E02\u0E49\u0E32\u0E04\u0E25\u0E31\u0E07: ${sanitizeString(returnNotes || returnCondition || "\u0E04\u0E37\u0E19\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22", 200)}`
          }).catch(() => null);
        }
        return jsonResponse({ ok: true, message: "\u0E23\u0E31\u0E1A\u0E04\u0E37\u0E19\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E40\u0E02\u0E49\u0E32\u0E04\u0E25\u0E31\u0E07\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27!" });
      }
      if (pathname === "/api/users/search" && method === "GET") {
        const q = url.searchParams.get("q") || "";
        const users = await lark.searchUsers(q);
        return jsonResponse({ ok: true, data: users });
      }
      if (pathname === "/api/admin/login" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const adminPass = env2.ADMIN_PASSWORD || "itadmin2026";
        if (body.password && body.password.trim() === adminPass) {
          const token = generateSignedToken({ role: "ADMIN", user: "IT Admin" }, 24);
          return jsonResponse({ ok: true, token, message: "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A\u0E41\u0E2D\u0E14\u0E21\u0E34\u0E19\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08" });
        }
        return jsonResponse({ ok: false, message: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 \u0E01\u0E23\u0E38\u0E13\u0E32\u0E25\u0E2D\u0E07\u0E43\u0E2B\u0E21\u0E48\u0E2D\u0E35\u0E01\u0E04\u0E23\u0E31\u0E49\u0E07" }, 401);
      }
      if (pathname === "/api/admin/stats" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED", message: "\u0E2A\u0E34\u0E17\u0E18\u0E34\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07" }, 401);
        const assets = await lark.fetchRecords(TABLE_MASTER);
        let verifiedCount = 0;
        let pendingCount = 0;
        let missingTagCount = 0;
        let disputeCount = 0;
        let onLoanCount = 0;
        let availableCount = 0;
        let orgStats = { XPO: { total: 0, verified: 0 }, EDDU: { total: 0, verified: 0 }, Other: { total: 0, verified: 0 } };
        let unconfirmed = /* @__PURE__ */ new Set();
        assets.forEach((a) => {
          const status = getSingleValue(a["Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)"]);
          const auditStatus = getSingleValue(a["Audit Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19)"]);
          const org = getSingleValue(a["Organization (\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14)"]) || "Other";
          const orgKey = org.includes("XPO") ? "XPO" : org.includes("EDDU") ? "EDDU" : "Other";
          orgStats[orgKey].total++;
          const holder = getHolderName(a["Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)"]);
          if (auditStatus.includes("\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19\u0E41\u0E25\u0E49\u0E27")) {
            verifiedCount++;
            orgStats[orgKey].verified++;
          } else if (auditStatus.includes("\u0E02\u0E31\u0E14\u0E41\u0E22\u0E49\u0E07")) {
            disputeCount++;
          } else {
            pendingCount++;
            if (holder && !holder.includes("\u0E2A\u0E48\u0E27\u0E19\u0E01\u0E25\u0E32\u0E07")) unconfirmed.add(holder);
          }
          if (status.includes("\u0E22\u0E37\u0E21") || status.includes("On Loan")) onLoanCount++;
          else if (status.includes("\u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19") || status.includes("Available")) availableCount++;
          if (a["Missing Tag? (\u0E44\u0E21\u0E48\u0E21\u0E35\u0E40\u0E25\u0E02\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E2A\u0E34\u0E19)"]) missingTagCount++;
        });
        return jsonResponse({
          ok: true,
          totalAssets: assets.length,
          verifiedCount,
          pendingCount,
          missingTagCount,
          disputeCount,
          onLoanCount,
          availableCount,
          overallPercent: assets.length > 0 ? Math.round(verifiedCount / assets.length * 100) : 0,
          xpoPercent: orgStats.XPO.total > 0 ? Math.round(orgStats.XPO.verified / orgStats.XPO.total * 100) : 0,
          edduPercent: orgStats.EDDU.total > 0 ? Math.round(orgStats.EDDU.verified / orgStats.EDDU.total * 100) : 0,
          orgStats,
          unconfirmedEmployees: Array.from(unconfirmed)
        });
      }
      if (pathname === "/api/admin/duplicates" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const assets = await lark.fetchRecords(TABLE_MASTER);
        const reportedDuplicates = assets.filter((a) => {
          const auditStatus = getSingleValue(a["Audit Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19)"]);
          const notes = a["Specs / Notes (\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14/\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38)"] || "";
          return auditStatus.includes("Disputed") || auditStatus.includes("\u0E41\u0E08\u0E49\u0E07\u0E0B\u0E49\u0E33") || notes.includes("DUPLICATE_ENTRY");
        });
        const snGroups = {};
        assets.forEach((a) => {
          const sn = (a["Serial Number (S/N)"] || "").trim();
          if (sn && sn !== "---" && sn.toLowerCase() !== "none" && sn !== "-" && sn.length >= 4) {
            if (!snGroups[sn]) snGroups[sn] = [];
            snGroups[sn].push(a);
          }
        });
        const duplicateSnGroups = Object.keys(snGroups).filter((sn) => snGroups[sn].length > 1).map((sn) => ({ sn, count: snGroups[sn].length, items: snGroups[sn] }));
        return jsonResponse({
          ok: true,
          reportedCount: reportedDuplicates.length,
          reportedList: reportedDuplicates,
          detectedSnGroupCount: duplicateSnGroups.length,
          detectedSnGroups: duplicateSnGroups
        });
      }
      if (pathname === "/api/admin/duplicates/batch-delete" && method === "POST") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { recordIds } = await request.json().catch(() => ({}));
        if (!recordIds || !Array.isArray(recordIds) || recordIds.length === 0) {
          return jsonResponse({ ok: false, message: "recordIds required" }, 400);
        }
        await lark.batchDeleteRecords(TABLE_MASTER, recordIds);
        return jsonResponse({ ok: true, message: `\u0E25\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E0B\u0E49\u0E33\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08 ${recordIds.length} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23!` });
      }
      if (pathname === "/api/admin/resigned" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const assets = await lark.fetchRecords(TABLE_MASTER);
        let resignedNames = [];
        if (env2.IT_ASSET_KV) {
          const kvData = await env2.IT_ASSET_KV.get("resigned_staff");
          if (kvData) resignedNames = JSON.parse(kvData);
        }
        const employeeMap = {};
        assets.forEach((a) => {
          const holder = getHolderName(a["Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)"]);
          if (!holder || holder.includes("\u0E2A\u0E48\u0E27\u0E19\u0E01\u0E25\u0E32\u0E07")) return;
          if (!employeeMap[holder]) {
            employeeMap[holder] = {
              name: holder,
              organization: getSingleValue(a["Organization (\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14)"]) || "XPO",
              isResigned: holder.includes("(\u0E25\u0E32\u0E2D\u0E2D\u0E01)") || holder.includes("Closed") || resignedNames.includes(holder),
              devices: []
            };
          }
          employeeMap[holder].devices.push(a);
        });
        const resignedList = Object.values(employeeMap).filter((e) => e.isResigned);
        const totalDevices = resignedList.reduce((acc, curr) => acc + curr.devices.length, 0);
        return jsonResponse({
          ok: true,
          resignedCount: resignedList.length,
          totalDevicesCount: totalDevices,
          resignedEmployees: resignedList
        });
      }
      if (pathname === "/api/admin/resigned/mark" && method === "POST") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { employeeName } = await request.json().catch(() => ({}));
        if (!employeeName) return jsonResponse({ ok: false, message: "employeeName required" }, 400);
        let list = [];
        if (env2.IT_ASSET_KV) {
          const raw = await env2.IT_ASSET_KV.get("resigned_staff");
          if (raw) list = JSON.parse(raw);
          if (!list.includes(employeeName)) list.push(employeeName);
          await env2.IT_ASSET_KV.put("resigned_staff", JSON.stringify(list));
        }
        return jsonResponse({ ok: true, message: `\u0E23\u0E30\u0E1A\u0E38 ${employeeName} \u0E40\u0E1B\u0E47\u0E19\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19\u0E25\u0E32\u0E2D\u0E2D\u0E01\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27` });
      }
      if (pathname === "/api/admin/resigned/reclaim" && method === "POST") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { employeeName, recordIds } = await request.json().catch(() => ({}));
        const assets = await lark.fetchRecords(TABLE_MASTER);
        let targets = recordIds;
        if (!targets || targets.length === 0) {
          const empAssets = assets.filter((a) => {
            const h = getHolderName(a["Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)"]);
            return h.toLowerCase() === (employeeName || "").toLowerCase();
          });
          targets = empAssets.map((a) => a.record_id);
        }
        for (const recId of targets) {
          await lark.updateRecord(TABLE_MASTER, recId, {
            "Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)": "\u{1F535} \u0E1E\u0E23\u0E49\u0E2D\u0E21\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E43\u0E19\u0E04\u0E25\u0E31\u0E07 (Available in Stock)",
            "Current Holder (\u0E1C\u0E39\u0E49\u0E16\u0E37\u0E2D\u0E04\u0E23\u0E2D\u0E07\u0E1B\u0E31\u0E08\u0E08\u0E38\u0E1A\u0E31\u0E19)": null,
            "Audit Status (\u0E2A\u0E16\u0E32\u0E19\u0E30\u0E01\u0E32\u0E23\u0E22\u0E37\u0E19\u0E22\u0E31\u0E19)": "\u{1F7E2} \u0E23\u0E31\u0E1A\u0E04\u0E37\u0E19\u0E40\u0E02\u0E49\u0E32\u0E04\u0E25\u0E31\u0E07\u0E01\u0E25\u0E32\u0E07 (Returned to Stock)",
            "Specs / Notes (\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14/\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38)": `\u0E23\u0E31\u0E1A\u0E04\u0E37\u0E19\u0E08\u0E32\u0E01\u0E04\u0E19\u0E25\u0E32\u0E2D\u0E2D\u0E01 (${employeeName || "Resigned"}) \u0E40\u0E02\u0E49\u0E32\u0E04\u0E25\u0E31\u0E07\u0E40\u0E21\u0E37\u0E48\u0E2D: ${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}`
          }).catch(() => null);
        }
        return jsonResponse({ ok: true, message: `\u0E14\u0E36\u0E07\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E02\u0E2D\u0E07 ${employeeName} \u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14 ${targets.length} \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E40\u0E02\u0E49\u0E32\u0E04\u0E25\u0E31\u0E07\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22!` });
      }
      if (pathname === "/api/admin/audit-logs" && method === "GET") {
        if (!requireAdmin(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const logs = await lark.fetchRecords(TABLE_AUDIT);
        const formatted = logs.map((rec) => ({
          record_id: rec.record_id,
          brandModel: rec["Brand & Model (\u0E22\u0E35\u0E48\u0E2B\u0E49\u0E2D\u0E41\u0E25\u0E30\u0E23\u0E38\u0E48\u0E19)"] || "-",
          status: getSingleValue(rec["IT Review Status (\u0E1C\u0E25\u0E01\u0E32\u0E23\u0E15\u0E23\u0E27\u0E08\u0E2A\u0E2D\u0E1A\u0E42\u0E14\u0E22 IT)"]) || "-",
          org: getSingleValue(rec["Organization (\u0E2A\u0E31\u0E07\u0E01\u0E31\u0E14)"]) || "-",
          deviceType: getSingleValue(rec["Device Type (\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C)"]) || "-",
          assetTag: rec["Asset Tag (\u0E40\u0E25\u0E02\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E2A\u0E34\u0E19\u0E1A\u0E19\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07)"] || "-",
          serialNumber: rec["Serial Number (S/N \u0E1A\u0E19\u0E15\u0E31\u0E27\u0E40\u0E04\u0E23\u0E37\u0E48\u0E2D\u0E07)"] || "-",
          notes: rec["Notes (\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E2B\u0E15\u0E38\u0E08\u0E32\u0E01\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19)"] || "-",
          reviewerNotes: rec["IT Reviewer Notes (\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01\u0E02\u0E2D\u0E07 IT)"] || "-"
        }));
        return jsonResponse({ ok: true, count: formatted.length, logs: formatted });
      }
      if (pathname === "/api/lifecycle/login" && method === "POST") {
        const body = await request.json().catch(() => ({}));
        const validPasswords = {
          "HR": ["hr2026", env2.ADMIN_PASSWORD || "itadmin2026"],
          "ADMIN": ["admin2026", env2.ADMIN_PASSWORD || "itadmin2026"],
          "IT": [env2.ADMIN_PASSWORD || "itadmin2026"]
        };
        const allowed = validPasswords[body.role] || [env2.ADMIN_PASSWORD || "itadmin2026"];
        if (allowed.includes(body.password?.trim())) {
          const names = { HR: "HR (\u0E04\u0E38\u0E13 Filmmy)", ADMIN: "Admin (\u0E04\u0E38\u0E13 Ploy)", IT: "IT (\u0E1D\u0E48\u0E32\u0E22\u0E44\u0E2D\u0E17\u0E35)" };
          const token = generateSignedToken({ role: body.role, actorName: names[body.role] || "Staff" }, 24);
          return jsonResponse({ ok: true, role: body.role, token, actorName: names[body.role] || "Staff" });
        }
        return jsonResponse({ ok: false, message: "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E1A\u0E17\u0E1A\u0E32\u0E17\u0E19\u0E35\u0E49" }, 401);
      }
      if (pathname === "/api/lifecycle/tasks" && method === "GET") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        let tasks = [];
        if (env2.IT_ASSET_KV) {
          const kvData = await env2.IT_ASSET_KV.get("lifecycle_tasks");
          if (kvData) tasks = JSON.parse(kvData);
        }
        const stats = {
          total: tasks.length,
          offboardingWaitingAdmin: tasks.filter((t) => t.type === "offboarding" && t.currentStage === "WAITING_ADMIN_COLLECTION").length,
          offboardingWaitingIT: tasks.filter((t) => t.type === "offboarding" && t.currentStage === "WAITING_IT_REIMAGE").length,
          offboardingWaitingStore: tasks.filter((t) => t.type === "offboarding" && t.currentStage === "WAITING_ADMIN_STORE").length,
          onboardingWaitingPack: tasks.filter((t) => t.type === "onboarding" && t.currentStage === "WAITING_ADMIN_PACK").length,
          onboardingWaitingHandover: tasks.filter((t) => t.type === "onboarding" && t.currentStage === "WAITING_HANDOVER").length,
          completed: tasks.filter((t) => t.currentStage === "COMPLETED").length
        };
        return jsonResponse({ ok: true, stats, tasks });
      }
      if (pathname === "/api/lifecycle/tasks/offboarding" && method === "POST") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { employeeName, organization, targetDate, notes, actor, devices } = await request.json().catch(() => ({}));
        if (!employeeName) return jsonResponse({ ok: false, message: "employeeName required" }, 400);
        let tasks = [];
        if (env2.IT_ASSET_KV) {
          const raw = await env2.IT_ASSET_KV.get("lifecycle_tasks");
          if (raw) tasks = JSON.parse(raw);
        }
        const newTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: "offboarding",
          employeeName: sanitizeString(employeeName, 100),
          organization: organization || "XPO",
          targetDate: sanitizeString(targetDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0], 20),
          notes: sanitizeString(notes, 500),
          currentStage: "WAITING_ADMIN_COLLECTION",
          devices: devices || [],
          history: [{ stage: "WAITING_ADMIN_COLLECTION", actor: actor || "HR (\u0E04\u0E38\u0E13 Filmmy)", timestamp: (/* @__PURE__ */ new Date()).toISOString() }]
        };
        tasks.unshift(newTask);
        if (env2.IT_ASSET_KV) {
          await env2.IT_ASSET_KV.put("lifecycle_tasks", JSON.stringify(tasks));
        }
        return jsonResponse({ ok: true, message: `\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E23\u0E31\u0E1A\u0E04\u0E37\u0E19\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E02\u0E2D\u0E07 ${employeeName} \u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27!`, task: newTask });
      }
      if (pathname === "/api/lifecycle/tasks/onboarding" && method === "POST") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { position, employeeName, organization, targetDate, notes, actor, devices } = await request.json().catch(() => ({}));
        if (!position) return jsonResponse({ ok: false, message: "position required" }, 400);
        let tasks = [];
        if (env2.IT_ASSET_KV) {
          const raw = await env2.IT_ASSET_KV.get("lifecycle_tasks");
          if (raw) tasks = JSON.parse(raw);
        }
        const newTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          type: "onboarding",
          position: sanitizeString(position, 100),
          employeeName: sanitizeString(employeeName || `${position} (New Joiner)`, 100),
          organization: organization || "XPO",
          targetDate: sanitizeString(targetDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0], 20),
          notes: sanitizeString(notes, 500),
          currentStage: "WAITING_ADMIN_PACK",
          devices: devices || [],
          history: [{ stage: "WAITING_ADMIN_PACK", actor: actor || "HR (\u0E04\u0E38\u0E13 Filmmy)", timestamp: (/* @__PURE__ */ new Date()).toISOString() }]
        };
        tasks.unshift(newTask);
        if (env2.IT_ASSET_KV) {
          await env2.IT_ASSET_KV.put("lifecycle_tasks", JSON.stringify(tasks));
        }
        return jsonResponse({ ok: true, message: `\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E40\u0E15\u0E23\u0E35\u0E22\u0E21\u0E2D\u0E38\u0E1B\u0E01\u0E23\u0E13\u0E4C\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A ${position} \u0E40\u0E23\u0E35\u0E22\u0E1A\u0E23\u0E49\u0E2D\u0E22\u0E41\u0E25\u0E49\u0E27!`, task: newTask });
      }
      if (pathname === "/api/lifecycle/tasks/advance" && method === "POST") {
        if (!requireLifecycle(request)) return jsonResponse({ ok: false, code: "UNAUTHORIZED" }, 401);
        const { taskId, actor, note } = await request.json().catch(() => ({}));
        if (!taskId) return jsonResponse({ ok: false, message: "taskId required" }, 400);
        let tasks = [];
        if (env2.IT_ASSET_KV) {
          const raw = await env2.IT_ASSET_KV.get("lifecycle_tasks");
          if (raw) tasks = JSON.parse(raw);
        }
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return jsonResponse({ ok: false, message: "Task not found" }, 404);
        const transitions = {
          offboarding: {
            "WAITING_ADMIN_COLLECTION": "WAITING_IT_REIMAGE",
            "WAITING_IT_REIMAGE": "WAITING_ADMIN_STORE",
            "WAITING_ADMIN_STORE": "COMPLETED"
          },
          onboarding: {
            "WAITING_ADMIN_PACK": "WAITING_HANDOVER",
            "WAITING_HANDOVER": "COMPLETED"
          }
        };
        const nextStage = transitions[task.type]?.[task.currentStage];
        if (nextStage) {
          task.currentStage = nextStage;
          task.history.push({ stage: nextStage, actor: actor || "Staff", note: sanitizeString(note, 200), timestamp: (/* @__PURE__ */ new Date()).toISOString() });
          if (env2.IT_ASSET_KV) {
            await env2.IT_ASSET_KV.put("lifecycle_tasks", JSON.stringify(tasks));
          }
        }
        return jsonResponse({ ok: true, message: "\u0E2D\u0E31\u0E1B\u0E40\u0E14\u0E15\u0E02\u0E31\u0E49\u0E19\u0E15\u0E2D\u0E19\u0E07\u0E32\u0E19\u0E2A\u0E33\u0E40\u0E23\u0E47\u0E08!", task });
      }
      if (env2.ASSETS) {
        return env2.ASSETS.fetch(request);
      }
      return new Response("Not Found", { status: 404 });
    } catch (err) {
      return jsonResponse({ ok: false, error: err.message }, 500);
    }
  },
  async scheduled(event, env2, ctx) {
    console.log("[CRON] Automated Daily Reminder triggered on Cloudflare Edge at", (/* @__PURE__ */ new Date()).toISOString());
  }
};
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map
