import { g as li, r as ci, d as B, a as vi } from "../core-bcd69edc.js";
import { Z as bi, b as wi, c as Ci, p as Pi, s as Ti } from "../core-bcd69edc.js";
var Ve = (() => {
  var Y = import.meta.url;
  return function(G = {}) {
    var f = G, q, le;
    f.ready = new Promise((e, r) => {
      q = e, le = r;
    });
    var Be = Object.assign({}, f), Le = "./this.program", Ne = typeof window == "object", ce = typeof importScripts == "function";
    typeof process == "object" && typeof process.versions == "object" && process.versions.node;
    var W = "";
    function Ir(e) {
      return f.locateFile ? f.locateFile(e, W) : W + e;
    }
    var Se;
    (Ne || ce) && (ce ? W = self.location.href : typeof document < "u" && document.currentScript && (W = document.currentScript.src), Y && (W = Y), W.indexOf("blob:") !== 0 ? W = W.substr(0, W.replace(/[?#].*/, "").lastIndexOf("/") + 1) : W = "", ce && (Se = (e) => {
      var r = new XMLHttpRequest();
      return r.open("GET", e, !1), r.responseType = "arraybuffer", r.send(null), new Uint8Array(r.response);
    })), f.print || console.log.bind(console);
    var Q = f.printErr || console.error.bind(console);
    Object.assign(f, Be), Be = null, f.arguments && f.arguments, f.thisProgram && (Le = f.thisProgram), f.quit && f.quit;
    var ee;
    f.wasmBinary && (ee = f.wasmBinary), typeof WebAssembly != "object" && ne("no native wasm support detected");
    var ve, ze = !1;
    function Ur(e, r) {
      e || ne(r);
    }
    var M, k, re, de, R, P, Xe, Ze;
    function Ge() {
      var e = ve.buffer;
      f.HEAP8 = M = new Int8Array(e), f.HEAP16 = re = new Int16Array(e), f.HEAPU8 = k = new Uint8Array(e), f.HEAPU16 = de = new Uint16Array(e), f.HEAP32 = R = new Int32Array(e), f.HEAPU32 = P = new Uint32Array(e), f.HEAPF32 = Xe = new Float32Array(e), f.HEAPF64 = Ze = new Float64Array(e);
    }
    var qe = [], Je = [], Ke = [];
    function xr() {
      if (f.preRun)
        for (typeof f.preRun == "function" && (f.preRun = [f.preRun]); f.preRun.length; )
          Br(f.preRun.shift());
      Fe(qe);
    }
    function Yr() {
      Fe(Je);
    }
    function Vr() {
      if (f.postRun)
        for (typeof f.postRun == "function" && (f.postRun = [f.postRun]); f.postRun.length; )
          Nr(f.postRun.shift());
      Fe(Ke);
    }
    function Br(e) {
      qe.unshift(e);
    }
    function Lr(e) {
      Je.unshift(e);
    }
    function Nr(e) {
      Ke.unshift(e);
    }
    var L = 0, te = null;
    function zr(e) {
      L++, f.monitorRunDependencies && f.monitorRunDependencies(L);
    }
    function Xr(e) {
      if (L--, f.monitorRunDependencies && f.monitorRunDependencies(L), L == 0 && te) {
        var r = te;
        te = null, r();
      }
    }
    function ne(e) {
      f.onAbort && f.onAbort(e), e = "Aborted(" + e + ")", Q(e), ze = !0, e += ". Build with -sASSERTIONS for more info.";
      var r = new WebAssembly.RuntimeError(e);
      throw le(r), r;
    }
    var Zr = "data:application/octet-stream;base64,", Qe = (e) => e.startsWith(Zr), N;
    f.locateFile ? (N = "zxing_reader.wasm", Qe(N) || (N = Ir(N))) : N = new URL("/reader/zxing_reader.wasm", self.location).href;
    function er(e) {
      if (e == N && ee)
        return new Uint8Array(ee);
      if (Se)
        return Se(e);
      throw "both async and sync fetching of the wasm failed";
    }
    function Gr(e) {
      return !ee && (Ne || ce) && typeof fetch == "function" ? fetch(e, { credentials: "same-origin" }).then((r) => {
        if (!r.ok)
          throw "failed to load wasm binary file at '" + e + "'";
        return r.arrayBuffer();
      }).catch(() => er(e)) : Promise.resolve().then(() => er(e));
    }
    function rr(e, r, t) {
      return Gr(e).then((n) => WebAssembly.instantiate(n, r)).then((n) => n).then(t, (n) => {
        Q(`failed to asynchronously prepare wasm: ${n}`), ne(n);
      });
    }
    function qr(e, r, t, n) {
      return !e && typeof WebAssembly.instantiateStreaming == "function" && !Qe(r) && typeof fetch == "function" ? fetch(r, { credentials: "same-origin" }).then((i) => {
        var a = WebAssembly.instantiateStreaming(i, t);
        return a.then(n, function(s) {
          return Q(`wasm streaming compile failed: ${s}`), Q("falling back to ArrayBuffer instantiation"), rr(r, t, n);
        });
      }) : rr(r, t, n);
    }
    function Jr() {
      var e = { a: Rn };
      function r(n, i) {
        return T = n.exports, ve = T.ra, Ge(), pr = T.va, Lr(T.sa), Xr(), T;
      }
      zr();
      function t(n) {
        r(n.instance);
      }
      if (f.instantiateWasm)
        try {
          return f.instantiateWasm(e, r);
        } catch (n) {
          Q(`Module.instantiateWasm callback failed with error: ${n}`), le(n);
        }
      return qr(ee, N, e, t).catch(le), {};
    }
    var Fe = (e) => {
      for (; e.length > 0; )
        e.shift()(f);
    };
    f.noExitRuntime;
    var he = [], pe = 0, Kr = (e) => {
      var r = new _e(e);
      return r.get_caught() || (r.set_caught(!0), pe--), r.set_rethrown(!1), he.push(r), kr(r.excPtr), r.get_exception_ptr();
    }, H = 0, Qr = () => {
      _(0, 0);
      var e = he.pop();
      Dr(e.excPtr), H = 0;
    };
    function _e(e) {
      this.excPtr = e, this.ptr = e - 24, this.set_type = function(r) {
        P[this.ptr + 4 >> 2] = r;
      }, this.get_type = function() {
        return P[this.ptr + 4 >> 2];
      }, this.set_destructor = function(r) {
        P[this.ptr + 8 >> 2] = r;
      }, this.get_destructor = function() {
        return P[this.ptr + 8 >> 2];
      }, this.set_caught = function(r) {
        r = r ? 1 : 0, M[this.ptr + 12 >> 0] = r;
      }, this.get_caught = function() {
        return M[this.ptr + 12 >> 0] != 0;
      }, this.set_rethrown = function(r) {
        r = r ? 1 : 0, M[this.ptr + 13 >> 0] = r;
      }, this.get_rethrown = function() {
        return M[this.ptr + 13 >> 0] != 0;
      }, this.init = function(r, t) {
        this.set_adjusted_ptr(0), this.set_type(r), this.set_destructor(t);
      }, this.set_adjusted_ptr = function(r) {
        P[this.ptr + 16 >> 2] = r;
      }, this.get_adjusted_ptr = function() {
        return P[this.ptr + 16 >> 2];
      }, this.get_exception_ptr = function() {
        var r = jr(this.get_type());
        if (r)
          return P[this.excPtr >> 2];
        var t = this.get_adjusted_ptr();
        return t !== 0 ? t : this.excPtr;
      };
    }
    var et = (e) => {
      throw H || (H = e), H;
    }, Re = (e) => {
      var r = H;
      if (!r)
        return fe(0), 0;
      var t = new _e(r);
      t.set_adjusted_ptr(r);
      var n = t.get_type();
      if (!n)
        return fe(0), r;
      for (var i in e) {
        var a = e[i];
        if (a === 0 || a === n)
          break;
        var s = t.ptr + 16;
        if (Or(a, n, s))
          return fe(a), r;
      }
      return fe(n), r;
    }, rt = () => Re([]), tt = (e) => Re([e]), nt = (e, r) => Re([e, r]), it = (e) => {
      var r = new _e(e).get_exception_ptr();
      return r;
    }, at = () => {
      var e = he.pop();
      e || ne("no exception to throw");
      var r = e.excPtr;
      throw e.get_rethrown() || (he.push(e), e.set_rethrown(!0), e.set_caught(!1), pe++), H = r, H;
    }, st = (e, r, t) => {
      var n = new _e(e);
      throw n.init(r, t), H = e, pe++, H;
    }, ot = () => pe, ge = {}, tr = (e) => {
      for (; e.length; ) {
        var r = e.pop(), t = e.pop();
        t(r);
      }
    };
    function De(e) {
      return this.fromWireType(R[e >> 2]);
    }
    var J = {}, z = {}, ye = {}, nr, me = (e) => {
      throw new nr(e);
    }, X = (e, r, t) => {
      e.forEach(function(o) {
        ye[o] = r;
      });
      function n(o) {
        var u = t(o);
        u.length !== e.length && me("Mismatched type converter count");
        for (var l = 0; l < e.length; ++l)
          I(e[l], u[l]);
      }
      var i = new Array(r.length), a = [], s = 0;
      r.forEach((o, u) => {
        z.hasOwnProperty(o) ? i[u] = z[o] : (a.push(o), J.hasOwnProperty(o) || (J[o] = []), J[o].push(() => {
          i[u] = z[o], ++s, s === a.length && n(i);
        }));
      }), a.length === 0 && n(i);
    }, ut = (e) => {
      var r = ge[e];
      delete ge[e];
      var t = r.rawConstructor, n = r.rawDestructor, i = r.fields, a = i.map((s) => s.getterReturnType).concat(i.map((s) => s.setterArgumentType));
      X([e], a, (s) => {
        var o = {};
        return i.forEach((u, l) => {
          var v = u.fieldName, h = s[l], p = u.getter, $ = u.getterContext, w = s[l + i.length], S = u.setter, C = u.setterContext;
          o[v] = { read: (F) => h.fromWireType(p($, F)), write: (F, c) => {
            var d = [];
            S(C, F, w.toWireType(d, c)), tr(d);
          } };
        }), [{ name: r.name, fromWireType: (u) => {
          var l = {};
          for (var v in o)
            l[v] = o[v].read(u);
          return n(u), l;
        }, toWireType: (u, l) => {
          for (var v in o)
            if (!(v in l))
              throw new TypeError(`Missing field: "${v}"`);
          var h = t();
          for (v in o)
            o[v].write(h, l[v]);
          return u !== null && u.push(n, h), h;
        }, argPackAdvance: U, readValueFromPointer: De, destructorFunction: n }];
      });
    }, ft = (e, r, t, n, i) => {
    }, lt = () => {
      for (var e = new Array(256), r = 0; r < 256; ++r)
        e[r] = String.fromCharCode(r);
      ir = e;
    }, ir, D = (e) => {
      for (var r = "", t = e; k[t]; )
        r += ir[k[t++]];
      return r;
    }, K, b = (e) => {
      throw new K(e);
    };
    function ct(e, r, t = {}) {
      var n = r.name;
      if (e || b(`type "${n}" must have a positive integer typeid pointer`), z.hasOwnProperty(e)) {
        if (t.ignoreDuplicateRegistrations)
          return;
        b(`Cannot register type '${n}' twice`);
      }
      if (z[e] = r, delete ye[e], J.hasOwnProperty(e)) {
        var i = J[e];
        delete J[e], i.forEach((a) => a());
      }
    }
    function I(e, r, t = {}) {
      if (!("argPackAdvance" in r))
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      return ct(e, r, t);
    }
    var U = 8, vt = (e, r, t, n) => {
      r = D(r), I(e, { name: r, fromWireType: function(i) {
        return !!i;
      }, toWireType: function(i, a) {
        return a ? t : n;
      }, argPackAdvance: U, readValueFromPointer: function(i) {
        return this.fromWireType(k[i]);
      }, destructorFunction: null });
    }, dt = (e) => ({ count: e.count, deleteScheduled: e.deleteScheduled, preservePointerOnDelete: e.preservePointerOnDelete, ptr: e.ptr, ptrType: e.ptrType, smartPtr: e.smartPtr, smartPtrType: e.smartPtrType }), ke = (e) => {
      function r(t) {
        return t.$$.ptrType.registeredClass.name;
      }
      b(r(e) + " instance already deleted");
    }, Oe = !1, ar = (e) => {
    }, ht = (e) => {
      e.smartPtr ? e.smartPtrType.rawDestructor(e.smartPtr) : e.ptrType.registeredClass.rawDestructor(e.ptr);
    }, sr = (e) => {
      e.count.value -= 1;
      var r = e.count.value === 0;
      r && ht(e);
    }, or = (e, r, t) => {
      if (r === t)
        return e;
      if (t.baseClass === void 0)
        return null;
      var n = or(e, r, t.baseClass);
      return n === null ? null : t.downcast(n);
    }, ur = {}, pt = () => Object.keys(se).length, _t = () => {
      var e = [];
      for (var r in se)
        se.hasOwnProperty(r) && e.push(se[r]);
      return e;
    }, ie = [], je = () => {
      for (; ie.length; ) {
        var e = ie.pop();
        e.$$.deleteScheduled = !1, e.delete();
      }
    }, ae, gt = (e) => {
      ae = e, ie.length && ae && ae(je);
    }, yt = () => {
      f.getInheritedInstanceCount = pt, f.getLiveInheritedInstances = _t, f.flushPendingDeletes = je, f.setDelayFunction = gt;
    }, se = {}, mt = (e, r) => {
      for (r === void 0 && b("ptr should not be undefined"); e.baseClass; )
        r = e.upcast(r), e = e.baseClass;
      return r;
    }, $t = (e, r) => (r = mt(e, r), se[r]), $e = (e, r) => {
      (!r.ptrType || !r.ptr) && me("makeClassHandle requires ptr and ptrType");
      var t = !!r.smartPtrType, n = !!r.smartPtr;
      return t !== n && me("Both smartPtrType and smartPtr must be specified"), r.count = { value: 1 }, oe(Object.create(e, { $$: { value: r } }));
    };
    function bt(e) {
      var r = this.getPointee(e);
      if (!r)
        return this.destructor(e), null;
      var t = $t(this.registeredClass, r);
      if (t !== void 0) {
        if (t.$$.count.value === 0)
          return t.$$.ptr = r, t.$$.smartPtr = e, t.clone();
        var n = t.clone();
        return this.destructor(e), n;
      }
      function i() {
        return this.isSmartPointer ? $e(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: r, smartPtrType: this, smartPtr: e }) : $e(this.registeredClass.instancePrototype, { ptrType: this, ptr: e });
      }
      var a = this.registeredClass.getActualType(r), s = ur[a];
      if (!s)
        return i.call(this);
      var o;
      this.isConst ? o = s.constPointerType : o = s.pointerType;
      var u = or(r, this.registeredClass, o.registeredClass);
      return u === null ? i.call(this) : this.isSmartPointer ? $e(o.registeredClass.instancePrototype, { ptrType: o, ptr: u, smartPtrType: this, smartPtr: e }) : $e(o.registeredClass.instancePrototype, { ptrType: o, ptr: u });
    }
    var oe = (e) => typeof FinalizationRegistry > "u" ? (oe = (r) => r, e) : (Oe = new FinalizationRegistry((r) => {
      sr(r.$$);
    }), oe = (r) => {
      var t = r.$$, n = !!t.smartPtr;
      if (n) {
        var i = { $$: t };
        Oe.register(r, i, r);
      }
      return r;
    }, ar = (r) => Oe.unregister(r), oe(e)), wt = () => {
      Object.assign(be.prototype, { isAliasOf(e) {
        if (!(this instanceof be) || !(e instanceof be))
          return !1;
        var r = this.$$.ptrType.registeredClass, t = this.$$.ptr;
        e.$$ = e.$$;
        for (var n = e.$$.ptrType.registeredClass, i = e.$$.ptr; r.baseClass; )
          t = r.upcast(t), r = r.baseClass;
        for (; n.baseClass; )
          i = n.upcast(i), n = n.baseClass;
        return r === n && t === i;
      }, clone() {
        if (this.$$.ptr || ke(this), this.$$.preservePointerOnDelete)
          return this.$$.count.value += 1, this;
        var e = oe(Object.create(Object.getPrototypeOf(this), { $$: { value: dt(this.$$) } }));
        return e.$$.count.value += 1, e.$$.deleteScheduled = !1, e;
      }, delete() {
        this.$$.ptr || ke(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && b("Object already scheduled for deletion"), ar(this), sr(this.$$), this.$$.preservePointerOnDelete || (this.$$.smartPtr = void 0, this.$$.ptr = void 0);
      }, isDeleted() {
        return !this.$$.ptr;
      }, deleteLater() {
        return this.$$.ptr || ke(this), this.$$.deleteScheduled && !this.$$.preservePointerOnDelete && b("Object already scheduled for deletion"), ie.push(this), ie.length === 1 && ae && ae(je), this.$$.deleteScheduled = !0, this;
      } });
    };
    function be() {
    }
    var Ct = 48, Pt = 57, fr = (e) => {
      if (e === void 0)
        return "_unknown";
      e = e.replace(/[^a-zA-Z0-9_]/g, "$");
      var r = e.charCodeAt(0);
      return r >= Ct && r <= Pt ? `_${e}` : e;
    };
    function lr(e, r) {
      return e = fr(e), { [e]: function() {
        return r.apply(this, arguments);
      } }[e];
    }
    var cr = (e, r, t) => {
      if (e[r].overloadTable === void 0) {
        var n = e[r];
        e[r] = function() {
          return e[r].overloadTable.hasOwnProperty(arguments.length) || b(`Function '${t}' called with an invalid number of arguments (${arguments.length}) - expects one of (${e[r].overloadTable})!`), e[r].overloadTable[arguments.length].apply(this, arguments);
        }, e[r].overloadTable = [], e[r].overloadTable[n.argCount] = n;
      }
    }, vr = (e, r, t) => {
      f.hasOwnProperty(e) ? ((t === void 0 || f[e].overloadTable !== void 0 && f[e].overloadTable[t] !== void 0) && b(`Cannot register public name '${e}' twice`), cr(f, e, e), f.hasOwnProperty(t) && b(`Cannot register multiple overloads of a function with the same number of arguments (${t})!`), f[e].overloadTable[t] = r) : (f[e] = r, t !== void 0 && (f[e].numArguments = t));
    };
    function Tt(e, r, t, n, i, a, s, o) {
      this.name = e, this.constructor = r, this.instancePrototype = t, this.rawDestructor = n, this.baseClass = i, this.getActualType = a, this.upcast = s, this.downcast = o, this.pureVirtualFunctions = [];
    }
    var We = (e, r, t) => {
      for (; r !== t; )
        r.upcast || b(`Expected null or instance of ${t.name}, got an instance of ${r.name}`), e = r.upcast(e), r = r.baseClass;
      return e;
    };
    function At(e, r) {
      if (r === null)
        return this.isReference && b(`null is not a valid ${this.name}`), 0;
      r.$$ || b(`Cannot pass "${Ie(r)}" as a ${this.name}`), r.$$.ptr || b(`Cannot pass deleted object as a pointer of type ${this.name}`);
      var t = r.$$.ptrType.registeredClass, n = We(r.$$.ptr, t, this.registeredClass);
      return n;
    }
    function Et(e, r) {
      var t;
      if (r === null)
        return this.isReference && b(`null is not a valid ${this.name}`), this.isSmartPointer ? (t = this.rawConstructor(), e !== null && e.push(this.rawDestructor, t), t) : 0;
      r.$$ || b(`Cannot pass "${Ie(r)}" as a ${this.name}`), r.$$.ptr || b(`Cannot pass deleted object as a pointer of type ${this.name}`), !this.isConst && r.$$.ptrType.isConst && b(`Cannot convert argument of type ${r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name} to parameter type ${this.name}`);
      var n = r.$$.ptrType.registeredClass;
      if (t = We(r.$$.ptr, n, this.registeredClass), this.isSmartPointer)
        switch (r.$$.smartPtr === void 0 && b("Passing raw pointer to smart pointer is illegal"), this.sharingPolicy) {
          case 0:
            r.$$.smartPtrType === this ? t = r.$$.smartPtr : b(`Cannot convert argument of type ${r.$$.smartPtrType ? r.$$.smartPtrType.name : r.$$.ptrType.name} to parameter type ${this.name}`);
            break;
          case 1:
            t = r.$$.smartPtr;
            break;
          case 2:
            if (r.$$.smartPtrType === this)
              t = r.$$.smartPtr;
            else {
              var i = r.clone();
              t = this.rawShare(t, V.toHandle(() => i.delete())), e !== null && e.push(this.rawDestructor, t);
            }
            break;
          default:
            b("Unsupporting sharing policy");
        }
      return t;
    }
    function St(e, r) {
      if (r === null)
        return this.isReference && b(`null is not a valid ${this.name}`), 0;
      r.$$ || b(`Cannot pass "${Ie(r)}" as a ${this.name}`), r.$$.ptr || b(`Cannot pass deleted object as a pointer of type ${this.name}`), r.$$.ptrType.isConst && b(`Cannot convert argument of type ${r.$$.ptrType.name} to parameter type ${this.name}`);
      var t = r.$$.ptrType.registeredClass, n = We(r.$$.ptr, t, this.registeredClass);
      return n;
    }
    function dr(e) {
      return this.fromWireType(P[e >> 2]);
    }
    var Ft = () => {
      Object.assign(we.prototype, { getPointee(e) {
        return this.rawGetPointee && (e = this.rawGetPointee(e)), e;
      }, destructor(e) {
        this.rawDestructor && this.rawDestructor(e);
      }, argPackAdvance: U, readValueFromPointer: dr, deleteObject(e) {
        e !== null && e.delete();
      }, fromWireType: bt });
    };
    function we(e, r, t, n, i, a, s, o, u, l, v) {
      this.name = e, this.registeredClass = r, this.isReference = t, this.isConst = n, this.isSmartPointer = i, this.pointeeType = a, this.sharingPolicy = s, this.rawGetPointee = o, this.rawConstructor = u, this.rawShare = l, this.rawDestructor = v, !i && r.baseClass === void 0 ? n ? (this.toWireType = At, this.destructorFunction = null) : (this.toWireType = St, this.destructorFunction = null) : this.toWireType = Et;
    }
    var hr = (e, r, t) => {
      f.hasOwnProperty(e) || me("Replacing nonexistant public symbol"), f[e].overloadTable !== void 0 && t !== void 0 ? f[e].overloadTable[t] = r : (f[e] = r, f[e].argCount = t);
    }, Rt = (e, r, t) => {
      var n = f["dynCall_" + e];
      return t && t.length ? n.apply(null, [r].concat(t)) : n.call(null, r);
    }, Ce = [], pr, m = (e) => {
      var r = Ce[e];
      return r || (e >= Ce.length && (Ce.length = e + 1), Ce[e] = r = pr.get(e)), r;
    }, Dt = (e, r, t) => {
      if (e.includes("j"))
        return Rt(e, r, t);
      var n = m(r).apply(null, t);
      return n;
    }, kt = (e, r) => {
      var t = [];
      return function() {
        return t.length = 0, Object.assign(t, arguments), Dt(e, r, t);
      };
    }, j = (e, r) => {
      e = D(e);
      function t() {
        return e.includes("j") ? kt(e, r) : m(r);
      }
      var n = t();
      return typeof n != "function" && b(`unknown function pointer with signature ${e}: ${r}`), n;
    }, Ot = (e, r) => {
      var t = lr(r, function(n) {
        this.name = r, this.message = n;
        var i = new Error(n).stack;
        i !== void 0 && (this.stack = this.toString() + `
` + i.replace(/^Error(:[^\n]*)?\n/, ""));
      });
      return t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.prototype.toString = function() {
        return this.message === void 0 ? this.name : `${this.name}: ${this.message}`;
      }, t;
    }, _r, gr = (e) => {
      var r = Rr(e), t = D(r);
      return x(r), t;
    }, Pe = (e, r) => {
      var t = [], n = {};
      function i(a) {
        if (!n[a] && !z[a]) {
          if (ye[a]) {
            ye[a].forEach(i);
            return;
          }
          t.push(a), n[a] = !0;
        }
      }
      throw r.forEach(i), new _r(`${e}: ` + t.map(gr).join([", "]));
    }, jt = (e, r, t, n, i, a, s, o, u, l, v, h, p) => {
      v = D(v), a = j(i, a), o && (o = j(s, o)), l && (l = j(u, l)), p = j(h, p);
      var $ = fr(v);
      vr($, function() {
        Pe(`Cannot construct ${v} due to unbound types`, [n]);
      }), X([e, r, t], n ? [n] : [], function(w) {
        w = w[0];
        var S, C;
        n ? (S = w.registeredClass, C = S.instancePrototype) : C = be.prototype;
        var F = lr($, function() {
          if (Object.getPrototypeOf(this) !== c)
            throw new K("Use 'new' to construct " + v);
          if (d.constructor_body === void 0)
            throw new K(v + " has no accessible constructor");
          var Ee = d.constructor_body[arguments.length];
          if (Ee === void 0)
            throw new K(`Tried to invoke ctor of ${v} with invalid number of parameters (${arguments.length}) - expected (${Object.keys(d.constructor_body).toString()}) parameters instead!`);
          return Ee.apply(this, arguments);
        }), c = Object.create(C, { constructor: { value: F } });
        F.prototype = c;
        var d = new Tt(v, F, c, p, S, a, o, l);
        d.baseClass && (d.baseClass.__derivedClasses === void 0 && (d.baseClass.__derivedClasses = []), d.baseClass.__derivedClasses.push(d));
        var A = new we(v, d, !0, !1, !1), E = new we(v + "*", d, !1, !1, !1), Z = new we(v + " const*", d, !1, !0, !1);
        return ur[e] = { pointerType: E, constPointerType: Z }, hr($, F), [A, E, Z];
      });
    }, Me = (e, r) => {
      for (var t = [], n = 0; n < e; n++)
        t.push(P[r + n * 4 >> 2]);
      return t;
    };
    function He(e, r, t, n, i, a) {
      var s = r.length;
      s < 2 && b("argTypes array size mismatch! Must at least get return value and 'this' types!");
      for (var o = r[1] !== null && t !== null, u = !1, l = 1; l < r.length; ++l)
        if (r[l] !== null && r[l].destructorFunction === void 0) {
          u = !0;
          break;
        }
      var v = r[0].name !== "void", h = s - 2, p = new Array(h), $ = [], w = [];
      return function() {
        arguments.length !== h && b(`function ${e} called with ${arguments.length} arguments, expected ${h}`), w.length = 0;
        var S;
        $.length = o ? 2 : 1, $[0] = i, o && (S = r[1].toWireType(w, this), $[1] = S);
        for (var C = 0; C < h; ++C)
          p[C] = r[C + 2].toWireType(w, arguments[C]), $.push(p[C]);
        var F = n.apply(null, $);
        function c(d) {
          if (u)
            tr(w);
          else
            for (var A = o ? 1 : 2; A < r.length; A++) {
              var E = A === 1 ? S : p[A - 2];
              r[A].destructorFunction !== null && r[A].destructorFunction(E);
            }
          if (v)
            return r[0].fromWireType(d);
        }
        return c(F);
      };
    }
    var Wt = (e, r, t, n, i, a) => {
      var s = Me(r, t);
      i = j(n, i), X([], [e], function(o) {
        o = o[0];
        var u = `constructor ${o.name}`;
        if (o.registeredClass.constructor_body === void 0 && (o.registeredClass.constructor_body = []), o.registeredClass.constructor_body[r - 1] !== void 0)
          throw new K(`Cannot register multiple constructors with identical number of parameters (${r - 1}) for class '${o.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        return o.registeredClass.constructor_body[r - 1] = () => {
          Pe(`Cannot construct ${o.name} due to unbound types`, s);
        }, X([], s, (l) => (l.splice(1, 0, null), o.registeredClass.constructor_body[r - 1] = He(u, l, null, i, a), [])), [];
      });
    }, yr = (e) => {
      e = e.trim();
      const r = e.indexOf("(");
      return r !== -1 ? (Ur(e[e.length - 1] == ")", "Parentheses for argument names should match."), e.substr(0, r)) : e;
    }, Mt = (e, r, t, n, i, a, s, o, u) => {
      var l = Me(t, n);
      r = D(r), r = yr(r), a = j(i, a), X([], [e], function(v) {
        v = v[0];
        var h = `${v.name}.${r}`;
        r.startsWith("@@") && (r = Symbol[r.substring(2)]), o && v.registeredClass.pureVirtualFunctions.push(r);
        function p() {
          Pe(`Cannot call ${h} due to unbound types`, l);
        }
        var $ = v.registeredClass.instancePrototype, w = $[r];
        return w === void 0 || w.overloadTable === void 0 && w.className !== v.name && w.argCount === t - 2 ? (p.argCount = t - 2, p.className = v.name, $[r] = p) : (cr($, r, h), $[r].overloadTable[t - 2] = p), X([], l, function(S) {
          var C = He(h, S, v, a, s);
          return $[r].overloadTable === void 0 ? (C.argCount = t - 2, $[r] = C) : $[r].overloadTable[t - 2] = C, [];
        }), [];
      });
    };
    function Ht() {
      Object.assign(mr.prototype, { get(e) {
        return this.allocated[e];
      }, has(e) {
        return this.allocated[e] !== void 0;
      }, allocate(e) {
        var r = this.freelist.pop() || this.allocated.length;
        return this.allocated[r] = e, r;
      }, free(e) {
        this.allocated[e] = void 0, this.freelist.push(e);
      } });
    }
    function mr() {
      this.allocated = [void 0], this.freelist = [];
    }
    var O = new mr(), $r = (e) => {
      e >= O.reserved && --O.get(e).refcount === 0 && O.free(e);
    }, It = () => {
      for (var e = 0, r = O.reserved; r < O.allocated.length; ++r)
        O.allocated[r] !== void 0 && ++e;
      return e;
    }, Ut = () => {
      O.allocated.push({ value: void 0 }, { value: null }, { value: !0 }, { value: !1 }), O.reserved = O.allocated.length, f.count_emval_handles = It;
    }, V = { toValue: (e) => (e || b("Cannot use deleted val. handle = " + e), O.get(e).value), toHandle: (e) => {
      switch (e) {
        case void 0:
          return 1;
        case null:
          return 2;
        case !0:
          return 3;
        case !1:
          return 4;
        default:
          return O.allocate({ refcount: 1, value: e });
      }
    } }, xt = (e, r) => {
      r = D(r), I(e, { name: r, fromWireType: (t) => {
        var n = V.toValue(t);
        return $r(t), n;
      }, toWireType: (t, n) => V.toHandle(n), argPackAdvance: U, readValueFromPointer: De, destructorFunction: null });
    }, Ie = (e) => {
      if (e === null)
        return "null";
      var r = typeof e;
      return r === "object" || r === "array" || r === "function" ? e.toString() : "" + e;
    }, Yt = (e, r) => {
      switch (r) {
        case 4:
          return function(t) {
            return this.fromWireType(Xe[t >> 2]);
          };
        case 8:
          return function(t) {
            return this.fromWireType(Ze[t >> 3]);
          };
        default:
          throw new TypeError(`invalid float width (${r}): ${e}`);
      }
    }, Vt = (e, r, t) => {
      r = D(r), I(e, { name: r, fromWireType: (n) => n, toWireType: (n, i) => i, argPackAdvance: U, readValueFromPointer: Yt(r, t), destructorFunction: null });
    }, Bt = (e, r, t, n, i, a, s) => {
      var o = Me(r, t);
      e = D(e), e = yr(e), i = j(n, i), vr(e, function() {
        Pe(`Cannot call ${e} due to unbound types`, o);
      }, r - 1), X([], o, function(u) {
        var l = [u[0], null].concat(u.slice(1));
        return hr(e, He(e, l, null, i, a), r - 1), [];
      });
    }, Lt = (e, r, t) => {
      switch (r) {
        case 1:
          return t ? (n) => M[n >> 0] : (n) => k[n >> 0];
        case 2:
          return t ? (n) => re[n >> 1] : (n) => de[n >> 1];
        case 4:
          return t ? (n) => R[n >> 2] : (n) => P[n >> 2];
        default:
          throw new TypeError(`invalid integer width (${r}): ${e}`);
      }
    }, Nt = (e, r, t, n, i) => {
      r = D(r);
      var a = (v) => v;
      if (n === 0) {
        var s = 32 - 8 * t;
        a = (v) => v << s >>> s;
      }
      var o = r.includes("unsigned"), u = (v, h) => {
      }, l;
      o ? l = function(v, h) {
        return u(h, this.name), h >>> 0;
      } : l = function(v, h) {
        return u(h, this.name), h;
      }, I(e, { name: r, fromWireType: a, toWireType: l, argPackAdvance: U, readValueFromPointer: Lt(r, t, n !== 0), destructorFunction: null });
    }, zt = (e, r, t) => {
      var n = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array], i = n[r];
      function a(s) {
        var o = P[s >> 2], u = P[s + 4 >> 2];
        return new i(M.buffer, u, o);
      }
      t = D(t), I(e, { name: t, fromWireType: a, argPackAdvance: U, readValueFromPointer: a }, { ignoreDuplicateRegistrations: !0 });
    }, br = (e, r, t, n) => {
      if (!(n > 0))
        return 0;
      for (var i = t, a = t + n - 1, s = 0; s < e.length; ++s) {
        var o = e.charCodeAt(s);
        if (o >= 55296 && o <= 57343) {
          var u = e.charCodeAt(++s);
          o = 65536 + ((o & 1023) << 10) | u & 1023;
        }
        if (o <= 127) {
          if (t >= a)
            break;
          r[t++] = o;
        } else if (o <= 2047) {
          if (t + 1 >= a)
            break;
          r[t++] = 192 | o >> 6, r[t++] = 128 | o & 63;
        } else if (o <= 65535) {
          if (t + 2 >= a)
            break;
          r[t++] = 224 | o >> 12, r[t++] = 128 | o >> 6 & 63, r[t++] = 128 | o & 63;
        } else {
          if (t + 3 >= a)
            break;
          r[t++] = 240 | o >> 18, r[t++] = 128 | o >> 12 & 63, r[t++] = 128 | o >> 6 & 63, r[t++] = 128 | o & 63;
        }
      }
      return r[t] = 0, t - i;
    }, Xt = (e, r, t) => br(e, k, r, t), wr = (e) => {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var n = e.charCodeAt(t);
        n <= 127 ? r++ : n <= 2047 ? r += 2 : n >= 55296 && n <= 57343 ? (r += 4, ++t) : r += 3;
      }
      return r;
    }, Cr = typeof TextDecoder < "u" ? new TextDecoder("utf8") : void 0, Zt = (e, r, t) => {
      for (var n = r + t, i = r; e[i] && !(i >= n); )
        ++i;
      if (i - r > 16 && e.buffer && Cr)
        return Cr.decode(e.subarray(r, i));
      for (var a = ""; r < i; ) {
        var s = e[r++];
        if (!(s & 128)) {
          a += String.fromCharCode(s);
          continue;
        }
        var o = e[r++] & 63;
        if ((s & 224) == 192) {
          a += String.fromCharCode((s & 31) << 6 | o);
          continue;
        }
        var u = e[r++] & 63;
        if ((s & 240) == 224 ? s = (s & 15) << 12 | o << 6 | u : s = (s & 7) << 18 | o << 12 | u << 6 | e[r++] & 63, s < 65536)
          a += String.fromCharCode(s);
        else {
          var l = s - 65536;
          a += String.fromCharCode(55296 | l >> 10, 56320 | l & 1023);
        }
      }
      return a;
    }, Ue = (e, r) => e ? Zt(k, e, r) : "", Gt = (e, r) => {
      r = D(r);
      var t = r === "std::string";
      I(e, { name: r, fromWireType(n) {
        var i = P[n >> 2], a = n + 4, s;
        if (t)
          for (var o = a, u = 0; u <= i; ++u) {
            var l = a + u;
            if (u == i || k[l] == 0) {
              var v = l - o, h = Ue(o, v);
              s === void 0 ? s = h : (s += String.fromCharCode(0), s += h), o = l + 1;
            }
          }
        else {
          for (var p = new Array(i), u = 0; u < i; ++u)
            p[u] = String.fromCharCode(k[a + u]);
          s = p.join("");
        }
        return x(n), s;
      }, toWireType(n, i) {
        i instanceof ArrayBuffer && (i = new Uint8Array(i));
        var a, s = typeof i == "string";
        s || i instanceof Uint8Array || i instanceof Uint8ClampedArray || i instanceof Int8Array || b("Cannot pass non-string to std::string"), t && s ? a = wr(i) : a = i.length;
        var o = Ye(4 + a + 1), u = o + 4;
        if (P[o >> 2] = a, t && s)
          Xt(i, u, a + 1);
        else if (s)
          for (var l = 0; l < a; ++l) {
            var v = i.charCodeAt(l);
            v > 255 && (x(u), b("String has UTF-16 code units that do not fit in 8 bits")), k[u + l] = v;
          }
        else
          for (var l = 0; l < a; ++l)
            k[u + l] = i[l];
        return n !== null && n.push(x, o), o;
      }, argPackAdvance: U, readValueFromPointer: dr, destructorFunction(n) {
        x(n);
      } });
    }, Pr = typeof TextDecoder < "u" ? new TextDecoder("utf-16le") : void 0, qt = (e, r) => {
      for (var t = e, n = t >> 1, i = n + r / 2; !(n >= i) && de[n]; )
        ++n;
      if (t = n << 1, t - e > 32 && Pr)
        return Pr.decode(k.subarray(e, t));
      for (var a = "", s = 0; !(s >= r / 2); ++s) {
        var o = re[e + s * 2 >> 1];
        if (o == 0)
          break;
        a += String.fromCharCode(o);
      }
      return a;
    }, Jt = (e, r, t) => {
      if (t === void 0 && (t = 2147483647), t < 2)
        return 0;
      t -= 2;
      for (var n = r, i = t < e.length * 2 ? t / 2 : e.length, a = 0; a < i; ++a) {
        var s = e.charCodeAt(a);
        re[r >> 1] = s, r += 2;
      }
      return re[r >> 1] = 0, r - n;
    }, Kt = (e) => e.length * 2, Qt = (e, r) => {
      for (var t = 0, n = ""; !(t >= r / 4); ) {
        var i = R[e + t * 4 >> 2];
        if (i == 0)
          break;
        if (++t, i >= 65536) {
          var a = i - 65536;
          n += String.fromCharCode(55296 | a >> 10, 56320 | a & 1023);
        } else
          n += String.fromCharCode(i);
      }
      return n;
    }, en = (e, r, t) => {
      if (t === void 0 && (t = 2147483647), t < 4)
        return 0;
      for (var n = r, i = n + t - 4, a = 0; a < e.length; ++a) {
        var s = e.charCodeAt(a);
        if (s >= 55296 && s <= 57343) {
          var o = e.charCodeAt(++a);
          s = 65536 + ((s & 1023) << 10) | o & 1023;
        }
        if (R[r >> 2] = s, r += 4, r + 4 > i)
          break;
      }
      return R[r >> 2] = 0, r - n;
    }, rn = (e) => {
      for (var r = 0, t = 0; t < e.length; ++t) {
        var n = e.charCodeAt(t);
        n >= 55296 && n <= 57343 && ++t, r += 4;
      }
      return r;
    }, tn = (e, r, t) => {
      t = D(t);
      var n, i, a, s, o;
      r === 2 ? (n = qt, i = Jt, s = Kt, a = () => de, o = 1) : r === 4 && (n = Qt, i = en, s = rn, a = () => P, o = 2), I(e, { name: t, fromWireType: (u) => {
        for (var l = P[u >> 2], v = a(), h, p = u + 4, $ = 0; $ <= l; ++$) {
          var w = u + 4 + $ * r;
          if ($ == l || v[w >> o] == 0) {
            var S = w - p, C = n(p, S);
            h === void 0 ? h = C : (h += String.fromCharCode(0), h += C), p = w + r;
          }
        }
        return x(u), h;
      }, toWireType: (u, l) => {
        typeof l != "string" && b(`Cannot pass non-string to C++ string type ${t}`);
        var v = s(l), h = Ye(4 + v + r);
        return P[h >> 2] = v >> o, i(l, h + 4, v + r), u !== null && u.push(x, h), h;
      }, argPackAdvance: U, readValueFromPointer: De, destructorFunction(u) {
        x(u);
      } });
    }, nn = (e, r, t, n, i, a) => {
      ge[e] = { name: D(r), rawConstructor: j(t, n), rawDestructor: j(i, a), fields: [] };
    }, an = (e, r, t, n, i, a, s, o, u, l) => {
      ge[e].fields.push({ fieldName: D(r), getterReturnType: t, getter: j(n, i), getterContext: a, setterArgumentType: s, setter: j(o, u), setterContext: l });
    }, sn = (e, r) => {
      r = D(r), I(e, { isVoid: !0, name: r, argPackAdvance: 0, fromWireType: () => {
      }, toWireType: (t, n) => {
      } });
    }, on = {}, un = (e) => {
      var r = on[e];
      return r === void 0 ? D(e) : r;
    }, Tr = () => {
      if (typeof globalThis == "object")
        return globalThis;
      function e(r) {
        r.$$$embind_global$$$ = r;
        var t = typeof $$$embind_global$$$ == "object" && r.$$$embind_global$$$ == r;
        return t || delete r.$$$embind_global$$$, t;
      }
      if (typeof $$$embind_global$$$ == "object" || (typeof global == "object" && e(global) ? $$$embind_global$$$ = global : typeof self == "object" && e(self) && ($$$embind_global$$$ = self), typeof $$$embind_global$$$ == "object"))
        return $$$embind_global$$$;
      throw Error("unable to get global object.");
    }, fn = (e) => e === 0 ? V.toHandle(Tr()) : (e = un(e), V.toHandle(Tr()[e])), ln = (e) => {
      e > 4 && (O.get(e).refcount += 1);
    }, Ar = (e, r) => {
      var t = z[e];
      return t === void 0 && b(r + " has unknown type " + gr(e)), t;
    }, cn = (e) => {
      var r = new Array(e + 1);
      return function(t, n, i) {
        r[0] = t;
        for (var a = 0; a < e; ++a) {
          var s = Ar(P[n + a * 4 >> 2], "parameter " + a);
          r[a + 1] = s.readValueFromPointer(i), i += s.argPackAdvance;
        }
        var o = new (t.bind.apply(t, r))();
        return V.toHandle(o);
      };
    }, Er = {}, vn = (e, r, t, n) => {
      e = V.toValue(e);
      var i = Er[r];
      return i || (i = cn(r), Er[r] = i), i(e, t, n);
    }, dn = (e, r) => {
      e = Ar(e, "_emval_take_value");
      var t = e.readValueFromPointer(r);
      return V.toHandle(t);
    }, hn = () => {
      ne("");
    }, pn = (e, r, t) => k.copyWithin(e, r, r + t), _n = () => 2147483648, gn = (e) => {
      var r = ve.buffer, t = (e - r.byteLength + 65535) / 65536;
      try {
        return ve.grow(t), Ge(), 1;
      } catch {
      }
    }, yn = (e) => {
      var r = k.length;
      e >>>= 0;
      var t = _n();
      if (e > t)
        return !1;
      for (var n = (u, l) => u + (l - u % l) % l, i = 1; i <= 4; i *= 2) {
        var a = r * (1 + 0.2 / i);
        a = Math.min(a, e + 100663296);
        var s = Math.min(t, n(Math.max(e, a), 65536)), o = gn(s);
        if (o)
          return !0;
      }
      return !1;
    }, xe = {}, mn = () => Le || "./this.program", ue = () => {
      if (!ue.strings) {
        var e = (typeof navigator == "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8", r = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: e, _: mn() };
        for (var t in xe)
          xe[t] === void 0 ? delete r[t] : r[t] = xe[t];
        var n = [];
        for (var t in r)
          n.push(`${t}=${r[t]}`);
        ue.strings = n;
      }
      return ue.strings;
    }, $n = (e, r) => {
      for (var t = 0; t < e.length; ++t)
        M[r++ >> 0] = e.charCodeAt(t);
      M[r >> 0] = 0;
    }, bn = (e, r) => {
      var t = 0;
      return ue().forEach((n, i) => {
        var a = r + t;
        P[e + i * 4 >> 2] = a, $n(n, a), t += n.length + 1;
      }), 0;
    }, wn = (e, r) => {
      var t = ue();
      P[e >> 2] = t.length;
      var n = 0;
      return t.forEach((i) => n += i.length + 1), P[r >> 2] = n, 0;
    }, Cn = (e) => e, Te = (e) => e % 4 === 0 && (e % 100 !== 0 || e % 400 === 0), Pn = (e, r) => {
      for (var t = 0, n = 0; n <= r; t += e[n++])
        ;
      return t;
    }, Sr = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Fr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], Tn = (e, r) => {
      for (var t = new Date(e.getTime()); r > 0; ) {
        var n = Te(t.getFullYear()), i = t.getMonth(), a = (n ? Sr : Fr)[i];
        if (r > a - t.getDate())
          r -= a - t.getDate() + 1, t.setDate(1), i < 11 ? t.setMonth(i + 1) : (t.setMonth(0), t.setFullYear(t.getFullYear() + 1));
        else
          return t.setDate(t.getDate() + r), t;
      }
      return t;
    };
    function An(e, r, t) {
      var n = t > 0 ? t : wr(e) + 1, i = new Array(n), a = br(e, i, 0, i.length);
      return r && (i.length = a), i;
    }
    var En = (e, r) => {
      M.set(e, r);
    }, Sn = (e, r, t, n) => {
      var i = P[n + 40 >> 2], a = { tm_sec: R[n >> 2], tm_min: R[n + 4 >> 2], tm_hour: R[n + 8 >> 2], tm_mday: R[n + 12 >> 2], tm_mon: R[n + 16 >> 2], tm_year: R[n + 20 >> 2], tm_wday: R[n + 24 >> 2], tm_yday: R[n + 28 >> 2], tm_isdst: R[n + 32 >> 2], tm_gmtoff: R[n + 36 >> 2], tm_zone: i ? Ue(i) : "" }, s = Ue(t), o = { "%c": "%a %b %d %H:%M:%S %Y", "%D": "%m/%d/%y", "%F": "%Y-%m-%d", "%h": "%b", "%r": "%I:%M:%S %p", "%R": "%H:%M", "%T": "%H:%M:%S", "%x": "%m/%d/%y", "%X": "%H:%M:%S", "%Ec": "%c", "%EC": "%C", "%Ex": "%m/%d/%y", "%EX": "%H:%M:%S", "%Ey": "%y", "%EY": "%Y", "%Od": "%d", "%Oe": "%e", "%OH": "%H", "%OI": "%I", "%Om": "%m", "%OM": "%M", "%OS": "%S", "%Ou": "%u", "%OU": "%U", "%OV": "%V", "%Ow": "%w", "%OW": "%W", "%Oy": "%y" };
      for (var u in o)
        s = s.replace(new RegExp(u, "g"), o[u]);
      var l = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], v = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      function h(c, d, A) {
        for (var E = typeof c == "number" ? c.toString() : c || ""; E.length < d; )
          E = A[0] + E;
        return E;
      }
      function p(c, d) {
        return h(c, d, "0");
      }
      function $(c, d) {
        function A(Z) {
          return Z < 0 ? -1 : Z > 0 ? 1 : 0;
        }
        var E;
        return (E = A(c.getFullYear() - d.getFullYear())) === 0 && (E = A(c.getMonth() - d.getMonth())) === 0 && (E = A(c.getDate() - d.getDate())), E;
      }
      function w(c) {
        switch (c.getDay()) {
          case 0:
            return new Date(c.getFullYear() - 1, 11, 29);
          case 1:
            return c;
          case 2:
            return new Date(c.getFullYear(), 0, 3);
          case 3:
            return new Date(c.getFullYear(), 0, 2);
          case 4:
            return new Date(c.getFullYear(), 0, 1);
          case 5:
            return new Date(c.getFullYear() - 1, 11, 31);
          case 6:
            return new Date(c.getFullYear() - 1, 11, 30);
        }
      }
      function S(c) {
        var d = Tn(new Date(c.tm_year + 1900, 0, 1), c.tm_yday), A = new Date(d.getFullYear(), 0, 4), E = new Date(d.getFullYear() + 1, 0, 4), Z = w(A), Ee = w(E);
        return $(Z, d) <= 0 ? $(Ee, d) <= 0 ? d.getFullYear() + 1 : d.getFullYear() : d.getFullYear() - 1;
      }
      var C = { "%a": (c) => l[c.tm_wday].substring(0, 3), "%A": (c) => l[c.tm_wday], "%b": (c) => v[c.tm_mon].substring(0, 3), "%B": (c) => v[c.tm_mon], "%C": (c) => {
        var d = c.tm_year + 1900;
        return p(d / 100 | 0, 2);
      }, "%d": (c) => p(c.tm_mday, 2), "%e": (c) => h(c.tm_mday, 2, " "), "%g": (c) => S(c).toString().substring(2), "%G": (c) => S(c), "%H": (c) => p(c.tm_hour, 2), "%I": (c) => {
        var d = c.tm_hour;
        return d == 0 ? d = 12 : d > 12 && (d -= 12), p(d, 2);
      }, "%j": (c) => p(c.tm_mday + Pn(Te(c.tm_year + 1900) ? Sr : Fr, c.tm_mon - 1), 3), "%m": (c) => p(c.tm_mon + 1, 2), "%M": (c) => p(c.tm_min, 2), "%n": () => `
`, "%p": (c) => c.tm_hour >= 0 && c.tm_hour < 12 ? "AM" : "PM", "%S": (c) => p(c.tm_sec, 2), "%t": () => "	", "%u": (c) => c.tm_wday || 7, "%U": (c) => {
        var d = c.tm_yday + 7 - c.tm_wday;
        return p(Math.floor(d / 7), 2);
      }, "%V": (c) => {
        var d = Math.floor((c.tm_yday + 7 - (c.tm_wday + 6) % 7) / 7);
        if ((c.tm_wday + 371 - c.tm_yday - 2) % 7 <= 2 && d++, d) {
          if (d == 53) {
            var E = (c.tm_wday + 371 - c.tm_yday) % 7;
            E != 4 && (E != 3 || !Te(c.tm_year)) && (d = 1);
          }
        } else {
          d = 52;
          var A = (c.tm_wday + 7 - c.tm_yday - 1) % 7;
          (A == 4 || A == 5 && Te(c.tm_year % 400 - 1)) && d++;
        }
        return p(d, 2);
      }, "%w": (c) => c.tm_wday, "%W": (c) => {
        var d = c.tm_yday + 7 - (c.tm_wday + 6) % 7;
        return p(Math.floor(d / 7), 2);
      }, "%y": (c) => (c.tm_year + 1900).toString().substring(2), "%Y": (c) => c.tm_year + 1900, "%z": (c) => {
        var d = c.tm_gmtoff, A = d >= 0;
        return d = Math.abs(d) / 60, d = d / 60 * 100 + d % 60, (A ? "+" : "-") + ("0000" + d).slice(-4);
      }, "%Z": (c) => c.tm_zone, "%%": () => "%" };
      s = s.replace(/%%/g, "\0\0");
      for (var u in C)
        s.includes(u) && (s = s.replace(new RegExp(u, "g"), C[u](a)));
      s = s.replace(/\0\0/g, "%");
      var F = An(s, !1);
      return F.length > r ? 0 : (En(F, e), F.length - 1);
    }, Fn = (e, r, t, n, i) => Sn(e, r, t, n);
    nr = f.InternalError = class extends Error {
      constructor(r) {
        super(r), this.name = "InternalError";
      }
    }, lt(), K = f.BindingError = class extends Error {
      constructor(r) {
        super(r), this.name = "BindingError";
      }
    }, wt(), yt(), Ft(), _r = f.UnboundTypeError = Ot(Error, "UnboundTypeError"), Ht(), Ut();
    var Rn = { q: Kr, u: Qr, a: rt, h: tt, l: nt, I: it, P: at, n: st, aa: ot, d: et, pa: ut, X: ft, fa: vt, oa: jt, na: Wt, D: Mt, ea: xt, U: Vt, J: Bt, w: Nt, s: zt, T: Gt, L: tn, Q: nn, qa: an, ga: sn, ba: $r, ma: fn, V: ln, ja: vn, la: dn, K: hn, da: pn, ca: yn, _: bn, $: wn, H: Gn, S: ai, C: Kn, p: zn, b: Dn, z: Xn, ha: ei, c: Mn, j: In, i: jn, x: Jn, O: Zn, v: Ln, G: ti, N: ni, B: Qn, F: si, Y: ui, W: fi, k: Hn, f: Wn, e: On, g: kn, M: ii, m: Bn, ia: qn, o: Un, R: xn, t: Vn, ka: Nn, y: ri, r: Yn, E: oi, A: Cn, Z: Fn }, T = Jr(), x = f._free = (e) => (x = f._free = T.ta)(e), Ye = f._malloc = (e) => (Ye = f._malloc = T.ua)(e), Rr = (e) => (Rr = T.wa)(e);
    f.__embind_initialize_bindings = () => (f.__embind_initialize_bindings = T.xa)();
    var _ = (e, r) => (_ = T.ya)(e, r), fe = (e) => (fe = T.za)(e), g = () => (g = T.Aa)(), y = (e) => (y = T.Ba)(e), Dr = (e) => (Dr = T.Ca)(e), kr = (e) => (kr = T.Da)(e), Or = (e, r, t) => (Or = T.Ea)(e, r, t), jr = (e) => (jr = T.Fa)(e);
    f.dynCall_viijii = (e, r, t, n, i, a, s) => (f.dynCall_viijii = T.Ga)(e, r, t, n, i, a, s);
    var Wr = f.dynCall_jiii = (e, r, t, n) => (Wr = f.dynCall_jiii = T.Ha)(e, r, t, n), Mr = f.dynCall_jiiii = (e, r, t, n, i) => (Mr = f.dynCall_jiiii = T.Ia)(e, r, t, n, i);
    f.dynCall_iiiiij = (e, r, t, n, i, a, s) => (f.dynCall_iiiiij = T.Ja)(e, r, t, n, i, a, s), f.dynCall_iiiiijj = (e, r, t, n, i, a, s, o, u) => (f.dynCall_iiiiijj = T.Ka)(e, r, t, n, i, a, s, o, u), f.dynCall_iiiiiijj = (e, r, t, n, i, a, s, o, u, l) => (f.dynCall_iiiiiijj = T.La)(e, r, t, n, i, a, s, o, u, l);
    function Dn(e, r) {
      var t = g();
      try {
        return m(e)(r);
      } catch (n) {
        if (y(t), n !== n + 0)
          throw n;
        _(1, 0);
      }
    }
    function kn(e, r, t, n) {
      var i = g();
      try {
        m(e)(r, t, n);
      } catch (a) {
        if (y(i), a !== a + 0)
          throw a;
        _(1, 0);
      }
    }
    function On(e, r, t) {
      var n = g();
      try {
        m(e)(r, t);
      } catch (i) {
        if (y(n), i !== i + 0)
          throw i;
        _(1, 0);
      }
    }
    function jn(e, r, t, n, i) {
      var a = g();
      try {
        return m(e)(r, t, n, i);
      } catch (s) {
        if (y(a), s !== s + 0)
          throw s;
        _(1, 0);
      }
    }
    function Wn(e, r) {
      var t = g();
      try {
        m(e)(r);
      } catch (n) {
        if (y(t), n !== n + 0)
          throw n;
        _(1, 0);
      }
    }
    function Mn(e, r, t) {
      var n = g();
      try {
        return m(e)(r, t);
      } catch (i) {
        if (y(n), i !== i + 0)
          throw i;
        _(1, 0);
      }
    }
    function Hn(e) {
      var r = g();
      try {
        m(e)();
      } catch (t) {
        if (y(r), t !== t + 0)
          throw t;
        _(1, 0);
      }
    }
    function In(e, r, t, n) {
      var i = g();
      try {
        return m(e)(r, t, n);
      } catch (a) {
        if (y(i), a !== a + 0)
          throw a;
        _(1, 0);
      }
    }
    function Un(e, r, t, n, i, a) {
      var s = g();
      try {
        m(e)(r, t, n, i, a);
      } catch (o) {
        if (y(s), o !== o + 0)
          throw o;
        _(1, 0);
      }
    }
    function xn(e, r, t, n, i, a, s) {
      var o = g();
      try {
        m(e)(r, t, n, i, a, s);
      } catch (u) {
        if (y(o), u !== u + 0)
          throw u;
        _(1, 0);
      }
    }
    function Yn(e, r, t, n, i, a, s, o, u, l, v) {
      var h = g();
      try {
        m(e)(r, t, n, i, a, s, o, u, l, v);
      } catch (p) {
        if (y(h), p !== p + 0)
          throw p;
        _(1, 0);
      }
    }
    function Vn(e, r, t, n, i, a, s, o) {
      var u = g();
      try {
        m(e)(r, t, n, i, a, s, o);
      } catch (l) {
        if (y(u), l !== l + 0)
          throw l;
        _(1, 0);
      }
    }
    function Bn(e, r, t, n, i) {
      var a = g();
      try {
        m(e)(r, t, n, i);
      } catch (s) {
        if (y(a), s !== s + 0)
          throw s;
        _(1, 0);
      }
    }
    function Ln(e, r, t, n, i, a, s) {
      var o = g();
      try {
        return m(e)(r, t, n, i, a, s);
      } catch (u) {
        if (y(o), u !== u + 0)
          throw u;
        _(1, 0);
      }
    }
    function Nn(e, r, t, n, i, a, s, o, u) {
      var l = g();
      try {
        m(e)(r, t, n, i, a, s, o, u);
      } catch (v) {
        if (y(l), v !== v + 0)
          throw v;
        _(1, 0);
      }
    }
    function zn(e) {
      var r = g();
      try {
        return m(e)();
      } catch (t) {
        if (y(r), t !== t + 0)
          throw t;
        _(1, 0);
      }
    }
    function Xn(e, r, t, n) {
      var i = g();
      try {
        return m(e)(r, t, n);
      } catch (a) {
        if (y(i), a !== a + 0)
          throw a;
        _(1, 0);
      }
    }
    function Zn(e, r, t, n, i, a, s) {
      var o = g();
      try {
        return m(e)(r, t, n, i, a, s);
      } catch (u) {
        if (y(o), u !== u + 0)
          throw u;
        _(1, 0);
      }
    }
    function Gn(e, r, t, n) {
      var i = g();
      try {
        return m(e)(r, t, n);
      } catch (a) {
        if (y(i), a !== a + 0)
          throw a;
        _(1, 0);
      }
    }
    function qn(e, r, t, n, i, a, s, o) {
      var u = g();
      try {
        m(e)(r, t, n, i, a, s, o);
      } catch (l) {
        if (y(u), l !== l + 0)
          throw l;
        _(1, 0);
      }
    }
    function Jn(e, r, t, n, i, a) {
      var s = g();
      try {
        return m(e)(r, t, n, i, a);
      } catch (o) {
        if (y(s), o !== o + 0)
          throw o;
        _(1, 0);
      }
    }
    function Kn(e, r, t, n, i, a) {
      var s = g();
      try {
        return m(e)(r, t, n, i, a);
      } catch (o) {
        if (y(s), o !== o + 0)
          throw o;
        _(1, 0);
      }
    }
    function Qn(e, r, t, n, i, a, s, o, u, l) {
      var v = g();
      try {
        return m(e)(r, t, n, i, a, s, o, u, l);
      } catch (h) {
        if (y(v), h !== h + 0)
          throw h;
        _(1, 0);
      }
    }
    function ei(e, r, t) {
      var n = g();
      try {
        return m(e)(r, t);
      } catch (i) {
        if (y(n), i !== i + 0)
          throw i;
        _(1, 0);
      }
    }
    function ri(e, r, t, n, i, a, s, o, u, l) {
      var v = g();
      try {
        m(e)(r, t, n, i, a, s, o, u, l);
      } catch (h) {
        if (y(v), h !== h + 0)
          throw h;
        _(1, 0);
      }
    }
    function ti(e, r, t, n, i, a, s, o) {
      var u = g();
      try {
        return m(e)(r, t, n, i, a, s, o);
      } catch (l) {
        if (y(u), l !== l + 0)
          throw l;
        _(1, 0);
      }
    }
    function ni(e, r, t, n, i, a, s, o, u) {
      var l = g();
      try {
        return m(e)(r, t, n, i, a, s, o, u);
      } catch (v) {
        if (y(l), v !== v + 0)
          throw v;
        _(1, 0);
      }
    }
    function ii(e, r, t, n, i, a, s) {
      var o = g();
      try {
        m(e)(r, t, n, i, a, s);
      } catch (u) {
        if (y(o), u !== u + 0)
          throw u;
        _(1, 0);
      }
    }
    function ai(e, r, t, n) {
      var i = g();
      try {
        return m(e)(r, t, n);
      } catch (a) {
        if (y(i), a !== a + 0)
          throw a;
        _(1, 0);
      }
    }
    function si(e, r, t, n, i, a, s, o, u, l, v, h) {
      var p = g();
      try {
        return m(e)(r, t, n, i, a, s, o, u, l, v, h);
      } catch ($) {
        if (y(p), $ !== $ + 0)
          throw $;
        _(1, 0);
      }
    }
    function oi(e, r, t, n, i, a, s, o, u, l, v, h, p, $, w, S) {
      var C = g();
      try {
        m(e)(r, t, n, i, a, s, o, u, l, v, h, p, $, w, S);
      } catch (F) {
        if (y(C), F !== F + 0)
          throw F;
        _(1, 0);
      }
    }
    function ui(e, r, t, n) {
      var i = g();
      try {
        return Wr(e, r, t, n);
      } catch (a) {
        if (y(i), a !== a + 0)
          throw a;
        _(1, 0);
      }
    }
    function fi(e, r, t, n, i) {
      var a = g();
      try {
        return Mr(e, r, t, n, i);
      } catch (s) {
        if (y(a), s !== s + 0)
          throw s;
        _(1, 0);
      }
    }
    var Ae;
    te = function e() {
      Ae || Hr(), Ae || (te = e);
    };
    function Hr() {
      if (L > 0 || (xr(), L > 0))
        return;
      function e() {
        Ae || (Ae = !0, f.calledRun = !0, !ze && (Yr(), q(f), f.onRuntimeInitialized && f.onRuntimeInitialized(), Vr()));
      }
      f.setStatus ? (f.setStatus("Running..."), setTimeout(function() {
        setTimeout(function() {
          f.setStatus("");
        }, 1), e();
      }, 1)) : e();
    }
    if (f.preInit)
      for (typeof f.preInit == "function" && (f.preInit = [f.preInit]); f.preInit.length > 0; )
        f.preInit.pop()();
    return Hr(), G.ready;
  };
})();
function _i(Y) {
  return li(Ve, Y);
}
async function gi(Y, {
  tryHarder: G = B.tryHarder,
  formats: f = B.formats,
  maxSymbols: q = B.maxSymbols
} = B) {
  return ci(
    Y,
    {
      tryHarder: G,
      formats: f,
      maxSymbols: q
    },
    Ve
  );
}
async function yi(Y, {
  tryHarder: G = B.tryHarder,
  formats: f = B.formats,
  maxSymbols: q = B.maxSymbols
} = B) {
  return vi(
    Y,
    {
      tryHarder: G,
      formats: f,
      maxSymbols: q
    },
    Ve
  );
}
export {
  bi as ZXING_BARCODE_FORMAT_NAMES,
  wi as ZXING_CHARACTOR_SET_NAMES,
  B as defaultZXingReadOptions,
  Ci as defaultZXingWriteOptions,
  _i as getZXingModule,
  Pi as purgeZXingModule,
  yi as readBarcodesFromImageData,
  gi as readBarcodesFromImageFile,
  Ti as setZXingModuleOverrides
};
