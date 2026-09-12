//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, n) => {
	let r = {};
	for (var i in e) t(r, i, {
		get: e[i],
		enumerable: !0
	});
	return n || t(r, Symbol.toStringTag, { value: "Module" }), r;
}, c = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, l = (n, r, o) => (o = n == null ? {} : e(i(n)), c(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)), u = Array.isArray, d = Array.prototype.indexOf, f = Array.prototype.includes, p = Array.from, m = Object.defineProperty, h = Object.getOwnPropertyDescriptor, g = Object.getOwnPropertyDescriptors, _ = Object.prototype, v = Array.prototype, y = Object.getPrototypeOf, b = Object.isExtensible, x = () => {};
function S(e) {
	for (var t = 0; t < e.length; t++) e[t]();
}
function ee() {
	var e, t;
	return {
		promise: new Promise((n, r) => {
			e = n, t = r;
		}),
		resolve: e,
		reject: t
	};
}
var C = 1024, w = 2048, te = 4096, ne = 8192, re = 16384, ie = 32768, ae = 1 << 25, oe = 65536, se = 1 << 19, ce = 1 << 20, le = 1 << 25, ue = 65536, de = 1 << 21, fe = 1 << 22, pe = 1 << 23, me = Symbol("$state"), he = Symbol("component"), ge = Symbol(""), _e = Symbol("attributes"), ve = Symbol("class"), ye = Symbol("style"), be = Symbol("text"), xe = new class extends Error {
	name = "StaleReactionError";
	message = "The reaction that called `getAbortSignal()` was re-run or destroyed";
}(), Se = !!globalThis.document?.contentType && /* @__PURE__ */ globalThis.document.contentType.includes("xml"), Ce = {}, T = Symbol("uninitialized"), we = "http://www.w3.org/1999/xhtml";
function Te() {
	console.warn("https://svelte.dev/e/derived_inert");
}
function Ee(e) {
	console.warn("https://svelte.dev/e/hydration_mismatch");
}
function De() {
	console.warn("https://svelte.dev/e/svelte_boundary_reset_noop");
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/hydration.js
var E = !1;
function Oe(e) {
	E = e;
}
var D;
function O(e) {
	if (e === null) throw Ee(), Ce;
	return D = e;
}
function ke() {
	return O(/* @__PURE__ */ $t(D));
}
function k(e) {
	if (E) {
		if (/* @__PURE__ */ $t(D) !== null) throw Ee(), Ce;
		D = e;
	}
}
function Ae(e = 1) {
	if (E) {
		for (var t = e, n = D; t--;) n = /* @__PURE__ */ $t(n);
		D = n;
	}
}
function je(e = !0) {
	for (var t = 0, n = D;;) {
		if (n.nodeType === 8) {
			var r = n.data;
			if (r === "]") {
				if (t === 0) return n;
				--t;
			} else (r === "[" || r === "[!" || r[0] === "[" && !isNaN(Number(r.slice(1)))) && (t += 1);
		}
		var i = /* @__PURE__ */ $t(n);
		e && n.remove(), n = i;
	}
}
function Me(e) {
	if (!e || e.nodeType !== 8) throw Ee(), Ce;
	return e.data;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/equality.js
function Ne(e) {
	return e === this.v;
}
function Pe(e, t) {
	return e == e ? e !== t || typeof e == "object" && !!e || typeof e == "function" : t == t;
}
function Fe(e) {
	return !Pe(e, this.v);
}
function Ie(e) {
	throw Error("https://svelte.dev/e/lifecycle_outside_component");
}
//#endregion
//#region node_modules/svelte/src/internal/client/errors.js
function Le() {
	throw Error("https://svelte.dev/e/async_derived_orphan");
}
function Re(e, t, n) {
	throw Error("https://svelte.dev/e/each_key_duplicate");
}
function ze(e) {
	throw Error("https://svelte.dev/e/effect_in_teardown");
}
function Be() {
	throw Error("https://svelte.dev/e/effect_in_unowned_derived");
}
function Ve(e) {
	throw Error("https://svelte.dev/e/effect_orphan");
}
function He() {
	throw Error("https://svelte.dev/e/effect_update_depth_exceeded");
}
function Ue() {
	throw Error("https://svelte.dev/e/state_descriptors_fixed");
}
function We() {
	throw Error("https://svelte.dev/e/state_prototype_fixed");
}
function Ge() {
	throw Error("https://svelte.dev/e/state_unsafe_mutation");
}
function Ke() {
	throw Error("https://svelte.dev/e/svelte_boundary_reset_onerror");
}
//#endregion
//#region node_modules/svelte/src/internal/client/context.js
var A = null;
function qe(e) {
	A = e;
}
function Je(e, t = !1, n) {
	A = {
		p: A,
		i: !1,
		c: null,
		e: null,
		s: e,
		x: null,
		r: H,
		l: null
	};
}
function Ye(e) {
	var t = A, n = t.e;
	if (n !== null) {
		t.e = null;
		for (var r of n) hn(r);
	}
	return e !== void 0 && (t.x = e), t.i = !0, A = t.p, Xe(e);
}
function Xe(e = {}) {
	return m(e, he, { value: !0 }), e;
}
function Ze() {
	return !0;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/task.js
var Qe = [];
function $e() {
	var e = Qe;
	Qe = [], S(e);
}
function et(e) {
	if (Qe.length === 0 && !wt) {
		var t = Qe;
		queueMicrotask(() => {
			t === Qe && $e();
		});
	}
	Qe.push(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/status.js
var tt = ~(w | te | C);
function j(e, t) {
	e.f = e.f & tt | t;
}
function nt(e) {
	e.f & 512 || e.deps === null ? j(e, C) : j(e, te);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/utils.js
function rt(e) {
	if (e !== null) for (let t of e) t.f & 2 && t.f & 65536 && (t.f ^= ue, rt(t.deps));
}
function it(e, t, n) {
	e.f & 2048 ? t.add(e) : e.f & 4096 && n.add(e), rt(e.deps), j(e, C);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/shared.js
function at(e) {
	var t = B, n = H;
	V(null), Ln(null);
	try {
		return e();
	} finally {
		V(t), Ln(n);
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/async.js
function ot(e, t, n, r) {
	let i = Ze() ? ut : mt;
	var a = e.filter((e) => !e.settled), o = t.map(i);
	if (n.length === 0 && a.length === 0) {
		r(o);
		return;
	}
	var s = H, c = st(), l = a.length === 1 ? a[0].promise : a.length > 1 ? Promise.all(a.map((e) => e.promise)) : null;
	function u(e) {
		if (!(s.f & 16384)) {
			c();
			try {
				r([...o, ...e]);
			} catch (e) {
				cn(e, s);
			}
			ct();
		}
	}
	var d = lt();
	if (n.length === 0) {
		l.then(() => u([])).finally(d);
		return;
	}
	function f() {
		Promise.all(n.map((e) => /* @__PURE__ */ ft(e))).then(u).catch((e) => cn(e, s)).finally(d);
	}
	l ? l.then(() => {
		c(), f(), ct();
	}) : f();
}
function st() {
	var e = H, t = B, n = A, r = M;
	return function(i = !0) {
		Ln(e), V(t), qe(n), i && !(e.f & 16384) && (r?.activate(), r?.apply());
	};
}
function ct(e = !0) {
	Ln(null), V(null), qe(null), e && M?.deactivate();
}
function lt() {
	var e = H, t = e.b, n = M, r = !!t?.is_rendered();
	return t?.update_pending_count(1, n), n.increment(r, e), () => {
		t?.update_pending_count(-1, n), n.decrement(r, e);
	};
}
/*#__NO_SIDE_EFFECTS__*/
function ut(e) {
	var t = 2 | w;
	return H !== null && (H.f |= se), {
		ctx: A,
		deps: null,
		effects: null,
		equals: Ne,
		f: t,
		fn: e,
		reactions: null,
		rv: 0,
		v: T,
		wv: 0,
		parent: H,
		ac: null
	};
}
var dt = Symbol("obsolete");
/*#__NO_SIDE_EFFECTS__*/
function ft(e, t, n) {
	let r = H;
	r === null && Le();
	var i = void 0, a = Bt(T), o = !B, s = /* @__PURE__ */ new Set();
	return vn(() => {
		var t = H, n = ee();
		i = n.promise;
		try {
			Promise.resolve(e()).then(n.resolve, (e) => {
				e !== xe && n.reject(e);
			}).finally(ct);
		} catch (e) {
			n.reject(e), ct();
		}
		var c = M;
		if (o) {
			if (t.f & 32768) var l = lt();
			if (r.b?.is_rendered()) c.async_deriveds.get(t)?.reject(dt);
			else for (let e of s.values()) e.reject(dt);
			s.add(n), c.async_deriveds.set(t, n);
		}
		let u = (e, t = void 0) => {
			l?.(), s.delete(n), t !== dt && (c.activate(), t ? (a.f |= pe, Ht(a, t)) : (a.f & 8388608 && (a.f ^= pe), Ht(a, e)), c.deactivate());
		};
		n.promise.then(u, (e) => u(null, e || "unknown"));
	}), pn(() => {
		for (let e of s) e.reject(dt);
	}), new Promise((e) => {
		function t(n) {
			function r() {
				n === i ? e(a) : t(i);
			}
			n.then(r, r);
		}
		t(i);
	});
}
/*#__NO_SIDE_EFFECTS__*/
function pt(e) {
	let t = /* @__PURE__ */ ut(e);
	return zn(t), t;
}
/*#__NO_SIDE_EFFECTS__*/
function mt(e) {
	let t = /* @__PURE__ */ ut(e);
	return t.equals = Fe, t;
}
function ht(e) {
	var t = e.effects;
	if (t !== null) {
		e.effects = null;
		for (var n = 0; n < t.length; n += 1) z(t[n]);
	}
}
function gt(e) {
	var t, n = H, r = e.parent;
	if (!Pn && r !== null && e.v !== T && r.f & 24576) return Te(), e.v;
	Ln(r);
	try {
		e.f &= ~ue, ht(e), t = Jn(e);
	} finally {
		Ln(n);
	}
	return t;
}
function _t(e) {
	var t = gt(e);
	if (!e.equals(t) && (e.wv = Gn(), (!M?.is_fork || e.deps === null) && (M === null ? e.v = t : (M.capture(e, t, !0), xt?.capture(e, t, !0)), e.deps === null))) {
		j(e, C);
		return;
	}
	Pn || (St === null ? nt(e) : (fn() || M?.is_fork) && St.set(e, t));
}
function vt(e) {
	if (e.effects !== null) for (let t of e.effects) (t.teardown || t.ac) && (t.teardown?.(), t.ac !== null && at(() => {
		t.ac.abort(xe), t.ac = null;
	}), t.fn !== null && (t.teardown = x), Zn(t, 0), Cn(t));
}
function yt(e) {
	if (e.effects !== null) for (let t of e.effects) t.teardown && t.fn !== null && Qn(t);
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/batch.js
var bt = null, M = null, xt = null, St = null, Ct = null, wt = !1, Tt = !1, Et = null, Dt = null, Ot = 0, kt = 1, At = class e {
	id = kt++;
	#e = !1;
	linked = !0;
	#t = null;
	#n = null;
	async_deriveds = /* @__PURE__ */ new Map();
	current = /* @__PURE__ */ new Map();
	previous = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = /* @__PURE__ */ new Set();
	#a = 0;
	#o = /* @__PURE__ */ new Map();
	#s = null;
	#c = [];
	#l = [];
	#u = /* @__PURE__ */ new Set();
	#d = /* @__PURE__ */ new Set();
	#f = /* @__PURE__ */ new Map();
	#p = /* @__PURE__ */ new Set();
	is_fork = !1;
	#m = !1;
	constructor() {
		bt === null ? bt = this : (bt.#n = this, this.#t = bt), bt = this;
	}
	#h() {
		if (this.is_fork) return !0;
		for (let n of this.#o.keys()) {
			for (var e = n, t = !1; e.parent !== null;) {
				if (this.#f.has(e)) {
					t = !0;
					break;
				}
				e = e.parent;
			}
			if (!t) return !0;
		}
		return !1;
	}
	skip_effect(e) {
		this.#f.has(e) || this.#f.set(e, {
			d: [],
			m: []
		}), this.#p.delete(e);
	}
	unskip_effect(e, t = (e) => this.schedule(e)) {
		var n = this.#f.get(e);
		if (n) {
			this.#f.delete(e);
			for (var r of n.d) j(r, w), t(r);
			for (r of n.m) j(r, te), t(r);
		}
		this.#p.add(e);
	}
	#g() {
		this.#e = !0, Ot++ > 1e3 && (this.#x(), jt());
		for (let e of this.#u) this.#d.delete(e), j(e, w), this.schedule(e);
		for (let e of this.#d) j(e, te), this.schedule(e);
		let t = this.#c;
		this.#c = [], this.apply();
		var n = Et = [], r = [], i = Dt = [];
		for (let e of t) try {
			this.#_(e, n, r);
		} catch (t) {
			throw It(e), this.#h() || this.discard(), t;
		}
		if (M = null, i.length > 0) {
			var a = e.ensure();
			for (let e of i) a.schedule(e);
		}
		if (Et = null, Dt = null, this.#h()) {
			this.#b(r), this.#b(n);
			for (let [e, t] of this.#f) Ft(e, t);
			i.length > 0 && M.#g();
			return;
		}
		let o = this.#v();
		if (o) {
			this.#b(r), this.#b(n), o.#y(this);
			return;
		}
		this.#u.clear(), this.#d.clear();
		for (let e of this.#r) e(this);
		this.#r.clear(), xt = this, Nt(r), Nt(n), xt = null, this.#s?.resolve();
		var s = M;
		if (this.#a === 0 && (this.#c.length === 0 || s !== null) && this.#x(), this.#c.length > 0) {
			if (s !== null) {
				let e = s;
				e.#c.push(...this.#c.filter((t) => !e.#c.includes(t)));
			} else s = this;
		}
		s !== null && (Rt.clear(), s.#g());
	}
	#_(e, t, n) {
		e.f ^= C;
		for (var r = e.first; r !== null;) {
			var i = r.f, a = !!(i & 96);
			if (!(a && i & 1024 || i & 8192 || this.#f.has(r)) && r.fn !== null) {
				a ? r.f ^= C : i & 4 ? t.push(r) : Kn(r) && (i & 16 && this.#d.add(r), Qn(r));
				var o = r.first;
				if (o !== null) {
					r = o;
					continue;
				}
			}
			for (; r !== null;) {
				var s = r.next;
				if (s !== null) {
					r = s;
					break;
				}
				r = r.parent;
			}
		}
	}
	#v() {
		for (var e = this.#t; e !== null;) {
			if (!e.is_fork) {
				for (let [t, [, n]] of this.current) if (e.current.has(t) && !n) return e;
			}
			e = e.#t;
		}
		return null;
	}
	#y(e) {
		for (let [t, n] of e.current) !this.previous.has(t) && e.previous.has(t) && this.previous.set(t, e.previous.get(t)), this.current.set(t, n);
		for (let [t, n] of e.async_deriveds) {
			let e = this.async_deriveds.get(t);
			e && n.promise.then(e.resolve).catch(e.reject);
		}
		e.async_deriveds.clear(), this.transfer_effects(e.#u, e.#d);
		let t = (e) => {
			var n = e.reactions;
			if (n !== null && !(e.f & 2 && !(e.f & 6144))) for (let e of n) {
				var r = e.f;
				if (r & 2) t(e);
				else {
					var i = e;
					r & 4194320 && !this.async_deriveds.has(i) && (this.#d.delete(i), j(i, w), this.schedule(i));
				}
			}
		};
		for (let e of this.current.keys()) t(e);
		this.oncommit(() => e.discard()), e.#x(), M = this, this.#g();
	}
	#b(e) {
		for (var t = 0; t < e.length; t += 1) it(e[t], this.#u, this.#d);
	}
	capture(e, t, n = !1) {
		e.v !== T && !this.previous.has(e) && this.previous.set(e, e.v), e.f & 8388608 || (this.current.set(e, [t, n]), St?.set(e, t)), this.is_fork || (e.v = t);
	}
	activate() {
		M = this;
	}
	deactivate() {
		M = null, St = null;
	}
	flush() {
		try {
			Tt = !0, M = this, this.#g();
		} finally {
			Ot = 0, Ct = null, Et = null, Dt = null, Tt = !1, M = null, St = null, Rt.clear();
		}
	}
	discard() {
		for (let e of this.#i) e(this);
		this.#i.clear();
		for (let e of this.async_deriveds.values()) e.reject(dt);
		this.#x(), this.#s?.resolve();
	}
	register_created_effect(e) {
		this.#l.push(e);
	}
	increment(e, t) {
		if (this.#a += 1, e) {
			let e = this.#o.get(t) ?? 0;
			this.#o.set(t, e + 1);
		}
	}
	decrement(e, t) {
		if (--this.#a, e) {
			let e = this.#o.get(t) ?? 0;
			e === 1 ? this.#o.delete(t) : this.#o.set(t, e - 1);
		}
		this.#m || (this.#m = !0, et(() => {
			this.#m = !1, this.linked && this.flush();
		}));
	}
	transfer_effects(e, t) {
		for (let t of e) this.#u.add(t);
		for (let e of t) this.#d.add(e);
		e.clear(), t.clear();
	}
	oncommit(e) {
		this.#r.add(e);
	}
	ondiscard(e) {
		this.#i.add(e);
	}
	settled() {
		return (this.#s ??= ee()).promise;
	}
	static ensure() {
		if (M === null) {
			let t = M = new e();
			!Tt && et(() => {
				t.#e || t.flush();
			});
		}
		return M;
	}
	apply() {
		St = null;
	}
	schedule(e) {
		if (Ct = e, e.b?.is_pending && e.f & 16777228 && !(e.f & 32768)) {
			e.b.defer_effect(e);
			return;
		}
		for (var t = e; t.parent !== null;) {
			t = t.parent;
			var n = t.f;
			if (Et !== null && t === H && (B === null || !(B.f & 2))) return;
			if (n & 96) {
				if (!(n & 1024)) return;
				t.f ^= C;
			}
		}
		this.#c.push(t);
	}
	#x() {
		if (this.linked) {
			var e = this.#t, t = this.#n;
			e === null || (e.#n = t), t === null ? bt = e : t.#t = e, this.linked = !1;
		}
	}
};
function jt() {
	try {
		He();
	} catch (e) {
		cn(e, Ct);
	}
}
var Mt = null;
function Nt(e) {
	var t = e.length;
	if (t !== 0) {
		for (var n = 0; n < t;) {
			var r = e[n++];
			if (!(r.f & 24576) && Kn(r) && (Mt = /* @__PURE__ */ new Set(), Qn(r), r.deps === null && r.first === null && r.nodes === null && r.teardown === null && r.ac === null && En(r), Mt?.size > 0)) {
				Rt.clear();
				for (let e of Mt) {
					if (e.f & 24576) continue;
					let t = [e], n = e.parent;
					for (; n !== null;) Mt.has(n) && (Mt.delete(n), t.push(n)), n = n.parent;
					for (let e = t.length - 1; e >= 0; e--) {
						let n = t[e];
						n.f & 24576 || Qn(n);
					}
				}
				Mt.clear();
			}
		}
		Mt = null;
	}
}
function Pt(e) {
	M.schedule(e);
}
function Ft(e, t) {
	if (!(e.f & 32 && e.f & 1024)) {
		e.f & 2048 ? t.d.push(e) : e.f & 4096 && t.m.push(e), j(e, C);
		for (var n = e.first; n !== null;) Ft(n, t), n = n.next;
	}
}
function It(e) {
	j(e, C);
	for (var t = e.first; t !== null;) It(t), t = t.next;
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/sources.js
var Lt = /* @__PURE__ */ new Set(), Rt = /* @__PURE__ */ new Map(), zt = !1;
function Bt(e, t) {
	return {
		f: 0,
		v: e,
		reactions: null,
		equals: Ne,
		rv: 0,
		wv: 0
	};
}
/*#__NO_SIDE_EFFECTS__*/
function N(e, t) {
	let n = Bt(e, t);
	return zn(n), n;
}
/*#__NO_SIDE_EFFECTS__*/
function Vt(e, t = !1, n = !0) {
	let r = Bt(e);
	return t || (r.equals = Fe), r;
}
function P(e, t, n = !1) {
	return B !== null && (!In || B.f & 131072) && Ze() && B.f & 4325394 && (Rn === null || !Rn.has(e)) && Ge(), Ht(e, n ? Kt(t) : t, Dt);
}
function Ht(e, t, n = null) {
	if (!e.equals(t)) {
		Pn ? Rt.set(e, t) : Rt.has(e) || Rt.set(e, e.v);
		var r = At.ensure();
		if (r.capture(e, t), e.f & 2) {
			let t = e;
			e.f & 2048 && gt(t), St === null && nt(t);
		}
		e.wv = Gn(), Gt(e, w, n), Ze() && H !== null && H.f & 1024 && !(H.f & 96) && (G === null ? Bn([e]) : G.push(e)), !r.is_fork && Lt.size > 0 && !zt && Ut();
	}
	return t;
}
function Ut() {
	zt = !1;
	for (let e of Lt) {
		e.f & 1024 && j(e, te);
		let t;
		try {
			t = Kn(e);
		} catch {
			t = !0;
		}
		t && Qn(e);
	}
	Lt.clear();
}
function Wt(e) {
	P(e, e.v + 1);
}
function Gt(e, t, n) {
	var r = e.reactions;
	if (r !== null) for (var i = Ze(), a = r.length, o = 0; o < a; o++) {
		var s = r[o], c = s.f;
		if (i || s !== H) {
			var l = (c & w) === 0;
			if (l && j(s, t), c & 131072) Lt.add(s);
			else if (c & 2) {
				var u = s;
				St?.delete(u), c & 65536 || (c & 512 && (H === null || !(H.f & 2097152)) && (s.f |= ue), Gt(u, te, n));
			} else if (l) {
				var d = s;
				c & 16 && Mt !== null && Mt.add(d), n === null ? Pt(d) : n.push(d);
			}
		}
	}
}
function Kt(e) {
	if (typeof e != "object" || !e || me in e || he in e) return e;
	let t = y(e);
	if (t !== _ && t !== v) return e;
	var n = /* @__PURE__ */ new Map(), r = u(e), i = /* @__PURE__ */ N(0), a = null, o = Un, s = (e) => {
		if (Un === o) return e();
		var t = B, n = Un;
		V(null), Wn(o);
		var r = e();
		return V(t), Wn(n), r;
	};
	return r && n.set("length", /* @__PURE__ */ N(e.length, a)), new Proxy(e, {
		defineProperty(e, t, r) {
			(!("value" in r) || r.configurable === !1 || r.enumerable === !1 || r.writable === !1) && Ue();
			var i = n.get(t);
			return i === void 0 ? s(() => {
				var e = /* @__PURE__ */ N(r.value, a);
				return n.set(t, e), e;
			}) : P(i, r.value, !0), !0;
		},
		deleteProperty(e, t) {
			var r = n.get(t);
			if (r === void 0) {
				if (t in e) {
					let e = s(() => /* @__PURE__ */ N(T, a));
					n.set(t, e), Wt(i);
				}
			} else P(r, T), Wt(i);
			return !0;
		},
		get(t, r, i) {
			if (r === me) return e;
			var o = n.get(r), c = r in t;
			if (o === void 0 && (!c || h(t, r)?.writable) && (o = s(() => /* @__PURE__ */ N(Kt(c ? t[r] : T), a)), n.set(r, o)), o !== void 0) {
				var l = K(o);
				return l === T ? void 0 : l;
			}
			return Reflect.get(t, r, i);
		},
		getOwnPropertyDescriptor(e, t) {
			var r = Reflect.getOwnPropertyDescriptor(e, t);
			if (r && "value" in r) {
				var i = n.get(t);
				i && (r.value = K(i));
			} else if (r === void 0) {
				var a = n.get(t), o = a?.v;
				if (a !== void 0 && o !== T) return {
					enumerable: !0,
					configurable: !0,
					value: o,
					writable: !0
				};
			}
			return r;
		},
		has(e, t) {
			if (t === me) return !0;
			var r = n.get(t), i = r !== void 0 && r.v !== T || Reflect.has(e, t);
			return (r !== void 0 || H !== null && (!i || h(e, t)?.writable)) && (r === void 0 && (r = s(() => /* @__PURE__ */ N(i ? Kt(e[t]) : T, a)), n.set(t, r)), K(r) === T) ? !1 : i;
		},
		set(e, t, o, c) {
			var l = n.get(t), u = t in e;
			if (r && t === "length") for (var d = o; d < l.v; d += 1) {
				var f = n.get(d + "");
				f === void 0 ? d in e && (f = s(() => /* @__PURE__ */ N(T, a)), n.set(d + "", f)) : P(f, T);
			}
			if (l === void 0) (!u || h(e, t)?.writable) && (l = s(() => /* @__PURE__ */ N(void 0, a)), P(l, Kt(o)), n.set(t, l));
			else {
				u = l.v !== T;
				var p = s(() => Kt(o));
				P(l, p);
			}
			var m = Reflect.getOwnPropertyDescriptor(e, t);
			if (m?.set && m.set.call(c, o), !u) {
				if (r && typeof t == "string") {
					var g = n.get("length"), _ = Number(t);
					Number.isInteger(_) && _ >= g.v && P(g, _ + 1);
				}
				Wt(i);
			}
			return !0;
		},
		ownKeys(e) {
			K(i);
			var t = Reflect.ownKeys(e).filter((e) => {
				var t = n.get(e);
				return t === void 0 || t.v !== T;
			});
			for (var [r, a] of n) a.v !== T && !(r in e) && t.push(r);
			return t;
		},
		setPrototypeOf() {
			We();
		}
	});
}
var qt, Jt, Yt, Xt;
function Zt() {
	if (qt === void 0) {
		qt = window, Jt = /Firefox/.test(navigator.userAgent);
		var e = Element.prototype, t = Node.prototype, n = Text.prototype;
		Yt = h(t, "firstChild").get, Xt = h(t, "nextSibling").get, b(e) && (e[ve] = void 0, e[_e] = null, e[ye] = void 0, e.__e = void 0), b(n) && (n[be] = void 0);
	}
}
function Qt(e = "") {
	return document.createTextNode(e);
}
/*@__NO_SIDE_EFFECTS__*/
function F(e) {
	return Yt.call(e);
}
/*@__NO_SIDE_EFFECTS__*/
function $t(e) {
	return Xt.call(e);
}
function I(e, t) {
	if (!E) return /* @__PURE__ */ F(e);
	var n = /* @__PURE__ */ F(D);
	if (n === null) n = D.appendChild(Qt());
	else if (t && n.nodeType !== 3) {
		var r = Qt();
		return n?.before(r), O(r), r;
	}
	return t && on(n), O(n), n;
}
function en(e, t = !1) {
	if (!E) {
		var n = /* @__PURE__ */ F(e);
		return n instanceof Comment && n.data === "" ? /* @__PURE__ */ $t(n) : n;
	}
	if (t) {
		if (D?.nodeType !== 3) {
			var r = Qt();
			return D?.before(r), O(r), r;
		}
		on(D);
	}
	return D;
}
function tn(e, t = !1) {
	if (!E) return /* @__PURE__ */ F(e);
	var n = I(e, t);
	return k(e), n;
}
function L(e, t = 1, n = !1) {
	let r = E ? D : e;
	for (var i; t--;) i = r, r = /* @__PURE__ */ $t(r);
	if (!E) return r;
	if (n) {
		if (r?.nodeType !== 3) {
			var a = Qt();
			return r === null ? i?.after(a) : r.before(a), O(a), a;
		}
		on(r);
	}
	return O(r), r;
}
function nn(e) {
	e.textContent = "";
}
function rn() {
	return !1;
}
function an(e, t, n) {
	return t == null || t === "http://www.w3.org/1999/xhtml" ? n ? document.createElement(e, { is: n }) : document.createElement(e) : n ? document.createElementNS(t, e, { is: n }) : document.createElementNS(t, e);
}
function on(e) {
	if (e.nodeValue.length < 65536) return;
	let t = e.nextSibling;
	for (; t !== null && t.nodeType === 3;) t.remove(), e.nodeValue += t.nodeValue, t = e.nextSibling;
}
function sn(e) {
	var t = H;
	if (t === null) return B.f |= pe, e;
	if (!(t.f & 32768) && !(t.f & 4)) throw e;
	cn(e, t);
}
function cn(e, t) {
	if (!(t !== null && t.f & 16384)) {
		for (; t !== null;) {
			if (t.f & 128 && !(t.f & 33570816)) {
				if (!(t.f & 32768)) throw e;
				try {
					t.b.error(e);
					return;
				} catch (t) {
					e = t;
				}
			}
			t = t.parent;
		}
		throw e;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/reactivity/effects.js
function ln(e) {
	H === null && (B === null && Ve(e), Be()), Pn && ze(e);
}
function un(e, t) {
	var n = t.last;
	n === null ? t.last = t.first = e : (n.next = e, e.prev = n, t.last = e);
}
function dn(e, t) {
	var n = H;
	n !== null && n.f & 8192 && (e |= ne);
	var r = {
		ctx: A,
		deps: null,
		nodes: null,
		f: e | w | 512,
		first: null,
		fn: t,
		last: null,
		next: null,
		parent: n,
		b: n && n.b,
		prev: null,
		teardown: null,
		wv: 0,
		ac: null
	};
	M?.register_created_effect(r);
	var i = r;
	if (e & 4) Et === null ? At.ensure().schedule(r) : Et.push(r);
	else if (t !== null) {
		try {
			Qn(r);
		} catch (e) {
			throw z(r), e;
		}
		i.deps === null && i.teardown === null && i.nodes === null && i.first === i.last && !(i.f & 524288) && (i = i.first, e & 16 && e & 65536 && i !== null && (i.f |= oe));
	}
	if (i !== null && (i.parent = n, n !== null && un(i, n), B !== null && B.f & 2 && !(e & 64))) {
		var a = B;
		(a.effects ??= []).push(i);
	}
	return r;
}
function fn() {
	return B !== null && !In;
}
function pn(e) {
	let t = dn(8, null);
	return j(t, C), t.teardown = e, t;
}
function mn(e) {
	ln("$effect");
	var t = H.f;
	if (!B && t & 32 && A !== null && !A.i) {
		var n = A;
		(n.e ??= []).push(e);
	} else return hn(e);
}
function hn(e) {
	return dn(4 | ce, e);
}
function gn(e) {
	At.ensure();
	let t = dn(64 | se, e);
	return (e = {}) => new Promise((n) => {
		e.outro ? Dn(t, () => {
			z(t), n(void 0);
		}) : (z(t), n(void 0));
	});
}
function _n(e) {
	return dn(4, e);
}
function vn(e) {
	return dn(fe | se, e);
}
function yn(e, t = 0) {
	return dn(8 | t, e);
}
function bn(e, t = [], n = [], r = []) {
	ot(r, t, n, (t) => {
		dn(8, () => {
			e(...t.map(K));
		});
	});
}
function xn(e, t = 0) {
	return dn(16 | t, e);
}
function R(e) {
	return dn(32 | se, e);
}
function Sn(e) {
	var t = e.teardown;
	if (t !== null) {
		let n = Pn, r = B;
		Fn(!0), V(null);
		try {
			t.call(null);
		} catch (t) {
			cn(t, e.parent);
		} finally {
			Fn(n), V(r);
		}
	}
}
function Cn(e, t = !1) {
	var n = e.first;
	for (e.first = e.last = null; n !== null;) {
		let e = n.ac;
		e !== null && at(() => {
			e.abort(xe);
		});
		var r = n.next;
		n.f & 64 ? n.parent = null : z(n, t), n = r;
	}
}
function wn(e) {
	for (var t = e.first; t !== null;) {
		var n = t.next;
		t.f & 32 || z(t), t = n;
	}
}
function z(e, t = !0) {
	var n = !1;
	(t || e.f & 262144) && e.nodes !== null && e.nodes.end !== null && (Tn(e.nodes.start, e.nodes.end), n = !0), e.f |= ae, Cn(e, t && !n), Zn(e, 0);
	var r = e.nodes && e.nodes.t;
	if (r !== null) for (let e of r) e.stop();
	Sn(e), e.f ^= ae, e.f |= re;
	var i = e.parent;
	i !== null && i.first !== null && En(e), e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null;
}
function Tn(e, t) {
	for (; e !== null;) {
		var n = e === t ? null : /* @__PURE__ */ $t(e);
		e.remove(), e = n;
	}
}
function En(e) {
	var t = e.parent, n = e.prev, r = e.next;
	n !== null && (n.next = r), r !== null && (r.prev = n), t !== null && (t.first === e && (t.first = r), t.last === e && (t.last = n));
}
function Dn(e, t, n = !0) {
	var r = [];
	e.f |= 256, On(e, r, !0);
	var i = () => {
		n && z(e), t && t();
	}, a = r.length;
	if (a > 0) {
		var o = () => --a || i();
		for (var s of r) s.out(o);
	} else i();
}
function On(e, t, n) {
	if (!(e.f & 8192)) {
		e.f ^= ne;
		var r = e.nodes && e.nodes.t;
		if (r !== null) for (let e of r) (e.is_global || n) && t.push(e);
		for (var i = e.first; i !== null;) {
			var a = i.next;
			if (!(i.f & 64)) {
				var o = !!(i.f & 65536) || !!(i.f & 32) && !!(e.f & 16);
				On(i, t, o ? n : !1);
			}
			i = a;
		}
	}
}
function kn(e) {
	e.f &= -257, An(e, !0);
}
function An(e, t) {
	if (!(e.f & 256) && e.f & 8192) {
		e.f ^= ne, e.f & 1024 || (j(e, w), At.ensure().schedule(e));
		for (var n = e.first; n !== null;) {
			var r = n.next, i = !!(n.f & 65536) || !!(n.f & 32);
			An(n, i ? t : !1), n = r;
		}
		var a = e.nodes && e.nodes.t;
		if (a !== null) for (let e of a) (e.is_global || t) && e.in();
	}
}
function jn(e, t) {
	if (e.nodes) for (var n = e.nodes.start, r = e.nodes.end; n !== null;) {
		var i = n === r ? null : /* @__PURE__ */ $t(n);
		t.append(n), n = i;
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/legacy.js
var Mn = null, Nn = !1, Pn = !1;
function Fn(e) {
	Pn = e;
}
var B = null, In = !1;
function V(e) {
	B = e;
}
var H = null;
function Ln(e) {
	H = e;
}
var Rn = null;
function zn(e) {
	B !== null && (Rn ??= /* @__PURE__ */ new Set()).add(e);
}
var U = null, W = 0, G = null;
function Bn(e) {
	G = e;
}
var Vn = 1, Hn = 0, Un = Hn;
function Wn(e) {
	Un = e;
}
function Gn() {
	return ++Vn;
}
function Kn(e) {
	var t = e.f;
	if (t & 2048) return !0;
	if (t & 2 && (e.f &= ~ue), t & 4096) {
		for (var n = e.deps, r = n.length, i = 0; i < r; i++) {
			var a = n[i];
			if (Kn(a) && _t(a), a.wv > e.wv) return !0;
		}
		t & 512 && St === null && j(e, C);
	}
	return !1;
}
function qn(e, t, n = !0) {
	var r = e.reactions;
	if (r !== null && !(Rn !== null && Rn.has(e))) for (var i = 0; i < r.length; i++) {
		var a = r[i];
		a.f & 2 ? qn(a, t, !1) : t === a && (n ? j(a, w) : a.f & 1024 && j(a, te), Pt(a));
	}
}
function Jn(e) {
	var t = U, n = W, r = G, i = B, a = Rn, o = A, s = In, c = Un, l = e.f;
	U = null, W = 0, G = null, B = l & 96 ? null : e, Rn = null, qe(e.ctx), In = !1, Un = ++Hn, e.ac !== null && (at(() => {
		e.ac.abort(xe);
	}), e.ac = null);
	try {
		e.f |= de;
		var u = e.fn, d = u();
		e.f |= ie;
		var f = Yn(e);
		if (Ze() && G !== null && !In && f !== null && !(e.f & 6146)) for (var p = 0; p < G.length; p++) qn(G[p], e);
		if (i !== null && i !== e) {
			if (Hn++, i.deps !== null) for (let e = 0; e < n; e += 1) i.deps[e].rv = Hn;
			if (t !== null) for (let e of t) e.rv = Hn;
			G !== null && (r === null ? r = G : r.push(...G));
		}
		return e.f & 8388608 && (e.f ^= pe), d;
	} catch (t) {
		return Yn(e), sn(t);
	} finally {
		e.f ^= de, U = t, W = n, G = r, B = i, Rn = a, qe(o), In = s, Un = c;
	}
}
function Yn(e) {
	var t = e.deps, n = M?.is_fork;
	if (U !== null) {
		var r;
		if (n || Zn(e, W), t !== null && W > 0) for (t.length = W + U.length, r = 0; r < U.length; r++) t[W + r] = U[r];
		else e.deps = t = U;
		if (fn() && e.f & 512) for (r = W; r < t.length; r++) (t[r].reactions ??= []).push(e);
	} else !n && t !== null && W < t.length && (Zn(e, W), t.length = W);
	return t;
}
function Xn(e, t) {
	let n = t.reactions;
	if (n !== null) {
		var r = d.call(n, e);
		if (r !== -1) {
			var i = n.length - 1;
			i === 0 ? n = t.reactions = null : (n[r] = n[i], n.pop());
		}
	}
	if (n === null && t.f & 2 && (U === null || !f.call(U, t))) {
		var a = t;
		a.f & 512 && (a.f ^= 512, a.f &= ~ue), a.v !== T && nt(a), a.ac !== null && at(() => {
			a.ac.abort(xe), a.ac = null, j(a, w);
		}), vt(a), Zn(a, 0);
	}
}
function Zn(e, t) {
	var n = e.deps;
	if (n !== null) for (var r = t; r < n.length; r++) Xn(e, n[r]);
}
function Qn(e) {
	var t = e.f;
	if (!(t & 16384)) {
		j(e, C);
		var n = H, r = Nn;
		H = e, Nn = !(t & 96);
		try {
			t & 16777232 ? wn(e) : Cn(e), Sn(e);
			var i = Jn(e);
			e.teardown = typeof i == "function" ? i : null, e.wv = Vn;
		} finally {
			Nn = r, H = n;
		}
	}
}
function K(e) {
	var t = !!(e.f & 2);
	if (Mn?.add(e), B !== null && !In && !(H !== null && H.f & 16384) && (Rn === null || !Rn.has(e))) {
		var n = B.deps;
		if (B.f & 2097152) e.rv < Hn && (e.rv = Hn, U === null && n !== null && n[W] === e ? W++ : U === null ? U = [e] : U.push(e));
		else {
			B.deps ??= [], f.call(B.deps, e) || B.deps.push(e);
			var r = e.reactions;
			r === null ? e.reactions = [B] : f.call(r, B) || r.push(B);
		}
	}
	if (Pn && Rt.has(e)) return Rt.get(e);
	if (t) {
		var i = e;
		if (Pn) {
			var a = i.v;
			return (!(i.f & 1024) && i.reactions !== null || er(i)) && (a = gt(i)), Rt.set(i, a), a;
		}
		var o = !(i.f & 512) && !In && B !== null && (Nn || !!(B.f & 512)), s = (i.f & ie) === 0;
		Kn(i) && (o && (i.f |= 512), _t(i)), o && !s && (yt(i), $n(i));
	}
	if (St?.has(e)) return St.get(e);
	if (e.f & 8388608) throw e.v;
	return e.v;
}
function $n(e) {
	if (e.f |= 512, e.deps !== null) for (let t of e.deps) (t.reactions ??= []).push(e), t.f & 2 && !(t.f & 512) && (yt(t), $n(t));
}
function er(e) {
	if (e.v === T) return !0;
	if (e.deps === null) return !1;
	for (let t of e.deps) if (Rt.has(t) || t.f & 2 && er(t)) return !0;
	return !1;
}
function tr(e) {
	var t = In;
	try {
		return In = !0, e();
	} finally {
		In = t;
	}
}
[.../* @__PURE__ */ "allowfullscreen.async.autofocus.autoplay.checked.controls.default.disabled.formnovalidate.indeterminate.inert.ismap.loop.multiple.muted.nomodule.novalidate.open.playsinline.readonly.required.reversed.seamless.selected.webkitdirectory.defer.disablepictureinpicture.disableremoteplayback".split(".")];
var nr = ["touchstart", "touchmove"];
function rr(e) {
	return nr.includes(e);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/events.js
var ir = Symbol("events"), ar = /* @__PURE__ */ new Set(), or = /* @__PURE__ */ new Set();
function sr(e, t, n) {
	(t[ir] ??= {})[e] = n;
}
function cr(e) {
	for (var t = 0; t < e.length; t++) ar.add(e[t]);
	for (var n of or) n(e);
}
var lr = null, ur = !1;
function dr(e) {
	var t = this, n = t.ownerDocument, r = e.type, i = e.composedPath?.() || [], a = i[0] || e.target;
	lr = e, ur || (ur = !0, setTimeout(() => {
		ur = !1, lr = null;
	}));
	var o = 0, s = lr === e && e[ir];
	if (s) {
		var c = i.indexOf(s);
		if (c !== -1 && (t === document || t === window)) {
			e[ir] = t;
			return;
		}
		var l = i.indexOf(t);
		if (l === -1) return;
		c <= l && (o = c);
	}
	if (a = i[o] || e.target, a !== t) {
		m(e, "currentTarget", {
			configurable: !0,
			get() {
				return a || n;
			}
		});
		var u = B, d = H;
		V(null), Ln(null);
		try {
			for (var f, p = []; a !== null && a !== t;) {
				try {
					var h = a[ir]?.[r];
					h != null && (!a.disabled || e.target === a) && h.call(a, e);
				} catch (e) {
					f ? p.push(e) : f = e;
				}
				if (e.cancelBubble) break;
				o++, a = o < i.length ? i[o] : null;
			}
			if (f) {
				for (let e of p) queueMicrotask(() => {
					throw e;
				});
				throw f;
			}
		} finally {
			e[ir] = t, delete e.currentTarget, V(u), Ln(d);
		}
	}
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/reconciler.js
var fr = globalThis?.window?.trustedTypes && /* @__PURE__ */ globalThis.window.trustedTypes.createPolicy("svelte-trusted-html", { createHTML: (e) => e });
function pr(e) {
	return fr?.createHTML(e) ?? e;
}
function mr(e) {
	var t = an("template");
	return t.innerHTML = pr(e.replaceAll("<!>", "<!---->")), t.content;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/template.js
function hr(e, t) {
	var n = H;
	n.nodes === null && (n.nodes = {
		start: e,
		end: t,
		a: null,
		t: null
	});
}
/*#__NO_SIDE_EFFECTS__*/
function gr(e, t) {
	var n = !!(t & 1), r = !!(t & 2), i, a = !e.startsWith("<!>");
	return () => {
		if (E) return hr(D, null), D;
		i === void 0 && (i = mr(a ? e : "<!>" + e), n || (i = /* @__PURE__ */ F(i)));
		var t = r || Jt ? document.importNode(i, !0) : i.cloneNode(!0);
		if (n) {
			var o = /* @__PURE__ */ F(t), s = t.lastChild;
			hr(o, s);
		} else hr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function _r(e, t, n = "svg") {
	var r = !e.startsWith("<!>"), i = !!(t & 1), a = `<${n}>${r ? e : "<!>" + e}</${n}>`, o;
	return () => {
		if (E) return hr(D, null), D;
		if (!o) {
			var e = /* @__PURE__ */ F(mr(a));
			if (i) for (o = document.createDocumentFragment(); /* @__PURE__ */ F(e);) o.appendChild(/* @__PURE__ */ F(e));
			else o = /* @__PURE__ */ F(e);
		}
		var t = o.cloneNode(!0);
		if (i) {
			var n = /* @__PURE__ */ F(t), r = t.lastChild;
			hr(n, r);
		} else hr(t, t);
		return t;
	};
}
/*#__NO_SIDE_EFFECTS__*/
function vr(e, t) {
	return /* @__PURE__ */ _r(e, t, "svg");
}
function yr() {
	if (E) return hr(D, null), D;
	var e = document.createDocumentFragment(), t = document.createComment(""), n = Qt();
	return e.append(t, n), hr(t, n), e;
}
function q(e, t) {
	if (E) {
		var n = H;
		(!(n.f & 32768) || n.nodes.end === null) && (n.nodes.end = D), ke();
		return;
	}
	e !== null && e.before(t);
}
//#endregion
//#region node_modules/svelte/src/reactivity/create-subscriber.js
function br(e) {
	let t = 0, n = Bt(0), r;
	return () => {
		fn() && (K(n), yn(() => (t === 0 && (r = tr(() => e(() => Wt(n)))), t += 1, () => {
			et(() => {
				--t, t === 0 && (r?.(), r = void 0, Wt(n));
			});
		})));
	};
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/boundary.js
var xr = oe | se;
function Sr(e, t, n, r) {
	new Cr(e, t, n, r);
}
var Cr = class {
	parent;
	is_pending = !1;
	transform_error;
	#e;
	#t = E ? D : null;
	#n;
	#r;
	#i;
	#a = null;
	#o = null;
	#s = null;
	#c = null;
	#l = 0;
	#u = 0;
	#d = !1;
	#f = /* @__PURE__ */ new Set();
	#p = /* @__PURE__ */ new Set();
	#m = null;
	#h = br(() => (this.#m = Bt(this.#l), () => {
		this.#m = null;
	}));
	constructor(e, t, n, r) {
		this.#e = e, this.#n = t, this.#r = (e) => {
			var t = H;
			t.b = this, t.f |= 128, n(e);
		}, this.parent = H.b, this.transform_error = r ?? this.parent?.transform_error ?? ((e) => e), this.#i = xn(() => {
			if (E) {
				let e = this.#t;
				ke();
				let t = e.data === "[!";
				if (e.data.startsWith("[?")) {
					let t = JSON.parse(e.data.slice(2));
					this.#_(t);
				} else t ? this.#y() : this.#g();
			} else this.#b();
		}, xr), E && (this.#e = D);
	}
	#g() {
		try {
			this.#a = R(() => this.#r(this.#e));
		} catch (e) {
			this.error(e);
		}
	}
	#_(e) {
		let t = this.#n.failed, { reset: n, invoke_onerror: r } = this.#v(e);
		et(r), t && (this.#s = R(() => {
			t(this.#e, () => e, () => n);
		}));
	}
	#v(e) {
		var t = !1, n = !1;
		let r = () => {
			if (t) {
				De();
				return;
			}
			t = !0, n && Ke(), this.#s !== null && Dn(this.#s, () => {
				this.#s = null;
			}), this.#S(() => {
				this.#b();
			});
		};
		return {
			reset: r,
			invoke_onerror: () => {
				try {
					n = !0, this.#n.onerror?.(e, r), n = !1;
				} catch (e) {
					cn(e, this.#i && this.#i.parent);
				}
			}
		};
	}
	#y() {
		let e = this.#n.pending;
		e && (this.is_pending = !0, this.#o = R(() => e(this.#e)), et(() => {
			var e = this.#c = document.createDocumentFragment(), t = Qt(), n = !1;
			if (e.append(t), this.#a = this.#S(() => {
				try {
					return R(() => this.#r(t));
				} catch (e) {
					try {
						this.error(e), n = !0;
					} catch (e) {
						cn(e, this.#i.parent);
					}
					return null;
				}
			}), this.#a === null) {
				this.#c = null, n && this.#x(M);
				return;
			}
			this.#u === 0 && (this.#e.before(e), this.#c = null, Dn(this.#o, () => {
				this.#o = null;
			}), this.#x(M));
		}));
	}
	#b() {
		try {
			if (this.is_pending = this.has_pending_snippet(), this.#u = 0, this.#l = 0, this.#a = R(() => {
				this.#r(this.#e);
			}), this.#u > 0) {
				var e = this.#c = document.createDocumentFragment();
				jn(this.#a, e);
				let t = this.#n.pending;
				this.#o = R(() => t(this.#e));
			} else this.#x(M);
		} catch (e) {
			this.error(e);
		}
	}
	#x(e) {
		this.is_pending = !1, e.transfer_effects(this.#f, this.#p);
	}
	defer_effect(e) {
		it(e, this.#f, this.#p);
	}
	is_rendered() {
		return !this.is_pending && (!this.parent || this.parent.is_rendered());
	}
	has_pending_snippet() {
		return !!this.#n.pending;
	}
	#S(e) {
		var t = H, n = B, r = A;
		Ln(this.#i), V(this.#i), qe(this.#i.ctx);
		try {
			return At.ensure(), e();
		} finally {
			Ln(t), V(n), qe(r);
		}
	}
	#C(e, t) {
		if (!this.has_pending_snippet()) {
			this.parent && this.parent.#C(e, t);
			return;
		}
		this.#u += e, this.#u === 0 && (this.#x(t), this.#o && Dn(this.#o, () => {
			this.#o = null;
		}), this.#c &&= (this.#e.before(this.#c), null));
	}
	update_pending_count(e, t) {
		this.#C(e, t), this.#l += e, !(!this.#m || this.#d) && (this.#d = !0, et(() => {
			this.#d = !1, this.#m && Ht(this.#m, this.#l);
		}));
	}
	get_effect_pending() {
		return this.#h(), K(this.#m);
	}
	error(e) {
		if (!this.#n.onerror && !this.#n.failed) throw e;
		M?.is_fork ? (this.#a && M.skip_effect(this.#a), this.#o && M.skip_effect(this.#o), this.#s && M.skip_effect(this.#s), M.oncommit(() => {
			this.#w(e);
		})) : this.#w(e);
	}
	#w(e) {
		this.#a &&= (z(this.#a), null), this.#o &&= (z(this.#o), null), this.#s &&= (z(this.#s), null), E && (O(this.#t), Ae(), O(je()));
		let t = this.#n.failed, n = (e) => {
			let { reset: n, invoke_onerror: r } = this.#v(e);
			r(), t && (this.#s = this.#S(() => {
				try {
					return R(() => {
						var r = H;
						r.b = this, r.f |= 128, t(this.#e, () => e, () => n);
					});
				} catch (e) {
					return cn(e, this.#i.parent), null;
				}
			}));
		};
		et(() => {
			var t;
			try {
				t = this.transform_error(e);
			} catch (e) {
				cn(e, this.#i && this.#i.parent);
				return;
			}
			typeof t == "object" && t && typeof t.then == "function" ? t.then(n, (e) => cn(e, this.#i && this.#i.parent)) : n(t);
		});
	}
};
function wr(e, t) {
	var n = t == null ? "" : typeof t == "object" ? `${t}` : t;
	n !== (e[be] ??= e.nodeValue) && (e[be] = n, e.nodeValue = `${n}`);
}
function Tr(e, t) {
	return Dr(e, t);
}
var Er = /* @__PURE__ */ new Map();
function Dr(e, { target: t, anchor: n, props: r = {}, events: i, context: a, intro: o = !0, transformError: s }) {
	Zt();
	var c = void 0, l = gn(() => {
		var o = n ?? t.appendChild(Qt());
		Sr(o, { pending: () => {} }, (t) => {
			Je({});
			var n = A;
			if (a && (n.c = a), i && (r.$$events = i), E && hr(t, null), c = e(t, r) || Xe(), E && (H.nodes.end = D, D === null || D.nodeType !== 8 || D.data !== "]")) throw Ee(), Ce;
			Ye();
		}, s);
		var l = /* @__PURE__ */ new Set(), u = (e) => {
			for (var n = 0; n < e.length; n++) {
				var r = e[n];
				if (!l.has(r)) {
					l.add(r);
					var i = rr(r);
					for (let e of [t, document]) {
						var a = Er.get(e);
						a === void 0 && (a = /* @__PURE__ */ new Map(), Er.set(e, a));
						var o = a.get(r);
						o === void 0 ? (e.addEventListener(r, dr, { passive: i }), a.set(r, 1)) : a.set(r, o + 1);
					}
				}
			}
		};
		return u(p(ar)), or.add(u), () => {
			for (var e of l) for (let n of [t, document]) {
				var r = Er.get(n), i = r.get(e);
				--i == 0 ? (n.removeEventListener(e, dr), r.delete(e), r.size === 0 && Er.delete(n)) : r.set(e, i);
			}
			or.delete(u), o !== n && o.parentNode?.removeChild(o);
		};
	});
	return Or.set(c, l), c;
}
var Or = /* @__PURE__ */ new WeakMap(), kr = class {
	anchor;
	#e = /* @__PURE__ */ new Map();
	#t = /* @__PURE__ */ new Map();
	#n = /* @__PURE__ */ new Map();
	#r = /* @__PURE__ */ new Set();
	#i = !0;
	constructor(e, t = !0) {
		this.anchor = e, this.#i = t;
	}
	#a = (e) => {
		if (this.#e.has(e)) {
			var t = this.#e.get(e), n = this.#t.get(t);
			if (n) kn(n), this.#r.delete(t);
			else {
				var r = this.#n.get(t);
				r && (kn(r.effect), this.#t.set(t, r.effect), this.#n.delete(t), r.fragment.lastChild.remove(), this.anchor.before(r.fragment), n = r.effect);
			}
			for (let [t, n] of this.#e) {
				if (this.#e.delete(t), t === e) break;
				let r = this.#n.get(n);
				r && (z(r.effect), this.#n.delete(n));
			}
			for (let [e, r] of this.#t) {
				if (e === t || this.#r.has(e)) continue;
				let i = () => {
					if (Array.from(this.#e.values()).includes(e)) {
						var t = document.createDocumentFragment();
						jn(r, t), t.append(Qt()), this.#n.set(e, {
							effect: r,
							fragment: t
						});
					} else z(r);
					this.#r.delete(e), this.#t.delete(e);
				};
				this.#i || !n ? (this.#r.add(e), Dn(r, i, !1)) : i();
			}
		}
	};
	#o = (e) => {
		this.#e.delete(e);
		let t = Array.from(this.#e.values());
		for (let [e, n] of this.#n) t.includes(e) || (z(n.effect), this.#n.delete(e));
	};
	ensure(e, t) {
		var n = M, r = rn();
		if (t && !this.#t.has(e) && !this.#n.has(e)) {
			if (r) {
				var i = document.createDocumentFragment(), a = Qt();
				i.append(a), this.#n.set(e, {
					effect: R(() => t(a)),
					fragment: i
				});
			} else this.#t.set(e, R(() => t(this.anchor)));
		}
		if (this.#e.set(n, e), r) {
			for (let [t, r] of this.#t) t === e ? n.unskip_effect(r) : n.skip_effect(r);
			for (let [t, r] of this.#n) t === e ? n.unskip_effect(r.effect) : n.skip_effect(r.effect);
			n.oncommit(this.#a), n.ondiscard(this.#o);
		} else E && (this.anchor = D), this.#a(n);
	}
};
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/if.js
function Ar(e, t, n = !1) {
	var r;
	E && (r = D, ke());
	var i = new kr(e), a = n ? oe : 0;
	function o(e, t) {
		if (E) {
			var n = Me(r);
			if (e !== parseInt(n.substring(1))) {
				var a = je();
				O(a), i.anchor = a, Oe(!1), i.ensure(e, t), Oe(!0);
				return;
			}
		}
		i.ensure(e, t);
	}
	xn(() => {
		var e = !1;
		t((t, n = 0) => {
			e = !0, o(n, t);
		}), e || o(-1, null);
	}, a);
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/blocks/each.js
function jr(e, t) {
	return t;
}
function Mr(e, t, n) {
	for (var r = [], i = t.length, a, o = t.length, s = 0; s < i; s++) {
		let n = t[s];
		Dn(n, () => {
			if (a) {
				if (a.pending.delete(n), a.done.add(n), a.pending.size === 0) {
					var t = e.outrogroups;
					Nr(e, p(a.done)), t.delete(a), t.size === 0 && (e.outrogroups = null);
				}
			} else --o;
		}, !1);
	}
	if (o === 0) {
		var c = r.length === 0 && n !== null && e.pending.size === 0;
		if (c) {
			var l = n, u = l.parentNode;
			nn(u), u.append(l), e.items.clear();
		}
		Nr(e, t, !c);
	} else a = {
		pending: new Set(t),
		done: /* @__PURE__ */ new Set()
	}, (e.outrogroups ??= /* @__PURE__ */ new Set()).add(a);
}
function Nr(e, t, n = !0) {
	var r;
	if (e.pending.size > 0) {
		r = /* @__PURE__ */ new Set();
		for (let t of e.pending.values()) for (let n of t) r.add(e.items.get(n).e);
	}
	for (var i = 0; i < t.length; i++) {
		var a = t[i];
		r?.has(a) ? (a.f |= le, jn(a, document.createDocumentFragment())) : z(t[i], n);
	}
}
var Pr;
function Fr(e, t, n, r, i, a = null) {
	var o = e, s = /* @__PURE__ */ new Map();
	if (t & 4) {
		var c = e;
		o = E ? O(/* @__PURE__ */ F(c)) : c.appendChild(Qt());
	}
	E && ke();
	var l = null, d = /* @__PURE__ */ mt(() => {
		var e = n();
		return u(e) ? e : e == null ? [] : p(e);
	}), f, m = /* @__PURE__ */ new Map(), h = !0;
	function g(e) {
		v.effect.f & 16384 || (v.pending.delete(e), v.fallback = l, Lr(v, f, o, t, r), l !== null && (f.length === 0 ? l.f & 33554432 ? (l.f ^= le, zr(l, null, o)) : kn(l) : Dn(l, () => {
			l = null;
		})));
	}
	function _(e) {
		v.pending.delete(e);
	}
	var v = {
		effect: xn(() => {
			f = K(d);
			var e = f.length;
			let c = !1;
			E && Me(o) === "[!" != (e === 0) && (o = je(), O(o), Oe(!1), c = !0);
			for (var u = /* @__PURE__ */ new Set(), p = M, v = rn(), y = 0; y < e; y += 1) {
				E && D.nodeType === 8 && D.data === "]" && (o = D, c = !0, Oe(!1));
				var b = f[y], x = r(b, y), S = h ? null : s.get(x);
				S ? (S.v && Ht(S.v, b), S.i && Ht(S.i, y), v && p.unskip_effect(S.e)) : (S = Rr(s, h ? o : Pr ??= Qt(), b, x, y, i, t, n), h || (S.e.f |= le), s.set(x, S)), u.add(x);
			}
			if (e === 0 && a && !l && (h ? l = R(() => a(o)) : (l = R(() => a(Pr ??= Qt())), l.f |= le)), e > u.size && Re("", "", ""), E && e > 0 && O(je()), !h) {
				if (m.set(p, u), v) {
					for (let [e, t] of s) u.has(e) || p.skip_effect(t.e);
					p.oncommit(g), p.ondiscard(_);
				} else g(p);
			}
			c && Oe(!0), K(d);
		}),
		flags: t,
		items: s,
		pending: m,
		outrogroups: null,
		fallback: l
	};
	h = !1, E && (o = D);
}
function Ir(e) {
	for (; e !== null && !(e.f & 32);) e = e.next;
	return e;
}
function Lr(e, t, n, r, i) {
	var a = !!(r & 8), o = t.length, s = e.items, c = Ir(e.effect.first), l, u = null, d, f = [], m = [], h, g, _, v;
	if (a) for (v = 0; v < o; v += 1) h = t[v], g = i(h, v), _ = s.get(g).e, _.f & 33554432 || (_.nodes?.a?.measure(), (d ??= /* @__PURE__ */ new Set()).add(_));
	for (v = 0; v < o; v += 1) {
		if (h = t[v], g = i(h, v), _ = s.get(g).e, e.outrogroups !== null) for (let t of e.outrogroups) t.pending.delete(_), t.done.delete(_);
		if (_.f & 8192 && (kn(_), a && (_.nodes?.a?.unfix(), (d ??= /* @__PURE__ */ new Set()).delete(_))), _.f & 33554432) {
			if (_.f ^= le, _ === c) zr(_, null, n);
			else {
				var y = u ? u.next : c;
				_ === e.effect.last && (e.effect.last = _.prev), _.prev && (_.prev.next = _.next), _.next && (_.next.prev = _.prev), Br(e, u, _), Br(e, _, y), zr(_, y, n), u = _, f = [], m = [], c = Ir(u.next);
				continue;
			}
		}
		if (_ !== c) {
			if (l !== void 0 && l.has(_)) {
				if (f.length < m.length) {
					var b = m[0], x;
					u = b.prev;
					var S = f[0], ee = f[f.length - 1];
					for (x = 0; x < f.length; x += 1) zr(f[x], b, n);
					for (x = 0; x < m.length; x += 1) l.delete(m[x]);
					Br(e, S.prev, ee.next), Br(e, u, S), Br(e, ee, b), c = b, u = ee, --v, f = [], m = [];
				} else l.delete(_), zr(_, c, n), Br(e, _.prev, _.next), Br(e, _, u === null ? e.effect.first : u.next), Br(e, u, _), u = _;
				continue;
			}
			for (f = [], m = []; c !== null && c !== _;) (l ??= /* @__PURE__ */ new Set()).add(c), m.push(c), c = Ir(c.next);
			if (c === null) continue;
		}
		_.f & 33554432 || f.push(_), u = _, c = Ir(_.next);
	}
	if (e.outrogroups !== null) {
		for (let t of e.outrogroups) t.pending.size === 0 && (Nr(e, p(t.done)), e.outrogroups?.delete(t));
		e.outrogroups.size === 0 && (e.outrogroups = null);
	}
	if (c !== null || l !== void 0) {
		var C = [];
		if (l !== void 0) for (_ of l) _.f & 8192 || C.push(_);
		for (; c !== null;) !(c.f & 8192) && c !== e.fallback && C.push(c), c = Ir(c.next);
		var w = C.length;
		if (w > 0) {
			var te = r & 4 && o === 0 ? n : null;
			if (a) {
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.measure();
				for (v = 0; v < w; v += 1) C[v].nodes?.a?.fix();
			}
			Mr(e, C, te);
		}
	}
	a && et(() => {
		if (d !== void 0) for (_ of d) _.nodes?.a?.apply();
	});
}
function Rr(e, t, n, r, i, a, o, s) {
	var c = o & 1 ? o & 16 ? Bt(n) : /* @__PURE__ */ Vt(n, !1, !1) : null, l = o & 2 ? Bt(i) : null;
	return {
		v: c,
		i: l,
		e: R(() => (a(t, c ?? n, l ?? i, s), () => {
			e.delete(r);
		}))
	};
}
function zr(e, t, n) {
	if (e.nodes) for (var r = e.nodes.start, i = e.nodes.end, a = t && !(t.f & 33554432) ? t.nodes.start : n; r !== null;) {
		var o = /* @__PURE__ */ $t(r);
		if (a.before(r), r === i) return;
		r = o;
	}
}
function Br(e, t, n) {
	t === null ? e.effect.first = n : t.next = n, n === null ? e.effect.last = t : n.prev = t;
}
//#endregion
//#region node_modules/svelte/src/internal/shared/attributes.js
var Vr = [..." 	\n\r\f\xA0\v﻿"];
function Hr(e, t, n) {
	var r = e == null ? "" : "" + e;
	if (t && (r = r ? r + " " + t : t), n) {
		for (var i of Object.keys(n)) if (n[i]) r = r ? r + " " + i : i;
		else if (r.length) for (var a = i.length, o = 0; (o = r.indexOf(i, o)) >= 0;) {
			var s = o + a;
			(o === 0 || Vr.includes(r[o - 1])) && (s === r.length || Vr.includes(r[s])) ? r = (o === 0 ? "" : r.substring(0, o)) + r.substring(s + 1) : o = s;
		}
	}
	return r === "" ? null : r;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/class.js
function Ur(e, t, n, r, i, a) {
	var o = e[ve];
	if (E || o !== n || o === void 0) {
		var s = Hr(n, r, a);
		(!E || s !== e.getAttribute("class")) && (s == null ? e.removeAttribute("class") : t ? e.className = s : e.setAttribute("class", s)), e[ve] = n;
	} else if (a && i !== a) for (var c in a) {
		var l = !!a[c];
		(i == null || l !== !!i[c]) && e.classList.toggle(c, l);
	}
	return a;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/attributes.js
var Wr = Symbol("is custom element"), Gr = Symbol("is html"), Kr = Se ? "link" : "LINK";
function qr(e, t, n, r) {
	var i = Jr(e);
	E && (i[t] = e.getAttribute(t), t === "src" || t === "srcset" || t === "href" && e.nodeName === Kr) || i[t] !== (i[t] = n) && (t === "loading" && (e[ge] = n), n == null ? e.removeAttribute(t) : typeof n != "string" && Xr(e).has(t) ? e[t] = n : e.setAttribute(t, n));
}
function Jr(e) {
	return e[_e] ??= {
		[Wr]: e.nodeName.includes("-"),
		[Gr]: e.namespaceURI === we
	};
}
var Yr = /* @__PURE__ */ new Map();
function Xr(e) {
	var t = e.getAttribute("is") || e.nodeName, n = Yr.get(t);
	if (n) return n;
	Yr.set(t, n = /* @__PURE__ */ new Set());
	for (var r, i = e, a = Element.prototype; a !== i;) {
		for (var o in r = g(i), r) r[o].set && o !== "innerHTML" && o !== "textContent" && o !== "innerText" && n.add(o);
		i = y(i);
	}
	return n;
}
//#endregion
//#region node_modules/svelte/src/internal/client/dom/elements/bindings/this.js
function Zr(e, t) {
	return e === t || e?.[me] === t;
}
function Qr(e = Xe(), t, n, r) {
	var i = A.r, a = H;
	return _n(() => {
		var o, s;
		return yn(() => {
			o = s, s = r?.() || [], tr(() => {
				Zr(n(...s), e) || (t(e, ...s), o && Zr(n(...o), e) && t(null, ...o));
			});
		}), () => {
			let r = a;
			for (; r !== i && r.parent !== null && r.parent.f & 33554432;) r = r.parent;
			let o = () => {
				s && Zr(n(...s), e) && t(null, ...s);
			}, c = r.teardown;
			r.teardown = () => {
				o(), c?.();
			};
		};
	}), e;
}
function $r(e) {
	A === null && Ie("onMount"), mn(() => {
		let t = tr(e);
		if (typeof t == "function") return t;
	});
}
//#endregion
//#region node_modules/svelte/src/internal/disclose-version.js
typeof window < "u" && ((window.__svelte ??= {}).v ??= /* @__PURE__ */ new Set()).add("5");
//#endregion
//#region src/game/game-state.js
var ei = [
	"Горе вляво",
	"Горе в средата",
	"Горе вдясно",
	"В средата вляво",
	"В центъра",
	"В средата вдясно",
	"Долу вляво",
	"Долу в средата",
	"Долу вдясно"
], ti = [
	[
		0,
		1,
		2
	],
	[
		3,
		4,
		5
	],
	[
		6,
		7,
		8
	],
	[
		0,
		3,
		6
	],
	[
		1,
		4,
		7
	],
	[
		2,
		5,
		8
	],
	[
		0,
		4,
		8
	],
	[
		2,
		4,
		6
	]
];
function ni() {
	return {
		board: Array(9).fill(null),
		currentPlayer: "X",
		nextStarter: "O",
		gameOver: !1,
		winningLine: null,
		scores: {
			X: 0,
			O: 0,
			draw: 0
		}
	};
}
function ri(e) {
	return ti.find(([t, n, r]) => e[t] && e[t] === e[n] && e[t] === e[r]) || null;
}
function ii(e, t, n) {
	if (!Number.isInteger(t) || t < 0 || t > 8 || e.gameOver || e.board[t] || n !== e.currentPlayer) return e;
	let r = [...e.board], i = { ...e.scores };
	r[t] = n;
	let a = ri(r), o = !a && r.every(Boolean);
	return a ? i[n] += 1 : o && (i.draw += 1), {
		...e,
		board: r,
		scores: i,
		winningLine: a,
		gameOver: !!(a || o),
		currentPlayer: a || o ? e.currentPlayer : e.currentPlayer === "X" ? "O" : "X"
	};
}
function ai(e) {
	return {
		...e,
		board: Array(9).fill(null),
		currentPlayer: e.nextStarter,
		nextStarter: e.nextStarter === "X" ? "O" : "X",
		gameOver: !1,
		winningLine: null
	};
}
function oi(e) {
	return ai({
		...e,
		scores: {
			X: 0,
			O: 0,
			draw: 0
		},
		nextStarter: "X"
	});
}
function si(e) {
	return {
		board: [...e.board],
		currentPlayer: e.currentPlayer,
		nextStarter: e.nextStarter,
		gameOver: e.gameOver,
		scores: { ...e.scores }
	};
}
function ci(e) {
	let t = (e) => e === null || e === "X" || e === "O", n = (e) => Number.isInteger(e) && e >= 0;
	return e && Array.isArray(e.board) && e.board.length === 9 && e.board.every(t) && (e.currentPlayer === "X" || e.currentPlayer === "O") && (e.nextStarter === "X" || e.nextStarter === "O") && typeof e.gameOver == "boolean" && e.scores && n(e.scores.X) && n(e.scores.O) && n(e.scores.draw) ? {
		...e,
		board: [...e.board],
		scores: { ...e.scores },
		winningLine: ri(e.board)
	} : null;
}
//#endregion
//#region src/components/GameBoard.svelte
var li = /* @__PURE__ */ gr(" <strong> </strong>", 1), ui = /* @__PURE__ */ gr("<button type=\"button\" role=\"gridcell\"> </button>"), di = /* @__PURE__ */ gr("<section class=\"play-area\" aria-labelledby=\"game-status\"><div><span class=\"turn-dot\" aria-hidden=\"true\"></span> <p id=\"game-status\" aria-live=\"polite\"> <!></p></div> <div class=\"board\" role=\"grid\" aria-label=\"Дъска за морски шах\"></div> <button class=\"new-round\" type=\"button\"><span>Нов рунд</span> <span aria-hidden=\"true\">→</span></button></section>");
function fi(e, t) {
	Je(t, !0);
	let n = (e) => e === "X" ? "×" : "○", r = (e) => e === "X" ? "Играч 1" : "Играч 2", i = (e) => t.online.mode === "local" ? r(e) : e === t.online.localPlayer ? "Вие" : "Противникът", a = /* @__PURE__ */ pt(() => {
		if (t.waiting) return t.online.phase === "creating" ? ["Създаваме двубоя…", ""] : t.online.mode === "host" && t.online.phase === "waiting" ? ["Чакаме другия играч…", ""] : t.online.phase === "error" ? ["Няма връзка с двубоя.", ""] : ["Свързваме ви с двубоя…", ""];
		if (t.game.gameOver && t.game.winningLine) {
			let e = t.game.board[t.game.winningLine[0]];
			return [t.online.mode === "local" ? `${r(e)} печели!` : e === t.online.localPlayer ? "Вие печелите!" : "Противникът печели!", n(e)];
		}
		return t.game.gameOver ? ["Равенство — чудесна игра!", ""] : t.online.mode === "local" ? [`${r(t.game.currentPlayer)} е на ход`, n(t.game.currentPlayer)] : t.game.currentPlayer === t.online.localPlayer ? ["Ваш ред", n(t.game.currentPlayer)] : ["Ход на противника", n(t.game.currentPlayer)];
	});
	var o = di(), s = I(o);
	let c;
	var l = L(I(s), 2), u = I(l, !0), d = L(u), f = (e) => {
		var t = li(), n = en(t, !0);
		n.nodeValue = " ";
		var r = tn(L(n), !0);
		bn(() => wr(r, K(a)[1])), q(e, t);
	};
	Ar(d, (e) => {
		K(a)[1] && e(f);
	}), k(l), k(s);
	var p = L(s, 2);
	Fr(p, 21, () => t.game.board, jr, (e, r, a) => {
		var o = ui();
		let s;
		var c = tn(o, !0);
		bn((e, t, n, i, a) => {
			s = Ur(o, 1, "cell", null, s, {
				x: K(r) === "X",
				o: K(r) === "O",
				marked: e,
				winner: t
			}), qr(o, "aria-label", n), o.disabled = i, wr(c, a);
		}, [
			() => !!K(r),
			() => !!t.game.winningLine?.includes(a),
			() => K(r) ? `${ei[a]}: ${i(K(r))} ${n(K(r))}` : ei[a],
			() => !!K(r) || !t.canMove,
			() => K(r) ? n(K(r)) : ""
		]), sr("click", o, () => t.onPlay(a)), q(e, o);
	}), k(p);
	var m = L(p, 2);
	k(o), bn(() => {
		c = Ur(s, 1, "turn-indicator", null, c, {
			"player-o": t.game.currentPlayer === "O",
			finished: t.game.gameOver,
			waiting: t.waiting
		}), wr(u, K(a)[0]), m.disabled = t.waiting;
	}), sr("click", m, function(...e) {
		t.onNewRound?.apply(this, e);
	}), q(e, o), Ye();
}
cr(["click"]);
//#endregion
//#region src/components/OnlinePanel.svelte
var pi = /* @__PURE__ */ gr("<button class=\"online-primary\" type=\"button\">Създай двубой</button>"), mi = /* @__PURE__ */ gr("<button class=\"online-primary\" type=\"button\"> </button>"), hi = /* @__PURE__ */ gr("<button class=\"online-secondary\" type=\"button\">Излез</button>"), gi = /* @__PURE__ */ gr("<section aria-labelledby=\"online-title\"><div class=\"online-summary\"><span class=\"online-icon\" aria-hidden=\"true\">2P</span> <div><p class=\"online-kicker\">Онлайн игра</p> <h2 id=\"online-title\"> </h2> <p id=\"online-description\" aria-live=\"polite\"> </p></div></div> <div class=\"online-actions\"><!> <!> <!></div></section>");
function _i(e, t) {
	Je(t, !0);
	let n = /* @__PURE__ */ N("Сподели линка"), r = /* @__PURE__ */ pt(() => t.online.mode === "local" && t.online.phase === "error" ? ["Онлайн режимът не се зареди", t.online.error || "Опитайте отново след малко."] : t.online.mode === "local" ? ["Играй с приятел", "Различни мрежи · нужен е интернет."] : t.online.phase === "creating" ? ["Създаваме двубоя…", "Това обикновено отнема няколко секунди."] : t.online.mode === "host" && t.online.phase === "waiting" ? ["Двубоят е готов", "Сподели линка и остави тази страница отворена."] : t.online.phase === "connecting" || t.online.phase === "reconnecting" ? [t.online.phase === "connecting" ? "Влизате в двубоя…" : "Възстановяваме връзката…", t.online.networkOnline ? "Двубоят ще продължи автоматично." : "Чакаме интернет връзка."] : t.online.phase === "connected" ? t.online.audioError ? ["Играете онлайн", t.online.audioError] : t.online.audioConnected ? ["Играете онлайн", `Вие сте ${t.online.localPlayer === "X" ? "×" : "○"} · гласовата връзка е активна`] : t.online.audioEnabled ? ["Играете онлайн", "Микрофонът е включен · чакаме другия играч"] : ["Играете онлайн", `Вие сте ${t.online.localPlayer === "X" ? "×" : "○"} · връзката е активна`] : ["Връзката прекъсна", t.online.error || "Другият играч е излязъл."]);
	async function i() {
		P(n, await t.onShare(), !0), window.setTimeout(() => {
			P(n, "Сподели линка");
		}, 1800);
	}
	var a = gi(), o = I(a), s = L(I(o), 2), c = L(I(s), 2), l = tn(c, !0), u = tn(L(c, 2), !0);
	k(s), k(o);
	var d = L(o, 2), f = I(d), p = (e) => {
		var n = pi();
		sr("click", n, function(...e) {
			t.onCreate?.apply(this, e);
		}), q(e, n);
	};
	Ar(f, (e) => {
		t.online.mode === "local" && e(p);
	});
	var m = L(f, 2), h = (e) => {
		var t = mi(), r = tn(t, !0);
		bn(() => wr(r, K(n))), sr("click", t, i), q(e, t);
	};
	Ar(m, (e) => {
		t.online.mode === "host" && t.online.inviteUrl && e(h);
	});
	var g = L(m, 2), _ = (e) => {
		var n = hi();
		sr("click", n, function(...e) {
			t.onLeave?.apply(this, e);
		}), q(e, n);
	};
	Ar(g, (e) => {
		t.online.mode !== "local" && e(_);
	}), k(d), k(a), bn(() => {
		Ur(a, 1, `online-card phase-${t.online.phase ?? ""}`), wr(l, K(r)[0]), wr(u, K(r)[1]);
	}), q(e, a), Ye();
}
cr(["click"]);
//#endregion
//#region src/components/Scoreboard.svelte
var vi = (e, t = x) => {
	var n = bi(), r = L(I(n), 2), i = (e) => {
		q(e, yi());
	};
	Ar(r, (e) => {
		t() || e(i);
	}), k(n), q(e, n);
}, yi = /* @__PURE__ */ vr("<path class=\"mic-slash\" d=\"m5 4 14 16\"></path>"), bi = /* @__PURE__ */ vr("<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 15.25a3.25 3.25 0 0 0 3.25-3.25V7a3.25 3.25 0 0 0-6.5 0v5A3.25 3.25 0 0 0 12 15.25Z\"></path><path d=\"M6.75 11.5v.5a5.25 5.25 0 0 0 10.5 0v-.5M12 17.25V21M9.5 21h5\"></path><!></svg>"), xi = /* @__PURE__ */ gr("<button type=\"button\"><!></button>"), Si = /* @__PURE__ */ gr("<span role=\"img\"><!></span>"), Ci = /* @__PURE__ */ gr("<header class=\"game-header\"><div><p class=\"eyebrow\">На един или два телефона</p> <h1>Морски шах<span aria-hidden=\"true\">.</span></h1></div> <button class=\"icon-button\" type=\"button\"><span aria-hidden=\"true\">↻</span> Нулирай резултата</button></header> <section class=\"scoreboard\" aria-label=\"Резултат\"><article><span class=\"player-symbol\" aria-hidden=\"true\">×</span> <div><span class=\"player-label\"> </span> <strong> </strong></div> <!></article> <div class=\"draw-score\"><span>Равни</span> <strong> </strong></div> <article><span class=\"player-symbol\" aria-hidden=\"true\">○</span> <div><span class=\"player-label\"> </span> <strong> </strong></div> <!></article></section>", 1);
function wi(e, t) {
	Je(t, !0);
	let n = (e, n = x) => {
		let r = /* @__PURE__ */ pt(() => i(n()));
		var a = yr(), o = en(a), s = (e) => {
			var i = yr(), a = en(i), o = (e) => {
				var n = xi();
				let i;
				vi(I(n), () => K(r)), k(n), bn(() => {
					i = Ur(n, 1, "player-audio", null, i, { enabled: K(r) }), n.disabled = t.online.audioBusy, qr(n, "aria-label", K(r) ? "Спри микрофона" : "Пусни микрофона"), qr(n, "aria-pressed", K(r)), qr(n, "title", K(r) ? "Спри микрофона" : "Пусни микрофона");
				}), sr("click", n, function(...e) {
					t.onAudio?.apply(this, e);
				}), q(e, n);
			}, s = (e) => {
				var t = Si();
				let n;
				vi(I(t), () => K(r)), k(t), bn(() => {
					n = Ur(t, 1, "player-audio remote", null, n, { enabled: K(r) }), qr(t, "aria-label", K(r) ? "Микрофонът на противника е включен" : "Микрофонът на противника е изключен"), qr(t, "title", K(r) ? "Микрофонът на противника е включен" : "Микрофонът на противника е изключен");
				}), q(e, t);
			};
			Ar(a, (e) => {
				t.online.localPlayer === n() ? e(o) : e(s, -1);
			}), q(e, i);
		};
		Ar(o, (e) => {
			t.online.mode !== "local" && t.online.connected && e(s);
		}), q(e, a);
	}, r = (e) => t.online.mode === "local" ? e === "X" ? "Играч 1" : "Играч 2" : t.online.localPlayer === e ? "Вие" : "Противник", i = (e) => t.online.localPlayer === e ? t.online.audioEnabled : t.online.remoteAudioEnabled;
	var a = Ci(), o = en(a), s = L(I(o), 2);
	k(o);
	var c = L(o, 2), l = I(c);
	let u;
	var d = L(I(l), 2), f = I(d), p = tn(f, !0), m = tn(L(f, 2), !0);
	k(d), n(L(d, 2), () => "X"), k(l);
	var h = L(l, 2), g = tn(L(I(h), 2), !0);
	k(h);
	var _ = L(h, 2);
	let v;
	var y = L(I(_), 2), b = I(y), S = tn(b, !0), ee = tn(L(b, 2), !0);
	k(y), n(L(y, 2), () => "O"), k(_), k(c), bn((e, n) => {
		s.disabled = t.waiting, u = Ur(l, 1, "player-card player-x", null, u, { active: t.game.currentPlayer === "X" && !t.game.gameOver && !t.waiting }), wr(p, e), wr(m, t.game.scores.X), wr(g, t.game.scores.draw), v = Ur(_, 1, "player-card player-o", null, v, { active: t.game.currentPlayer === "O" && !t.game.gameOver && !t.waiting }), wr(S, n), wr(ee, t.game.scores.O);
	}, [() => r("X"), () => r("O")]), sr("click", s, function(...e) {
		t.onReset?.apply(this, e);
	}), q(e, a), Ye();
}
cr(["click"]);
//#endregion
//#region src/online/match-url.js
var Ti = [
	"room",
	"player",
	"role"
], Ei = /^[A-Za-z0-9_-]{1,100}$/;
function Di(e) {
	return Ei.test(e || "");
}
function Oi(e, { roomId: t, guestToken: n }) {
	if (!Di(t) || !Di(n)) throw TypeError("Invalid match tokens");
	let r = new URL(e);
	r.search = "", r.hash = "", r.searchParams.set("room", t), r.searchParams.set("player", n), r.searchParams.set("role", "guest");
	let i = new URL(r);
	return i.searchParams.set("role", "host"), {
		hostUrl: i.toString(),
		inviteUrl: r.toString()
	};
}
function ki(e) {
	let t = new URLSearchParams(e), n = t.get("room");
	if (!n) return null;
	let r = t.get("role") || "guest";
	return {
		role: r,
		roomId: n,
		guestToken: t.get("player"),
		valid: (r === "host" || r === "guest") && Di(n) && Di(t.get("player"))
	};
}
function Ai(e) {
	let t = new URL(e);
	return `${t.pathname}${t.search}${t.hash}`;
}
function ji(e) {
	let t = new URL(e);
	return Ti.forEach((e) => t.searchParams.delete(e)), Ai(t);
}
//#endregion
//#region node_modules/peerjs-js-binarypack/dist/binarypack.mjs
var Mi = class {
	constructor() {
		this.encoder = new TextEncoder(), this._pieces = [], this._parts = [];
	}
	append_buffer(e) {
		this.flush(), this._parts.push(e);
	}
	append(e) {
		this._pieces.push(e);
	}
	flush() {
		if (this._pieces.length > 0) {
			let e = new Uint8Array(this._pieces);
			this._parts.push(e), this._pieces = [];
		}
	}
	toArrayBuffer() {
		let e = [];
		for (let t of this._parts) e.push(t);
		return Ni(e).buffer;
	}
};
function Ni(e) {
	let t = 0;
	for (let n of e) t += n.byteLength;
	let n = new Uint8Array(t), r = 0;
	for (let t of e) {
		let e = new Uint8Array(t.buffer, t.byteOffset, t.byteLength);
		n.set(e, r), r += t.byteLength;
	}
	return n;
}
function Pi(e) {
	return new Ii(e).unpack();
}
function Fi(e) {
	let t = new Li(), n = t.pack(e);
	return n instanceof Promise ? n.then(() => t.getBuffer()) : t.getBuffer();
}
var Ii = class {
	constructor(e) {
		this.index = 0, this.dataBuffer = e, this.dataView = new Uint8Array(this.dataBuffer), this.length = this.dataBuffer.byteLength;
	}
	unpack() {
		let e = this.unpack_uint8();
		if (e < 128) return e;
		if ((e ^ 224) < 32) return (e ^ 224) - 32;
		let t;
		if ((t = e ^ 160) <= 15) return this.unpack_raw(t);
		if ((t = e ^ 176) <= 15) return this.unpack_string(t);
		if ((t = e ^ 144) <= 15) return this.unpack_array(t);
		if ((t = e ^ 128) <= 15) return this.unpack_map(t);
		switch (e) {
			case 192: return null;
			case 193: return;
			case 194: return !1;
			case 195: return !0;
			case 202: return this.unpack_float();
			case 203: return this.unpack_double();
			case 204: return this.unpack_uint8();
			case 205: return this.unpack_uint16();
			case 206: return this.unpack_uint32();
			case 207: return this.unpack_uint64();
			case 208: return this.unpack_int8();
			case 209: return this.unpack_int16();
			case 210: return this.unpack_int32();
			case 211: return this.unpack_int64();
			case 212: return;
			case 213: return;
			case 214: return;
			case 215: return;
			case 216: return t = this.unpack_uint16(), this.unpack_string(t);
			case 217: return t = this.unpack_uint32(), this.unpack_string(t);
			case 218: return t = this.unpack_uint16(), this.unpack_raw(t);
			case 219: return t = this.unpack_uint32(), this.unpack_raw(t);
			case 220: return t = this.unpack_uint16(), this.unpack_array(t);
			case 221: return t = this.unpack_uint32(), this.unpack_array(t);
			case 222: return t = this.unpack_uint16(), this.unpack_map(t);
			case 223: return t = this.unpack_uint32(), this.unpack_map(t);
		}
	}
	unpack_uint8() {
		let e = this.dataView[this.index] & 255;
		return this.index++, e;
	}
	unpack_uint16() {
		let e = this.read(2), t = (e[0] & 255) * 256 + (e[1] & 255);
		return this.index += 2, t;
	}
	unpack_uint32() {
		let e = this.read(4), t = ((e[0] * 256 + e[1]) * 256 + e[2]) * 256 + e[3];
		return this.index += 4, t;
	}
	unpack_uint64() {
		let e = this.read(8), t = ((((((e[0] * 256 + e[1]) * 256 + e[2]) * 256 + e[3]) * 256 + e[4]) * 256 + e[5]) * 256 + e[6]) * 256 + e[7];
		return this.index += 8, t;
	}
	unpack_int8() {
		let e = this.unpack_uint8();
		return e < 128 ? e : e - 256;
	}
	unpack_int16() {
		let e = this.unpack_uint16();
		return e < 32768 ? e : e - 65536;
	}
	unpack_int32() {
		let e = this.unpack_uint32();
		return e < 2 ** 31 ? e : e - 2 ** 32;
	}
	unpack_int64() {
		let e = this.unpack_uint64();
		return e < 2 ** 63 ? e : e - 2 ** 64;
	}
	unpack_raw(e) {
		if (this.length < this.index + e) throw Error(`BinaryPackFailure: index is out of range ${this.index} ${e} ${this.length}`);
		let t = this.dataBuffer.slice(this.index, this.index + e);
		return this.index += e, t;
	}
	unpack_string(e) {
		let t = this.read(e), n = 0, r = "", i, a;
		for (; n < e;) i = t[n], i < 160 ? (a = i, n++) : (i ^ 192) < 32 ? (a = (i & 31) << 6 | t[n + 1] & 63, n += 2) : (i ^ 224) < 16 ? (a = (i & 15) << 12 | (t[n + 1] & 63) << 6 | t[n + 2] & 63, n += 3) : (a = (i & 7) << 18 | (t[n + 1] & 63) << 12 | (t[n + 2] & 63) << 6 | t[n + 3] & 63, n += 4), r += String.fromCodePoint(a);
		return this.index += e, r;
	}
	unpack_array(e) {
		let t = Array(e);
		for (let n = 0; n < e; n++) t[n] = this.unpack();
		return t;
	}
	unpack_map(e) {
		let t = {};
		for (let n = 0; n < e; n++) {
			let e = this.unpack();
			t[e] = this.unpack();
		}
		return t;
	}
	unpack_float() {
		let e = this.unpack_uint32(), t = e >> 31, n = (e >> 23 & 255) - 127, r = e & 8388607 | 8388608;
		return (t === 0 ? 1 : -1) * r * 2 ** (n - 23);
	}
	unpack_double() {
		let e = this.unpack_uint32(), t = this.unpack_uint32(), n = e >> 31, r = (e >> 20 & 2047) - 1023, i = (e & 1048575 | 1048576) * 2 ** (r - 20) + t * 2 ** (r - 52);
		return (n === 0 ? 1 : -1) * i;
	}
	read(e) {
		let t = this.index;
		if (t + e <= this.length) return this.dataView.subarray(t, t + e);
		throw Error("BinaryPackFailure: read index out of range");
	}
}, Li = class {
	getBuffer() {
		return this._bufferBuilder.toArrayBuffer();
	}
	pack(e) {
		if (typeof e == "string") this.pack_string(e);
		else if (typeof e == "number") Math.floor(e) === e ? this.pack_integer(e) : this.pack_double(e);
		else if (typeof e == "boolean") e === !0 ? this._bufferBuilder.append(195) : e === !1 && this._bufferBuilder.append(194);
		else if (e === void 0) this._bufferBuilder.append(192);
		else if (typeof e == "object") {
			if (e === null) this._bufferBuilder.append(192);
			else {
				let t = e.constructor;
				if (e instanceof Array) {
					let t = this.pack_array(e);
					if (t instanceof Promise) return t.then(() => this._bufferBuilder.flush());
				} else if (e instanceof ArrayBuffer) this.pack_bin(new Uint8Array(e));
				else if ("BYTES_PER_ELEMENT" in e) {
					let t = e;
					this.pack_bin(new Uint8Array(t.buffer, t.byteOffset, t.byteLength));
				} else if (e instanceof Date) this.pack_string(e.toString());
				else if (e instanceof Blob) return e.arrayBuffer().then((e) => {
					this.pack_bin(new Uint8Array(e)), this._bufferBuilder.flush();
				});
				else if (t == Object || t.toString().startsWith("class")) {
					let t = this.pack_object(e);
					if (t instanceof Promise) return t.then(() => this._bufferBuilder.flush());
				} else throw Error(`Type "${t.toString()}" not yet supported`);
			}
		} else throw Error(`Type "${typeof e}" not yet supported`);
		this._bufferBuilder.flush();
	}
	pack_bin(e) {
		let t = e.length;
		if (t <= 15) this.pack_uint8(160 + t);
		else if (t <= 65535) this._bufferBuilder.append(218), this.pack_uint16(t);
		else if (t <= 4294967295) this._bufferBuilder.append(219), this.pack_uint32(t);
		else throw Error("Invalid length");
		this._bufferBuilder.append_buffer(e);
	}
	pack_string(e) {
		let t = this._textEncoder.encode(e), n = t.length;
		if (n <= 15) this.pack_uint8(176 + n);
		else if (n <= 65535) this._bufferBuilder.append(216), this.pack_uint16(n);
		else if (n <= 4294967295) this._bufferBuilder.append(217), this.pack_uint32(n);
		else throw Error("Invalid length");
		this._bufferBuilder.append_buffer(t);
	}
	pack_array(e) {
		let t = e.length;
		if (t <= 15) this.pack_uint8(144 + t);
		else if (t <= 65535) this._bufferBuilder.append(220), this.pack_uint16(t);
		else if (t <= 4294967295) this._bufferBuilder.append(221), this.pack_uint32(t);
		else throw Error("Invalid length");
		let n = (r) => {
			if (r < t) {
				let t = this.pack(e[r]);
				return t instanceof Promise ? t.then(() => n(r + 1)) : n(r + 1);
			}
		};
		return n(0);
	}
	pack_integer(e) {
		if (e >= -32 && e <= 127) this._bufferBuilder.append(e & 255);
		else if (e >= 0 && e <= 255) this._bufferBuilder.append(204), this.pack_uint8(e);
		else if (e >= -128 && e <= 127) this._bufferBuilder.append(208), this.pack_int8(e);
		else if (e >= 0 && e <= 65535) this._bufferBuilder.append(205), this.pack_uint16(e);
		else if (e >= -32768 && e <= 32767) this._bufferBuilder.append(209), this.pack_int16(e);
		else if (e >= 0 && e <= 4294967295) this._bufferBuilder.append(206), this.pack_uint32(e);
		else if (e >= -2147483648 && e <= 2147483647) this._bufferBuilder.append(210), this.pack_int32(e);
		else if (e >= -0x8000000000000000 && e <= 0x8000000000000000) this._bufferBuilder.append(211), this.pack_int64(e);
		else if (e >= 0 && e <= 0x10000000000000000) this._bufferBuilder.append(207), this.pack_uint64(e);
		else throw Error("Invalid integer");
	}
	pack_double(e) {
		let t = 0;
		e < 0 && (t = 1, e = -e);
		let n = Math.floor(Math.log(e) / Math.LN2), r = e / 2 ** n - 1, i = Math.floor(r * 2 ** 52), a = 2 ** 32, o = t << 31 | n + 1023 << 20 | i / a & 1048575, s = i % a;
		this._bufferBuilder.append(203), this.pack_int32(o), this.pack_int32(s);
	}
	pack_object(e) {
		let t = Object.keys(e), n = t.length;
		if (n <= 15) this.pack_uint8(128 + n);
		else if (n <= 65535) this._bufferBuilder.append(222), this.pack_uint16(n);
		else if (n <= 4294967295) this._bufferBuilder.append(223), this.pack_uint32(n);
		else throw Error("Invalid length");
		let r = (n) => {
			if (n < t.length) {
				let i = t[n];
				if (e.hasOwnProperty(i)) {
					this.pack(i);
					let t = this.pack(e[i]);
					if (t instanceof Promise) return t.then(() => r(n + 1));
				}
				return r(n + 1);
			}
		};
		return r(0);
	}
	pack_uint8(e) {
		this._bufferBuilder.append(e);
	}
	pack_uint16(e) {
		this._bufferBuilder.append(e >> 8), this._bufferBuilder.append(e & 255);
	}
	pack_uint32(e) {
		let t = e & 4294967295;
		this._bufferBuilder.append((t & 4278190080) >>> 24), this._bufferBuilder.append((t & 16711680) >>> 16), this._bufferBuilder.append((t & 65280) >>> 8), this._bufferBuilder.append(t & 255);
	}
	pack_uint64(e) {
		let t = e / 2 ** 32, n = e % 2 ** 32;
		this._bufferBuilder.append((t & 4278190080) >>> 24), this._bufferBuilder.append((t & 16711680) >>> 16), this._bufferBuilder.append((t & 65280) >>> 8), this._bufferBuilder.append(t & 255), this._bufferBuilder.append((n & 4278190080) >>> 24), this._bufferBuilder.append((n & 16711680) >>> 16), this._bufferBuilder.append((n & 65280) >>> 8), this._bufferBuilder.append(n & 255);
	}
	pack_int8(e) {
		this._bufferBuilder.append(e & 255);
	}
	pack_int16(e) {
		this._bufferBuilder.append((e & 65280) >> 8), this._bufferBuilder.append(e & 255);
	}
	pack_int32(e) {
		this._bufferBuilder.append(e >>> 24 & 255), this._bufferBuilder.append((e & 16711680) >>> 16), this._bufferBuilder.append((e & 65280) >>> 8), this._bufferBuilder.append(e & 255);
	}
	pack_int64(e) {
		let t = Math.floor(e / 2 ** 32), n = e % 2 ** 32;
		this._bufferBuilder.append((t & 4278190080) >>> 24), this._bufferBuilder.append((t & 16711680) >>> 16), this._bufferBuilder.append((t & 65280) >>> 8), this._bufferBuilder.append(t & 255), this._bufferBuilder.append((n & 4278190080) >>> 24), this._bufferBuilder.append((n & 16711680) >>> 16), this._bufferBuilder.append((n & 65280) >>> 8), this._bufferBuilder.append(n & 255);
	}
	constructor() {
		this._bufferBuilder = new Mi(), this._textEncoder = new TextEncoder();
	}
}, Ri = !0, zi = !0;
function Bi(e, t, n) {
	let r = e.match(t);
	return r && r.length >= n && parseFloat(r[n], 10);
}
function Vi(e, t, n) {
	if (!e.RTCPeerConnection) return;
	if (!Object.getOwnPropertyDescriptor(EventTarget.prototype, "addEventListener").writable) {
		Wi("Unable to polyfill events");
		return;
	}
	let r = e.RTCPeerConnection.prototype, i = r.addEventListener;
	r.addEventListener = function(e, r) {
		if (e !== t) return i.apply(this, arguments);
		let a = (e) => {
			let t = n(e);
			t && (r.handleEvent ? r.handleEvent(t) : r(t));
		};
		return this._eventMap = this._eventMap || {}, this._eventMap[t] || (this._eventMap[t] = /* @__PURE__ */ new Map()), this._eventMap[t].set(r, a), i.apply(this, [e, a]);
	};
	let a = r.removeEventListener;
	r.removeEventListener = function(e, n) {
		if (e !== t || !this._eventMap || !this._eventMap[t] || !this._eventMap[t].has(n)) return a.apply(this, arguments);
		let r = this._eventMap[t].get(n);
		return this._eventMap[t].delete(n), this._eventMap[t].size === 0 && delete this._eventMap[t], Object.keys(this._eventMap).length === 0 && delete this._eventMap, a.apply(this, [e, r]);
	}, Object.defineProperty(r, "on" + t, {
		get() {
			return this["_on" + t];
		},
		set(e) {
			this["_on" + t] && (this.removeEventListener(t, this["_on" + t]), delete this["_on" + t]), e && this.addEventListener(t, this["_on" + t] = e);
		},
		enumerable: !0,
		configurable: !0
	});
}
function Hi(e) {
	return typeof e == "boolean" ? (Ri = e, e ? "adapter.js logging disabled" : "adapter.js logging enabled") : /* @__PURE__ */ Error("Argument type: " + typeof e + ". Please use a boolean.");
}
function Ui(e) {
	return typeof e == "boolean" ? (zi = !e, "adapter.js deprecation warnings " + (e ? "disabled" : "enabled")) : /* @__PURE__ */ Error("Argument type: " + typeof e + ". Please use a boolean.");
}
function Wi() {
	if (typeof window == "object") {
		if (Ri) return;
		typeof console < "u" && typeof console.log == "function" && console.log.apply(console, arguments);
	}
}
function Gi(e, t) {
	zi && console.warn(e + " is deprecated, please use " + t + " instead.");
}
function Ki(e) {
	let t = {
		browser: null,
		version: null
	};
	if (e === void 0 || !e.navigator || !e.navigator.userAgent) return t.browser = "Not a browser.", t;
	let { navigator: n } = e;
	if (n.userAgentData && n.userAgentData.brands) {
		let e = n.userAgentData.brands.find((e) => e.brand === "Chromium");
		if (e) {
			let t = parseInt(e.version, 10);
			if (t >= 90) return {
				browser: "chrome",
				version: t
			};
		}
	}
	if (n.mozGetUserMedia) t.browser = "firefox", t.version = parseInt(Bi(n.userAgent, /Firefox\/(\d+)\./, 1));
	else if (n.webkitGetUserMedia || e.isSecureContext === !1 && e.webkitRTCPeerConnection) t.browser = "chrome", t.version = parseInt(Bi(n.userAgent, /Chrom(e|ium)\/(\d+)\./, 2)) || null;
	else if (e.RTCPeerConnection && n.userAgent.match(/AppleWebKit\/(\d+)\./)) t.browser = "safari", t.version = parseInt(Bi(n.userAgent, /AppleWebKit\/(\d+)\./, 1)), t.supportsUnifiedPlan = e.RTCRtpTransceiver && "currentDirection" in e.RTCRtpTransceiver.prototype, t._safariVersion = Bi(n.userAgent, /Version\/(\d+(\.?\d+))/, 1);
	else return t.browser = "Not a supported browser.", t;
	return t;
}
function qi(e) {
	return Object.prototype.toString.call(e) === "[object Object]";
}
function Ji(e) {
	return qi(e) ? Object.keys(e).reduce(function(t, n) {
		let r = qi(e[n]), i = r ? Ji(e[n]) : e[n], a = r && !Object.keys(i).length;
		return i === void 0 || a ? t : Object.assign(t, { [n]: i });
	}, {}) : e;
}
function Yi(e, t, n) {
	t && !n.has(t.id) && (n.set(t.id, t), Object.keys(t).forEach((r) => {
		r.endsWith("Id") ? Yi(e, e.get(t[r]), n) : r.endsWith("Ids") && t[r].forEach((t) => {
			Yi(e, e.get(t), n);
		});
	}));
}
function Xi(e, t, n) {
	let r = n ? "outbound-rtp" : "inbound-rtp", i = /* @__PURE__ */ new Map();
	if (t === null) return i;
	let a = [];
	return e.forEach((e) => {
		e.type === "track" && e.trackIdentifier === t.id && a.push(e);
	}), a.forEach((t) => {
		e.forEach((n) => {
			n.type === r && n.trackId === t.id && Yi(e, n, i);
		});
	}), i;
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/chrome/getusermedia.js
var Zi = Wi;
function Qi(e, t) {
	if (t.version >= 64) return;
	let n = e && e.navigator;
	if (!n.mediaDevices) return;
	let r = function(e) {
		if (typeof e != "object" || e.mandatory || e.optional) return e;
		let t = {};
		return Object.keys(e).forEach((n) => {
			if (n === "require" || n === "advanced" || n === "mediaSource") return;
			let r = typeof e[n] == "object" ? e[n] : { ideal: e[n] };
			r.exact !== void 0 && typeof r.exact == "number" && (r.min = r.max = r.exact);
			let i = function(e, t) {
				return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : t === "deviceId" ? "sourceId" : t;
			};
			if (r.ideal !== void 0) {
				t.optional = t.optional || [];
				let e = {};
				typeof r.ideal == "number" ? (e[i("min", n)] = r.ideal, t.optional.push(e), e = {}, e[i("max", n)] = r.ideal, t.optional.push(e)) : (e[i("", n)] = r.ideal, t.optional.push(e));
			}
			r.exact !== void 0 && typeof r.exact != "number" ? (t.mandatory = t.mandatory || {}, t.mandatory[i("", n)] = r.exact) : ["min", "max"].forEach((e) => {
				r[e] !== void 0 && (t.mandatory = t.mandatory || {}, t.mandatory[i(e, n)] = r[e]);
			});
		}), e.advanced && (t.optional = (t.optional || []).concat(e.advanced)), t;
	}, i = function(e, i) {
		if (t.version >= 61) return i(e);
		if (e = JSON.parse(JSON.stringify(e)), e && typeof e.audio == "object") {
			let t = function(e, t, n) {
				t in e && !(n in e) && (e[n] = e[t], delete e[t]);
			};
			e = JSON.parse(JSON.stringify(e)), t(e.audio, "autoGainControl", "googAutoGainControl"), t(e.audio, "noiseSuppression", "googNoiseSuppression"), e.audio = r(e.audio);
		}
		if (e && typeof e.video == "object") {
			let a = e.video.facingMode;
			a &&= typeof a == "object" ? a : { ideal: a };
			let o = t.version < 66;
			if (a && (a.exact === "user" || a.exact === "environment" || a.ideal === "user" || a.ideal === "environment") && !(n.mediaDevices.getSupportedConstraints && n.mediaDevices.getSupportedConstraints().facingMode && !o)) {
				delete e.video.facingMode;
				let t;
				if (a.exact === "environment" || a.ideal === "environment" ? t = ["back", "rear"] : (a.exact === "user" || a.ideal === "user") && (t = ["front"]), t) return n.mediaDevices.enumerateDevices().then((n) => {
					n = n.filter((e) => e.kind === "videoinput");
					let o = n.find((e) => t.some((t) => e.label.toLowerCase().includes(t)));
					return !o && n.length && t.includes("back") && (o = n[n.length - 1]), o && (e.video.deviceId = a.exact ? { exact: o.deviceId } : { ideal: o.deviceId }), e.video = r(e.video), Zi("chrome: " + JSON.stringify(e)), i(e);
				});
			}
			e.video = r(e.video);
		}
		return Zi("chrome: " + JSON.stringify(e)), i(e);
	}, a = function(e) {
		return t.version >= 64 ? e : {
			name: {
				PermissionDeniedError: "NotAllowedError",
				PermissionDismissedError: "NotAllowedError",
				InvalidStateError: "NotAllowedError",
				DevicesNotFoundError: "NotFoundError",
				ConstraintNotSatisfiedError: "OverconstrainedError",
				TrackStartError: "NotReadableError",
				MediaDeviceFailedDueToShutdown: "NotAllowedError",
				MediaDeviceKillSwitchOn: "NotAllowedError",
				TabCaptureError: "AbortError",
				ScreenCaptureError: "AbortError",
				DeviceCaptureError: "AbortError"
			}[e.name] || e.name,
			message: e.message,
			constraint: e.constraint || e.constraintName,
			toString() {
				return this.name + (this.message && ": ") + this.message;
			}
		};
	};
	if (n.getUserMedia = function(e, t, r) {
		i(e, (e) => {
			n.webkitGetUserMedia(e, t, (e) => {
				r && r(a(e));
			});
		});
	}.bind(n), n.mediaDevices.getUserMedia) {
		let e = n.mediaDevices.getUserMedia.bind(n.mediaDevices);
		n.mediaDevices.getUserMedia = function(t) {
			return i(t, (t) => e(t).then((e) => {
				if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach((e) => {
					e.stop();
				}), new DOMException("", "NotFoundError");
				return e;
			}, (e) => Promise.reject(a(e))));
		};
	}
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js
var $i = /* @__PURE__ */ s({
	fixNegotiationNeeded: () => sa,
	shimAddTrackRemoveTrack: () => aa,
	shimAddTrackRemoveTrackWithNative: () => ia,
	shimGetSendersWithDtmf: () => na,
	shimGetUserMedia: () => Qi,
	shimMediaStream: () => ea,
	shimOnTrack: () => ta,
	shimPeerConnection: () => oa,
	shimSenderReceiverGetStats: () => ra
});
function ea(e) {
	e.MediaStream = e.MediaStream || e.webkitMediaStream;
}
function ta(e, t) {
	if (!(t.version > 102)) {
		if (typeof e == "object" && e.RTCPeerConnection && !("ontrack" in e.RTCPeerConnection.prototype)) {
			Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
				get() {
					return this._ontrack;
				},
				set(e) {
					this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = e);
				},
				enumerable: !0,
				configurable: !0
			});
			let t = e.RTCPeerConnection.prototype.setRemoteDescription;
			e.RTCPeerConnection.prototype.setRemoteDescription = function() {
				return this._ontrackpoly || (this._ontrackpoly = (t) => {
					t.stream.addEventListener("addtrack", (n) => {
						let r;
						r = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find((e) => e.track && e.track.id === n.track.id) : { track: n.track };
						let i = new Event("track");
						i.track = n.track, i.receiver = r, i.transceiver = { receiver: r }, i.streams = [t.stream], this.dispatchEvent(i);
					}), t.stream.getTracks().forEach((n) => {
						let r;
						r = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find((e) => e.track && e.track.id === n.id) : { track: n };
						let i = new Event("track");
						i.track = n, i.receiver = r, i.transceiver = { receiver: r }, i.streams = [t.stream], this.dispatchEvent(i);
					});
				}, this.addEventListener("addstream", this._ontrackpoly)), t.apply(this, arguments);
			};
		} else Vi(e, "track", (e) => (e.transceiver || Object.defineProperty(e, "transceiver", { value: { receiver: e.receiver } }), e));
	}
}
function na(e) {
	if (typeof e == "object" && e.RTCPeerConnection && !("getSenders" in e.RTCPeerConnection.prototype) && "createDTMFSender" in e.RTCPeerConnection.prototype) {
		let t = function(e, t) {
			return {
				track: t,
				get dtmf() {
					return this._dtmf === void 0 && (this._dtmf = t.kind === "audio" ? e.createDTMFSender(t) : null), this._dtmf;
				},
				_pc: e
			};
		};
		if (!e.RTCPeerConnection.prototype.getSenders) {
			e.RTCPeerConnection.prototype.getSenders = function() {
				return this._senders = this._senders || [], this._senders.slice();
			};
			let n = e.RTCPeerConnection.prototype.addTrack;
			e.RTCPeerConnection.prototype.addTrack = function(e, r) {
				let i = n.apply(this, arguments);
				return i || (i = t(this, e), this._senders.push(i)), i;
			};
			let r = e.RTCPeerConnection.prototype.removeTrack;
			e.RTCPeerConnection.prototype.removeTrack = function(e) {
				r.apply(this, arguments);
				let t = this._senders.indexOf(e);
				t !== -1 && this._senders.splice(t, 1);
			};
		}
		let n = e.RTCPeerConnection.prototype.addStream;
		e.RTCPeerConnection.prototype.addStream = function(e) {
			this._senders = this._senders || [], n.apply(this, [e]), e.getTracks().forEach((e) => {
				this._senders.push(t(this, e));
			});
		};
		let r = e.RTCPeerConnection.prototype.removeStream;
		e.RTCPeerConnection.prototype.removeStream = function(e) {
			this._senders = this._senders || [], r.apply(this, [e]), e.getTracks().forEach((e) => {
				let t = this._senders.find((t) => t.track === e);
				t && this._senders.splice(this._senders.indexOf(t), 1);
			});
		};
	} else if (typeof e == "object" && e.RTCPeerConnection && "getSenders" in e.RTCPeerConnection.prototype && "createDTMFSender" in e.RTCPeerConnection.prototype && e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype)) {
		let t = e.RTCPeerConnection.prototype.getSenders;
		e.RTCPeerConnection.prototype.getSenders = function() {
			let e = t.apply(this, []);
			return e.forEach((e) => e._pc = this), e;
		}, Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", { get() {
			return this._dtmf === void 0 && (this._dtmf = this.track.kind === "audio" ? this._pc.createDTMFSender(this.track) : null), this._dtmf;
		} });
	}
}
function ra(e, t) {
	if (t.version >= 67 || !(typeof e == "object" && e.RTCPeerConnection && e.RTCRtpSender && e.RTCRtpReceiver)) return;
	if (!("getStats" in e.RTCRtpSender.prototype)) {
		let t = e.RTCPeerConnection.prototype.getSenders;
		t && (e.RTCPeerConnection.prototype.getSenders = function() {
			let e = t.apply(this, []);
			return e.forEach((e) => e._pc = this), e;
		});
		let n = e.RTCPeerConnection.prototype.addTrack;
		n && (e.RTCPeerConnection.prototype.addTrack = function() {
			let e = n.apply(this, arguments);
			return e._pc = this, e;
		}), e.RTCRtpSender.prototype.getStats = function() {
			let e = this;
			return this._pc.getStats().then((t) => Xi(t, e.track, !0));
		};
	}
	if (!("getStats" in e.RTCRtpReceiver.prototype)) {
		let t = e.RTCPeerConnection.prototype.getReceivers;
		t && (e.RTCPeerConnection.prototype.getReceivers = function() {
			let e = t.apply(this, []);
			return e.forEach((e) => e._pc = this), e;
		}), Vi(e, "track", (e) => (e.receiver._pc = e.srcElement, e)), e.RTCRtpReceiver.prototype.getStats = function() {
			let e = this;
			return this._pc.getStats().then((t) => Xi(t, e.track, !1));
		};
	}
	if (!("getStats" in e.RTCRtpSender.prototype && "getStats" in e.RTCRtpReceiver.prototype)) return;
	let n = e.RTCPeerConnection.prototype.getStats;
	e.RTCPeerConnection.prototype.getStats = function() {
		if (arguments.length > 0 && arguments[0] instanceof e.MediaStreamTrack) {
			let e = arguments[0], t, n, r;
			return this.getSenders().forEach((n) => {
				n.track === e && (t ? r = !0 : t = n);
			}), this.getReceivers().forEach((t) => (t.track === e && (n ? r = !0 : n = t), t.track === e)), r || t && n ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : t ? t.getStats() : n ? n.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"));
		}
		return n.apply(this, arguments);
	};
}
function ia(e) {
	e.RTCPeerConnection.prototype.getLocalStreams = function() {
		return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map((e) => this._shimmedLocalStreams[e][0]);
	};
	let t = e.RTCPeerConnection.prototype.addTrack;
	e.RTCPeerConnection.prototype.addTrack = function(e, n) {
		if (!n) return t.apply(this, arguments);
		this._shimmedLocalStreams = this._shimmedLocalStreams || {};
		let r = t.apply(this, arguments);
		return this._shimmedLocalStreams[n.id] ? this._shimmedLocalStreams[n.id].indexOf(r) === -1 && this._shimmedLocalStreams[n.id].push(r) : this._shimmedLocalStreams[n.id] = [n, r], r;
	};
	let n = e.RTCPeerConnection.prototype.addStream;
	e.RTCPeerConnection.prototype.addStream = function(e) {
		this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e.getTracks().forEach((e) => {
			if (this.getSenders().find((t) => t.track === e)) throw new DOMException("Track already exists.", "InvalidAccessError");
		});
		let t = this.getSenders();
		n.apply(this, arguments);
		let r = this.getSenders().filter((e) => t.indexOf(e) === -1);
		this._shimmedLocalStreams[e.id] = [e].concat(r);
	};
	let r = e.RTCPeerConnection.prototype.removeStream;
	e.RTCPeerConnection.prototype.removeStream = function(e) {
		return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[e.id], r.apply(this, arguments);
	};
	let i = e.RTCPeerConnection.prototype.removeTrack;
	e.RTCPeerConnection.prototype.removeTrack = function(e) {
		return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e && Object.keys(this._shimmedLocalStreams).forEach((t) => {
			let n = this._shimmedLocalStreams[t].indexOf(e);
			n !== -1 && this._shimmedLocalStreams[t].splice(n, 1), this._shimmedLocalStreams[t].length === 1 && delete this._shimmedLocalStreams[t];
		}), i.apply(this, arguments);
	};
}
function aa(e, t) {
	if (!e.RTCPeerConnection) return;
	if (e.RTCPeerConnection.prototype.addTrack && t.version >= 65) return ia(e);
	let n = e.RTCPeerConnection.prototype.getLocalStreams;
	e.RTCPeerConnection.prototype.getLocalStreams = function() {
		let e = n.apply(this);
		return this._reverseStreams = this._reverseStreams || {}, e.map((e) => this._reverseStreams[e.id]);
	};
	let r = e.RTCPeerConnection.prototype.addStream;
	e.RTCPeerConnection.prototype.addStream = function(t) {
		if (this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, t.getTracks().forEach((e) => {
			if (this.getSenders().find((t) => t.track === e)) throw new DOMException("Track already exists.", "InvalidAccessError");
		}), !this._reverseStreams[t.id]) {
			let n = new e.MediaStream(t.getTracks());
			this._streams[t.id] = n, this._reverseStreams[n.id] = t, t = n;
		}
		r.apply(this, [t]);
	};
	let i = e.RTCPeerConnection.prototype.removeStream;
	e.RTCPeerConnection.prototype.removeStream = function(e) {
		this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, i.apply(this, [this._streams[e.id] || e]), delete this._reverseStreams[this._streams[e.id] ? this._streams[e.id].id : e.id], delete this._streams[e.id];
	}, e.RTCPeerConnection.prototype.addTrack = function(t, n) {
		if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
		let r = [].slice.call(arguments, 1);
		if (r.length !== 1 || !r[0].getTracks().find((e) => e === t)) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
		if (this.getSenders().find((e) => e.track === t)) throw new DOMException("Track already exists.", "InvalidAccessError");
		this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {};
		let i = this._streams[n.id];
		if (i) i.addTrack(t), Promise.resolve().then(() => {
			this.dispatchEvent(new Event("negotiationneeded"));
		});
		else {
			let r = new e.MediaStream([t]);
			this._streams[n.id] = r, this._reverseStreams[r.id] = n, this.addStream(r);
		}
		return this.getSenders().find((e) => e.track === t);
	};
	function a(e, t) {
		let n = t.sdp;
		return Object.keys(e._reverseStreams || []).forEach((t) => {
			let r = e._reverseStreams[t], i = e._streams[r.id];
			n = n.replace(new RegExp(i.id, "g"), r.id);
		}), new RTCSessionDescription({
			type: t.type,
			sdp: n
		});
	}
	function o(e, t) {
		let n = t.sdp;
		return Object.keys(e._reverseStreams || []).forEach((t) => {
			let r = e._reverseStreams[t], i = e._streams[r.id];
			n = n.replace(new RegExp(r.id, "g"), i.id);
		}), new RTCSessionDescription({
			type: t.type,
			sdp: n
		});
	}
	["createOffer", "createAnswer"].forEach(function(t) {
		let n = e.RTCPeerConnection.prototype[t], r = { [t]() {
			let e = arguments;
			return arguments.length && typeof arguments[0] == "function" ? n.apply(this, [
				(t) => {
					let n = a(this, t);
					e[0].apply(null, [n]);
				},
				(t) => {
					e[1] && e[1].apply(null, t);
				},
				arguments[2]
			]) : n.apply(this, arguments).then((e) => a(this, e));
		} };
		e.RTCPeerConnection.prototype[t] = r[t];
	});
	let s = e.RTCPeerConnection.prototype.setLocalDescription;
	e.RTCPeerConnection.prototype.setLocalDescription = function() {
		return !arguments.length || !arguments[0].type || (arguments[0] = o(this, arguments[0])), s.apply(this, arguments);
	};
	let c = Object.getOwnPropertyDescriptor(e.RTCPeerConnection.prototype, "localDescription");
	Object.defineProperty(e.RTCPeerConnection.prototype, "localDescription", { get() {
		let e = c.get.apply(this);
		return e.type === "" ? e : a(this, e);
	} }), e.RTCPeerConnection.prototype.removeTrack = function(e) {
		if (this.signalingState === "closed") throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
		if (!e._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
		if (e._pc !== this) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
		this._streams = this._streams || {};
		let t;
		Object.keys(this._streams).forEach((n) => {
			this._streams[n].getTracks().find((t) => e.track === t) && (t = this._streams[n]);
		}), t && (t.getTracks().length === 1 ? this.removeStream(this._reverseStreams[t.id]) : t.removeTrack(e.track), this.dispatchEvent(new Event("negotiationneeded")));
	};
}
function oa(e, t) {
	!e.RTCPeerConnection && e.webkitRTCPeerConnection && (e.RTCPeerConnection = e.webkitRTCPeerConnection), e.RTCPeerConnection && t.version < 53 && [
		"setLocalDescription",
		"setRemoteDescription",
		"addIceCandidate"
	].forEach(function(t) {
		let n = e.RTCPeerConnection.prototype[t], r = { [t]() {
			return arguments[0] = new (t === "addIceCandidate" ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), n.apply(this, arguments);
		} };
		e.RTCPeerConnection.prototype[t] = r[t];
	});
}
function sa(e, t) {
	t.version > 102 || Vi(e, "negotiationneeded", (e) => {
		let n = e.target;
		if (!((t.version < 72 || n.getConfiguration && n.getConfiguration().sdpSemantics === "plan-b") && n.signalingState !== "stable")) return e;
	});
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/firefox/getusermedia.js
function ca(e, t) {
	let n = e && e.navigator;
	if (!n.mediaDevices) return;
	let r = e && e.MediaStreamTrack;
	if (n.getUserMedia = function(e, t, r) {
		Gi("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), n.mediaDevices.getUserMedia(e).then(t, r);
	}, !(t.version > 55 && "autoGainControl" in n.mediaDevices.getSupportedConstraints())) {
		let e = function(e, t, n) {
			t in e && !(n in e) && (e[n] = e[t], delete e[t]);
		}, t = n.mediaDevices.getUserMedia.bind(n.mediaDevices);
		if (n.mediaDevices.getUserMedia = function(n) {
			return typeof n == "object" && typeof n.audio == "object" && (n = JSON.parse(JSON.stringify(n)), e(n.audio, "autoGainControl", "mozAutoGainControl"), e(n.audio, "noiseSuppression", "mozNoiseSuppression")), t(n);
		}, r && r.prototype.getSettings) {
			let t = r.prototype.getSettings;
			r.prototype.getSettings = function() {
				let n = t.apply(this, arguments);
				return e(n, "mozAutoGainControl", "autoGainControl"), e(n, "mozNoiseSuppression", "noiseSuppression"), n;
			};
		}
		if (r && r.prototype.applyConstraints) {
			let t = r.prototype.applyConstraints;
			r.prototype.applyConstraints = function(n) {
				return this.kind === "audio" && typeof n == "object" && (n = JSON.parse(JSON.stringify(n)), e(n, "autoGainControl", "mozAutoGainControl"), e(n, "noiseSuppression", "mozNoiseSuppression")), t.apply(this, [n]);
			};
		}
	}
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/firefox/getdisplaymedia.js
function la(e, t) {
	e.navigator.mediaDevices && (e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || (e.navigator.mediaDevices.getDisplayMedia = function(n) {
		if (!(n && n.video)) {
			let e = new DOMException("getDisplayMedia without video constraints is undefined");
			return e.name = "NotFoundError", e.code = 8, Promise.reject(e);
		}
		return n.video === !0 ? n.video = { mediaSource: t } : n.video.mediaSource = t, e.navigator.mediaDevices.getUserMedia(n);
	}));
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js
var ua = /* @__PURE__ */ s({
	shimAddTransceiver: () => va,
	shimCreateAnswer: () => xa,
	shimCreateOffer: () => ba,
	shimGetDisplayMedia: () => la,
	shimGetParameters: () => ya,
	shimGetStats: () => pa,
	shimGetUserMedia: () => ca,
	shimOnTrack: () => da,
	shimPeerConnection: () => fa,
	shimRTCDataChannel: () => _a,
	shimReceiverGetStats: () => ha,
	shimRemoveStream: () => ga,
	shimSenderGetStats: () => ma
});
function da(e) {
	typeof e == "object" && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", { get() {
		return { receiver: this.receiver };
	} });
}
function fa(e, t) {
	typeof e == "object" && (e.RTCPeerConnection || e.mozRTCPeerConnection) && (!e.RTCPeerConnection && e.mozRTCPeerConnection && (e.RTCPeerConnection = e.mozRTCPeerConnection), t.version < 53 && [
		"setLocalDescription",
		"setRemoteDescription",
		"addIceCandidate"
	].forEach(function(t) {
		let n = e.RTCPeerConnection.prototype[t], r = { [t]() {
			return arguments[0] = new (t === "addIceCandidate" ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), n.apply(this, arguments);
		} };
		e.RTCPeerConnection.prototype[t] = r[t];
	}));
}
function pa(e, t) {
	if (typeof e != "object" || !(e.RTCPeerConnection || e.mozRTCPeerConnection) || t.version >= 151) return;
	let n = {
		inboundrtp: "inbound-rtp",
		outboundrtp: "outbound-rtp",
		candidatepair: "candidate-pair",
		localcandidate: "local-candidate",
		remotecandidate: "remote-candidate"
	}, r = e.RTCPeerConnection.prototype.getStats;
	e.RTCPeerConnection.prototype.getStats = function() {
		let [e, i, a] = arguments;
		return this.signalingState === "closed" ? Promise.resolve(/* @__PURE__ */ new Map()) : r.apply(this, [e || null]).then((e) => {
			if (t.version < 53 && !i) try {
				e.forEach((e) => {
					e.type = n[e.type] || e.type;
				});
			} catch (t) {
				if (t.name !== "TypeError") throw t;
				e.forEach((t, r) => {
					e.set(r, Object.assign({}, t, { type: n[t.type] || t.type }));
				});
			}
			return e;
		}).then(i, a);
	};
}
function ma(e) {
	if (!(typeof e == "object" && e.RTCPeerConnection && e.RTCRtpSender) || e.RTCRtpSender && "getStats" in e.RTCRtpSender.prototype) return;
	let t = e.RTCPeerConnection.prototype.getSenders;
	t && (e.RTCPeerConnection.prototype.getSenders = function() {
		let e = t.apply(this, []);
		return e.forEach((e) => e._pc = this), e;
	});
	let n = e.RTCPeerConnection.prototype.addTrack;
	n && (e.RTCPeerConnection.prototype.addTrack = function() {
		let e = n.apply(this, arguments);
		return e._pc = this, e;
	}), e.RTCRtpSender.prototype.getStats = function() {
		return this.track ? this._pc.getStats(this.track) : Promise.resolve(/* @__PURE__ */ new Map());
	};
}
function ha(e) {
	if (!(typeof e == "object" && e.RTCPeerConnection && e.RTCRtpSender) || e.RTCRtpSender && "getStats" in e.RTCRtpReceiver.prototype) return;
	let t = e.RTCPeerConnection.prototype.getReceivers;
	t && (e.RTCPeerConnection.prototype.getReceivers = function() {
		let e = t.apply(this, []);
		return e.forEach((e) => e._pc = this), e;
	}), Vi(e, "track", (e) => (e.receiver._pc = e.srcElement, e)), e.RTCRtpReceiver.prototype.getStats = function() {
		return this._pc.getStats(this.track);
	};
}
function ga(e) {
	!e.RTCPeerConnection || "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function(e) {
		Gi("removeStream", "removeTrack"), this.getSenders().forEach((t) => {
			t.track && e.getTracks().includes(t.track) && this.removeTrack(t);
		});
	});
}
function _a(e) {
	e.DataChannel && !e.RTCDataChannel && (e.RTCDataChannel = e.DataChannel);
}
function va(e, t) {
	if (!(typeof e == "object" && e.RTCPeerConnection) || t.version >= 110) return;
	let n = e.RTCPeerConnection.prototype.addTransceiver;
	n && (e.RTCPeerConnection.prototype.addTransceiver = function() {
		this.setParametersPromises = [];
		let e = arguments[1] && arguments[1].sendEncodings;
		e === void 0 && (e = []), e = [...e];
		let t = e.length > 0;
		t && e.forEach((e) => {
			if ("rid" in e && !/^[a-z0-9]{0,16}$/i.test(e.rid)) throw TypeError("Invalid RID value provided.");
			if ("scaleResolutionDownBy" in e && !(parseFloat(e.scaleResolutionDownBy) >= 1)) throw RangeError("scale_resolution_down_by must be >= 1.0");
			if ("maxFramerate" in e && !(parseFloat(e.maxFramerate) >= 0)) throw RangeError("max_framerate must be >= 0.0");
		});
		let r = n.apply(this, arguments);
		if (t) {
			let { sender: t } = r, n = t.getParameters();
			(!("encodings" in n) || n.encodings.length === 1 && Object.keys(n.encodings[0]).length === 0) && (n.encodings = e, t.sendEncodings = e, this.setParametersPromises.push(t.setParameters(n).then(() => {
				delete t.sendEncodings;
			}).catch(() => {
				delete t.sendEncodings;
			})));
		}
		return r;
	});
}
function ya(e, t) {
	if (!(typeof e == "object" && e.RTCRtpSender) || t.version >= 110) return;
	let n = e.RTCRtpSender.prototype.getParameters;
	n && (e.RTCRtpSender.prototype.getParameters = function() {
		let e = n.apply(this, arguments);
		return "encodings" in e || (e.encodings = [].concat(this.sendEncodings || [{}])), e;
	});
}
function ba(e, t) {
	if (!(typeof e == "object" && e.RTCPeerConnection) || t.version >= 110) return;
	let n = e.RTCPeerConnection.prototype.createOffer;
	e.RTCPeerConnection.prototype.createOffer = function() {
		return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => n.apply(this, arguments)).finally(() => {
			this.setParametersPromises = [];
		}) : n.apply(this, arguments);
	};
}
function xa(e, t) {
	if (!(typeof e == "object" && e.RTCPeerConnection) || t.version >= 110) return;
	let n = e.RTCPeerConnection.prototype.createAnswer;
	e.RTCPeerConnection.prototype.createAnswer = function() {
		return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => n.apply(this, arguments)).finally(() => {
			this.setParametersPromises = [];
		}) : n.apply(this, arguments);
	};
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/safari/safari_shim.js
var Sa = /* @__PURE__ */ s({
	shimAudioContext: () => ja,
	shimCallbacksAPI: () => Ta,
	shimConstraints: () => Da,
	shimCreateOfferLegacy: () => Aa,
	shimGetUserMedia: () => Ea,
	shimLocalStreamsAPI: () => Ca,
	shimRTCIceServerUrls: () => Oa,
	shimRemoteStreamsAPI: () => wa,
	shimTrackEventTransceiver: () => ka
});
function Ca(e) {
	if (typeof e == "object" && e.RTCPeerConnection) {
		if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function() {
			return this._localStreams ||= [], this._localStreams;
		}), !("addStream" in e.RTCPeerConnection.prototype)) {
			let t = e.RTCPeerConnection.prototype.addTrack;
			e.RTCPeerConnection.prototype.addStream = function(e) {
				this._localStreams ||= [], this._localStreams.includes(e) || this._localStreams.push(e), e.getAudioTracks().forEach((n) => t.call(this, n, e)), e.getVideoTracks().forEach((n) => t.call(this, n, e));
			}, e.RTCPeerConnection.prototype.addTrack = function(e, ...n) {
				return n && n.forEach((e) => {
					this._localStreams ? this._localStreams.includes(e) || this._localStreams.push(e) : this._localStreams = [e];
				}), t.apply(this, arguments);
			};
		}
		"removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function(e) {
			this._localStreams ||= [];
			let t = this._localStreams.indexOf(e);
			if (t === -1) return;
			this._localStreams.splice(t, 1);
			let n = e.getTracks();
			this.getSenders().forEach((e) => {
				n.includes(e.track) && this.removeTrack(e);
			});
		});
	}
}
function wa(e) {
	if (typeof e == "object" && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function() {
		return this._remoteStreams ? this._remoteStreams : [];
	}), !("onaddstream" in e.RTCPeerConnection.prototype))) {
		Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
			get() {
				return this._onaddstream;
			},
			set(e) {
				this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = e), this.addEventListener("track", this._onaddstreampoly = (e) => {
					e.streams.forEach((e) => {
						if (this._remoteStreams ||= [], this._remoteStreams.includes(e)) return;
						this._remoteStreams.push(e);
						let t = new Event("addstream");
						t.stream = e, this.dispatchEvent(t);
					});
				});
			}
		});
		let t = e.RTCPeerConnection.prototype.setRemoteDescription;
		e.RTCPeerConnection.prototype.setRemoteDescription = function() {
			let e = this;
			return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function(t) {
				t.streams.forEach((t) => {
					if (e._remoteStreams ||= [], e._remoteStreams.indexOf(t) >= 0) return;
					e._remoteStreams.push(t);
					let n = new Event("addstream");
					n.stream = t, e.dispatchEvent(n);
				});
			}), t.apply(e, arguments);
		};
	}
}
function Ta(e) {
	if (typeof e != "object" || !e.RTCPeerConnection) return;
	let t = e.RTCPeerConnection.prototype, n = t.createOffer, r = t.createAnswer, i = t.setLocalDescription, a = t.setRemoteDescription, o = t.addIceCandidate;
	t.createOffer = function(e, t) {
		let r = arguments.length >= 2 ? arguments[2] : arguments[0], i = n.apply(this, [r]);
		return t ? (i.then(e, t), Promise.resolve()) : i;
	}, t.createAnswer = function(e, t) {
		let n = arguments.length >= 2 ? arguments[2] : arguments[0], i = r.apply(this, [n]);
		return t ? (i.then(e, t), Promise.resolve()) : i;
	};
	let s = function(e, t, n) {
		let r = i.apply(this, [e]);
		return n ? (r.then(t, n), Promise.resolve()) : r;
	};
	t.setLocalDescription = s, s = function(e, t, n) {
		let r = a.apply(this, [e]);
		return n ? (r.then(t, n), Promise.resolve()) : r;
	}, t.setRemoteDescription = s, s = function(e, t, n) {
		let r = o.apply(this, [e]);
		return n ? (r.then(t, n), Promise.resolve()) : r;
	}, t.addIceCandidate = s;
}
function Ea(e) {
	let t = e && e.navigator;
	if (t.mediaDevices && t.mediaDevices.getUserMedia) {
		let e = t.mediaDevices, n = e.getUserMedia.bind(e);
		t.mediaDevices.getUserMedia = (e) => n(Da(e));
	}
	!t.getUserMedia && t.mediaDevices && t.mediaDevices.getUserMedia && (t.getUserMedia = function(e, n, r) {
		t.mediaDevices.getUserMedia(e).then(n, r);
	}.bind(t));
}
function Da(e) {
	return e && e.video !== void 0 ? Object.assign({}, e, { video: Ji(e.video) }) : e;
}
function Oa(e) {
	if (!e.RTCPeerConnection) return;
	let t = e.RTCPeerConnection;
	e.RTCPeerConnection = function(e, n) {
		if (e && e.iceServers) {
			let t = [];
			for (let n = 0; n < e.iceServers.length; n++) {
				let r = e.iceServers[n];
				r.urls === void 0 && r.url ? (Gi("RTCIceServer.url", "RTCIceServer.urls"), r = JSON.parse(JSON.stringify(r)), r.urls = r.url, delete r.url, t.push(r)) : t.push(e.iceServers[n]);
			}
			e.iceServers = t;
		}
		return new t(e, n);
	}, e.RTCPeerConnection.prototype = t.prototype, "generateCertificate" in t && Object.defineProperty(e.RTCPeerConnection, "generateCertificate", { get() {
		return t.generateCertificate;
	} });
}
function ka(e) {
	typeof e == "object" && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", { get() {
		return { receiver: this.receiver };
	} });
}
function Aa(e) {
	let t = e.RTCPeerConnection.prototype.createOffer;
	e.RTCPeerConnection.prototype.createOffer = function(e) {
		if (e) {
			e.offerToReceiveAudio !== void 0 && (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
			let t = this.getTransceivers().find((e) => e.receiver.track.kind === "audio");
			e.offerToReceiveAudio === !1 && t ? t.direction === "sendrecv" ? t.setDirection ? t.setDirection("sendonly") : t.direction = "sendonly" : t.direction === "recvonly" && (t.setDirection ? t.setDirection("inactive") : t.direction = "inactive") : e.offerToReceiveAudio === !0 && !t && this.addTransceiver("audio", { direction: "recvonly" }), e.offerToReceiveVideo !== void 0 && (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
			let n = this.getTransceivers().find((e) => e.receiver.track.kind === "video");
			e.offerToReceiveVideo === !1 && n ? n.direction === "sendrecv" ? n.setDirection ? n.setDirection("sendonly") : n.direction = "sendonly" : n.direction === "recvonly" && (n.setDirection ? n.setDirection("inactive") : n.direction = "inactive") : e.offerToReceiveVideo === !0 && !n && this.addTransceiver("video", { direction: "recvonly" });
		}
		return t.apply(this, arguments);
	};
}
function ja(e) {
	typeof e != "object" || e.AudioContext || (e.AudioContext = e.webkitAudioContext);
}
//#endregion
//#region node_modules/sdp/sdp.js
var Ma = /* @__PURE__ */ o(((e, t) => {
	var n = {};
	n.generateIdentifier = function() {
		return Math.random().toString(36).substring(2, 12);
	}, n.localCName = n.generateIdentifier(), n.splitLines = function(e) {
		return e.trim().split("\n").map((e) => e.trim());
	}, n.splitSections = function(e) {
		return e.split("\nm=").map((e, t) => (t > 0 ? "m=" + e : e).trim() + "\r\n");
	}, n.getDescription = function(e) {
		let t = n.splitSections(e);
		return t && t[0];
	}, n.getMediaSections = function(e) {
		let t = n.splitSections(e);
		return t.shift(), t;
	}, n.matchPrefix = function(e, t) {
		return n.splitLines(e).filter((e) => e.indexOf(t) === 0);
	}, n.parseCandidate = function(e) {
		let t;
		t = e.indexOf("a=candidate:") === 0 ? e.substring(12).split(" ") : e.substring(10).split(" ");
		let n = {
			foundation: t[0],
			component: {
				1: "rtp",
				2: "rtcp"
			}[t[1]] || t[1],
			protocol: t[2].toLowerCase(),
			priority: parseInt(t[3], 10),
			ip: t[4],
			address: t[4],
			port: parseInt(t[5], 10),
			type: t[7]
		};
		for (let e = 8; e < t.length; e += 2) switch (t[e]) {
			case "raddr":
				n.relatedAddress = t[e + 1];
				break;
			case "rport":
				n.relatedPort = parseInt(t[e + 1], 10);
				break;
			case "tcptype":
				n.tcpType = t[e + 1];
				break;
			case "ufrag":
				n.ufrag = t[e + 1], n.usernameFragment = t[e + 1];
				break;
			default: n[t[e]] === void 0 && (n[t[e]] = t[e + 1]);
		}
		return n;
	}, n.writeCandidate = function(e) {
		let t = [];
		t.push(e.foundation);
		let n = e.component;
		n === "rtp" ? t.push(1) : n === "rtcp" ? t.push(2) : t.push(n), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.address || e.ip), t.push(e.port);
		let r = e.type;
		return t.push("typ"), t.push(r), r !== "host" && e.relatedAddress && e.relatedPort !== void 0 && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && e.protocol.toLowerCase() === "tcp" && (t.push("tcptype"), t.push(e.tcpType)), (e.usernameFragment || e.ufrag) && (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)), "candidate:" + t.join(" ");
	}, n.parseIceOptions = function(e) {
		return e.substring(14).split(" ");
	}, n.parseRtpMap = function(e) {
		let t = e.substring(9).split(" "), n = { payloadType: parseInt(t.shift(), 10) };
		return t = t[0].split("/"), n.name = t[0], n.clockRate = parseInt(t[1], 10), n.channels = t.length === 3 ? parseInt(t[2], 10) : 1, n.numChannels = n.channels, n;
	}, n.writeRtpMap = function(e) {
		let t = e.payloadType;
		e.preferredPayloadType !== void 0 && (t = e.preferredPayloadType);
		let n = e.channels || e.numChannels || 1;
		return "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (n === 1 ? "" : "/" + n) + "\r\n";
	}, n.parseExtmap = function(e) {
		let t = e.substring(9).split(" ");
		return {
			id: parseInt(t[0], 10),
			direction: t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv",
			uri: t[1],
			attributes: t.slice(2).join(" ")
		};
	}, n.writeExtmap = function(e) {
		return "a=extmap:" + (e.id || e.preferredId) + (e.direction && e.direction !== "sendrecv" ? "/" + e.direction : "") + " " + e.uri + (e.attributes ? " " + e.attributes : "") + "\r\n";
	}, n.parseFmtp = function(e) {
		let t = {}, n, r = e.substring(e.indexOf(" ") + 1).split(";");
		for (let e = 0; e < r.length; e++) n = r[e].trim().split("="), t[n[0].trim()] = n[1];
		return t;
	}, n.writeFmtp = function(e) {
		let t = "", n = e.payloadType;
		if (e.preferredPayloadType !== void 0 && (n = e.preferredPayloadType), e.parameters && Object.keys(e.parameters).length) {
			let r = [];
			Object.keys(e.parameters).forEach((t) => {
				e.parameters[t] === void 0 ? r.push(t) : r.push(t + "=" + e.parameters[t]);
			}), t += "a=fmtp:" + n + " " + r.join(";") + "\r\n";
		}
		return t;
	}, n.parseRtcpFb = function(e) {
		let t = e.substring(e.indexOf(" ") + 1).split(" ");
		return {
			type: t.shift(),
			parameter: t.join(" ")
		};
	}, n.writeRtcpFb = function(e) {
		let t = "", n = e.payloadType;
		return e.preferredPayloadType !== void 0 && (n = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach((e) => {
			t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n";
		}), t;
	}, n.parseSsrcMedia = function(e) {
		let t = e.indexOf(" "), n = { ssrc: parseInt(e.substring(7, t), 10) }, r = e.indexOf(":", t);
		return r > -1 ? (n.attribute = e.substring(t + 1, r), n.value = e.substring(r + 1)) : n.attribute = e.substring(t + 1), n;
	}, n.parseSsrcGroup = function(e) {
		let t = e.substring(13).split(" ");
		return {
			semantics: t.shift(),
			ssrcs: t.map((e) => parseInt(e, 10))
		};
	}, n.getMid = function(e) {
		let t = n.matchPrefix(e, "a=mid:")[0];
		if (t) return t.substring(6);
	}, n.parseFingerprint = function(e) {
		let t = e.substring(14).split(" ");
		return {
			algorithm: t[0].toLowerCase(),
			value: t[1].toUpperCase()
		};
	}, n.getDtlsParameters = function(e, t) {
		return {
			role: "auto",
			fingerprints: n.matchPrefix(e + t, "a=fingerprint:").map(n.parseFingerprint)
		};
	}, n.writeDtlsParameters = function(e, t) {
		let n = "a=setup:" + t + "\r\n";
		return e.fingerprints.forEach((e) => {
			n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n";
		}), n;
	}, n.parseCryptoLine = function(e) {
		let t = e.substring(9).split(" ");
		return {
			tag: parseInt(t[0], 10),
			cryptoSuite: t[1],
			keyParams: t[2],
			sessionParams: t.slice(3)
		};
	}, n.writeCryptoLine = function(e) {
		return "a=crypto:" + e.tag + " " + e.cryptoSuite + " " + (typeof e.keyParams == "object" ? n.writeCryptoKeyParams(e.keyParams) : e.keyParams) + (e.sessionParams ? " " + e.sessionParams.join(" ") : "") + "\r\n";
	}, n.parseCryptoKeyParams = function(e) {
		if (e.indexOf("inline:") !== 0) return null;
		let t = e.substring(7).split("|");
		return {
			keyMethod: "inline",
			keySalt: t[0],
			lifeTime: t[1],
			mkiValue: t[2] ? t[2].split(":")[0] : void 0,
			mkiLength: t[2] ? t[2].split(":")[1] : void 0
		};
	}, n.writeCryptoKeyParams = function(e) {
		return e.keyMethod + ":" + e.keySalt + (e.lifeTime ? "|" + e.lifeTime : "") + (e.mkiValue && e.mkiLength ? "|" + e.mkiValue + ":" + e.mkiLength : "");
	}, n.getCryptoParameters = function(e, t) {
		return n.matchPrefix(e + t, "a=crypto:").map(n.parseCryptoLine);
	}, n.getIceParameters = function(e, t) {
		let r = n.matchPrefix(e + t, "a=ice-ufrag:")[0], i = n.matchPrefix(e + t, "a=ice-pwd:")[0];
		return r && i ? {
			usernameFragment: r.substring(12),
			password: i.substring(10)
		} : null;
	}, n.writeIceParameters = function(e) {
		let t = "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n";
		return e.iceLite && (t += "a=ice-lite\r\n"), t;
	}, n.parseRtpParameters = function(e) {
		let t = {
			codecs: [],
			headerExtensions: [],
			fecMechanisms: [],
			rtcp: []
		}, r = n.splitLines(e)[0].split(" ");
		t.profile = r[2];
		for (let i = 3; i < r.length; i++) {
			let a = r[i], o = n.matchPrefix(e, "a=rtpmap:" + a + " ")[0];
			if (o) {
				let r = n.parseRtpMap(o), i = n.matchPrefix(e, "a=fmtp:" + a + " ");
				switch (r.parameters = i.length ? n.parseFmtp(i[0]) : {}, r.rtcpFeedback = n.matchPrefix(e, "a=rtcp-fb:" + a + " ").map(n.parseRtcpFb), t.codecs.push(r), r.name.toUpperCase()) {
					case "RED":
					case "ULPFEC": t.fecMechanisms.push(r.name.toUpperCase());
				}
			}
		}
		n.matchPrefix(e, "a=extmap:").forEach((e) => {
			t.headerExtensions.push(n.parseExtmap(e));
		});
		let i = n.matchPrefix(e, "a=rtcp-fb:* ").map(n.parseRtcpFb);
		return t.codecs.forEach((e) => {
			i.forEach((t) => {
				e.rtcpFeedback.find((e) => e.type === t.type && e.parameter === t.parameter) || e.rtcpFeedback.push(t);
			});
		}), t;
	}, n.writeRtpDescription = function(e, t) {
		let r = "";
		r += "m=" + e + " ", r += t.codecs.length > 0 ? "9" : "0", r += " " + (t.profile || "UDP/TLS/RTP/SAVPF") + " ", r += t.codecs.map((e) => e.preferredPayloadType === void 0 ? e.payloadType : e.preferredPayloadType).join(" ") + "\r\n", r += "c=IN IP4 0.0.0.0\r\n", r += "a=rtcp:9 IN IP4 0.0.0.0\r\n", t.codecs.forEach((e) => {
			r += n.writeRtpMap(e), r += n.writeFmtp(e), r += n.writeRtcpFb(e);
		});
		let i = 0;
		return t.codecs.forEach((e) => {
			e.maxptime > i && (i = e.maxptime);
		}), i > 0 && (r += "a=maxptime:" + i + "\r\n"), t.headerExtensions && t.headerExtensions.forEach((e) => {
			r += n.writeExtmap(e);
		}), r;
	}, n.parseRtpEncodingParameters = function(e) {
		let t = [], r = n.parseRtpParameters(e), i = r.fecMechanisms.indexOf("RED") !== -1, a = r.fecMechanisms.indexOf("ULPFEC") !== -1, o = n.matchPrefix(e, "a=ssrc:").map((e) => n.parseSsrcMedia(e)).filter((e) => e.attribute === "cname"), s = o.length > 0 && o[0].ssrc, c, l = n.matchPrefix(e, "a=ssrc-group:FID").map((e) => e.substring(17).split(" ").map((e) => parseInt(e, 10)));
		l.length > 0 && l[0].length > 1 && l[0][0] === s && (c = l[0][1]), r.codecs.forEach((e) => {
			if (e.name.toUpperCase() === "RTX" && e.parameters.apt) {
				let n = {
					ssrc: s,
					codecPayloadType: parseInt(e.parameters.apt, 10)
				};
				s && c && (n.rtx = { ssrc: c }), t.push(n), i && (n = JSON.parse(JSON.stringify(n)), n.fec = {
					ssrc: s,
					mechanism: a ? "red+ulpfec" : "red"
				}, t.push(n));
			}
		}), t.length === 0 && s && t.push({ ssrc: s });
		let u = n.matchPrefix(e, "b=");
		return u.length && (u = u[0].indexOf("b=TIAS:") === 0 ? parseInt(u[0].substring(7), 10) : u[0].indexOf("b=AS:") === 0 ? parseInt(u[0].substring(5), 10) * 1e3 * .95 - 16e3 : void 0, t.forEach((e) => {
			e.maxBitrate = u;
		})), t;
	}, n.parseRtcpParameters = function(e) {
		let t = {}, r = n.matchPrefix(e, "a=ssrc:").map((e) => n.parseSsrcMedia(e)).filter((e) => e.attribute === "cname")[0];
		r && (t.cname = r.value, t.ssrc = r.ssrc);
		let i = n.matchPrefix(e, "a=rtcp-rsize");
		return t.reducedSize = i.length > 0, t.compound = i.length === 0, t.mux = n.matchPrefix(e, "a=rtcp-mux").length > 0, t;
	}, n.writeRtcpParameters = function(e) {
		let t = "";
		return e.reducedSize && (t += "a=rtcp-rsize\r\n"), e.mux && (t += "a=rtcp-mux\r\n"), e.ssrc !== void 0 && e.cname && (t += "a=ssrc:" + e.ssrc + " cname:" + e.cname + "\r\n"), t;
	}, n.parseMsid = function(e) {
		let t, r = n.matchPrefix(e, "a=msid:");
		if (r.length === 1) return t = r[0].substring(7).split(" "), {
			stream: t[0],
			track: t[1]
		};
		let i = n.matchPrefix(e, "a=ssrc:").map((e) => n.parseSsrcMedia(e)).filter((e) => e.attribute === "msid");
		if (i.length > 0) return t = i[0].value.split(" "), {
			stream: t[0],
			track: t[1]
		};
	}, n.parseSctpDescription = function(e) {
		let t = n.parseMLine(e), r = n.matchPrefix(e, "a=max-message-size:"), i;
		r.length > 0 && (i = parseInt(r[0].substring(19), 10)), isNaN(i) && (i = 65536);
		let a = n.matchPrefix(e, "a=sctp-port:");
		if (a.length > 0) return {
			port: parseInt(a[0].substring(12), 10),
			protocol: t.fmt,
			maxMessageSize: i
		};
		let o = n.matchPrefix(e, "a=sctpmap:");
		if (o.length > 0) {
			let e = o[0].substring(10).split(" ");
			return {
				port: parseInt(e[0], 10),
				protocol: e[1],
				maxMessageSize: i
			};
		}
	}, n.writeSctpDescription = function(e, t) {
		let n = [];
		return n = e.protocol === "DTLS/SCTP" ? [
			"m=" + e.kind + " 9 " + e.protocol + " " + t.port + "\r\n",
			"c=IN IP4 0.0.0.0\r\n",
			"a=sctpmap:" + t.port + " " + t.protocol + " 65535\r\n"
		] : [
			"m=" + e.kind + " 9 " + e.protocol + " " + t.protocol + "\r\n",
			"c=IN IP4 0.0.0.0\r\n",
			"a=sctp-port:" + t.port + "\r\n"
		], t.maxMessageSize !== void 0 && n.push("a=max-message-size:" + t.maxMessageSize + "\r\n"), n.join("");
	}, n.generateSessionId = function() {
		return Math.random().toString().substr(2, 22);
	}, n.writeSessionBoilerplate = function(e, t, r) {
		let i, a = t === void 0 ? 2 : t;
		return i = e || n.generateSessionId(), "v=0\r\no=" + (r || "thisisadapterortc") + " " + i + " " + a + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n";
	}, n.getDirection = function(e, t) {
		let r = n.splitLines(e);
		for (let e = 0; e < r.length; e++) switch (r[e]) {
			case "a=sendrecv":
			case "a=sendonly":
			case "a=recvonly":
			case "a=inactive": return r[e].substring(2);
		}
		return t ? n.getDirection(t) : "sendrecv";
	}, n.getKind = function(e) {
		return n.splitLines(e)[0].split(" ")[0].substring(2);
	}, n.isRejected = function(e) {
		return e.split(" ", 2)[1] === "0";
	}, n.parseMLine = function(e) {
		let t = n.splitLines(e)[0].substring(2).split(" ");
		return {
			kind: t[0],
			port: parseInt(t[1], 10),
			protocol: t[2],
			fmt: t.slice(3).join(" ")
		};
	}, n.parseOLine = function(e) {
		let t = n.matchPrefix(e, "o=")[0].substring(2).split(" ");
		return {
			username: t[0],
			sessionId: t[1],
			sessionVersion: parseInt(t[2], 10),
			netType: t[3],
			addressType: t[4],
			address: t[5]
		};
	}, n.isValidSDP = function(e) {
		if (typeof e != "string" || e.length === 0) return !1;
		let t = n.splitLines(e);
		for (let e = 0; e < t.length; e++) if (t[e].length < 2 || t[e].charAt(1) !== "=") return !1;
		return !0;
	}, typeof t == "object" && (t.exports = n);
})), Na = /* @__PURE__ */ s({
	removeExtmapAllowMixed: () => Ba,
	shimAddIceCandidateNullOrEmpty: () => Va,
	shimConnectionState: () => za,
	shimMaxMessageSize: () => La,
	shimParameterlessSetLocalDescription: () => Ha,
	shimRTCIceCandidate: () => Fa,
	shimRTCIceCandidateRelayProtocol: () => Ia,
	shimSendThrowTypeError: () => Ra
}), Pa = /* @__PURE__ */ l(Ma());
function Fa(e) {
	if (!e.RTCIceCandidate || e.RTCIceCandidate && "foundation" in e.RTCIceCandidate.prototype) return;
	let t = e.RTCIceCandidate;
	e.RTCIceCandidate = function(e) {
		if (typeof e == "object" && e.candidate && e.candidate.indexOf("a=") === 0 && (e = JSON.parse(JSON.stringify(e)), e.candidate = e.candidate.substring(2)), e.candidate && e.candidate.length) {
			let n = new t(e), r = Pa.default.parseCandidate(e.candidate);
			for (let e in r) e in n || Object.defineProperty(n, e, { value: r[e] });
			return n.toJSON = function() {
				return {
					candidate: n.candidate,
					sdpMid: n.sdpMid,
					sdpMLineIndex: n.sdpMLineIndex,
					usernameFragment: n.usernameFragment
				};
			}, n;
		}
		return new t(e);
	}, e.RTCIceCandidate.prototype = t.prototype, Vi(e, "icecandidate", (t) => (t.candidate && Object.defineProperty(t, "candidate", {
		value: new e.RTCIceCandidate(t.candidate),
		writable: "false"
	}), t));
}
function Ia(e) {
	!e.RTCIceCandidate || e.RTCIceCandidate && "relayProtocol" in e.RTCIceCandidate.prototype || Vi(e, "icecandidate", (e) => {
		if (e.candidate) {
			let t = Pa.default.parseCandidate(e.candidate.candidate);
			t.type === "relay" && (e.candidate.relayProtocol = {
				0: "tls",
				1: "tcp",
				2: "udp"
			}[t.priority >> 24]);
		}
		return e;
	});
}
function La(e, t) {
	if (!e.RTCPeerConnection || t.browser === "chrome" && t.version > 102 || t.browser === "firefox" && t.version >= 113) return;
	"sctp" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", { get() {
		return this._sctp === void 0 ? null : this._sctp;
	} });
	let n = function(e) {
		if (!e || !e.sdp) return !1;
		let t = Pa.default.splitSections(e.sdp);
		return t.shift(), t.some((e) => {
			let t = Pa.default.parseMLine(e);
			return t && t.kind === "application" && t.protocol.indexOf("SCTP") !== -1;
		});
	}, r = function(e) {
		let t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
		if (t === null || t.length < 2) return -1;
		let n = parseInt(t[1], 10);
		return n === n ? n : -1;
	}, i = function(e) {
		let n = 65536;
		return t.browser === "firefox" && (n = t.version < 57 ? e === -1 ? 16384 : 2147483637 : t.version < 60 ? t.version === 57 ? 65535 : 65536 : 2147483637), n;
	}, a = function(e, n) {
		let r = 65536;
		t.browser === "firefox" && t.version === 57 && (r = 65535);
		let i = Pa.default.matchPrefix(e.sdp, "a=max-message-size:");
		return i.length > 0 ? r = parseInt(i[0].substring(19), 10) : t.browser === "firefox" && n !== -1 && (r = 2147483637), r;
	}, o = e.RTCPeerConnection.prototype.setRemoteDescription;
	e.RTCPeerConnection.prototype.setRemoteDescription = function() {
		if (this._sctp = null, t.browser === "chrome" && t.version >= 76) {
			let { sdpSemantics: e } = this.getConfiguration();
			e === "plan-b" && Object.defineProperty(this, "sctp", {
				get() {
					return this._sctp === void 0 ? null : this._sctp;
				},
				enumerable: !0,
				configurable: !0
			});
		}
		if (n(arguments[0])) {
			let e = r(arguments[0]), t = i(e), n = a(arguments[0], e), o;
			o = t === 0 && n === 0 ? Infinity : t === 0 || n === 0 ? Math.max(t, n) : Math.min(t, n);
			let s = {};
			Object.defineProperty(s, "maxMessageSize", { get() {
				return o;
			} }), this._sctp = s;
		}
		return o.apply(this, arguments);
	};
}
function Ra(e, t) {
	if (!(e.RTCPeerConnection && "createDataChannel" in e.RTCPeerConnection.prototype) || t.browser === "chrome" && t.version >= 149 || t.browser === "firefox" && t.version > 60) return;
	function n(e, t) {
		let n = e.send;
		e.send = function() {
			let r = arguments[0], i = r.length || r.size || r.byteLength;
			if (e.readyState === "open" && t.sctp && i > t.sctp.maxMessageSize) throw TypeError("Message too large (can send a maximum of " + t.sctp.maxMessageSize + " bytes)");
			return n.apply(e, arguments);
		};
	}
	let r = e.RTCPeerConnection.prototype.createDataChannel;
	e.RTCPeerConnection.prototype.createDataChannel = function() {
		let e = r.apply(this, arguments);
		return n(e, this), e;
	}, Vi(e, "datachannel", (e) => (n(e.channel, e.target), e));
}
function za(e) {
	if (!e.RTCPeerConnection || "connectionState" in e.RTCPeerConnection.prototype) return;
	let t = e.RTCPeerConnection.prototype;
	Object.defineProperty(t, "connectionState", {
		get() {
			return {
				completed: "connected",
				checking: "connecting"
			}[this.iceConnectionState] || this.iceConnectionState;
		},
		enumerable: !0,
		configurable: !0
	}), Object.defineProperty(t, "onconnectionstatechange", {
		get() {
			return this._onconnectionstatechange || null;
		},
		set(e) {
			this._onconnectionstatechange && (this.removeEventListener("connectionstatechange", this._onconnectionstatechange), delete this._onconnectionstatechange), e && this.addEventListener("connectionstatechange", this._onconnectionstatechange = e);
		},
		enumerable: !0,
		configurable: !0
	}), ["setLocalDescription", "setRemoteDescription"].forEach((e) => {
		let n = t[e];
		t[e] = function() {
			return this._connectionstatechangepoly || (this._connectionstatechangepoly = (e) => {
				let t = e.target;
				if (t._lastConnectionState !== t.connectionState) {
					t._lastConnectionState = t.connectionState;
					let n = new Event("connectionstatechange", e);
					t.dispatchEvent(n);
				}
				return e;
			}, this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly)), n.apply(this, arguments);
		};
	});
}
function Ba(e, t) {
	if (!e.RTCPeerConnection || t.browser === "chrome" && t.version >= 71 || t.browser === "safari" && t._safariVersion >= 13.1) return;
	let n = e.RTCPeerConnection.prototype.setRemoteDescription;
	e.RTCPeerConnection.prototype.setRemoteDescription = function(t) {
		if (t && t.sdp && t.sdp.indexOf("\na=extmap-allow-mixed") !== -1) {
			let n = t.sdp.split("\n").filter((e) => e.trim() !== "a=extmap-allow-mixed").join("\n");
			e.RTCSessionDescription && t instanceof e.RTCSessionDescription ? arguments[0] = new e.RTCSessionDescription({
				type: t.type,
				sdp: n
			}) : t.sdp = n;
		}
		return n.apply(this, arguments);
	};
}
function Va(e, t) {
	if (!(e.RTCPeerConnection && e.RTCPeerConnection.prototype)) return;
	let n = e.RTCPeerConnection.prototype.addIceCandidate;
	n && n.length !== 0 && (e.RTCPeerConnection.prototype.addIceCandidate = function() {
		return arguments[0] ? (t.browser === "chrome" && t.version < 78 || t.browser === "firefox" && t.version < 68 || t.browser === "safari") && arguments[0] && arguments[0].candidate === "" ? Promise.resolve() : n.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve());
	});
}
function Ha(e, t) {
	if (!(e.RTCPeerConnection && e.RTCPeerConnection.prototype)) return;
	let n = e.RTCPeerConnection.prototype.setLocalDescription;
	n && n.length !== 0 && (e.RTCPeerConnection.prototype.setLocalDescription = function() {
		let e = arguments[0] || {};
		if (typeof e != "object" || e.type && e.sdp) return n.apply(this, arguments);
		if (e = {
			type: e.type,
			sdp: e.sdp
		}, !e.type) switch (this.signalingState) {
			case "stable":
			case "have-local-offer":
			case "have-remote-pranswer":
				e.type = "offer";
				break;
			default: e.type = "answer";
		}
		return e.sdp || e.type !== "offer" && e.type !== "answer" ? n.apply(this, [e]) : (e.type === "offer" ? this.createOffer : this.createAnswer).apply(this).then((e) => n.apply(this, [e]));
	});
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/adapter_factory.js
function Ua({ window: e } = {}, t = {
	shimChrome: !0,
	shimFirefox: !0,
	shimSafari: !0
}) {
	let n = Wi, r = Ki(e), i = {
		browserDetails: r,
		commonShim: Na,
		extractVersion: Bi,
		disableLog: Hi,
		disableWarnings: Ui,
		sdp: Pa
	};
	switch (r.browser) {
		case "chrome":
			if (!$i || !oa || !t.shimChrome) return n("Chrome shim is not included in this adapter release."), i;
			if (r.version === null) return n("Chrome shim can not determine version, not shimming."), i;
			n("adapter.js shimming chrome."), i.browserShim = $i, Va(e, r), Ha(e, r), Qi(e, r), ea(e, r), oa(e, r), ta(e, r), aa(e, r), na(e, r), ra(e, r), sa(e, r), Fa(e, r), Ia(e, r), za(e, r), La(e, r), Ra(e, r), Ba(e, r);
			break;
		case "firefox":
			if (!ua || !fa || !t.shimFirefox) return n("Firefox shim is not included in this adapter release."), i;
			n("adapter.js shimming firefox."), i.browserShim = ua, Va(e, r), Ha(e, r), ca(e, r), fa(e, r), pa(e, r), da(e, r), ga(e, r), ma(e, r), ha(e, r), _a(e, r), va(e, r), ya(e, r), ba(e, r), xa(e, r), Fa(e, r), za(e, r), La(e, r), Ra(e, r);
			break;
		case "safari":
			if (!Sa || !t.shimSafari) return n("Safari shim is not included in this adapter release."), i;
			n("adapter.js shimming safari."), i.browserShim = Sa, Va(e, r), Ha(e, r), Oa(e, r), Aa(e, r), Ta(e, r), Ca(e, r), wa(e, r), ka(e, r), Ea(e, r), ja(e, r), Fa(e, r), Ia(e, r), La(e, r), Ra(e, r), Ba(e, r);
			break;
		default: n("Unsupported browser!");
	}
	return i;
}
//#endregion
//#region node_modules/webrtc-adapter/src/js/adapter_core.js
var Wa = Ua({ window: typeof window > "u" ? void 0 : window });
//#endregion
//#region node_modules/peerjs/dist/bundler.mjs
function Ga(e, t, n, r) {
	Object.defineProperty(e, t, {
		get: n,
		set: r,
		enumerable: !0,
		configurable: !0
	});
}
var Ka = class {
	constructor() {
		this.chunkedMTU = 16300, this._dataCount = 1, this.chunk = (e) => {
			let t = [], n = e.byteLength, r = Math.ceil(n / this.chunkedMTU), i = 0, a = 0;
			for (; a < n;) {
				let o = Math.min(n, a + this.chunkedMTU), s = e.slice(a, o), c = {
					__peerData: this._dataCount,
					n: i,
					data: s,
					total: r
				};
				t.push(c), a = o, i++;
			}
			return this._dataCount++, t;
		};
	}
};
function qa(e) {
	let t = 0;
	for (let n of e) t += n.byteLength;
	let n = new Uint8Array(t), r = 0;
	for (let t of e) n.set(t, r), r += t.byteLength;
	return n;
}
var Ja = Wa.default || Wa, Ya = new class {
	isWebRTCSupported() {
		return typeof RTCPeerConnection < "u";
	}
	isBrowserSupported() {
		let e = this.getBrowser(), t = this.getVersion();
		return this.supportedBrowsers.includes(e) ? e === "chrome" ? t >= this.minChromeVersion : e === "firefox" ? t >= this.minFirefoxVersion : e === "safari" && !this.isIOS && t >= this.minSafariVersion : !1;
	}
	getBrowser() {
		return Ja.browserDetails.browser;
	}
	getVersion() {
		return Ja.browserDetails.version || 0;
	}
	isUnifiedPlanSupported() {
		let e = this.getBrowser(), t = Ja.browserDetails.version || 0;
		if (e === "chrome" && t < this.minChromeVersion) return !1;
		if (e === "firefox" && t >= this.minFirefoxVersion) return !0;
		if (!window.RTCRtpTransceiver || !("currentDirection" in RTCRtpTransceiver.prototype)) return !1;
		let n, r = !1;
		try {
			n = new RTCPeerConnection(), n.addTransceiver("audio"), r = !0;
		} catch {} finally {
			n && n.close();
		}
		return r;
	}
	toString() {
		return `Supports:
    browser:${this.getBrowser()}
    version:${this.getVersion()}
    isIOS:${this.isIOS}
    isWebRTCSupported:${this.isWebRTCSupported()}
    isBrowserSupported:${this.isBrowserSupported()}
    isUnifiedPlanSupported:${this.isUnifiedPlanSupported()}`;
	}
	constructor() {
		this.isIOS = typeof navigator < "u" && [
			"iPad",
			"iPhone",
			"iPod"
		].includes(navigator.platform), this.supportedBrowsers = [
			"firefox",
			"chrome",
			"safari"
		], this.minFirefoxVersion = 59, this.minChromeVersion = 72, this.minSafariVersion = 605;
	}
}(), Xa = (e) => !e || /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/.test(e), Za = () => Math.random().toString(36).slice(2), Qa = {
	iceServers: [{ urls: "stun:stun.l.google.com:19302" }, {
		urls: ["turn:eu-0.turn.peerjs.com:3478", "turn:us-0.turn.peerjs.com:3478"],
		username: "peerjs",
		credential: "peerjsp"
	}],
	sdpSemantics: "unified-plan"
}, J = new class extends Ka {
	noop() {}
	blobToArrayBuffer(e, t) {
		let n = new FileReader();
		return n.onload = function(e) {
			e.target && t(e.target.result);
		}, n.readAsArrayBuffer(e), n;
	}
	binaryStringToArrayBuffer(e) {
		let t = new Uint8Array(e.length);
		for (let n = 0; n < e.length; n++) t[n] = e.charCodeAt(n) & 255;
		return t.buffer;
	}
	isSecure() {
		return location.protocol === "https:";
	}
	constructor(...e) {
		super(...e), this.CLOUD_HOST = "0.peerjs.com", this.CLOUD_PORT = 443, this.chunkedBrowsers = {
			Chrome: 1,
			chrome: 1
		}, this.defaultConfig = Qa, this.browser = Ya.getBrowser(), this.browserVersion = Ya.getVersion(), this.pack = Fi, this.unpack = Pi, this.supports = function() {
			let e = {
				browser: Ya.isBrowserSupported(),
				webRTC: Ya.isWebRTCSupported(),
				audioVideo: !1,
				data: !1,
				binaryBlob: !1,
				reliable: !1
			};
			if (!e.webRTC) return e;
			let t;
			try {
				t = new RTCPeerConnection(Qa), e.audioVideo = !0;
				let n;
				try {
					n = t.createDataChannel("_PEERJSTEST", { ordered: !0 }), e.data = !0, e.reliable = !!n.ordered;
					try {
						n.binaryType = "blob", e.binaryBlob = !Ya.isIOS;
					} catch {}
				} catch {} finally {
					n && n.close();
				}
			} catch {} finally {
				t && t.close();
			}
			return e;
		}(), this.validateId = Xa, this.randomToken = Za;
	}
}(), $a = "PeerJS: ", Y = new class {
	get logLevel() {
		return this._logLevel;
	}
	set logLevel(e) {
		this._logLevel = e;
	}
	log(...e) {
		this._logLevel >= 3 && this._print(3, ...e);
	}
	warn(...e) {
		this._logLevel >= 2 && this._print(2, ...e);
	}
	error(...e) {
		this._logLevel >= 1 && this._print(1, ...e);
	}
	setLogFunction(e) {
		this._print = e;
	}
	_print(e, ...t) {
		let n = [$a, ...t];
		for (let e in n) n[e] instanceof Error && (n[e] = "(" + n[e].name + ") " + n[e].message);
		e >= 3 ? console.log(...n) : e >= 2 ? console.warn("WARNING", ...n) : e >= 1 && console.error("ERROR", ...n);
	}
	constructor() {
		this._logLevel = 0;
	}
}(), eo = {}, to = Object.prototype.hasOwnProperty, X = "~";
function no() {}
Object.create && (no.prototype = Object.create(null), new no().__proto__ || (X = !1));
function ro(e, t, n) {
	this.fn = e, this.context = t, this.once = n || !1;
}
function io(e, t, n, r, i) {
	if (typeof n != "function") throw TypeError("The listener must be a function");
	var a = new ro(n, r || e, i), o = X ? X + t : t;
	return e._events[o] ? e._events[o].fn ? e._events[o] = [e._events[o], a] : e._events[o].push(a) : (e._events[o] = a, e._eventsCount++), e;
}
function ao(e, t) {
	--e._eventsCount === 0 ? e._events = new no() : delete e._events[t];
}
function Z() {
	this._events = new no(), this._eventsCount = 0;
}
Z.prototype.eventNames = function() {
	var e = [], t, n;
	if (this._eventsCount === 0) return e;
	for (n in t = this._events) to.call(t, n) && e.push(X ? n.slice(1) : n);
	return Object.getOwnPropertySymbols ? e.concat(Object.getOwnPropertySymbols(t)) : e;
}, Z.prototype.listeners = function(e) {
	var t = X ? X + e : e, n = this._events[t];
	if (!n) return [];
	if (n.fn) return [n.fn];
	for (var r = 0, i = n.length, a = Array(i); r < i; r++) a[r] = n[r].fn;
	return a;
}, Z.prototype.listenerCount = function(e) {
	var t = X ? X + e : e, n = this._events[t];
	return n ? n.fn ? 1 : n.length : 0;
}, Z.prototype.emit = function(e, t, n, r, i, a) {
	var o = X ? X + e : e;
	if (!this._events[o]) return !1;
	var s = this._events[o], c = arguments.length, l, u;
	if (s.fn) {
		switch (s.once && this.removeListener(e, s.fn, void 0, !0), c) {
			case 1: return s.fn.call(s.context), !0;
			case 2: return s.fn.call(s.context, t), !0;
			case 3: return s.fn.call(s.context, t, n), !0;
			case 4: return s.fn.call(s.context, t, n, r), !0;
			case 5: return s.fn.call(s.context, t, n, r, i), !0;
			case 6: return s.fn.call(s.context, t, n, r, i, a), !0;
		}
		for (u = 1, l = Array(c - 1); u < c; u++) l[u - 1] = arguments[u];
		s.fn.apply(s.context, l);
	} else {
		var d = s.length, f;
		for (u = 0; u < d; u++) switch (s[u].once && this.removeListener(e, s[u].fn, void 0, !0), c) {
			case 1:
				s[u].fn.call(s[u].context);
				break;
			case 2:
				s[u].fn.call(s[u].context, t);
				break;
			case 3:
				s[u].fn.call(s[u].context, t, n);
				break;
			case 4:
				s[u].fn.call(s[u].context, t, n, r);
				break;
			default:
				if (!l) for (f = 1, l = Array(c - 1); f < c; f++) l[f - 1] = arguments[f];
				s[u].fn.apply(s[u].context, l);
		}
	}
	return !0;
}, Z.prototype.on = function(e, t, n) {
	return io(this, e, t, n, !1);
}, Z.prototype.once = function(e, t, n) {
	return io(this, e, t, n, !0);
}, Z.prototype.removeListener = function(e, t, n, r) {
	var i = X ? X + e : e;
	if (!this._events[i]) return this;
	if (!t) return ao(this, i), this;
	var a = this._events[i];
	if (a.fn) a.fn === t && (!r || a.once) && (!n || a.context === n) && ao(this, i);
	else {
		for (var o = 0, s = [], c = a.length; o < c; o++) (a[o].fn !== t || r && !a[o].once || n && a[o].context !== n) && s.push(a[o]);
		s.length ? this._events[i] = s.length === 1 ? s[0] : s : ao(this, i);
	}
	return this;
}, Z.prototype.removeAllListeners = function(e) {
	var t;
	return e ? (t = X ? X + e : e, this._events[t] && ao(this, t)) : (this._events = new no(), this._eventsCount = 0), this;
}, Z.prototype.off = Z.prototype.removeListener, Z.prototype.addListener = Z.prototype.on, Z.prefixed = X, Z.EventEmitter = Z, eo = Z;
var oo = {};
Ga(oo, "ConnectionType", () => so), Ga(oo, "PeerErrorType", () => Q), Ga(oo, "BaseConnectionErrorType", () => co), Ga(oo, "DataConnectionErrorType", () => lo), Ga(oo, "SerializationType", () => uo), Ga(oo, "SocketEventType", () => fo), Ga(oo, "ServerMessageType", () => $);
var so = /*#__PURE__*/ function(e) {
	return e.Data = "data", e.Media = "media", e;
}({}), Q = /*#__PURE__*/ function(e) {
	return e.BrowserIncompatible = "browser-incompatible", e.Disconnected = "disconnected", e.InvalidID = "invalid-id", e.InvalidKey = "invalid-key", e.Network = "network", e.PeerUnavailable = "peer-unavailable", e.SslUnavailable = "ssl-unavailable", e.ServerError = "server-error", e.SocketError = "socket-error", e.SocketClosed = "socket-closed", e.UnavailableID = "unavailable-id", e.WebRTC = "webrtc", e;
}({}), co = /*#__PURE__*/ function(e) {
	return e.NegotiationFailed = "negotiation-failed", e.ConnectionClosed = "connection-closed", e;
}({}), lo = /*#__PURE__*/ function(e) {
	return e.NotOpenYet = "not-open-yet", e.MessageToBig = "message-too-big", e;
}({}), uo = /*#__PURE__*/ function(e) {
	return e.Binary = "binary", e.BinaryUTF8 = "binary-utf8", e.JSON = "json", e.None = "raw", e;
}({}), fo = /*#__PURE__*/ function(e) {
	return e.Message = "message", e.Disconnected = "disconnected", e.Error = "error", e.Close = "close", e;
}({}), $ = /*#__PURE__*/ function(e) {
	return e.Heartbeat = "HEARTBEAT", e.Candidate = "CANDIDATE", e.Offer = "OFFER", e.Answer = "ANSWER", e.Open = "OPEN", e.Error = "ERROR", e.IdTaken = "ID-TAKEN", e.InvalidKey = "INVALID-KEY", e.Leave = "LEAVE", e.Expire = "EXPIRE", e;
}({}), po = "1.5.5", mo = class extends eo.EventEmitter {
	constructor(e, t, n, r, i, a = 5e3) {
		super(), this.pingInterval = a, this._disconnected = !0, this._messagesQueue = [];
		let o = e ? "wss://" : "ws://";
		this._baseUrl = o + t + ":" + n + r + "peerjs?key=" + i;
	}
	start(e, t) {
		this._id = e;
		let n = `${this._baseUrl}&id=${e}&token=${t}`;
		!this._socket && this._disconnected && (this._socket = new WebSocket(n + "&version=1.5.5"), this._disconnected = !1, this._socket.onmessage = (e) => {
			let t;
			try {
				t = JSON.parse(e.data), Y.log("Server message received:", t);
			} catch {
				Y.log("Invalid server message", e.data);
				return;
			}
			this.emit(fo.Message, t);
		}, this._socket.onclose = (e) => {
			this._disconnected || (Y.log("Socket closed.", e), this._cleanup(), this._disconnected = !0, this.emit(fo.Disconnected));
		}, this._socket.onopen = () => {
			this._disconnected || (this._sendQueuedMessages(), Y.log("Socket open"), this._scheduleHeartbeat());
		});
	}
	_scheduleHeartbeat() {
		this._wsPingTimer = setTimeout(() => {
			this._sendHeartbeat();
		}, this.pingInterval);
	}
	_sendHeartbeat() {
		if (!this._wsOpen()) {
			Y.log("Cannot send heartbeat, because socket closed");
			return;
		}
		let e = JSON.stringify({ type: $.Heartbeat });
		this._socket.send(e), this._scheduleHeartbeat();
	}
	_wsOpen() {
		return !!this._socket && this._socket.readyState === 1;
	}
	_sendQueuedMessages() {
		let e = [...this._messagesQueue];
		this._messagesQueue = [];
		for (let t of e) this.send(t);
	}
	send(e) {
		if (this._disconnected) return;
		if (!this._id) {
			this._messagesQueue.push(e);
			return;
		}
		if (!e.type) {
			this.emit(fo.Error, "Invalid message");
			return;
		}
		if (!this._wsOpen()) return;
		let t = JSON.stringify(e);
		this._socket.send(t);
	}
	close() {
		this._disconnected ||= (this._cleanup(), !0);
	}
	_cleanup() {
		this._socket &&= (this._socket.onopen = this._socket.onmessage = this._socket.onclose = null, this._socket.close(), void 0), clearTimeout(this._wsPingTimer);
	}
}, ho = class {
	constructor(e) {
		this.connection = e;
	}
	startConnection(e) {
		let t = this._startPeerConnection();
		if (this.connection.peerConnection = t, this.connection.type === so.Media && e._stream && this._addTracksToConnection(e._stream, t), e.originator) {
			let n = this.connection, r = { ordered: !!e.reliable }, i = t.createDataChannel(n.label, r);
			n._initializeDataChannel(i), this._makeOffer();
		} else this.handleSDP("OFFER", e.sdp);
	}
	_startPeerConnection() {
		Y.log("Creating RTCPeerConnection.");
		let e = new RTCPeerConnection(this.connection.provider.options.config);
		return this._setupListeners(e), e;
	}
	_setupListeners(e) {
		let t = this.connection.peer, n = this.connection.connectionId, r = this.connection.type, i = this.connection.provider;
		Y.log("Listening for ICE candidates."), e.onicecandidate = (e) => {
			e.candidate && e.candidate.candidate && (Y.log(`Received ICE candidates for ${t}:`, e.candidate), i.socket.send({
				type: $.Candidate,
				payload: {
					candidate: e.candidate,
					type: r,
					connectionId: n
				},
				dst: t
			}));
		}, e.oniceconnectionstatechange = () => {
			switch (e.iceConnectionState) {
				case "failed":
					Y.log("iceConnectionState is failed, closing connections to " + t), this.connection.emitError(co.NegotiationFailed, "Negotiation of connection to " + t + " failed."), this.connection.close();
					break;
				case "closed":
					Y.log("iceConnectionState is closed, closing connections to " + t), this.connection.emitError(co.ConnectionClosed, "Connection to " + t + " closed."), this.connection.close();
					break;
				case "disconnected":
					Y.log("iceConnectionState changed to disconnected on the connection with " + t);
					break;
				case "completed": e.onicecandidate = () => {};
			}
			this.connection.emit("iceStateChanged", e.iceConnectionState);
		}, Y.log("Listening for data channel"), e.ondatachannel = (e) => {
			Y.log("Received data channel");
			let r = e.channel;
			i.getConnection(t, n)._initializeDataChannel(r);
		}, Y.log("Listening for remote stream"), e.ontrack = (e) => {
			Y.log("Received remote stream");
			let r = e.streams[0], a = i.getConnection(t, n);
			if (a.type === so.Media) {
				let e = a;
				this._addStreamToMediaConnection(r, e);
			}
		};
	}
	cleanup() {
		Y.log("Cleaning up PeerConnection to " + this.connection.peer);
		let e = this.connection.peerConnection;
		if (!e) return;
		this.connection.peerConnection = null, e.onicecandidate = e.oniceconnectionstatechange = e.ondatachannel = e.ontrack = () => {};
		let t = e.signalingState !== "closed", n = !1, r = this.connection.dataChannel;
		r && (n = !!r.readyState && r.readyState !== "closed"), (t || n) && e.close();
	}
	async _makeOffer() {
		let e = this.connection.peerConnection, t = this.connection.provider;
		try {
			let n = await e.createOffer(this.connection.options.constraints);
			Y.log("Created offer."), this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform == "function" && (n.sdp = this.connection.options.sdpTransform(n.sdp) || n.sdp);
			try {
				await e.setLocalDescription(n), Y.log("Set localDescription:", n, `for:${this.connection.peer}`);
				let r = {
					sdp: n,
					type: this.connection.type,
					connectionId: this.connection.connectionId,
					metadata: this.connection.metadata
				};
				if (this.connection.type === so.Data) {
					let e = this.connection;
					r = {
						...r,
						label: e.label,
						reliable: e.reliable,
						serialization: e.serialization
					};
				}
				t.socket.send({
					type: $.Offer,
					payload: r,
					dst: this.connection.peer
				});
			} catch (e) {
				e != "OperationError: Failed to set local offer sdp: Called in wrong state: kHaveRemoteOffer" && (t.emitError(Q.WebRTC, e), Y.log("Failed to setLocalDescription, ", e));
			}
		} catch (e) {
			t.emitError(Q.WebRTC, e), Y.log("Failed to createOffer, ", e);
		}
	}
	async _makeAnswer() {
		let e = this.connection.peerConnection, t = this.connection.provider;
		try {
			let n = await e.createAnswer();
			Y.log("Created answer."), this.connection.options.sdpTransform && typeof this.connection.options.sdpTransform == "function" && (n.sdp = this.connection.options.sdpTransform(n.sdp) || n.sdp);
			try {
				await e.setLocalDescription(n), Y.log("Set localDescription:", n, `for:${this.connection.peer}`), t.socket.send({
					type: $.Answer,
					payload: {
						sdp: n,
						type: this.connection.type,
						connectionId: this.connection.connectionId
					},
					dst: this.connection.peer
				});
			} catch (e) {
				t.emitError(Q.WebRTC, e), Y.log("Failed to setLocalDescription, ", e);
			}
		} catch (e) {
			t.emitError(Q.WebRTC, e), Y.log("Failed to create answer, ", e);
		}
	}
	async handleSDP(e, t) {
		t = new RTCSessionDescription(t);
		let n = this.connection.peerConnection, r = this.connection.provider;
		Y.log("Setting remote description", t);
		let i = this;
		try {
			await n.setRemoteDescription(t), Y.log(`Set remoteDescription:${e} for:${this.connection.peer}`), e === "OFFER" && await i._makeAnswer();
		} catch (e) {
			r.emitError(Q.WebRTC, e), Y.log("Failed to setRemoteDescription, ", e);
		}
	}
	async handleCandidate(e) {
		Y.log("handleCandidate:", e);
		try {
			await this.connection.peerConnection.addIceCandidate(e), Y.log(`Added ICE candidate for:${this.connection.peer}`);
		} catch (e) {
			this.connection.provider.emitError(Q.WebRTC, e), Y.log("Failed to handleCandidate, ", e);
		}
	}
	_addTracksToConnection(e, t) {
		if (Y.log(`add tracks from stream ${e.id} to peer connection`), !t.addTrack) return Y.error("Your browser does't support RTCPeerConnection#addTrack. Ignored.");
		e.getTracks().forEach((n) => {
			t.addTrack(n, e);
		});
	}
	_addStreamToMediaConnection(e, t) {
		Y.log(`add stream ${e.id} to media connection ${t.connectionId}`), t.addStream(e);
	}
}, go = class extends eo.EventEmitter {
	emitError(e, t) {
		Y.error("Error:", t), this.emit("error", new _o(`${e}`, t));
	}
}, _o = class extends Error {
	constructor(e, t) {
		typeof t == "string" ? super(t) : (super(), Object.assign(this, t)), this.type = e;
	}
}, vo = class extends go {
	get open() {
		return this._open;
	}
	constructor(e, t, n) {
		super(), this.peer = e, this.provider = t, this.options = n, this._open = !1, this.metadata = n.metadata;
	}
}, yo = class e extends vo {
	static #e = this.ID_PREFIX = "mc_";
	get type() {
		return so.Media;
	}
	get localStream() {
		return this._localStream;
	}
	get remoteStream() {
		return this._remoteStream;
	}
	constructor(t, n, r) {
		super(t, n, r), this._localStream = this.options._stream, this.connectionId = this.options.connectionId || e.ID_PREFIX + J.randomToken(), this._negotiator = new ho(this), this._localStream && this._negotiator.startConnection({
			_stream: this._localStream,
			originator: !0
		});
	}
	_initializeDataChannel(e) {
		this.dataChannel = e, this.dataChannel.onopen = () => {
			Y.log(`DC#${this.connectionId} dc connection success`), this.emit("willCloseOnRemote");
		}, this.dataChannel.onclose = () => {
			Y.log(`DC#${this.connectionId} dc closed for:`, this.peer), this.close();
		};
	}
	addStream(e) {
		Y.log("Receiving stream", e), this._remoteStream = e, super.emit("stream", e);
	}
	handleMessage(e) {
		let t = e.type, n = e.payload;
		switch (e.type) {
			case $.Answer:
				this._negotiator.handleSDP(t, n.sdp), this._open = !0;
				break;
			case $.Candidate:
				this._negotiator.handleCandidate(n.candidate);
				break;
			default: Y.warn(`Unrecognized message type:${t} from peer:${this.peer}`);
		}
	}
	answer(e, t = {}) {
		if (this._localStream) {
			Y.warn("Local stream already exists on this MediaConnection. Are you answering a call twice?");
			return;
		}
		this._localStream = e, t && t.sdpTransform && (this.options.sdpTransform = t.sdpTransform), this._negotiator.startConnection({
			...this.options._payload,
			_stream: e
		});
		let n = this.provider._getMessages(this.connectionId);
		for (let e of n) this.handleMessage(e);
		this._open = !0;
	}
	close() {
		this._negotiator &&= (this._negotiator.cleanup(), null), this._localStream = null, this._remoteStream = null, this.provider &&= (this.provider._removeConnection(this), null), this.options && this.options._stream && (this.options._stream = null), this.open && (this._open = !1, super.emit("close"));
	}
}, bo = class {
	constructor(e) {
		this._options = e;
	}
	_buildRequest(e) {
		let t = this._options.secure ? "https" : "http", { host: n, port: r, path: i, key: a } = this._options, o = new URL(`${t}://${n}:${r}${i}${a}/${e}`);
		return o.searchParams.set("ts", `${Date.now()}${Math.random()}`), o.searchParams.set("version", po), fetch(o.href, { referrerPolicy: this._options.referrerPolicy });
	}
	async retrieveId() {
		try {
			let e = await this._buildRequest("id");
			if (e.status !== 200) throw Error(`Error. Status:${e.status}`);
			return e.text();
		} catch (e) {
			Y.error("Error retrieving ID", e);
			let t = "";
			throw this._options.path === "/" && this._options.host !== J.CLOUD_HOST && (t = " If you passed in a `path` to your self-hosted PeerServer, you'll also need to pass in that same path when creating a new Peer."), Error("Could not get an ID from the server." + t);
		}
	}
	async listAllPeers() {
		try {
			let e = await this._buildRequest("peers");
			if (e.status !== 200) {
				if (e.status === 401) {
					let e = "";
					throw e = this._options.host === J.CLOUD_HOST ? "It looks like you're using the cloud server. You can email team@peerjs.com to enable peer listing for your API key." : "You need to enable `allow_discovery` on your self-hosted PeerServer to use this feature.", Error("It doesn't look like you have permission to list peers IDs. " + e);
				}
				throw Error(`Error. Status:${e.status}`);
			}
			return e.json();
		} catch (e) {
			throw Y.error("Error retrieving list peers", e), Error("Could not get list peers from the server." + e);
		}
	}
}, xo = class e extends vo {
	static #e = this.ID_PREFIX = "dc_";
	static #t = this.MAX_BUFFERED_AMOUNT = 8388608;
	get type() {
		return so.Data;
	}
	constructor(t, n, r) {
		super(t, n, r), this.connectionId = this.options.connectionId || e.ID_PREFIX + Za(), this.label = this.options.label || this.connectionId, this.reliable = !!this.options.reliable, this._negotiator = new ho(this), this._negotiator.startConnection(this.options._payload || {
			originator: !0,
			reliable: this.reliable
		});
	}
	_initializeDataChannel(e) {
		this.dataChannel = e, this.dataChannel.onopen = () => {
			Y.log(`DC#${this.connectionId} dc connection success`), this._open = !0, this.emit("open");
		}, this.dataChannel.onmessage = (e) => {
			Y.log(`DC#${this.connectionId} dc onmessage:`, e.data);
		}, this.dataChannel.onclose = () => {
			Y.log(`DC#${this.connectionId} dc closed for:`, this.peer), this.close();
		};
	}
	close(e) {
		if (e?.flush) {
			this.send({ __peerData: { type: "close" } });
			return;
		}
		this._negotiator &&= (this._negotiator.cleanup(), null), this.provider &&= (this.provider._removeConnection(this), null), this.dataChannel &&= (this.dataChannel.onopen = null, this.dataChannel.onmessage = null, this.dataChannel.onclose = null, null), this.open && (this._open = !1, super.emit("close"));
	}
	send(e, t = !1) {
		if (!this.open) {
			this.emitError(lo.NotOpenYet, "Connection is not open. You should listen for the `open` event before sending messages.");
			return;
		}
		return this._send(e, t);
	}
	async handleMessage(e) {
		let t = e.payload;
		switch (e.type) {
			case $.Answer:
				await this._negotiator.handleSDP(e.type, t.sdp);
				break;
			case $.Candidate:
				await this._negotiator.handleCandidate(t.candidate);
				break;
			default: Y.warn("Unrecognized message type:", e.type, "from peer:", this.peer);
		}
	}
}, So = class extends xo {
	get bufferSize() {
		return this._bufferSize;
	}
	_initializeDataChannel(e) {
		super._initializeDataChannel(e), this.dataChannel.binaryType = "arraybuffer", this.dataChannel.addEventListener("message", (e) => this._handleDataMessage(e));
	}
	_bufferedSend(e) {
		(this._buffering || !this._trySend(e)) && (this._buffer.push(e), this._bufferSize = this._buffer.length);
	}
	_trySend(e) {
		if (!this.open) return !1;
		if (this.dataChannel.bufferedAmount > xo.MAX_BUFFERED_AMOUNT) return this._buffering = !0, setTimeout(() => {
			this._buffering = !1, this._tryBuffer();
		}, 50), !1;
		try {
			this.dataChannel.send(e);
		} catch (e) {
			return Y.error(`DC#:${this.connectionId} Error when sending:`, e), this._buffering = !0, this.close(), !1;
		}
		return !0;
	}
	_tryBuffer() {
		if (!this.open || this._buffer.length === 0) return;
		let e = this._buffer[0];
		this._trySend(e) && (this._buffer.shift(), this._bufferSize = this._buffer.length, this._tryBuffer());
	}
	close(e) {
		if (e?.flush) {
			this.send({ __peerData: { type: "close" } });
			return;
		}
		this._buffer = [], this._bufferSize = 0, super.close();
	}
	constructor(...e) {
		super(...e), this._buffer = [], this._bufferSize = 0, this._buffering = !1;
	}
}, Co = class extends So {
	close(e) {
		super.close(e), this._chunkedData = {};
	}
	constructor(e, t, n) {
		super(e, t, n), this.chunker = new Ka(), this.serialization = uo.Binary, this._chunkedData = {};
	}
	_handleDataMessage({ data: e }) {
		let t = Pi(e), n = t.__peerData;
		if (n) {
			if (n.type === "close") {
				this.close();
				return;
			}
			this._handleChunk(t);
			return;
		}
		this.emit("data", t);
	}
	_handleChunk(e) {
		let t = e.__peerData, n = this._chunkedData[t] || {
			data: [],
			count: 0,
			total: e.total
		};
		if (n.data[e.n] = new Uint8Array(e.data), n.count++, this._chunkedData[t] = n, n.total === n.count) {
			delete this._chunkedData[t];
			let e = qa(n.data);
			this._handleDataMessage({ data: e });
		}
	}
	_send(e, t) {
		let n = Fi(e);
		if (n instanceof Promise) return this._send_blob(n);
		if (!t && n.byteLength > this.chunker.chunkedMTU) {
			this._sendChunks(n);
			return;
		}
		this._bufferedSend(n);
	}
	async _send_blob(e) {
		let t = await e;
		if (t.byteLength > this.chunker.chunkedMTU) {
			this._sendChunks(t);
			return;
		}
		this._bufferedSend(t);
	}
	_sendChunks(e) {
		let t = this.chunker.chunk(e);
		Y.log(`DC#${this.connectionId} Try to send ${t.length} chunks...`);
		for (let e of t) this.send(e, !0);
	}
}, wo = class extends So {
	_handleDataMessage({ data: e }) {
		super.emit("data", e);
	}
	_send(e, t) {
		this._bufferedSend(e);
	}
	constructor(...e) {
		super(...e), this.serialization = uo.None;
	}
}, To = class extends So {
	_handleDataMessage({ data: e }) {
		let t = this.parse(this.decoder.decode(e)), n = t.__peerData;
		if (n && n.type === "close") {
			this.close();
			return;
		}
		this.emit("data", t);
	}
	_send(e, t) {
		let n = this.encoder.encode(this.stringify(e));
		if (n.byteLength >= J.chunkedMTU) {
			this.emitError(lo.MessageToBig, "Message too big for JSON channel");
			return;
		}
		this._bufferedSend(n);
	}
	constructor(...e) {
		super(...e), this.serialization = uo.JSON, this.encoder = new TextEncoder(), this.decoder = new TextDecoder(), this.stringify = JSON.stringify, this.parse = JSON.parse;
	}
}, Eo = class e extends go {
	static #e = this.DEFAULT_KEY = "peerjs";
	get id() {
		return this._id;
	}
	get options() {
		return this._options;
	}
	get open() {
		return this._open;
	}
	get socket() {
		return this._socket;
	}
	get connections() {
		let e = Object.create(null);
		for (let [t, n] of this._connections) e[t] = n;
		return e;
	}
	get destroyed() {
		return this._destroyed;
	}
	get disconnected() {
		return this._disconnected;
	}
	constructor(t, n) {
		super(), this._serializers = {
			raw: wo,
			json: To,
			binary: Co,
			"binary-utf8": Co,
			default: Co
		}, this._id = null, this._lastServerId = null, this._destroyed = !1, this._disconnected = !1, this._open = !1, this._connections = /* @__PURE__ */ new Map(), this._lostMessages = /* @__PURE__ */ new Map();
		let r;
		if (t && t.constructor == Object ? n = t : t && (r = t.toString()), n = {
			debug: 0,
			host: J.CLOUD_HOST,
			port: J.CLOUD_PORT,
			path: "/",
			key: e.DEFAULT_KEY,
			token: J.randomToken(),
			config: J.defaultConfig,
			referrerPolicy: "strict-origin-when-cross-origin",
			serializers: {},
			...n
		}, this._options = n, this._serializers = {
			...this._serializers,
			...this.options.serializers
		}, this._options.host === "/" && (this._options.host = window.location.hostname), this._options.path && (this._options.path[0] !== "/" && (this._options.path = "/" + this._options.path), this._options.path[this._options.path.length - 1] !== "/" && (this._options.path += "/")), this._options.secure === void 0 && this._options.host !== J.CLOUD_HOST ? this._options.secure = J.isSecure() : this._options.host == J.CLOUD_HOST && (this._options.secure = !0), this._options.logFunction && Y.setLogFunction(this._options.logFunction), Y.logLevel = this._options.debug || 0, this._api = new bo(n), this._socket = this._createServerConnection(), !J.supports.audioVideo && !J.supports.data) {
			this._delayedAbort(Q.BrowserIncompatible, "The current browser does not support WebRTC");
			return;
		}
		if (r && !J.validateId(r)) {
			this._delayedAbort(Q.InvalidID, `ID "${r}" is invalid`);
			return;
		}
		r ? this._initialize(r) : this._api.retrieveId().then((e) => this._initialize(e)).catch((e) => this._abort(Q.ServerError, e));
	}
	_createServerConnection() {
		let e = new mo(this._options.secure, this._options.host, this._options.port, this._options.path, this._options.key, this._options.pingInterval);
		return e.on(fo.Message, (e) => {
			this._handleMessage(e);
		}), e.on(fo.Error, (e) => {
			this._abort(Q.SocketError, e);
		}), e.on(fo.Disconnected, () => {
			this.disconnected || (this.emitError(Q.Network, "Lost connection to server."), this.disconnect());
		}), e.on(fo.Close, () => {
			this.disconnected || this._abort(Q.SocketClosed, "Underlying socket is already closed.");
		}), e;
	}
	_initialize(e) {
		this._id = e, this.socket.start(e, this._options.token);
	}
	_handleMessage(e) {
		let t = e.type, n = e.payload, r = e.src;
		switch (t) {
			case $.Open:
				this._lastServerId = this.id, this._open = !0, this.emit("open", this.id);
				break;
			case $.Error:
				this._abort(Q.ServerError, n.msg);
				break;
			case $.IdTaken:
				this._abort(Q.UnavailableID, `ID "${this.id}" is taken`);
				break;
			case $.InvalidKey:
				this._abort(Q.InvalidKey, `API KEY "${this._options.key}" is invalid`);
				break;
			case $.Leave:
				Y.log(`Received leave message from ${r}`), this._cleanupPeer(r), this._connections.delete(r);
				break;
			case $.Expire:
				this.emitError(Q.PeerUnavailable, `Could not connect to peer ${r}`);
				break;
			case $.Offer: {
				let e = n.connectionId, t = this.getConnection(r, e);
				if (t && (t.close(), Y.warn(`Offer received for existing Connection ID:${e}`)), n.type === so.Media) {
					let i = new yo(r, this, {
						connectionId: e,
						_payload: n,
						metadata: n.metadata
					});
					t = i, this._addConnection(r, t), this.emit("call", i);
				} else if (n.type === so.Data) {
					let i = new this._serializers[n.serialization](r, this, {
						connectionId: e,
						_payload: n,
						metadata: n.metadata,
						label: n.label,
						serialization: n.serialization,
						reliable: n.reliable
					});
					t = i, this._addConnection(r, t), this.emit("connection", i);
				} else {
					Y.warn(`Received malformed connection type:${n.type}`);
					return;
				}
				let i = this._getMessages(e);
				for (let e of i) t.handleMessage(e);
				break;
			}
			default: {
				if (!n) {
					Y.warn(`You received a malformed message from ${r} of type ${t}`);
					return;
				}
				let i = n.connectionId, a = this.getConnection(r, i);
				a && a.peerConnection ? a.handleMessage(e) : i ? this._storeMessage(i, e) : Y.warn("You received an unrecognized message:", e);
				break;
			}
		}
	}
	_storeMessage(e, t) {
		this._lostMessages.has(e) || this._lostMessages.set(e, []), this._lostMessages.get(e).push(t);
	}
	_getMessages(e) {
		let t = this._lostMessages.get(e);
		return t ? (this._lostMessages.delete(e), t) : [];
	}
	connect(e, t = {}) {
		if (t = {
			serialization: "default",
			...t
		}, this.disconnected) {
			Y.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect, or call reconnect on this peer if you believe its ID to still be available."), this.emitError(Q.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
			return;
		}
		let n = new this._serializers[t.serialization](e, this, t);
		return this._addConnection(e, n), n;
	}
	call(e, t, n = {}) {
		if (this.disconnected) {
			Y.warn("You cannot connect to a new Peer because you called .disconnect() on this Peer and ended your connection with the server. You can create a new Peer to reconnect."), this.emitError(Q.Disconnected, "Cannot connect to new Peer after disconnecting from server.");
			return;
		}
		if (!t) {
			Y.error("To call a peer, you must provide a stream from your browser's `getUserMedia`.");
			return;
		}
		let r = new yo(e, this, {
			...n,
			_stream: t
		});
		return this._addConnection(e, r), r;
	}
	_addConnection(e, t) {
		Y.log(`add connection ${t.type}:${t.connectionId} to peerId:${e}`), this._connections.has(e) || this._connections.set(e, []), this._connections.get(e).push(t);
	}
	_removeConnection(e) {
		let t = this._connections.get(e.peer);
		if (t) {
			let n = t.indexOf(e);
			n !== -1 && t.splice(n, 1);
		}
		this._lostMessages.delete(e.connectionId);
	}
	getConnection(e, t) {
		let n = this._connections.get(e);
		if (!n) return null;
		for (let e of n) if (e.connectionId === t) return e;
		return null;
	}
	_delayedAbort(e, t) {
		setTimeout(() => {
			this._abort(e, t);
		}, 0);
	}
	_abort(e, t) {
		Y.error("Aborting!"), this.emitError(e, t), this._lastServerId ? this.disconnect() : this.destroy();
	}
	destroy() {
		this.destroyed || (Y.log(`Destroy peer with ID:${this.id}`), this.disconnect(), this._cleanup(), this._destroyed = !0, this.emit("close"));
	}
	_cleanup() {
		for (let e of this._connections.keys()) this._cleanupPeer(e), this._connections.delete(e);
		this.socket.removeAllListeners();
	}
	_cleanupPeer(e) {
		let t = this._connections.get(e);
		if (t) for (let e of t) e.close();
	}
	disconnect() {
		if (this.disconnected) return;
		let e = this.id;
		Y.log(`Disconnect peer with ID:${e}`), this._disconnected = !0, this._open = !1, this.socket.close(), this._lastServerId = e, this._id = null, this.emit("disconnected", e);
	}
	reconnect() {
		if (this.disconnected && !this.destroyed) Y.log(`Attempting reconnection to server with ID ${this._lastServerId}`), this._disconnected = !1, this._initialize(this._lastServerId);
		else if (this.destroyed) throw Error("This peer cannot reconnect to the server. It has already been destroyed.");
		else if (!this.disconnected && !this.open) Y.error("In a hurry? We're still trying to make the initial connection!");
		else throw Error(`Peer ${this.id} cannot reconnect because it is not disconnected from the server!`);
	}
	listAllPeers(e = (e) => {}) {
		this._api.listAllPeers().then((t) => e(t)).catch((e) => this._abort(Q.ServerError, e));
	}
}, Do = (e) => e === "X" ? "O" : "X";
function Oo(e, t) {
	let n = [...e].reduce((e, t) => e * 31 + t.charCodeAt(0) >>> 0, 0) % 2 == 0 ? "X" : "O";
	return t === "host" ? n : Do(n);
}
function ko() {
	return {
		mode: "local",
		localPlayer: null,
		phase: "idle",
		connected: !1,
		inviteUrl: "",
		error: "",
		audioEnabled: !1,
		remoteAudioEnabled: !1,
		audioConnected: !1,
		audioBusy: !1,
		audioError: "",
		networkOnline: typeof navigator > "u" || navigator.onLine
	};
}
var Ao = class {
	constructor(e) {
		this.callbacks = e, this.mode = "local", this.localPlayer = null, this.phase = "idle", this.connected = !1, this.inviteUrl = "", this.error = "", this.roomId = "", this.guestToken = "", this.peer = null, this.connection = null, this.reconnectTimer = null, this.reconnectEnabled = !0, this.localStream = null, this.remoteAudioReady = !1, this.call = null, this.audioConnected = !1, this.audioBusy = !1, this.audioError = "";
	}
	snapshot() {
		return {
			mode: this.mode,
			localPlayer: this.localPlayer,
			phase: this.phase,
			connected: this.connected,
			inviteUrl: this.inviteUrl,
			error: this.error,
			audioEnabled: !!this.localStream,
			remoteAudioEnabled: this.remoteAudioReady,
			audioConnected: this.audioConnected,
			audioBusy: this.audioBusy,
			audioError: this.audioError,
			networkOnline: navigator.onLine
		};
	}
	emit() {
		this.callbacks.onChange(this.snapshot());
	}
	host(e, t, n) {
		this.configure("host", Oo(e, "host"), e, t, n), this.validateMatch() && this.startHostPeer();
	}
	join(e, t) {
		this.configure("guest", Oo(e, "guest"), e, t, ""), this.validateMatch() && this.startGuestPeer();
	}
	configure(e, t, n, r, i) {
		this.stopCurrentSession(), this.mode = e, this.localPlayer = t, this.phase = e === "host" ? "creating" : "connecting", this.connected = !1, this.inviteUrl = i, this.error = "", this.roomId = n, this.guestToken = r, this.reconnectEnabled = !0, this.audioError = "", this.emit();
	}
	validateMatch() {
		return Di(this.roomId) && Di(this.guestToken) ? !0 : (this.reconnectEnabled = !1, this.showError("Линкът за двубоя е невалиден."), !1);
	}
	leave() {
		this.stopCurrentSession(), this.mode = "local", this.localPlayer = null, this.phase = "idle", this.connected = !1, this.inviteUrl = "", this.error = "", this.roomId = "", this.guestToken = "", this.reconnectEnabled = !0, this.audioError = "", this.emit();
	}
	destroy() {
		this.stopCurrentSession();
	}
	stopCurrentSession() {
		let e = this.peer, t = this.call, n = this.localStream;
		this.peer = null, this.connection = null, this.call = null, this.localStream = null, this.remoteAudioReady = !1, this.audioConnected = !1, this.audioBusy = !1, this.clearReconnectTimer(), t && t.close(), n && n.getTracks().forEach((e) => e.stop()), e && !e.destroyed && e.destroy();
		let r = this.callbacks.getRemoteAudio();
		r && (r.srcObject = null);
	}
	send(e) {
		if (!this.connection?.open) return !1;
		try {
			return this.connection.send(e), !0;
		} catch {
			return !1;
		}
	}
	broadcastState() {
		this.mode === "host" && this.send({
			type: "state",
			state: this.callbacks.getGameState()
		});
	}
	closeAudioCall() {
		let e = this.call;
		this.call = null, this.audioConnected = !1;
		let t = this.callbacks.getRemoteAudio();
		t && (t.srcObject = null), e && e.close();
	}
	attachAudioCall(e) {
		this.closeAudioCall(), this.call = e, e.on("stream", (t) => {
			if (this.call !== e) return;
			let n = this.callbacks.getRemoteAudio();
			n && (n.srcObject = t, this.audioConnected = !0, this.audioError = "", n.play().catch(() => {
				this.audioError = "Докосни страницата, за да чуеш другия играч.", this.emit();
			}), this.emit());
		});
		let t = () => {
			if (this.call !== e) return;
			this.call = null, this.audioConnected = !1;
			let t = this.callbacks.getRemoteAudio();
			t && (t.srcObject = null), this.emit();
		};
		e.on("close", t), e.on("error", t);
	}
	handleIncomingCall = (e) => {
		let t = this.connection?.peer;
		if (this.mode !== "guest" || !this.localStream || e.peer !== t) {
			e.close();
			return;
		}
		e.answer(this.localStream), this.attachAudioCall(e);
	};
	maybeStartAudioCall() {
		this.mode === "host" && this.connected && this.localStream && this.remoteAudioReady && !this.call && this.attachAudioCall(this.peer.call(this.connection.peer, this.localStream));
	}
	async toggleAudio() {
		if (this.connected) {
			if (this.localStream) {
				this.localStream.getTracks().forEach((e) => e.stop()), this.localStream = null, this.audioError = "", this.send({ type: "audio-off" }), this.closeAudioCall(), this.emit();
				return;
			}
			this.audioBusy = !0, this.audioError = "", this.emit();
			try {
				let e = await navigator.mediaDevices.getUserMedia({ audio: {
					echoCancellation: !0,
					noiseSuppression: !0,
					autoGainControl: !0
				} });
				if (!this.connected) {
					e.getTracks().forEach((e) => e.stop());
					return;
				}
				this.localStream = e, this.send({ type: "audio-ready" }), this.maybeStartAudioCall();
			} catch {
				this.audioError = "Разреши достъп до микрофона и опитай отново.";
			} finally {
				this.audioBusy = !1, this.emit();
			}
		}
	}
	handleConnectionData(e) {
		if (e && typeof e == "object") {
			if (e.type === "audio-ready") {
				this.remoteAudioReady = !0, this.maybeStartAudioCall(), this.emit();
				return;
			}
			if (e.type === "audio-off") {
				this.remoteAudioReady = !1, this.closeAudioCall(), this.emit();
				return;
			}
			if (this.mode === "host") {
				if (e.type === "move") this.callbacks.onMove(e.index, Do(this.localPlayer));
				else if (e.type === "new-round") this.callbacks.onNewRound();
				else if (e.type === "reset-score") this.callbacks.onResetScore();
				else return;
				this.broadcastState();
			} else e.type === "state" ? this.callbacks.onState(e.state) : e.type === "full" ? (this.reconnectEnabled = !1, this.showError("В този двубой вече има двама играчи.")) : e.type === "replaced" && (this.reconnectEnabled = !1, this.localStream &&= (this.localStream.getTracks().forEach((e) => e.stop()), null), this.closeAudioCall(), this.showError("Двубоят продължава в другия браузър."));
		}
	}
	attachConnection(e) {
		this.connection = e, this.connected = !1, this.remoteAudioReady = !1, this.closeAudioCall(), e.on("open", () => {
			this.connection === e && (this.clearReconnectTimer(), this.connected = !0, this.phase = "connected", this.error = "", this.audioError = "", this.emit(), this.broadcastState(), this.localStream && this.send({ type: "audio-ready" }), this.maybeStartAudioCall());
		}), e.on("data", (t) => {
			this.connection === e && this.handleConnectionData(t);
		}), e.on("close", () => this.handleConnectionEnd(e)), e.on("error", () => this.handleConnectionEnd(e));
	}
	handleConnectionEnd(e) {
		if (this.connection === e) {
			if (this.connection = null, this.connected = !1, this.remoteAudioReady = !1, this.closeAudioCall(), this.mode === "host") this.phase = navigator.onLine ? "waiting" : "reconnecting", this.error = "", !this.peer || this.peer.destroyed ? this.scheduleHostReconnect(0) : this.peer.disconnected && this.reconnectSignaling(this.peer);
			else if (this.mode === "guest") {
				if (this.reconnectEnabled) {
					this.scheduleGuestReconnect();
					return;
				}
				this.phase = "error", this.error ||= "Другият играч прекъсна връзката.";
			}
			this.emit();
		}
	}
	rejectConnection(e) {
		e.on("open", () => {
			e.send({ type: "full" }), window.setTimeout(() => e.close(), 150);
		});
	}
	handleHostConnection(e) {
		if (e.metadata?.playerToken !== this.guestToken) {
			this.rejectConnection(e);
			return;
		}
		if (this.connection) {
			let e = this.connection;
			if (e.open) {
				try {
					e.send({ type: "replaced" });
				} catch {}
				window.setTimeout(() => e.close(), 250);
			} else e.close();
			this.connection = null, this.connected = !1, this.remoteAudioReady = !1, this.closeAudioCall();
		}
		this.phase = "waiting", this.attachConnection(e), this.emit();
	}
	showError(e) {
		this.clearReconnectTimer(), this.connected = !1, this.phase = "error", this.error = e, this.emit();
	}
	clearReconnectTimer() {
		this.reconnectTimer &&= (window.clearTimeout(this.reconnectTimer), null);
	}
	reconnectSignaling(e) {
		window.setTimeout(() => {
			if (this.peer === e && !e.destroyed && e.disconnected) try {
				e.reconnect();
			} catch {
				if (this.connected) return;
				this.mode === "host" ? this.scheduleHostReconnect() : this.mode === "guest" && this.scheduleGuestReconnect();
			}
		}, 1e3);
	}
	scheduleHostReconnect(e = 1500) {
		this.mode !== "host" || this.connected || this.reconnectTimer || (this.phase = this.inviteUrl ? "reconnecting" : "creating", this.emit(), this.reconnectTimer = window.setTimeout(() => {
			this.reconnectTimer = null, this.startHostPeer();
		}, e));
	}
	scheduleGuestReconnect(e = 1500) {
		this.mode !== "guest" || this.connected || !this.reconnectEnabled || this.reconnectTimer || (this.phase = "reconnecting", this.error = "", this.emit(), this.reconnectTimer = window.setTimeout(() => {
			this.reconnectTimer = null, this.startGuestPeer();
		}, e));
	}
	replaceCurrentPeer(e) {
		let t = this.peer;
		this.peer = e, t && t !== e && !t.destroyed && t.destroy();
	}
	startHostPeer() {
		if (this.mode !== "host" || this.connected) return;
		if (!navigator.onLine) {
			this.scheduleHostReconnect();
			return;
		}
		let e = new Eo(this.roomId);
		this.replaceCurrentPeer(e), e.on("open", () => {
			this.peer === e && (this.clearReconnectTimer(), this.phase = this.connected ? "connected" : "waiting", this.emit());
		}), e.on("connection", (t) => {
			if (this.peer !== e) return t.close();
			this.handleHostConnection(t);
		}), e.on("call", this.handleIncomingCall), e.on("disconnected", () => this.reconnectSignaling(e)), e.on("close", () => {
			this.peer === e && !this.connected && this.scheduleHostReconnect();
		}), e.on("error", () => {
			this.peer === e && !this.connected && this.scheduleHostReconnect();
		});
	}
	startGuestPeer() {
		if (this.mode !== "guest" || this.connected || !this.reconnectEnabled) return;
		if (!navigator.onLine) {
			this.scheduleGuestReconnect();
			return;
		}
		let e = new Eo();
		this.replaceCurrentPeer(e), e.on("open", () => {
			this.peer !== e || this.connected || this.attachConnection(e.connect(this.roomId, {
				reliable: !0,
				metadata: { playerToken: this.guestToken }
			}));
		}), e.on("connection", (e) => e.close()), e.on("call", this.handleIncomingCall), e.on("disconnected", () => this.reconnectSignaling(e)), e.on("close", () => {
			this.peer === e && !this.connected && this.scheduleGuestReconnect();
		}), e.on("error", () => {
			this.peer === e && !this.connected && this.scheduleGuestReconnect();
		});
	}
	handleOnline() {
		this.mode === "host" && !this.connected ? (this.clearReconnectTimer(), this.peer?.disconnected && !this.peer.destroyed ? this.reconnectSignaling(this.peer) : !this.peer || this.peer.destroyed ? this.scheduleHostReconnect(0) : (this.phase = "waiting", this.emit())) : this.mode === "guest" && !this.connected && this.reconnectEnabled ? (this.clearReconnectTimer(), this.scheduleGuestReconnect(0)) : this.emit();
	}
	handleOffline() {
		if (this.mode === "local") return this.emit();
		this.connection ? this.connection.close() : (this.connected = !1, this.phase = "reconnecting", this.closeAudioCall(), this.emit());
	}
}, jo = /* @__PURE__ */ gr("<main class=\"game-shell\"><!> <!> <!></main> <div class=\"background-shape shape-one\" aria-hidden=\"true\"></div> <div class=\"background-shape shape-two\" aria-hidden=\"true\"></div> <audio id=\"remote-audio\" autoplay=\"\" playsinline=\"\"></audio>", 1);
function Mo(e, t) {
	Je(t, !0);
	let n = /* @__PURE__ */ N(Kt(ni())), r = /* @__PURE__ */ N(Kt(ko())), i = /* @__PURE__ */ N(!1), a = /* @__PURE__ */ N(void 0), o, s = /* @__PURE__ */ pt(() => K(r).mode !== "local" && !K(r).connected), c = /* @__PURE__ */ pt(() => !K(n).gameOver && (K(r).mode === "local" || K(r).connected && K(n).currentPlayer === K(r).localPlayer && !K(i)));
	function l(e) {
		return crypto.randomUUID ? `${e}${crypto.randomUUID()}` : `${e}${[...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("")}`;
	}
	function u(e, t = !0) {
		P(n, e(K(n)), !0), P(i, !1), t && o?.broadcastState();
	}
	function d(e) {
		if (K(r).mode === "local") P(n, ii(K(n), e, K(n).currentPlayer), !0);
		else if (K(c)) K(r).mode === "host" ? u((t) => ii(t, e, K(r).localPlayer)) : o.send({
			type: "move",
			index: e
		}) && P(i, !0);
		else return;
	}
	function f() {
		K(r).mode === "guest" ? o.send({ type: "new-round" }) : u(ai, K(r).mode === "host");
	}
	function p() {
		K(r).mode === "guest" ? o.send({ type: "reset-score" }) : u(oi, K(r).mode === "host");
	}
	function m(e, t) {
		if (P(n, ni(), !0), P(i, !1), !Di(e) || !Di(t)) {
			o.host(e, t, "");
			return;
		}
		let { hostUrl: r, inviteUrl: a } = Oi(window.location.href, {
			roomId: e,
			guestToken: t
		});
		window.history.replaceState({}, "", Ai(r)), o.host(e, t, a);
	}
	function h() {
		m(l("ttt-"), l("p-"));
	}
	function g(e, t) {
		if (P(n, ni(), !0), P(i, !1), Di(e) && Di(t)) {
			let { inviteUrl: n } = Oi(window.location.href, {
				roomId: e,
				guestToken: t
			});
			window.history.replaceState({}, "", Ai(n));
		}
		o.join(e, t);
	}
	function _() {
		o.leave(), P(n, ni(), !0), P(i, !1), window.history.replaceState({}, "", ji(window.location.href));
	}
	async function v() {
		try {
			return navigator.share ? (await navigator.share({
				title: "Морски шах",
				text: "Играй морски шах с мен!",
				url: K(r).inviteUrl
			}), "Линкът е споделен ✓") : (await y(), "Линкът е копиран ✓");
		} catch (e) {
			return e.name === "AbortError" ? "Сподели линка" : "Неуспешно — опитай пак";
		}
	}
	async function y() {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(K(r).inviteUrl);
			return;
		}
		let e = document.createElement("textarea");
		e.value = K(r).inviteUrl, e.style.position = "fixed", e.style.opacity = "0", document.body.append(e), e.select();
		let t = document.execCommand("copy");
		if (e.remove(), !t) throw Error("Copy failed");
	}
	$r(() => {
		o = new Ao({
			getRemoteAudio: () => K(a),
			getGameState: () => si(K(n)),
			onChange: (e) => {
				P(r, e, !0), e.connected || P(i, !1);
			},
			onState: (e) => {
				let t = ci(e);
				t && (P(n, t, !0), P(i, !1));
			},
			onMove: (e, t) => u((n) => ii(n, e, t), !1),
			onNewRound: () => u(ai, !1),
			onResetScore: () => u(oi, !1)
		});
		let e = ki(window.location.search);
		e?.valid && e.role === "host" ? m(e.roomId, e.guestToken) : e?.valid ? g(e.roomId, e.guestToken) : e && g(e.roomId, null);
		let t = () => o.handleOnline(), s = () => o.handleOffline();
		return window.addEventListener("online", t), window.addEventListener("offline", s), () => {
			window.removeEventListener("online", t), window.removeEventListener("offline", s), o.destroy();
		};
	});
	var b = jo(), x = en(b), S = I(x);
	wi(S, {
		get game() {
			return K(n);
		},
		get online() {
			return K(r);
		},
		get waiting() {
			return K(s);
		},
		onReset: p,
		onAudio: () => o.toggleAudio()
	});
	var ee = L(S, 2);
	_i(ee, {
		get online() {
			return K(r);
		},
		onCreate: h,
		onShare: v,
		onLeave: _
	}), fi(L(ee, 2), {
		get game() {
			return K(n);
		},
		get online() {
			return K(r);
		},
		get canMove() {
			return K(c);
		},
		get waiting() {
			return K(s);
		},
		onPlay: d,
		onNewRound: f
	}), k(x), Qr(L(x, 6), (e) => P(a, e), () => K(a)), q(e, b), Ye();
}
//#endregion
//#region src/main.js
Tr(Mo, { target: document.querySelector("#app") });
//#endregion
