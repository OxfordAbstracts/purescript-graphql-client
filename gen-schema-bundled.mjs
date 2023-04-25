// output/Control.Promise/foreign.js
function promise(f) {
  return function() {
    return new Promise(function(success, error2) {
      var succF = function(s) {
        return function() {
          return success(s);
        };
      };
      var failF = function(s) {
        return function() {
          return error2(s);
        };
      };
      try {
        f(succF)(failF)();
      } catch (e) {
        error2(e);
      }
    });
  };
}
function thenImpl(promise2) {
  return function(errCB) {
    return function(succCB) {
      return function() {
        promise2.then(succCB, errCB);
      };
    };
  };
}

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
      };
    };
  }
};
var compose = function(dict) {
  return dict.compose;
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;

// output/Data.Function/index.js
var on = function(f) {
  return function(g) {
    return function(x) {
      return function(y) {
        return f(g(x))(g(y));
      };
    };
  };
};
var flip = function(f) {
  return function(b) {
    return function(a) {
      return f(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};
var applyFlipped = function(x) {
  return function(f) {
    return f(x);
  };
};

// output/Data.Unit/foreign.js
var unit = void 0;

// output/Type.Proxy/index.js
var $$Proxy = /* @__PURE__ */ function() {
  function $$Proxy2() {
  }
  ;
  $$Proxy2.value = new $$Proxy2();
  return $$Proxy2;
}();

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var mapFlipped = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return function(fa) {
    return function(f) {
      return map110(f)(fa);
    };
  };
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var voidRight = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return function(x) {
    return map110($$const(x));
  };
};
var functorFn = {
  map: /* @__PURE__ */ compose(semigroupoidFn)
};
var functorArray = {
  map: arrayMap
};

// output/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output/Data.Symbol/index.js
var reflectSymbol = function(dict) {
  return dict.reflectSymbol;
};

// output/Record.Unsafe/foreign.js
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};
var unsafeSet = function(label) {
  return function(value) {
    return function(rec) {
      var copy = {};
      for (var key in rec) {
        if ({}.hasOwnProperty.call(rec, key)) {
          copy[key] = rec[key];
        }
      }
      copy[label] = value;
      return copy;
    };
  };
};

// output/Data.Semigroup/index.js
var semigroupString = {
  append: concatString
};
var semigroupRecordNil = {
  appendRecord: function(v) {
    return function(v1) {
      return function(v2) {
        return {};
      };
    };
  }
};
var semigroupArray = {
  append: concatArray
};
var appendRecord = function(dict) {
  return dict.appendRecord;
};
var semigroupRecord = function() {
  return function(dictSemigroupRecord) {
    return {
      append: appendRecord(dictSemigroupRecord)($$Proxy.value)
    };
  };
};
var append = function(dict) {
  return dict.append;
};
var semigroupFn = function(dictSemigroup) {
  var append14 = append(dictSemigroup);
  return {
    append: function(f) {
      return function(g) {
        return function(x) {
          return append14(f(x))(g(x));
        };
      };
    }
  };
};
var semigroupRecordCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function(dictSemigroupRecord) {
      var appendRecord1 = appendRecord(dictSemigroupRecord);
      return function(dictSemigroup) {
        var append14 = append(dictSemigroup);
        return {
          appendRecord: function(v) {
            return function(ra) {
              return function(rb) {
                var tail2 = appendRecord1($$Proxy.value)(ra)(rb);
                var key = reflectSymbol2($$Proxy.value);
                var insert5 = unsafeSet(key);
                var get3 = unsafeGet(key);
                return insert5(append14(get3(ra))(get3(rb)))(tail2);
              };
            };
          }
        };
      };
    };
  };
};

// output/Control.Alt/index.js
var alt = function(dict) {
  return dict.alt;
};

// output/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output/Control.Apply/foreign.js
var arrayApply = function(fs) {
  return function(xs) {
    var l = fs.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i = 0; i < l; i++) {
      var f = fs[i];
      for (var j = 0; j < k; j++) {
        result[n++] = f(xs[j]);
      }
    }
    return result;
  };
};

// output/Control.Apply/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var applyArray = {
  apply: arrayApply,
  Functor0: function() {
    return functorArray;
  }
};
var apply = function(dict) {
  return dict.apply;
};
var applySecond = function(dictApply) {
  var apply1 = apply(dictApply);
  var map20 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map20($$const(identity2))(a))(b);
    };
  };
};
var lift2 = function(dictApply) {
  var apply1 = apply(dictApply);
  var map20 = map(dictApply.Functor0());
  return function(f) {
    return function(a) {
      return function(b) {
        return apply1(map20(f)(a))(b);
      };
    };
  };
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var when = function(dictApplicative) {
  var pure12 = pure(dictApplicative);
  return function(v) {
    return function(v1) {
      if (v) {
        return v1;
      }
      ;
      if (!v) {
        return pure12(unit);
      }
      ;
      throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
    };
  };
};
var liftA1 = function(dictApplicative) {
  var apply3 = apply(dictApplicative.Apply0());
  var pure12 = pure(dictApplicative);
  return function(f) {
    return function(a) {
      return apply3(pure12(f))(a);
    };
  };
};

// output/Control.Bind/index.js
var discard = function(dict) {
  return dict.discard;
};
var bindArray = {
  bind: arrayBind,
  Apply0: function() {
    return applyArray;
  }
};
var bind = function(dict) {
  return dict.bind;
};
var bindFlipped = function(dictBind) {
  return flip(bind(dictBind));
};
var composeKleisliFlipped = function(dictBind) {
  var bindFlipped1 = bindFlipped(dictBind);
  return function(f) {
    return function(g) {
      return function(a) {
        return bindFlipped1(f)(g(a));
      };
    };
  };
};
var composeKleisli = function(dictBind) {
  var bind13 = bind(dictBind);
  return function(f) {
    return function(g) {
      return function(a) {
        return bind13(f(a))(g);
      };
    };
  };
};
var discardUnit = {
  discard: function(dictBind) {
    return bind(dictBind);
  }
};

// output/Data.Bounded/foreign.js
var topInt = 2147483647;
var bottomInt = -2147483648;
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq4) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq4 : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;
var ordStringImpl = unsafeCompareImpl;
var ordCharImpl = unsafeCompareImpl;

// output/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqBooleanImpl = refEq;
var eqIntImpl = refEq;
var eqCharImpl = refEq;
var eqStringImpl = refEq;

// output/Data.Eq/index.js
var eqString = {
  eq: eqStringImpl
};
var eqInt = {
  eq: eqIntImpl
};
var eqChar = {
  eq: eqCharImpl
};
var eqBoolean = {
  eq: eqBooleanImpl
};
var eq = function(dict) {
  return dict.eq;
};
var eq2 = /* @__PURE__ */ eq(eqBoolean);
var notEq = function(dictEq) {
  var eq32 = eq(dictEq);
  return function(x) {
    return function(y) {
      return eq2(eq32(x)(y))(false);
    };
  };
};

// output/Data.Ordering/index.js
var LT = /* @__PURE__ */ function() {
  function LT2() {
  }
  ;
  LT2.value = new LT2();
  return LT2;
}();
var GT = /* @__PURE__ */ function() {
  function GT2() {
  }
  ;
  GT2.value = new GT2();
  return GT2;
}();
var EQ = /* @__PURE__ */ function() {
  function EQ2() {
  }
  ;
  EQ2.value = new EQ2();
  return EQ2;
}();
var eqOrdering = {
  eq: function(v) {
    return function(v1) {
      if (v instanceof LT && v1 instanceof LT) {
        return true;
      }
      ;
      if (v instanceof GT && v1 instanceof GT) {
        return true;
      }
      ;
      if (v instanceof EQ && v1 instanceof EQ) {
        return true;
      }
      ;
      return false;
    };
  }
};

// output/Data.Ring/foreign.js
var intSub = function(x) {
  return function(y) {
    return x - y | 0;
  };
};

// output/Data.Semiring/foreign.js
var intAdd = function(x) {
  return function(y) {
    return x + y | 0;
  };
};
var intMul = function(x) {
  return function(y) {
    return x * y | 0;
  };
};

// output/Data.Semiring/index.js
var semiringInt = {
  add: intAdd,
  zero: 0,
  mul: intMul,
  one: 1
};

// output/Data.Ring/index.js
var ringInt = {
  sub: intSub,
  Semiring0: function() {
    return semiringInt;
  }
};

// output/Data.Ord/index.js
var ordString = /* @__PURE__ */ function() {
  return {
    compare: ordStringImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqString;
    }
  };
}();
var ordInt = /* @__PURE__ */ function() {
  return {
    compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqInt;
    }
  };
}();
var ordChar = /* @__PURE__ */ function() {
  return {
    compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqChar;
    }
  };
}();
var compare = function(dict) {
  return dict.compare;
};
var comparing = function(dictOrd) {
  var compare32 = compare(dictOrd);
  return function(f) {
    return function(x) {
      return function(y) {
        return compare32(f(x))(f(y));
      };
    };
  };
};

// output/Data.Bounded/index.js
var top = function(dict) {
  return dict.top;
};
var boundedInt = {
  top: topInt,
  bottom: bottomInt,
  Ord0: function() {
    return ordInt;
  }
};
var boundedChar = {
  top: topChar,
  bottom: bottomChar,
  Ord0: function() {
    return ordChar;
  }
};
var bottom = function(dict) {
  return dict.bottom;
};

// output/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};
var showStringImpl = function(s) {
  var l = s.length;
  return '"' + s.replace(
    /[\0-\x1F\x7F"\\]/g,
    function(c, i) {
      switch (c) {
        case '"':
        case "\\":
          return "\\" + c;
        case "\x07":
          return "\\a";
        case "\b":
          return "\\b";
        case "\f":
          return "\\f";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case "	":
          return "\\t";
        case "\v":
          return "\\v";
      }
      var k = i + 1;
      var empty4 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
      return "\\" + c.charCodeAt(0).toString(10) + empty4;
    }
  ) + '"';
};

// output/Data.Show/index.js
var showString = {
  show: showStringImpl
};
var showInt = {
  show: showIntImpl
};
var show = function(dict) {
  return dict.show;
};

// output/Data.Maybe/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {
  }
  ;
  Nothing2.value = new Nothing2();
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  ;
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();
var maybe$prime = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v(unit);
      }
      ;
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 250, column 1 - line 250, column 62): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var maybe = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v;
      }
      ;
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
var functorMaybe = {
  map: function(v) {
    return function(v1) {
      if (v1 instanceof Just) {
        return new Just(v(v1.value0));
      }
      ;
      return Nothing.value;
    };
  }
};
var map2 = /* @__PURE__ */ map(functorMaybe);
var fromMaybe$prime = function(a) {
  return maybe$prime(a)(identity3);
};
var fromMaybe = function(a) {
  return maybe(a)(identity3);
};
var fromJust = function() {
  return function(v) {
    if (v instanceof Just) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
  };
};
var applyMaybe = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return map2(v.value0)(v1);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};
var bindMaybe = {
  bind: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return v1(v.value0);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Apply0: function() {
    return applyMaybe;
  }
};

// output/Data.Either/index.js
var Left = /* @__PURE__ */ function() {
  function Left2(value0) {
    this.value0 = value0;
  }
  ;
  Left2.create = function(value0) {
    return new Left2(value0);
  };
  return Left2;
}();
var Right = /* @__PURE__ */ function() {
  function Right2(value0) {
    this.value0 = value0;
  }
  ;
  Right2.create = function(value0) {
    return new Right2(value0);
  };
  return Right2;
}();
var note = function(a) {
  return maybe(new Left(a))(Right.create);
};
var functorEither = {
  map: function(f) {
    return function(m) {
      if (m instanceof Left) {
        return new Left(m.value0);
      }
      ;
      if (m instanceof Right) {
        return new Right(f(m.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
    };
  }
};
var map3 = /* @__PURE__ */ map(functorEither);
var either = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Left) {
        return v(v2.value0);
      }
      ;
      if (v2 instanceof Right) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var hush = /* @__PURE__ */ function() {
  return either($$const(Nothing.value))(Just.create);
}();
var applyEither = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Left) {
        return new Left(v.value0);
      }
      ;
      if (v instanceof Right) {
        return map3(v.value0)(v1);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorEither;
  }
};
var apply2 = /* @__PURE__ */ apply(applyEither);
var bindEither = {
  bind: /* @__PURE__ */ either(function(e) {
    return function(v) {
      return new Left(e);
    };
  })(function(a) {
    return function(f) {
      return f(a);
    };
  }),
  Apply0: function() {
    return applyEither;
  }
};
var semigroupEither = function(dictSemigroup) {
  var append14 = append(dictSemigroup);
  return {
    append: function(x) {
      return function(y) {
        return apply2(map3(append14)(x))(y);
      };
    }
  };
};
var applicativeEither = /* @__PURE__ */ function() {
  return {
    pure: Right.create,
    Apply0: function() {
      return applyEither;
    }
  };
}();

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind6 = bind(dictMonad.Bind1());
  var pure6 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind6(f)(function(f$prime) {
        return bind6(a)(function(a$prime) {
          return pure6(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Data.EuclideanRing/foreign.js
var intDegree = function(x) {
  return Math.min(Math.abs(x), 2147483647);
};
var intDiv = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
  };
};
var intMod = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
  };
};

// output/Data.CommutativeRing/index.js
var commutativeRingInt = {
  Ring0: function() {
    return ringInt;
  }
};

// output/Data.EuclideanRing/index.js
var mod = function(dict) {
  return dict.mod;
};
var euclideanRingInt = {
  degree: intDegree,
  div: intDiv,
  mod: intMod,
  CommutativeRing0: function() {
    return commutativeRingInt;
  }
};
var div = function(dict) {
  return dict.div;
};

// output/Data.Monoid/index.js
var semigroupRecord2 = /* @__PURE__ */ semigroupRecord();
var monoidString = {
  mempty: "",
  Semigroup0: function() {
    return semigroupString;
  }
};
var monoidRecordNil = {
  memptyRecord: function(v) {
    return {};
  },
  SemigroupRecord0: function() {
    return semigroupRecordNil;
  }
};
var monoidArray = {
  mempty: [],
  Semigroup0: function() {
    return semigroupArray;
  }
};
var memptyRecord = function(dict) {
  return dict.memptyRecord;
};
var monoidRecord = function() {
  return function(dictMonoidRecord) {
    var semigroupRecord1 = semigroupRecord2(dictMonoidRecord.SemigroupRecord0());
    return {
      mempty: memptyRecord(dictMonoidRecord)($$Proxy.value),
      Semigroup0: function() {
        return semigroupRecord1;
      }
    };
  };
};
var mempty = function(dict) {
  return dict.mempty;
};
var monoidFn = function(dictMonoid) {
  var mempty12 = mempty(dictMonoid);
  var semigroupFn2 = semigroupFn(dictMonoid.Semigroup0());
  return {
    mempty: function(v) {
      return mempty12;
    },
    Semigroup0: function() {
      return semigroupFn2;
    }
  };
};
var monoidRecordCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  var semigroupRecordCons2 = semigroupRecordCons(dictIsSymbol)();
  return function(dictMonoid) {
    var mempty12 = mempty(dictMonoid);
    var Semigroup0 = dictMonoid.Semigroup0();
    return function() {
      return function(dictMonoidRecord) {
        var memptyRecord1 = memptyRecord(dictMonoidRecord);
        var semigroupRecordCons1 = semigroupRecordCons2(dictMonoidRecord.SemigroupRecord0())(Semigroup0);
        return {
          memptyRecord: function(v) {
            var tail2 = memptyRecord1($$Proxy.value);
            var key = reflectSymbol2($$Proxy.value);
            var insert5 = unsafeSet(key);
            return insert5(mempty12)(tail2);
          },
          SemigroupRecord0: function() {
            return semigroupRecordCons1;
          }
        };
      };
    };
  };
};
var guard = function(dictMonoid) {
  var mempty12 = mempty(dictMonoid);
  return function(v) {
    return function(v1) {
      if (v) {
        return v1;
      }
      ;
      if (!v) {
        return mempty12;
      }
      ;
      throw new Error("Failed pattern match at Data.Monoid (line 96, column 1 - line 96, column 49): " + [v.constructor.name, v1.constructor.name]);
    };
  };
};

// output/Effect/index.js
var $runtime_lazy = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var monadEffect = {
  Applicative0: function() {
    return applicativeEffect;
  },
  Bind1: function() {
    return bindEffect;
  }
};
var bindEffect = {
  bind: bindE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var applicativeEffect = {
  pure: pureE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
  return {
    map: liftA1(applicativeEffect)
  };
});
var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
  return {
    apply: ap(monadEffect),
    Functor0: function() {
      return $lazy_functorEffect(0);
    }
  };
});
var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);

// output/Effect.Exception/foreign.js
function error(msg) {
  return new Error(msg);
}

// output/Control.Monad.Error.Class/index.js
var throwError = function(dict) {
  return dict.throwError;
};
var catchError = function(dict) {
  return dict.catchError;
};
var $$try = function(dictMonadError) {
  var catchError1 = catchError(dictMonadError);
  var Monad0 = dictMonadError.MonadThrow0().Monad0();
  var map20 = map(Monad0.Bind1().Apply0().Functor0());
  var pure6 = pure(Monad0.Applicative0());
  return function(a) {
    return catchError1(map20(Right.create)(a))(function($52) {
      return pure6(Left.create($52));
    });
  };
};

// output/Data.Identity/index.js
var Identity = function(x) {
  return x;
};
var functorIdentity = {
  map: function(f) {
    return function(m) {
      return f(m);
    };
  }
};
var applyIdentity = {
  apply: function(v) {
    return function(v1) {
      return v(v1);
    };
  },
  Functor0: function() {
    return functorIdentity;
  }
};
var bindIdentity = {
  bind: function(v) {
    return function(f) {
      return f(v);
    };
  },
  Apply0: function() {
    return applyIdentity;
  }
};
var applicativeIdentity = {
  pure: Identity,
  Apply0: function() {
    return applyIdentity;
  }
};
var monadIdentity = {
  Applicative0: function() {
    return applicativeIdentity;
  },
  Bind1: function() {
    return bindIdentity;
  }
};

// output/Data.HeytingAlgebra/foreign.js
var boolConj = function(b1) {
  return function(b2) {
    return b1 && b2;
  };
};
var boolDisj = function(b1) {
  return function(b2) {
    return b1 || b2;
  };
};
var boolNot = function(b) {
  return !b;
};

// output/Data.HeytingAlgebra/index.js
var tt = function(dict) {
  return dict.tt;
};
var not = function(dict) {
  return dict.not;
};
var implies = function(dict) {
  return dict.implies;
};
var ff = function(dict) {
  return dict.ff;
};
var disj = function(dict) {
  return dict.disj;
};
var heytingAlgebraBoolean = {
  ff: false,
  tt: true,
  implies: function(a) {
    return function(b) {
      return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
    };
  },
  conj: boolConj,
  disj: boolDisj,
  not: boolNot
};
var conj = function(dict) {
  return dict.conj;
};
var heytingAlgebraFunction = function(dictHeytingAlgebra) {
  var ff1 = ff(dictHeytingAlgebra);
  var tt1 = tt(dictHeytingAlgebra);
  var implies1 = implies(dictHeytingAlgebra);
  var conj1 = conj(dictHeytingAlgebra);
  var disj1 = disj(dictHeytingAlgebra);
  var not1 = not(dictHeytingAlgebra);
  return {
    ff: function(v) {
      return ff1;
    },
    tt: function(v) {
      return tt1;
    },
    implies: function(f) {
      return function(g) {
        return function(a) {
          return implies1(f(a))(g(a));
        };
      };
    },
    conj: function(f) {
      return function(g) {
        return function(a) {
          return conj1(f(a))(g(a));
        };
      };
    },
    disj: function(f) {
      return function(g) {
        return function(a) {
          return disj1(f(a))(g(a));
        };
      };
    },
    not: function(f) {
      return function(a) {
        return not1(f(a));
      };
    }
  };
};

// output/Data.Tuple/index.js
var Tuple = /* @__PURE__ */ function() {
  function Tuple2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Tuple2.create = function(value0) {
    return function(value1) {
      return new Tuple2(value0, value1);
    };
  };
  return Tuple2;
}();
var uncurry = function(f) {
  return function(v) {
    return f(v.value0)(v.value1);
  };
};
var snd = function(v) {
  return v.value1;
};
var functorTuple = {
  map: function(f) {
    return function(m) {
      return new Tuple(m.value0, f(m.value1));
    };
  }
};
var fst = function(v) {
  return v.value0;
};

// output/Effect.Class/index.js
var liftEffect = function(dict) {
  return dict.liftEffect;
};

// output/Control.Monad.Except.Trans/index.js
var map4 = /* @__PURE__ */ map(functorEither);
var ExceptT = function(x) {
  return x;
};
var runExceptT = function(v) {
  return v;
};
var mapExceptT = function(f) {
  return function(v) {
    return f(v);
  };
};
var functorExceptT = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return {
    map: function(f) {
      return mapExceptT(map110(map4(f)));
    }
  };
};
var monadExceptT = function(dictMonad) {
  return {
    Applicative0: function() {
      return applicativeExceptT(dictMonad);
    },
    Bind1: function() {
      return bindExceptT(dictMonad);
    }
  };
};
var bindExceptT = function(dictMonad) {
  var bind6 = bind(dictMonad.Bind1());
  var pure6 = pure(dictMonad.Applicative0());
  return {
    bind: function(v) {
      return function(k) {
        return bind6(v)(either(function($187) {
          return pure6(Left.create($187));
        })(function(a) {
          var v1 = k(a);
          return v1;
        }));
      };
    },
    Apply0: function() {
      return applyExceptT(dictMonad);
    }
  };
};
var applyExceptT = function(dictMonad) {
  var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
  return {
    apply: ap(monadExceptT(dictMonad)),
    Functor0: function() {
      return functorExceptT1;
    }
  };
};
var applicativeExceptT = function(dictMonad) {
  return {
    pure: function() {
      var $188 = pure(dictMonad.Applicative0());
      return function($189) {
        return ExceptT($188(Right.create($189)));
      };
    }(),
    Apply0: function() {
      return applyExceptT(dictMonad);
    }
  };
};
var monadThrowExceptT = function(dictMonad) {
  var monadExceptT1 = monadExceptT(dictMonad);
  return {
    throwError: function() {
      var $198 = pure(dictMonad.Applicative0());
      return function($199) {
        return ExceptT($198(Left.create($199)));
      };
    }(),
    Monad0: function() {
      return monadExceptT1;
    }
  };
};
var altExceptT = function(dictSemigroup) {
  var append3 = append(dictSemigroup);
  return function(dictMonad) {
    var Bind1 = dictMonad.Bind1();
    var bind6 = bind(Bind1);
    var pure6 = pure(dictMonad.Applicative0());
    var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
    return {
      alt: function(v) {
        return function(v1) {
          return bind6(v)(function(rm) {
            if (rm instanceof Right) {
              return pure6(new Right(rm.value0));
            }
            ;
            if (rm instanceof Left) {
              return bind6(v1)(function(rn) {
                if (rn instanceof Right) {
                  return pure6(new Right(rn.value0));
                }
                ;
                if (rn instanceof Left) {
                  return pure6(new Left(append3(rm.value0)(rn.value0)));
                }
                ;
                throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 86, column 9 - line 88, column 49): " + [rn.constructor.name]);
              });
            }
            ;
            throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 82, column 5 - line 88, column 49): " + [rm.constructor.name]);
          });
        };
      },
      Functor0: function() {
        return functorExceptT1;
      }
    };
  };
};

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x) {
  return x;
};

// output/Safe.Coerce/index.js
var coerce = function() {
  return unsafeCoerce2;
};

// output/Data.Newtype/index.js
var coerce2 = /* @__PURE__ */ coerce();
var wrap = function() {
  return coerce2;
};
var unwrap = function() {
  return coerce2;
};
var alaF = function() {
  return function() {
    return function() {
      return function() {
        return function(v) {
          return coerce2;
        };
      };
    };
  };
};

// output/Control.Monad.Except/index.js
var unwrap2 = /* @__PURE__ */ unwrap();
var runExcept = function($3) {
  return unwrap2(runExceptT($3));
};

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output/Control.Plus/index.js
var empty = function(dict) {
  return dict.empty;
};

// output/Data.Bifunctor/index.js
var identity4 = /* @__PURE__ */ identity(categoryFn);
var bimap = function(dict) {
  return dict.bimap;
};
var lmap = function(dictBifunctor) {
  var bimap1 = bimap(dictBifunctor);
  return function(f) {
    return bimap1(f)(identity4);
  };
};
var bifunctorEither = {
  bimap: function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return new Left(v(v2.value0));
        }
        ;
        if (v2 instanceof Right) {
          return new Right(v1(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  }
};

// output/Data.Foldable/index.js
var identity5 = /* @__PURE__ */ identity(categoryFn);
var foldr = function(dict) {
  return dict.foldr;
};
var traverse_ = function(dictApplicative) {
  var applySecond2 = applySecond(dictApplicative.Apply0());
  var pure6 = pure(dictApplicative);
  return function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(f) {
      return foldr22(function($454) {
        return applySecond2(f($454));
      })(pure6(unit));
    };
  };
};
var foldl = function(dict) {
  return dict.foldl;
};
var intercalate2 = function(dictFoldable) {
  var foldl22 = foldl(dictFoldable);
  return function(dictMonoid) {
    var append3 = append(dictMonoid.Semigroup0());
    var mempty5 = mempty(dictMonoid);
    return function(sep) {
      return function(xs) {
        var go = function(v) {
          return function(v1) {
            if (v.init) {
              return {
                init: false,
                acc: v1
              };
            }
            ;
            return {
              init: false,
              acc: append3(v.acc)(append3(sep)(v1))
            };
          };
        };
        return foldl22(go)({
          init: true,
          acc: mempty5
        })(xs).acc;
      };
    };
  };
};
var foldableMaybe = {
  foldr: function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v1;
        }
        ;
        if (v2 instanceof Just) {
          return v(v2.value0)(v1);
        }
        ;
        throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  },
  foldl: function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Nothing) {
          return v1;
        }
        ;
        if (v2 instanceof Just) {
          return v(v1)(v2.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  },
  foldMap: function(dictMonoid) {
    var mempty5 = mempty(dictMonoid);
    return function(v) {
      return function(v1) {
        if (v1 instanceof Nothing) {
          return mempty5;
        }
        ;
        if (v1 instanceof Just) {
          return v(v1.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  }
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr22 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append3 = append(dictMonoid.Semigroup0());
    var mempty5 = mempty(dictMonoid);
    return function(f) {
      return foldr22(function(x) {
        return function(acc) {
          return append3(f(x))(acc);
        };
      })(mempty5);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};
var foldMap = function(dict) {
  return dict.foldMap;
};
var fold = function(dictFoldable) {
  var foldMap23 = foldMap(dictFoldable);
  return function(dictMonoid) {
    return foldMap23(dictMonoid)(identity5);
  };
};

// output/Data.FunctorWithIndex/foreign.js
var mapWithIndexArray = function(f) {
  return function(xs) {
    var l = xs.length;
    var result = Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(i)(xs[i]);
    }
    return result;
  };
};

// output/Data.FunctorWithIndex/index.js
var mapWithIndex = function(dict) {
  return dict.mapWithIndex;
};
var functorWithIndexArray = {
  mapWithIndex: mapWithIndexArray,
  Functor0: function() {
    return functorArray;
  }
};

// output/Data.FoldableWithIndex/index.js
var foldr8 = /* @__PURE__ */ foldr(foldableArray);
var mapWithIndex2 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
var foldl8 = /* @__PURE__ */ foldl(foldableArray);
var foldrWithIndex = function(dict) {
  return dict.foldrWithIndex;
};
var foldlWithIndex = function(dict) {
  return dict.foldlWithIndex;
};
var foldMapWithIndexDefaultR = function(dictFoldableWithIndex) {
  var foldrWithIndex1 = foldrWithIndex(dictFoldableWithIndex);
  return function(dictMonoid) {
    var append3 = append(dictMonoid.Semigroup0());
    var mempty5 = mempty(dictMonoid);
    return function(f) {
      return foldrWithIndex1(function(i) {
        return function(x) {
          return function(acc) {
            return append3(f(i)(x))(acc);
          };
        };
      })(mempty5);
    };
  };
};
var foldableWithIndexArray = {
  foldrWithIndex: function(f) {
    return function(z) {
      var $291 = foldr8(function(v) {
        return function(y) {
          return f(v.value0)(v.value1)(y);
        };
      })(z);
      var $292 = mapWithIndex2(Tuple.create);
      return function($293) {
        return $291($292($293));
      };
    };
  },
  foldlWithIndex: function(f) {
    return function(z) {
      var $294 = foldl8(function(y) {
        return function(v) {
          return f(v.value0)(y)(v.value1);
        };
      })(z);
      var $295 = mapWithIndex2(Tuple.create);
      return function($296) {
        return $294($295($296));
      };
    };
  },
  foldMapWithIndex: function(dictMonoid) {
    return foldMapWithIndexDefaultR(foldableWithIndexArray)(dictMonoid);
  },
  Foldable0: function() {
    return foldableArray;
  }
};
var foldMapWithIndex = function(dict) {
  return dict.foldMapWithIndex;
};

// output/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat2(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply3) {
    return function(map20) {
      return function(pure6) {
        return function(f) {
          return function(array) {
            function go(bot, top4) {
              switch (top4 - bot) {
                case 0:
                  return pure6([]);
                case 1:
                  return map20(array1)(f(array[bot]));
                case 2:
                  return apply3(map20(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply3(apply3(map20(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top4 - bot) / 4) * 2;
                  return apply3(map20(concat2)(go(bot, pivot)))(go(pivot, top4));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Data.Traversable/index.js
var identity6 = /* @__PURE__ */ identity(categoryFn);
var traverse = function(dict) {
  return dict.traverse;
};
var traversableMaybe = {
  traverse: function(dictApplicative) {
    var pure6 = pure(dictApplicative);
    var map20 = map(dictApplicative.Apply0().Functor0());
    return function(v) {
      return function(v1) {
        if (v1 instanceof Nothing) {
          return pure6(Nothing.value);
        }
        ;
        if (v1 instanceof Just) {
          return map20(Just.create)(v(v1.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Traversable (line 115, column 1 - line 119, column 33): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  },
  sequence: function(dictApplicative) {
    var pure6 = pure(dictApplicative);
    var map20 = map(dictApplicative.Apply0().Functor0());
    return function(v) {
      if (v instanceof Nothing) {
        return pure6(Nothing.value);
      }
      ;
      if (v instanceof Just) {
        return map20(Just.create)(v.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Traversable (line 115, column 1 - line 119, column 33): " + [v.constructor.name]);
    };
  },
  Functor0: function() {
    return functorMaybe;
  },
  Foldable1: function() {
    return foldableMaybe;
  }
};
var sequenceDefault = function(dictTraversable) {
  var traverse22 = traverse(dictTraversable);
  return function(dictApplicative) {
    return traverse22(dictApplicative)(identity6);
  };
};
var traversableArray = {
  traverse: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
  },
  sequence: function(dictApplicative) {
    return sequenceDefault(traversableArray)(dictApplicative);
  },
  Functor0: function() {
    return functorArray;
  },
  Foldable1: function() {
    return foldableArray;
  }
};
var sequence = function(dict) {
  return dict.sequence;
};

// output/Data.TraversableWithIndex/index.js
var traverseWithIndexDefault = function(dictTraversableWithIndex) {
  var sequence3 = sequence(dictTraversableWithIndex.Traversable2());
  var mapWithIndex5 = mapWithIndex(dictTraversableWithIndex.FunctorWithIndex0());
  return function(dictApplicative) {
    var sequence12 = sequence3(dictApplicative);
    return function(f) {
      var $174 = mapWithIndex5(f);
      return function($175) {
        return sequence12($174($175));
      };
    };
  };
};
var traverseWithIndex = function(dict) {
  return dict.traverseWithIndex;
};
var traversableWithIndexArray = {
  traverseWithIndex: function(dictApplicative) {
    return traverseWithIndexDefault(traversableWithIndexArray)(dictApplicative);
  },
  FunctorWithIndex0: function() {
    return functorWithIndexArray;
  },
  FoldableWithIndex1: function() {
    return foldableWithIndexArray;
  },
  Traversable2: function() {
    return traversableArray;
  }
};

// output/Data.Unfoldable/foreign.js
var unfoldrArrayImpl = function(isNothing2) {
  return function(fromJust5) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var maybe2 = f(value);
              if (isNothing2(maybe2))
                return result;
              var tuple = fromJust5(maybe2);
              result.push(fst2(tuple));
              value = snd2(tuple);
            }
          };
        };
      };
    };
  };
};

// output/Data.Unfoldable1/foreign.js
var unfoldr1ArrayImpl = function(isNothing2) {
  return function(fromJust5) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var tuple = f(value);
              result.push(fst2(tuple));
              var maybe2 = snd2(tuple);
              if (isNothing2(maybe2))
                return result;
              value = fromJust5(maybe2);
            }
          };
        };
      };
    };
  };
};

// output/Data.Unfoldable1/index.js
var fromJust2 = /* @__PURE__ */ fromJust();
var unfoldable1Array = {
  unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
};

// output/Data.Unfoldable/index.js
var fromJust3 = /* @__PURE__ */ fromJust();
var unfoldr = function(dict) {
  return dict.unfoldr;
};
var unfoldableArray = {
  unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
  Unfoldable10: function() {
    return unfoldable1Array;
  }
};

// output/Data.NonEmpty/index.js
var NonEmpty = /* @__PURE__ */ function() {
  function NonEmpty2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  NonEmpty2.create = function(value0) {
    return function(value1) {
      return new NonEmpty2(value0, value1);
    };
  };
  return NonEmpty2;
}();
var singleton2 = function(dictPlus) {
  var empty4 = empty(dictPlus);
  return function(a) {
    return new NonEmpty(a, empty4);
  };
};

// output/Data.List.Types/index.js
var identity7 = /* @__PURE__ */ identity(categoryFn);
var Nil = /* @__PURE__ */ function() {
  function Nil3() {
  }
  ;
  Nil3.value = new Nil3();
  return Nil3;
}();
var Cons = /* @__PURE__ */ function() {
  function Cons3(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Cons3.create = function(value0) {
    return function(value1) {
      return new Cons3(value0, value1);
    };
  };
  return Cons3;
}();
var NonEmptyList = function(x) {
  return x;
};
var toList = function(v) {
  return new Cons(v.value0, v.value1);
};
var listMap = function(f) {
  var chunkedRevMap = function($copy_v) {
    return function($copy_v1) {
      var $tco_var_v = $copy_v;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v, v1) {
        if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Cons)) {
          $tco_var_v = new Cons(v1, v);
          $copy_v1 = v1.value1.value1.value1;
          return;
        }
        ;
        var unrolledMap = function(v2) {
          if (v2 instanceof Cons && (v2.value1 instanceof Cons && v2.value1.value1 instanceof Nil)) {
            return new Cons(f(v2.value0), new Cons(f(v2.value1.value0), Nil.value));
          }
          ;
          if (v2 instanceof Cons && v2.value1 instanceof Nil) {
            return new Cons(f(v2.value0), Nil.value);
          }
          ;
          return Nil.value;
        };
        var reverseUnrolledMap = function($copy_v2) {
          return function($copy_v3) {
            var $tco_var_v2 = $copy_v2;
            var $tco_done1 = false;
            var $tco_result2;
            function $tco_loop2(v2, v3) {
              if (v2 instanceof Cons && (v2.value0 instanceof Cons && (v2.value0.value1 instanceof Cons && v2.value0.value1.value1 instanceof Cons))) {
                $tco_var_v2 = v2.value1;
                $copy_v3 = new Cons(f(v2.value0.value0), new Cons(f(v2.value0.value1.value0), new Cons(f(v2.value0.value1.value1.value0), v3)));
                return;
              }
              ;
              $tco_done1 = true;
              return v3;
            }
            ;
            while (!$tco_done1) {
              $tco_result2 = $tco_loop2($tco_var_v2, $copy_v3);
            }
            ;
            return $tco_result2;
          };
        };
        $tco_done = true;
        return reverseUnrolledMap(v)(unrolledMap(v1));
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_v, $copy_v1);
      }
      ;
      return $tco_result;
    };
  };
  return chunkedRevMap(Nil.value);
};
var functorList = {
  map: listMap
};
var map5 = /* @__PURE__ */ map(functorList);
var foldableList = {
  foldr: function(f) {
    return function(b) {
      var rev = function() {
        var go = function($copy_v) {
          return function($copy_v1) {
            var $tco_var_v = $copy_v;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(v, v1) {
              if (v1 instanceof Nil) {
                $tco_done = true;
                return v;
              }
              ;
              if (v1 instanceof Cons) {
                $tco_var_v = new Cons(v1.value0, v);
                $copy_v1 = v1.value1;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [v.constructor.name, v1.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_v, $copy_v1);
            }
            ;
            return $tco_result;
          };
        };
        return go(Nil.value);
      }();
      var $284 = foldl(foldableList)(flip(f))(b);
      return function($285) {
        return $284(rev($285));
      };
    };
  },
  foldl: function(f) {
    var go = function($copy_b) {
      return function($copy_v) {
        var $tco_var_b = $copy_b;
        var $tco_done1 = false;
        var $tco_result;
        function $tco_loop(b, v) {
          if (v instanceof Nil) {
            $tco_done1 = true;
            return b;
          }
          ;
          if (v instanceof Cons) {
            $tco_var_b = f(b)(v.value0);
            $copy_v = v.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done1) {
          $tco_result = $tco_loop($tco_var_b, $copy_v);
        }
        ;
        return $tco_result;
      };
    };
    return go;
  },
  foldMap: function(dictMonoid) {
    var append22 = append(dictMonoid.Semigroup0());
    var mempty5 = mempty(dictMonoid);
    return function(f) {
      return foldl(foldableList)(function(acc) {
        var $286 = append22(acc);
        return function($287) {
          return $286(f($287));
        };
      })(mempty5);
    };
  }
};
var foldl2 = /* @__PURE__ */ foldl(foldableList);
var foldr2 = /* @__PURE__ */ foldr(foldableList);
var semigroupList = {
  append: function(xs) {
    return function(ys) {
      return foldr2(Cons.create)(ys)(xs);
    };
  }
};
var append1 = /* @__PURE__ */ append(semigroupList);
var monoidList = /* @__PURE__ */ function() {
  return {
    mempty: Nil.value,
    Semigroup0: function() {
      return semigroupList;
    }
  };
}();
var semigroupNonEmptyList = {
  append: function(v) {
    return function(as$prime) {
      return new NonEmpty(v.value0, append1(v.value1)(toList(as$prime)));
    };
  }
};
var traversableList = {
  traverse: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    var map110 = map(Apply0.Functor0());
    var lift22 = lift2(Apply0);
    var pure12 = pure(dictApplicative);
    return function(f) {
      var $301 = map110(foldl2(flip(Cons.create))(Nil.value));
      var $302 = foldl2(function(acc) {
        var $304 = lift22(flip(Cons.create))(acc);
        return function($305) {
          return $304(f($305));
        };
      })(pure12(Nil.value));
      return function($303) {
        return $301($302($303));
      };
    };
  },
  sequence: function(dictApplicative) {
    return traverse(traversableList)(dictApplicative)(identity7);
  },
  Functor0: function() {
    return functorList;
  },
  Foldable1: function() {
    return foldableList;
  }
};
var applyList = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Nil) {
        return Nil.value;
      }
      ;
      if (v instanceof Cons) {
        return append1(map5(v.value0)(v1))(apply(applyList)(v.value1)(v1));
      }
      ;
      throw new Error("Failed pattern match at Data.List.Types (line 157, column 1 - line 159, column 48): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorList;
  }
};
var bindList = {
  bind: function(v) {
    return function(v1) {
      if (v instanceof Nil) {
        return Nil.value;
      }
      ;
      if (v instanceof Cons) {
        return append1(v1(v.value0))(bind(bindList)(v.value1)(v1));
      }
      ;
      throw new Error("Failed pattern match at Data.List.Types (line 164, column 1 - line 166, column 37): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Apply0: function() {
    return applyList;
  }
};
var applicativeList = {
  pure: function(a) {
    return new Cons(a, Nil.value);
  },
  Apply0: function() {
    return applyList;
  }
};
var altList = {
  alt: append1,
  Functor0: function() {
    return functorList;
  }
};
var plusList = /* @__PURE__ */ function() {
  return {
    empty: Nil.value,
    Alt0: function() {
      return altList;
    }
  };
}();

// output/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler2(error2) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error2) {
      setTimeout(function() {
        throw error2;
      }, 0);
    }
  }
  function runSync(left2, right2, eff) {
    try {
      return right2(eff());
    } catch (error2) {
      return left2(error2);
    }
  }
  function runAsync(left2, eff, k) {
    try {
      return eff(k)();
    } catch (error2) {
      k(left2(error2))();
      return nonCanceler2;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size3 = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size3 !== 0) {
        size3--;
        thunk = queue[ix];
        queue[ix] = void 0;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i, tmp;
        if (size3 === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size3) % limit] = cb;
        size3++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error2) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step2 = aff;
    var fail2 = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run3(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step2 = bhead(step2);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e) {
              status = RETURN;
              fail2 = util.left(e);
              step2 = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step2)) {
              status = RETURN;
              fail2 = step2;
              step2 = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step2 = util.fromRight(step2);
            }
            break;
          case CONTINUE:
            switch (step2.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step2._2;
                status = CONTINUE;
                step2 = step2._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step2 = util.right(step2._1);
                } else {
                  status = STEP_BIND;
                  step2 = step2._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step2 = runSync(util.left, util.right, step2._1);
                break;
              case ASYNC:
                status = PENDING;
                step2 = runAsync(util.left, step2._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step2 = result2;
                      run3(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail2 = util.left(step2._1);
                step2 = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step2, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step2 = step2._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step2, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step2 = step2._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step2._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step2._1) {
                  tmp.run();
                }
                step2 = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step2 = sequential2(util, supervisor, step2._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step2 = interrupt || fail2 || step2;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail2) {
                    status = CONTINUE;
                    step2 = attempt._2(util.fromLeft(fail2));
                    fail2 = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail2) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step2 = util.fromRight(step2);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail2 === null) {
                    result = util.fromRight(step2);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step2 = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail2), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step2 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail2) {
                    step2 = attempt._1.failed(util.fromLeft(fail2))(attempt._2);
                  } else {
                    step2 = attempt._1.completed(util.fromRight(step2))(attempt._2);
                  }
                  fail2 = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail2), attempts, interrupt);
                  status = CONTINUE;
                  step2 = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step2 = attempt._1;
                  fail2 = attempt._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step2));
              }
            }
            joins = null;
            if (interrupt && fail2) {
              setTimeout(function() {
                throw util.fromLeft(fail2);
              }, 0);
            } else if (util.isLeft(step2) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step2);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join3) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join3.rethrow;
          join3.handler(step2)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join3;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill(error2, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(void 0))();
          return function() {
          };
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(void 0));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error2);
            status = COMPLETED;
            step2 = interrupt;
            run3(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error2);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step2(error2)), attempts, interrupt);
              }
              status = RETURN;
              step2 = null;
              fail2 = null;
              run3(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error2);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step2 = null;
              fail2 = null;
            }
        }
        return canceler;
      };
    }
    function join2(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run3(runTick);
        }
        return canceler;
      };
    }
    return {
      kill,
      join: join2,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run3(runTick);
            });
          } else {
            run3(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill(error2, par2, cb2) {
      var step2 = par2;
      var head3 = null;
      var tail2 = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step2.tag) {
            case FORKED:
              if (step2._3 === EMPTY) {
                tmp = fibers[step2._1];
                kills2[count++] = tmp.kill(error2, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head3 === null) {
                break loop;
              }
              step2 = head3._2;
              if (tail2 === null) {
                head3 = null;
              } else {
                head3 = tail2._1;
                tail2 = tail2._2;
              }
              break;
            case MAP:
              step2 = step2._2;
              break;
            case APPLY:
            case ALT:
              if (head3) {
                tail2 = new Aff2(CONS, head3, tail2);
              }
              head3 = step2;
              step2 = step2._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(void 0))();
      } else {
        kid = 0;
        tmp = count;
        for (; kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join2(result, head3, tail2) {
      var fail2, step2, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail2 = result;
        step2 = null;
      } else {
        step2 = result;
        fail2 = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head3 === null) {
            cb(fail2 || step2)();
            return;
          }
          if (head3._3 !== EMPTY) {
            return;
          }
          switch (head3.tag) {
            case MAP:
              if (fail2 === null) {
                head3._3 = util.right(head3._1(util.fromRight(step2)));
                step2 = head3._3;
              } else {
                head3._3 = fail2;
              }
              break;
            case APPLY:
              lhs = head3._1._3;
              rhs = head3._2._3;
              if (fail2) {
                head3._3 = fail2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, fail2 === lhs ? head3._2 : head3._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail2 === null) {
                      join2(fail2, null, null);
                    } else {
                      join2(fail2, tail2._1, tail2._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step2 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head3._3 = step2;
              }
              break;
            case ALT:
              lhs = head3._1._3;
              rhs = head3._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail2 = step2 === lhs ? rhs : lhs;
                step2 = null;
                head3._3 = fail2;
              } else {
                head3._3 = step2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill(early, step2 === lhs ? head3._2 : head3._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail2 === null) {
                      join2(step2, null, null);
                    } else {
                      join2(step2, tail2._1, tail2._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail2 === null) {
            head3 = null;
          } else {
            head3 = tail2._1;
            tail2 = tail2._2;
          }
        }
    }
    function resolve(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join2(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run3() {
      var status = CONTINUE;
      var step2 = par;
      var head3 = null;
      var tail2 = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step2.tag) {
                case MAP:
                  if (head3) {
                    tail2 = new Aff2(CONS, head3, tail2);
                  }
                  head3 = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                  step2 = step2._2;
                  break;
                case APPLY:
                  if (head3) {
                    tail2 = new Aff2(CONS, head3, tail2);
                  }
                  head3 = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                case ALT:
                  if (head3) {
                    tail2 = new Aff2(CONS, head3, tail2);
                  }
                  head3 = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step2;
                  step2 = new Aff2(FORKED, fid, new Aff2(CONS, head3, tail2), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve(step2)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head3 === null) {
                break loop;
              }
              if (head3._1 === EMPTY) {
                head3._1 = step2;
                status = CONTINUE;
                step2 = head3._2;
                head3._2 = EMPTY;
              } else {
                head3._2 = step2;
                step2 = head3;
                if (tail2 === null) {
                  head3 = null;
                } else {
                  head3 = tail2._1;
                  tail2 = tail2._2;
                }
              }
          }
        }
      root = step2;
      for (fid = 0; fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error2, cb2) {
      interrupt = util.left(error2);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill(error2, root, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler2;
          };
        });
      };
    }
    run3();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential2(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler2;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _catchError(aff) {
  return function(k) {
    return Aff.Catch(aff, k);
  };
}
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
function _parAffMap(f) {
  return function(aff) {
    return Aff.ParMap(f, aff);
  };
}
function _parAffApply(aff1) {
  return function(aff2) {
    return Aff.ParApply(aff1, aff2);
  };
}
var makeAff = Aff.Async;
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
    }
  }
  return function(right2, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right2()));
        return function() {
          return Aff.Sync(function() {
            return right2(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;

// output/Data.Profunctor/index.js
var identity8 = /* @__PURE__ */ identity(categoryFn);
var profunctorFn = {
  dimap: function(a2b) {
    return function(c2d) {
      return function(b2c) {
        return function($18) {
          return c2d(b2c(a2b($18)));
        };
      };
    };
  }
};
var dimap = function(dict) {
  return dict.dimap;
};
var rmap = function(dictProfunctor) {
  var dimap1 = dimap(dictProfunctor);
  return function(b2c) {
    return dimap1(identity8)(b2c);
  };
};

// output/Control.Parallel.Class/index.js
var sequential = function(dict) {
  return dict.sequential;
};
var parallel = function(dict) {
  return dict.parallel;
};

// output/Control.Parallel/index.js
var identity9 = /* @__PURE__ */ identity(categoryFn);
var parTraverse_ = function(dictParallel) {
  var sequential2 = sequential(dictParallel);
  var traverse_2 = traverse_(dictParallel.Applicative1());
  var parallel2 = parallel(dictParallel);
  return function(dictFoldable) {
    var traverse_1 = traverse_2(dictFoldable);
    return function(f) {
      var $48 = traverse_1(function($50) {
        return parallel2(f($50));
      });
      return function($49) {
        return sequential2($48($49));
      };
    };
  };
};
var parSequence_ = function(dictParallel) {
  var parTraverse_1 = parTraverse_(dictParallel);
  return function(dictFoldable) {
    return parTraverse_1(dictFoldable)(identity9);
  };
};

// output/Partial.Unsafe/foreign.js
var _unsafePartial = function(f) {
  return f();
};

// output/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output/Partial/index.js
var crashWith = function() {
  return _crashWith;
};

// output/Partial.Unsafe/index.js
var crashWith2 = /* @__PURE__ */ crashWith();
var unsafePartial = _unsafePartial;
var unsafeCrashWith = function(msg) {
  return unsafePartial(function() {
    return crashWith2(msg);
  });
};

// output/Effect.Aff/index.js
var $runtime_lazy2 = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var $$void2 = /* @__PURE__ */ $$void(functorEffect);
var functorParAff = {
  map: _parAffMap
};
var functorAff = {
  map: _map
};
var ffiUtil = /* @__PURE__ */ function() {
  var unsafeFromRight = function(v) {
    if (v instanceof Right) {
      return v.value0;
    }
    ;
    if (v instanceof Left) {
      return unsafeCrashWith("unsafeFromRight: Left");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 407, column 21 - line 409, column 54): " + [v.constructor.name]);
  };
  var unsafeFromLeft = function(v) {
    if (v instanceof Left) {
      return v.value0;
    }
    ;
    if (v instanceof Right) {
      return unsafeCrashWith("unsafeFromLeft: Right");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 402, column 20 - line 404, column 55): " + [v.constructor.name]);
  };
  var isLeft = function(v) {
    if (v instanceof Left) {
      return true;
    }
    ;
    if (v instanceof Right) {
      return false;
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 397, column 12 - line 399, column 21): " + [v.constructor.name]);
  };
  return {
    isLeft,
    fromLeft: unsafeFromLeft,
    fromRight: unsafeFromRight,
    left: Left.create,
    right: Right.create
  };
}();
var makeFiber = function(aff) {
  return _makeFiber(ffiUtil, aff);
};
var launchAff = function(aff) {
  return function __do() {
    var fiber = makeFiber(aff)();
    fiber.run();
    return fiber;
  };
};
var applyParAff = {
  apply: _parAffApply,
  Functor0: function() {
    return functorParAff;
  }
};
var monadAff = {
  Applicative0: function() {
    return applicativeAff;
  },
  Bind1: function() {
    return bindAff;
  }
};
var bindAff = {
  bind: _bind,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var applicativeAff = {
  pure: _pure,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy2("applyAff", "Effect.Aff", function() {
  return {
    apply: ap(monadAff),
    Functor0: function() {
      return functorAff;
    }
  };
});
var pure2 = /* @__PURE__ */ pure(applicativeAff);
var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindAff);
var monadEffectAff = {
  liftEffect: _liftEffect,
  Monad0: function() {
    return monadAff;
  }
};
var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
var monadThrowAff = {
  throwError: _throwError,
  Monad0: function() {
    return monadAff;
  }
};
var monadErrorAff = {
  catchError: _catchError,
  MonadThrow0: function() {
    return monadThrowAff;
  }
};
var $$try2 = /* @__PURE__ */ $$try(monadErrorAff);
var runAff = function(k) {
  return function(aff) {
    return launchAff(bindFlipped2(function($77) {
      return liftEffect2(k($77));
    })($$try2(aff)));
  };
};
var runAff_ = function(k) {
  return function(aff) {
    return $$void2(runAff(k)(aff));
  };
};
var parallelAff = {
  parallel: unsafeCoerce2,
  sequential: _sequential,
  Monad0: function() {
    return monadAff;
  },
  Applicative1: function() {
    return $lazy_applicativeParAff(0);
  }
};
var $lazy_applicativeParAff = /* @__PURE__ */ $runtime_lazy2("applicativeParAff", "Effect.Aff", function() {
  return {
    pure: function() {
      var $79 = parallel(parallelAff);
      return function($80) {
        return $79(pure2($80));
      };
    }(),
    Apply0: function() {
      return applyParAff;
    }
  };
});
var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(foldableArray);
var semigroupCanceler = {
  append: function(v) {
    return function(v1) {
      return function(err) {
        return parSequence_2([v(err), v1(err)]);
      };
    };
  }
};
var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure2(unit));
var monoidCanceler = {
  mempty: nonCanceler,
  Semigroup0: function() {
    return semigroupCanceler;
  }
};

// output/Foreign/foreign.js
function tagOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
var toNumber = function(n) {
  return n;
};

// output/Data.Number/foreign.js
var isFiniteImpl = isFinite;
var floor = Math.floor;

// output/Data.Int/index.js
var top2 = /* @__PURE__ */ top(boundedInt);
var bottom2 = /* @__PURE__ */ bottom(boundedInt);
var fromNumber = /* @__PURE__ */ function() {
  return fromNumberImpl(Just.create)(Nothing.value);
}();
var unsafeClamp = function(x) {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  ;
  if (x >= toNumber(top2)) {
    return top2;
  }
  ;
  if (x <= toNumber(bottom2)) {
    return bottom2;
  }
  ;
  if (otherwise) {
    return fromMaybe(0)(fromNumber(x));
  }
  ;
  throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
};
var floor2 = function($39) {
  return unsafeClamp(floor($39));
};

// output/Data.List.Internal/index.js
var Leaf = /* @__PURE__ */ function() {
  function Leaf3() {
  }
  ;
  Leaf3.value = new Leaf3();
  return Leaf3;
}();
var Two = /* @__PURE__ */ function() {
  function Two3(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  Two3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new Two3(value0, value1, value2);
      };
    };
  };
  return Two3;
}();
var Three = /* @__PURE__ */ function() {
  function Three3(value0, value1, value2, value3, value4) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }
  ;
  Three3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return new Three3(value0, value1, value2, value3, value4);
          };
        };
      };
    };
  };
  return Three3;
}();
var TwoLeft = /* @__PURE__ */ function() {
  function TwoLeft3(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  TwoLeft3.create = function(value0) {
    return function(value1) {
      return new TwoLeft3(value0, value1);
    };
  };
  return TwoLeft3;
}();
var TwoRight = /* @__PURE__ */ function() {
  function TwoRight3(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  TwoRight3.create = function(value0) {
    return function(value1) {
      return new TwoRight3(value0, value1);
    };
  };
  return TwoRight3;
}();
var ThreeLeft = /* @__PURE__ */ function() {
  function ThreeLeft3(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  ThreeLeft3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new ThreeLeft3(value0, value1, value2, value3);
        };
      };
    };
  };
  return ThreeLeft3;
}();
var ThreeMiddle = /* @__PURE__ */ function() {
  function ThreeMiddle3(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  ThreeMiddle3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new ThreeMiddle3(value0, value1, value2, value3);
        };
      };
    };
  };
  return ThreeMiddle3;
}();
var ThreeRight = /* @__PURE__ */ function() {
  function ThreeRight3(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  ThreeRight3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new ThreeRight3(value0, value1, value2, value3);
        };
      };
    };
  };
  return ThreeRight3;
}();
var KickUp = /* @__PURE__ */ function() {
  function KickUp3(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  KickUp3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new KickUp3(value0, value1, value2);
      };
    };
  };
  return KickUp3;
}();
var fromZipper = function($copy_v) {
  return function($copy_v1) {
    var $tco_var_v = $copy_v;
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v, v1) {
      if (v instanceof Nil) {
        $tco_done = true;
        return v1;
      }
      ;
      if (v instanceof Cons) {
        if (v.value0 instanceof TwoLeft) {
          $tco_var_v = v.value1;
          $copy_v1 = new Two(v1, v.value0.value0, v.value0.value1);
          return;
        }
        ;
        if (v.value0 instanceof TwoRight) {
          $tco_var_v = v.value1;
          $copy_v1 = new Two(v.value0.value0, v.value0.value1, v1);
          return;
        }
        ;
        if (v.value0 instanceof ThreeLeft) {
          $tco_var_v = v.value1;
          $copy_v1 = new Three(v1, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3);
          return;
        }
        ;
        if (v.value0 instanceof ThreeMiddle) {
          $tco_var_v = v.value1;
          $copy_v1 = new Three(v.value0.value0, v.value0.value1, v1, v.value0.value2, v.value0.value3);
          return;
        }
        ;
        if (v.value0 instanceof ThreeRight) {
          $tco_var_v = v.value1;
          $copy_v1 = new Three(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v1);
          return;
        }
        ;
        throw new Error("Failed pattern match at Data.List.Internal (line 25, column 3 - line 30, column 76): " + [v.value0.constructor.name]);
      }
      ;
      throw new Error("Failed pattern match at Data.List.Internal (line 22, column 1 - line 22, column 63): " + [v.constructor.name, v1.constructor.name]);
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($tco_var_v, $copy_v1);
    }
    ;
    return $tco_result;
  };
};
var insertAndLookupBy = function(comp) {
  return function(k) {
    return function(orig) {
      var up = function($copy_v) {
        return function($copy_v1) {
          var $tco_var_v = $copy_v;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v, v1) {
            if (v instanceof Nil) {
              $tco_done = true;
              return new Two(v1.value0, v1.value1, v1.value2);
            }
            ;
            if (v instanceof Cons) {
              if (v.value0 instanceof TwoLeft) {
                $tco_done = true;
                return fromZipper(v.value1)(new Three(v1.value0, v1.value1, v1.value2, v.value0.value0, v.value0.value1));
              }
              ;
              if (v.value0 instanceof TwoRight) {
                $tco_done = true;
                return fromZipper(v.value1)(new Three(v.value0.value0, v.value0.value1, v1.value0, v1.value1, v1.value2));
              }
              ;
              if (v.value0 instanceof ThreeLeft) {
                $tco_var_v = v.value1;
                $copy_v1 = new KickUp(new Two(v1.value0, v1.value1, v1.value2), v.value0.value0, new Two(v.value0.value1, v.value0.value2, v.value0.value3));
                return;
              }
              ;
              if (v.value0 instanceof ThreeMiddle) {
                $tco_var_v = v.value1;
                $copy_v1 = new KickUp(new Two(v.value0.value0, v.value0.value1, v1.value0), v1.value1, new Two(v1.value2, v.value0.value2, v.value0.value3));
                return;
              }
              ;
              if (v.value0 instanceof ThreeRight) {
                $tco_var_v = v.value1;
                $copy_v1 = new KickUp(new Two(v.value0.value0, v.value0.value1, v.value0.value2), v.value0.value3, new Two(v1.value0, v1.value1, v1.value2));
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.List.Internal (line 58, column 5 - line 63, column 90): " + [v.value0.constructor.name, v1.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Data.List.Internal (line 55, column 3 - line 55, column 50): " + [v.constructor.name, v1.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_v, $copy_v1);
          }
          ;
          return $tco_result;
        };
      };
      var down = function($copy_v) {
        return function($copy_v1) {
          var $tco_var_v = $copy_v;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(v, v1) {
            if (v1 instanceof Leaf) {
              $tco_done1 = true;
              return {
                found: false,
                result: up(v)(new KickUp(Leaf.value, k, Leaf.value))
              };
            }
            ;
            if (v1 instanceof Two) {
              var v2 = comp(k)(v1.value1);
              if (v2 instanceof EQ) {
                $tco_done1 = true;
                return {
                  found: true,
                  result: orig
                };
              }
              ;
              if (v2 instanceof LT) {
                $tco_var_v = new Cons(new TwoLeft(v1.value1, v1.value2), v);
                $copy_v1 = v1.value0;
                return;
              }
              ;
              $tco_var_v = new Cons(new TwoRight(v1.value0, v1.value1), v);
              $copy_v1 = v1.value2;
              return;
            }
            ;
            if (v1 instanceof Three) {
              var v2 = comp(k)(v1.value1);
              if (v2 instanceof EQ) {
                $tco_done1 = true;
                return {
                  found: true,
                  result: orig
                };
              }
              ;
              var v3 = comp(k)(v1.value3);
              if (v3 instanceof EQ) {
                $tco_done1 = true;
                return {
                  found: true,
                  result: orig
                };
              }
              ;
              if (v2 instanceof LT) {
                $tco_var_v = new Cons(new ThreeLeft(v1.value1, v1.value2, v1.value3, v1.value4), v);
                $copy_v1 = v1.value0;
                return;
              }
              ;
              if (v2 instanceof GT && v3 instanceof LT) {
                $tco_var_v = new Cons(new ThreeMiddle(v1.value0, v1.value1, v1.value3, v1.value4), v);
                $copy_v1 = v1.value2;
                return;
              }
              ;
              $tco_var_v = new Cons(new ThreeRight(v1.value0, v1.value1, v1.value2, v1.value3), v);
              $copy_v1 = v1.value4;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.List.Internal (line 38, column 3 - line 38, column 81): " + [v.constructor.name, v1.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_v, $copy_v1);
          }
          ;
          return $tco_result;
        };
      };
      return down(Nil.value)(orig);
    };
  };
};
var emptySet = /* @__PURE__ */ function() {
  return Leaf.value;
}();

// output/Data.List/index.js
var eq3 = /* @__PURE__ */ eq(eqOrdering);
var notEq2 = /* @__PURE__ */ notEq(eqOrdering);
var identity10 = /* @__PURE__ */ identity(categoryFn);
var singleton3 = function(a) {
  return new Cons(a, Nil.value);
};
var sortBy = function(cmp) {
  var merge = function(v) {
    return function(v1) {
      if (v instanceof Cons && v1 instanceof Cons) {
        if (eq3(cmp(v.value0)(v1.value0))(GT.value)) {
          return new Cons(v1.value0, merge(v)(v1.value1));
        }
        ;
        if (otherwise) {
          return new Cons(v.value0, merge(v.value1)(v1));
        }
        ;
      }
      ;
      if (v instanceof Nil) {
        return v1;
      }
      ;
      if (v1 instanceof Nil) {
        return v;
      }
      ;
      throw new Error("Failed pattern match at Data.List (line 466, column 3 - line 466, column 38): " + [v.constructor.name, v1.constructor.name]);
    };
  };
  var mergePairs = function(v) {
    if (v instanceof Cons && v.value1 instanceof Cons) {
      return new Cons(merge(v.value0)(v.value1.value0), mergePairs(v.value1.value1));
    }
    ;
    return v;
  };
  var mergeAll = function($copy_v) {
    var $tco_done = false;
    var $tco_result;
    function $tco_loop(v) {
      if (v instanceof Cons && v.value1 instanceof Nil) {
        $tco_done = true;
        return v.value0;
      }
      ;
      $copy_v = mergePairs(v);
      return;
    }
    ;
    while (!$tco_done) {
      $tco_result = $tco_loop($copy_v);
    }
    ;
    return $tco_result;
  };
  var sequences = function(v) {
    if (v instanceof Cons && v.value1 instanceof Cons) {
      if (eq3(cmp(v.value0)(v.value1.value0))(GT.value)) {
        return descending(v.value1.value0)(singleton3(v.value0))(v.value1.value1);
      }
      ;
      if (otherwise) {
        return ascending(v.value1.value0)(function(v1) {
          return new Cons(v.value0, v1);
        })(v.value1.value1);
      }
      ;
    }
    ;
    return singleton3(v);
  };
  var descending = function($copy_v) {
    return function($copy_v1) {
      return function($copy_v2) {
        var $tco_var_v = $copy_v;
        var $tco_var_v1 = $copy_v1;
        var $tco_done1 = false;
        var $tco_result;
        function $tco_loop(v, v1, v2) {
          if (v2 instanceof Cons && eq3(cmp(v)(v2.value0))(GT.value)) {
            $tco_var_v = v2.value0;
            $tco_var_v1 = new Cons(v, v1);
            $copy_v2 = v2.value1;
            return;
          }
          ;
          $tco_done1 = true;
          return new Cons(new Cons(v, v1), sequences(v2));
        }
        ;
        while (!$tco_done1) {
          $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
        }
        ;
        return $tco_result;
      };
    };
  };
  var ascending = function($copy_v) {
    return function($copy_v1) {
      return function($copy_v2) {
        var $tco_var_v = $copy_v;
        var $tco_var_v1 = $copy_v1;
        var $tco_done2 = false;
        var $tco_result;
        function $tco_loop(v, v1, v2) {
          if (v2 instanceof Cons && notEq2(cmp(v)(v2.value0))(GT.value)) {
            $tco_var_v = v2.value0;
            $tco_var_v1 = function(ys) {
              return v1(new Cons(v, ys));
            };
            $copy_v2 = v2.value1;
            return;
          }
          ;
          $tco_done2 = true;
          return new Cons(v1(singleton3(v)), sequences(v2));
        }
        ;
        while (!$tco_done2) {
          $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
        }
        ;
        return $tco_result;
      };
    };
  };
  return function($444) {
    return mergeAll(sequences($444));
  };
};
var sort = function(dictOrd) {
  var compare5 = compare(dictOrd);
  return function(xs) {
    return sortBy(compare5)(xs);
  };
};
var reverse = /* @__PURE__ */ function() {
  var go = function($copy_v) {
    return function($copy_v1) {
      var $tco_var_v = $copy_v;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v, v1) {
        if (v1 instanceof Nil) {
          $tco_done = true;
          return v;
        }
        ;
        if (v1 instanceof Cons) {
          $tco_var_v = new Cons(v1.value0, v);
          $copy_v1 = v1.value1;
          return;
        }
        ;
        throw new Error("Failed pattern match at Data.List (line 368, column 3 - line 368, column 19): " + [v.constructor.name, v1.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_v, $copy_v1);
      }
      ;
      return $tco_result;
    };
  };
  return go(Nil.value);
}();
var nubBy = function(p) {
  var go = function($copy_v) {
    return function($copy_v1) {
      return function($copy_v2) {
        var $tco_var_v = $copy_v;
        var $tco_var_v1 = $copy_v1;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(v, v1, v2) {
          if (v2 instanceof Nil) {
            $tco_done = true;
            return v1;
          }
          ;
          if (v2 instanceof Cons) {
            var v3 = insertAndLookupBy(p)(v2.value0)(v);
            if (v3.found) {
              $tco_var_v = v3.result;
              $tco_var_v1 = v1;
              $copy_v2 = v2.value1;
              return;
            }
            ;
            $tco_var_v = v3.result;
            $tco_var_v1 = new Cons(v2.value0, v1);
            $copy_v2 = v2.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List (line 673, column 5 - line 673, column 23): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_v, $tco_var_v1, $copy_v2);
        }
        ;
        return $tco_result;
      };
    };
  };
  var $445 = go(emptySet)(Nil.value);
  return function($446) {
    return reverse($445($446));
  };
};
var nub = function(dictOrd) {
  return nubBy(compare(dictOrd));
};
var mapMaybe = function(f) {
  var go = function($copy_v) {
    return function($copy_v1) {
      var $tco_var_v = $copy_v;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v, v1) {
        if (v1 instanceof Nil) {
          $tco_done = true;
          return reverse(v);
        }
        ;
        if (v1 instanceof Cons) {
          var v2 = f(v1.value0);
          if (v2 instanceof Nothing) {
            $tco_var_v = v;
            $copy_v1 = v1.value1;
            return;
          }
          ;
          if (v2 instanceof Just) {
            $tco_var_v = new Cons(v2.value0, v);
            $copy_v1 = v1.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List (line 419, column 5 - line 421, column 32): " + [v2.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Data.List (line 417, column 3 - line 417, column 27): " + [v.constructor.name, v1.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_v, $copy_v1);
      }
      ;
      return $tco_result;
    };
  };
  return go(Nil.value);
};
var fromFoldable = function(dictFoldable) {
  return foldr(dictFoldable)(Cons.create)(Nil.value);
};
var filter = function(p) {
  var go = function($copy_v) {
    return function($copy_v1) {
      var $tco_var_v = $copy_v;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v, v1) {
        if (v1 instanceof Nil) {
          $tco_done = true;
          return reverse(v);
        }
        ;
        if (v1 instanceof Cons) {
          if (p(v1.value0)) {
            $tco_var_v = new Cons(v1.value0, v);
            $copy_v1 = v1.value1;
            return;
          }
          ;
          if (otherwise) {
            $tco_var_v = v;
            $copy_v1 = v1.value1;
            return;
          }
          ;
        }
        ;
        throw new Error("Failed pattern match at Data.List (line 390, column 3 - line 390, column 27): " + [v.constructor.name, v1.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_v, $copy_v1);
      }
      ;
      return $tco_result;
    };
  };
  return go(Nil.value);
};
var catMaybes = /* @__PURE__ */ mapMaybe(identity10);

// output/Data.List.NonEmpty/index.js
var singleton4 = /* @__PURE__ */ function() {
  var $200 = singleton2(plusList);
  return function($201) {
    return NonEmptyList($200($201));
  };
}();

// output/Data.String.CodeUnits/foreign.js
var singleton5 = function(c) {
  return c;
};
var _charAt = function(just) {
  return function(nothing) {
    return function(i) {
      return function(s) {
        return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
      };
    };
  };
};
var length2 = function(s) {
  return s.length;
};
var _indexOf = function(just) {
  return function(nothing) {
    return function(x) {
      return function(s) {
        var i = s.indexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};
var drop2 = function(n) {
  return function(s) {
    return s.substring(n);
  };
};

// output/Data.String.Unsafe/foreign.js
var charAt = function(i) {
  return function(s) {
    if (i >= 0 && i < s.length)
      return s.charAt(i);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
};

// output/Data.String.CodeUnits/index.js
var indexOf = /* @__PURE__ */ function() {
  return _indexOf(Just.create)(Nothing.value);
}();
var contains = function(pat) {
  var $23 = indexOf(pat);
  return function($24) {
    return isJust($23($24));
  };
};
var charAt2 = /* @__PURE__ */ function() {
  return _charAt(Just.create)(Nothing.value);
}();

// output/Foreign/index.js
var TypeMismatch = /* @__PURE__ */ function() {
  function TypeMismatch3(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  TypeMismatch3.create = function(value0) {
    return function(value1) {
      return new TypeMismatch3(value0, value1);
    };
  };
  return TypeMismatch3;
}();
var unsafeFromForeign = unsafeCoerce2;
var fail = function(dictMonad) {
  var $153 = throwError(monadThrowExceptT(dictMonad));
  return function($154) {
    return $153(singleton4($154));
  };
};
var unsafeReadTagged = function(dictMonad) {
  var pure12 = pure(applicativeExceptT(dictMonad));
  var fail1 = fail(dictMonad);
  return function(tag) {
    return function(value) {
      if (tagOf(value) === tag) {
        return pure12(unsafeFromForeign(value));
      }
      ;
      if (otherwise) {
        return fail1(new TypeMismatch(tag, tagOf(value)));
      }
      ;
      throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value.constructor.name]);
    };
  };
};
var readString = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("String");
};

// output/Control.Promise/index.js
var voidRight2 = /* @__PURE__ */ voidRight(functorEffect);
var mempty2 = /* @__PURE__ */ mempty(monoidCanceler);
var identity11 = /* @__PURE__ */ identity(categoryFn);
var alt2 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
var map6 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var readString2 = /* @__PURE__ */ readString(monadIdentity);
var toAff$prime = function(customCoerce) {
  return function(p) {
    return makeAff(function(cb) {
      return voidRight2(mempty2)(thenImpl(p)(function($14) {
        return cb(Left.create(customCoerce($14)))();
      })(function($15) {
        return cb(Right.create($15))();
      }));
    });
  };
};
var fromAff = function(aff) {
  return promise(function(succ) {
    return function(err) {
      return runAff_(either(err)(succ))(aff);
    };
  });
};
var coerce3 = function(fn) {
  return either(function(v) {
    return error("Promise failed, couldn't extract JS Error or String");
  })(identity11)(runExcept(alt2(unsafeReadTagged2("Error")(fn))(map6(error)(readString2(fn)))));
};
var toAff = /* @__PURE__ */ toAff$prime(coerce3);

// output/Data.Function.Uncurried/foreign.js
var mkFn2 = function(fn) {
  return function(a, b) {
    return fn(a)(b);
  };
};
var runFn4 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

// output/Data.Map.Internal/index.js
var Leaf2 = /* @__PURE__ */ function() {
  function Leaf3() {
  }
  ;
  Leaf3.value = new Leaf3();
  return Leaf3;
}();
var Two2 = /* @__PURE__ */ function() {
  function Two3(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  Two3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new Two3(value0, value1, value2, value3);
        };
      };
    };
  };
  return Two3;
}();
var Three2 = /* @__PURE__ */ function() {
  function Three3(value0, value1, value2, value3, value4, value5, value6) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
    this.value6 = value6;
  }
  ;
  Three3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return function(value6) {
                return new Three3(value0, value1, value2, value3, value4, value5, value6);
              };
            };
          };
        };
      };
    };
  };
  return Three3;
}();
var TwoLeft2 = /* @__PURE__ */ function() {
  function TwoLeft3(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  TwoLeft3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new TwoLeft3(value0, value1, value2);
      };
    };
  };
  return TwoLeft3;
}();
var TwoRight2 = /* @__PURE__ */ function() {
  function TwoRight3(value0, value1, value2) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
  }
  ;
  TwoRight3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return new TwoRight3(value0, value1, value2);
      };
    };
  };
  return TwoRight3;
}();
var ThreeLeft2 = /* @__PURE__ */ function() {
  function ThreeLeft3(value0, value1, value2, value3, value4, value5) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }
  ;
  ThreeLeft3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return new ThreeLeft3(value0, value1, value2, value3, value4, value5);
            };
          };
        };
      };
    };
  };
  return ThreeLeft3;
}();
var ThreeMiddle2 = /* @__PURE__ */ function() {
  function ThreeMiddle3(value0, value1, value2, value3, value4, value5) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }
  ;
  ThreeMiddle3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return new ThreeMiddle3(value0, value1, value2, value3, value4, value5);
            };
          };
        };
      };
    };
  };
  return ThreeMiddle3;
}();
var ThreeRight2 = /* @__PURE__ */ function() {
  function ThreeRight3(value0, value1, value2, value3, value4, value5) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }
  ;
  ThreeRight3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return function(value4) {
            return function(value5) {
              return new ThreeRight3(value0, value1, value2, value3, value4, value5);
            };
          };
        };
      };
    };
  };
  return ThreeRight3;
}();
var KickUp2 = /* @__PURE__ */ function() {
  function KickUp3(value0, value1, value2, value3) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }
  ;
  KickUp3.create = function(value0) {
    return function(value1) {
      return function(value2) {
        return function(value3) {
          return new KickUp3(value0, value1, value2, value3);
        };
      };
    };
  };
  return KickUp3;
}();
var lookup = function(dictOrd) {
  var compare5 = compare(dictOrd);
  return function(k) {
    var go = function($copy_v) {
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(v) {
        if (v instanceof Leaf2) {
          $tco_done = true;
          return Nothing.value;
        }
        ;
        if (v instanceof Two2) {
          var v2 = compare5(k)(v.value1);
          if (v2 instanceof EQ) {
            $tco_done = true;
            return new Just(v.value2);
          }
          ;
          if (v2 instanceof LT) {
            $copy_v = v.value0;
            return;
          }
          ;
          $copy_v = v.value3;
          return;
        }
        ;
        if (v instanceof Three2) {
          var v3 = compare5(k)(v.value1);
          if (v3 instanceof EQ) {
            $tco_done = true;
            return new Just(v.value2);
          }
          ;
          var v4 = compare5(k)(v.value4);
          if (v4 instanceof EQ) {
            $tco_done = true;
            return new Just(v.value5);
          }
          ;
          if (v3 instanceof LT) {
            $copy_v = v.value0;
            return;
          }
          ;
          if (v4 instanceof GT) {
            $copy_v = v.value6;
            return;
          }
          ;
          $copy_v = v.value3;
          return;
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 241, column 5 - line 241, column 22): " + [v.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($copy_v);
      }
      ;
      return $tco_result;
    };
    return go;
  };
};
var functorMap = {
  map: function(v) {
    return function(v1) {
      if (v1 instanceof Leaf2) {
        return Leaf2.value;
      }
      ;
      if (v1 instanceof Two2) {
        return new Two2(map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), map(functorMap)(v)(v1.value3));
      }
      ;
      if (v1 instanceof Three2) {
        return new Three2(map(functorMap)(v)(v1.value0), v1.value1, v(v1.value2), map(functorMap)(v)(v1.value3), v1.value4, v(v1.value5), map(functorMap)(v)(v1.value6));
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 116, column 1 - line 119, column 110): " + [v.constructor.name, v1.constructor.name]);
    };
  }
};
var functorWithIndexMap = {
  mapWithIndex: function(v) {
    return function(v1) {
      if (v1 instanceof Leaf2) {
        return Leaf2.value;
      }
      ;
      if (v1 instanceof Two2) {
        return new Two2(mapWithIndex(functorWithIndexMap)(v)(v1.value0), v1.value1, v(v1.value1)(v1.value2), mapWithIndex(functorWithIndexMap)(v)(v1.value3));
      }
      ;
      if (v1 instanceof Three2) {
        return new Three2(mapWithIndex(functorWithIndexMap)(v)(v1.value0), v1.value1, v(v1.value1)(v1.value2), mapWithIndex(functorWithIndexMap)(v)(v1.value3), v1.value4, v(v1.value4)(v1.value5), mapWithIndex(functorWithIndexMap)(v)(v1.value6));
      }
      ;
      throw new Error("Failed pattern match at Data.Map.Internal (line 121, column 1 - line 124, column 152): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorMap;
  }
};
var fromZipper2 = function($copy_dictOrd) {
  return function($copy_v) {
    return function($copy_v1) {
      var $tco_var_dictOrd = $copy_dictOrd;
      var $tco_var_v = $copy_v;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(dictOrd, v, v1) {
        if (v instanceof Nil) {
          $tco_done = true;
          return v1;
        }
        ;
        if (v instanceof Cons) {
          if (v.value0 instanceof TwoLeft2) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Two2(v1, v.value0.value0, v.value0.value1, v.value0.value2);
            return;
          }
          ;
          if (v.value0 instanceof TwoRight2) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Two2(v.value0.value0, v.value0.value1, v.value0.value2, v1);
            return;
          }
          ;
          if (v.value0 instanceof ThreeLeft2) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Three2(v1, v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5);
            return;
          }
          ;
          if (v.value0 instanceof ThreeMiddle2) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Three2(v.value0.value0, v.value0.value1, v.value0.value2, v1, v.value0.value3, v.value0.value4, v.value0.value5);
            return;
          }
          ;
          if (v.value0 instanceof ThreeRight2) {
            $tco_var_dictOrd = dictOrd;
            $tco_var_v = v.value1;
            $copy_v1 = new Three2(v.value0.value0, v.value0.value1, v.value0.value2, v.value0.value3, v.value0.value4, v.value0.value5, v1);
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 462, column 3 - line 467, column 88): " + [v.value0.constructor.name]);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 459, column 1 - line 459, column 80): " + [v.constructor.name, v1.constructor.name]);
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_dictOrd, $tco_var_v, $copy_v1);
      }
      ;
      return $tco_result;
    };
  };
};
var insert = function(dictOrd) {
  var fromZipper1 = fromZipper2(dictOrd);
  var compare5 = compare(dictOrd);
  return function(k) {
    return function(v) {
      var up = function($copy_v1) {
        return function($copy_v2) {
          var $tco_var_v1 = $copy_v1;
          var $tco_done = false;
          var $tco_result;
          function $tco_loop(v1, v2) {
            if (v1 instanceof Nil) {
              $tco_done = true;
              return new Two2(v2.value0, v2.value1, v2.value2, v2.value3);
            }
            ;
            if (v1 instanceof Cons) {
              if (v1.value0 instanceof TwoLeft2) {
                $tco_done = true;
                return fromZipper1(v1.value1)(new Three2(v2.value0, v2.value1, v2.value2, v2.value3, v1.value0.value0, v1.value0.value1, v1.value0.value2));
              }
              ;
              if (v1.value0 instanceof TwoRight2) {
                $tco_done = true;
                return fromZipper1(v1.value1)(new Three2(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0, v2.value1, v2.value2, v2.value3));
              }
              ;
              if (v1.value0 instanceof ThreeLeft2) {
                $tco_var_v1 = v1.value1;
                $copy_v2 = new KickUp2(new Two2(v2.value0, v2.value1, v2.value2, v2.value3), v1.value0.value0, v1.value0.value1, new Two2(v1.value0.value2, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                return;
              }
              ;
              if (v1.value0 instanceof ThreeMiddle2) {
                $tco_var_v1 = v1.value1;
                $copy_v2 = new KickUp2(new Two2(v1.value0.value0, v1.value0.value1, v1.value0.value2, v2.value0), v2.value1, v2.value2, new Two2(v2.value3, v1.value0.value3, v1.value0.value4, v1.value0.value5));
                return;
              }
              ;
              if (v1.value0 instanceof ThreeRight2) {
                $tco_var_v1 = v1.value1;
                $copy_v2 = new KickUp2(new Two2(v1.value0.value0, v1.value0.value1, v1.value0.value2, v1.value0.value3), v1.value0.value4, v1.value0.value5, new Two2(v2.value0, v2.value1, v2.value2, v2.value3));
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.Map.Internal (line 498, column 5 - line 503, column 108): " + [v1.value0.constructor.name, v2.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 495, column 3 - line 495, column 56): " + [v1.constructor.name, v2.constructor.name]);
          }
          ;
          while (!$tco_done) {
            $tco_result = $tco_loop($tco_var_v1, $copy_v2);
          }
          ;
          return $tco_result;
        };
      };
      var down = function($copy_v1) {
        return function($copy_v2) {
          var $tco_var_v1 = $copy_v1;
          var $tco_done1 = false;
          var $tco_result;
          function $tco_loop(v1, v2) {
            if (v2 instanceof Leaf2) {
              $tco_done1 = true;
              return up(v1)(new KickUp2(Leaf2.value, k, v, Leaf2.value));
            }
            ;
            if (v2 instanceof Two2) {
              var v3 = compare5(k)(v2.value1);
              if (v3 instanceof EQ) {
                $tco_done1 = true;
                return fromZipper1(v1)(new Two2(v2.value0, k, v, v2.value3));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_v1 = new Cons(new TwoLeft2(v2.value1, v2.value2, v2.value3), v1);
                $copy_v2 = v2.value0;
                return;
              }
              ;
              $tco_var_v1 = new Cons(new TwoRight2(v2.value0, v2.value1, v2.value2), v1);
              $copy_v2 = v2.value3;
              return;
            }
            ;
            if (v2 instanceof Three2) {
              var v3 = compare5(k)(v2.value1);
              if (v3 instanceof EQ) {
                $tco_done1 = true;
                return fromZipper1(v1)(new Three2(v2.value0, k, v, v2.value3, v2.value4, v2.value5, v2.value6));
              }
              ;
              var v4 = compare5(k)(v2.value4);
              if (v4 instanceof EQ) {
                $tco_done1 = true;
                return fromZipper1(v1)(new Three2(v2.value0, v2.value1, v2.value2, v2.value3, k, v, v2.value6));
              }
              ;
              if (v3 instanceof LT) {
                $tco_var_v1 = new Cons(new ThreeLeft2(v2.value1, v2.value2, v2.value3, v2.value4, v2.value5, v2.value6), v1);
                $copy_v2 = v2.value0;
                return;
              }
              ;
              if (v3 instanceof GT && v4 instanceof LT) {
                $tco_var_v1 = new Cons(new ThreeMiddle2(v2.value0, v2.value1, v2.value2, v2.value4, v2.value5, v2.value6), v1);
                $copy_v2 = v2.value3;
                return;
              }
              ;
              $tco_var_v1 = new Cons(new ThreeRight2(v2.value0, v2.value1, v2.value2, v2.value3, v2.value4, v2.value5), v1);
              $copy_v2 = v2.value6;
              return;
            }
            ;
            throw new Error("Failed pattern match at Data.Map.Internal (line 478, column 3 - line 478, column 55): " + [v1.constructor.name, v2.constructor.name]);
          }
          ;
          while (!$tco_done1) {
            $tco_result = $tco_loop($tco_var_v1, $copy_v2);
          }
          ;
          return $tco_result;
        };
      };
      return down(Nil.value);
    };
  };
};
var pop = function(dictOrd) {
  var fromZipper1 = fromZipper2(dictOrd);
  var compare5 = compare(dictOrd);
  return function(k) {
    var up = function($copy_ctxs) {
      return function($copy_tree) {
        var $tco_var_ctxs = $copy_ctxs;
        var $tco_done = false;
        var $tco_result;
        function $tco_loop(ctxs, tree) {
          if (ctxs instanceof Nil) {
            $tco_done = true;
            return tree;
          }
          ;
          if (ctxs instanceof Cons) {
            if (ctxs.value0 instanceof TwoLeft2 && (ctxs.value0.value2 instanceof Leaf2 && tree instanceof Leaf2)) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(Leaf2.value, ctxs.value0.value0, ctxs.value0.value1, Leaf2.value));
            }
            ;
            if (ctxs.value0 instanceof TwoRight2 && (ctxs.value0.value0 instanceof Leaf2 && tree instanceof Leaf2)) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(Leaf2.value, ctxs.value0.value1, ctxs.value0.value2, Leaf2.value));
            }
            ;
            if (ctxs.value0 instanceof TwoLeft2 && ctxs.value0.value2 instanceof Two2) {
              $tco_var_ctxs = ctxs.value1;
              $copy_tree = new Three2(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3);
              return;
            }
            ;
            if (ctxs.value0 instanceof TwoRight2 && ctxs.value0.value0 instanceof Two2) {
              $tco_var_ctxs = ctxs.value1;
              $copy_tree = new Three2(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree);
              return;
            }
            ;
            if (ctxs.value0 instanceof TwoLeft2 && ctxs.value0.value2 instanceof Three2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(new Two2(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two2(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6)));
            }
            ;
            if (ctxs.value0 instanceof TwoRight2 && ctxs.value0.value0 instanceof Three2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(new Two2(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two2(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree)));
            }
            ;
            if (ctxs.value0 instanceof ThreeLeft2 && (ctxs.value0.value2 instanceof Leaf2 && (ctxs.value0.value5 instanceof Leaf2 && tree instanceof Leaf2))) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Three2(Leaf2.value, ctxs.value0.value0, ctxs.value0.value1, Leaf2.value, ctxs.value0.value3, ctxs.value0.value4, Leaf2.value));
            }
            ;
            if (ctxs.value0 instanceof ThreeMiddle2 && (ctxs.value0.value0 instanceof Leaf2 && (ctxs.value0.value5 instanceof Leaf2 && tree instanceof Leaf2))) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Three2(Leaf2.value, ctxs.value0.value1, ctxs.value0.value2, Leaf2.value, ctxs.value0.value3, ctxs.value0.value4, Leaf2.value));
            }
            ;
            if (ctxs.value0 instanceof ThreeRight2 && (ctxs.value0.value0 instanceof Leaf2 && (ctxs.value0.value3 instanceof Leaf2 && tree instanceof Leaf2))) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Three2(Leaf2.value, ctxs.value0.value1, ctxs.value0.value2, Leaf2.value, ctxs.value0.value4, ctxs.value0.value5, Leaf2.value));
            }
            ;
            if (ctxs.value0 instanceof ThreeLeft2 && ctxs.value0.value2 instanceof Two2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(new Three2(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0, ctxs.value0.value2.value1, ctxs.value0.value2.value2, ctxs.value0.value2.value3), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
            }
            ;
            if (ctxs.value0 instanceof ThreeMiddle2 && ctxs.value0.value0 instanceof Two2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(new Three2(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
            }
            ;
            if (ctxs.value0 instanceof ThreeMiddle2 && ctxs.value0.value5 instanceof Two2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three2(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0, ctxs.value0.value5.value1, ctxs.value0.value5.value2, ctxs.value0.value5.value3)));
            }
            ;
            if (ctxs.value0 instanceof ThreeRight2 && ctxs.value0.value3 instanceof Two2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Two2(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Three2(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3, ctxs.value0.value4, ctxs.value0.value5, tree)));
            }
            ;
            if (ctxs.value0 instanceof ThreeLeft2 && ctxs.value0.value2 instanceof Three2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Three2(new Two2(tree, ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2.value0), ctxs.value0.value2.value1, ctxs.value0.value2.value2, new Two2(ctxs.value0.value2.value3, ctxs.value0.value2.value4, ctxs.value0.value2.value5, ctxs.value0.value2.value6), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
            }
            ;
            if (ctxs.value0 instanceof ThreeMiddle2 && ctxs.value0.value0 instanceof Three2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Three2(new Two2(ctxs.value0.value0.value0, ctxs.value0.value0.value1, ctxs.value0.value0.value2, ctxs.value0.value0.value3), ctxs.value0.value0.value4, ctxs.value0.value0.value5, new Two2(ctxs.value0.value0.value6, ctxs.value0.value1, ctxs.value0.value2, tree), ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5));
            }
            ;
            if (ctxs.value0 instanceof ThreeMiddle2 && ctxs.value0.value5 instanceof Three2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Three2(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two2(tree, ctxs.value0.value3, ctxs.value0.value4, ctxs.value0.value5.value0), ctxs.value0.value5.value1, ctxs.value0.value5.value2, new Two2(ctxs.value0.value5.value3, ctxs.value0.value5.value4, ctxs.value0.value5.value5, ctxs.value0.value5.value6)));
            }
            ;
            if (ctxs.value0 instanceof ThreeRight2 && ctxs.value0.value3 instanceof Three2) {
              $tco_done = true;
              return fromZipper1(ctxs.value1)(new Three2(ctxs.value0.value0, ctxs.value0.value1, ctxs.value0.value2, new Two2(ctxs.value0.value3.value0, ctxs.value0.value3.value1, ctxs.value0.value3.value2, ctxs.value0.value3.value3), ctxs.value0.value3.value4, ctxs.value0.value3.value5, new Two2(ctxs.value0.value3.value6, ctxs.value0.value4, ctxs.value0.value5, tree)));
            }
            ;
            $tco_done = true;
            return unsafeCrashWith("The impossible happened in partial function `up`.");
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 552, column 5 - line 573, column 86): " + [ctxs.constructor.name]);
        }
        ;
        while (!$tco_done) {
          $tco_result = $tco_loop($tco_var_ctxs, $copy_tree);
        }
        ;
        return $tco_result;
      };
    };
    var removeMaxNode = function($copy_ctx) {
      return function($copy_m) {
        var $tco_var_ctx = $copy_ctx;
        var $tco_done1 = false;
        var $tco_result;
        function $tco_loop(ctx, m) {
          if (m instanceof Two2 && (m.value0 instanceof Leaf2 && m.value3 instanceof Leaf2)) {
            $tco_done1 = true;
            return up(ctx)(Leaf2.value);
          }
          ;
          if (m instanceof Two2) {
            $tco_var_ctx = new Cons(new TwoRight2(m.value0, m.value1, m.value2), ctx);
            $copy_m = m.value3;
            return;
          }
          ;
          if (m instanceof Three2 && (m.value0 instanceof Leaf2 && (m.value3 instanceof Leaf2 && m.value6 instanceof Leaf2))) {
            $tco_done1 = true;
            return up(new Cons(new TwoRight2(Leaf2.value, m.value1, m.value2), ctx))(Leaf2.value);
          }
          ;
          if (m instanceof Three2) {
            $tco_var_ctx = new Cons(new ThreeRight2(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
            $copy_m = m.value6;
            return;
          }
          ;
          $tco_done1 = true;
          return unsafeCrashWith("The impossible happened in partial function `removeMaxNode`.");
        }
        ;
        while (!$tco_done1) {
          $tco_result = $tco_loop($tco_var_ctx, $copy_m);
        }
        ;
        return $tco_result;
      };
    };
    var maxNode = function($copy_m) {
      var $tco_done2 = false;
      var $tco_result;
      function $tco_loop(m) {
        if (m instanceof Two2 && m.value3 instanceof Leaf2) {
          $tco_done2 = true;
          return {
            key: m.value1,
            value: m.value2
          };
        }
        ;
        if (m instanceof Two2) {
          $copy_m = m.value3;
          return;
        }
        ;
        if (m instanceof Three2 && m.value6 instanceof Leaf2) {
          $tco_done2 = true;
          return {
            key: m.value4,
            value: m.value5
          };
        }
        ;
        if (m instanceof Three2) {
          $copy_m = m.value6;
          return;
        }
        ;
        $tco_done2 = true;
        return unsafeCrashWith("The impossible happened in partial function `maxNode`.");
      }
      ;
      while (!$tco_done2) {
        $tco_result = $tco_loop($copy_m);
      }
      ;
      return $tco_result;
    };
    var down = function($copy_ctx) {
      return function($copy_m) {
        var $tco_var_ctx = $copy_ctx;
        var $tco_done3 = false;
        var $tco_result;
        function $tco_loop(ctx, m) {
          if (m instanceof Leaf2) {
            $tco_done3 = true;
            return Nothing.value;
          }
          ;
          if (m instanceof Two2) {
            var v = compare5(k)(m.value1);
            if (m.value3 instanceof Leaf2 && v instanceof EQ) {
              $tco_done3 = true;
              return new Just(new Tuple(m.value2, up(ctx)(Leaf2.value)));
            }
            ;
            if (v instanceof EQ) {
              var max3 = maxNode(m.value0);
              $tco_done3 = true;
              return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new TwoLeft2(max3.key, max3.value, m.value3), ctx))(m.value0)));
            }
            ;
            if (v instanceof LT) {
              $tco_var_ctx = new Cons(new TwoLeft2(m.value1, m.value2, m.value3), ctx);
              $copy_m = m.value0;
              return;
            }
            ;
            $tco_var_ctx = new Cons(new TwoRight2(m.value0, m.value1, m.value2), ctx);
            $copy_m = m.value3;
            return;
          }
          ;
          if (m instanceof Three2) {
            var leaves = function() {
              if (m.value0 instanceof Leaf2 && (m.value3 instanceof Leaf2 && m.value6 instanceof Leaf2)) {
                return true;
              }
              ;
              return false;
            }();
            var v = compare5(k)(m.value4);
            var v3 = compare5(k)(m.value1);
            if (leaves && v3 instanceof EQ) {
              $tco_done3 = true;
              return new Just(new Tuple(m.value2, fromZipper1(ctx)(new Two2(Leaf2.value, m.value4, m.value5, Leaf2.value))));
            }
            ;
            if (leaves && v instanceof EQ) {
              $tco_done3 = true;
              return new Just(new Tuple(m.value5, fromZipper1(ctx)(new Two2(Leaf2.value, m.value1, m.value2, Leaf2.value))));
            }
            ;
            if (v3 instanceof EQ) {
              var max3 = maxNode(m.value0);
              $tco_done3 = true;
              return new Just(new Tuple(m.value2, removeMaxNode(new Cons(new ThreeLeft2(max3.key, max3.value, m.value3, m.value4, m.value5, m.value6), ctx))(m.value0)));
            }
            ;
            if (v instanceof EQ) {
              var max3 = maxNode(m.value3);
              $tco_done3 = true;
              return new Just(new Tuple(m.value5, removeMaxNode(new Cons(new ThreeMiddle2(m.value0, m.value1, m.value2, max3.key, max3.value, m.value6), ctx))(m.value3)));
            }
            ;
            if (v3 instanceof LT) {
              $tco_var_ctx = new Cons(new ThreeLeft2(m.value1, m.value2, m.value3, m.value4, m.value5, m.value6), ctx);
              $copy_m = m.value0;
              return;
            }
            ;
            if (v3 instanceof GT && v instanceof LT) {
              $tco_var_ctx = new Cons(new ThreeMiddle2(m.value0, m.value1, m.value2, m.value4, m.value5, m.value6), ctx);
              $copy_m = m.value3;
              return;
            }
            ;
            $tco_var_ctx = new Cons(new ThreeRight2(m.value0, m.value1, m.value2, m.value3, m.value4, m.value5), ctx);
            $copy_m = m.value6;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.Map.Internal (line 525, column 16 - line 548, column 80): " + [m.constructor.name]);
        }
        ;
        while (!$tco_done3) {
          $tco_result = $tco_loop($tco_var_ctx, $copy_m);
        }
        ;
        return $tco_result;
      };
    };
    return down(Nil.value);
  };
};
var foldableMap = {
  foldr: function(f) {
    return function(z) {
      return function(m) {
        if (m instanceof Leaf2) {
          return z;
        }
        ;
        if (m instanceof Two2) {
          return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(z)(m.value3)))(m.value0);
        }
        ;
        if (m instanceof Three2) {
          return foldr(foldableMap)(f)(f(m.value2)(foldr(foldableMap)(f)(f(m.value5)(foldr(foldableMap)(f)(z)(m.value6)))(m.value3)))(m.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 133, column 17 - line 136, column 85): " + [m.constructor.name]);
      };
    };
  },
  foldl: function(f) {
    return function(z) {
      return function(m) {
        if (m instanceof Leaf2) {
          return z;
        }
        ;
        if (m instanceof Two2) {
          return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3);
        }
        ;
        if (m instanceof Three2) {
          return foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(f(foldl(foldableMap)(f)(z)(m.value0))(m.value2))(m.value3))(m.value5))(m.value6);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 137, column 17 - line 140, column 85): " + [m.constructor.name]);
      };
    };
  },
  foldMap: function(dictMonoid) {
    var mempty5 = mempty(dictMonoid);
    var append22 = append(dictMonoid.Semigroup0());
    return function(f) {
      return function(m) {
        if (m instanceof Leaf2) {
          return mempty5;
        }
        ;
        if (m instanceof Two2) {
          return append22(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append22(f(m.value2))(foldMap(foldableMap)(dictMonoid)(f)(m.value3)));
        }
        ;
        if (m instanceof Three2) {
          return append22(foldMap(foldableMap)(dictMonoid)(f)(m.value0))(append22(f(m.value2))(append22(foldMap(foldableMap)(dictMonoid)(f)(m.value3))(append22(f(m.value5))(foldMap(foldableMap)(dictMonoid)(f)(m.value6)))));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 141, column 17 - line 144, column 93): " + [m.constructor.name]);
      };
    };
  }
};
var foldableWithIndexMap = {
  foldrWithIndex: function(f) {
    return function(z) {
      return function(m) {
        if (m instanceof Leaf2) {
          return z;
        }
        ;
        if (m instanceof Two2) {
          return foldrWithIndex(foldableWithIndexMap)(f)(f(m.value1)(m.value2)(foldrWithIndex(foldableWithIndexMap)(f)(z)(m.value3)))(m.value0);
        }
        ;
        if (m instanceof Three2) {
          return foldrWithIndex(foldableWithIndexMap)(f)(f(m.value1)(m.value2)(foldrWithIndex(foldableWithIndexMap)(f)(f(m.value4)(m.value5)(foldrWithIndex(foldableWithIndexMap)(f)(z)(m.value6)))(m.value3)))(m.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 147, column 26 - line 150, column 120): " + [m.constructor.name]);
      };
    };
  },
  foldlWithIndex: function(f) {
    return function(z) {
      return function(m) {
        if (m instanceof Leaf2) {
          return z;
        }
        ;
        if (m instanceof Two2) {
          return foldlWithIndex(foldableWithIndexMap)(f)(f(m.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z)(m.value0))(m.value2))(m.value3);
        }
        ;
        if (m instanceof Three2) {
          return foldlWithIndex(foldableWithIndexMap)(f)(f(m.value4)(foldlWithIndex(foldableWithIndexMap)(f)(f(m.value1)(foldlWithIndex(foldableWithIndexMap)(f)(z)(m.value0))(m.value2))(m.value3))(m.value5))(m.value6);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 151, column 26 - line 154, column 120): " + [m.constructor.name]);
      };
    };
  },
  foldMapWithIndex: function(dictMonoid) {
    var mempty5 = mempty(dictMonoid);
    var append22 = append(dictMonoid.Semigroup0());
    return function(f) {
      return function(m) {
        if (m instanceof Leaf2) {
          return mempty5;
        }
        ;
        if (m instanceof Two2) {
          return append22(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value0))(append22(f(m.value1)(m.value2))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value3)));
        }
        ;
        if (m instanceof Three2) {
          return append22(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value0))(append22(f(m.value1)(m.value2))(append22(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value3))(append22(f(m.value4)(m.value5))(foldMapWithIndex(foldableWithIndexMap)(dictMonoid)(f)(m.value6)))));
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 155, column 26 - line 158, column 128): " + [m.constructor.name]);
      };
    };
  },
  Foldable0: function() {
    return foldableMap;
  }
};
var foldlWithIndex2 = /* @__PURE__ */ foldlWithIndex(foldableWithIndexMap);
var empty2 = /* @__PURE__ */ function() {
  return Leaf2.value;
}();
var fromFoldable2 = function(dictOrd) {
  var insert1 = insert(dictOrd);
  return function(dictFoldable) {
    return foldl(dictFoldable)(function(m) {
      return function(v) {
        return insert1(v.value0)(v.value1)(m);
      };
    })(empty2);
  };
};
var fromFoldableWithIndex = function(dictOrd) {
  var insert1 = insert(dictOrd);
  return function(dictFoldableWithIndex) {
    return foldlWithIndex(dictFoldableWithIndex)(function(k) {
      return function(m) {
        return function(v) {
          return insert1(k)(v)(m);
        };
      };
    })(empty2);
  };
};
var $$delete = function(dictOrd) {
  var pop1 = pop(dictOrd);
  return function(k) {
    return function(m) {
      return maybe(m)(snd)(pop1(k)(m));
    };
  };
};
var alter = function(dictOrd) {
  var lookup1 = lookup(dictOrd);
  var delete1 = $$delete(dictOrd);
  var insert1 = insert(dictOrd);
  return function(f) {
    return function(k) {
      return function(m) {
        var v = f(lookup1(k)(m));
        if (v instanceof Nothing) {
          return delete1(k)(m);
        }
        ;
        if (v instanceof Just) {
          return insert1(k)(v.value0)(m);
        }
        ;
        throw new Error("Failed pattern match at Data.Map.Internal (line 596, column 15 - line 598, column 25): " + [v.constructor.name]);
      };
    };
  };
};
var unionWith = function(dictOrd) {
  var alter1 = alter(dictOrd);
  return function(f) {
    return function(m1) {
      return function(m2) {
        var go = function(k) {
          return function(m) {
            return function(v) {
              return alter1(function() {
                var $936 = maybe(v)(f(v));
                return function($937) {
                  return Just.create($936($937));
                };
              }())(k)(m);
            };
          };
        };
        return foldlWithIndex2(go)(m2)(m1);
      };
    };
  };
};
var union2 = function(dictOrd) {
  return unionWith(dictOrd)($$const);
};
var unions = function(dictOrd) {
  var union1 = union2(dictOrd);
  return function(dictFoldable) {
    return foldl(dictFoldable)(union1)(empty2);
  };
};

// output/Data.Nullable/foreign.js
function nullable(a, r, f) {
  return a == null ? r : f(a);
}

// output/Data.Nullable/index.js
var toMaybe = function(n) {
  return nullable(n, Nothing.value, Just.create);
};

// output/Foreign.Object/foreign.js
function _copyST(m) {
  return function() {
    var r = {};
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r[k] = m[k];
      }
    }
    return r;
  };
}
var empty3 = {};
function runST(f) {
  return f();
}
function _foldM(bind6) {
  return function(f) {
    return function(mz) {
      return function(m) {
        var acc = mz;
        function g(k2) {
          return function(z) {
            return f(z)(k2)(m[k2]);
          };
        }
        for (var k in m) {
          if (hasOwnProperty.call(m, k)) {
            acc = bind6(acc)(g(k));
          }
        }
        return acc;
      };
    };
  };
}
function _lookup(no, yes, k, m) {
  return k in m ? yes(m[k]) : no;
}
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});

// output/Control.Monad.ST.Internal/foreign.js
var map_ = function(f) {
  return function(a) {
    return function() {
      return f(a());
    };
  };
};
var pure_ = function(a) {
  return function() {
    return a;
  };
};
var bind_ = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};
var foreach = function(as) {
  return function(f) {
    return function() {
      for (var i = 0, l = as.length; i < l; i++) {
        f(as[i])();
      }
    };
  };
};

// output/Control.Monad.ST.Internal/index.js
var $runtime_lazy3 = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var functorST = {
  map: map_
};
var monadST = {
  Applicative0: function() {
    return applicativeST;
  },
  Bind1: function() {
    return bindST;
  }
};
var bindST = {
  bind: bind_,
  Apply0: function() {
    return $lazy_applyST(0);
  }
};
var applicativeST = {
  pure: pure_,
  Apply0: function() {
    return $lazy_applyST(0);
  }
};
var $lazy_applyST = /* @__PURE__ */ $runtime_lazy3("applyST", "Control.Monad.ST.Internal", function() {
  return {
    apply: ap(monadST),
    Functor0: function() {
      return functorST;
    }
  };
});

// output/Data.Array/foreign.js
var range2 = function(start) {
  return function(end) {
    var step2 = start > end ? -1 : 1;
    var result = new Array(step2 * (end - start) + 1);
    var i = start, n = 0;
    while (i !== end) {
      result[n++] = i;
      i += step2;
    }
    result[n] = i;
    return result;
  };
};
var replicateFill = function(count) {
  return function(value) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value);
  };
};
var replicatePolyfill = function(count) {
  return function(value) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value;
    }
    return result;
  };
};
var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons3(head3, tail2) {
    this.head = head3;
    this.tail = tail2;
  }
  var emptyList = {};
  function curryCons(head3) {
    return function(tail2) {
      return new Cons3(head3, tail2);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr4) {
    return function(xs) {
      return listToArray(foldr4(curryCons)(emptyList)(xs));
    };
  };
}();
var length3 = function(xs) {
  return xs.length;
};
var indexImpl = function(just) {
  return function(nothing) {
    return function(xs) {
      return function(i) {
        return i < 0 || i >= xs.length ? nothing : just(xs[i]);
      };
    };
  };
};
var findIndexImpl = function(just) {
  return function(nothing) {
    return function(f) {
      return function(xs) {
        for (var i = 0, l = xs.length; i < l; i++) {
          if (f(xs[i]))
            return just(i);
        }
        return nothing;
      };
    };
  };
};
var filter3 = function(f) {
  return function(xs) {
    return xs.filter(f);
  };
};
var sortByImpl = function() {
  function mergeFromTo(compare5, fromOrdering, xs1, xs2, from3, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from3 + (to - from3 >> 1);
    if (mid - from3 > 1)
      mergeFromTo(compare5, fromOrdering, xs2, xs1, from3, mid);
    if (to - mid > 1)
      mergeFromTo(compare5, fromOrdering, xs2, xs1, mid, to);
    i = from3;
    j = mid;
    k = from3;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare5(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare5) {
    return function(fromOrdering) {
      return function(xs) {
        var out;
        if (xs.length < 2)
          return xs;
        out = xs.slice(0);
        mergeFromTo(compare5, fromOrdering, out, xs.slice(0), 0, xs.length);
        return out;
      };
    };
  };
}();
var zipWith2 = function(f) {
  return function(xs) {
    return function(ys) {
      var l = xs.length < ys.length ? xs.length : ys.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(xs[i])(ys[i]);
      }
      return result;
    };
  };
};
var unsafeIndexImpl = function(xs) {
  return function(n) {
    return xs[n];
  };
};

// output/Data.Array.ST/foreign.js
var pushAll = function(as) {
  return function(xs) {
    return function() {
      return xs.push.apply(xs, as);
    };
  };
};
var unsafeFreeze = function(xs) {
  return function() {
    return xs;
  };
};
var unsafeThaw = function(xs) {
  return function() {
    return xs;
  };
};
var sortByImpl2 = function() {
  function mergeFromTo(compare5, fromOrdering, xs1, xs2, from3, to) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from3 + (to - from3 >> 1);
    if (mid - from3 > 1)
      mergeFromTo(compare5, fromOrdering, xs2, xs1, from3, mid);
    if (to - mid > 1)
      mergeFromTo(compare5, fromOrdering, xs2, xs1, mid, to);
    i = from3;
    j = mid;
    k = from3;
    while (i < mid && j < to) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare5(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
    }
    while (j < to) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare5) {
    return function(fromOrdering) {
      return function(xs) {
        return function() {
          if (xs.length < 2)
            return xs;
          mergeFromTo(compare5, fromOrdering, xs, xs.slice(0), 0, xs.length);
          return xs;
        };
      };
    };
  };
}();

// output/Data.Array.ST/index.js
var push = function(a) {
  return pushAll([a]);
};

// output/Data.Array/index.js
var map7 = /* @__PURE__ */ map(functorST);
var when2 = /* @__PURE__ */ when(applicativeST);
var $$void3 = /* @__PURE__ */ $$void(functorST);
var map22 = /* @__PURE__ */ map(functorArray);
var fromJust4 = /* @__PURE__ */ fromJust();
var notEq3 = /* @__PURE__ */ notEq(eqOrdering);
var unsafeIndex = function() {
  return unsafeIndexImpl;
};
var sortBy2 = function(comp) {
  return sortByImpl(comp)(function(v) {
    if (v instanceof GT) {
      return 1;
    }
    ;
    if (v instanceof EQ) {
      return 0;
    }
    ;
    if (v instanceof LT) {
      return -1 | 0;
    }
    ;
    throw new Error("Failed pattern match at Data.Array (line 829, column 31 - line 832, column 11): " + [v.constructor.name]);
  });
};
var sortWith = function(dictOrd) {
  var comparing2 = comparing(dictOrd);
  return function(f) {
    return sortBy2(comparing2(f));
  };
};
var sortWith1 = /* @__PURE__ */ sortWith(ordInt);
var singleton6 = function(a) {
  return [a];
};
var $$null = function(xs) {
  return length3(xs) === 0;
};
var mapWithIndex3 = function(f) {
  return function(xs) {
    return zipWith2(f)(range2(0)(length3(xs) - 1 | 0))(xs);
  };
};
var index2 = /* @__PURE__ */ function() {
  return indexImpl(Just.create)(Nothing.value);
}();
var last2 = function(xs) {
  return index2(xs)(length3(xs) - 1 | 0);
};
var head2 = function(xs) {
  return index2(xs)(0);
};
var nubBy2 = function(comp) {
  return function(xs) {
    var indexedAndSorted = sortBy2(function(x) {
      return function(y) {
        return comp(snd(x))(snd(y));
      };
    })(mapWithIndex3(Tuple.create)(xs));
    var v = head2(indexedAndSorted);
    if (v instanceof Nothing) {
      return [];
    }
    ;
    if (v instanceof Just) {
      return map22(snd)(sortWith1(fst)(function __do() {
        var result = unsafeThaw(singleton6(v.value0))();
        foreach(indexedAndSorted)(function(v1) {
          return function __do2() {
            var lst = map7(function() {
              var $181 = function($183) {
                return fromJust4(last2($183));
              };
              return function($182) {
                return snd($181($182));
              };
            }())(unsafeFreeze(result))();
            return when2(notEq3(comp(lst)(v1.value1))(EQ.value))($$void3(push(v1)(result)))();
          };
        })();
        return unsafeFreeze(result)();
      }()));
    }
    ;
    throw new Error("Failed pattern match at Data.Array (line 1044, column 17 - line 1052, column 29): " + [v.constructor.name]);
  };
};
var nub2 = function(dictOrd) {
  return nubBy2(compare(dictOrd));
};
var fromFoldable3 = function(dictFoldable) {
  return fromFoldableImpl(foldr(dictFoldable));
};
var findIndex2 = /* @__PURE__ */ function() {
  return findIndexImpl(Just.create)(Nothing.value);
}();
var elemIndex = function(dictEq) {
  var eq22 = eq(dictEq);
  return function(x) {
    return findIndex2(function(v) {
      return eq22(v)(x);
    });
  };
};
var notElem2 = function(dictEq) {
  var elemIndex1 = elemIndex(dictEq);
  return function(a) {
    return function(arr) {
      return isNothing(elemIndex1(a)(arr));
    };
  };
};
var elem2 = function(dictEq) {
  var elemIndex1 = elemIndex(dictEq);
  return function(a) {
    return function(arr) {
      return isJust(elemIndex1(a)(arr));
    };
  };
};
var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
var mapMaybe2 = function(f) {
  return concatMap(function() {
    var $187 = maybe([])(singleton6);
    return function($188) {
      return $187(f($188));
    };
  }());
};
var catMaybes2 = /* @__PURE__ */ mapMaybe2(/* @__PURE__ */ identity(categoryFn));

// output/Foreign.Object.ST/foreign.js
function poke2(k) {
  return function(v) {
    return function(m) {
      return function() {
        m[k] = v;
        return m;
      };
    };
  };
}

// output/Foreign.Object/index.js
var foldr3 = /* @__PURE__ */ foldr(foldableArray);
var values = /* @__PURE__ */ toArrayWithKey(function(v) {
  return function(v1) {
    return v1;
  };
});
var thawST = _copyST;
var mutate = function(f) {
  return function(m) {
    return runST(function __do() {
      var s = thawST(m)();
      f(s)();
      return s;
    });
  };
};
var lookup2 = /* @__PURE__ */ function() {
  return runFn4(_lookup)(Nothing.value)(Just.create);
}();
var insert2 = function(k) {
  return function(v) {
    return mutate(poke2(k)(v));
  };
};
var foldM2 = function(dictMonad) {
  var bind13 = bind(dictMonad.Bind1());
  var pure12 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(z) {
      return _foldM(bind13)(f)(pure12(z));
    };
  };
};
var foldM1 = /* @__PURE__ */ foldM2(monadST);
var unionWith2 = function(f) {
  return function(m1) {
    return function(m2) {
      return mutate(function(s1) {
        return foldM1(function(s2) {
          return function(k) {
            return function(v1) {
              return poke2(k)(_lookup(v1, function(v2) {
                return f(v1)(v2);
              }, k, m2))(s2);
            };
          };
        })(s1)(m1);
      })(m2);
    };
  };
};
var semigroupObject = function(dictSemigroup) {
  return {
    append: unionWith2(append(dictSemigroup))
  };
};
var monoidObject = function(dictSemigroup) {
  var semigroupObject1 = semigroupObject(dictSemigroup);
  return {
    mempty: empty3,
    Semigroup0: function() {
      return semigroupObject1;
    }
  };
};
var fold2 = /* @__PURE__ */ _foldM(applyFlipped);
var foldMap2 = function(dictMonoid) {
  var append14 = append(dictMonoid.Semigroup0());
  var mempty5 = mempty(dictMonoid);
  return function(f) {
    return fold2(function(acc) {
      return function(k) {
        return function(v) {
          return append14(acc)(f(k)(v));
        };
      };
    })(mempty5);
  };
};
var foldableObject = {
  foldl: function(f) {
    return fold2(function(z) {
      return function(v) {
        return f(z);
      };
    });
  },
  foldr: function(f) {
    return function(z) {
      return function(m) {
        return foldr3(f)(z)(values(m));
      };
    };
  },
  foldMap: function(dictMonoid) {
    var foldMap14 = foldMap2(dictMonoid);
    return function(f) {
      return foldMap14($$const(f));
    };
  }
};
var foldableWithIndexObject = {
  foldlWithIndex: function(f) {
    return fold2(flip(f));
  },
  foldrWithIndex: function(f) {
    return function(z) {
      return function(m) {
        return foldr3(uncurry(f))(z)(toArrayWithKey(Tuple.create)(m));
      };
    };
  },
  foldMapWithIndex: function(dictMonoid) {
    return foldMap2(dictMonoid);
  },
  Foldable0: function() {
    return foldableObject;
  }
};

// output/Data.Argonaut.Core/foreign.js
function id(x) {
  return x;
}
var jsonNull = null;
function stringify(j) {
  return JSON.stringify(j);
}
function _caseJson(isNull3, isBool, isNum, isStr, isArr, isObj, j) {
  if (j == null)
    return isNull3();
  else if (typeof j === "boolean")
    return isBool(j);
  else if (typeof j === "number")
    return isNum(j);
  else if (typeof j === "string")
    return isStr(j);
  else if (Object.prototype.toString.call(j) === "[object Array]")
    return isArr(j);
  else
    return isObj(j);
}

// output/Data.Argonaut.Core/index.js
var verbJsonType = function(def) {
  return function(f) {
    return function(g) {
      return g(def)(f);
    };
  };
};
var toJsonType = /* @__PURE__ */ function() {
  return verbJsonType(Nothing.value)(Just.create);
}();
var isJsonType = /* @__PURE__ */ verbJsonType(false)(/* @__PURE__ */ $$const(true));
var caseJsonString = function(d) {
  return function(f) {
    return function(j) {
      return _caseJson($$const(d), $$const(d), $$const(d), f, $$const(d), $$const(d), j);
    };
  };
};
var caseJsonObject = function(d) {
  return function(f) {
    return function(j) {
      return _caseJson($$const(d), $$const(d), $$const(d), $$const(d), $$const(d), f, j);
    };
  };
};
var toObject = /* @__PURE__ */ toJsonType(caseJsonObject);
var caseJsonNull = function(d) {
  return function(f) {
    return function(j) {
      return _caseJson(f, $$const(d), $$const(d), $$const(d), $$const(d), $$const(d), j);
    };
  };
};
var isNull2 = /* @__PURE__ */ isJsonType(caseJsonNull);
var caseJsonBoolean = function(d) {
  return function(f) {
    return function(j) {
      return _caseJson($$const(d), f, $$const(d), $$const(d), $$const(d), $$const(d), j);
    };
  };
};
var caseJsonArray = function(d) {
  return function(f) {
    return function(j) {
      return _caseJson($$const(d), $$const(d), $$const(d), $$const(d), f, $$const(d), j);
    };
  };
};
var toArray = /* @__PURE__ */ toJsonType(caseJsonArray);

// output/Data.Argonaut.Decode.Error/index.js
var show1 = /* @__PURE__ */ show(showInt);
var TypeMismatch2 = /* @__PURE__ */ function() {
  function TypeMismatch3(value0) {
    this.value0 = value0;
  }
  ;
  TypeMismatch3.create = function(value0) {
    return new TypeMismatch3(value0);
  };
  return TypeMismatch3;
}();
var UnexpectedValue = /* @__PURE__ */ function() {
  function UnexpectedValue2(value0) {
    this.value0 = value0;
  }
  ;
  UnexpectedValue2.create = function(value0) {
    return new UnexpectedValue2(value0);
  };
  return UnexpectedValue2;
}();
var AtIndex = /* @__PURE__ */ function() {
  function AtIndex2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  AtIndex2.create = function(value0) {
    return function(value1) {
      return new AtIndex2(value0, value1);
    };
  };
  return AtIndex2;
}();
var AtKey = /* @__PURE__ */ function() {
  function AtKey2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  AtKey2.create = function(value0) {
    return function(value1) {
      return new AtKey2(value0, value1);
    };
  };
  return AtKey2;
}();
var Named = /* @__PURE__ */ function() {
  function Named2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Named2.create = function(value0) {
    return function(value1) {
      return new Named2(value0, value1);
    };
  };
  return Named2;
}();
var MissingValue = /* @__PURE__ */ function() {
  function MissingValue2() {
  }
  ;
  MissingValue2.value = new MissingValue2();
  return MissingValue2;
}();
var printJsonDecodeError = function(err) {
  var go = function(v) {
    if (v instanceof TypeMismatch2) {
      return "  Expected value of type '" + (v.value0 + "'.");
    }
    ;
    if (v instanceof UnexpectedValue) {
      return "  Unexpected value " + (stringify(v.value0) + ".");
    }
    ;
    if (v instanceof AtIndex) {
      return "  At array index " + (show1(v.value0) + (":\n" + go(v.value1)));
    }
    ;
    if (v instanceof AtKey) {
      return "  At object key '" + (v.value0 + ("':\n" + go(v.value1)));
    }
    ;
    if (v instanceof Named) {
      return "  Under '" + (v.value0 + ("':\n" + go(v.value1)));
    }
    ;
    if (v instanceof MissingValue) {
      return "  No value was found.";
    }
    ;
    throw new Error("Failed pattern match at Data.Argonaut.Decode.Error (line 37, column 8 - line 43, column 44): " + [v.constructor.name]);
  };
  return "An error occurred while decoding a JSON value:\n" + go(err);
};

// output/Data.Array.NonEmpty.Internal/foreign.js
var traverse1Impl = function() {
  function Cont(fn) {
    this.fn = fn;
  }
  var emptyList = {};
  var ConsCell = function(head3, tail2) {
    this.head = head3;
    this.tail = tail2;
  };
  function finalCell(head3) {
    return new ConsCell(head3, emptyList);
  }
  function consList(x) {
    return function(xs) {
      return new ConsCell(x, xs);
    };
  }
  function listToArray(list) {
    var arr = [];
    var xs = list;
    while (xs !== emptyList) {
      arr.push(xs.head);
      xs = xs.tail;
    }
    return arr;
  }
  return function(apply3) {
    return function(map20) {
      return function(f) {
        var buildFrom = function(x, ys) {
          return apply3(map20(consList)(f(x)))(ys);
        };
        var go = function(acc, currentLen, xs) {
          if (currentLen === 0) {
            return acc;
          } else {
            var last3 = xs[currentLen - 1];
            return new Cont(function() {
              var built = go(buildFrom(last3, acc), currentLen - 1, xs);
              return built;
            });
          }
        };
        return function(array) {
          var acc = map20(finalCell)(f(array[array.length - 1]));
          var result = go(acc, array.length - 1, array);
          while (result instanceof Cont) {
            result = result.fn();
          }
          return map20(listToArray)(result);
        };
      };
    };
  };
}();

// output/Data.Array.NonEmpty/index.js
var toArray2 = function(v) {
  return v;
};
var adaptAny = function(f) {
  return function($125) {
    return f(toArray2($125));
  };
};
var catMaybes3 = /* @__PURE__ */ adaptAny(catMaybes2);

// output/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";
var _unsafeCodePointAt0 = function(fallback) {
  return hasCodePointAt ? function(str) {
    return str.codePointAt(0);
  } : fallback;
};
var _countPrefix = function(fallback) {
  return function(unsafeCodePointAt02) {
    if (hasStringIterator) {
      return function(pred) {
        return function(str) {
          var iter = str[Symbol.iterator]();
          for (var cpCount = 0; ; ++cpCount) {
            var o = iter.next();
            if (o.done)
              return cpCount;
            var cp = unsafeCodePointAt02(o.value);
            if (!pred(cp))
              return cpCount;
          }
        };
      };
    }
    return fallback;
  };
};
var _fromCodePointArray = function(singleton10) {
  return hasFromCodePoint ? function(cps) {
    if (cps.length < 1e4) {
      return String.fromCodePoint.apply(String, cps);
    }
    return cps.map(singleton10).join("");
  } : function(cps) {
    return cps.map(singleton10).join("");
  };
};
var _singleton = function(fallback) {
  return hasFromCodePoint ? String.fromCodePoint : fallback;
};
var _take = function(fallback) {
  return function(n) {
    if (hasStringIterator) {
      return function(str) {
        var accum = "";
        var iter = str[Symbol.iterator]();
        for (var i = 0; i < n; ++i) {
          var o = iter.next();
          if (o.done)
            return accum;
          accum += o.value;
        }
        return accum;
      };
    }
    return fallback(n);
  };
};
var _toCodePointArray = function(fallback) {
  return function(unsafeCodePointAt02) {
    if (hasArrayFrom) {
      return function(str) {
        return Array.from(str, unsafeCodePointAt02);
      };
    }
    return fallback;
  };
};

// output/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}

// output/Data.Enum/index.js
var top3 = /* @__PURE__ */ top(boundedInt);
var bottom3 = /* @__PURE__ */ bottom(boundedInt);
var toEnum = function(dict) {
  return dict.toEnum;
};
var fromEnum = function(dict) {
  return dict.fromEnum;
};
var toEnumWithDefaults = function(dictBoundedEnum) {
  var toEnum1 = toEnum(dictBoundedEnum);
  var fromEnum1 = fromEnum(dictBoundedEnum);
  var bottom1 = bottom(dictBoundedEnum.Bounded0());
  return function(low) {
    return function(high) {
      return function(x) {
        var v = toEnum1(x);
        if (v instanceof Just) {
          return v.value0;
        }
        ;
        if (v instanceof Nothing) {
          var $140 = x < fromEnum1(bottom1);
          if ($140) {
            return low;
          }
          ;
          return high;
        }
        ;
        throw new Error("Failed pattern match at Data.Enum (line 158, column 33 - line 160, column 62): " + [v.constructor.name]);
      };
    };
  };
};
var defaultSucc = function(toEnum$prime) {
  return function(fromEnum$prime) {
    return function(a) {
      return toEnum$prime(fromEnum$prime(a) + 1 | 0);
    };
  };
};
var defaultPred = function(toEnum$prime) {
  return function(fromEnum$prime) {
    return function(a) {
      return toEnum$prime(fromEnum$prime(a) - 1 | 0);
    };
  };
};
var charToEnum = function(v) {
  if (v >= bottom3 && v <= top3) {
    return new Just(fromCharCode(v));
  }
  ;
  return Nothing.value;
};
var enumChar = {
  succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
  pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
  Ord0: function() {
    return ordChar;
  }
};
var boundedEnumChar = /* @__PURE__ */ function() {
  return {
    cardinality: toCharCode(top(boundedChar)) - toCharCode(bottom(boundedChar)) | 0,
    toEnum: charToEnum,
    fromEnum: toCharCode,
    Bounded0: function() {
      return boundedChar;
    },
    Enum1: function() {
      return enumChar;
    }
  };
}();

// output/Data.String.Common/foreign.js
var trim = function(s) {
  return s.trim();
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

// output/Data.String.CodePoints/index.js
var $runtime_lazy4 = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
var map8 = /* @__PURE__ */ map(functorMaybe);
var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
var div2 = /* @__PURE__ */ div(euclideanRingInt);
var mod2 = /* @__PURE__ */ mod(euclideanRingInt);
var compare2 = /* @__PURE__ */ compare(ordInt);
var CodePoint = function(x) {
  return x;
};
var unsurrogate = function(lead) {
  return function(trail) {
    return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
  };
};
var isTrail = function(cu) {
  return 56320 <= cu && cu <= 57343;
};
var isLead = function(cu) {
  return 55296 <= cu && cu <= 56319;
};
var uncons3 = function(s) {
  var v = length2(s);
  if (v === 0) {
    return Nothing.value;
  }
  ;
  if (v === 1) {
    return new Just({
      head: fromEnum2(charAt(0)(s)),
      tail: ""
    });
  }
  ;
  var cu1 = fromEnum2(charAt(1)(s));
  var cu0 = fromEnum2(charAt(0)(s));
  var $43 = isLead(cu0) && isTrail(cu1);
  if ($43) {
    return new Just({
      head: unsurrogate(cu0)(cu1),
      tail: drop2(2)(s)
    });
  }
  ;
  return new Just({
    head: cu0,
    tail: drop2(1)(s)
  });
};
var unconsButWithTuple = function(s) {
  return map8(function(v) {
    return new Tuple(v.head, v.tail);
  })(uncons3(s));
};
var toCodePointArrayFallback = function(s) {
  return unfoldr2(unconsButWithTuple)(s);
};
var unsafeCodePointAt0Fallback = function(s) {
  var cu0 = fromEnum2(charAt(0)(s));
  var $47 = isLead(cu0) && length2(s) > 1;
  if ($47) {
    var cu1 = fromEnum2(charAt(1)(s));
    var $48 = isTrail(cu1);
    if ($48) {
      return unsurrogate(cu0)(cu1);
    }
    ;
    return cu0;
  }
  ;
  return cu0;
};
var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
var length4 = function($74) {
  return length3(toCodePointArray($74));
};
var fromCharCode2 = /* @__PURE__ */ function() {
  var $75 = toEnumWithDefaults(boundedEnumChar)(bottom(boundedChar))(top(boundedChar));
  return function($76) {
    return singleton5($75($76));
  };
}();
var singletonFallback = function(v) {
  if (v <= 65535) {
    return fromCharCode2(v);
  }
  ;
  var lead = div2(v - 65536 | 0)(1024) + 55296 | 0;
  var trail = mod2(v - 65536 | 0)(1024) + 56320 | 0;
  return fromCharCode2(lead) + fromCharCode2(trail);
};
var fromCodePointArray = /* @__PURE__ */ _fromCodePointArray(singletonFallback);
var singleton9 = /* @__PURE__ */ _singleton(singletonFallback);
var takeFallback = function(v) {
  return function(v1) {
    if (v < 1) {
      return "";
    }
    ;
    var v2 = uncons3(v1);
    if (v2 instanceof Just) {
      return singleton9(v2.value0.head) + takeFallback(v - 1 | 0)(v2.value0.tail);
    }
    ;
    return v1;
  };
};
var take4 = /* @__PURE__ */ _take(takeFallback);
var eqCodePoint = {
  eq: function(x) {
    return function(y) {
      return x === y;
    };
  }
};
var ordCodePoint = {
  compare: function(x) {
    return function(y) {
      return compare2(x)(y);
    };
  },
  Eq0: function() {
    return eqCodePoint;
  }
};
var drop4 = function(n) {
  return function(s) {
    return drop2(length2(take4(n)(s)))(s);
  };
};
var countTail = function($copy_p) {
  return function($copy_s) {
    return function($copy_accum) {
      var $tco_var_p = $copy_p;
      var $tco_var_s = $copy_s;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(p, s, accum) {
        var v = uncons3(s);
        if (v instanceof Just) {
          var $61 = p(v.value0.head);
          if ($61) {
            $tco_var_p = p;
            $tco_var_s = v.value0.tail;
            $copy_accum = accum + 1 | 0;
            return;
          }
          ;
          $tco_done = true;
          return accum;
        }
        ;
        $tco_done = true;
        return accum;
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_p, $tco_var_s, $copy_accum);
      }
      ;
      return $tco_result;
    };
  };
};
var countFallback = function(p) {
  return function(s) {
    return countTail(p)(s)(0);
  };
};
var countPrefix2 = /* @__PURE__ */ _countPrefix(countFallback)(unsafeCodePointAt0);
var takeWhile3 = function(p) {
  return function(s) {
    return take4(countPrefix2(p)(s))(s);
  };
};
var codePointFromChar = function($77) {
  return CodePoint(fromEnum2($77));
};
var boundedCodePoint = {
  bottom: 0,
  top: 1114111,
  Ord0: function() {
    return ordCodePoint;
  }
};
var boundedEnumCodePoint = /* @__PURE__ */ function() {
  return {
    cardinality: 1114111 + 1 | 0,
    fromEnum: function(v) {
      return v;
    },
    toEnum: function(n) {
      if (n >= 0 && n <= 1114111) {
        return new Just(n);
      }
      ;
      if (otherwise) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.String.CodePoints (line 63, column 1 - line 68, column 26): " + [n.constructor.name]);
    },
    Bounded0: function() {
      return boundedCodePoint;
    },
    Enum1: function() {
      return $lazy_enumCodePoint(0);
    }
  };
}();
var $lazy_enumCodePoint = /* @__PURE__ */ $runtime_lazy4("enumCodePoint", "Data.String.CodePoints", function() {
  return {
    succ: defaultSucc(toEnum(boundedEnumCodePoint))(fromEnum(boundedEnumCodePoint)),
    pred: defaultPred(toEnum(boundedEnumCodePoint))(fromEnum(boundedEnumCodePoint)),
    Ord0: function() {
      return ordCodePoint;
    }
  };
});

// output/Data.Argonaut.Decode.Decoders/index.js
var pure3 = /* @__PURE__ */ pure(applicativeEither);
var map9 = /* @__PURE__ */ map(functorEither);
var lmap2 = /* @__PURE__ */ lmap(bifunctorEither);
var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindEither);
var traverseWithIndex2 = /* @__PURE__ */ traverseWithIndex(traversableWithIndexArray)(applicativeEither);
var decodeString = /* @__PURE__ */ function() {
  return caseJsonString(new Left(new TypeMismatch2("String")))(Right.create);
}();
var decodeMaybe = function(decoder) {
  return function(json) {
    if (isNull2(json)) {
      return pure3(Nothing.value);
    }
    ;
    if (otherwise) {
      return map9(Just.create)(decoder(json));
    }
    ;
    throw new Error("Failed pattern match at Data.Argonaut.Decode.Decoders (line 37, column 1 - line 41, column 38): " + [decoder.constructor.name, json.constructor.name]);
  };
};
var decodeJArray = /* @__PURE__ */ function() {
  var $52 = note(new TypeMismatch2("Array"));
  return function($53) {
    return $52(toArray($53));
  };
}();
var decodeBoolean = /* @__PURE__ */ function() {
  return caseJsonBoolean(new Left(new TypeMismatch2("Boolean")))(Right.create);
}();
var decodeArray = function(decoder) {
  return composeKleisliFlipped2(function() {
    var $89 = lmap2(Named.create("Array"));
    var $90 = traverseWithIndex2(function(i) {
      var $92 = lmap2(AtIndex.create(i));
      return function($93) {
        return $92(decoder($93));
      };
    });
    return function($91) {
      return $89($90($91));
    };
  }())(decodeJArray);
};

// output/Record/index.js
var insert4 = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function() {
      return function(l) {
        return function(a) {
          return function(r) {
            return unsafeSet(reflectSymbol2(l))(a)(r);
          };
        };
      };
    };
  };
};
var get = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function(l) {
      return function(r) {
        return unsafeGet(reflectSymbol2(l))(r);
      };
    };
  };
};

// output/Data.Argonaut.Decode.Class/index.js
var bind2 = /* @__PURE__ */ bind(bindEither);
var lmap3 = /* @__PURE__ */ lmap(bifunctorEither);
var map10 = /* @__PURE__ */ map(functorMaybe);
var gDecodeJsonNil = {
  gDecodeJson: function(v) {
    return function(v1) {
      return new Right({});
    };
  }
};
var gDecodeJson = function(dict) {
  return dict.gDecodeJson;
};
var decodeRecord = function(dictGDecodeJson) {
  var gDecodeJson1 = gDecodeJson(dictGDecodeJson);
  return function() {
    return {
      decodeJson: function(json) {
        var v = toObject(json);
        if (v instanceof Just) {
          return gDecodeJson1(v.value0)($$Proxy.value);
        }
        ;
        if (v instanceof Nothing) {
          return new Left(new TypeMismatch2("Object"));
        }
        ;
        throw new Error("Failed pattern match at Data.Argonaut.Decode.Class (line 103, column 5 - line 105, column 46): " + [v.constructor.name]);
      }
    };
  };
};
var decodeJsonString = {
  decodeJson: decodeString
};
var decodeJsonField = function(dict) {
  return dict.decodeJsonField;
};
var gDecodeJsonCons = function(dictDecodeJsonField) {
  var decodeJsonField1 = decodeJsonField(dictDecodeJsonField);
  return function(dictGDecodeJson) {
    var gDecodeJson1 = gDecodeJson(dictGDecodeJson);
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      var insert5 = insert4(dictIsSymbol)()();
      return function() {
        return function() {
          return {
            gDecodeJson: function(object) {
              return function(v) {
                var fieldName = reflectSymbol2($$Proxy.value);
                var fieldValue = lookup2(fieldName)(object);
                var v1 = decodeJsonField1(fieldValue);
                if (v1 instanceof Just) {
                  return bind2(lmap3(AtKey.create(fieldName))(v1.value0))(function(val) {
                    return bind2(gDecodeJson1(object)($$Proxy.value))(function(rest) {
                      return new Right(insert5($$Proxy.value)(val)(rest));
                    });
                  });
                }
                ;
                if (v1 instanceof Nothing) {
                  return new Left(new AtKey(fieldName, MissingValue.value));
                }
                ;
                throw new Error("Failed pattern match at Data.Argonaut.Decode.Class (line 127, column 5 - line 134, column 44): " + [v1.constructor.name]);
              };
            }
          };
        };
      };
    };
  };
};
var decodeJsonBoolean = {
  decodeJson: decodeBoolean
};
var decodeJson = function(dict) {
  return dict.decodeJson;
};
var decodeJsonMaybe = function(dictDecodeJson) {
  return {
    decodeJson: decodeMaybe(decodeJson(dictDecodeJson))
  };
};
var decodeFieldMaybe = function(dictDecodeJson) {
  var decodeJson1 = decodeJson(decodeJsonMaybe(dictDecodeJson));
  return {
    decodeJsonField: function(v) {
      if (v instanceof Nothing) {
        return new Just(new Right(Nothing.value));
      }
      ;
      if (v instanceof Just) {
        return new Just(decodeJson1(v.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.Argonaut.Decode.Class (line 139, column 1 - line 143, column 49): " + [v.constructor.name]);
    }
  };
};
var decodeFieldId = function(dictDecodeJson) {
  var decodeJson1 = decodeJson(dictDecodeJson);
  return {
    decodeJsonField: function(j) {
      return map10(decodeJson1)(j);
    }
  };
};
var decodeArray2 = function(dictDecodeJson) {
  return {
    decodeJson: decodeArray(decodeJson(dictDecodeJson))
  };
};

// output/Data.Argonaut.Encode.Encoders/index.js
var map11 = /* @__PURE__ */ map(functorArray);
var encodeString = id;
var encodeMaybe = function(encoder) {
  return function(v) {
    if (v instanceof Nothing) {
      return jsonNull;
    }
    ;
    if (v instanceof Just) {
      return encoder(v.value0);
    }
    ;
    throw new Error("Failed pattern match at Data.Argonaut.Encode.Encoders (line 31, column 23 - line 33, column 22): " + [v.constructor.name]);
  };
};
var encodeArray = function(encoder) {
  var $58 = map11(encoder);
  return function($59) {
    return id($58($59));
  };
};

// output/Data.Argonaut.Encode.Class/index.js
var gEncodeJsonNil = {
  gEncodeJson: function(v) {
    return function(v1) {
      return empty3;
    };
  }
};
var gEncodeJson = function(dict) {
  return dict.gEncodeJson;
};
var encodeRecord = function(dictGEncodeJson) {
  var gEncodeJson1 = gEncodeJson(dictGEncodeJson);
  return function() {
    return {
      encodeJson: function(rec) {
        return id(gEncodeJson1(rec)($$Proxy.value));
      }
    };
  };
};
var encodeJsonJString = {
  encodeJson: encodeString
};
var encodeJson = function(dict) {
  return dict.encodeJson;
};
var encodeJsonArray = function(dictEncodeJson) {
  return {
    encodeJson: encodeArray(encodeJson(dictEncodeJson))
  };
};
var encodeJsonMaybe = function(dictEncodeJson) {
  return {
    encodeJson: encodeMaybe(encodeJson(dictEncodeJson))
  };
};
var gEncodeJsonCons = function(dictEncodeJson) {
  var encodeJson1 = encodeJson(dictEncodeJson);
  return function(dictGEncodeJson) {
    var gEncodeJson1 = gEncodeJson(dictGEncodeJson);
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      var get3 = get(dictIsSymbol)();
      return function() {
        return {
          gEncodeJson: function(row) {
            return function(v) {
              return insert2(reflectSymbol2($$Proxy.value))(encodeJson1(get3($$Proxy.value)(row)))(gEncodeJson1(row)($$Proxy.value));
            };
          }
        };
      };
    };
  };
};

// output/Data.CodePoint.Unicode.Internal/index.js
var unsafeIndex2 = /* @__PURE__ */ unsafeIndex();
var elemIndex2 = /* @__PURE__ */ elemIndex(eqInt);
var NUMCAT_LU = /* @__PURE__ */ function() {
  function NUMCAT_LU2() {
  }
  ;
  NUMCAT_LU2.value = new NUMCAT_LU2();
  return NUMCAT_LU2;
}();
var NUMCAT_LL = /* @__PURE__ */ function() {
  function NUMCAT_LL2() {
  }
  ;
  NUMCAT_LL2.value = new NUMCAT_LL2();
  return NUMCAT_LL2;
}();
var NUMCAT_LT = /* @__PURE__ */ function() {
  function NUMCAT_LT2() {
  }
  ;
  NUMCAT_LT2.value = new NUMCAT_LT2();
  return NUMCAT_LT2;
}();
var NUMCAT_LM = /* @__PURE__ */ function() {
  function NUMCAT_LM2() {
  }
  ;
  NUMCAT_LM2.value = new NUMCAT_LM2();
  return NUMCAT_LM2;
}();
var NUMCAT_LO = /* @__PURE__ */ function() {
  function NUMCAT_LO2() {
  }
  ;
  NUMCAT_LO2.value = new NUMCAT_LO2();
  return NUMCAT_LO2;
}();
var NUMCAT_MN = /* @__PURE__ */ function() {
  function NUMCAT_MN2() {
  }
  ;
  NUMCAT_MN2.value = new NUMCAT_MN2();
  return NUMCAT_MN2;
}();
var NUMCAT_MC = /* @__PURE__ */ function() {
  function NUMCAT_MC2() {
  }
  ;
  NUMCAT_MC2.value = new NUMCAT_MC2();
  return NUMCAT_MC2;
}();
var NUMCAT_ME = /* @__PURE__ */ function() {
  function NUMCAT_ME2() {
  }
  ;
  NUMCAT_ME2.value = new NUMCAT_ME2();
  return NUMCAT_ME2;
}();
var NUMCAT_ND = /* @__PURE__ */ function() {
  function NUMCAT_ND2() {
  }
  ;
  NUMCAT_ND2.value = new NUMCAT_ND2();
  return NUMCAT_ND2;
}();
var NUMCAT_NL = /* @__PURE__ */ function() {
  function NUMCAT_NL2() {
  }
  ;
  NUMCAT_NL2.value = new NUMCAT_NL2();
  return NUMCAT_NL2;
}();
var NUMCAT_NO = /* @__PURE__ */ function() {
  function NUMCAT_NO2() {
  }
  ;
  NUMCAT_NO2.value = new NUMCAT_NO2();
  return NUMCAT_NO2;
}();
var NUMCAT_PC = /* @__PURE__ */ function() {
  function NUMCAT_PC2() {
  }
  ;
  NUMCAT_PC2.value = new NUMCAT_PC2();
  return NUMCAT_PC2;
}();
var NUMCAT_PD = /* @__PURE__ */ function() {
  function NUMCAT_PD2() {
  }
  ;
  NUMCAT_PD2.value = new NUMCAT_PD2();
  return NUMCAT_PD2;
}();
var NUMCAT_PS = /* @__PURE__ */ function() {
  function NUMCAT_PS2() {
  }
  ;
  NUMCAT_PS2.value = new NUMCAT_PS2();
  return NUMCAT_PS2;
}();
var NUMCAT_PE = /* @__PURE__ */ function() {
  function NUMCAT_PE2() {
  }
  ;
  NUMCAT_PE2.value = new NUMCAT_PE2();
  return NUMCAT_PE2;
}();
var NUMCAT_PI = /* @__PURE__ */ function() {
  function NUMCAT_PI2() {
  }
  ;
  NUMCAT_PI2.value = new NUMCAT_PI2();
  return NUMCAT_PI2;
}();
var NUMCAT_PF = /* @__PURE__ */ function() {
  function NUMCAT_PF2() {
  }
  ;
  NUMCAT_PF2.value = new NUMCAT_PF2();
  return NUMCAT_PF2;
}();
var NUMCAT_PO = /* @__PURE__ */ function() {
  function NUMCAT_PO2() {
  }
  ;
  NUMCAT_PO2.value = new NUMCAT_PO2();
  return NUMCAT_PO2;
}();
var NUMCAT_SM = /* @__PURE__ */ function() {
  function NUMCAT_SM2() {
  }
  ;
  NUMCAT_SM2.value = new NUMCAT_SM2();
  return NUMCAT_SM2;
}();
var NUMCAT_SC = /* @__PURE__ */ function() {
  function NUMCAT_SC2() {
  }
  ;
  NUMCAT_SC2.value = new NUMCAT_SC2();
  return NUMCAT_SC2;
}();
var NUMCAT_SK = /* @__PURE__ */ function() {
  function NUMCAT_SK2() {
  }
  ;
  NUMCAT_SK2.value = new NUMCAT_SK2();
  return NUMCAT_SK2;
}();
var NUMCAT_SO = /* @__PURE__ */ function() {
  function NUMCAT_SO2() {
  }
  ;
  NUMCAT_SO2.value = new NUMCAT_SO2();
  return NUMCAT_SO2;
}();
var NUMCAT_ZS = /* @__PURE__ */ function() {
  function NUMCAT_ZS2() {
  }
  ;
  NUMCAT_ZS2.value = new NUMCAT_ZS2();
  return NUMCAT_ZS2;
}();
var NUMCAT_ZL = /* @__PURE__ */ function() {
  function NUMCAT_ZL2() {
  }
  ;
  NUMCAT_ZL2.value = new NUMCAT_ZL2();
  return NUMCAT_ZL2;
}();
var NUMCAT_ZP = /* @__PURE__ */ function() {
  function NUMCAT_ZP2() {
  }
  ;
  NUMCAT_ZP2.value = new NUMCAT_ZP2();
  return NUMCAT_ZP2;
}();
var NUMCAT_CC = /* @__PURE__ */ function() {
  function NUMCAT_CC2() {
  }
  ;
  NUMCAT_CC2.value = new NUMCAT_CC2();
  return NUMCAT_CC2;
}();
var NUMCAT_CF = /* @__PURE__ */ function() {
  function NUMCAT_CF2() {
  }
  ;
  NUMCAT_CF2.value = new NUMCAT_CF2();
  return NUMCAT_CF2;
}();
var NUMCAT_CS = /* @__PURE__ */ function() {
  function NUMCAT_CS2() {
  }
  ;
  NUMCAT_CS2.value = new NUMCAT_CS2();
  return NUMCAT_CS2;
}();
var NUMCAT_CO = /* @__PURE__ */ function() {
  function NUMCAT_CO2() {
  }
  ;
  NUMCAT_CO2.value = new NUMCAT_CO2();
  return NUMCAT_CO2;
}();
var NUMCAT_CN = /* @__PURE__ */ function() {
  function NUMCAT_CN2() {
  }
  ;
  NUMCAT_CN2.value = new NUMCAT_CN2();
  return NUMCAT_CN2;
}();
var numLat1Blocks = 63;
var numConvBlocks = 1332;
var numBlocks = 3396;
var gencatZS = 2;
var rule1 = /* @__PURE__ */ function() {
  return {
    category: gencatZS,
    unicodeCat: NUMCAT_ZS.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatZP = 67108864;
var rule162 = /* @__PURE__ */ function() {
  return {
    category: gencatZP,
    unicodeCat: NUMCAT_ZP.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatZL = 33554432;
var rule161 = /* @__PURE__ */ function() {
  return {
    category: gencatZL,
    unicodeCat: NUMCAT_ZL.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatSO = 8192;
var rule13 = /* @__PURE__ */ function() {
  return {
    category: gencatSO,
    unicodeCat: NUMCAT_SO.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var rule170 = /* @__PURE__ */ function() {
  return {
    category: gencatSO,
    unicodeCat: NUMCAT_SO.value,
    possible: 1,
    updist: 0,
    lowdist: 26,
    titledist: 0
  };
}();
var rule171 = /* @__PURE__ */ function() {
  return {
    category: gencatSO,
    unicodeCat: NUMCAT_SO.value,
    possible: 1,
    updist: -26 | 0,
    lowdist: 0,
    titledist: -26 | 0
  };
}();
var gencatSM = 64;
var rule6 = /* @__PURE__ */ function() {
  return {
    category: gencatSM,
    unicodeCat: NUMCAT_SM.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatSK = 1024;
var rule10 = /* @__PURE__ */ function() {
  return {
    category: gencatSK,
    unicodeCat: NUMCAT_SK.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatSC = 8;
var rule3 = /* @__PURE__ */ function() {
  return {
    category: gencatSC,
    unicodeCat: NUMCAT_SC.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatPS = 16;
var rule4 = /* @__PURE__ */ function() {
  return {
    category: gencatPS,
    unicodeCat: NUMCAT_PS.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatPO = 4;
var rule2 = /* @__PURE__ */ function() {
  return {
    category: gencatPO,
    unicodeCat: NUMCAT_PO.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatPI = 32768;
var rule15 = /* @__PURE__ */ function() {
  return {
    category: gencatPI,
    unicodeCat: NUMCAT_PI.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatPF = 262144;
var rule19 = /* @__PURE__ */ function() {
  return {
    category: gencatPF,
    unicodeCat: NUMCAT_PF.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatPE = 32;
var rule5 = /* @__PURE__ */ function() {
  return {
    category: gencatPE,
    unicodeCat: NUMCAT_PE.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatPD = 128;
var rule7 = /* @__PURE__ */ function() {
  return {
    category: gencatPD,
    unicodeCat: NUMCAT_PD.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatPC = 2048;
var rule11 = /* @__PURE__ */ function() {
  return {
    category: gencatPC,
    unicodeCat: NUMCAT_PC.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatNO = 131072;
var rule17 = /* @__PURE__ */ function() {
  return {
    category: gencatNO,
    unicodeCat: NUMCAT_NO.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatNL = 16777216;
var rule128 = /* @__PURE__ */ function() {
  return {
    category: gencatNL,
    unicodeCat: NUMCAT_NL.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var rule168 = /* @__PURE__ */ function() {
  return {
    category: gencatNL,
    unicodeCat: NUMCAT_NL.value,
    possible: 1,
    updist: 0,
    lowdist: 16,
    titledist: 0
  };
}();
var rule169 = /* @__PURE__ */ function() {
  return {
    category: gencatNL,
    unicodeCat: NUMCAT_NL.value,
    possible: 1,
    updist: -16 | 0,
    lowdist: 0,
    titledist: -16 | 0
  };
}();
var gencatND = 256;
var rule8 = /* @__PURE__ */ function() {
  return {
    category: gencatND,
    unicodeCat: NUMCAT_ND.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatMN = 2097152;
var rule92 = /* @__PURE__ */ function() {
  return {
    category: gencatMN,
    unicodeCat: NUMCAT_MN.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var rule93 = /* @__PURE__ */ function() {
  return {
    category: gencatMN,
    unicodeCat: NUMCAT_MN.value,
    possible: 1,
    updist: 84,
    lowdist: 0,
    titledist: 84
  };
}();
var gencatME = 4194304;
var rule119 = /* @__PURE__ */ function() {
  return {
    category: gencatME,
    unicodeCat: NUMCAT_ME.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatMC = 8388608;
var rule124 = /* @__PURE__ */ function() {
  return {
    category: gencatMC,
    unicodeCat: NUMCAT_MC.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatLU = 512;
var nullrule = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_CN.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var rule104 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 8,
    titledist: 0
  };
}();
var rule107 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var rule115 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -60 | 0,
    titledist: 0
  };
}();
var rule117 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -7 | 0,
    titledist: 0
  };
}();
var rule118 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 80,
    titledist: 0
  };
}();
var rule120 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 15,
    titledist: 0
  };
}();
var rule122 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 48,
    titledist: 0
  };
}();
var rule125 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 7264,
    titledist: 0
  };
}();
var rule127 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 38864,
    titledist: 0
  };
}();
var rule137 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -3008 | 0,
    titledist: 0
  };
}();
var rule142 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -7615 | 0,
    titledist: 0
  };
}();
var rule144 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -8 | 0,
    titledist: 0
  };
}();
var rule153 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -74 | 0,
    titledist: 0
  };
}();
var rule156 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -86 | 0,
    titledist: 0
  };
}();
var rule157 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -100 | 0,
    titledist: 0
  };
}();
var rule158 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -112 | 0,
    titledist: 0
  };
}();
var rule159 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -128 | 0,
    titledist: 0
  };
}();
var rule160 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -126 | 0,
    titledist: 0
  };
}();
var rule163 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -7517 | 0,
    titledist: 0
  };
}();
var rule164 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -8383 | 0,
    titledist: 0
  };
}();
var rule165 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -8262 | 0,
    titledist: 0
  };
}();
var rule166 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 28,
    titledist: 0
  };
}();
var rule172 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10743 | 0,
    titledist: 0
  };
}();
var rule173 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -3814 | 0,
    titledist: 0
  };
}();
var rule174 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10727 | 0,
    titledist: 0
  };
}();
var rule177 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10780 | 0,
    titledist: 0
  };
}();
var rule178 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10749 | 0,
    titledist: 0
  };
}();
var rule179 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10783 | 0,
    titledist: 0
  };
}();
var rule180 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10782 | 0,
    titledist: 0
  };
}();
var rule181 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10815 | 0,
    titledist: 0
  };
}();
var rule183 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -35332 | 0,
    titledist: 0
  };
}();
var rule184 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42280 | 0,
    titledist: 0
  };
}();
var rule186 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42308 | 0,
    titledist: 0
  };
}();
var rule187 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42319 | 0,
    titledist: 0
  };
}();
var rule188 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42315 | 0,
    titledist: 0
  };
}();
var rule189 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42305 | 0,
    titledist: 0
  };
}();
var rule190 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42258 | 0,
    titledist: 0
  };
}();
var rule191 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42282 | 0,
    titledist: 0
  };
}();
var rule192 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42261 | 0,
    titledist: 0
  };
}();
var rule193 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 928,
    titledist: 0
  };
}();
var rule194 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -48 | 0,
    titledist: 0
  };
}();
var rule195 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42307 | 0,
    titledist: 0
  };
}();
var rule196 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -35384 | 0,
    titledist: 0
  };
}();
var rule201 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 40,
    titledist: 0
  };
}();
var rule203 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 34,
    titledist: 0
  };
}();
var rule22 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 1,
    titledist: 0
  };
}();
var rule24 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -199 | 0,
    titledist: 0
  };
}();
var rule26 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -121 | 0,
    titledist: 0
  };
}();
var rule29 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 210,
    titledist: 0
  };
}();
var rule30 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 206,
    titledist: 0
  };
}();
var rule31 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 205,
    titledist: 0
  };
}();
var rule32 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 79,
    titledist: 0
  };
}();
var rule33 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 202,
    titledist: 0
  };
}();
var rule34 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 203,
    titledist: 0
  };
}();
var rule35 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 207,
    titledist: 0
  };
}();
var rule37 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 211,
    titledist: 0
  };
}();
var rule38 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 209,
    titledist: 0
  };
}();
var rule40 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 213,
    titledist: 0
  };
}();
var rule42 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 214,
    titledist: 0
  };
}();
var rule43 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 218,
    titledist: 0
  };
}();
var rule44 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 217,
    titledist: 0
  };
}();
var rule45 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 219,
    titledist: 0
  };
}();
var rule47 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 2,
    titledist: 1
  };
}();
var rule51 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -97 | 0,
    titledist: 0
  };
}();
var rule52 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -56 | 0,
    titledist: 0
  };
}();
var rule53 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -130 | 0,
    titledist: 0
  };
}();
var rule54 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 10795,
    titledist: 0
  };
}();
var rule55 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -163 | 0,
    titledist: 0
  };
}();
var rule56 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 10792,
    titledist: 0
  };
}();
var rule58 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -195 | 0,
    titledist: 0
  };
}();
var rule59 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 69,
    titledist: 0
  };
}();
var rule60 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 71,
    titledist: 0
  };
}();
var rule9 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 32,
    titledist: 0
  };
}();
var rule94 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 116,
    titledist: 0
  };
}();
var rule95 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 38,
    titledist: 0
  };
}();
var rule96 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 37,
    titledist: 0
  };
}();
var rule97 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 64,
    titledist: 0
  };
}();
var rule98 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 63,
    titledist: 0
  };
}();
var gencatLT = 524288;
var rule151 = /* @__PURE__ */ function() {
  return {
    category: gencatLT,
    unicodeCat: NUMCAT_LT.value,
    possible: 1,
    updist: 0,
    lowdist: -8 | 0,
    titledist: 0
  };
}();
var rule154 = /* @__PURE__ */ function() {
  return {
    category: gencatLT,
    unicodeCat: NUMCAT_LT.value,
    possible: 1,
    updist: 0,
    lowdist: -9 | 0,
    titledist: 0
  };
}();
var rule48 = /* @__PURE__ */ function() {
  return {
    category: gencatLT,
    unicodeCat: NUMCAT_LT.value,
    possible: 1,
    updist: -1 | 0,
    lowdist: 1,
    titledist: 0
  };
}();
var gencatLO = 16384;
var rule14 = /* @__PURE__ */ function() {
  return {
    category: gencatLO,
    unicodeCat: NUMCAT_LO.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatLM = 1048576;
var rule91 = /* @__PURE__ */ function() {
  return {
    category: gencatLM,
    unicodeCat: NUMCAT_LM.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatLL = 4096;
var rule100 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -37 | 0,
    lowdist: 0,
    titledist: -37 | 0
  };
}();
var rule101 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -31 | 0,
    lowdist: 0,
    titledist: -31 | 0
  };
}();
var rule102 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -64 | 0,
    lowdist: 0,
    titledist: -64 | 0
  };
}();
var rule103 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -63 | 0,
    lowdist: 0,
    titledist: -63 | 0
  };
}();
var rule105 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -62 | 0,
    lowdist: 0,
    titledist: -62 | 0
  };
}();
var rule106 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -57 | 0,
    lowdist: 0,
    titledist: -57 | 0
  };
}();
var rule108 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -47 | 0,
    lowdist: 0,
    titledist: -47 | 0
  };
}();
var rule109 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -54 | 0,
    lowdist: 0,
    titledist: -54 | 0
  };
}();
var rule110 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -8 | 0,
    lowdist: 0,
    titledist: -8 | 0
  };
}();
var rule111 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -86 | 0,
    lowdist: 0,
    titledist: -86 | 0
  };
}();
var rule112 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -80 | 0,
    lowdist: 0,
    titledist: -80 | 0
  };
}();
var rule113 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 7,
    lowdist: 0,
    titledist: 7
  };
}();
var rule114 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -116 | 0,
    lowdist: 0,
    titledist: -116 | 0
  };
}();
var rule116 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -96 | 0,
    lowdist: 0,
    titledist: -96 | 0
  };
}();
var rule12 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -32 | 0,
    lowdist: 0,
    titledist: -32 | 0
  };
}();
var rule121 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -15 | 0,
    lowdist: 0,
    titledist: -15 | 0
  };
}();
var rule123 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -48 | 0,
    lowdist: 0,
    titledist: -48 | 0
  };
}();
var rule126 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 3008,
    lowdist: 0,
    titledist: 0
  };
}();
var rule129 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6254 | 0,
    lowdist: 0,
    titledist: -6254 | 0
  };
}();
var rule130 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6253 | 0,
    lowdist: 0,
    titledist: -6253 | 0
  };
}();
var rule131 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6244 | 0,
    lowdist: 0,
    titledist: -6244 | 0
  };
}();
var rule132 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6242 | 0,
    lowdist: 0,
    titledist: -6242 | 0
  };
}();
var rule133 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6243 | 0,
    lowdist: 0,
    titledist: -6243 | 0
  };
}();
var rule134 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6236 | 0,
    lowdist: 0,
    titledist: -6236 | 0
  };
}();
var rule135 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6181 | 0,
    lowdist: 0,
    titledist: -6181 | 0
  };
}();
var rule136 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 35266,
    lowdist: 0,
    titledist: 35266
  };
}();
var rule138 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 35332,
    lowdist: 0,
    titledist: 35332
  };
}();
var rule139 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 3814,
    lowdist: 0,
    titledist: 3814
  };
}();
var rule140 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 35384,
    lowdist: 0,
    titledist: 35384
  };
}();
var rule141 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -59 | 0,
    lowdist: 0,
    titledist: -59 | 0
  };
}();
var rule143 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 8,
    lowdist: 0,
    titledist: 8
  };
}();
var rule145 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 74,
    lowdist: 0,
    titledist: 74
  };
}();
var rule146 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 86,
    lowdist: 0,
    titledist: 86
  };
}();
var rule147 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 100,
    lowdist: 0,
    titledist: 100
  };
}();
var rule148 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 128,
    lowdist: 0,
    titledist: 128
  };
}();
var rule149 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 112,
    lowdist: 0,
    titledist: 112
  };
}();
var rule150 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 126,
    lowdist: 0,
    titledist: 126
  };
}();
var rule152 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 9,
    lowdist: 0,
    titledist: 9
  };
}();
var rule155 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -7205 | 0,
    lowdist: 0,
    titledist: -7205 | 0
  };
}();
var rule167 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -28 | 0,
    lowdist: 0,
    titledist: -28 | 0
  };
}();
var rule175 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -10795 | 0,
    lowdist: 0,
    titledist: -10795 | 0
  };
}();
var rule176 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -10792 | 0,
    lowdist: 0,
    titledist: -10792 | 0
  };
}();
var rule18 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 743,
    lowdist: 0,
    titledist: 743
  };
}();
var rule182 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -7264 | 0,
    lowdist: 0,
    titledist: -7264 | 0
  };
}();
var rule185 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 48,
    lowdist: 0,
    titledist: 48
  };
}();
var rule197 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -928 | 0,
    lowdist: 0,
    titledist: -928 | 0
  };
}();
var rule198 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -38864 | 0,
    lowdist: 0,
    titledist: -38864 | 0
  };
}();
var rule20 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var rule202 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -40 | 0,
    lowdist: 0,
    titledist: -40 | 0
  };
}();
var rule204 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -34 | 0,
    lowdist: 0,
    titledist: -34 | 0
  };
}();
var rule21 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 121,
    lowdist: 0,
    titledist: 121
  };
}();
var rule23 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -1 | 0,
    lowdist: 0,
    titledist: -1 | 0
  };
}();
var rule25 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -232 | 0,
    lowdist: 0,
    titledist: -232 | 0
  };
}();
var rule27 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -300 | 0,
    lowdist: 0,
    titledist: -300 | 0
  };
}();
var rule28 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 195,
    lowdist: 0,
    titledist: 195
  };
}();
var rule36 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 97,
    lowdist: 0,
    titledist: 97
  };
}();
var rule39 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 163,
    lowdist: 0,
    titledist: 163
  };
}();
var rule41 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 130,
    lowdist: 0,
    titledist: 130
  };
}();
var rule46 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 56,
    lowdist: 0,
    titledist: 56
  };
}();
var rule49 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -2 | 0,
    lowdist: 0,
    titledist: -1 | 0
  };
}();
var rule50 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -79 | 0,
    lowdist: 0,
    titledist: -79 | 0
  };
}();
var rule57 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10815,
    lowdist: 0,
    titledist: 10815
  };
}();
var rule61 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10783,
    lowdist: 0,
    titledist: 10783
  };
}();
var rule62 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10780,
    lowdist: 0,
    titledist: 10780
  };
}();
var rule63 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10782,
    lowdist: 0,
    titledist: 10782
  };
}();
var rule64 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -210 | 0,
    lowdist: 0,
    titledist: -210 | 0
  };
}();
var rule65 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -206 | 0,
    lowdist: 0,
    titledist: -206 | 0
  };
}();
var rule66 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -205 | 0,
    lowdist: 0,
    titledist: -205 | 0
  };
}();
var rule67 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -202 | 0,
    lowdist: 0,
    titledist: -202 | 0
  };
}();
var rule68 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -203 | 0,
    lowdist: 0,
    titledist: -203 | 0
  };
}();
var rule69 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42319,
    lowdist: 0,
    titledist: 42319
  };
}();
var rule70 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42315,
    lowdist: 0,
    titledist: 42315
  };
}();
var rule71 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -207 | 0,
    lowdist: 0,
    titledist: -207 | 0
  };
}();
var rule72 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42280,
    lowdist: 0,
    titledist: 42280
  };
}();
var rule73 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42308,
    lowdist: 0,
    titledist: 42308
  };
}();
var rule74 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -209 | 0,
    lowdist: 0,
    titledist: -209 | 0
  };
}();
var rule75 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -211 | 0,
    lowdist: 0,
    titledist: -211 | 0
  };
}();
var rule76 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10743,
    lowdist: 0,
    titledist: 10743
  };
}();
var rule77 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42305,
    lowdist: 0,
    titledist: 42305
  };
}();
var rule78 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10749,
    lowdist: 0,
    titledist: 10749
  };
}();
var rule79 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -213 | 0,
    lowdist: 0,
    titledist: -213 | 0
  };
}();
var rule80 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -214 | 0,
    lowdist: 0,
    titledist: -214 | 0
  };
}();
var rule81 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10727,
    lowdist: 0,
    titledist: 10727
  };
}();
var rule82 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -218 | 0,
    lowdist: 0,
    titledist: -218 | 0
  };
}();
var rule83 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42307,
    lowdist: 0,
    titledist: 42307
  };
}();
var rule84 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42282,
    lowdist: 0,
    titledist: 42282
  };
}();
var rule85 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -69 | 0,
    lowdist: 0,
    titledist: -69 | 0
  };
}();
var rule86 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -217 | 0,
    lowdist: 0,
    titledist: -217 | 0
  };
}();
var rule87 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -71 | 0,
    lowdist: 0,
    titledist: -71 | 0
  };
}();
var rule88 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -219 | 0,
    lowdist: 0,
    titledist: -219 | 0
  };
}();
var rule89 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42261,
    lowdist: 0,
    titledist: 42261
  };
}();
var rule90 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42258,
    lowdist: 0,
    titledist: 42258
  };
}();
var rule99 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -38 | 0,
    lowdist: 0,
    titledist: -38 | 0
  };
}();
var gencatCS = 134217728;
var rule199 = /* @__PURE__ */ function() {
  return {
    category: gencatCS,
    unicodeCat: NUMCAT_CS.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatCO = 268435456;
var rule200 = /* @__PURE__ */ function() {
  return {
    category: gencatCO,
    unicodeCat: NUMCAT_CO.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatCF = 65536;
var rule16 = /* @__PURE__ */ function() {
  return {
    category: gencatCF,
    unicodeCat: NUMCAT_CF.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var gencatCC = 1;
var rule0 = /* @__PURE__ */ function() {
  return {
    category: gencatCC,
    unicodeCat: NUMCAT_CC.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var convchars = [{
  start: 65,
  length: 26,
  convRule: rule9
}, {
  start: 97,
  length: 26,
  convRule: rule12
}, {
  start: 181,
  length: 1,
  convRule: rule18
}, {
  start: 192,
  length: 23,
  convRule: rule9
}, {
  start: 216,
  length: 7,
  convRule: rule9
}, {
  start: 224,
  length: 23,
  convRule: rule12
}, {
  start: 248,
  length: 7,
  convRule: rule12
}, {
  start: 255,
  length: 1,
  convRule: rule21
}, {
  start: 256,
  length: 1,
  convRule: rule22
}, {
  start: 257,
  length: 1,
  convRule: rule23
}, {
  start: 258,
  length: 1,
  convRule: rule22
}, {
  start: 259,
  length: 1,
  convRule: rule23
}, {
  start: 260,
  length: 1,
  convRule: rule22
}, {
  start: 261,
  length: 1,
  convRule: rule23
}, {
  start: 262,
  length: 1,
  convRule: rule22
}, {
  start: 263,
  length: 1,
  convRule: rule23
}, {
  start: 264,
  length: 1,
  convRule: rule22
}, {
  start: 265,
  length: 1,
  convRule: rule23
}, {
  start: 266,
  length: 1,
  convRule: rule22
}, {
  start: 267,
  length: 1,
  convRule: rule23
}, {
  start: 268,
  length: 1,
  convRule: rule22
}, {
  start: 269,
  length: 1,
  convRule: rule23
}, {
  start: 270,
  length: 1,
  convRule: rule22
}, {
  start: 271,
  length: 1,
  convRule: rule23
}, {
  start: 272,
  length: 1,
  convRule: rule22
}, {
  start: 273,
  length: 1,
  convRule: rule23
}, {
  start: 274,
  length: 1,
  convRule: rule22
}, {
  start: 275,
  length: 1,
  convRule: rule23
}, {
  start: 276,
  length: 1,
  convRule: rule22
}, {
  start: 277,
  length: 1,
  convRule: rule23
}, {
  start: 278,
  length: 1,
  convRule: rule22
}, {
  start: 279,
  length: 1,
  convRule: rule23
}, {
  start: 280,
  length: 1,
  convRule: rule22
}, {
  start: 281,
  length: 1,
  convRule: rule23
}, {
  start: 282,
  length: 1,
  convRule: rule22
}, {
  start: 283,
  length: 1,
  convRule: rule23
}, {
  start: 284,
  length: 1,
  convRule: rule22
}, {
  start: 285,
  length: 1,
  convRule: rule23
}, {
  start: 286,
  length: 1,
  convRule: rule22
}, {
  start: 287,
  length: 1,
  convRule: rule23
}, {
  start: 288,
  length: 1,
  convRule: rule22
}, {
  start: 289,
  length: 1,
  convRule: rule23
}, {
  start: 290,
  length: 1,
  convRule: rule22
}, {
  start: 291,
  length: 1,
  convRule: rule23
}, {
  start: 292,
  length: 1,
  convRule: rule22
}, {
  start: 293,
  length: 1,
  convRule: rule23
}, {
  start: 294,
  length: 1,
  convRule: rule22
}, {
  start: 295,
  length: 1,
  convRule: rule23
}, {
  start: 296,
  length: 1,
  convRule: rule22
}, {
  start: 297,
  length: 1,
  convRule: rule23
}, {
  start: 298,
  length: 1,
  convRule: rule22
}, {
  start: 299,
  length: 1,
  convRule: rule23
}, {
  start: 300,
  length: 1,
  convRule: rule22
}, {
  start: 301,
  length: 1,
  convRule: rule23
}, {
  start: 302,
  length: 1,
  convRule: rule22
}, {
  start: 303,
  length: 1,
  convRule: rule23
}, {
  start: 304,
  length: 1,
  convRule: rule24
}, {
  start: 305,
  length: 1,
  convRule: rule25
}, {
  start: 306,
  length: 1,
  convRule: rule22
}, {
  start: 307,
  length: 1,
  convRule: rule23
}, {
  start: 308,
  length: 1,
  convRule: rule22
}, {
  start: 309,
  length: 1,
  convRule: rule23
}, {
  start: 310,
  length: 1,
  convRule: rule22
}, {
  start: 311,
  length: 1,
  convRule: rule23
}, {
  start: 313,
  length: 1,
  convRule: rule22
}, {
  start: 314,
  length: 1,
  convRule: rule23
}, {
  start: 315,
  length: 1,
  convRule: rule22
}, {
  start: 316,
  length: 1,
  convRule: rule23
}, {
  start: 317,
  length: 1,
  convRule: rule22
}, {
  start: 318,
  length: 1,
  convRule: rule23
}, {
  start: 319,
  length: 1,
  convRule: rule22
}, {
  start: 320,
  length: 1,
  convRule: rule23
}, {
  start: 321,
  length: 1,
  convRule: rule22
}, {
  start: 322,
  length: 1,
  convRule: rule23
}, {
  start: 323,
  length: 1,
  convRule: rule22
}, {
  start: 324,
  length: 1,
  convRule: rule23
}, {
  start: 325,
  length: 1,
  convRule: rule22
}, {
  start: 326,
  length: 1,
  convRule: rule23
}, {
  start: 327,
  length: 1,
  convRule: rule22
}, {
  start: 328,
  length: 1,
  convRule: rule23
}, {
  start: 330,
  length: 1,
  convRule: rule22
}, {
  start: 331,
  length: 1,
  convRule: rule23
}, {
  start: 332,
  length: 1,
  convRule: rule22
}, {
  start: 333,
  length: 1,
  convRule: rule23
}, {
  start: 334,
  length: 1,
  convRule: rule22
}, {
  start: 335,
  length: 1,
  convRule: rule23
}, {
  start: 336,
  length: 1,
  convRule: rule22
}, {
  start: 337,
  length: 1,
  convRule: rule23
}, {
  start: 338,
  length: 1,
  convRule: rule22
}, {
  start: 339,
  length: 1,
  convRule: rule23
}, {
  start: 340,
  length: 1,
  convRule: rule22
}, {
  start: 341,
  length: 1,
  convRule: rule23
}, {
  start: 342,
  length: 1,
  convRule: rule22
}, {
  start: 343,
  length: 1,
  convRule: rule23
}, {
  start: 344,
  length: 1,
  convRule: rule22
}, {
  start: 345,
  length: 1,
  convRule: rule23
}, {
  start: 346,
  length: 1,
  convRule: rule22
}, {
  start: 347,
  length: 1,
  convRule: rule23
}, {
  start: 348,
  length: 1,
  convRule: rule22
}, {
  start: 349,
  length: 1,
  convRule: rule23
}, {
  start: 350,
  length: 1,
  convRule: rule22
}, {
  start: 351,
  length: 1,
  convRule: rule23
}, {
  start: 352,
  length: 1,
  convRule: rule22
}, {
  start: 353,
  length: 1,
  convRule: rule23
}, {
  start: 354,
  length: 1,
  convRule: rule22
}, {
  start: 355,
  length: 1,
  convRule: rule23
}, {
  start: 356,
  length: 1,
  convRule: rule22
}, {
  start: 357,
  length: 1,
  convRule: rule23
}, {
  start: 358,
  length: 1,
  convRule: rule22
}, {
  start: 359,
  length: 1,
  convRule: rule23
}, {
  start: 360,
  length: 1,
  convRule: rule22
}, {
  start: 361,
  length: 1,
  convRule: rule23
}, {
  start: 362,
  length: 1,
  convRule: rule22
}, {
  start: 363,
  length: 1,
  convRule: rule23
}, {
  start: 364,
  length: 1,
  convRule: rule22
}, {
  start: 365,
  length: 1,
  convRule: rule23
}, {
  start: 366,
  length: 1,
  convRule: rule22
}, {
  start: 367,
  length: 1,
  convRule: rule23
}, {
  start: 368,
  length: 1,
  convRule: rule22
}, {
  start: 369,
  length: 1,
  convRule: rule23
}, {
  start: 370,
  length: 1,
  convRule: rule22
}, {
  start: 371,
  length: 1,
  convRule: rule23
}, {
  start: 372,
  length: 1,
  convRule: rule22
}, {
  start: 373,
  length: 1,
  convRule: rule23
}, {
  start: 374,
  length: 1,
  convRule: rule22
}, {
  start: 375,
  length: 1,
  convRule: rule23
}, {
  start: 376,
  length: 1,
  convRule: rule26
}, {
  start: 377,
  length: 1,
  convRule: rule22
}, {
  start: 378,
  length: 1,
  convRule: rule23
}, {
  start: 379,
  length: 1,
  convRule: rule22
}, {
  start: 380,
  length: 1,
  convRule: rule23
}, {
  start: 381,
  length: 1,
  convRule: rule22
}, {
  start: 382,
  length: 1,
  convRule: rule23
}, {
  start: 383,
  length: 1,
  convRule: rule27
}, {
  start: 384,
  length: 1,
  convRule: rule28
}, {
  start: 385,
  length: 1,
  convRule: rule29
}, {
  start: 386,
  length: 1,
  convRule: rule22
}, {
  start: 387,
  length: 1,
  convRule: rule23
}, {
  start: 388,
  length: 1,
  convRule: rule22
}, {
  start: 389,
  length: 1,
  convRule: rule23
}, {
  start: 390,
  length: 1,
  convRule: rule30
}, {
  start: 391,
  length: 1,
  convRule: rule22
}, {
  start: 392,
  length: 1,
  convRule: rule23
}, {
  start: 393,
  length: 2,
  convRule: rule31
}, {
  start: 395,
  length: 1,
  convRule: rule22
}, {
  start: 396,
  length: 1,
  convRule: rule23
}, {
  start: 398,
  length: 1,
  convRule: rule32
}, {
  start: 399,
  length: 1,
  convRule: rule33
}, {
  start: 400,
  length: 1,
  convRule: rule34
}, {
  start: 401,
  length: 1,
  convRule: rule22
}, {
  start: 402,
  length: 1,
  convRule: rule23
}, {
  start: 403,
  length: 1,
  convRule: rule31
}, {
  start: 404,
  length: 1,
  convRule: rule35
}, {
  start: 405,
  length: 1,
  convRule: rule36
}, {
  start: 406,
  length: 1,
  convRule: rule37
}, {
  start: 407,
  length: 1,
  convRule: rule38
}, {
  start: 408,
  length: 1,
  convRule: rule22
}, {
  start: 409,
  length: 1,
  convRule: rule23
}, {
  start: 410,
  length: 1,
  convRule: rule39
}, {
  start: 412,
  length: 1,
  convRule: rule37
}, {
  start: 413,
  length: 1,
  convRule: rule40
}, {
  start: 414,
  length: 1,
  convRule: rule41
}, {
  start: 415,
  length: 1,
  convRule: rule42
}, {
  start: 416,
  length: 1,
  convRule: rule22
}, {
  start: 417,
  length: 1,
  convRule: rule23
}, {
  start: 418,
  length: 1,
  convRule: rule22
}, {
  start: 419,
  length: 1,
  convRule: rule23
}, {
  start: 420,
  length: 1,
  convRule: rule22
}, {
  start: 421,
  length: 1,
  convRule: rule23
}, {
  start: 422,
  length: 1,
  convRule: rule43
}, {
  start: 423,
  length: 1,
  convRule: rule22
}, {
  start: 424,
  length: 1,
  convRule: rule23
}, {
  start: 425,
  length: 1,
  convRule: rule43
}, {
  start: 428,
  length: 1,
  convRule: rule22
}, {
  start: 429,
  length: 1,
  convRule: rule23
}, {
  start: 430,
  length: 1,
  convRule: rule43
}, {
  start: 431,
  length: 1,
  convRule: rule22
}, {
  start: 432,
  length: 1,
  convRule: rule23
}, {
  start: 433,
  length: 2,
  convRule: rule44
}, {
  start: 435,
  length: 1,
  convRule: rule22
}, {
  start: 436,
  length: 1,
  convRule: rule23
}, {
  start: 437,
  length: 1,
  convRule: rule22
}, {
  start: 438,
  length: 1,
  convRule: rule23
}, {
  start: 439,
  length: 1,
  convRule: rule45
}, {
  start: 440,
  length: 1,
  convRule: rule22
}, {
  start: 441,
  length: 1,
  convRule: rule23
}, {
  start: 444,
  length: 1,
  convRule: rule22
}, {
  start: 445,
  length: 1,
  convRule: rule23
}, {
  start: 447,
  length: 1,
  convRule: rule46
}, {
  start: 452,
  length: 1,
  convRule: rule47
}, {
  start: 453,
  length: 1,
  convRule: rule48
}, {
  start: 454,
  length: 1,
  convRule: rule49
}, {
  start: 455,
  length: 1,
  convRule: rule47
}, {
  start: 456,
  length: 1,
  convRule: rule48
}, {
  start: 457,
  length: 1,
  convRule: rule49
}, {
  start: 458,
  length: 1,
  convRule: rule47
}, {
  start: 459,
  length: 1,
  convRule: rule48
}, {
  start: 460,
  length: 1,
  convRule: rule49
}, {
  start: 461,
  length: 1,
  convRule: rule22
}, {
  start: 462,
  length: 1,
  convRule: rule23
}, {
  start: 463,
  length: 1,
  convRule: rule22
}, {
  start: 464,
  length: 1,
  convRule: rule23
}, {
  start: 465,
  length: 1,
  convRule: rule22
}, {
  start: 466,
  length: 1,
  convRule: rule23
}, {
  start: 467,
  length: 1,
  convRule: rule22
}, {
  start: 468,
  length: 1,
  convRule: rule23
}, {
  start: 469,
  length: 1,
  convRule: rule22
}, {
  start: 470,
  length: 1,
  convRule: rule23
}, {
  start: 471,
  length: 1,
  convRule: rule22
}, {
  start: 472,
  length: 1,
  convRule: rule23
}, {
  start: 473,
  length: 1,
  convRule: rule22
}, {
  start: 474,
  length: 1,
  convRule: rule23
}, {
  start: 475,
  length: 1,
  convRule: rule22
}, {
  start: 476,
  length: 1,
  convRule: rule23
}, {
  start: 477,
  length: 1,
  convRule: rule50
}, {
  start: 478,
  length: 1,
  convRule: rule22
}, {
  start: 479,
  length: 1,
  convRule: rule23
}, {
  start: 480,
  length: 1,
  convRule: rule22
}, {
  start: 481,
  length: 1,
  convRule: rule23
}, {
  start: 482,
  length: 1,
  convRule: rule22
}, {
  start: 483,
  length: 1,
  convRule: rule23
}, {
  start: 484,
  length: 1,
  convRule: rule22
}, {
  start: 485,
  length: 1,
  convRule: rule23
}, {
  start: 486,
  length: 1,
  convRule: rule22
}, {
  start: 487,
  length: 1,
  convRule: rule23
}, {
  start: 488,
  length: 1,
  convRule: rule22
}, {
  start: 489,
  length: 1,
  convRule: rule23
}, {
  start: 490,
  length: 1,
  convRule: rule22
}, {
  start: 491,
  length: 1,
  convRule: rule23
}, {
  start: 492,
  length: 1,
  convRule: rule22
}, {
  start: 493,
  length: 1,
  convRule: rule23
}, {
  start: 494,
  length: 1,
  convRule: rule22
}, {
  start: 495,
  length: 1,
  convRule: rule23
}, {
  start: 497,
  length: 1,
  convRule: rule47
}, {
  start: 498,
  length: 1,
  convRule: rule48
}, {
  start: 499,
  length: 1,
  convRule: rule49
}, {
  start: 500,
  length: 1,
  convRule: rule22
}, {
  start: 501,
  length: 1,
  convRule: rule23
}, {
  start: 502,
  length: 1,
  convRule: rule51
}, {
  start: 503,
  length: 1,
  convRule: rule52
}, {
  start: 504,
  length: 1,
  convRule: rule22
}, {
  start: 505,
  length: 1,
  convRule: rule23
}, {
  start: 506,
  length: 1,
  convRule: rule22
}, {
  start: 507,
  length: 1,
  convRule: rule23
}, {
  start: 508,
  length: 1,
  convRule: rule22
}, {
  start: 509,
  length: 1,
  convRule: rule23
}, {
  start: 510,
  length: 1,
  convRule: rule22
}, {
  start: 511,
  length: 1,
  convRule: rule23
}, {
  start: 512,
  length: 1,
  convRule: rule22
}, {
  start: 513,
  length: 1,
  convRule: rule23
}, {
  start: 514,
  length: 1,
  convRule: rule22
}, {
  start: 515,
  length: 1,
  convRule: rule23
}, {
  start: 516,
  length: 1,
  convRule: rule22
}, {
  start: 517,
  length: 1,
  convRule: rule23
}, {
  start: 518,
  length: 1,
  convRule: rule22
}, {
  start: 519,
  length: 1,
  convRule: rule23
}, {
  start: 520,
  length: 1,
  convRule: rule22
}, {
  start: 521,
  length: 1,
  convRule: rule23
}, {
  start: 522,
  length: 1,
  convRule: rule22
}, {
  start: 523,
  length: 1,
  convRule: rule23
}, {
  start: 524,
  length: 1,
  convRule: rule22
}, {
  start: 525,
  length: 1,
  convRule: rule23
}, {
  start: 526,
  length: 1,
  convRule: rule22
}, {
  start: 527,
  length: 1,
  convRule: rule23
}, {
  start: 528,
  length: 1,
  convRule: rule22
}, {
  start: 529,
  length: 1,
  convRule: rule23
}, {
  start: 530,
  length: 1,
  convRule: rule22
}, {
  start: 531,
  length: 1,
  convRule: rule23
}, {
  start: 532,
  length: 1,
  convRule: rule22
}, {
  start: 533,
  length: 1,
  convRule: rule23
}, {
  start: 534,
  length: 1,
  convRule: rule22
}, {
  start: 535,
  length: 1,
  convRule: rule23
}, {
  start: 536,
  length: 1,
  convRule: rule22
}, {
  start: 537,
  length: 1,
  convRule: rule23
}, {
  start: 538,
  length: 1,
  convRule: rule22
}, {
  start: 539,
  length: 1,
  convRule: rule23
}, {
  start: 540,
  length: 1,
  convRule: rule22
}, {
  start: 541,
  length: 1,
  convRule: rule23
}, {
  start: 542,
  length: 1,
  convRule: rule22
}, {
  start: 543,
  length: 1,
  convRule: rule23
}, {
  start: 544,
  length: 1,
  convRule: rule53
}, {
  start: 546,
  length: 1,
  convRule: rule22
}, {
  start: 547,
  length: 1,
  convRule: rule23
}, {
  start: 548,
  length: 1,
  convRule: rule22
}, {
  start: 549,
  length: 1,
  convRule: rule23
}, {
  start: 550,
  length: 1,
  convRule: rule22
}, {
  start: 551,
  length: 1,
  convRule: rule23
}, {
  start: 552,
  length: 1,
  convRule: rule22
}, {
  start: 553,
  length: 1,
  convRule: rule23
}, {
  start: 554,
  length: 1,
  convRule: rule22
}, {
  start: 555,
  length: 1,
  convRule: rule23
}, {
  start: 556,
  length: 1,
  convRule: rule22
}, {
  start: 557,
  length: 1,
  convRule: rule23
}, {
  start: 558,
  length: 1,
  convRule: rule22
}, {
  start: 559,
  length: 1,
  convRule: rule23
}, {
  start: 560,
  length: 1,
  convRule: rule22
}, {
  start: 561,
  length: 1,
  convRule: rule23
}, {
  start: 562,
  length: 1,
  convRule: rule22
}, {
  start: 563,
  length: 1,
  convRule: rule23
}, {
  start: 570,
  length: 1,
  convRule: rule54
}, {
  start: 571,
  length: 1,
  convRule: rule22
}, {
  start: 572,
  length: 1,
  convRule: rule23
}, {
  start: 573,
  length: 1,
  convRule: rule55
}, {
  start: 574,
  length: 1,
  convRule: rule56
}, {
  start: 575,
  length: 2,
  convRule: rule57
}, {
  start: 577,
  length: 1,
  convRule: rule22
}, {
  start: 578,
  length: 1,
  convRule: rule23
}, {
  start: 579,
  length: 1,
  convRule: rule58
}, {
  start: 580,
  length: 1,
  convRule: rule59
}, {
  start: 581,
  length: 1,
  convRule: rule60
}, {
  start: 582,
  length: 1,
  convRule: rule22
}, {
  start: 583,
  length: 1,
  convRule: rule23
}, {
  start: 584,
  length: 1,
  convRule: rule22
}, {
  start: 585,
  length: 1,
  convRule: rule23
}, {
  start: 586,
  length: 1,
  convRule: rule22
}, {
  start: 587,
  length: 1,
  convRule: rule23
}, {
  start: 588,
  length: 1,
  convRule: rule22
}, {
  start: 589,
  length: 1,
  convRule: rule23
}, {
  start: 590,
  length: 1,
  convRule: rule22
}, {
  start: 591,
  length: 1,
  convRule: rule23
}, {
  start: 592,
  length: 1,
  convRule: rule61
}, {
  start: 593,
  length: 1,
  convRule: rule62
}, {
  start: 594,
  length: 1,
  convRule: rule63
}, {
  start: 595,
  length: 1,
  convRule: rule64
}, {
  start: 596,
  length: 1,
  convRule: rule65
}, {
  start: 598,
  length: 2,
  convRule: rule66
}, {
  start: 601,
  length: 1,
  convRule: rule67
}, {
  start: 603,
  length: 1,
  convRule: rule68
}, {
  start: 604,
  length: 1,
  convRule: rule69
}, {
  start: 608,
  length: 1,
  convRule: rule66
}, {
  start: 609,
  length: 1,
  convRule: rule70
}, {
  start: 611,
  length: 1,
  convRule: rule71
}, {
  start: 613,
  length: 1,
  convRule: rule72
}, {
  start: 614,
  length: 1,
  convRule: rule73
}, {
  start: 616,
  length: 1,
  convRule: rule74
}, {
  start: 617,
  length: 1,
  convRule: rule75
}, {
  start: 618,
  length: 1,
  convRule: rule73
}, {
  start: 619,
  length: 1,
  convRule: rule76
}, {
  start: 620,
  length: 1,
  convRule: rule77
}, {
  start: 623,
  length: 1,
  convRule: rule75
}, {
  start: 625,
  length: 1,
  convRule: rule78
}, {
  start: 626,
  length: 1,
  convRule: rule79
}, {
  start: 629,
  length: 1,
  convRule: rule80
}, {
  start: 637,
  length: 1,
  convRule: rule81
}, {
  start: 640,
  length: 1,
  convRule: rule82
}, {
  start: 642,
  length: 1,
  convRule: rule83
}, {
  start: 643,
  length: 1,
  convRule: rule82
}, {
  start: 647,
  length: 1,
  convRule: rule84
}, {
  start: 648,
  length: 1,
  convRule: rule82
}, {
  start: 649,
  length: 1,
  convRule: rule85
}, {
  start: 650,
  length: 2,
  convRule: rule86
}, {
  start: 652,
  length: 1,
  convRule: rule87
}, {
  start: 658,
  length: 1,
  convRule: rule88
}, {
  start: 669,
  length: 1,
  convRule: rule89
}, {
  start: 670,
  length: 1,
  convRule: rule90
}, {
  start: 837,
  length: 1,
  convRule: rule93
}, {
  start: 880,
  length: 1,
  convRule: rule22
}, {
  start: 881,
  length: 1,
  convRule: rule23
}, {
  start: 882,
  length: 1,
  convRule: rule22
}, {
  start: 883,
  length: 1,
  convRule: rule23
}, {
  start: 886,
  length: 1,
  convRule: rule22
}, {
  start: 887,
  length: 1,
  convRule: rule23
}, {
  start: 891,
  length: 3,
  convRule: rule41
}, {
  start: 895,
  length: 1,
  convRule: rule94
}, {
  start: 902,
  length: 1,
  convRule: rule95
}, {
  start: 904,
  length: 3,
  convRule: rule96
}, {
  start: 908,
  length: 1,
  convRule: rule97
}, {
  start: 910,
  length: 2,
  convRule: rule98
}, {
  start: 913,
  length: 17,
  convRule: rule9
}, {
  start: 931,
  length: 9,
  convRule: rule9
}, {
  start: 940,
  length: 1,
  convRule: rule99
}, {
  start: 941,
  length: 3,
  convRule: rule100
}, {
  start: 945,
  length: 17,
  convRule: rule12
}, {
  start: 962,
  length: 1,
  convRule: rule101
}, {
  start: 963,
  length: 9,
  convRule: rule12
}, {
  start: 972,
  length: 1,
  convRule: rule102
}, {
  start: 973,
  length: 2,
  convRule: rule103
}, {
  start: 975,
  length: 1,
  convRule: rule104
}, {
  start: 976,
  length: 1,
  convRule: rule105
}, {
  start: 977,
  length: 1,
  convRule: rule106
}, {
  start: 981,
  length: 1,
  convRule: rule108
}, {
  start: 982,
  length: 1,
  convRule: rule109
}, {
  start: 983,
  length: 1,
  convRule: rule110
}, {
  start: 984,
  length: 1,
  convRule: rule22
}, {
  start: 985,
  length: 1,
  convRule: rule23
}, {
  start: 986,
  length: 1,
  convRule: rule22
}, {
  start: 987,
  length: 1,
  convRule: rule23
}, {
  start: 988,
  length: 1,
  convRule: rule22
}, {
  start: 989,
  length: 1,
  convRule: rule23
}, {
  start: 990,
  length: 1,
  convRule: rule22
}, {
  start: 991,
  length: 1,
  convRule: rule23
}, {
  start: 992,
  length: 1,
  convRule: rule22
}, {
  start: 993,
  length: 1,
  convRule: rule23
}, {
  start: 994,
  length: 1,
  convRule: rule22
}, {
  start: 995,
  length: 1,
  convRule: rule23
}, {
  start: 996,
  length: 1,
  convRule: rule22
}, {
  start: 997,
  length: 1,
  convRule: rule23
}, {
  start: 998,
  length: 1,
  convRule: rule22
}, {
  start: 999,
  length: 1,
  convRule: rule23
}, {
  start: 1e3,
  length: 1,
  convRule: rule22
}, {
  start: 1001,
  length: 1,
  convRule: rule23
}, {
  start: 1002,
  length: 1,
  convRule: rule22
}, {
  start: 1003,
  length: 1,
  convRule: rule23
}, {
  start: 1004,
  length: 1,
  convRule: rule22
}, {
  start: 1005,
  length: 1,
  convRule: rule23
}, {
  start: 1006,
  length: 1,
  convRule: rule22
}, {
  start: 1007,
  length: 1,
  convRule: rule23
}, {
  start: 1008,
  length: 1,
  convRule: rule111
}, {
  start: 1009,
  length: 1,
  convRule: rule112
}, {
  start: 1010,
  length: 1,
  convRule: rule113
}, {
  start: 1011,
  length: 1,
  convRule: rule114
}, {
  start: 1012,
  length: 1,
  convRule: rule115
}, {
  start: 1013,
  length: 1,
  convRule: rule116
}, {
  start: 1015,
  length: 1,
  convRule: rule22
}, {
  start: 1016,
  length: 1,
  convRule: rule23
}, {
  start: 1017,
  length: 1,
  convRule: rule117
}, {
  start: 1018,
  length: 1,
  convRule: rule22
}, {
  start: 1019,
  length: 1,
  convRule: rule23
}, {
  start: 1021,
  length: 3,
  convRule: rule53
}, {
  start: 1024,
  length: 16,
  convRule: rule118
}, {
  start: 1040,
  length: 32,
  convRule: rule9
}, {
  start: 1072,
  length: 32,
  convRule: rule12
}, {
  start: 1104,
  length: 16,
  convRule: rule112
}, {
  start: 1120,
  length: 1,
  convRule: rule22
}, {
  start: 1121,
  length: 1,
  convRule: rule23
}, {
  start: 1122,
  length: 1,
  convRule: rule22
}, {
  start: 1123,
  length: 1,
  convRule: rule23
}, {
  start: 1124,
  length: 1,
  convRule: rule22
}, {
  start: 1125,
  length: 1,
  convRule: rule23
}, {
  start: 1126,
  length: 1,
  convRule: rule22
}, {
  start: 1127,
  length: 1,
  convRule: rule23
}, {
  start: 1128,
  length: 1,
  convRule: rule22
}, {
  start: 1129,
  length: 1,
  convRule: rule23
}, {
  start: 1130,
  length: 1,
  convRule: rule22
}, {
  start: 1131,
  length: 1,
  convRule: rule23
}, {
  start: 1132,
  length: 1,
  convRule: rule22
}, {
  start: 1133,
  length: 1,
  convRule: rule23
}, {
  start: 1134,
  length: 1,
  convRule: rule22
}, {
  start: 1135,
  length: 1,
  convRule: rule23
}, {
  start: 1136,
  length: 1,
  convRule: rule22
}, {
  start: 1137,
  length: 1,
  convRule: rule23
}, {
  start: 1138,
  length: 1,
  convRule: rule22
}, {
  start: 1139,
  length: 1,
  convRule: rule23
}, {
  start: 1140,
  length: 1,
  convRule: rule22
}, {
  start: 1141,
  length: 1,
  convRule: rule23
}, {
  start: 1142,
  length: 1,
  convRule: rule22
}, {
  start: 1143,
  length: 1,
  convRule: rule23
}, {
  start: 1144,
  length: 1,
  convRule: rule22
}, {
  start: 1145,
  length: 1,
  convRule: rule23
}, {
  start: 1146,
  length: 1,
  convRule: rule22
}, {
  start: 1147,
  length: 1,
  convRule: rule23
}, {
  start: 1148,
  length: 1,
  convRule: rule22
}, {
  start: 1149,
  length: 1,
  convRule: rule23
}, {
  start: 1150,
  length: 1,
  convRule: rule22
}, {
  start: 1151,
  length: 1,
  convRule: rule23
}, {
  start: 1152,
  length: 1,
  convRule: rule22
}, {
  start: 1153,
  length: 1,
  convRule: rule23
}, {
  start: 1162,
  length: 1,
  convRule: rule22
}, {
  start: 1163,
  length: 1,
  convRule: rule23
}, {
  start: 1164,
  length: 1,
  convRule: rule22
}, {
  start: 1165,
  length: 1,
  convRule: rule23
}, {
  start: 1166,
  length: 1,
  convRule: rule22
}, {
  start: 1167,
  length: 1,
  convRule: rule23
}, {
  start: 1168,
  length: 1,
  convRule: rule22
}, {
  start: 1169,
  length: 1,
  convRule: rule23
}, {
  start: 1170,
  length: 1,
  convRule: rule22
}, {
  start: 1171,
  length: 1,
  convRule: rule23
}, {
  start: 1172,
  length: 1,
  convRule: rule22
}, {
  start: 1173,
  length: 1,
  convRule: rule23
}, {
  start: 1174,
  length: 1,
  convRule: rule22
}, {
  start: 1175,
  length: 1,
  convRule: rule23
}, {
  start: 1176,
  length: 1,
  convRule: rule22
}, {
  start: 1177,
  length: 1,
  convRule: rule23
}, {
  start: 1178,
  length: 1,
  convRule: rule22
}, {
  start: 1179,
  length: 1,
  convRule: rule23
}, {
  start: 1180,
  length: 1,
  convRule: rule22
}, {
  start: 1181,
  length: 1,
  convRule: rule23
}, {
  start: 1182,
  length: 1,
  convRule: rule22
}, {
  start: 1183,
  length: 1,
  convRule: rule23
}, {
  start: 1184,
  length: 1,
  convRule: rule22
}, {
  start: 1185,
  length: 1,
  convRule: rule23
}, {
  start: 1186,
  length: 1,
  convRule: rule22
}, {
  start: 1187,
  length: 1,
  convRule: rule23
}, {
  start: 1188,
  length: 1,
  convRule: rule22
}, {
  start: 1189,
  length: 1,
  convRule: rule23
}, {
  start: 1190,
  length: 1,
  convRule: rule22
}, {
  start: 1191,
  length: 1,
  convRule: rule23
}, {
  start: 1192,
  length: 1,
  convRule: rule22
}, {
  start: 1193,
  length: 1,
  convRule: rule23
}, {
  start: 1194,
  length: 1,
  convRule: rule22
}, {
  start: 1195,
  length: 1,
  convRule: rule23
}, {
  start: 1196,
  length: 1,
  convRule: rule22
}, {
  start: 1197,
  length: 1,
  convRule: rule23
}, {
  start: 1198,
  length: 1,
  convRule: rule22
}, {
  start: 1199,
  length: 1,
  convRule: rule23
}, {
  start: 1200,
  length: 1,
  convRule: rule22
}, {
  start: 1201,
  length: 1,
  convRule: rule23
}, {
  start: 1202,
  length: 1,
  convRule: rule22
}, {
  start: 1203,
  length: 1,
  convRule: rule23
}, {
  start: 1204,
  length: 1,
  convRule: rule22
}, {
  start: 1205,
  length: 1,
  convRule: rule23
}, {
  start: 1206,
  length: 1,
  convRule: rule22
}, {
  start: 1207,
  length: 1,
  convRule: rule23
}, {
  start: 1208,
  length: 1,
  convRule: rule22
}, {
  start: 1209,
  length: 1,
  convRule: rule23
}, {
  start: 1210,
  length: 1,
  convRule: rule22
}, {
  start: 1211,
  length: 1,
  convRule: rule23
}, {
  start: 1212,
  length: 1,
  convRule: rule22
}, {
  start: 1213,
  length: 1,
  convRule: rule23
}, {
  start: 1214,
  length: 1,
  convRule: rule22
}, {
  start: 1215,
  length: 1,
  convRule: rule23
}, {
  start: 1216,
  length: 1,
  convRule: rule120
}, {
  start: 1217,
  length: 1,
  convRule: rule22
}, {
  start: 1218,
  length: 1,
  convRule: rule23
}, {
  start: 1219,
  length: 1,
  convRule: rule22
}, {
  start: 1220,
  length: 1,
  convRule: rule23
}, {
  start: 1221,
  length: 1,
  convRule: rule22
}, {
  start: 1222,
  length: 1,
  convRule: rule23
}, {
  start: 1223,
  length: 1,
  convRule: rule22
}, {
  start: 1224,
  length: 1,
  convRule: rule23
}, {
  start: 1225,
  length: 1,
  convRule: rule22
}, {
  start: 1226,
  length: 1,
  convRule: rule23
}, {
  start: 1227,
  length: 1,
  convRule: rule22
}, {
  start: 1228,
  length: 1,
  convRule: rule23
}, {
  start: 1229,
  length: 1,
  convRule: rule22
}, {
  start: 1230,
  length: 1,
  convRule: rule23
}, {
  start: 1231,
  length: 1,
  convRule: rule121
}, {
  start: 1232,
  length: 1,
  convRule: rule22
}, {
  start: 1233,
  length: 1,
  convRule: rule23
}, {
  start: 1234,
  length: 1,
  convRule: rule22
}, {
  start: 1235,
  length: 1,
  convRule: rule23
}, {
  start: 1236,
  length: 1,
  convRule: rule22
}, {
  start: 1237,
  length: 1,
  convRule: rule23
}, {
  start: 1238,
  length: 1,
  convRule: rule22
}, {
  start: 1239,
  length: 1,
  convRule: rule23
}, {
  start: 1240,
  length: 1,
  convRule: rule22
}, {
  start: 1241,
  length: 1,
  convRule: rule23
}, {
  start: 1242,
  length: 1,
  convRule: rule22
}, {
  start: 1243,
  length: 1,
  convRule: rule23
}, {
  start: 1244,
  length: 1,
  convRule: rule22
}, {
  start: 1245,
  length: 1,
  convRule: rule23
}, {
  start: 1246,
  length: 1,
  convRule: rule22
}, {
  start: 1247,
  length: 1,
  convRule: rule23
}, {
  start: 1248,
  length: 1,
  convRule: rule22
}, {
  start: 1249,
  length: 1,
  convRule: rule23
}, {
  start: 1250,
  length: 1,
  convRule: rule22
}, {
  start: 1251,
  length: 1,
  convRule: rule23
}, {
  start: 1252,
  length: 1,
  convRule: rule22
}, {
  start: 1253,
  length: 1,
  convRule: rule23
}, {
  start: 1254,
  length: 1,
  convRule: rule22
}, {
  start: 1255,
  length: 1,
  convRule: rule23
}, {
  start: 1256,
  length: 1,
  convRule: rule22
}, {
  start: 1257,
  length: 1,
  convRule: rule23
}, {
  start: 1258,
  length: 1,
  convRule: rule22
}, {
  start: 1259,
  length: 1,
  convRule: rule23
}, {
  start: 1260,
  length: 1,
  convRule: rule22
}, {
  start: 1261,
  length: 1,
  convRule: rule23
}, {
  start: 1262,
  length: 1,
  convRule: rule22
}, {
  start: 1263,
  length: 1,
  convRule: rule23
}, {
  start: 1264,
  length: 1,
  convRule: rule22
}, {
  start: 1265,
  length: 1,
  convRule: rule23
}, {
  start: 1266,
  length: 1,
  convRule: rule22
}, {
  start: 1267,
  length: 1,
  convRule: rule23
}, {
  start: 1268,
  length: 1,
  convRule: rule22
}, {
  start: 1269,
  length: 1,
  convRule: rule23
}, {
  start: 1270,
  length: 1,
  convRule: rule22
}, {
  start: 1271,
  length: 1,
  convRule: rule23
}, {
  start: 1272,
  length: 1,
  convRule: rule22
}, {
  start: 1273,
  length: 1,
  convRule: rule23
}, {
  start: 1274,
  length: 1,
  convRule: rule22
}, {
  start: 1275,
  length: 1,
  convRule: rule23
}, {
  start: 1276,
  length: 1,
  convRule: rule22
}, {
  start: 1277,
  length: 1,
  convRule: rule23
}, {
  start: 1278,
  length: 1,
  convRule: rule22
}, {
  start: 1279,
  length: 1,
  convRule: rule23
}, {
  start: 1280,
  length: 1,
  convRule: rule22
}, {
  start: 1281,
  length: 1,
  convRule: rule23
}, {
  start: 1282,
  length: 1,
  convRule: rule22
}, {
  start: 1283,
  length: 1,
  convRule: rule23
}, {
  start: 1284,
  length: 1,
  convRule: rule22
}, {
  start: 1285,
  length: 1,
  convRule: rule23
}, {
  start: 1286,
  length: 1,
  convRule: rule22
}, {
  start: 1287,
  length: 1,
  convRule: rule23
}, {
  start: 1288,
  length: 1,
  convRule: rule22
}, {
  start: 1289,
  length: 1,
  convRule: rule23
}, {
  start: 1290,
  length: 1,
  convRule: rule22
}, {
  start: 1291,
  length: 1,
  convRule: rule23
}, {
  start: 1292,
  length: 1,
  convRule: rule22
}, {
  start: 1293,
  length: 1,
  convRule: rule23
}, {
  start: 1294,
  length: 1,
  convRule: rule22
}, {
  start: 1295,
  length: 1,
  convRule: rule23
}, {
  start: 1296,
  length: 1,
  convRule: rule22
}, {
  start: 1297,
  length: 1,
  convRule: rule23
}, {
  start: 1298,
  length: 1,
  convRule: rule22
}, {
  start: 1299,
  length: 1,
  convRule: rule23
}, {
  start: 1300,
  length: 1,
  convRule: rule22
}, {
  start: 1301,
  length: 1,
  convRule: rule23
}, {
  start: 1302,
  length: 1,
  convRule: rule22
}, {
  start: 1303,
  length: 1,
  convRule: rule23
}, {
  start: 1304,
  length: 1,
  convRule: rule22
}, {
  start: 1305,
  length: 1,
  convRule: rule23
}, {
  start: 1306,
  length: 1,
  convRule: rule22
}, {
  start: 1307,
  length: 1,
  convRule: rule23
}, {
  start: 1308,
  length: 1,
  convRule: rule22
}, {
  start: 1309,
  length: 1,
  convRule: rule23
}, {
  start: 1310,
  length: 1,
  convRule: rule22
}, {
  start: 1311,
  length: 1,
  convRule: rule23
}, {
  start: 1312,
  length: 1,
  convRule: rule22
}, {
  start: 1313,
  length: 1,
  convRule: rule23
}, {
  start: 1314,
  length: 1,
  convRule: rule22
}, {
  start: 1315,
  length: 1,
  convRule: rule23
}, {
  start: 1316,
  length: 1,
  convRule: rule22
}, {
  start: 1317,
  length: 1,
  convRule: rule23
}, {
  start: 1318,
  length: 1,
  convRule: rule22
}, {
  start: 1319,
  length: 1,
  convRule: rule23
}, {
  start: 1320,
  length: 1,
  convRule: rule22
}, {
  start: 1321,
  length: 1,
  convRule: rule23
}, {
  start: 1322,
  length: 1,
  convRule: rule22
}, {
  start: 1323,
  length: 1,
  convRule: rule23
}, {
  start: 1324,
  length: 1,
  convRule: rule22
}, {
  start: 1325,
  length: 1,
  convRule: rule23
}, {
  start: 1326,
  length: 1,
  convRule: rule22
}, {
  start: 1327,
  length: 1,
  convRule: rule23
}, {
  start: 1329,
  length: 38,
  convRule: rule122
}, {
  start: 1377,
  length: 38,
  convRule: rule123
}, {
  start: 4256,
  length: 38,
  convRule: rule125
}, {
  start: 4295,
  length: 1,
  convRule: rule125
}, {
  start: 4301,
  length: 1,
  convRule: rule125
}, {
  start: 4304,
  length: 43,
  convRule: rule126
}, {
  start: 4349,
  length: 3,
  convRule: rule126
}, {
  start: 5024,
  length: 80,
  convRule: rule127
}, {
  start: 5104,
  length: 6,
  convRule: rule104
}, {
  start: 5112,
  length: 6,
  convRule: rule110
}, {
  start: 7296,
  length: 1,
  convRule: rule129
}, {
  start: 7297,
  length: 1,
  convRule: rule130
}, {
  start: 7298,
  length: 1,
  convRule: rule131
}, {
  start: 7299,
  length: 2,
  convRule: rule132
}, {
  start: 7301,
  length: 1,
  convRule: rule133
}, {
  start: 7302,
  length: 1,
  convRule: rule134
}, {
  start: 7303,
  length: 1,
  convRule: rule135
}, {
  start: 7304,
  length: 1,
  convRule: rule136
}, {
  start: 7312,
  length: 43,
  convRule: rule137
}, {
  start: 7357,
  length: 3,
  convRule: rule137
}, {
  start: 7545,
  length: 1,
  convRule: rule138
}, {
  start: 7549,
  length: 1,
  convRule: rule139
}, {
  start: 7566,
  length: 1,
  convRule: rule140
}, {
  start: 7680,
  length: 1,
  convRule: rule22
}, {
  start: 7681,
  length: 1,
  convRule: rule23
}, {
  start: 7682,
  length: 1,
  convRule: rule22
}, {
  start: 7683,
  length: 1,
  convRule: rule23
}, {
  start: 7684,
  length: 1,
  convRule: rule22
}, {
  start: 7685,
  length: 1,
  convRule: rule23
}, {
  start: 7686,
  length: 1,
  convRule: rule22
}, {
  start: 7687,
  length: 1,
  convRule: rule23
}, {
  start: 7688,
  length: 1,
  convRule: rule22
}, {
  start: 7689,
  length: 1,
  convRule: rule23
}, {
  start: 7690,
  length: 1,
  convRule: rule22
}, {
  start: 7691,
  length: 1,
  convRule: rule23
}, {
  start: 7692,
  length: 1,
  convRule: rule22
}, {
  start: 7693,
  length: 1,
  convRule: rule23
}, {
  start: 7694,
  length: 1,
  convRule: rule22
}, {
  start: 7695,
  length: 1,
  convRule: rule23
}, {
  start: 7696,
  length: 1,
  convRule: rule22
}, {
  start: 7697,
  length: 1,
  convRule: rule23
}, {
  start: 7698,
  length: 1,
  convRule: rule22
}, {
  start: 7699,
  length: 1,
  convRule: rule23
}, {
  start: 7700,
  length: 1,
  convRule: rule22
}, {
  start: 7701,
  length: 1,
  convRule: rule23
}, {
  start: 7702,
  length: 1,
  convRule: rule22
}, {
  start: 7703,
  length: 1,
  convRule: rule23
}, {
  start: 7704,
  length: 1,
  convRule: rule22
}, {
  start: 7705,
  length: 1,
  convRule: rule23
}, {
  start: 7706,
  length: 1,
  convRule: rule22
}, {
  start: 7707,
  length: 1,
  convRule: rule23
}, {
  start: 7708,
  length: 1,
  convRule: rule22
}, {
  start: 7709,
  length: 1,
  convRule: rule23
}, {
  start: 7710,
  length: 1,
  convRule: rule22
}, {
  start: 7711,
  length: 1,
  convRule: rule23
}, {
  start: 7712,
  length: 1,
  convRule: rule22
}, {
  start: 7713,
  length: 1,
  convRule: rule23
}, {
  start: 7714,
  length: 1,
  convRule: rule22
}, {
  start: 7715,
  length: 1,
  convRule: rule23
}, {
  start: 7716,
  length: 1,
  convRule: rule22
}, {
  start: 7717,
  length: 1,
  convRule: rule23
}, {
  start: 7718,
  length: 1,
  convRule: rule22
}, {
  start: 7719,
  length: 1,
  convRule: rule23
}, {
  start: 7720,
  length: 1,
  convRule: rule22
}, {
  start: 7721,
  length: 1,
  convRule: rule23
}, {
  start: 7722,
  length: 1,
  convRule: rule22
}, {
  start: 7723,
  length: 1,
  convRule: rule23
}, {
  start: 7724,
  length: 1,
  convRule: rule22
}, {
  start: 7725,
  length: 1,
  convRule: rule23
}, {
  start: 7726,
  length: 1,
  convRule: rule22
}, {
  start: 7727,
  length: 1,
  convRule: rule23
}, {
  start: 7728,
  length: 1,
  convRule: rule22
}, {
  start: 7729,
  length: 1,
  convRule: rule23
}, {
  start: 7730,
  length: 1,
  convRule: rule22
}, {
  start: 7731,
  length: 1,
  convRule: rule23
}, {
  start: 7732,
  length: 1,
  convRule: rule22
}, {
  start: 7733,
  length: 1,
  convRule: rule23
}, {
  start: 7734,
  length: 1,
  convRule: rule22
}, {
  start: 7735,
  length: 1,
  convRule: rule23
}, {
  start: 7736,
  length: 1,
  convRule: rule22
}, {
  start: 7737,
  length: 1,
  convRule: rule23
}, {
  start: 7738,
  length: 1,
  convRule: rule22
}, {
  start: 7739,
  length: 1,
  convRule: rule23
}, {
  start: 7740,
  length: 1,
  convRule: rule22
}, {
  start: 7741,
  length: 1,
  convRule: rule23
}, {
  start: 7742,
  length: 1,
  convRule: rule22
}, {
  start: 7743,
  length: 1,
  convRule: rule23
}, {
  start: 7744,
  length: 1,
  convRule: rule22
}, {
  start: 7745,
  length: 1,
  convRule: rule23
}, {
  start: 7746,
  length: 1,
  convRule: rule22
}, {
  start: 7747,
  length: 1,
  convRule: rule23
}, {
  start: 7748,
  length: 1,
  convRule: rule22
}, {
  start: 7749,
  length: 1,
  convRule: rule23
}, {
  start: 7750,
  length: 1,
  convRule: rule22
}, {
  start: 7751,
  length: 1,
  convRule: rule23
}, {
  start: 7752,
  length: 1,
  convRule: rule22
}, {
  start: 7753,
  length: 1,
  convRule: rule23
}, {
  start: 7754,
  length: 1,
  convRule: rule22
}, {
  start: 7755,
  length: 1,
  convRule: rule23
}, {
  start: 7756,
  length: 1,
  convRule: rule22
}, {
  start: 7757,
  length: 1,
  convRule: rule23
}, {
  start: 7758,
  length: 1,
  convRule: rule22
}, {
  start: 7759,
  length: 1,
  convRule: rule23
}, {
  start: 7760,
  length: 1,
  convRule: rule22
}, {
  start: 7761,
  length: 1,
  convRule: rule23
}, {
  start: 7762,
  length: 1,
  convRule: rule22
}, {
  start: 7763,
  length: 1,
  convRule: rule23
}, {
  start: 7764,
  length: 1,
  convRule: rule22
}, {
  start: 7765,
  length: 1,
  convRule: rule23
}, {
  start: 7766,
  length: 1,
  convRule: rule22
}, {
  start: 7767,
  length: 1,
  convRule: rule23
}, {
  start: 7768,
  length: 1,
  convRule: rule22
}, {
  start: 7769,
  length: 1,
  convRule: rule23
}, {
  start: 7770,
  length: 1,
  convRule: rule22
}, {
  start: 7771,
  length: 1,
  convRule: rule23
}, {
  start: 7772,
  length: 1,
  convRule: rule22
}, {
  start: 7773,
  length: 1,
  convRule: rule23
}, {
  start: 7774,
  length: 1,
  convRule: rule22
}, {
  start: 7775,
  length: 1,
  convRule: rule23
}, {
  start: 7776,
  length: 1,
  convRule: rule22
}, {
  start: 7777,
  length: 1,
  convRule: rule23
}, {
  start: 7778,
  length: 1,
  convRule: rule22
}, {
  start: 7779,
  length: 1,
  convRule: rule23
}, {
  start: 7780,
  length: 1,
  convRule: rule22
}, {
  start: 7781,
  length: 1,
  convRule: rule23
}, {
  start: 7782,
  length: 1,
  convRule: rule22
}, {
  start: 7783,
  length: 1,
  convRule: rule23
}, {
  start: 7784,
  length: 1,
  convRule: rule22
}, {
  start: 7785,
  length: 1,
  convRule: rule23
}, {
  start: 7786,
  length: 1,
  convRule: rule22
}, {
  start: 7787,
  length: 1,
  convRule: rule23
}, {
  start: 7788,
  length: 1,
  convRule: rule22
}, {
  start: 7789,
  length: 1,
  convRule: rule23
}, {
  start: 7790,
  length: 1,
  convRule: rule22
}, {
  start: 7791,
  length: 1,
  convRule: rule23
}, {
  start: 7792,
  length: 1,
  convRule: rule22
}, {
  start: 7793,
  length: 1,
  convRule: rule23
}, {
  start: 7794,
  length: 1,
  convRule: rule22
}, {
  start: 7795,
  length: 1,
  convRule: rule23
}, {
  start: 7796,
  length: 1,
  convRule: rule22
}, {
  start: 7797,
  length: 1,
  convRule: rule23
}, {
  start: 7798,
  length: 1,
  convRule: rule22
}, {
  start: 7799,
  length: 1,
  convRule: rule23
}, {
  start: 7800,
  length: 1,
  convRule: rule22
}, {
  start: 7801,
  length: 1,
  convRule: rule23
}, {
  start: 7802,
  length: 1,
  convRule: rule22
}, {
  start: 7803,
  length: 1,
  convRule: rule23
}, {
  start: 7804,
  length: 1,
  convRule: rule22
}, {
  start: 7805,
  length: 1,
  convRule: rule23
}, {
  start: 7806,
  length: 1,
  convRule: rule22
}, {
  start: 7807,
  length: 1,
  convRule: rule23
}, {
  start: 7808,
  length: 1,
  convRule: rule22
}, {
  start: 7809,
  length: 1,
  convRule: rule23
}, {
  start: 7810,
  length: 1,
  convRule: rule22
}, {
  start: 7811,
  length: 1,
  convRule: rule23
}, {
  start: 7812,
  length: 1,
  convRule: rule22
}, {
  start: 7813,
  length: 1,
  convRule: rule23
}, {
  start: 7814,
  length: 1,
  convRule: rule22
}, {
  start: 7815,
  length: 1,
  convRule: rule23
}, {
  start: 7816,
  length: 1,
  convRule: rule22
}, {
  start: 7817,
  length: 1,
  convRule: rule23
}, {
  start: 7818,
  length: 1,
  convRule: rule22
}, {
  start: 7819,
  length: 1,
  convRule: rule23
}, {
  start: 7820,
  length: 1,
  convRule: rule22
}, {
  start: 7821,
  length: 1,
  convRule: rule23
}, {
  start: 7822,
  length: 1,
  convRule: rule22
}, {
  start: 7823,
  length: 1,
  convRule: rule23
}, {
  start: 7824,
  length: 1,
  convRule: rule22
}, {
  start: 7825,
  length: 1,
  convRule: rule23
}, {
  start: 7826,
  length: 1,
  convRule: rule22
}, {
  start: 7827,
  length: 1,
  convRule: rule23
}, {
  start: 7828,
  length: 1,
  convRule: rule22
}, {
  start: 7829,
  length: 1,
  convRule: rule23
}, {
  start: 7835,
  length: 1,
  convRule: rule141
}, {
  start: 7838,
  length: 1,
  convRule: rule142
}, {
  start: 7840,
  length: 1,
  convRule: rule22
}, {
  start: 7841,
  length: 1,
  convRule: rule23
}, {
  start: 7842,
  length: 1,
  convRule: rule22
}, {
  start: 7843,
  length: 1,
  convRule: rule23
}, {
  start: 7844,
  length: 1,
  convRule: rule22
}, {
  start: 7845,
  length: 1,
  convRule: rule23
}, {
  start: 7846,
  length: 1,
  convRule: rule22
}, {
  start: 7847,
  length: 1,
  convRule: rule23
}, {
  start: 7848,
  length: 1,
  convRule: rule22
}, {
  start: 7849,
  length: 1,
  convRule: rule23
}, {
  start: 7850,
  length: 1,
  convRule: rule22
}, {
  start: 7851,
  length: 1,
  convRule: rule23
}, {
  start: 7852,
  length: 1,
  convRule: rule22
}, {
  start: 7853,
  length: 1,
  convRule: rule23
}, {
  start: 7854,
  length: 1,
  convRule: rule22
}, {
  start: 7855,
  length: 1,
  convRule: rule23
}, {
  start: 7856,
  length: 1,
  convRule: rule22
}, {
  start: 7857,
  length: 1,
  convRule: rule23
}, {
  start: 7858,
  length: 1,
  convRule: rule22
}, {
  start: 7859,
  length: 1,
  convRule: rule23
}, {
  start: 7860,
  length: 1,
  convRule: rule22
}, {
  start: 7861,
  length: 1,
  convRule: rule23
}, {
  start: 7862,
  length: 1,
  convRule: rule22
}, {
  start: 7863,
  length: 1,
  convRule: rule23
}, {
  start: 7864,
  length: 1,
  convRule: rule22
}, {
  start: 7865,
  length: 1,
  convRule: rule23
}, {
  start: 7866,
  length: 1,
  convRule: rule22
}, {
  start: 7867,
  length: 1,
  convRule: rule23
}, {
  start: 7868,
  length: 1,
  convRule: rule22
}, {
  start: 7869,
  length: 1,
  convRule: rule23
}, {
  start: 7870,
  length: 1,
  convRule: rule22
}, {
  start: 7871,
  length: 1,
  convRule: rule23
}, {
  start: 7872,
  length: 1,
  convRule: rule22
}, {
  start: 7873,
  length: 1,
  convRule: rule23
}, {
  start: 7874,
  length: 1,
  convRule: rule22
}, {
  start: 7875,
  length: 1,
  convRule: rule23
}, {
  start: 7876,
  length: 1,
  convRule: rule22
}, {
  start: 7877,
  length: 1,
  convRule: rule23
}, {
  start: 7878,
  length: 1,
  convRule: rule22
}, {
  start: 7879,
  length: 1,
  convRule: rule23
}, {
  start: 7880,
  length: 1,
  convRule: rule22
}, {
  start: 7881,
  length: 1,
  convRule: rule23
}, {
  start: 7882,
  length: 1,
  convRule: rule22
}, {
  start: 7883,
  length: 1,
  convRule: rule23
}, {
  start: 7884,
  length: 1,
  convRule: rule22
}, {
  start: 7885,
  length: 1,
  convRule: rule23
}, {
  start: 7886,
  length: 1,
  convRule: rule22
}, {
  start: 7887,
  length: 1,
  convRule: rule23
}, {
  start: 7888,
  length: 1,
  convRule: rule22
}, {
  start: 7889,
  length: 1,
  convRule: rule23
}, {
  start: 7890,
  length: 1,
  convRule: rule22
}, {
  start: 7891,
  length: 1,
  convRule: rule23
}, {
  start: 7892,
  length: 1,
  convRule: rule22
}, {
  start: 7893,
  length: 1,
  convRule: rule23
}, {
  start: 7894,
  length: 1,
  convRule: rule22
}, {
  start: 7895,
  length: 1,
  convRule: rule23
}, {
  start: 7896,
  length: 1,
  convRule: rule22
}, {
  start: 7897,
  length: 1,
  convRule: rule23
}, {
  start: 7898,
  length: 1,
  convRule: rule22
}, {
  start: 7899,
  length: 1,
  convRule: rule23
}, {
  start: 7900,
  length: 1,
  convRule: rule22
}, {
  start: 7901,
  length: 1,
  convRule: rule23
}, {
  start: 7902,
  length: 1,
  convRule: rule22
}, {
  start: 7903,
  length: 1,
  convRule: rule23
}, {
  start: 7904,
  length: 1,
  convRule: rule22
}, {
  start: 7905,
  length: 1,
  convRule: rule23
}, {
  start: 7906,
  length: 1,
  convRule: rule22
}, {
  start: 7907,
  length: 1,
  convRule: rule23
}, {
  start: 7908,
  length: 1,
  convRule: rule22
}, {
  start: 7909,
  length: 1,
  convRule: rule23
}, {
  start: 7910,
  length: 1,
  convRule: rule22
}, {
  start: 7911,
  length: 1,
  convRule: rule23
}, {
  start: 7912,
  length: 1,
  convRule: rule22
}, {
  start: 7913,
  length: 1,
  convRule: rule23
}, {
  start: 7914,
  length: 1,
  convRule: rule22
}, {
  start: 7915,
  length: 1,
  convRule: rule23
}, {
  start: 7916,
  length: 1,
  convRule: rule22
}, {
  start: 7917,
  length: 1,
  convRule: rule23
}, {
  start: 7918,
  length: 1,
  convRule: rule22
}, {
  start: 7919,
  length: 1,
  convRule: rule23
}, {
  start: 7920,
  length: 1,
  convRule: rule22
}, {
  start: 7921,
  length: 1,
  convRule: rule23
}, {
  start: 7922,
  length: 1,
  convRule: rule22
}, {
  start: 7923,
  length: 1,
  convRule: rule23
}, {
  start: 7924,
  length: 1,
  convRule: rule22
}, {
  start: 7925,
  length: 1,
  convRule: rule23
}, {
  start: 7926,
  length: 1,
  convRule: rule22
}, {
  start: 7927,
  length: 1,
  convRule: rule23
}, {
  start: 7928,
  length: 1,
  convRule: rule22
}, {
  start: 7929,
  length: 1,
  convRule: rule23
}, {
  start: 7930,
  length: 1,
  convRule: rule22
}, {
  start: 7931,
  length: 1,
  convRule: rule23
}, {
  start: 7932,
  length: 1,
  convRule: rule22
}, {
  start: 7933,
  length: 1,
  convRule: rule23
}, {
  start: 7934,
  length: 1,
  convRule: rule22
}, {
  start: 7935,
  length: 1,
  convRule: rule23
}, {
  start: 7936,
  length: 8,
  convRule: rule143
}, {
  start: 7944,
  length: 8,
  convRule: rule144
}, {
  start: 7952,
  length: 6,
  convRule: rule143
}, {
  start: 7960,
  length: 6,
  convRule: rule144
}, {
  start: 7968,
  length: 8,
  convRule: rule143
}, {
  start: 7976,
  length: 8,
  convRule: rule144
}, {
  start: 7984,
  length: 8,
  convRule: rule143
}, {
  start: 7992,
  length: 8,
  convRule: rule144
}, {
  start: 8e3,
  length: 6,
  convRule: rule143
}, {
  start: 8008,
  length: 6,
  convRule: rule144
}, {
  start: 8017,
  length: 1,
  convRule: rule143
}, {
  start: 8019,
  length: 1,
  convRule: rule143
}, {
  start: 8021,
  length: 1,
  convRule: rule143
}, {
  start: 8023,
  length: 1,
  convRule: rule143
}, {
  start: 8025,
  length: 1,
  convRule: rule144
}, {
  start: 8027,
  length: 1,
  convRule: rule144
}, {
  start: 8029,
  length: 1,
  convRule: rule144
}, {
  start: 8031,
  length: 1,
  convRule: rule144
}, {
  start: 8032,
  length: 8,
  convRule: rule143
}, {
  start: 8040,
  length: 8,
  convRule: rule144
}, {
  start: 8048,
  length: 2,
  convRule: rule145
}, {
  start: 8050,
  length: 4,
  convRule: rule146
}, {
  start: 8054,
  length: 2,
  convRule: rule147
}, {
  start: 8056,
  length: 2,
  convRule: rule148
}, {
  start: 8058,
  length: 2,
  convRule: rule149
}, {
  start: 8060,
  length: 2,
  convRule: rule150
}, {
  start: 8064,
  length: 8,
  convRule: rule143
}, {
  start: 8072,
  length: 8,
  convRule: rule151
}, {
  start: 8080,
  length: 8,
  convRule: rule143
}, {
  start: 8088,
  length: 8,
  convRule: rule151
}, {
  start: 8096,
  length: 8,
  convRule: rule143
}, {
  start: 8104,
  length: 8,
  convRule: rule151
}, {
  start: 8112,
  length: 2,
  convRule: rule143
}, {
  start: 8115,
  length: 1,
  convRule: rule152
}, {
  start: 8120,
  length: 2,
  convRule: rule144
}, {
  start: 8122,
  length: 2,
  convRule: rule153
}, {
  start: 8124,
  length: 1,
  convRule: rule154
}, {
  start: 8126,
  length: 1,
  convRule: rule155
}, {
  start: 8131,
  length: 1,
  convRule: rule152
}, {
  start: 8136,
  length: 4,
  convRule: rule156
}, {
  start: 8140,
  length: 1,
  convRule: rule154
}, {
  start: 8144,
  length: 2,
  convRule: rule143
}, {
  start: 8152,
  length: 2,
  convRule: rule144
}, {
  start: 8154,
  length: 2,
  convRule: rule157
}, {
  start: 8160,
  length: 2,
  convRule: rule143
}, {
  start: 8165,
  length: 1,
  convRule: rule113
}, {
  start: 8168,
  length: 2,
  convRule: rule144
}, {
  start: 8170,
  length: 2,
  convRule: rule158
}, {
  start: 8172,
  length: 1,
  convRule: rule117
}, {
  start: 8179,
  length: 1,
  convRule: rule152
}, {
  start: 8184,
  length: 2,
  convRule: rule159
}, {
  start: 8186,
  length: 2,
  convRule: rule160
}, {
  start: 8188,
  length: 1,
  convRule: rule154
}, {
  start: 8486,
  length: 1,
  convRule: rule163
}, {
  start: 8490,
  length: 1,
  convRule: rule164
}, {
  start: 8491,
  length: 1,
  convRule: rule165
}, {
  start: 8498,
  length: 1,
  convRule: rule166
}, {
  start: 8526,
  length: 1,
  convRule: rule167
}, {
  start: 8544,
  length: 16,
  convRule: rule168
}, {
  start: 8560,
  length: 16,
  convRule: rule169
}, {
  start: 8579,
  length: 1,
  convRule: rule22
}, {
  start: 8580,
  length: 1,
  convRule: rule23
}, {
  start: 9398,
  length: 26,
  convRule: rule170
}, {
  start: 9424,
  length: 26,
  convRule: rule171
}, {
  start: 11264,
  length: 47,
  convRule: rule122
}, {
  start: 11312,
  length: 47,
  convRule: rule123
}, {
  start: 11360,
  length: 1,
  convRule: rule22
}, {
  start: 11361,
  length: 1,
  convRule: rule23
}, {
  start: 11362,
  length: 1,
  convRule: rule172
}, {
  start: 11363,
  length: 1,
  convRule: rule173
}, {
  start: 11364,
  length: 1,
  convRule: rule174
}, {
  start: 11365,
  length: 1,
  convRule: rule175
}, {
  start: 11366,
  length: 1,
  convRule: rule176
}, {
  start: 11367,
  length: 1,
  convRule: rule22
}, {
  start: 11368,
  length: 1,
  convRule: rule23
}, {
  start: 11369,
  length: 1,
  convRule: rule22
}, {
  start: 11370,
  length: 1,
  convRule: rule23
}, {
  start: 11371,
  length: 1,
  convRule: rule22
}, {
  start: 11372,
  length: 1,
  convRule: rule23
}, {
  start: 11373,
  length: 1,
  convRule: rule177
}, {
  start: 11374,
  length: 1,
  convRule: rule178
}, {
  start: 11375,
  length: 1,
  convRule: rule179
}, {
  start: 11376,
  length: 1,
  convRule: rule180
}, {
  start: 11378,
  length: 1,
  convRule: rule22
}, {
  start: 11379,
  length: 1,
  convRule: rule23
}, {
  start: 11381,
  length: 1,
  convRule: rule22
}, {
  start: 11382,
  length: 1,
  convRule: rule23
}, {
  start: 11390,
  length: 2,
  convRule: rule181
}, {
  start: 11392,
  length: 1,
  convRule: rule22
}, {
  start: 11393,
  length: 1,
  convRule: rule23
}, {
  start: 11394,
  length: 1,
  convRule: rule22
}, {
  start: 11395,
  length: 1,
  convRule: rule23
}, {
  start: 11396,
  length: 1,
  convRule: rule22
}, {
  start: 11397,
  length: 1,
  convRule: rule23
}, {
  start: 11398,
  length: 1,
  convRule: rule22
}, {
  start: 11399,
  length: 1,
  convRule: rule23
}, {
  start: 11400,
  length: 1,
  convRule: rule22
}, {
  start: 11401,
  length: 1,
  convRule: rule23
}, {
  start: 11402,
  length: 1,
  convRule: rule22
}, {
  start: 11403,
  length: 1,
  convRule: rule23
}, {
  start: 11404,
  length: 1,
  convRule: rule22
}, {
  start: 11405,
  length: 1,
  convRule: rule23
}, {
  start: 11406,
  length: 1,
  convRule: rule22
}, {
  start: 11407,
  length: 1,
  convRule: rule23
}, {
  start: 11408,
  length: 1,
  convRule: rule22
}, {
  start: 11409,
  length: 1,
  convRule: rule23
}, {
  start: 11410,
  length: 1,
  convRule: rule22
}, {
  start: 11411,
  length: 1,
  convRule: rule23
}, {
  start: 11412,
  length: 1,
  convRule: rule22
}, {
  start: 11413,
  length: 1,
  convRule: rule23
}, {
  start: 11414,
  length: 1,
  convRule: rule22
}, {
  start: 11415,
  length: 1,
  convRule: rule23
}, {
  start: 11416,
  length: 1,
  convRule: rule22
}, {
  start: 11417,
  length: 1,
  convRule: rule23
}, {
  start: 11418,
  length: 1,
  convRule: rule22
}, {
  start: 11419,
  length: 1,
  convRule: rule23
}, {
  start: 11420,
  length: 1,
  convRule: rule22
}, {
  start: 11421,
  length: 1,
  convRule: rule23
}, {
  start: 11422,
  length: 1,
  convRule: rule22
}, {
  start: 11423,
  length: 1,
  convRule: rule23
}, {
  start: 11424,
  length: 1,
  convRule: rule22
}, {
  start: 11425,
  length: 1,
  convRule: rule23
}, {
  start: 11426,
  length: 1,
  convRule: rule22
}, {
  start: 11427,
  length: 1,
  convRule: rule23
}, {
  start: 11428,
  length: 1,
  convRule: rule22
}, {
  start: 11429,
  length: 1,
  convRule: rule23
}, {
  start: 11430,
  length: 1,
  convRule: rule22
}, {
  start: 11431,
  length: 1,
  convRule: rule23
}, {
  start: 11432,
  length: 1,
  convRule: rule22
}, {
  start: 11433,
  length: 1,
  convRule: rule23
}, {
  start: 11434,
  length: 1,
  convRule: rule22
}, {
  start: 11435,
  length: 1,
  convRule: rule23
}, {
  start: 11436,
  length: 1,
  convRule: rule22
}, {
  start: 11437,
  length: 1,
  convRule: rule23
}, {
  start: 11438,
  length: 1,
  convRule: rule22
}, {
  start: 11439,
  length: 1,
  convRule: rule23
}, {
  start: 11440,
  length: 1,
  convRule: rule22
}, {
  start: 11441,
  length: 1,
  convRule: rule23
}, {
  start: 11442,
  length: 1,
  convRule: rule22
}, {
  start: 11443,
  length: 1,
  convRule: rule23
}, {
  start: 11444,
  length: 1,
  convRule: rule22
}, {
  start: 11445,
  length: 1,
  convRule: rule23
}, {
  start: 11446,
  length: 1,
  convRule: rule22
}, {
  start: 11447,
  length: 1,
  convRule: rule23
}, {
  start: 11448,
  length: 1,
  convRule: rule22
}, {
  start: 11449,
  length: 1,
  convRule: rule23
}, {
  start: 11450,
  length: 1,
  convRule: rule22
}, {
  start: 11451,
  length: 1,
  convRule: rule23
}, {
  start: 11452,
  length: 1,
  convRule: rule22
}, {
  start: 11453,
  length: 1,
  convRule: rule23
}, {
  start: 11454,
  length: 1,
  convRule: rule22
}, {
  start: 11455,
  length: 1,
  convRule: rule23
}, {
  start: 11456,
  length: 1,
  convRule: rule22
}, {
  start: 11457,
  length: 1,
  convRule: rule23
}, {
  start: 11458,
  length: 1,
  convRule: rule22
}, {
  start: 11459,
  length: 1,
  convRule: rule23
}, {
  start: 11460,
  length: 1,
  convRule: rule22
}, {
  start: 11461,
  length: 1,
  convRule: rule23
}, {
  start: 11462,
  length: 1,
  convRule: rule22
}, {
  start: 11463,
  length: 1,
  convRule: rule23
}, {
  start: 11464,
  length: 1,
  convRule: rule22
}, {
  start: 11465,
  length: 1,
  convRule: rule23
}, {
  start: 11466,
  length: 1,
  convRule: rule22
}, {
  start: 11467,
  length: 1,
  convRule: rule23
}, {
  start: 11468,
  length: 1,
  convRule: rule22
}, {
  start: 11469,
  length: 1,
  convRule: rule23
}, {
  start: 11470,
  length: 1,
  convRule: rule22
}, {
  start: 11471,
  length: 1,
  convRule: rule23
}, {
  start: 11472,
  length: 1,
  convRule: rule22
}, {
  start: 11473,
  length: 1,
  convRule: rule23
}, {
  start: 11474,
  length: 1,
  convRule: rule22
}, {
  start: 11475,
  length: 1,
  convRule: rule23
}, {
  start: 11476,
  length: 1,
  convRule: rule22
}, {
  start: 11477,
  length: 1,
  convRule: rule23
}, {
  start: 11478,
  length: 1,
  convRule: rule22
}, {
  start: 11479,
  length: 1,
  convRule: rule23
}, {
  start: 11480,
  length: 1,
  convRule: rule22
}, {
  start: 11481,
  length: 1,
  convRule: rule23
}, {
  start: 11482,
  length: 1,
  convRule: rule22
}, {
  start: 11483,
  length: 1,
  convRule: rule23
}, {
  start: 11484,
  length: 1,
  convRule: rule22
}, {
  start: 11485,
  length: 1,
  convRule: rule23
}, {
  start: 11486,
  length: 1,
  convRule: rule22
}, {
  start: 11487,
  length: 1,
  convRule: rule23
}, {
  start: 11488,
  length: 1,
  convRule: rule22
}, {
  start: 11489,
  length: 1,
  convRule: rule23
}, {
  start: 11490,
  length: 1,
  convRule: rule22
}, {
  start: 11491,
  length: 1,
  convRule: rule23
}, {
  start: 11499,
  length: 1,
  convRule: rule22
}, {
  start: 11500,
  length: 1,
  convRule: rule23
}, {
  start: 11501,
  length: 1,
  convRule: rule22
}, {
  start: 11502,
  length: 1,
  convRule: rule23
}, {
  start: 11506,
  length: 1,
  convRule: rule22
}, {
  start: 11507,
  length: 1,
  convRule: rule23
}, {
  start: 11520,
  length: 38,
  convRule: rule182
}, {
  start: 11559,
  length: 1,
  convRule: rule182
}, {
  start: 11565,
  length: 1,
  convRule: rule182
}, {
  start: 42560,
  length: 1,
  convRule: rule22
}, {
  start: 42561,
  length: 1,
  convRule: rule23
}, {
  start: 42562,
  length: 1,
  convRule: rule22
}, {
  start: 42563,
  length: 1,
  convRule: rule23
}, {
  start: 42564,
  length: 1,
  convRule: rule22
}, {
  start: 42565,
  length: 1,
  convRule: rule23
}, {
  start: 42566,
  length: 1,
  convRule: rule22
}, {
  start: 42567,
  length: 1,
  convRule: rule23
}, {
  start: 42568,
  length: 1,
  convRule: rule22
}, {
  start: 42569,
  length: 1,
  convRule: rule23
}, {
  start: 42570,
  length: 1,
  convRule: rule22
}, {
  start: 42571,
  length: 1,
  convRule: rule23
}, {
  start: 42572,
  length: 1,
  convRule: rule22
}, {
  start: 42573,
  length: 1,
  convRule: rule23
}, {
  start: 42574,
  length: 1,
  convRule: rule22
}, {
  start: 42575,
  length: 1,
  convRule: rule23
}, {
  start: 42576,
  length: 1,
  convRule: rule22
}, {
  start: 42577,
  length: 1,
  convRule: rule23
}, {
  start: 42578,
  length: 1,
  convRule: rule22
}, {
  start: 42579,
  length: 1,
  convRule: rule23
}, {
  start: 42580,
  length: 1,
  convRule: rule22
}, {
  start: 42581,
  length: 1,
  convRule: rule23
}, {
  start: 42582,
  length: 1,
  convRule: rule22
}, {
  start: 42583,
  length: 1,
  convRule: rule23
}, {
  start: 42584,
  length: 1,
  convRule: rule22
}, {
  start: 42585,
  length: 1,
  convRule: rule23
}, {
  start: 42586,
  length: 1,
  convRule: rule22
}, {
  start: 42587,
  length: 1,
  convRule: rule23
}, {
  start: 42588,
  length: 1,
  convRule: rule22
}, {
  start: 42589,
  length: 1,
  convRule: rule23
}, {
  start: 42590,
  length: 1,
  convRule: rule22
}, {
  start: 42591,
  length: 1,
  convRule: rule23
}, {
  start: 42592,
  length: 1,
  convRule: rule22
}, {
  start: 42593,
  length: 1,
  convRule: rule23
}, {
  start: 42594,
  length: 1,
  convRule: rule22
}, {
  start: 42595,
  length: 1,
  convRule: rule23
}, {
  start: 42596,
  length: 1,
  convRule: rule22
}, {
  start: 42597,
  length: 1,
  convRule: rule23
}, {
  start: 42598,
  length: 1,
  convRule: rule22
}, {
  start: 42599,
  length: 1,
  convRule: rule23
}, {
  start: 42600,
  length: 1,
  convRule: rule22
}, {
  start: 42601,
  length: 1,
  convRule: rule23
}, {
  start: 42602,
  length: 1,
  convRule: rule22
}, {
  start: 42603,
  length: 1,
  convRule: rule23
}, {
  start: 42604,
  length: 1,
  convRule: rule22
}, {
  start: 42605,
  length: 1,
  convRule: rule23
}, {
  start: 42624,
  length: 1,
  convRule: rule22
}, {
  start: 42625,
  length: 1,
  convRule: rule23
}, {
  start: 42626,
  length: 1,
  convRule: rule22
}, {
  start: 42627,
  length: 1,
  convRule: rule23
}, {
  start: 42628,
  length: 1,
  convRule: rule22
}, {
  start: 42629,
  length: 1,
  convRule: rule23
}, {
  start: 42630,
  length: 1,
  convRule: rule22
}, {
  start: 42631,
  length: 1,
  convRule: rule23
}, {
  start: 42632,
  length: 1,
  convRule: rule22
}, {
  start: 42633,
  length: 1,
  convRule: rule23
}, {
  start: 42634,
  length: 1,
  convRule: rule22
}, {
  start: 42635,
  length: 1,
  convRule: rule23
}, {
  start: 42636,
  length: 1,
  convRule: rule22
}, {
  start: 42637,
  length: 1,
  convRule: rule23
}, {
  start: 42638,
  length: 1,
  convRule: rule22
}, {
  start: 42639,
  length: 1,
  convRule: rule23
}, {
  start: 42640,
  length: 1,
  convRule: rule22
}, {
  start: 42641,
  length: 1,
  convRule: rule23
}, {
  start: 42642,
  length: 1,
  convRule: rule22
}, {
  start: 42643,
  length: 1,
  convRule: rule23
}, {
  start: 42644,
  length: 1,
  convRule: rule22
}, {
  start: 42645,
  length: 1,
  convRule: rule23
}, {
  start: 42646,
  length: 1,
  convRule: rule22
}, {
  start: 42647,
  length: 1,
  convRule: rule23
}, {
  start: 42648,
  length: 1,
  convRule: rule22
}, {
  start: 42649,
  length: 1,
  convRule: rule23
}, {
  start: 42650,
  length: 1,
  convRule: rule22
}, {
  start: 42651,
  length: 1,
  convRule: rule23
}, {
  start: 42786,
  length: 1,
  convRule: rule22
}, {
  start: 42787,
  length: 1,
  convRule: rule23
}, {
  start: 42788,
  length: 1,
  convRule: rule22
}, {
  start: 42789,
  length: 1,
  convRule: rule23
}, {
  start: 42790,
  length: 1,
  convRule: rule22
}, {
  start: 42791,
  length: 1,
  convRule: rule23
}, {
  start: 42792,
  length: 1,
  convRule: rule22
}, {
  start: 42793,
  length: 1,
  convRule: rule23
}, {
  start: 42794,
  length: 1,
  convRule: rule22
}, {
  start: 42795,
  length: 1,
  convRule: rule23
}, {
  start: 42796,
  length: 1,
  convRule: rule22
}, {
  start: 42797,
  length: 1,
  convRule: rule23
}, {
  start: 42798,
  length: 1,
  convRule: rule22
}, {
  start: 42799,
  length: 1,
  convRule: rule23
}, {
  start: 42802,
  length: 1,
  convRule: rule22
}, {
  start: 42803,
  length: 1,
  convRule: rule23
}, {
  start: 42804,
  length: 1,
  convRule: rule22
}, {
  start: 42805,
  length: 1,
  convRule: rule23
}, {
  start: 42806,
  length: 1,
  convRule: rule22
}, {
  start: 42807,
  length: 1,
  convRule: rule23
}, {
  start: 42808,
  length: 1,
  convRule: rule22
}, {
  start: 42809,
  length: 1,
  convRule: rule23
}, {
  start: 42810,
  length: 1,
  convRule: rule22
}, {
  start: 42811,
  length: 1,
  convRule: rule23
}, {
  start: 42812,
  length: 1,
  convRule: rule22
}, {
  start: 42813,
  length: 1,
  convRule: rule23
}, {
  start: 42814,
  length: 1,
  convRule: rule22
}, {
  start: 42815,
  length: 1,
  convRule: rule23
}, {
  start: 42816,
  length: 1,
  convRule: rule22
}, {
  start: 42817,
  length: 1,
  convRule: rule23
}, {
  start: 42818,
  length: 1,
  convRule: rule22
}, {
  start: 42819,
  length: 1,
  convRule: rule23
}, {
  start: 42820,
  length: 1,
  convRule: rule22
}, {
  start: 42821,
  length: 1,
  convRule: rule23
}, {
  start: 42822,
  length: 1,
  convRule: rule22
}, {
  start: 42823,
  length: 1,
  convRule: rule23
}, {
  start: 42824,
  length: 1,
  convRule: rule22
}, {
  start: 42825,
  length: 1,
  convRule: rule23
}, {
  start: 42826,
  length: 1,
  convRule: rule22
}, {
  start: 42827,
  length: 1,
  convRule: rule23
}, {
  start: 42828,
  length: 1,
  convRule: rule22
}, {
  start: 42829,
  length: 1,
  convRule: rule23
}, {
  start: 42830,
  length: 1,
  convRule: rule22
}, {
  start: 42831,
  length: 1,
  convRule: rule23
}, {
  start: 42832,
  length: 1,
  convRule: rule22
}, {
  start: 42833,
  length: 1,
  convRule: rule23
}, {
  start: 42834,
  length: 1,
  convRule: rule22
}, {
  start: 42835,
  length: 1,
  convRule: rule23
}, {
  start: 42836,
  length: 1,
  convRule: rule22
}, {
  start: 42837,
  length: 1,
  convRule: rule23
}, {
  start: 42838,
  length: 1,
  convRule: rule22
}, {
  start: 42839,
  length: 1,
  convRule: rule23
}, {
  start: 42840,
  length: 1,
  convRule: rule22
}, {
  start: 42841,
  length: 1,
  convRule: rule23
}, {
  start: 42842,
  length: 1,
  convRule: rule22
}, {
  start: 42843,
  length: 1,
  convRule: rule23
}, {
  start: 42844,
  length: 1,
  convRule: rule22
}, {
  start: 42845,
  length: 1,
  convRule: rule23
}, {
  start: 42846,
  length: 1,
  convRule: rule22
}, {
  start: 42847,
  length: 1,
  convRule: rule23
}, {
  start: 42848,
  length: 1,
  convRule: rule22
}, {
  start: 42849,
  length: 1,
  convRule: rule23
}, {
  start: 42850,
  length: 1,
  convRule: rule22
}, {
  start: 42851,
  length: 1,
  convRule: rule23
}, {
  start: 42852,
  length: 1,
  convRule: rule22
}, {
  start: 42853,
  length: 1,
  convRule: rule23
}, {
  start: 42854,
  length: 1,
  convRule: rule22
}, {
  start: 42855,
  length: 1,
  convRule: rule23
}, {
  start: 42856,
  length: 1,
  convRule: rule22
}, {
  start: 42857,
  length: 1,
  convRule: rule23
}, {
  start: 42858,
  length: 1,
  convRule: rule22
}, {
  start: 42859,
  length: 1,
  convRule: rule23
}, {
  start: 42860,
  length: 1,
  convRule: rule22
}, {
  start: 42861,
  length: 1,
  convRule: rule23
}, {
  start: 42862,
  length: 1,
  convRule: rule22
}, {
  start: 42863,
  length: 1,
  convRule: rule23
}, {
  start: 42873,
  length: 1,
  convRule: rule22
}, {
  start: 42874,
  length: 1,
  convRule: rule23
}, {
  start: 42875,
  length: 1,
  convRule: rule22
}, {
  start: 42876,
  length: 1,
  convRule: rule23
}, {
  start: 42877,
  length: 1,
  convRule: rule183
}, {
  start: 42878,
  length: 1,
  convRule: rule22
}, {
  start: 42879,
  length: 1,
  convRule: rule23
}, {
  start: 42880,
  length: 1,
  convRule: rule22
}, {
  start: 42881,
  length: 1,
  convRule: rule23
}, {
  start: 42882,
  length: 1,
  convRule: rule22
}, {
  start: 42883,
  length: 1,
  convRule: rule23
}, {
  start: 42884,
  length: 1,
  convRule: rule22
}, {
  start: 42885,
  length: 1,
  convRule: rule23
}, {
  start: 42886,
  length: 1,
  convRule: rule22
}, {
  start: 42887,
  length: 1,
  convRule: rule23
}, {
  start: 42891,
  length: 1,
  convRule: rule22
}, {
  start: 42892,
  length: 1,
  convRule: rule23
}, {
  start: 42893,
  length: 1,
  convRule: rule184
}, {
  start: 42896,
  length: 1,
  convRule: rule22
}, {
  start: 42897,
  length: 1,
  convRule: rule23
}, {
  start: 42898,
  length: 1,
  convRule: rule22
}, {
  start: 42899,
  length: 1,
  convRule: rule23
}, {
  start: 42900,
  length: 1,
  convRule: rule185
}, {
  start: 42902,
  length: 1,
  convRule: rule22
}, {
  start: 42903,
  length: 1,
  convRule: rule23
}, {
  start: 42904,
  length: 1,
  convRule: rule22
}, {
  start: 42905,
  length: 1,
  convRule: rule23
}, {
  start: 42906,
  length: 1,
  convRule: rule22
}, {
  start: 42907,
  length: 1,
  convRule: rule23
}, {
  start: 42908,
  length: 1,
  convRule: rule22
}, {
  start: 42909,
  length: 1,
  convRule: rule23
}, {
  start: 42910,
  length: 1,
  convRule: rule22
}, {
  start: 42911,
  length: 1,
  convRule: rule23
}, {
  start: 42912,
  length: 1,
  convRule: rule22
}, {
  start: 42913,
  length: 1,
  convRule: rule23
}, {
  start: 42914,
  length: 1,
  convRule: rule22
}, {
  start: 42915,
  length: 1,
  convRule: rule23
}, {
  start: 42916,
  length: 1,
  convRule: rule22
}, {
  start: 42917,
  length: 1,
  convRule: rule23
}, {
  start: 42918,
  length: 1,
  convRule: rule22
}, {
  start: 42919,
  length: 1,
  convRule: rule23
}, {
  start: 42920,
  length: 1,
  convRule: rule22
}, {
  start: 42921,
  length: 1,
  convRule: rule23
}, {
  start: 42922,
  length: 1,
  convRule: rule186
}, {
  start: 42923,
  length: 1,
  convRule: rule187
}, {
  start: 42924,
  length: 1,
  convRule: rule188
}, {
  start: 42925,
  length: 1,
  convRule: rule189
}, {
  start: 42926,
  length: 1,
  convRule: rule186
}, {
  start: 42928,
  length: 1,
  convRule: rule190
}, {
  start: 42929,
  length: 1,
  convRule: rule191
}, {
  start: 42930,
  length: 1,
  convRule: rule192
}, {
  start: 42931,
  length: 1,
  convRule: rule193
}, {
  start: 42932,
  length: 1,
  convRule: rule22
}, {
  start: 42933,
  length: 1,
  convRule: rule23
}, {
  start: 42934,
  length: 1,
  convRule: rule22
}, {
  start: 42935,
  length: 1,
  convRule: rule23
}, {
  start: 42936,
  length: 1,
  convRule: rule22
}, {
  start: 42937,
  length: 1,
  convRule: rule23
}, {
  start: 42938,
  length: 1,
  convRule: rule22
}, {
  start: 42939,
  length: 1,
  convRule: rule23
}, {
  start: 42940,
  length: 1,
  convRule: rule22
}, {
  start: 42941,
  length: 1,
  convRule: rule23
}, {
  start: 42942,
  length: 1,
  convRule: rule22
}, {
  start: 42943,
  length: 1,
  convRule: rule23
}, {
  start: 42946,
  length: 1,
  convRule: rule22
}, {
  start: 42947,
  length: 1,
  convRule: rule23
}, {
  start: 42948,
  length: 1,
  convRule: rule194
}, {
  start: 42949,
  length: 1,
  convRule: rule195
}, {
  start: 42950,
  length: 1,
  convRule: rule196
}, {
  start: 42951,
  length: 1,
  convRule: rule22
}, {
  start: 42952,
  length: 1,
  convRule: rule23
}, {
  start: 42953,
  length: 1,
  convRule: rule22
}, {
  start: 42954,
  length: 1,
  convRule: rule23
}, {
  start: 42997,
  length: 1,
  convRule: rule22
}, {
  start: 42998,
  length: 1,
  convRule: rule23
}, {
  start: 43859,
  length: 1,
  convRule: rule197
}, {
  start: 43888,
  length: 80,
  convRule: rule198
}, {
  start: 65313,
  length: 26,
  convRule: rule9
}, {
  start: 65345,
  length: 26,
  convRule: rule12
}, {
  start: 66560,
  length: 40,
  convRule: rule201
}, {
  start: 66600,
  length: 40,
  convRule: rule202
}, {
  start: 66736,
  length: 36,
  convRule: rule201
}, {
  start: 66776,
  length: 36,
  convRule: rule202
}, {
  start: 68736,
  length: 51,
  convRule: rule97
}, {
  start: 68800,
  length: 51,
  convRule: rule102
}, {
  start: 71840,
  length: 32,
  convRule: rule9
}, {
  start: 71872,
  length: 32,
  convRule: rule12
}, {
  start: 93760,
  length: 32,
  convRule: rule9
}, {
  start: 93792,
  length: 32,
  convRule: rule12
}, {
  start: 125184,
  length: 34,
  convRule: rule203
}, {
  start: 125218,
  length: 34,
  convRule: rule204
}];
var bsearch = function(a) {
  return function(array) {
    return function(size3) {
      return function(compare5) {
        var go = function($copy_i) {
          return function($copy_k) {
            var $tco_var_i = $copy_i;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(i, k) {
              if (i > k || i >= length3(array)) {
                $tco_done = true;
                return Nothing.value;
              }
              ;
              if (otherwise) {
                var j = floor2(toNumber(i + k | 0) / 2);
                var b = unsafeIndex2(array)(j);
                var v = compare5(a)(b);
                if (v instanceof EQ) {
                  $tco_done = true;
                  return new Just(b);
                }
                ;
                if (v instanceof GT) {
                  $tco_var_i = j + 1 | 0;
                  $copy_k = k;
                  return;
                }
                ;
                $tco_var_i = i;
                $copy_k = j - 1 | 0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5622, column 3 - line 5632, column 30): " + [i.constructor.name, k.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_i, $copy_k);
            }
            ;
            return $tco_result;
          };
        };
        return go(0)(size3);
      };
    };
  };
};
var blkCmp = function(v) {
  return function(v1) {
    if (v.start >= v1.start && v.start < (v1.start + v1.length | 0)) {
      return EQ.value;
    }
    ;
    if (v.start > v1.start) {
      return GT.value;
    }
    ;
    if (otherwise) {
      return LT.value;
    }
    ;
    throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5598, column 1 - line 5598, column 45): " + [v.constructor.name, v1.constructor.name]);
  };
};
var getRule = function(blocks) {
  return function(unichar) {
    return function(size3) {
      var key = {
        start: unichar,
        length: 1,
        convRule: nullrule
      };
      var maybeCharBlock = bsearch(key)(blocks)(size3)(blkCmp);
      if (maybeCharBlock instanceof Nothing) {
        return Nothing.value;
      }
      ;
      if (maybeCharBlock instanceof Just) {
        return new Just(maybeCharBlock.value0.convRule);
      }
      ;
      throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5612, column 5 - line 5614, column 60): " + [maybeCharBlock.constructor.name]);
    };
  };
};
var caseConv = function(f) {
  return function($$char) {
    var maybeConversionRule = getRule(convchars)($$char)(numConvBlocks);
    if (maybeConversionRule instanceof Nothing) {
      return $$char;
    }
    ;
    if (maybeConversionRule instanceof Just) {
      return $$char + f(maybeConversionRule.value0) | 0;
    }
    ;
    throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5727, column 5 - line 5729, column 53): " + [maybeConversionRule.constructor.name]);
  };
};
var uTowlower = /* @__PURE__ */ caseConv(function(v) {
  return v.lowdist;
});
var uTowtitle = /* @__PURE__ */ caseConv(function(v) {
  return v.titledist;
});
var uTowupper = /* @__PURE__ */ caseConv(function(v) {
  return v.updist;
});
var allchars = [{
  start: 0,
  length: 32,
  convRule: rule0
}, {
  start: 32,
  length: 1,
  convRule: rule1
}, {
  start: 33,
  length: 3,
  convRule: rule2
}, {
  start: 36,
  length: 1,
  convRule: rule3
}, {
  start: 37,
  length: 3,
  convRule: rule2
}, {
  start: 40,
  length: 1,
  convRule: rule4
}, {
  start: 41,
  length: 1,
  convRule: rule5
}, {
  start: 42,
  length: 1,
  convRule: rule2
}, {
  start: 43,
  length: 1,
  convRule: rule6
}, {
  start: 44,
  length: 1,
  convRule: rule2
}, {
  start: 45,
  length: 1,
  convRule: rule7
}, {
  start: 46,
  length: 2,
  convRule: rule2
}, {
  start: 48,
  length: 10,
  convRule: rule8
}, {
  start: 58,
  length: 2,
  convRule: rule2
}, {
  start: 60,
  length: 3,
  convRule: rule6
}, {
  start: 63,
  length: 2,
  convRule: rule2
}, {
  start: 65,
  length: 26,
  convRule: rule9
}, {
  start: 91,
  length: 1,
  convRule: rule4
}, {
  start: 92,
  length: 1,
  convRule: rule2
}, {
  start: 93,
  length: 1,
  convRule: rule5
}, {
  start: 94,
  length: 1,
  convRule: rule10
}, {
  start: 95,
  length: 1,
  convRule: rule11
}, {
  start: 96,
  length: 1,
  convRule: rule10
}, {
  start: 97,
  length: 26,
  convRule: rule12
}, {
  start: 123,
  length: 1,
  convRule: rule4
}, {
  start: 124,
  length: 1,
  convRule: rule6
}, {
  start: 125,
  length: 1,
  convRule: rule5
}, {
  start: 126,
  length: 1,
  convRule: rule6
}, {
  start: 127,
  length: 33,
  convRule: rule0
}, {
  start: 160,
  length: 1,
  convRule: rule1
}, {
  start: 161,
  length: 1,
  convRule: rule2
}, {
  start: 162,
  length: 4,
  convRule: rule3
}, {
  start: 166,
  length: 1,
  convRule: rule13
}, {
  start: 167,
  length: 1,
  convRule: rule2
}, {
  start: 168,
  length: 1,
  convRule: rule10
}, {
  start: 169,
  length: 1,
  convRule: rule13
}, {
  start: 170,
  length: 1,
  convRule: rule14
}, {
  start: 171,
  length: 1,
  convRule: rule15
}, {
  start: 172,
  length: 1,
  convRule: rule6
}, {
  start: 173,
  length: 1,
  convRule: rule16
}, {
  start: 174,
  length: 1,
  convRule: rule13
}, {
  start: 175,
  length: 1,
  convRule: rule10
}, {
  start: 176,
  length: 1,
  convRule: rule13
}, {
  start: 177,
  length: 1,
  convRule: rule6
}, {
  start: 178,
  length: 2,
  convRule: rule17
}, {
  start: 180,
  length: 1,
  convRule: rule10
}, {
  start: 181,
  length: 1,
  convRule: rule18
}, {
  start: 182,
  length: 2,
  convRule: rule2
}, {
  start: 184,
  length: 1,
  convRule: rule10
}, {
  start: 185,
  length: 1,
  convRule: rule17
}, {
  start: 186,
  length: 1,
  convRule: rule14
}, {
  start: 187,
  length: 1,
  convRule: rule19
}, {
  start: 188,
  length: 3,
  convRule: rule17
}, {
  start: 191,
  length: 1,
  convRule: rule2
}, {
  start: 192,
  length: 23,
  convRule: rule9
}, {
  start: 215,
  length: 1,
  convRule: rule6
}, {
  start: 216,
  length: 7,
  convRule: rule9
}, {
  start: 223,
  length: 1,
  convRule: rule20
}, {
  start: 224,
  length: 23,
  convRule: rule12
}, {
  start: 247,
  length: 1,
  convRule: rule6
}, {
  start: 248,
  length: 7,
  convRule: rule12
}, {
  start: 255,
  length: 1,
  convRule: rule21
}, {
  start: 256,
  length: 1,
  convRule: rule22
}, {
  start: 257,
  length: 1,
  convRule: rule23
}, {
  start: 258,
  length: 1,
  convRule: rule22
}, {
  start: 259,
  length: 1,
  convRule: rule23
}, {
  start: 260,
  length: 1,
  convRule: rule22
}, {
  start: 261,
  length: 1,
  convRule: rule23
}, {
  start: 262,
  length: 1,
  convRule: rule22
}, {
  start: 263,
  length: 1,
  convRule: rule23
}, {
  start: 264,
  length: 1,
  convRule: rule22
}, {
  start: 265,
  length: 1,
  convRule: rule23
}, {
  start: 266,
  length: 1,
  convRule: rule22
}, {
  start: 267,
  length: 1,
  convRule: rule23
}, {
  start: 268,
  length: 1,
  convRule: rule22
}, {
  start: 269,
  length: 1,
  convRule: rule23
}, {
  start: 270,
  length: 1,
  convRule: rule22
}, {
  start: 271,
  length: 1,
  convRule: rule23
}, {
  start: 272,
  length: 1,
  convRule: rule22
}, {
  start: 273,
  length: 1,
  convRule: rule23
}, {
  start: 274,
  length: 1,
  convRule: rule22
}, {
  start: 275,
  length: 1,
  convRule: rule23
}, {
  start: 276,
  length: 1,
  convRule: rule22
}, {
  start: 277,
  length: 1,
  convRule: rule23
}, {
  start: 278,
  length: 1,
  convRule: rule22
}, {
  start: 279,
  length: 1,
  convRule: rule23
}, {
  start: 280,
  length: 1,
  convRule: rule22
}, {
  start: 281,
  length: 1,
  convRule: rule23
}, {
  start: 282,
  length: 1,
  convRule: rule22
}, {
  start: 283,
  length: 1,
  convRule: rule23
}, {
  start: 284,
  length: 1,
  convRule: rule22
}, {
  start: 285,
  length: 1,
  convRule: rule23
}, {
  start: 286,
  length: 1,
  convRule: rule22
}, {
  start: 287,
  length: 1,
  convRule: rule23
}, {
  start: 288,
  length: 1,
  convRule: rule22
}, {
  start: 289,
  length: 1,
  convRule: rule23
}, {
  start: 290,
  length: 1,
  convRule: rule22
}, {
  start: 291,
  length: 1,
  convRule: rule23
}, {
  start: 292,
  length: 1,
  convRule: rule22
}, {
  start: 293,
  length: 1,
  convRule: rule23
}, {
  start: 294,
  length: 1,
  convRule: rule22
}, {
  start: 295,
  length: 1,
  convRule: rule23
}, {
  start: 296,
  length: 1,
  convRule: rule22
}, {
  start: 297,
  length: 1,
  convRule: rule23
}, {
  start: 298,
  length: 1,
  convRule: rule22
}, {
  start: 299,
  length: 1,
  convRule: rule23
}, {
  start: 300,
  length: 1,
  convRule: rule22
}, {
  start: 301,
  length: 1,
  convRule: rule23
}, {
  start: 302,
  length: 1,
  convRule: rule22
}, {
  start: 303,
  length: 1,
  convRule: rule23
}, {
  start: 304,
  length: 1,
  convRule: rule24
}, {
  start: 305,
  length: 1,
  convRule: rule25
}, {
  start: 306,
  length: 1,
  convRule: rule22
}, {
  start: 307,
  length: 1,
  convRule: rule23
}, {
  start: 308,
  length: 1,
  convRule: rule22
}, {
  start: 309,
  length: 1,
  convRule: rule23
}, {
  start: 310,
  length: 1,
  convRule: rule22
}, {
  start: 311,
  length: 1,
  convRule: rule23
}, {
  start: 312,
  length: 1,
  convRule: rule20
}, {
  start: 313,
  length: 1,
  convRule: rule22
}, {
  start: 314,
  length: 1,
  convRule: rule23
}, {
  start: 315,
  length: 1,
  convRule: rule22
}, {
  start: 316,
  length: 1,
  convRule: rule23
}, {
  start: 317,
  length: 1,
  convRule: rule22
}, {
  start: 318,
  length: 1,
  convRule: rule23
}, {
  start: 319,
  length: 1,
  convRule: rule22
}, {
  start: 320,
  length: 1,
  convRule: rule23
}, {
  start: 321,
  length: 1,
  convRule: rule22
}, {
  start: 322,
  length: 1,
  convRule: rule23
}, {
  start: 323,
  length: 1,
  convRule: rule22
}, {
  start: 324,
  length: 1,
  convRule: rule23
}, {
  start: 325,
  length: 1,
  convRule: rule22
}, {
  start: 326,
  length: 1,
  convRule: rule23
}, {
  start: 327,
  length: 1,
  convRule: rule22
}, {
  start: 328,
  length: 1,
  convRule: rule23
}, {
  start: 329,
  length: 1,
  convRule: rule20
}, {
  start: 330,
  length: 1,
  convRule: rule22
}, {
  start: 331,
  length: 1,
  convRule: rule23
}, {
  start: 332,
  length: 1,
  convRule: rule22
}, {
  start: 333,
  length: 1,
  convRule: rule23
}, {
  start: 334,
  length: 1,
  convRule: rule22
}, {
  start: 335,
  length: 1,
  convRule: rule23
}, {
  start: 336,
  length: 1,
  convRule: rule22
}, {
  start: 337,
  length: 1,
  convRule: rule23
}, {
  start: 338,
  length: 1,
  convRule: rule22
}, {
  start: 339,
  length: 1,
  convRule: rule23
}, {
  start: 340,
  length: 1,
  convRule: rule22
}, {
  start: 341,
  length: 1,
  convRule: rule23
}, {
  start: 342,
  length: 1,
  convRule: rule22
}, {
  start: 343,
  length: 1,
  convRule: rule23
}, {
  start: 344,
  length: 1,
  convRule: rule22
}, {
  start: 345,
  length: 1,
  convRule: rule23
}, {
  start: 346,
  length: 1,
  convRule: rule22
}, {
  start: 347,
  length: 1,
  convRule: rule23
}, {
  start: 348,
  length: 1,
  convRule: rule22
}, {
  start: 349,
  length: 1,
  convRule: rule23
}, {
  start: 350,
  length: 1,
  convRule: rule22
}, {
  start: 351,
  length: 1,
  convRule: rule23
}, {
  start: 352,
  length: 1,
  convRule: rule22
}, {
  start: 353,
  length: 1,
  convRule: rule23
}, {
  start: 354,
  length: 1,
  convRule: rule22
}, {
  start: 355,
  length: 1,
  convRule: rule23
}, {
  start: 356,
  length: 1,
  convRule: rule22
}, {
  start: 357,
  length: 1,
  convRule: rule23
}, {
  start: 358,
  length: 1,
  convRule: rule22
}, {
  start: 359,
  length: 1,
  convRule: rule23
}, {
  start: 360,
  length: 1,
  convRule: rule22
}, {
  start: 361,
  length: 1,
  convRule: rule23
}, {
  start: 362,
  length: 1,
  convRule: rule22
}, {
  start: 363,
  length: 1,
  convRule: rule23
}, {
  start: 364,
  length: 1,
  convRule: rule22
}, {
  start: 365,
  length: 1,
  convRule: rule23
}, {
  start: 366,
  length: 1,
  convRule: rule22
}, {
  start: 367,
  length: 1,
  convRule: rule23
}, {
  start: 368,
  length: 1,
  convRule: rule22
}, {
  start: 369,
  length: 1,
  convRule: rule23
}, {
  start: 370,
  length: 1,
  convRule: rule22
}, {
  start: 371,
  length: 1,
  convRule: rule23
}, {
  start: 372,
  length: 1,
  convRule: rule22
}, {
  start: 373,
  length: 1,
  convRule: rule23
}, {
  start: 374,
  length: 1,
  convRule: rule22
}, {
  start: 375,
  length: 1,
  convRule: rule23
}, {
  start: 376,
  length: 1,
  convRule: rule26
}, {
  start: 377,
  length: 1,
  convRule: rule22
}, {
  start: 378,
  length: 1,
  convRule: rule23
}, {
  start: 379,
  length: 1,
  convRule: rule22
}, {
  start: 380,
  length: 1,
  convRule: rule23
}, {
  start: 381,
  length: 1,
  convRule: rule22
}, {
  start: 382,
  length: 1,
  convRule: rule23
}, {
  start: 383,
  length: 1,
  convRule: rule27
}, {
  start: 384,
  length: 1,
  convRule: rule28
}, {
  start: 385,
  length: 1,
  convRule: rule29
}, {
  start: 386,
  length: 1,
  convRule: rule22
}, {
  start: 387,
  length: 1,
  convRule: rule23
}, {
  start: 388,
  length: 1,
  convRule: rule22
}, {
  start: 389,
  length: 1,
  convRule: rule23
}, {
  start: 390,
  length: 1,
  convRule: rule30
}, {
  start: 391,
  length: 1,
  convRule: rule22
}, {
  start: 392,
  length: 1,
  convRule: rule23
}, {
  start: 393,
  length: 2,
  convRule: rule31
}, {
  start: 395,
  length: 1,
  convRule: rule22
}, {
  start: 396,
  length: 1,
  convRule: rule23
}, {
  start: 397,
  length: 1,
  convRule: rule20
}, {
  start: 398,
  length: 1,
  convRule: rule32
}, {
  start: 399,
  length: 1,
  convRule: rule33
}, {
  start: 400,
  length: 1,
  convRule: rule34
}, {
  start: 401,
  length: 1,
  convRule: rule22
}, {
  start: 402,
  length: 1,
  convRule: rule23
}, {
  start: 403,
  length: 1,
  convRule: rule31
}, {
  start: 404,
  length: 1,
  convRule: rule35
}, {
  start: 405,
  length: 1,
  convRule: rule36
}, {
  start: 406,
  length: 1,
  convRule: rule37
}, {
  start: 407,
  length: 1,
  convRule: rule38
}, {
  start: 408,
  length: 1,
  convRule: rule22
}, {
  start: 409,
  length: 1,
  convRule: rule23
}, {
  start: 410,
  length: 1,
  convRule: rule39
}, {
  start: 411,
  length: 1,
  convRule: rule20
}, {
  start: 412,
  length: 1,
  convRule: rule37
}, {
  start: 413,
  length: 1,
  convRule: rule40
}, {
  start: 414,
  length: 1,
  convRule: rule41
}, {
  start: 415,
  length: 1,
  convRule: rule42
}, {
  start: 416,
  length: 1,
  convRule: rule22
}, {
  start: 417,
  length: 1,
  convRule: rule23
}, {
  start: 418,
  length: 1,
  convRule: rule22
}, {
  start: 419,
  length: 1,
  convRule: rule23
}, {
  start: 420,
  length: 1,
  convRule: rule22
}, {
  start: 421,
  length: 1,
  convRule: rule23
}, {
  start: 422,
  length: 1,
  convRule: rule43
}, {
  start: 423,
  length: 1,
  convRule: rule22
}, {
  start: 424,
  length: 1,
  convRule: rule23
}, {
  start: 425,
  length: 1,
  convRule: rule43
}, {
  start: 426,
  length: 2,
  convRule: rule20
}, {
  start: 428,
  length: 1,
  convRule: rule22
}, {
  start: 429,
  length: 1,
  convRule: rule23
}, {
  start: 430,
  length: 1,
  convRule: rule43
}, {
  start: 431,
  length: 1,
  convRule: rule22
}, {
  start: 432,
  length: 1,
  convRule: rule23
}, {
  start: 433,
  length: 2,
  convRule: rule44
}, {
  start: 435,
  length: 1,
  convRule: rule22
}, {
  start: 436,
  length: 1,
  convRule: rule23
}, {
  start: 437,
  length: 1,
  convRule: rule22
}, {
  start: 438,
  length: 1,
  convRule: rule23
}, {
  start: 439,
  length: 1,
  convRule: rule45
}, {
  start: 440,
  length: 1,
  convRule: rule22
}, {
  start: 441,
  length: 1,
  convRule: rule23
}, {
  start: 442,
  length: 1,
  convRule: rule20
}, {
  start: 443,
  length: 1,
  convRule: rule14
}, {
  start: 444,
  length: 1,
  convRule: rule22
}, {
  start: 445,
  length: 1,
  convRule: rule23
}, {
  start: 446,
  length: 1,
  convRule: rule20
}, {
  start: 447,
  length: 1,
  convRule: rule46
}, {
  start: 448,
  length: 4,
  convRule: rule14
}, {
  start: 452,
  length: 1,
  convRule: rule47
}, {
  start: 453,
  length: 1,
  convRule: rule48
}, {
  start: 454,
  length: 1,
  convRule: rule49
}, {
  start: 455,
  length: 1,
  convRule: rule47
}, {
  start: 456,
  length: 1,
  convRule: rule48
}, {
  start: 457,
  length: 1,
  convRule: rule49
}, {
  start: 458,
  length: 1,
  convRule: rule47
}, {
  start: 459,
  length: 1,
  convRule: rule48
}, {
  start: 460,
  length: 1,
  convRule: rule49
}, {
  start: 461,
  length: 1,
  convRule: rule22
}, {
  start: 462,
  length: 1,
  convRule: rule23
}, {
  start: 463,
  length: 1,
  convRule: rule22
}, {
  start: 464,
  length: 1,
  convRule: rule23
}, {
  start: 465,
  length: 1,
  convRule: rule22
}, {
  start: 466,
  length: 1,
  convRule: rule23
}, {
  start: 467,
  length: 1,
  convRule: rule22
}, {
  start: 468,
  length: 1,
  convRule: rule23
}, {
  start: 469,
  length: 1,
  convRule: rule22
}, {
  start: 470,
  length: 1,
  convRule: rule23
}, {
  start: 471,
  length: 1,
  convRule: rule22
}, {
  start: 472,
  length: 1,
  convRule: rule23
}, {
  start: 473,
  length: 1,
  convRule: rule22
}, {
  start: 474,
  length: 1,
  convRule: rule23
}, {
  start: 475,
  length: 1,
  convRule: rule22
}, {
  start: 476,
  length: 1,
  convRule: rule23
}, {
  start: 477,
  length: 1,
  convRule: rule50
}, {
  start: 478,
  length: 1,
  convRule: rule22
}, {
  start: 479,
  length: 1,
  convRule: rule23
}, {
  start: 480,
  length: 1,
  convRule: rule22
}, {
  start: 481,
  length: 1,
  convRule: rule23
}, {
  start: 482,
  length: 1,
  convRule: rule22
}, {
  start: 483,
  length: 1,
  convRule: rule23
}, {
  start: 484,
  length: 1,
  convRule: rule22
}, {
  start: 485,
  length: 1,
  convRule: rule23
}, {
  start: 486,
  length: 1,
  convRule: rule22
}, {
  start: 487,
  length: 1,
  convRule: rule23
}, {
  start: 488,
  length: 1,
  convRule: rule22
}, {
  start: 489,
  length: 1,
  convRule: rule23
}, {
  start: 490,
  length: 1,
  convRule: rule22
}, {
  start: 491,
  length: 1,
  convRule: rule23
}, {
  start: 492,
  length: 1,
  convRule: rule22
}, {
  start: 493,
  length: 1,
  convRule: rule23
}, {
  start: 494,
  length: 1,
  convRule: rule22
}, {
  start: 495,
  length: 1,
  convRule: rule23
}, {
  start: 496,
  length: 1,
  convRule: rule20
}, {
  start: 497,
  length: 1,
  convRule: rule47
}, {
  start: 498,
  length: 1,
  convRule: rule48
}, {
  start: 499,
  length: 1,
  convRule: rule49
}, {
  start: 500,
  length: 1,
  convRule: rule22
}, {
  start: 501,
  length: 1,
  convRule: rule23
}, {
  start: 502,
  length: 1,
  convRule: rule51
}, {
  start: 503,
  length: 1,
  convRule: rule52
}, {
  start: 504,
  length: 1,
  convRule: rule22
}, {
  start: 505,
  length: 1,
  convRule: rule23
}, {
  start: 506,
  length: 1,
  convRule: rule22
}, {
  start: 507,
  length: 1,
  convRule: rule23
}, {
  start: 508,
  length: 1,
  convRule: rule22
}, {
  start: 509,
  length: 1,
  convRule: rule23
}, {
  start: 510,
  length: 1,
  convRule: rule22
}, {
  start: 511,
  length: 1,
  convRule: rule23
}, {
  start: 512,
  length: 1,
  convRule: rule22
}, {
  start: 513,
  length: 1,
  convRule: rule23
}, {
  start: 514,
  length: 1,
  convRule: rule22
}, {
  start: 515,
  length: 1,
  convRule: rule23
}, {
  start: 516,
  length: 1,
  convRule: rule22
}, {
  start: 517,
  length: 1,
  convRule: rule23
}, {
  start: 518,
  length: 1,
  convRule: rule22
}, {
  start: 519,
  length: 1,
  convRule: rule23
}, {
  start: 520,
  length: 1,
  convRule: rule22
}, {
  start: 521,
  length: 1,
  convRule: rule23
}, {
  start: 522,
  length: 1,
  convRule: rule22
}, {
  start: 523,
  length: 1,
  convRule: rule23
}, {
  start: 524,
  length: 1,
  convRule: rule22
}, {
  start: 525,
  length: 1,
  convRule: rule23
}, {
  start: 526,
  length: 1,
  convRule: rule22
}, {
  start: 527,
  length: 1,
  convRule: rule23
}, {
  start: 528,
  length: 1,
  convRule: rule22
}, {
  start: 529,
  length: 1,
  convRule: rule23
}, {
  start: 530,
  length: 1,
  convRule: rule22
}, {
  start: 531,
  length: 1,
  convRule: rule23
}, {
  start: 532,
  length: 1,
  convRule: rule22
}, {
  start: 533,
  length: 1,
  convRule: rule23
}, {
  start: 534,
  length: 1,
  convRule: rule22
}, {
  start: 535,
  length: 1,
  convRule: rule23
}, {
  start: 536,
  length: 1,
  convRule: rule22
}, {
  start: 537,
  length: 1,
  convRule: rule23
}, {
  start: 538,
  length: 1,
  convRule: rule22
}, {
  start: 539,
  length: 1,
  convRule: rule23
}, {
  start: 540,
  length: 1,
  convRule: rule22
}, {
  start: 541,
  length: 1,
  convRule: rule23
}, {
  start: 542,
  length: 1,
  convRule: rule22
}, {
  start: 543,
  length: 1,
  convRule: rule23
}, {
  start: 544,
  length: 1,
  convRule: rule53
}, {
  start: 545,
  length: 1,
  convRule: rule20
}, {
  start: 546,
  length: 1,
  convRule: rule22
}, {
  start: 547,
  length: 1,
  convRule: rule23
}, {
  start: 548,
  length: 1,
  convRule: rule22
}, {
  start: 549,
  length: 1,
  convRule: rule23
}, {
  start: 550,
  length: 1,
  convRule: rule22
}, {
  start: 551,
  length: 1,
  convRule: rule23
}, {
  start: 552,
  length: 1,
  convRule: rule22
}, {
  start: 553,
  length: 1,
  convRule: rule23
}, {
  start: 554,
  length: 1,
  convRule: rule22
}, {
  start: 555,
  length: 1,
  convRule: rule23
}, {
  start: 556,
  length: 1,
  convRule: rule22
}, {
  start: 557,
  length: 1,
  convRule: rule23
}, {
  start: 558,
  length: 1,
  convRule: rule22
}, {
  start: 559,
  length: 1,
  convRule: rule23
}, {
  start: 560,
  length: 1,
  convRule: rule22
}, {
  start: 561,
  length: 1,
  convRule: rule23
}, {
  start: 562,
  length: 1,
  convRule: rule22
}, {
  start: 563,
  length: 1,
  convRule: rule23
}, {
  start: 564,
  length: 6,
  convRule: rule20
}, {
  start: 570,
  length: 1,
  convRule: rule54
}, {
  start: 571,
  length: 1,
  convRule: rule22
}, {
  start: 572,
  length: 1,
  convRule: rule23
}, {
  start: 573,
  length: 1,
  convRule: rule55
}, {
  start: 574,
  length: 1,
  convRule: rule56
}, {
  start: 575,
  length: 2,
  convRule: rule57
}, {
  start: 577,
  length: 1,
  convRule: rule22
}, {
  start: 578,
  length: 1,
  convRule: rule23
}, {
  start: 579,
  length: 1,
  convRule: rule58
}, {
  start: 580,
  length: 1,
  convRule: rule59
}, {
  start: 581,
  length: 1,
  convRule: rule60
}, {
  start: 582,
  length: 1,
  convRule: rule22
}, {
  start: 583,
  length: 1,
  convRule: rule23
}, {
  start: 584,
  length: 1,
  convRule: rule22
}, {
  start: 585,
  length: 1,
  convRule: rule23
}, {
  start: 586,
  length: 1,
  convRule: rule22
}, {
  start: 587,
  length: 1,
  convRule: rule23
}, {
  start: 588,
  length: 1,
  convRule: rule22
}, {
  start: 589,
  length: 1,
  convRule: rule23
}, {
  start: 590,
  length: 1,
  convRule: rule22
}, {
  start: 591,
  length: 1,
  convRule: rule23
}, {
  start: 592,
  length: 1,
  convRule: rule61
}, {
  start: 593,
  length: 1,
  convRule: rule62
}, {
  start: 594,
  length: 1,
  convRule: rule63
}, {
  start: 595,
  length: 1,
  convRule: rule64
}, {
  start: 596,
  length: 1,
  convRule: rule65
}, {
  start: 597,
  length: 1,
  convRule: rule20
}, {
  start: 598,
  length: 2,
  convRule: rule66
}, {
  start: 600,
  length: 1,
  convRule: rule20
}, {
  start: 601,
  length: 1,
  convRule: rule67
}, {
  start: 602,
  length: 1,
  convRule: rule20
}, {
  start: 603,
  length: 1,
  convRule: rule68
}, {
  start: 604,
  length: 1,
  convRule: rule69
}, {
  start: 605,
  length: 3,
  convRule: rule20
}, {
  start: 608,
  length: 1,
  convRule: rule66
}, {
  start: 609,
  length: 1,
  convRule: rule70
}, {
  start: 610,
  length: 1,
  convRule: rule20
}, {
  start: 611,
  length: 1,
  convRule: rule71
}, {
  start: 612,
  length: 1,
  convRule: rule20
}, {
  start: 613,
  length: 1,
  convRule: rule72
}, {
  start: 614,
  length: 1,
  convRule: rule73
}, {
  start: 615,
  length: 1,
  convRule: rule20
}, {
  start: 616,
  length: 1,
  convRule: rule74
}, {
  start: 617,
  length: 1,
  convRule: rule75
}, {
  start: 618,
  length: 1,
  convRule: rule73
}, {
  start: 619,
  length: 1,
  convRule: rule76
}, {
  start: 620,
  length: 1,
  convRule: rule77
}, {
  start: 621,
  length: 2,
  convRule: rule20
}, {
  start: 623,
  length: 1,
  convRule: rule75
}, {
  start: 624,
  length: 1,
  convRule: rule20
}, {
  start: 625,
  length: 1,
  convRule: rule78
}, {
  start: 626,
  length: 1,
  convRule: rule79
}, {
  start: 627,
  length: 2,
  convRule: rule20
}, {
  start: 629,
  length: 1,
  convRule: rule80
}, {
  start: 630,
  length: 7,
  convRule: rule20
}, {
  start: 637,
  length: 1,
  convRule: rule81
}, {
  start: 638,
  length: 2,
  convRule: rule20
}, {
  start: 640,
  length: 1,
  convRule: rule82
}, {
  start: 641,
  length: 1,
  convRule: rule20
}, {
  start: 642,
  length: 1,
  convRule: rule83
}, {
  start: 643,
  length: 1,
  convRule: rule82
}, {
  start: 644,
  length: 3,
  convRule: rule20
}, {
  start: 647,
  length: 1,
  convRule: rule84
}, {
  start: 648,
  length: 1,
  convRule: rule82
}, {
  start: 649,
  length: 1,
  convRule: rule85
}, {
  start: 650,
  length: 2,
  convRule: rule86
}, {
  start: 652,
  length: 1,
  convRule: rule87
}, {
  start: 653,
  length: 5,
  convRule: rule20
}, {
  start: 658,
  length: 1,
  convRule: rule88
}, {
  start: 659,
  length: 1,
  convRule: rule20
}, {
  start: 660,
  length: 1,
  convRule: rule14
}, {
  start: 661,
  length: 8,
  convRule: rule20
}, {
  start: 669,
  length: 1,
  convRule: rule89
}, {
  start: 670,
  length: 1,
  convRule: rule90
}, {
  start: 671,
  length: 17,
  convRule: rule20
}, {
  start: 688,
  length: 18,
  convRule: rule91
}, {
  start: 706,
  length: 4,
  convRule: rule10
}, {
  start: 710,
  length: 12,
  convRule: rule91
}, {
  start: 722,
  length: 14,
  convRule: rule10
}, {
  start: 736,
  length: 5,
  convRule: rule91
}, {
  start: 741,
  length: 7,
  convRule: rule10
}, {
  start: 748,
  length: 1,
  convRule: rule91
}, {
  start: 749,
  length: 1,
  convRule: rule10
}, {
  start: 750,
  length: 1,
  convRule: rule91
}, {
  start: 751,
  length: 17,
  convRule: rule10
}, {
  start: 768,
  length: 69,
  convRule: rule92
}, {
  start: 837,
  length: 1,
  convRule: rule93
}, {
  start: 838,
  length: 42,
  convRule: rule92
}, {
  start: 880,
  length: 1,
  convRule: rule22
}, {
  start: 881,
  length: 1,
  convRule: rule23
}, {
  start: 882,
  length: 1,
  convRule: rule22
}, {
  start: 883,
  length: 1,
  convRule: rule23
}, {
  start: 884,
  length: 1,
  convRule: rule91
}, {
  start: 885,
  length: 1,
  convRule: rule10
}, {
  start: 886,
  length: 1,
  convRule: rule22
}, {
  start: 887,
  length: 1,
  convRule: rule23
}, {
  start: 890,
  length: 1,
  convRule: rule91
}, {
  start: 891,
  length: 3,
  convRule: rule41
}, {
  start: 894,
  length: 1,
  convRule: rule2
}, {
  start: 895,
  length: 1,
  convRule: rule94
}, {
  start: 900,
  length: 2,
  convRule: rule10
}, {
  start: 902,
  length: 1,
  convRule: rule95
}, {
  start: 903,
  length: 1,
  convRule: rule2
}, {
  start: 904,
  length: 3,
  convRule: rule96
}, {
  start: 908,
  length: 1,
  convRule: rule97
}, {
  start: 910,
  length: 2,
  convRule: rule98
}, {
  start: 912,
  length: 1,
  convRule: rule20
}, {
  start: 913,
  length: 17,
  convRule: rule9
}, {
  start: 931,
  length: 9,
  convRule: rule9
}, {
  start: 940,
  length: 1,
  convRule: rule99
}, {
  start: 941,
  length: 3,
  convRule: rule100
}, {
  start: 944,
  length: 1,
  convRule: rule20
}, {
  start: 945,
  length: 17,
  convRule: rule12
}, {
  start: 962,
  length: 1,
  convRule: rule101
}, {
  start: 963,
  length: 9,
  convRule: rule12
}, {
  start: 972,
  length: 1,
  convRule: rule102
}, {
  start: 973,
  length: 2,
  convRule: rule103
}, {
  start: 975,
  length: 1,
  convRule: rule104
}, {
  start: 976,
  length: 1,
  convRule: rule105
}, {
  start: 977,
  length: 1,
  convRule: rule106
}, {
  start: 978,
  length: 3,
  convRule: rule107
}, {
  start: 981,
  length: 1,
  convRule: rule108
}, {
  start: 982,
  length: 1,
  convRule: rule109
}, {
  start: 983,
  length: 1,
  convRule: rule110
}, {
  start: 984,
  length: 1,
  convRule: rule22
}, {
  start: 985,
  length: 1,
  convRule: rule23
}, {
  start: 986,
  length: 1,
  convRule: rule22
}, {
  start: 987,
  length: 1,
  convRule: rule23
}, {
  start: 988,
  length: 1,
  convRule: rule22
}, {
  start: 989,
  length: 1,
  convRule: rule23
}, {
  start: 990,
  length: 1,
  convRule: rule22
}, {
  start: 991,
  length: 1,
  convRule: rule23
}, {
  start: 992,
  length: 1,
  convRule: rule22
}, {
  start: 993,
  length: 1,
  convRule: rule23
}, {
  start: 994,
  length: 1,
  convRule: rule22
}, {
  start: 995,
  length: 1,
  convRule: rule23
}, {
  start: 996,
  length: 1,
  convRule: rule22
}, {
  start: 997,
  length: 1,
  convRule: rule23
}, {
  start: 998,
  length: 1,
  convRule: rule22
}, {
  start: 999,
  length: 1,
  convRule: rule23
}, {
  start: 1e3,
  length: 1,
  convRule: rule22
}, {
  start: 1001,
  length: 1,
  convRule: rule23
}, {
  start: 1002,
  length: 1,
  convRule: rule22
}, {
  start: 1003,
  length: 1,
  convRule: rule23
}, {
  start: 1004,
  length: 1,
  convRule: rule22
}, {
  start: 1005,
  length: 1,
  convRule: rule23
}, {
  start: 1006,
  length: 1,
  convRule: rule22
}, {
  start: 1007,
  length: 1,
  convRule: rule23
}, {
  start: 1008,
  length: 1,
  convRule: rule111
}, {
  start: 1009,
  length: 1,
  convRule: rule112
}, {
  start: 1010,
  length: 1,
  convRule: rule113
}, {
  start: 1011,
  length: 1,
  convRule: rule114
}, {
  start: 1012,
  length: 1,
  convRule: rule115
}, {
  start: 1013,
  length: 1,
  convRule: rule116
}, {
  start: 1014,
  length: 1,
  convRule: rule6
}, {
  start: 1015,
  length: 1,
  convRule: rule22
}, {
  start: 1016,
  length: 1,
  convRule: rule23
}, {
  start: 1017,
  length: 1,
  convRule: rule117
}, {
  start: 1018,
  length: 1,
  convRule: rule22
}, {
  start: 1019,
  length: 1,
  convRule: rule23
}, {
  start: 1020,
  length: 1,
  convRule: rule20
}, {
  start: 1021,
  length: 3,
  convRule: rule53
}, {
  start: 1024,
  length: 16,
  convRule: rule118
}, {
  start: 1040,
  length: 32,
  convRule: rule9
}, {
  start: 1072,
  length: 32,
  convRule: rule12
}, {
  start: 1104,
  length: 16,
  convRule: rule112
}, {
  start: 1120,
  length: 1,
  convRule: rule22
}, {
  start: 1121,
  length: 1,
  convRule: rule23
}, {
  start: 1122,
  length: 1,
  convRule: rule22
}, {
  start: 1123,
  length: 1,
  convRule: rule23
}, {
  start: 1124,
  length: 1,
  convRule: rule22
}, {
  start: 1125,
  length: 1,
  convRule: rule23
}, {
  start: 1126,
  length: 1,
  convRule: rule22
}, {
  start: 1127,
  length: 1,
  convRule: rule23
}, {
  start: 1128,
  length: 1,
  convRule: rule22
}, {
  start: 1129,
  length: 1,
  convRule: rule23
}, {
  start: 1130,
  length: 1,
  convRule: rule22
}, {
  start: 1131,
  length: 1,
  convRule: rule23
}, {
  start: 1132,
  length: 1,
  convRule: rule22
}, {
  start: 1133,
  length: 1,
  convRule: rule23
}, {
  start: 1134,
  length: 1,
  convRule: rule22
}, {
  start: 1135,
  length: 1,
  convRule: rule23
}, {
  start: 1136,
  length: 1,
  convRule: rule22
}, {
  start: 1137,
  length: 1,
  convRule: rule23
}, {
  start: 1138,
  length: 1,
  convRule: rule22
}, {
  start: 1139,
  length: 1,
  convRule: rule23
}, {
  start: 1140,
  length: 1,
  convRule: rule22
}, {
  start: 1141,
  length: 1,
  convRule: rule23
}, {
  start: 1142,
  length: 1,
  convRule: rule22
}, {
  start: 1143,
  length: 1,
  convRule: rule23
}, {
  start: 1144,
  length: 1,
  convRule: rule22
}, {
  start: 1145,
  length: 1,
  convRule: rule23
}, {
  start: 1146,
  length: 1,
  convRule: rule22
}, {
  start: 1147,
  length: 1,
  convRule: rule23
}, {
  start: 1148,
  length: 1,
  convRule: rule22
}, {
  start: 1149,
  length: 1,
  convRule: rule23
}, {
  start: 1150,
  length: 1,
  convRule: rule22
}, {
  start: 1151,
  length: 1,
  convRule: rule23
}, {
  start: 1152,
  length: 1,
  convRule: rule22
}, {
  start: 1153,
  length: 1,
  convRule: rule23
}, {
  start: 1154,
  length: 1,
  convRule: rule13
}, {
  start: 1155,
  length: 5,
  convRule: rule92
}, {
  start: 1160,
  length: 2,
  convRule: rule119
}, {
  start: 1162,
  length: 1,
  convRule: rule22
}, {
  start: 1163,
  length: 1,
  convRule: rule23
}, {
  start: 1164,
  length: 1,
  convRule: rule22
}, {
  start: 1165,
  length: 1,
  convRule: rule23
}, {
  start: 1166,
  length: 1,
  convRule: rule22
}, {
  start: 1167,
  length: 1,
  convRule: rule23
}, {
  start: 1168,
  length: 1,
  convRule: rule22
}, {
  start: 1169,
  length: 1,
  convRule: rule23
}, {
  start: 1170,
  length: 1,
  convRule: rule22
}, {
  start: 1171,
  length: 1,
  convRule: rule23
}, {
  start: 1172,
  length: 1,
  convRule: rule22
}, {
  start: 1173,
  length: 1,
  convRule: rule23
}, {
  start: 1174,
  length: 1,
  convRule: rule22
}, {
  start: 1175,
  length: 1,
  convRule: rule23
}, {
  start: 1176,
  length: 1,
  convRule: rule22
}, {
  start: 1177,
  length: 1,
  convRule: rule23
}, {
  start: 1178,
  length: 1,
  convRule: rule22
}, {
  start: 1179,
  length: 1,
  convRule: rule23
}, {
  start: 1180,
  length: 1,
  convRule: rule22
}, {
  start: 1181,
  length: 1,
  convRule: rule23
}, {
  start: 1182,
  length: 1,
  convRule: rule22
}, {
  start: 1183,
  length: 1,
  convRule: rule23
}, {
  start: 1184,
  length: 1,
  convRule: rule22
}, {
  start: 1185,
  length: 1,
  convRule: rule23
}, {
  start: 1186,
  length: 1,
  convRule: rule22
}, {
  start: 1187,
  length: 1,
  convRule: rule23
}, {
  start: 1188,
  length: 1,
  convRule: rule22
}, {
  start: 1189,
  length: 1,
  convRule: rule23
}, {
  start: 1190,
  length: 1,
  convRule: rule22
}, {
  start: 1191,
  length: 1,
  convRule: rule23
}, {
  start: 1192,
  length: 1,
  convRule: rule22
}, {
  start: 1193,
  length: 1,
  convRule: rule23
}, {
  start: 1194,
  length: 1,
  convRule: rule22
}, {
  start: 1195,
  length: 1,
  convRule: rule23
}, {
  start: 1196,
  length: 1,
  convRule: rule22
}, {
  start: 1197,
  length: 1,
  convRule: rule23
}, {
  start: 1198,
  length: 1,
  convRule: rule22
}, {
  start: 1199,
  length: 1,
  convRule: rule23
}, {
  start: 1200,
  length: 1,
  convRule: rule22
}, {
  start: 1201,
  length: 1,
  convRule: rule23
}, {
  start: 1202,
  length: 1,
  convRule: rule22
}, {
  start: 1203,
  length: 1,
  convRule: rule23
}, {
  start: 1204,
  length: 1,
  convRule: rule22
}, {
  start: 1205,
  length: 1,
  convRule: rule23
}, {
  start: 1206,
  length: 1,
  convRule: rule22
}, {
  start: 1207,
  length: 1,
  convRule: rule23
}, {
  start: 1208,
  length: 1,
  convRule: rule22
}, {
  start: 1209,
  length: 1,
  convRule: rule23
}, {
  start: 1210,
  length: 1,
  convRule: rule22
}, {
  start: 1211,
  length: 1,
  convRule: rule23
}, {
  start: 1212,
  length: 1,
  convRule: rule22
}, {
  start: 1213,
  length: 1,
  convRule: rule23
}, {
  start: 1214,
  length: 1,
  convRule: rule22
}, {
  start: 1215,
  length: 1,
  convRule: rule23
}, {
  start: 1216,
  length: 1,
  convRule: rule120
}, {
  start: 1217,
  length: 1,
  convRule: rule22
}, {
  start: 1218,
  length: 1,
  convRule: rule23
}, {
  start: 1219,
  length: 1,
  convRule: rule22
}, {
  start: 1220,
  length: 1,
  convRule: rule23
}, {
  start: 1221,
  length: 1,
  convRule: rule22
}, {
  start: 1222,
  length: 1,
  convRule: rule23
}, {
  start: 1223,
  length: 1,
  convRule: rule22
}, {
  start: 1224,
  length: 1,
  convRule: rule23
}, {
  start: 1225,
  length: 1,
  convRule: rule22
}, {
  start: 1226,
  length: 1,
  convRule: rule23
}, {
  start: 1227,
  length: 1,
  convRule: rule22
}, {
  start: 1228,
  length: 1,
  convRule: rule23
}, {
  start: 1229,
  length: 1,
  convRule: rule22
}, {
  start: 1230,
  length: 1,
  convRule: rule23
}, {
  start: 1231,
  length: 1,
  convRule: rule121
}, {
  start: 1232,
  length: 1,
  convRule: rule22
}, {
  start: 1233,
  length: 1,
  convRule: rule23
}, {
  start: 1234,
  length: 1,
  convRule: rule22
}, {
  start: 1235,
  length: 1,
  convRule: rule23
}, {
  start: 1236,
  length: 1,
  convRule: rule22
}, {
  start: 1237,
  length: 1,
  convRule: rule23
}, {
  start: 1238,
  length: 1,
  convRule: rule22
}, {
  start: 1239,
  length: 1,
  convRule: rule23
}, {
  start: 1240,
  length: 1,
  convRule: rule22
}, {
  start: 1241,
  length: 1,
  convRule: rule23
}, {
  start: 1242,
  length: 1,
  convRule: rule22
}, {
  start: 1243,
  length: 1,
  convRule: rule23
}, {
  start: 1244,
  length: 1,
  convRule: rule22
}, {
  start: 1245,
  length: 1,
  convRule: rule23
}, {
  start: 1246,
  length: 1,
  convRule: rule22
}, {
  start: 1247,
  length: 1,
  convRule: rule23
}, {
  start: 1248,
  length: 1,
  convRule: rule22
}, {
  start: 1249,
  length: 1,
  convRule: rule23
}, {
  start: 1250,
  length: 1,
  convRule: rule22
}, {
  start: 1251,
  length: 1,
  convRule: rule23
}, {
  start: 1252,
  length: 1,
  convRule: rule22
}, {
  start: 1253,
  length: 1,
  convRule: rule23
}, {
  start: 1254,
  length: 1,
  convRule: rule22
}, {
  start: 1255,
  length: 1,
  convRule: rule23
}, {
  start: 1256,
  length: 1,
  convRule: rule22
}, {
  start: 1257,
  length: 1,
  convRule: rule23
}, {
  start: 1258,
  length: 1,
  convRule: rule22
}, {
  start: 1259,
  length: 1,
  convRule: rule23
}, {
  start: 1260,
  length: 1,
  convRule: rule22
}, {
  start: 1261,
  length: 1,
  convRule: rule23
}, {
  start: 1262,
  length: 1,
  convRule: rule22
}, {
  start: 1263,
  length: 1,
  convRule: rule23
}, {
  start: 1264,
  length: 1,
  convRule: rule22
}, {
  start: 1265,
  length: 1,
  convRule: rule23
}, {
  start: 1266,
  length: 1,
  convRule: rule22
}, {
  start: 1267,
  length: 1,
  convRule: rule23
}, {
  start: 1268,
  length: 1,
  convRule: rule22
}, {
  start: 1269,
  length: 1,
  convRule: rule23
}, {
  start: 1270,
  length: 1,
  convRule: rule22
}, {
  start: 1271,
  length: 1,
  convRule: rule23
}, {
  start: 1272,
  length: 1,
  convRule: rule22
}, {
  start: 1273,
  length: 1,
  convRule: rule23
}, {
  start: 1274,
  length: 1,
  convRule: rule22
}, {
  start: 1275,
  length: 1,
  convRule: rule23
}, {
  start: 1276,
  length: 1,
  convRule: rule22
}, {
  start: 1277,
  length: 1,
  convRule: rule23
}, {
  start: 1278,
  length: 1,
  convRule: rule22
}, {
  start: 1279,
  length: 1,
  convRule: rule23
}, {
  start: 1280,
  length: 1,
  convRule: rule22
}, {
  start: 1281,
  length: 1,
  convRule: rule23
}, {
  start: 1282,
  length: 1,
  convRule: rule22
}, {
  start: 1283,
  length: 1,
  convRule: rule23
}, {
  start: 1284,
  length: 1,
  convRule: rule22
}, {
  start: 1285,
  length: 1,
  convRule: rule23
}, {
  start: 1286,
  length: 1,
  convRule: rule22
}, {
  start: 1287,
  length: 1,
  convRule: rule23
}, {
  start: 1288,
  length: 1,
  convRule: rule22
}, {
  start: 1289,
  length: 1,
  convRule: rule23
}, {
  start: 1290,
  length: 1,
  convRule: rule22
}, {
  start: 1291,
  length: 1,
  convRule: rule23
}, {
  start: 1292,
  length: 1,
  convRule: rule22
}, {
  start: 1293,
  length: 1,
  convRule: rule23
}, {
  start: 1294,
  length: 1,
  convRule: rule22
}, {
  start: 1295,
  length: 1,
  convRule: rule23
}, {
  start: 1296,
  length: 1,
  convRule: rule22
}, {
  start: 1297,
  length: 1,
  convRule: rule23
}, {
  start: 1298,
  length: 1,
  convRule: rule22
}, {
  start: 1299,
  length: 1,
  convRule: rule23
}, {
  start: 1300,
  length: 1,
  convRule: rule22
}, {
  start: 1301,
  length: 1,
  convRule: rule23
}, {
  start: 1302,
  length: 1,
  convRule: rule22
}, {
  start: 1303,
  length: 1,
  convRule: rule23
}, {
  start: 1304,
  length: 1,
  convRule: rule22
}, {
  start: 1305,
  length: 1,
  convRule: rule23
}, {
  start: 1306,
  length: 1,
  convRule: rule22
}, {
  start: 1307,
  length: 1,
  convRule: rule23
}, {
  start: 1308,
  length: 1,
  convRule: rule22
}, {
  start: 1309,
  length: 1,
  convRule: rule23
}, {
  start: 1310,
  length: 1,
  convRule: rule22
}, {
  start: 1311,
  length: 1,
  convRule: rule23
}, {
  start: 1312,
  length: 1,
  convRule: rule22
}, {
  start: 1313,
  length: 1,
  convRule: rule23
}, {
  start: 1314,
  length: 1,
  convRule: rule22
}, {
  start: 1315,
  length: 1,
  convRule: rule23
}, {
  start: 1316,
  length: 1,
  convRule: rule22
}, {
  start: 1317,
  length: 1,
  convRule: rule23
}, {
  start: 1318,
  length: 1,
  convRule: rule22
}, {
  start: 1319,
  length: 1,
  convRule: rule23
}, {
  start: 1320,
  length: 1,
  convRule: rule22
}, {
  start: 1321,
  length: 1,
  convRule: rule23
}, {
  start: 1322,
  length: 1,
  convRule: rule22
}, {
  start: 1323,
  length: 1,
  convRule: rule23
}, {
  start: 1324,
  length: 1,
  convRule: rule22
}, {
  start: 1325,
  length: 1,
  convRule: rule23
}, {
  start: 1326,
  length: 1,
  convRule: rule22
}, {
  start: 1327,
  length: 1,
  convRule: rule23
}, {
  start: 1329,
  length: 38,
  convRule: rule122
}, {
  start: 1369,
  length: 1,
  convRule: rule91
}, {
  start: 1370,
  length: 6,
  convRule: rule2
}, {
  start: 1376,
  length: 1,
  convRule: rule20
}, {
  start: 1377,
  length: 38,
  convRule: rule123
}, {
  start: 1415,
  length: 2,
  convRule: rule20
}, {
  start: 1417,
  length: 1,
  convRule: rule2
}, {
  start: 1418,
  length: 1,
  convRule: rule7
}, {
  start: 1421,
  length: 2,
  convRule: rule13
}, {
  start: 1423,
  length: 1,
  convRule: rule3
}, {
  start: 1425,
  length: 45,
  convRule: rule92
}, {
  start: 1470,
  length: 1,
  convRule: rule7
}, {
  start: 1471,
  length: 1,
  convRule: rule92
}, {
  start: 1472,
  length: 1,
  convRule: rule2
}, {
  start: 1473,
  length: 2,
  convRule: rule92
}, {
  start: 1475,
  length: 1,
  convRule: rule2
}, {
  start: 1476,
  length: 2,
  convRule: rule92
}, {
  start: 1478,
  length: 1,
  convRule: rule2
}, {
  start: 1479,
  length: 1,
  convRule: rule92
}, {
  start: 1488,
  length: 27,
  convRule: rule14
}, {
  start: 1519,
  length: 4,
  convRule: rule14
}, {
  start: 1523,
  length: 2,
  convRule: rule2
}, {
  start: 1536,
  length: 6,
  convRule: rule16
}, {
  start: 1542,
  length: 3,
  convRule: rule6
}, {
  start: 1545,
  length: 2,
  convRule: rule2
}, {
  start: 1547,
  length: 1,
  convRule: rule3
}, {
  start: 1548,
  length: 2,
  convRule: rule2
}, {
  start: 1550,
  length: 2,
  convRule: rule13
}, {
  start: 1552,
  length: 11,
  convRule: rule92
}, {
  start: 1563,
  length: 1,
  convRule: rule2
}, {
  start: 1564,
  length: 1,
  convRule: rule16
}, {
  start: 1566,
  length: 2,
  convRule: rule2
}, {
  start: 1568,
  length: 32,
  convRule: rule14
}, {
  start: 1600,
  length: 1,
  convRule: rule91
}, {
  start: 1601,
  length: 10,
  convRule: rule14
}, {
  start: 1611,
  length: 21,
  convRule: rule92
}, {
  start: 1632,
  length: 10,
  convRule: rule8
}, {
  start: 1642,
  length: 4,
  convRule: rule2
}, {
  start: 1646,
  length: 2,
  convRule: rule14
}, {
  start: 1648,
  length: 1,
  convRule: rule92
}, {
  start: 1649,
  length: 99,
  convRule: rule14
}, {
  start: 1748,
  length: 1,
  convRule: rule2
}, {
  start: 1749,
  length: 1,
  convRule: rule14
}, {
  start: 1750,
  length: 7,
  convRule: rule92
}, {
  start: 1757,
  length: 1,
  convRule: rule16
}, {
  start: 1758,
  length: 1,
  convRule: rule13
}, {
  start: 1759,
  length: 6,
  convRule: rule92
}, {
  start: 1765,
  length: 2,
  convRule: rule91
}, {
  start: 1767,
  length: 2,
  convRule: rule92
}, {
  start: 1769,
  length: 1,
  convRule: rule13
}, {
  start: 1770,
  length: 4,
  convRule: rule92
}, {
  start: 1774,
  length: 2,
  convRule: rule14
}, {
  start: 1776,
  length: 10,
  convRule: rule8
}, {
  start: 1786,
  length: 3,
  convRule: rule14
}, {
  start: 1789,
  length: 2,
  convRule: rule13
}, {
  start: 1791,
  length: 1,
  convRule: rule14
}, {
  start: 1792,
  length: 14,
  convRule: rule2
}, {
  start: 1807,
  length: 1,
  convRule: rule16
}, {
  start: 1808,
  length: 1,
  convRule: rule14
}, {
  start: 1809,
  length: 1,
  convRule: rule92
}, {
  start: 1810,
  length: 30,
  convRule: rule14
}, {
  start: 1840,
  length: 27,
  convRule: rule92
}, {
  start: 1869,
  length: 89,
  convRule: rule14
}, {
  start: 1958,
  length: 11,
  convRule: rule92
}, {
  start: 1969,
  length: 1,
  convRule: rule14
}, {
  start: 1984,
  length: 10,
  convRule: rule8
}, {
  start: 1994,
  length: 33,
  convRule: rule14
}, {
  start: 2027,
  length: 9,
  convRule: rule92
}, {
  start: 2036,
  length: 2,
  convRule: rule91
}, {
  start: 2038,
  length: 1,
  convRule: rule13
}, {
  start: 2039,
  length: 3,
  convRule: rule2
}, {
  start: 2042,
  length: 1,
  convRule: rule91
}, {
  start: 2045,
  length: 1,
  convRule: rule92
}, {
  start: 2046,
  length: 2,
  convRule: rule3
}, {
  start: 2048,
  length: 22,
  convRule: rule14
}, {
  start: 2070,
  length: 4,
  convRule: rule92
}, {
  start: 2074,
  length: 1,
  convRule: rule91
}, {
  start: 2075,
  length: 9,
  convRule: rule92
}, {
  start: 2084,
  length: 1,
  convRule: rule91
}, {
  start: 2085,
  length: 3,
  convRule: rule92
}, {
  start: 2088,
  length: 1,
  convRule: rule91
}, {
  start: 2089,
  length: 5,
  convRule: rule92
}, {
  start: 2096,
  length: 15,
  convRule: rule2
}, {
  start: 2112,
  length: 25,
  convRule: rule14
}, {
  start: 2137,
  length: 3,
  convRule: rule92
}, {
  start: 2142,
  length: 1,
  convRule: rule2
}, {
  start: 2144,
  length: 11,
  convRule: rule14
}, {
  start: 2208,
  length: 21,
  convRule: rule14
}, {
  start: 2230,
  length: 18,
  convRule: rule14
}, {
  start: 2259,
  length: 15,
  convRule: rule92
}, {
  start: 2274,
  length: 1,
  convRule: rule16
}, {
  start: 2275,
  length: 32,
  convRule: rule92
}, {
  start: 2307,
  length: 1,
  convRule: rule124
}, {
  start: 2308,
  length: 54,
  convRule: rule14
}, {
  start: 2362,
  length: 1,
  convRule: rule92
}, {
  start: 2363,
  length: 1,
  convRule: rule124
}, {
  start: 2364,
  length: 1,
  convRule: rule92
}, {
  start: 2365,
  length: 1,
  convRule: rule14
}, {
  start: 2366,
  length: 3,
  convRule: rule124
}, {
  start: 2369,
  length: 8,
  convRule: rule92
}, {
  start: 2377,
  length: 4,
  convRule: rule124
}, {
  start: 2381,
  length: 1,
  convRule: rule92
}, {
  start: 2382,
  length: 2,
  convRule: rule124
}, {
  start: 2384,
  length: 1,
  convRule: rule14
}, {
  start: 2385,
  length: 7,
  convRule: rule92
}, {
  start: 2392,
  length: 10,
  convRule: rule14
}, {
  start: 2402,
  length: 2,
  convRule: rule92
}, {
  start: 2404,
  length: 2,
  convRule: rule2
}, {
  start: 2406,
  length: 10,
  convRule: rule8
}, {
  start: 2416,
  length: 1,
  convRule: rule2
}, {
  start: 2417,
  length: 1,
  convRule: rule91
}, {
  start: 2418,
  length: 15,
  convRule: rule14
}, {
  start: 2433,
  length: 1,
  convRule: rule92
}, {
  start: 2434,
  length: 2,
  convRule: rule124
}, {
  start: 2437,
  length: 8,
  convRule: rule14
}, {
  start: 2447,
  length: 2,
  convRule: rule14
}, {
  start: 2451,
  length: 22,
  convRule: rule14
}, {
  start: 2474,
  length: 7,
  convRule: rule14
}, {
  start: 2482,
  length: 1,
  convRule: rule14
}, {
  start: 2486,
  length: 4,
  convRule: rule14
}, {
  start: 2492,
  length: 1,
  convRule: rule92
}, {
  start: 2493,
  length: 1,
  convRule: rule14
}, {
  start: 2494,
  length: 3,
  convRule: rule124
}, {
  start: 2497,
  length: 4,
  convRule: rule92
}, {
  start: 2503,
  length: 2,
  convRule: rule124
}, {
  start: 2507,
  length: 2,
  convRule: rule124
}, {
  start: 2509,
  length: 1,
  convRule: rule92
}, {
  start: 2510,
  length: 1,
  convRule: rule14
}, {
  start: 2519,
  length: 1,
  convRule: rule124
}, {
  start: 2524,
  length: 2,
  convRule: rule14
}, {
  start: 2527,
  length: 3,
  convRule: rule14
}, {
  start: 2530,
  length: 2,
  convRule: rule92
}, {
  start: 2534,
  length: 10,
  convRule: rule8
}, {
  start: 2544,
  length: 2,
  convRule: rule14
}, {
  start: 2546,
  length: 2,
  convRule: rule3
}, {
  start: 2548,
  length: 6,
  convRule: rule17
}, {
  start: 2554,
  length: 1,
  convRule: rule13
}, {
  start: 2555,
  length: 1,
  convRule: rule3
}, {
  start: 2556,
  length: 1,
  convRule: rule14
}, {
  start: 2557,
  length: 1,
  convRule: rule2
}, {
  start: 2558,
  length: 1,
  convRule: rule92
}, {
  start: 2561,
  length: 2,
  convRule: rule92
}, {
  start: 2563,
  length: 1,
  convRule: rule124
}, {
  start: 2565,
  length: 6,
  convRule: rule14
}, {
  start: 2575,
  length: 2,
  convRule: rule14
}, {
  start: 2579,
  length: 22,
  convRule: rule14
}, {
  start: 2602,
  length: 7,
  convRule: rule14
}, {
  start: 2610,
  length: 2,
  convRule: rule14
}, {
  start: 2613,
  length: 2,
  convRule: rule14
}, {
  start: 2616,
  length: 2,
  convRule: rule14
}, {
  start: 2620,
  length: 1,
  convRule: rule92
}, {
  start: 2622,
  length: 3,
  convRule: rule124
}, {
  start: 2625,
  length: 2,
  convRule: rule92
}, {
  start: 2631,
  length: 2,
  convRule: rule92
}, {
  start: 2635,
  length: 3,
  convRule: rule92
}, {
  start: 2641,
  length: 1,
  convRule: rule92
}, {
  start: 2649,
  length: 4,
  convRule: rule14
}, {
  start: 2654,
  length: 1,
  convRule: rule14
}, {
  start: 2662,
  length: 10,
  convRule: rule8
}, {
  start: 2672,
  length: 2,
  convRule: rule92
}, {
  start: 2674,
  length: 3,
  convRule: rule14
}, {
  start: 2677,
  length: 1,
  convRule: rule92
}, {
  start: 2678,
  length: 1,
  convRule: rule2
}, {
  start: 2689,
  length: 2,
  convRule: rule92
}, {
  start: 2691,
  length: 1,
  convRule: rule124
}, {
  start: 2693,
  length: 9,
  convRule: rule14
}, {
  start: 2703,
  length: 3,
  convRule: rule14
}, {
  start: 2707,
  length: 22,
  convRule: rule14
}, {
  start: 2730,
  length: 7,
  convRule: rule14
}, {
  start: 2738,
  length: 2,
  convRule: rule14
}, {
  start: 2741,
  length: 5,
  convRule: rule14
}, {
  start: 2748,
  length: 1,
  convRule: rule92
}, {
  start: 2749,
  length: 1,
  convRule: rule14
}, {
  start: 2750,
  length: 3,
  convRule: rule124
}, {
  start: 2753,
  length: 5,
  convRule: rule92
}, {
  start: 2759,
  length: 2,
  convRule: rule92
}, {
  start: 2761,
  length: 1,
  convRule: rule124
}, {
  start: 2763,
  length: 2,
  convRule: rule124
}, {
  start: 2765,
  length: 1,
  convRule: rule92
}, {
  start: 2768,
  length: 1,
  convRule: rule14
}, {
  start: 2784,
  length: 2,
  convRule: rule14
}, {
  start: 2786,
  length: 2,
  convRule: rule92
}, {
  start: 2790,
  length: 10,
  convRule: rule8
}, {
  start: 2800,
  length: 1,
  convRule: rule2
}, {
  start: 2801,
  length: 1,
  convRule: rule3
}, {
  start: 2809,
  length: 1,
  convRule: rule14
}, {
  start: 2810,
  length: 6,
  convRule: rule92
}, {
  start: 2817,
  length: 1,
  convRule: rule92
}, {
  start: 2818,
  length: 2,
  convRule: rule124
}, {
  start: 2821,
  length: 8,
  convRule: rule14
}, {
  start: 2831,
  length: 2,
  convRule: rule14
}, {
  start: 2835,
  length: 22,
  convRule: rule14
}, {
  start: 2858,
  length: 7,
  convRule: rule14
}, {
  start: 2866,
  length: 2,
  convRule: rule14
}, {
  start: 2869,
  length: 5,
  convRule: rule14
}, {
  start: 2876,
  length: 1,
  convRule: rule92
}, {
  start: 2877,
  length: 1,
  convRule: rule14
}, {
  start: 2878,
  length: 1,
  convRule: rule124
}, {
  start: 2879,
  length: 1,
  convRule: rule92
}, {
  start: 2880,
  length: 1,
  convRule: rule124
}, {
  start: 2881,
  length: 4,
  convRule: rule92
}, {
  start: 2887,
  length: 2,
  convRule: rule124
}, {
  start: 2891,
  length: 2,
  convRule: rule124
}, {
  start: 2893,
  length: 1,
  convRule: rule92
}, {
  start: 2901,
  length: 2,
  convRule: rule92
}, {
  start: 2903,
  length: 1,
  convRule: rule124
}, {
  start: 2908,
  length: 2,
  convRule: rule14
}, {
  start: 2911,
  length: 3,
  convRule: rule14
}, {
  start: 2914,
  length: 2,
  convRule: rule92
}, {
  start: 2918,
  length: 10,
  convRule: rule8
}, {
  start: 2928,
  length: 1,
  convRule: rule13
}, {
  start: 2929,
  length: 1,
  convRule: rule14
}, {
  start: 2930,
  length: 6,
  convRule: rule17
}, {
  start: 2946,
  length: 1,
  convRule: rule92
}, {
  start: 2947,
  length: 1,
  convRule: rule14
}, {
  start: 2949,
  length: 6,
  convRule: rule14
}, {
  start: 2958,
  length: 3,
  convRule: rule14
}, {
  start: 2962,
  length: 4,
  convRule: rule14
}, {
  start: 2969,
  length: 2,
  convRule: rule14
}, {
  start: 2972,
  length: 1,
  convRule: rule14
}, {
  start: 2974,
  length: 2,
  convRule: rule14
}, {
  start: 2979,
  length: 2,
  convRule: rule14
}, {
  start: 2984,
  length: 3,
  convRule: rule14
}, {
  start: 2990,
  length: 12,
  convRule: rule14
}, {
  start: 3006,
  length: 2,
  convRule: rule124
}, {
  start: 3008,
  length: 1,
  convRule: rule92
}, {
  start: 3009,
  length: 2,
  convRule: rule124
}, {
  start: 3014,
  length: 3,
  convRule: rule124
}, {
  start: 3018,
  length: 3,
  convRule: rule124
}, {
  start: 3021,
  length: 1,
  convRule: rule92
}, {
  start: 3024,
  length: 1,
  convRule: rule14
}, {
  start: 3031,
  length: 1,
  convRule: rule124
}, {
  start: 3046,
  length: 10,
  convRule: rule8
}, {
  start: 3056,
  length: 3,
  convRule: rule17
}, {
  start: 3059,
  length: 6,
  convRule: rule13
}, {
  start: 3065,
  length: 1,
  convRule: rule3
}, {
  start: 3066,
  length: 1,
  convRule: rule13
}, {
  start: 3072,
  length: 1,
  convRule: rule92
}, {
  start: 3073,
  length: 3,
  convRule: rule124
}, {
  start: 3076,
  length: 1,
  convRule: rule92
}, {
  start: 3077,
  length: 8,
  convRule: rule14
}, {
  start: 3086,
  length: 3,
  convRule: rule14
}, {
  start: 3090,
  length: 23,
  convRule: rule14
}, {
  start: 3114,
  length: 16,
  convRule: rule14
}, {
  start: 3133,
  length: 1,
  convRule: rule14
}, {
  start: 3134,
  length: 3,
  convRule: rule92
}, {
  start: 3137,
  length: 4,
  convRule: rule124
}, {
  start: 3142,
  length: 3,
  convRule: rule92
}, {
  start: 3146,
  length: 4,
  convRule: rule92
}, {
  start: 3157,
  length: 2,
  convRule: rule92
}, {
  start: 3160,
  length: 3,
  convRule: rule14
}, {
  start: 3168,
  length: 2,
  convRule: rule14
}, {
  start: 3170,
  length: 2,
  convRule: rule92
}, {
  start: 3174,
  length: 10,
  convRule: rule8
}, {
  start: 3191,
  length: 1,
  convRule: rule2
}, {
  start: 3192,
  length: 7,
  convRule: rule17
}, {
  start: 3199,
  length: 1,
  convRule: rule13
}, {
  start: 3200,
  length: 1,
  convRule: rule14
}, {
  start: 3201,
  length: 1,
  convRule: rule92
}, {
  start: 3202,
  length: 2,
  convRule: rule124
}, {
  start: 3204,
  length: 1,
  convRule: rule2
}, {
  start: 3205,
  length: 8,
  convRule: rule14
}, {
  start: 3214,
  length: 3,
  convRule: rule14
}, {
  start: 3218,
  length: 23,
  convRule: rule14
}, {
  start: 3242,
  length: 10,
  convRule: rule14
}, {
  start: 3253,
  length: 5,
  convRule: rule14
}, {
  start: 3260,
  length: 1,
  convRule: rule92
}, {
  start: 3261,
  length: 1,
  convRule: rule14
}, {
  start: 3262,
  length: 1,
  convRule: rule124
}, {
  start: 3263,
  length: 1,
  convRule: rule92
}, {
  start: 3264,
  length: 5,
  convRule: rule124
}, {
  start: 3270,
  length: 1,
  convRule: rule92
}, {
  start: 3271,
  length: 2,
  convRule: rule124
}, {
  start: 3274,
  length: 2,
  convRule: rule124
}, {
  start: 3276,
  length: 2,
  convRule: rule92
}, {
  start: 3285,
  length: 2,
  convRule: rule124
}, {
  start: 3294,
  length: 1,
  convRule: rule14
}, {
  start: 3296,
  length: 2,
  convRule: rule14
}, {
  start: 3298,
  length: 2,
  convRule: rule92
}, {
  start: 3302,
  length: 10,
  convRule: rule8
}, {
  start: 3313,
  length: 2,
  convRule: rule14
}, {
  start: 3328,
  length: 2,
  convRule: rule92
}, {
  start: 3330,
  length: 2,
  convRule: rule124
}, {
  start: 3332,
  length: 9,
  convRule: rule14
}, {
  start: 3342,
  length: 3,
  convRule: rule14
}, {
  start: 3346,
  length: 41,
  convRule: rule14
}, {
  start: 3387,
  length: 2,
  convRule: rule92
}, {
  start: 3389,
  length: 1,
  convRule: rule14
}, {
  start: 3390,
  length: 3,
  convRule: rule124
}, {
  start: 3393,
  length: 4,
  convRule: rule92
}, {
  start: 3398,
  length: 3,
  convRule: rule124
}, {
  start: 3402,
  length: 3,
  convRule: rule124
}, {
  start: 3405,
  length: 1,
  convRule: rule92
}, {
  start: 3406,
  length: 1,
  convRule: rule14
}, {
  start: 3407,
  length: 1,
  convRule: rule13
}, {
  start: 3412,
  length: 3,
  convRule: rule14
}, {
  start: 3415,
  length: 1,
  convRule: rule124
}, {
  start: 3416,
  length: 7,
  convRule: rule17
}, {
  start: 3423,
  length: 3,
  convRule: rule14
}, {
  start: 3426,
  length: 2,
  convRule: rule92
}, {
  start: 3430,
  length: 10,
  convRule: rule8
}, {
  start: 3440,
  length: 9,
  convRule: rule17
}, {
  start: 3449,
  length: 1,
  convRule: rule13
}, {
  start: 3450,
  length: 6,
  convRule: rule14
}, {
  start: 3457,
  length: 1,
  convRule: rule92
}, {
  start: 3458,
  length: 2,
  convRule: rule124
}, {
  start: 3461,
  length: 18,
  convRule: rule14
}, {
  start: 3482,
  length: 24,
  convRule: rule14
}, {
  start: 3507,
  length: 9,
  convRule: rule14
}, {
  start: 3517,
  length: 1,
  convRule: rule14
}, {
  start: 3520,
  length: 7,
  convRule: rule14
}, {
  start: 3530,
  length: 1,
  convRule: rule92
}, {
  start: 3535,
  length: 3,
  convRule: rule124
}, {
  start: 3538,
  length: 3,
  convRule: rule92
}, {
  start: 3542,
  length: 1,
  convRule: rule92
}, {
  start: 3544,
  length: 8,
  convRule: rule124
}, {
  start: 3558,
  length: 10,
  convRule: rule8
}, {
  start: 3570,
  length: 2,
  convRule: rule124
}, {
  start: 3572,
  length: 1,
  convRule: rule2
}, {
  start: 3585,
  length: 48,
  convRule: rule14
}, {
  start: 3633,
  length: 1,
  convRule: rule92
}, {
  start: 3634,
  length: 2,
  convRule: rule14
}, {
  start: 3636,
  length: 7,
  convRule: rule92
}, {
  start: 3647,
  length: 1,
  convRule: rule3
}, {
  start: 3648,
  length: 6,
  convRule: rule14
}, {
  start: 3654,
  length: 1,
  convRule: rule91
}, {
  start: 3655,
  length: 8,
  convRule: rule92
}, {
  start: 3663,
  length: 1,
  convRule: rule2
}, {
  start: 3664,
  length: 10,
  convRule: rule8
}, {
  start: 3674,
  length: 2,
  convRule: rule2
}, {
  start: 3713,
  length: 2,
  convRule: rule14
}, {
  start: 3716,
  length: 1,
  convRule: rule14
}, {
  start: 3718,
  length: 5,
  convRule: rule14
}, {
  start: 3724,
  length: 24,
  convRule: rule14
}, {
  start: 3749,
  length: 1,
  convRule: rule14
}, {
  start: 3751,
  length: 10,
  convRule: rule14
}, {
  start: 3761,
  length: 1,
  convRule: rule92
}, {
  start: 3762,
  length: 2,
  convRule: rule14
}, {
  start: 3764,
  length: 9,
  convRule: rule92
}, {
  start: 3773,
  length: 1,
  convRule: rule14
}, {
  start: 3776,
  length: 5,
  convRule: rule14
}, {
  start: 3782,
  length: 1,
  convRule: rule91
}, {
  start: 3784,
  length: 6,
  convRule: rule92
}, {
  start: 3792,
  length: 10,
  convRule: rule8
}, {
  start: 3804,
  length: 4,
  convRule: rule14
}, {
  start: 3840,
  length: 1,
  convRule: rule14
}, {
  start: 3841,
  length: 3,
  convRule: rule13
}, {
  start: 3844,
  length: 15,
  convRule: rule2
}, {
  start: 3859,
  length: 1,
  convRule: rule13
}, {
  start: 3860,
  length: 1,
  convRule: rule2
}, {
  start: 3861,
  length: 3,
  convRule: rule13
}, {
  start: 3864,
  length: 2,
  convRule: rule92
}, {
  start: 3866,
  length: 6,
  convRule: rule13
}, {
  start: 3872,
  length: 10,
  convRule: rule8
}, {
  start: 3882,
  length: 10,
  convRule: rule17
}, {
  start: 3892,
  length: 1,
  convRule: rule13
}, {
  start: 3893,
  length: 1,
  convRule: rule92
}, {
  start: 3894,
  length: 1,
  convRule: rule13
}, {
  start: 3895,
  length: 1,
  convRule: rule92
}, {
  start: 3896,
  length: 1,
  convRule: rule13
}, {
  start: 3897,
  length: 1,
  convRule: rule92
}, {
  start: 3898,
  length: 1,
  convRule: rule4
}, {
  start: 3899,
  length: 1,
  convRule: rule5
}, {
  start: 3900,
  length: 1,
  convRule: rule4
}, {
  start: 3901,
  length: 1,
  convRule: rule5
}, {
  start: 3902,
  length: 2,
  convRule: rule124
}, {
  start: 3904,
  length: 8,
  convRule: rule14
}, {
  start: 3913,
  length: 36,
  convRule: rule14
}, {
  start: 3953,
  length: 14,
  convRule: rule92
}, {
  start: 3967,
  length: 1,
  convRule: rule124
}, {
  start: 3968,
  length: 5,
  convRule: rule92
}, {
  start: 3973,
  length: 1,
  convRule: rule2
}, {
  start: 3974,
  length: 2,
  convRule: rule92
}, {
  start: 3976,
  length: 5,
  convRule: rule14
}, {
  start: 3981,
  length: 11,
  convRule: rule92
}, {
  start: 3993,
  length: 36,
  convRule: rule92
}, {
  start: 4030,
  length: 8,
  convRule: rule13
}, {
  start: 4038,
  length: 1,
  convRule: rule92
}, {
  start: 4039,
  length: 6,
  convRule: rule13
}, {
  start: 4046,
  length: 2,
  convRule: rule13
}, {
  start: 4048,
  length: 5,
  convRule: rule2
}, {
  start: 4053,
  length: 4,
  convRule: rule13
}, {
  start: 4057,
  length: 2,
  convRule: rule2
}, {
  start: 4096,
  length: 43,
  convRule: rule14
}, {
  start: 4139,
  length: 2,
  convRule: rule124
}, {
  start: 4141,
  length: 4,
  convRule: rule92
}, {
  start: 4145,
  length: 1,
  convRule: rule124
}, {
  start: 4146,
  length: 6,
  convRule: rule92
}, {
  start: 4152,
  length: 1,
  convRule: rule124
}, {
  start: 4153,
  length: 2,
  convRule: rule92
}, {
  start: 4155,
  length: 2,
  convRule: rule124
}, {
  start: 4157,
  length: 2,
  convRule: rule92
}, {
  start: 4159,
  length: 1,
  convRule: rule14
}, {
  start: 4160,
  length: 10,
  convRule: rule8
}, {
  start: 4170,
  length: 6,
  convRule: rule2
}, {
  start: 4176,
  length: 6,
  convRule: rule14
}, {
  start: 4182,
  length: 2,
  convRule: rule124
}, {
  start: 4184,
  length: 2,
  convRule: rule92
}, {
  start: 4186,
  length: 4,
  convRule: rule14
}, {
  start: 4190,
  length: 3,
  convRule: rule92
}, {
  start: 4193,
  length: 1,
  convRule: rule14
}, {
  start: 4194,
  length: 3,
  convRule: rule124
}, {
  start: 4197,
  length: 2,
  convRule: rule14
}, {
  start: 4199,
  length: 7,
  convRule: rule124
}, {
  start: 4206,
  length: 3,
  convRule: rule14
}, {
  start: 4209,
  length: 4,
  convRule: rule92
}, {
  start: 4213,
  length: 13,
  convRule: rule14
}, {
  start: 4226,
  length: 1,
  convRule: rule92
}, {
  start: 4227,
  length: 2,
  convRule: rule124
}, {
  start: 4229,
  length: 2,
  convRule: rule92
}, {
  start: 4231,
  length: 6,
  convRule: rule124
}, {
  start: 4237,
  length: 1,
  convRule: rule92
}, {
  start: 4238,
  length: 1,
  convRule: rule14
}, {
  start: 4239,
  length: 1,
  convRule: rule124
}, {
  start: 4240,
  length: 10,
  convRule: rule8
}, {
  start: 4250,
  length: 3,
  convRule: rule124
}, {
  start: 4253,
  length: 1,
  convRule: rule92
}, {
  start: 4254,
  length: 2,
  convRule: rule13
}, {
  start: 4256,
  length: 38,
  convRule: rule125
}, {
  start: 4295,
  length: 1,
  convRule: rule125
}, {
  start: 4301,
  length: 1,
  convRule: rule125
}, {
  start: 4304,
  length: 43,
  convRule: rule126
}, {
  start: 4347,
  length: 1,
  convRule: rule2
}, {
  start: 4348,
  length: 1,
  convRule: rule91
}, {
  start: 4349,
  length: 3,
  convRule: rule126
}, {
  start: 4352,
  length: 329,
  convRule: rule14
}, {
  start: 4682,
  length: 4,
  convRule: rule14
}, {
  start: 4688,
  length: 7,
  convRule: rule14
}, {
  start: 4696,
  length: 1,
  convRule: rule14
}, {
  start: 4698,
  length: 4,
  convRule: rule14
}, {
  start: 4704,
  length: 41,
  convRule: rule14
}, {
  start: 4746,
  length: 4,
  convRule: rule14
}, {
  start: 4752,
  length: 33,
  convRule: rule14
}, {
  start: 4786,
  length: 4,
  convRule: rule14
}, {
  start: 4792,
  length: 7,
  convRule: rule14
}, {
  start: 4800,
  length: 1,
  convRule: rule14
}, {
  start: 4802,
  length: 4,
  convRule: rule14
}, {
  start: 4808,
  length: 15,
  convRule: rule14
}, {
  start: 4824,
  length: 57,
  convRule: rule14
}, {
  start: 4882,
  length: 4,
  convRule: rule14
}, {
  start: 4888,
  length: 67,
  convRule: rule14
}, {
  start: 4957,
  length: 3,
  convRule: rule92
}, {
  start: 4960,
  length: 9,
  convRule: rule2
}, {
  start: 4969,
  length: 20,
  convRule: rule17
}, {
  start: 4992,
  length: 16,
  convRule: rule14
}, {
  start: 5008,
  length: 10,
  convRule: rule13
}, {
  start: 5024,
  length: 80,
  convRule: rule127
}, {
  start: 5104,
  length: 6,
  convRule: rule104
}, {
  start: 5112,
  length: 6,
  convRule: rule110
}, {
  start: 5120,
  length: 1,
  convRule: rule7
}, {
  start: 5121,
  length: 620,
  convRule: rule14
}, {
  start: 5741,
  length: 1,
  convRule: rule13
}, {
  start: 5742,
  length: 1,
  convRule: rule2
}, {
  start: 5743,
  length: 17,
  convRule: rule14
}, {
  start: 5760,
  length: 1,
  convRule: rule1
}, {
  start: 5761,
  length: 26,
  convRule: rule14
}, {
  start: 5787,
  length: 1,
  convRule: rule4
}, {
  start: 5788,
  length: 1,
  convRule: rule5
}, {
  start: 5792,
  length: 75,
  convRule: rule14
}, {
  start: 5867,
  length: 3,
  convRule: rule2
}, {
  start: 5870,
  length: 3,
  convRule: rule128
}, {
  start: 5873,
  length: 8,
  convRule: rule14
}, {
  start: 5888,
  length: 13,
  convRule: rule14
}, {
  start: 5902,
  length: 4,
  convRule: rule14
}, {
  start: 5906,
  length: 3,
  convRule: rule92
}, {
  start: 5920,
  length: 18,
  convRule: rule14
}, {
  start: 5938,
  length: 3,
  convRule: rule92
}, {
  start: 5941,
  length: 2,
  convRule: rule2
}, {
  start: 5952,
  length: 18,
  convRule: rule14
}, {
  start: 5970,
  length: 2,
  convRule: rule92
}, {
  start: 5984,
  length: 13,
  convRule: rule14
}, {
  start: 5998,
  length: 3,
  convRule: rule14
}, {
  start: 6002,
  length: 2,
  convRule: rule92
}, {
  start: 6016,
  length: 52,
  convRule: rule14
}, {
  start: 6068,
  length: 2,
  convRule: rule92
}, {
  start: 6070,
  length: 1,
  convRule: rule124
}, {
  start: 6071,
  length: 7,
  convRule: rule92
}, {
  start: 6078,
  length: 8,
  convRule: rule124
}, {
  start: 6086,
  length: 1,
  convRule: rule92
}, {
  start: 6087,
  length: 2,
  convRule: rule124
}, {
  start: 6089,
  length: 11,
  convRule: rule92
}, {
  start: 6100,
  length: 3,
  convRule: rule2
}, {
  start: 6103,
  length: 1,
  convRule: rule91
}, {
  start: 6104,
  length: 3,
  convRule: rule2
}, {
  start: 6107,
  length: 1,
  convRule: rule3
}, {
  start: 6108,
  length: 1,
  convRule: rule14
}, {
  start: 6109,
  length: 1,
  convRule: rule92
}, {
  start: 6112,
  length: 10,
  convRule: rule8
}, {
  start: 6128,
  length: 10,
  convRule: rule17
}, {
  start: 6144,
  length: 6,
  convRule: rule2
}, {
  start: 6150,
  length: 1,
  convRule: rule7
}, {
  start: 6151,
  length: 4,
  convRule: rule2
}, {
  start: 6155,
  length: 3,
  convRule: rule92
}, {
  start: 6158,
  length: 1,
  convRule: rule16
}, {
  start: 6160,
  length: 10,
  convRule: rule8
}, {
  start: 6176,
  length: 35,
  convRule: rule14
}, {
  start: 6211,
  length: 1,
  convRule: rule91
}, {
  start: 6212,
  length: 53,
  convRule: rule14
}, {
  start: 6272,
  length: 5,
  convRule: rule14
}, {
  start: 6277,
  length: 2,
  convRule: rule92
}, {
  start: 6279,
  length: 34,
  convRule: rule14
}, {
  start: 6313,
  length: 1,
  convRule: rule92
}, {
  start: 6314,
  length: 1,
  convRule: rule14
}, {
  start: 6320,
  length: 70,
  convRule: rule14
}, {
  start: 6400,
  length: 31,
  convRule: rule14
}, {
  start: 6432,
  length: 3,
  convRule: rule92
}, {
  start: 6435,
  length: 4,
  convRule: rule124
}, {
  start: 6439,
  length: 2,
  convRule: rule92
}, {
  start: 6441,
  length: 3,
  convRule: rule124
}, {
  start: 6448,
  length: 2,
  convRule: rule124
}, {
  start: 6450,
  length: 1,
  convRule: rule92
}, {
  start: 6451,
  length: 6,
  convRule: rule124
}, {
  start: 6457,
  length: 3,
  convRule: rule92
}, {
  start: 6464,
  length: 1,
  convRule: rule13
}, {
  start: 6468,
  length: 2,
  convRule: rule2
}, {
  start: 6470,
  length: 10,
  convRule: rule8
}, {
  start: 6480,
  length: 30,
  convRule: rule14
}, {
  start: 6512,
  length: 5,
  convRule: rule14
}, {
  start: 6528,
  length: 44,
  convRule: rule14
}, {
  start: 6576,
  length: 26,
  convRule: rule14
}, {
  start: 6608,
  length: 10,
  convRule: rule8
}, {
  start: 6618,
  length: 1,
  convRule: rule17
}, {
  start: 6622,
  length: 34,
  convRule: rule13
}, {
  start: 6656,
  length: 23,
  convRule: rule14
}, {
  start: 6679,
  length: 2,
  convRule: rule92
}, {
  start: 6681,
  length: 2,
  convRule: rule124
}, {
  start: 6683,
  length: 1,
  convRule: rule92
}, {
  start: 6686,
  length: 2,
  convRule: rule2
}, {
  start: 6688,
  length: 53,
  convRule: rule14
}, {
  start: 6741,
  length: 1,
  convRule: rule124
}, {
  start: 6742,
  length: 1,
  convRule: rule92
}, {
  start: 6743,
  length: 1,
  convRule: rule124
}, {
  start: 6744,
  length: 7,
  convRule: rule92
}, {
  start: 6752,
  length: 1,
  convRule: rule92
}, {
  start: 6753,
  length: 1,
  convRule: rule124
}, {
  start: 6754,
  length: 1,
  convRule: rule92
}, {
  start: 6755,
  length: 2,
  convRule: rule124
}, {
  start: 6757,
  length: 8,
  convRule: rule92
}, {
  start: 6765,
  length: 6,
  convRule: rule124
}, {
  start: 6771,
  length: 10,
  convRule: rule92
}, {
  start: 6783,
  length: 1,
  convRule: rule92
}, {
  start: 6784,
  length: 10,
  convRule: rule8
}, {
  start: 6800,
  length: 10,
  convRule: rule8
}, {
  start: 6816,
  length: 7,
  convRule: rule2
}, {
  start: 6823,
  length: 1,
  convRule: rule91
}, {
  start: 6824,
  length: 6,
  convRule: rule2
}, {
  start: 6832,
  length: 14,
  convRule: rule92
}, {
  start: 6846,
  length: 1,
  convRule: rule119
}, {
  start: 6847,
  length: 2,
  convRule: rule92
}, {
  start: 6912,
  length: 4,
  convRule: rule92
}, {
  start: 6916,
  length: 1,
  convRule: rule124
}, {
  start: 6917,
  length: 47,
  convRule: rule14
}, {
  start: 6964,
  length: 1,
  convRule: rule92
}, {
  start: 6965,
  length: 1,
  convRule: rule124
}, {
  start: 6966,
  length: 5,
  convRule: rule92
}, {
  start: 6971,
  length: 1,
  convRule: rule124
}, {
  start: 6972,
  length: 1,
  convRule: rule92
}, {
  start: 6973,
  length: 5,
  convRule: rule124
}, {
  start: 6978,
  length: 1,
  convRule: rule92
}, {
  start: 6979,
  length: 2,
  convRule: rule124
}, {
  start: 6981,
  length: 7,
  convRule: rule14
}, {
  start: 6992,
  length: 10,
  convRule: rule8
}, {
  start: 7002,
  length: 7,
  convRule: rule2
}, {
  start: 7009,
  length: 10,
  convRule: rule13
}, {
  start: 7019,
  length: 9,
  convRule: rule92
}, {
  start: 7028,
  length: 9,
  convRule: rule13
}, {
  start: 7040,
  length: 2,
  convRule: rule92
}, {
  start: 7042,
  length: 1,
  convRule: rule124
}, {
  start: 7043,
  length: 30,
  convRule: rule14
}, {
  start: 7073,
  length: 1,
  convRule: rule124
}, {
  start: 7074,
  length: 4,
  convRule: rule92
}, {
  start: 7078,
  length: 2,
  convRule: rule124
}, {
  start: 7080,
  length: 2,
  convRule: rule92
}, {
  start: 7082,
  length: 1,
  convRule: rule124
}, {
  start: 7083,
  length: 3,
  convRule: rule92
}, {
  start: 7086,
  length: 2,
  convRule: rule14
}, {
  start: 7088,
  length: 10,
  convRule: rule8
}, {
  start: 7098,
  length: 44,
  convRule: rule14
}, {
  start: 7142,
  length: 1,
  convRule: rule92
}, {
  start: 7143,
  length: 1,
  convRule: rule124
}, {
  start: 7144,
  length: 2,
  convRule: rule92
}, {
  start: 7146,
  length: 3,
  convRule: rule124
}, {
  start: 7149,
  length: 1,
  convRule: rule92
}, {
  start: 7150,
  length: 1,
  convRule: rule124
}, {
  start: 7151,
  length: 3,
  convRule: rule92
}, {
  start: 7154,
  length: 2,
  convRule: rule124
}, {
  start: 7164,
  length: 4,
  convRule: rule2
}, {
  start: 7168,
  length: 36,
  convRule: rule14
}, {
  start: 7204,
  length: 8,
  convRule: rule124
}, {
  start: 7212,
  length: 8,
  convRule: rule92
}, {
  start: 7220,
  length: 2,
  convRule: rule124
}, {
  start: 7222,
  length: 2,
  convRule: rule92
}, {
  start: 7227,
  length: 5,
  convRule: rule2
}, {
  start: 7232,
  length: 10,
  convRule: rule8
}, {
  start: 7245,
  length: 3,
  convRule: rule14
}, {
  start: 7248,
  length: 10,
  convRule: rule8
}, {
  start: 7258,
  length: 30,
  convRule: rule14
}, {
  start: 7288,
  length: 6,
  convRule: rule91
}, {
  start: 7294,
  length: 2,
  convRule: rule2
}, {
  start: 7296,
  length: 1,
  convRule: rule129
}, {
  start: 7297,
  length: 1,
  convRule: rule130
}, {
  start: 7298,
  length: 1,
  convRule: rule131
}, {
  start: 7299,
  length: 2,
  convRule: rule132
}, {
  start: 7301,
  length: 1,
  convRule: rule133
}, {
  start: 7302,
  length: 1,
  convRule: rule134
}, {
  start: 7303,
  length: 1,
  convRule: rule135
}, {
  start: 7304,
  length: 1,
  convRule: rule136
}, {
  start: 7312,
  length: 43,
  convRule: rule137
}, {
  start: 7357,
  length: 3,
  convRule: rule137
}, {
  start: 7360,
  length: 8,
  convRule: rule2
}, {
  start: 7376,
  length: 3,
  convRule: rule92
}, {
  start: 7379,
  length: 1,
  convRule: rule2
}, {
  start: 7380,
  length: 13,
  convRule: rule92
}, {
  start: 7393,
  length: 1,
  convRule: rule124
}, {
  start: 7394,
  length: 7,
  convRule: rule92
}, {
  start: 7401,
  length: 4,
  convRule: rule14
}, {
  start: 7405,
  length: 1,
  convRule: rule92
}, {
  start: 7406,
  length: 6,
  convRule: rule14
}, {
  start: 7412,
  length: 1,
  convRule: rule92
}, {
  start: 7413,
  length: 2,
  convRule: rule14
}, {
  start: 7415,
  length: 1,
  convRule: rule124
}, {
  start: 7416,
  length: 2,
  convRule: rule92
}, {
  start: 7418,
  length: 1,
  convRule: rule14
}, {
  start: 7424,
  length: 44,
  convRule: rule20
}, {
  start: 7468,
  length: 63,
  convRule: rule91
}, {
  start: 7531,
  length: 13,
  convRule: rule20
}, {
  start: 7544,
  length: 1,
  convRule: rule91
}, {
  start: 7545,
  length: 1,
  convRule: rule138
}, {
  start: 7546,
  length: 3,
  convRule: rule20
}, {
  start: 7549,
  length: 1,
  convRule: rule139
}, {
  start: 7550,
  length: 16,
  convRule: rule20
}, {
  start: 7566,
  length: 1,
  convRule: rule140
}, {
  start: 7567,
  length: 12,
  convRule: rule20
}, {
  start: 7579,
  length: 37,
  convRule: rule91
}, {
  start: 7616,
  length: 58,
  convRule: rule92
}, {
  start: 7675,
  length: 5,
  convRule: rule92
}, {
  start: 7680,
  length: 1,
  convRule: rule22
}, {
  start: 7681,
  length: 1,
  convRule: rule23
}, {
  start: 7682,
  length: 1,
  convRule: rule22
}, {
  start: 7683,
  length: 1,
  convRule: rule23
}, {
  start: 7684,
  length: 1,
  convRule: rule22
}, {
  start: 7685,
  length: 1,
  convRule: rule23
}, {
  start: 7686,
  length: 1,
  convRule: rule22
}, {
  start: 7687,
  length: 1,
  convRule: rule23
}, {
  start: 7688,
  length: 1,
  convRule: rule22
}, {
  start: 7689,
  length: 1,
  convRule: rule23
}, {
  start: 7690,
  length: 1,
  convRule: rule22
}, {
  start: 7691,
  length: 1,
  convRule: rule23
}, {
  start: 7692,
  length: 1,
  convRule: rule22
}, {
  start: 7693,
  length: 1,
  convRule: rule23
}, {
  start: 7694,
  length: 1,
  convRule: rule22
}, {
  start: 7695,
  length: 1,
  convRule: rule23
}, {
  start: 7696,
  length: 1,
  convRule: rule22
}, {
  start: 7697,
  length: 1,
  convRule: rule23
}, {
  start: 7698,
  length: 1,
  convRule: rule22
}, {
  start: 7699,
  length: 1,
  convRule: rule23
}, {
  start: 7700,
  length: 1,
  convRule: rule22
}, {
  start: 7701,
  length: 1,
  convRule: rule23
}, {
  start: 7702,
  length: 1,
  convRule: rule22
}, {
  start: 7703,
  length: 1,
  convRule: rule23
}, {
  start: 7704,
  length: 1,
  convRule: rule22
}, {
  start: 7705,
  length: 1,
  convRule: rule23
}, {
  start: 7706,
  length: 1,
  convRule: rule22
}, {
  start: 7707,
  length: 1,
  convRule: rule23
}, {
  start: 7708,
  length: 1,
  convRule: rule22
}, {
  start: 7709,
  length: 1,
  convRule: rule23
}, {
  start: 7710,
  length: 1,
  convRule: rule22
}, {
  start: 7711,
  length: 1,
  convRule: rule23
}, {
  start: 7712,
  length: 1,
  convRule: rule22
}, {
  start: 7713,
  length: 1,
  convRule: rule23
}, {
  start: 7714,
  length: 1,
  convRule: rule22
}, {
  start: 7715,
  length: 1,
  convRule: rule23
}, {
  start: 7716,
  length: 1,
  convRule: rule22
}, {
  start: 7717,
  length: 1,
  convRule: rule23
}, {
  start: 7718,
  length: 1,
  convRule: rule22
}, {
  start: 7719,
  length: 1,
  convRule: rule23
}, {
  start: 7720,
  length: 1,
  convRule: rule22
}, {
  start: 7721,
  length: 1,
  convRule: rule23
}, {
  start: 7722,
  length: 1,
  convRule: rule22
}, {
  start: 7723,
  length: 1,
  convRule: rule23
}, {
  start: 7724,
  length: 1,
  convRule: rule22
}, {
  start: 7725,
  length: 1,
  convRule: rule23
}, {
  start: 7726,
  length: 1,
  convRule: rule22
}, {
  start: 7727,
  length: 1,
  convRule: rule23
}, {
  start: 7728,
  length: 1,
  convRule: rule22
}, {
  start: 7729,
  length: 1,
  convRule: rule23
}, {
  start: 7730,
  length: 1,
  convRule: rule22
}, {
  start: 7731,
  length: 1,
  convRule: rule23
}, {
  start: 7732,
  length: 1,
  convRule: rule22
}, {
  start: 7733,
  length: 1,
  convRule: rule23
}, {
  start: 7734,
  length: 1,
  convRule: rule22
}, {
  start: 7735,
  length: 1,
  convRule: rule23
}, {
  start: 7736,
  length: 1,
  convRule: rule22
}, {
  start: 7737,
  length: 1,
  convRule: rule23
}, {
  start: 7738,
  length: 1,
  convRule: rule22
}, {
  start: 7739,
  length: 1,
  convRule: rule23
}, {
  start: 7740,
  length: 1,
  convRule: rule22
}, {
  start: 7741,
  length: 1,
  convRule: rule23
}, {
  start: 7742,
  length: 1,
  convRule: rule22
}, {
  start: 7743,
  length: 1,
  convRule: rule23
}, {
  start: 7744,
  length: 1,
  convRule: rule22
}, {
  start: 7745,
  length: 1,
  convRule: rule23
}, {
  start: 7746,
  length: 1,
  convRule: rule22
}, {
  start: 7747,
  length: 1,
  convRule: rule23
}, {
  start: 7748,
  length: 1,
  convRule: rule22
}, {
  start: 7749,
  length: 1,
  convRule: rule23
}, {
  start: 7750,
  length: 1,
  convRule: rule22
}, {
  start: 7751,
  length: 1,
  convRule: rule23
}, {
  start: 7752,
  length: 1,
  convRule: rule22
}, {
  start: 7753,
  length: 1,
  convRule: rule23
}, {
  start: 7754,
  length: 1,
  convRule: rule22
}, {
  start: 7755,
  length: 1,
  convRule: rule23
}, {
  start: 7756,
  length: 1,
  convRule: rule22
}, {
  start: 7757,
  length: 1,
  convRule: rule23
}, {
  start: 7758,
  length: 1,
  convRule: rule22
}, {
  start: 7759,
  length: 1,
  convRule: rule23
}, {
  start: 7760,
  length: 1,
  convRule: rule22
}, {
  start: 7761,
  length: 1,
  convRule: rule23
}, {
  start: 7762,
  length: 1,
  convRule: rule22
}, {
  start: 7763,
  length: 1,
  convRule: rule23
}, {
  start: 7764,
  length: 1,
  convRule: rule22
}, {
  start: 7765,
  length: 1,
  convRule: rule23
}, {
  start: 7766,
  length: 1,
  convRule: rule22
}, {
  start: 7767,
  length: 1,
  convRule: rule23
}, {
  start: 7768,
  length: 1,
  convRule: rule22
}, {
  start: 7769,
  length: 1,
  convRule: rule23
}, {
  start: 7770,
  length: 1,
  convRule: rule22
}, {
  start: 7771,
  length: 1,
  convRule: rule23
}, {
  start: 7772,
  length: 1,
  convRule: rule22
}, {
  start: 7773,
  length: 1,
  convRule: rule23
}, {
  start: 7774,
  length: 1,
  convRule: rule22
}, {
  start: 7775,
  length: 1,
  convRule: rule23
}, {
  start: 7776,
  length: 1,
  convRule: rule22
}, {
  start: 7777,
  length: 1,
  convRule: rule23
}, {
  start: 7778,
  length: 1,
  convRule: rule22
}, {
  start: 7779,
  length: 1,
  convRule: rule23
}, {
  start: 7780,
  length: 1,
  convRule: rule22
}, {
  start: 7781,
  length: 1,
  convRule: rule23
}, {
  start: 7782,
  length: 1,
  convRule: rule22
}, {
  start: 7783,
  length: 1,
  convRule: rule23
}, {
  start: 7784,
  length: 1,
  convRule: rule22
}, {
  start: 7785,
  length: 1,
  convRule: rule23
}, {
  start: 7786,
  length: 1,
  convRule: rule22
}, {
  start: 7787,
  length: 1,
  convRule: rule23
}, {
  start: 7788,
  length: 1,
  convRule: rule22
}, {
  start: 7789,
  length: 1,
  convRule: rule23
}, {
  start: 7790,
  length: 1,
  convRule: rule22
}, {
  start: 7791,
  length: 1,
  convRule: rule23
}, {
  start: 7792,
  length: 1,
  convRule: rule22
}, {
  start: 7793,
  length: 1,
  convRule: rule23
}, {
  start: 7794,
  length: 1,
  convRule: rule22
}, {
  start: 7795,
  length: 1,
  convRule: rule23
}, {
  start: 7796,
  length: 1,
  convRule: rule22
}, {
  start: 7797,
  length: 1,
  convRule: rule23
}, {
  start: 7798,
  length: 1,
  convRule: rule22
}, {
  start: 7799,
  length: 1,
  convRule: rule23
}, {
  start: 7800,
  length: 1,
  convRule: rule22
}, {
  start: 7801,
  length: 1,
  convRule: rule23
}, {
  start: 7802,
  length: 1,
  convRule: rule22
}, {
  start: 7803,
  length: 1,
  convRule: rule23
}, {
  start: 7804,
  length: 1,
  convRule: rule22
}, {
  start: 7805,
  length: 1,
  convRule: rule23
}, {
  start: 7806,
  length: 1,
  convRule: rule22
}, {
  start: 7807,
  length: 1,
  convRule: rule23
}, {
  start: 7808,
  length: 1,
  convRule: rule22
}, {
  start: 7809,
  length: 1,
  convRule: rule23
}, {
  start: 7810,
  length: 1,
  convRule: rule22
}, {
  start: 7811,
  length: 1,
  convRule: rule23
}, {
  start: 7812,
  length: 1,
  convRule: rule22
}, {
  start: 7813,
  length: 1,
  convRule: rule23
}, {
  start: 7814,
  length: 1,
  convRule: rule22
}, {
  start: 7815,
  length: 1,
  convRule: rule23
}, {
  start: 7816,
  length: 1,
  convRule: rule22
}, {
  start: 7817,
  length: 1,
  convRule: rule23
}, {
  start: 7818,
  length: 1,
  convRule: rule22
}, {
  start: 7819,
  length: 1,
  convRule: rule23
}, {
  start: 7820,
  length: 1,
  convRule: rule22
}, {
  start: 7821,
  length: 1,
  convRule: rule23
}, {
  start: 7822,
  length: 1,
  convRule: rule22
}, {
  start: 7823,
  length: 1,
  convRule: rule23
}, {
  start: 7824,
  length: 1,
  convRule: rule22
}, {
  start: 7825,
  length: 1,
  convRule: rule23
}, {
  start: 7826,
  length: 1,
  convRule: rule22
}, {
  start: 7827,
  length: 1,
  convRule: rule23
}, {
  start: 7828,
  length: 1,
  convRule: rule22
}, {
  start: 7829,
  length: 1,
  convRule: rule23
}, {
  start: 7830,
  length: 5,
  convRule: rule20
}, {
  start: 7835,
  length: 1,
  convRule: rule141
}, {
  start: 7836,
  length: 2,
  convRule: rule20
}, {
  start: 7838,
  length: 1,
  convRule: rule142
}, {
  start: 7839,
  length: 1,
  convRule: rule20
}, {
  start: 7840,
  length: 1,
  convRule: rule22
}, {
  start: 7841,
  length: 1,
  convRule: rule23
}, {
  start: 7842,
  length: 1,
  convRule: rule22
}, {
  start: 7843,
  length: 1,
  convRule: rule23
}, {
  start: 7844,
  length: 1,
  convRule: rule22
}, {
  start: 7845,
  length: 1,
  convRule: rule23
}, {
  start: 7846,
  length: 1,
  convRule: rule22
}, {
  start: 7847,
  length: 1,
  convRule: rule23
}, {
  start: 7848,
  length: 1,
  convRule: rule22
}, {
  start: 7849,
  length: 1,
  convRule: rule23
}, {
  start: 7850,
  length: 1,
  convRule: rule22
}, {
  start: 7851,
  length: 1,
  convRule: rule23
}, {
  start: 7852,
  length: 1,
  convRule: rule22
}, {
  start: 7853,
  length: 1,
  convRule: rule23
}, {
  start: 7854,
  length: 1,
  convRule: rule22
}, {
  start: 7855,
  length: 1,
  convRule: rule23
}, {
  start: 7856,
  length: 1,
  convRule: rule22
}, {
  start: 7857,
  length: 1,
  convRule: rule23
}, {
  start: 7858,
  length: 1,
  convRule: rule22
}, {
  start: 7859,
  length: 1,
  convRule: rule23
}, {
  start: 7860,
  length: 1,
  convRule: rule22
}, {
  start: 7861,
  length: 1,
  convRule: rule23
}, {
  start: 7862,
  length: 1,
  convRule: rule22
}, {
  start: 7863,
  length: 1,
  convRule: rule23
}, {
  start: 7864,
  length: 1,
  convRule: rule22
}, {
  start: 7865,
  length: 1,
  convRule: rule23
}, {
  start: 7866,
  length: 1,
  convRule: rule22
}, {
  start: 7867,
  length: 1,
  convRule: rule23
}, {
  start: 7868,
  length: 1,
  convRule: rule22
}, {
  start: 7869,
  length: 1,
  convRule: rule23
}, {
  start: 7870,
  length: 1,
  convRule: rule22
}, {
  start: 7871,
  length: 1,
  convRule: rule23
}, {
  start: 7872,
  length: 1,
  convRule: rule22
}, {
  start: 7873,
  length: 1,
  convRule: rule23
}, {
  start: 7874,
  length: 1,
  convRule: rule22
}, {
  start: 7875,
  length: 1,
  convRule: rule23
}, {
  start: 7876,
  length: 1,
  convRule: rule22
}, {
  start: 7877,
  length: 1,
  convRule: rule23
}, {
  start: 7878,
  length: 1,
  convRule: rule22
}, {
  start: 7879,
  length: 1,
  convRule: rule23
}, {
  start: 7880,
  length: 1,
  convRule: rule22
}, {
  start: 7881,
  length: 1,
  convRule: rule23
}, {
  start: 7882,
  length: 1,
  convRule: rule22
}, {
  start: 7883,
  length: 1,
  convRule: rule23
}, {
  start: 7884,
  length: 1,
  convRule: rule22
}, {
  start: 7885,
  length: 1,
  convRule: rule23
}, {
  start: 7886,
  length: 1,
  convRule: rule22
}, {
  start: 7887,
  length: 1,
  convRule: rule23
}, {
  start: 7888,
  length: 1,
  convRule: rule22
}, {
  start: 7889,
  length: 1,
  convRule: rule23
}, {
  start: 7890,
  length: 1,
  convRule: rule22
}, {
  start: 7891,
  length: 1,
  convRule: rule23
}, {
  start: 7892,
  length: 1,
  convRule: rule22
}, {
  start: 7893,
  length: 1,
  convRule: rule23
}, {
  start: 7894,
  length: 1,
  convRule: rule22
}, {
  start: 7895,
  length: 1,
  convRule: rule23
}, {
  start: 7896,
  length: 1,
  convRule: rule22
}, {
  start: 7897,
  length: 1,
  convRule: rule23
}, {
  start: 7898,
  length: 1,
  convRule: rule22
}, {
  start: 7899,
  length: 1,
  convRule: rule23
}, {
  start: 7900,
  length: 1,
  convRule: rule22
}, {
  start: 7901,
  length: 1,
  convRule: rule23
}, {
  start: 7902,
  length: 1,
  convRule: rule22
}, {
  start: 7903,
  length: 1,
  convRule: rule23
}, {
  start: 7904,
  length: 1,
  convRule: rule22
}, {
  start: 7905,
  length: 1,
  convRule: rule23
}, {
  start: 7906,
  length: 1,
  convRule: rule22
}, {
  start: 7907,
  length: 1,
  convRule: rule23
}, {
  start: 7908,
  length: 1,
  convRule: rule22
}, {
  start: 7909,
  length: 1,
  convRule: rule23
}, {
  start: 7910,
  length: 1,
  convRule: rule22
}, {
  start: 7911,
  length: 1,
  convRule: rule23
}, {
  start: 7912,
  length: 1,
  convRule: rule22
}, {
  start: 7913,
  length: 1,
  convRule: rule23
}, {
  start: 7914,
  length: 1,
  convRule: rule22
}, {
  start: 7915,
  length: 1,
  convRule: rule23
}, {
  start: 7916,
  length: 1,
  convRule: rule22
}, {
  start: 7917,
  length: 1,
  convRule: rule23
}, {
  start: 7918,
  length: 1,
  convRule: rule22
}, {
  start: 7919,
  length: 1,
  convRule: rule23
}, {
  start: 7920,
  length: 1,
  convRule: rule22
}, {
  start: 7921,
  length: 1,
  convRule: rule23
}, {
  start: 7922,
  length: 1,
  convRule: rule22
}, {
  start: 7923,
  length: 1,
  convRule: rule23
}, {
  start: 7924,
  length: 1,
  convRule: rule22
}, {
  start: 7925,
  length: 1,
  convRule: rule23
}, {
  start: 7926,
  length: 1,
  convRule: rule22
}, {
  start: 7927,
  length: 1,
  convRule: rule23
}, {
  start: 7928,
  length: 1,
  convRule: rule22
}, {
  start: 7929,
  length: 1,
  convRule: rule23
}, {
  start: 7930,
  length: 1,
  convRule: rule22
}, {
  start: 7931,
  length: 1,
  convRule: rule23
}, {
  start: 7932,
  length: 1,
  convRule: rule22
}, {
  start: 7933,
  length: 1,
  convRule: rule23
}, {
  start: 7934,
  length: 1,
  convRule: rule22
}, {
  start: 7935,
  length: 1,
  convRule: rule23
}, {
  start: 7936,
  length: 8,
  convRule: rule143
}, {
  start: 7944,
  length: 8,
  convRule: rule144
}, {
  start: 7952,
  length: 6,
  convRule: rule143
}, {
  start: 7960,
  length: 6,
  convRule: rule144
}, {
  start: 7968,
  length: 8,
  convRule: rule143
}, {
  start: 7976,
  length: 8,
  convRule: rule144
}, {
  start: 7984,
  length: 8,
  convRule: rule143
}, {
  start: 7992,
  length: 8,
  convRule: rule144
}, {
  start: 8e3,
  length: 6,
  convRule: rule143
}, {
  start: 8008,
  length: 6,
  convRule: rule144
}, {
  start: 8016,
  length: 1,
  convRule: rule20
}, {
  start: 8017,
  length: 1,
  convRule: rule143
}, {
  start: 8018,
  length: 1,
  convRule: rule20
}, {
  start: 8019,
  length: 1,
  convRule: rule143
}, {
  start: 8020,
  length: 1,
  convRule: rule20
}, {
  start: 8021,
  length: 1,
  convRule: rule143
}, {
  start: 8022,
  length: 1,
  convRule: rule20
}, {
  start: 8023,
  length: 1,
  convRule: rule143
}, {
  start: 8025,
  length: 1,
  convRule: rule144
}, {
  start: 8027,
  length: 1,
  convRule: rule144
}, {
  start: 8029,
  length: 1,
  convRule: rule144
}, {
  start: 8031,
  length: 1,
  convRule: rule144
}, {
  start: 8032,
  length: 8,
  convRule: rule143
}, {
  start: 8040,
  length: 8,
  convRule: rule144
}, {
  start: 8048,
  length: 2,
  convRule: rule145
}, {
  start: 8050,
  length: 4,
  convRule: rule146
}, {
  start: 8054,
  length: 2,
  convRule: rule147
}, {
  start: 8056,
  length: 2,
  convRule: rule148
}, {
  start: 8058,
  length: 2,
  convRule: rule149
}, {
  start: 8060,
  length: 2,
  convRule: rule150
}, {
  start: 8064,
  length: 8,
  convRule: rule143
}, {
  start: 8072,
  length: 8,
  convRule: rule151
}, {
  start: 8080,
  length: 8,
  convRule: rule143
}, {
  start: 8088,
  length: 8,
  convRule: rule151
}, {
  start: 8096,
  length: 8,
  convRule: rule143
}, {
  start: 8104,
  length: 8,
  convRule: rule151
}, {
  start: 8112,
  length: 2,
  convRule: rule143
}, {
  start: 8114,
  length: 1,
  convRule: rule20
}, {
  start: 8115,
  length: 1,
  convRule: rule152
}, {
  start: 8116,
  length: 1,
  convRule: rule20
}, {
  start: 8118,
  length: 2,
  convRule: rule20
}, {
  start: 8120,
  length: 2,
  convRule: rule144
}, {
  start: 8122,
  length: 2,
  convRule: rule153
}, {
  start: 8124,
  length: 1,
  convRule: rule154
}, {
  start: 8125,
  length: 1,
  convRule: rule10
}, {
  start: 8126,
  length: 1,
  convRule: rule155
}, {
  start: 8127,
  length: 3,
  convRule: rule10
}, {
  start: 8130,
  length: 1,
  convRule: rule20
}, {
  start: 8131,
  length: 1,
  convRule: rule152
}, {
  start: 8132,
  length: 1,
  convRule: rule20
}, {
  start: 8134,
  length: 2,
  convRule: rule20
}, {
  start: 8136,
  length: 4,
  convRule: rule156
}, {
  start: 8140,
  length: 1,
  convRule: rule154
}, {
  start: 8141,
  length: 3,
  convRule: rule10
}, {
  start: 8144,
  length: 2,
  convRule: rule143
}, {
  start: 8146,
  length: 2,
  convRule: rule20
}, {
  start: 8150,
  length: 2,
  convRule: rule20
}, {
  start: 8152,
  length: 2,
  convRule: rule144
}, {
  start: 8154,
  length: 2,
  convRule: rule157
}, {
  start: 8157,
  length: 3,
  convRule: rule10
}, {
  start: 8160,
  length: 2,
  convRule: rule143
}, {
  start: 8162,
  length: 3,
  convRule: rule20
}, {
  start: 8165,
  length: 1,
  convRule: rule113
}, {
  start: 8166,
  length: 2,
  convRule: rule20
}, {
  start: 8168,
  length: 2,
  convRule: rule144
}, {
  start: 8170,
  length: 2,
  convRule: rule158
}, {
  start: 8172,
  length: 1,
  convRule: rule117
}, {
  start: 8173,
  length: 3,
  convRule: rule10
}, {
  start: 8178,
  length: 1,
  convRule: rule20
}, {
  start: 8179,
  length: 1,
  convRule: rule152
}, {
  start: 8180,
  length: 1,
  convRule: rule20
}, {
  start: 8182,
  length: 2,
  convRule: rule20
}, {
  start: 8184,
  length: 2,
  convRule: rule159
}, {
  start: 8186,
  length: 2,
  convRule: rule160
}, {
  start: 8188,
  length: 1,
  convRule: rule154
}, {
  start: 8189,
  length: 2,
  convRule: rule10
}, {
  start: 8192,
  length: 11,
  convRule: rule1
}, {
  start: 8203,
  length: 5,
  convRule: rule16
}, {
  start: 8208,
  length: 6,
  convRule: rule7
}, {
  start: 8214,
  length: 2,
  convRule: rule2
}, {
  start: 8216,
  length: 1,
  convRule: rule15
}, {
  start: 8217,
  length: 1,
  convRule: rule19
}, {
  start: 8218,
  length: 1,
  convRule: rule4
}, {
  start: 8219,
  length: 2,
  convRule: rule15
}, {
  start: 8221,
  length: 1,
  convRule: rule19
}, {
  start: 8222,
  length: 1,
  convRule: rule4
}, {
  start: 8223,
  length: 1,
  convRule: rule15
}, {
  start: 8224,
  length: 8,
  convRule: rule2
}, {
  start: 8232,
  length: 1,
  convRule: rule161
}, {
  start: 8233,
  length: 1,
  convRule: rule162
}, {
  start: 8234,
  length: 5,
  convRule: rule16
}, {
  start: 8239,
  length: 1,
  convRule: rule1
}, {
  start: 8240,
  length: 9,
  convRule: rule2
}, {
  start: 8249,
  length: 1,
  convRule: rule15
}, {
  start: 8250,
  length: 1,
  convRule: rule19
}, {
  start: 8251,
  length: 4,
  convRule: rule2
}, {
  start: 8255,
  length: 2,
  convRule: rule11
}, {
  start: 8257,
  length: 3,
  convRule: rule2
}, {
  start: 8260,
  length: 1,
  convRule: rule6
}, {
  start: 8261,
  length: 1,
  convRule: rule4
}, {
  start: 8262,
  length: 1,
  convRule: rule5
}, {
  start: 8263,
  length: 11,
  convRule: rule2
}, {
  start: 8274,
  length: 1,
  convRule: rule6
}, {
  start: 8275,
  length: 1,
  convRule: rule2
}, {
  start: 8276,
  length: 1,
  convRule: rule11
}, {
  start: 8277,
  length: 10,
  convRule: rule2
}, {
  start: 8287,
  length: 1,
  convRule: rule1
}, {
  start: 8288,
  length: 5,
  convRule: rule16
}, {
  start: 8294,
  length: 10,
  convRule: rule16
}, {
  start: 8304,
  length: 1,
  convRule: rule17
}, {
  start: 8305,
  length: 1,
  convRule: rule91
}, {
  start: 8308,
  length: 6,
  convRule: rule17
}, {
  start: 8314,
  length: 3,
  convRule: rule6
}, {
  start: 8317,
  length: 1,
  convRule: rule4
}, {
  start: 8318,
  length: 1,
  convRule: rule5
}, {
  start: 8319,
  length: 1,
  convRule: rule91
}, {
  start: 8320,
  length: 10,
  convRule: rule17
}, {
  start: 8330,
  length: 3,
  convRule: rule6
}, {
  start: 8333,
  length: 1,
  convRule: rule4
}, {
  start: 8334,
  length: 1,
  convRule: rule5
}, {
  start: 8336,
  length: 13,
  convRule: rule91
}, {
  start: 8352,
  length: 32,
  convRule: rule3
}, {
  start: 8400,
  length: 13,
  convRule: rule92
}, {
  start: 8413,
  length: 4,
  convRule: rule119
}, {
  start: 8417,
  length: 1,
  convRule: rule92
}, {
  start: 8418,
  length: 3,
  convRule: rule119
}, {
  start: 8421,
  length: 12,
  convRule: rule92
}, {
  start: 8448,
  length: 2,
  convRule: rule13
}, {
  start: 8450,
  length: 1,
  convRule: rule107
}, {
  start: 8451,
  length: 4,
  convRule: rule13
}, {
  start: 8455,
  length: 1,
  convRule: rule107
}, {
  start: 8456,
  length: 2,
  convRule: rule13
}, {
  start: 8458,
  length: 1,
  convRule: rule20
}, {
  start: 8459,
  length: 3,
  convRule: rule107
}, {
  start: 8462,
  length: 2,
  convRule: rule20
}, {
  start: 8464,
  length: 3,
  convRule: rule107
}, {
  start: 8467,
  length: 1,
  convRule: rule20
}, {
  start: 8468,
  length: 1,
  convRule: rule13
}, {
  start: 8469,
  length: 1,
  convRule: rule107
}, {
  start: 8470,
  length: 2,
  convRule: rule13
}, {
  start: 8472,
  length: 1,
  convRule: rule6
}, {
  start: 8473,
  length: 5,
  convRule: rule107
}, {
  start: 8478,
  length: 6,
  convRule: rule13
}, {
  start: 8484,
  length: 1,
  convRule: rule107
}, {
  start: 8485,
  length: 1,
  convRule: rule13
}, {
  start: 8486,
  length: 1,
  convRule: rule163
}, {
  start: 8487,
  length: 1,
  convRule: rule13
}, {
  start: 8488,
  length: 1,
  convRule: rule107
}, {
  start: 8489,
  length: 1,
  convRule: rule13
}, {
  start: 8490,
  length: 1,
  convRule: rule164
}, {
  start: 8491,
  length: 1,
  convRule: rule165
}, {
  start: 8492,
  length: 2,
  convRule: rule107
}, {
  start: 8494,
  length: 1,
  convRule: rule13
}, {
  start: 8495,
  length: 1,
  convRule: rule20
}, {
  start: 8496,
  length: 2,
  convRule: rule107
}, {
  start: 8498,
  length: 1,
  convRule: rule166
}, {
  start: 8499,
  length: 1,
  convRule: rule107
}, {
  start: 8500,
  length: 1,
  convRule: rule20
}, {
  start: 8501,
  length: 4,
  convRule: rule14
}, {
  start: 8505,
  length: 1,
  convRule: rule20
}, {
  start: 8506,
  length: 2,
  convRule: rule13
}, {
  start: 8508,
  length: 2,
  convRule: rule20
}, {
  start: 8510,
  length: 2,
  convRule: rule107
}, {
  start: 8512,
  length: 5,
  convRule: rule6
}, {
  start: 8517,
  length: 1,
  convRule: rule107
}, {
  start: 8518,
  length: 4,
  convRule: rule20
}, {
  start: 8522,
  length: 1,
  convRule: rule13
}, {
  start: 8523,
  length: 1,
  convRule: rule6
}, {
  start: 8524,
  length: 2,
  convRule: rule13
}, {
  start: 8526,
  length: 1,
  convRule: rule167
}, {
  start: 8527,
  length: 1,
  convRule: rule13
}, {
  start: 8528,
  length: 16,
  convRule: rule17
}, {
  start: 8544,
  length: 16,
  convRule: rule168
}, {
  start: 8560,
  length: 16,
  convRule: rule169
}, {
  start: 8576,
  length: 3,
  convRule: rule128
}, {
  start: 8579,
  length: 1,
  convRule: rule22
}, {
  start: 8580,
  length: 1,
  convRule: rule23
}, {
  start: 8581,
  length: 4,
  convRule: rule128
}, {
  start: 8585,
  length: 1,
  convRule: rule17
}, {
  start: 8586,
  length: 2,
  convRule: rule13
}, {
  start: 8592,
  length: 5,
  convRule: rule6
}, {
  start: 8597,
  length: 5,
  convRule: rule13
}, {
  start: 8602,
  length: 2,
  convRule: rule6
}, {
  start: 8604,
  length: 4,
  convRule: rule13
}, {
  start: 8608,
  length: 1,
  convRule: rule6
}, {
  start: 8609,
  length: 2,
  convRule: rule13
}, {
  start: 8611,
  length: 1,
  convRule: rule6
}, {
  start: 8612,
  length: 2,
  convRule: rule13
}, {
  start: 8614,
  length: 1,
  convRule: rule6
}, {
  start: 8615,
  length: 7,
  convRule: rule13
}, {
  start: 8622,
  length: 1,
  convRule: rule6
}, {
  start: 8623,
  length: 31,
  convRule: rule13
}, {
  start: 8654,
  length: 2,
  convRule: rule6
}, {
  start: 8656,
  length: 2,
  convRule: rule13
}, {
  start: 8658,
  length: 1,
  convRule: rule6
}, {
  start: 8659,
  length: 1,
  convRule: rule13
}, {
  start: 8660,
  length: 1,
  convRule: rule6
}, {
  start: 8661,
  length: 31,
  convRule: rule13
}, {
  start: 8692,
  length: 268,
  convRule: rule6
}, {
  start: 8960,
  length: 8,
  convRule: rule13
}, {
  start: 8968,
  length: 1,
  convRule: rule4
}, {
  start: 8969,
  length: 1,
  convRule: rule5
}, {
  start: 8970,
  length: 1,
  convRule: rule4
}, {
  start: 8971,
  length: 1,
  convRule: rule5
}, {
  start: 8972,
  length: 20,
  convRule: rule13
}, {
  start: 8992,
  length: 2,
  convRule: rule6
}, {
  start: 8994,
  length: 7,
  convRule: rule13
}, {
  start: 9001,
  length: 1,
  convRule: rule4
}, {
  start: 9002,
  length: 1,
  convRule: rule5
}, {
  start: 9003,
  length: 81,
  convRule: rule13
}, {
  start: 9084,
  length: 1,
  convRule: rule6
}, {
  start: 9085,
  length: 30,
  convRule: rule13
}, {
  start: 9115,
  length: 25,
  convRule: rule6
}, {
  start: 9140,
  length: 40,
  convRule: rule13
}, {
  start: 9180,
  length: 6,
  convRule: rule6
}, {
  start: 9186,
  length: 69,
  convRule: rule13
}, {
  start: 9280,
  length: 11,
  convRule: rule13
}, {
  start: 9312,
  length: 60,
  convRule: rule17
}, {
  start: 9372,
  length: 26,
  convRule: rule13
}, {
  start: 9398,
  length: 26,
  convRule: rule170
}, {
  start: 9424,
  length: 26,
  convRule: rule171
}, {
  start: 9450,
  length: 22,
  convRule: rule17
}, {
  start: 9472,
  length: 183,
  convRule: rule13
}, {
  start: 9655,
  length: 1,
  convRule: rule6
}, {
  start: 9656,
  length: 9,
  convRule: rule13
}, {
  start: 9665,
  length: 1,
  convRule: rule6
}, {
  start: 9666,
  length: 54,
  convRule: rule13
}, {
  start: 9720,
  length: 8,
  convRule: rule6
}, {
  start: 9728,
  length: 111,
  convRule: rule13
}, {
  start: 9839,
  length: 1,
  convRule: rule6
}, {
  start: 9840,
  length: 248,
  convRule: rule13
}, {
  start: 10088,
  length: 1,
  convRule: rule4
}, {
  start: 10089,
  length: 1,
  convRule: rule5
}, {
  start: 10090,
  length: 1,
  convRule: rule4
}, {
  start: 10091,
  length: 1,
  convRule: rule5
}, {
  start: 10092,
  length: 1,
  convRule: rule4
}, {
  start: 10093,
  length: 1,
  convRule: rule5
}, {
  start: 10094,
  length: 1,
  convRule: rule4
}, {
  start: 10095,
  length: 1,
  convRule: rule5
}, {
  start: 10096,
  length: 1,
  convRule: rule4
}, {
  start: 10097,
  length: 1,
  convRule: rule5
}, {
  start: 10098,
  length: 1,
  convRule: rule4
}, {
  start: 10099,
  length: 1,
  convRule: rule5
}, {
  start: 10100,
  length: 1,
  convRule: rule4
}, {
  start: 10101,
  length: 1,
  convRule: rule5
}, {
  start: 10102,
  length: 30,
  convRule: rule17
}, {
  start: 10132,
  length: 44,
  convRule: rule13
}, {
  start: 10176,
  length: 5,
  convRule: rule6
}, {
  start: 10181,
  length: 1,
  convRule: rule4
}, {
  start: 10182,
  length: 1,
  convRule: rule5
}, {
  start: 10183,
  length: 31,
  convRule: rule6
}, {
  start: 10214,
  length: 1,
  convRule: rule4
}, {
  start: 10215,
  length: 1,
  convRule: rule5
}, {
  start: 10216,
  length: 1,
  convRule: rule4
}, {
  start: 10217,
  length: 1,
  convRule: rule5
}, {
  start: 10218,
  length: 1,
  convRule: rule4
}, {
  start: 10219,
  length: 1,
  convRule: rule5
}, {
  start: 10220,
  length: 1,
  convRule: rule4
}, {
  start: 10221,
  length: 1,
  convRule: rule5
}, {
  start: 10222,
  length: 1,
  convRule: rule4
}, {
  start: 10223,
  length: 1,
  convRule: rule5
}, {
  start: 10224,
  length: 16,
  convRule: rule6
}, {
  start: 10240,
  length: 256,
  convRule: rule13
}, {
  start: 10496,
  length: 131,
  convRule: rule6
}, {
  start: 10627,
  length: 1,
  convRule: rule4
}, {
  start: 10628,
  length: 1,
  convRule: rule5
}, {
  start: 10629,
  length: 1,
  convRule: rule4
}, {
  start: 10630,
  length: 1,
  convRule: rule5
}, {
  start: 10631,
  length: 1,
  convRule: rule4
}, {
  start: 10632,
  length: 1,
  convRule: rule5
}, {
  start: 10633,
  length: 1,
  convRule: rule4
}, {
  start: 10634,
  length: 1,
  convRule: rule5
}, {
  start: 10635,
  length: 1,
  convRule: rule4
}, {
  start: 10636,
  length: 1,
  convRule: rule5
}, {
  start: 10637,
  length: 1,
  convRule: rule4
}, {
  start: 10638,
  length: 1,
  convRule: rule5
}, {
  start: 10639,
  length: 1,
  convRule: rule4
}, {
  start: 10640,
  length: 1,
  convRule: rule5
}, {
  start: 10641,
  length: 1,
  convRule: rule4
}, {
  start: 10642,
  length: 1,
  convRule: rule5
}, {
  start: 10643,
  length: 1,
  convRule: rule4
}, {
  start: 10644,
  length: 1,
  convRule: rule5
}, {
  start: 10645,
  length: 1,
  convRule: rule4
}, {
  start: 10646,
  length: 1,
  convRule: rule5
}, {
  start: 10647,
  length: 1,
  convRule: rule4
}, {
  start: 10648,
  length: 1,
  convRule: rule5
}, {
  start: 10649,
  length: 63,
  convRule: rule6
}, {
  start: 10712,
  length: 1,
  convRule: rule4
}, {
  start: 10713,
  length: 1,
  convRule: rule5
}, {
  start: 10714,
  length: 1,
  convRule: rule4
}, {
  start: 10715,
  length: 1,
  convRule: rule5
}, {
  start: 10716,
  length: 32,
  convRule: rule6
}, {
  start: 10748,
  length: 1,
  convRule: rule4
}, {
  start: 10749,
  length: 1,
  convRule: rule5
}, {
  start: 10750,
  length: 258,
  convRule: rule6
}, {
  start: 11008,
  length: 48,
  convRule: rule13
}, {
  start: 11056,
  length: 21,
  convRule: rule6
}, {
  start: 11077,
  length: 2,
  convRule: rule13
}, {
  start: 11079,
  length: 6,
  convRule: rule6
}, {
  start: 11085,
  length: 39,
  convRule: rule13
}, {
  start: 11126,
  length: 32,
  convRule: rule13
}, {
  start: 11159,
  length: 105,
  convRule: rule13
}, {
  start: 11264,
  length: 47,
  convRule: rule122
}, {
  start: 11312,
  length: 47,
  convRule: rule123
}, {
  start: 11360,
  length: 1,
  convRule: rule22
}, {
  start: 11361,
  length: 1,
  convRule: rule23
}, {
  start: 11362,
  length: 1,
  convRule: rule172
}, {
  start: 11363,
  length: 1,
  convRule: rule173
}, {
  start: 11364,
  length: 1,
  convRule: rule174
}, {
  start: 11365,
  length: 1,
  convRule: rule175
}, {
  start: 11366,
  length: 1,
  convRule: rule176
}, {
  start: 11367,
  length: 1,
  convRule: rule22
}, {
  start: 11368,
  length: 1,
  convRule: rule23
}, {
  start: 11369,
  length: 1,
  convRule: rule22
}, {
  start: 11370,
  length: 1,
  convRule: rule23
}, {
  start: 11371,
  length: 1,
  convRule: rule22
}, {
  start: 11372,
  length: 1,
  convRule: rule23
}, {
  start: 11373,
  length: 1,
  convRule: rule177
}, {
  start: 11374,
  length: 1,
  convRule: rule178
}, {
  start: 11375,
  length: 1,
  convRule: rule179
}, {
  start: 11376,
  length: 1,
  convRule: rule180
}, {
  start: 11377,
  length: 1,
  convRule: rule20
}, {
  start: 11378,
  length: 1,
  convRule: rule22
}, {
  start: 11379,
  length: 1,
  convRule: rule23
}, {
  start: 11380,
  length: 1,
  convRule: rule20
}, {
  start: 11381,
  length: 1,
  convRule: rule22
}, {
  start: 11382,
  length: 1,
  convRule: rule23
}, {
  start: 11383,
  length: 5,
  convRule: rule20
}, {
  start: 11388,
  length: 2,
  convRule: rule91
}, {
  start: 11390,
  length: 2,
  convRule: rule181
}, {
  start: 11392,
  length: 1,
  convRule: rule22
}, {
  start: 11393,
  length: 1,
  convRule: rule23
}, {
  start: 11394,
  length: 1,
  convRule: rule22
}, {
  start: 11395,
  length: 1,
  convRule: rule23
}, {
  start: 11396,
  length: 1,
  convRule: rule22
}, {
  start: 11397,
  length: 1,
  convRule: rule23
}, {
  start: 11398,
  length: 1,
  convRule: rule22
}, {
  start: 11399,
  length: 1,
  convRule: rule23
}, {
  start: 11400,
  length: 1,
  convRule: rule22
}, {
  start: 11401,
  length: 1,
  convRule: rule23
}, {
  start: 11402,
  length: 1,
  convRule: rule22
}, {
  start: 11403,
  length: 1,
  convRule: rule23
}, {
  start: 11404,
  length: 1,
  convRule: rule22
}, {
  start: 11405,
  length: 1,
  convRule: rule23
}, {
  start: 11406,
  length: 1,
  convRule: rule22
}, {
  start: 11407,
  length: 1,
  convRule: rule23
}, {
  start: 11408,
  length: 1,
  convRule: rule22
}, {
  start: 11409,
  length: 1,
  convRule: rule23
}, {
  start: 11410,
  length: 1,
  convRule: rule22
}, {
  start: 11411,
  length: 1,
  convRule: rule23
}, {
  start: 11412,
  length: 1,
  convRule: rule22
}, {
  start: 11413,
  length: 1,
  convRule: rule23
}, {
  start: 11414,
  length: 1,
  convRule: rule22
}, {
  start: 11415,
  length: 1,
  convRule: rule23
}, {
  start: 11416,
  length: 1,
  convRule: rule22
}, {
  start: 11417,
  length: 1,
  convRule: rule23
}, {
  start: 11418,
  length: 1,
  convRule: rule22
}, {
  start: 11419,
  length: 1,
  convRule: rule23
}, {
  start: 11420,
  length: 1,
  convRule: rule22
}, {
  start: 11421,
  length: 1,
  convRule: rule23
}, {
  start: 11422,
  length: 1,
  convRule: rule22
}, {
  start: 11423,
  length: 1,
  convRule: rule23
}, {
  start: 11424,
  length: 1,
  convRule: rule22
}, {
  start: 11425,
  length: 1,
  convRule: rule23
}, {
  start: 11426,
  length: 1,
  convRule: rule22
}, {
  start: 11427,
  length: 1,
  convRule: rule23
}, {
  start: 11428,
  length: 1,
  convRule: rule22
}, {
  start: 11429,
  length: 1,
  convRule: rule23
}, {
  start: 11430,
  length: 1,
  convRule: rule22
}, {
  start: 11431,
  length: 1,
  convRule: rule23
}, {
  start: 11432,
  length: 1,
  convRule: rule22
}, {
  start: 11433,
  length: 1,
  convRule: rule23
}, {
  start: 11434,
  length: 1,
  convRule: rule22
}, {
  start: 11435,
  length: 1,
  convRule: rule23
}, {
  start: 11436,
  length: 1,
  convRule: rule22
}, {
  start: 11437,
  length: 1,
  convRule: rule23
}, {
  start: 11438,
  length: 1,
  convRule: rule22
}, {
  start: 11439,
  length: 1,
  convRule: rule23
}, {
  start: 11440,
  length: 1,
  convRule: rule22
}, {
  start: 11441,
  length: 1,
  convRule: rule23
}, {
  start: 11442,
  length: 1,
  convRule: rule22
}, {
  start: 11443,
  length: 1,
  convRule: rule23
}, {
  start: 11444,
  length: 1,
  convRule: rule22
}, {
  start: 11445,
  length: 1,
  convRule: rule23
}, {
  start: 11446,
  length: 1,
  convRule: rule22
}, {
  start: 11447,
  length: 1,
  convRule: rule23
}, {
  start: 11448,
  length: 1,
  convRule: rule22
}, {
  start: 11449,
  length: 1,
  convRule: rule23
}, {
  start: 11450,
  length: 1,
  convRule: rule22
}, {
  start: 11451,
  length: 1,
  convRule: rule23
}, {
  start: 11452,
  length: 1,
  convRule: rule22
}, {
  start: 11453,
  length: 1,
  convRule: rule23
}, {
  start: 11454,
  length: 1,
  convRule: rule22
}, {
  start: 11455,
  length: 1,
  convRule: rule23
}, {
  start: 11456,
  length: 1,
  convRule: rule22
}, {
  start: 11457,
  length: 1,
  convRule: rule23
}, {
  start: 11458,
  length: 1,
  convRule: rule22
}, {
  start: 11459,
  length: 1,
  convRule: rule23
}, {
  start: 11460,
  length: 1,
  convRule: rule22
}, {
  start: 11461,
  length: 1,
  convRule: rule23
}, {
  start: 11462,
  length: 1,
  convRule: rule22
}, {
  start: 11463,
  length: 1,
  convRule: rule23
}, {
  start: 11464,
  length: 1,
  convRule: rule22
}, {
  start: 11465,
  length: 1,
  convRule: rule23
}, {
  start: 11466,
  length: 1,
  convRule: rule22
}, {
  start: 11467,
  length: 1,
  convRule: rule23
}, {
  start: 11468,
  length: 1,
  convRule: rule22
}, {
  start: 11469,
  length: 1,
  convRule: rule23
}, {
  start: 11470,
  length: 1,
  convRule: rule22
}, {
  start: 11471,
  length: 1,
  convRule: rule23
}, {
  start: 11472,
  length: 1,
  convRule: rule22
}, {
  start: 11473,
  length: 1,
  convRule: rule23
}, {
  start: 11474,
  length: 1,
  convRule: rule22
}, {
  start: 11475,
  length: 1,
  convRule: rule23
}, {
  start: 11476,
  length: 1,
  convRule: rule22
}, {
  start: 11477,
  length: 1,
  convRule: rule23
}, {
  start: 11478,
  length: 1,
  convRule: rule22
}, {
  start: 11479,
  length: 1,
  convRule: rule23
}, {
  start: 11480,
  length: 1,
  convRule: rule22
}, {
  start: 11481,
  length: 1,
  convRule: rule23
}, {
  start: 11482,
  length: 1,
  convRule: rule22
}, {
  start: 11483,
  length: 1,
  convRule: rule23
}, {
  start: 11484,
  length: 1,
  convRule: rule22
}, {
  start: 11485,
  length: 1,
  convRule: rule23
}, {
  start: 11486,
  length: 1,
  convRule: rule22
}, {
  start: 11487,
  length: 1,
  convRule: rule23
}, {
  start: 11488,
  length: 1,
  convRule: rule22
}, {
  start: 11489,
  length: 1,
  convRule: rule23
}, {
  start: 11490,
  length: 1,
  convRule: rule22
}, {
  start: 11491,
  length: 1,
  convRule: rule23
}, {
  start: 11492,
  length: 1,
  convRule: rule20
}, {
  start: 11493,
  length: 6,
  convRule: rule13
}, {
  start: 11499,
  length: 1,
  convRule: rule22
}, {
  start: 11500,
  length: 1,
  convRule: rule23
}, {
  start: 11501,
  length: 1,
  convRule: rule22
}, {
  start: 11502,
  length: 1,
  convRule: rule23
}, {
  start: 11503,
  length: 3,
  convRule: rule92
}, {
  start: 11506,
  length: 1,
  convRule: rule22
}, {
  start: 11507,
  length: 1,
  convRule: rule23
}, {
  start: 11513,
  length: 4,
  convRule: rule2
}, {
  start: 11517,
  length: 1,
  convRule: rule17
}, {
  start: 11518,
  length: 2,
  convRule: rule2
}, {
  start: 11520,
  length: 38,
  convRule: rule182
}, {
  start: 11559,
  length: 1,
  convRule: rule182
}, {
  start: 11565,
  length: 1,
  convRule: rule182
}, {
  start: 11568,
  length: 56,
  convRule: rule14
}, {
  start: 11631,
  length: 1,
  convRule: rule91
}, {
  start: 11632,
  length: 1,
  convRule: rule2
}, {
  start: 11647,
  length: 1,
  convRule: rule92
}, {
  start: 11648,
  length: 23,
  convRule: rule14
}, {
  start: 11680,
  length: 7,
  convRule: rule14
}, {
  start: 11688,
  length: 7,
  convRule: rule14
}, {
  start: 11696,
  length: 7,
  convRule: rule14
}, {
  start: 11704,
  length: 7,
  convRule: rule14
}, {
  start: 11712,
  length: 7,
  convRule: rule14
}, {
  start: 11720,
  length: 7,
  convRule: rule14
}, {
  start: 11728,
  length: 7,
  convRule: rule14
}, {
  start: 11736,
  length: 7,
  convRule: rule14
}, {
  start: 11744,
  length: 32,
  convRule: rule92
}, {
  start: 11776,
  length: 2,
  convRule: rule2
}, {
  start: 11778,
  length: 1,
  convRule: rule15
}, {
  start: 11779,
  length: 1,
  convRule: rule19
}, {
  start: 11780,
  length: 1,
  convRule: rule15
}, {
  start: 11781,
  length: 1,
  convRule: rule19
}, {
  start: 11782,
  length: 3,
  convRule: rule2
}, {
  start: 11785,
  length: 1,
  convRule: rule15
}, {
  start: 11786,
  length: 1,
  convRule: rule19
}, {
  start: 11787,
  length: 1,
  convRule: rule2
}, {
  start: 11788,
  length: 1,
  convRule: rule15
}, {
  start: 11789,
  length: 1,
  convRule: rule19
}, {
  start: 11790,
  length: 9,
  convRule: rule2
}, {
  start: 11799,
  length: 1,
  convRule: rule7
}, {
  start: 11800,
  length: 2,
  convRule: rule2
}, {
  start: 11802,
  length: 1,
  convRule: rule7
}, {
  start: 11803,
  length: 1,
  convRule: rule2
}, {
  start: 11804,
  length: 1,
  convRule: rule15
}, {
  start: 11805,
  length: 1,
  convRule: rule19
}, {
  start: 11806,
  length: 2,
  convRule: rule2
}, {
  start: 11808,
  length: 1,
  convRule: rule15
}, {
  start: 11809,
  length: 1,
  convRule: rule19
}, {
  start: 11810,
  length: 1,
  convRule: rule4
}, {
  start: 11811,
  length: 1,
  convRule: rule5
}, {
  start: 11812,
  length: 1,
  convRule: rule4
}, {
  start: 11813,
  length: 1,
  convRule: rule5
}, {
  start: 11814,
  length: 1,
  convRule: rule4
}, {
  start: 11815,
  length: 1,
  convRule: rule5
}, {
  start: 11816,
  length: 1,
  convRule: rule4
}, {
  start: 11817,
  length: 1,
  convRule: rule5
}, {
  start: 11818,
  length: 5,
  convRule: rule2
}, {
  start: 11823,
  length: 1,
  convRule: rule91
}, {
  start: 11824,
  length: 10,
  convRule: rule2
}, {
  start: 11834,
  length: 2,
  convRule: rule7
}, {
  start: 11836,
  length: 4,
  convRule: rule2
}, {
  start: 11840,
  length: 1,
  convRule: rule7
}, {
  start: 11841,
  length: 1,
  convRule: rule2
}, {
  start: 11842,
  length: 1,
  convRule: rule4
}, {
  start: 11843,
  length: 13,
  convRule: rule2
}, {
  start: 11856,
  length: 2,
  convRule: rule13
}, {
  start: 11858,
  length: 1,
  convRule: rule2
}, {
  start: 11904,
  length: 26,
  convRule: rule13
}, {
  start: 11931,
  length: 89,
  convRule: rule13
}, {
  start: 12032,
  length: 214,
  convRule: rule13
}, {
  start: 12272,
  length: 12,
  convRule: rule13
}, {
  start: 12288,
  length: 1,
  convRule: rule1
}, {
  start: 12289,
  length: 3,
  convRule: rule2
}, {
  start: 12292,
  length: 1,
  convRule: rule13
}, {
  start: 12293,
  length: 1,
  convRule: rule91
}, {
  start: 12294,
  length: 1,
  convRule: rule14
}, {
  start: 12295,
  length: 1,
  convRule: rule128
}, {
  start: 12296,
  length: 1,
  convRule: rule4
}, {
  start: 12297,
  length: 1,
  convRule: rule5
}, {
  start: 12298,
  length: 1,
  convRule: rule4
}, {
  start: 12299,
  length: 1,
  convRule: rule5
}, {
  start: 12300,
  length: 1,
  convRule: rule4
}, {
  start: 12301,
  length: 1,
  convRule: rule5
}, {
  start: 12302,
  length: 1,
  convRule: rule4
}, {
  start: 12303,
  length: 1,
  convRule: rule5
}, {
  start: 12304,
  length: 1,
  convRule: rule4
}, {
  start: 12305,
  length: 1,
  convRule: rule5
}, {
  start: 12306,
  length: 2,
  convRule: rule13
}, {
  start: 12308,
  length: 1,
  convRule: rule4
}, {
  start: 12309,
  length: 1,
  convRule: rule5
}, {
  start: 12310,
  length: 1,
  convRule: rule4
}, {
  start: 12311,
  length: 1,
  convRule: rule5
}, {
  start: 12312,
  length: 1,
  convRule: rule4
}, {
  start: 12313,
  length: 1,
  convRule: rule5
}, {
  start: 12314,
  length: 1,
  convRule: rule4
}, {
  start: 12315,
  length: 1,
  convRule: rule5
}, {
  start: 12316,
  length: 1,
  convRule: rule7
}, {
  start: 12317,
  length: 1,
  convRule: rule4
}, {
  start: 12318,
  length: 2,
  convRule: rule5
}, {
  start: 12320,
  length: 1,
  convRule: rule13
}, {
  start: 12321,
  length: 9,
  convRule: rule128
}, {
  start: 12330,
  length: 4,
  convRule: rule92
}, {
  start: 12334,
  length: 2,
  convRule: rule124
}, {
  start: 12336,
  length: 1,
  convRule: rule7
}, {
  start: 12337,
  length: 5,
  convRule: rule91
}, {
  start: 12342,
  length: 2,
  convRule: rule13
}, {
  start: 12344,
  length: 3,
  convRule: rule128
}, {
  start: 12347,
  length: 1,
  convRule: rule91
}, {
  start: 12348,
  length: 1,
  convRule: rule14
}, {
  start: 12349,
  length: 1,
  convRule: rule2
}, {
  start: 12350,
  length: 2,
  convRule: rule13
}, {
  start: 12353,
  length: 86,
  convRule: rule14
}, {
  start: 12441,
  length: 2,
  convRule: rule92
}, {
  start: 12443,
  length: 2,
  convRule: rule10
}, {
  start: 12445,
  length: 2,
  convRule: rule91
}, {
  start: 12447,
  length: 1,
  convRule: rule14
}, {
  start: 12448,
  length: 1,
  convRule: rule7
}, {
  start: 12449,
  length: 90,
  convRule: rule14
}, {
  start: 12539,
  length: 1,
  convRule: rule2
}, {
  start: 12540,
  length: 3,
  convRule: rule91
}, {
  start: 12543,
  length: 1,
  convRule: rule14
}, {
  start: 12549,
  length: 43,
  convRule: rule14
}, {
  start: 12593,
  length: 94,
  convRule: rule14
}, {
  start: 12688,
  length: 2,
  convRule: rule13
}, {
  start: 12690,
  length: 4,
  convRule: rule17
}, {
  start: 12694,
  length: 10,
  convRule: rule13
}, {
  start: 12704,
  length: 32,
  convRule: rule14
}, {
  start: 12736,
  length: 36,
  convRule: rule13
}, {
  start: 12784,
  length: 16,
  convRule: rule14
}, {
  start: 12800,
  length: 31,
  convRule: rule13
}, {
  start: 12832,
  length: 10,
  convRule: rule17
}, {
  start: 12842,
  length: 30,
  convRule: rule13
}, {
  start: 12872,
  length: 8,
  convRule: rule17
}, {
  start: 12880,
  length: 1,
  convRule: rule13
}, {
  start: 12881,
  length: 15,
  convRule: rule17
}, {
  start: 12896,
  length: 32,
  convRule: rule13
}, {
  start: 12928,
  length: 10,
  convRule: rule17
}, {
  start: 12938,
  length: 39,
  convRule: rule13
}, {
  start: 12977,
  length: 15,
  convRule: rule17
}, {
  start: 12992,
  length: 320,
  convRule: rule13
}, {
  start: 13312,
  length: 6592,
  convRule: rule14
}, {
  start: 19904,
  length: 64,
  convRule: rule13
}, {
  start: 19968,
  length: 20989,
  convRule: rule14
}, {
  start: 40960,
  length: 21,
  convRule: rule14
}, {
  start: 40981,
  length: 1,
  convRule: rule91
}, {
  start: 40982,
  length: 1143,
  convRule: rule14
}, {
  start: 42128,
  length: 55,
  convRule: rule13
}, {
  start: 42192,
  length: 40,
  convRule: rule14
}, {
  start: 42232,
  length: 6,
  convRule: rule91
}, {
  start: 42238,
  length: 2,
  convRule: rule2
}, {
  start: 42240,
  length: 268,
  convRule: rule14
}, {
  start: 42508,
  length: 1,
  convRule: rule91
}, {
  start: 42509,
  length: 3,
  convRule: rule2
}, {
  start: 42512,
  length: 16,
  convRule: rule14
}, {
  start: 42528,
  length: 10,
  convRule: rule8
}, {
  start: 42538,
  length: 2,
  convRule: rule14
}, {
  start: 42560,
  length: 1,
  convRule: rule22
}, {
  start: 42561,
  length: 1,
  convRule: rule23
}, {
  start: 42562,
  length: 1,
  convRule: rule22
}, {
  start: 42563,
  length: 1,
  convRule: rule23
}, {
  start: 42564,
  length: 1,
  convRule: rule22
}, {
  start: 42565,
  length: 1,
  convRule: rule23
}, {
  start: 42566,
  length: 1,
  convRule: rule22
}, {
  start: 42567,
  length: 1,
  convRule: rule23
}, {
  start: 42568,
  length: 1,
  convRule: rule22
}, {
  start: 42569,
  length: 1,
  convRule: rule23
}, {
  start: 42570,
  length: 1,
  convRule: rule22
}, {
  start: 42571,
  length: 1,
  convRule: rule23
}, {
  start: 42572,
  length: 1,
  convRule: rule22
}, {
  start: 42573,
  length: 1,
  convRule: rule23
}, {
  start: 42574,
  length: 1,
  convRule: rule22
}, {
  start: 42575,
  length: 1,
  convRule: rule23
}, {
  start: 42576,
  length: 1,
  convRule: rule22
}, {
  start: 42577,
  length: 1,
  convRule: rule23
}, {
  start: 42578,
  length: 1,
  convRule: rule22
}, {
  start: 42579,
  length: 1,
  convRule: rule23
}, {
  start: 42580,
  length: 1,
  convRule: rule22
}, {
  start: 42581,
  length: 1,
  convRule: rule23
}, {
  start: 42582,
  length: 1,
  convRule: rule22
}, {
  start: 42583,
  length: 1,
  convRule: rule23
}, {
  start: 42584,
  length: 1,
  convRule: rule22
}, {
  start: 42585,
  length: 1,
  convRule: rule23
}, {
  start: 42586,
  length: 1,
  convRule: rule22
}, {
  start: 42587,
  length: 1,
  convRule: rule23
}, {
  start: 42588,
  length: 1,
  convRule: rule22
}, {
  start: 42589,
  length: 1,
  convRule: rule23
}, {
  start: 42590,
  length: 1,
  convRule: rule22
}, {
  start: 42591,
  length: 1,
  convRule: rule23
}, {
  start: 42592,
  length: 1,
  convRule: rule22
}, {
  start: 42593,
  length: 1,
  convRule: rule23
}, {
  start: 42594,
  length: 1,
  convRule: rule22
}, {
  start: 42595,
  length: 1,
  convRule: rule23
}, {
  start: 42596,
  length: 1,
  convRule: rule22
}, {
  start: 42597,
  length: 1,
  convRule: rule23
}, {
  start: 42598,
  length: 1,
  convRule: rule22
}, {
  start: 42599,
  length: 1,
  convRule: rule23
}, {
  start: 42600,
  length: 1,
  convRule: rule22
}, {
  start: 42601,
  length: 1,
  convRule: rule23
}, {
  start: 42602,
  length: 1,
  convRule: rule22
}, {
  start: 42603,
  length: 1,
  convRule: rule23
}, {
  start: 42604,
  length: 1,
  convRule: rule22
}, {
  start: 42605,
  length: 1,
  convRule: rule23
}, {
  start: 42606,
  length: 1,
  convRule: rule14
}, {
  start: 42607,
  length: 1,
  convRule: rule92
}, {
  start: 42608,
  length: 3,
  convRule: rule119
}, {
  start: 42611,
  length: 1,
  convRule: rule2
}, {
  start: 42612,
  length: 10,
  convRule: rule92
}, {
  start: 42622,
  length: 1,
  convRule: rule2
}, {
  start: 42623,
  length: 1,
  convRule: rule91
}, {
  start: 42624,
  length: 1,
  convRule: rule22
}, {
  start: 42625,
  length: 1,
  convRule: rule23
}, {
  start: 42626,
  length: 1,
  convRule: rule22
}, {
  start: 42627,
  length: 1,
  convRule: rule23
}, {
  start: 42628,
  length: 1,
  convRule: rule22
}, {
  start: 42629,
  length: 1,
  convRule: rule23
}, {
  start: 42630,
  length: 1,
  convRule: rule22
}, {
  start: 42631,
  length: 1,
  convRule: rule23
}, {
  start: 42632,
  length: 1,
  convRule: rule22
}, {
  start: 42633,
  length: 1,
  convRule: rule23
}, {
  start: 42634,
  length: 1,
  convRule: rule22
}, {
  start: 42635,
  length: 1,
  convRule: rule23
}, {
  start: 42636,
  length: 1,
  convRule: rule22
}, {
  start: 42637,
  length: 1,
  convRule: rule23
}, {
  start: 42638,
  length: 1,
  convRule: rule22
}, {
  start: 42639,
  length: 1,
  convRule: rule23
}, {
  start: 42640,
  length: 1,
  convRule: rule22
}, {
  start: 42641,
  length: 1,
  convRule: rule23
}, {
  start: 42642,
  length: 1,
  convRule: rule22
}, {
  start: 42643,
  length: 1,
  convRule: rule23
}, {
  start: 42644,
  length: 1,
  convRule: rule22
}, {
  start: 42645,
  length: 1,
  convRule: rule23
}, {
  start: 42646,
  length: 1,
  convRule: rule22
}, {
  start: 42647,
  length: 1,
  convRule: rule23
}, {
  start: 42648,
  length: 1,
  convRule: rule22
}, {
  start: 42649,
  length: 1,
  convRule: rule23
}, {
  start: 42650,
  length: 1,
  convRule: rule22
}, {
  start: 42651,
  length: 1,
  convRule: rule23
}, {
  start: 42652,
  length: 2,
  convRule: rule91
}, {
  start: 42654,
  length: 2,
  convRule: rule92
}, {
  start: 42656,
  length: 70,
  convRule: rule14
}, {
  start: 42726,
  length: 10,
  convRule: rule128
}, {
  start: 42736,
  length: 2,
  convRule: rule92
}, {
  start: 42738,
  length: 6,
  convRule: rule2
}, {
  start: 42752,
  length: 23,
  convRule: rule10
}, {
  start: 42775,
  length: 9,
  convRule: rule91
}, {
  start: 42784,
  length: 2,
  convRule: rule10
}, {
  start: 42786,
  length: 1,
  convRule: rule22
}, {
  start: 42787,
  length: 1,
  convRule: rule23
}, {
  start: 42788,
  length: 1,
  convRule: rule22
}, {
  start: 42789,
  length: 1,
  convRule: rule23
}, {
  start: 42790,
  length: 1,
  convRule: rule22
}, {
  start: 42791,
  length: 1,
  convRule: rule23
}, {
  start: 42792,
  length: 1,
  convRule: rule22
}, {
  start: 42793,
  length: 1,
  convRule: rule23
}, {
  start: 42794,
  length: 1,
  convRule: rule22
}, {
  start: 42795,
  length: 1,
  convRule: rule23
}, {
  start: 42796,
  length: 1,
  convRule: rule22
}, {
  start: 42797,
  length: 1,
  convRule: rule23
}, {
  start: 42798,
  length: 1,
  convRule: rule22
}, {
  start: 42799,
  length: 1,
  convRule: rule23
}, {
  start: 42800,
  length: 2,
  convRule: rule20
}, {
  start: 42802,
  length: 1,
  convRule: rule22
}, {
  start: 42803,
  length: 1,
  convRule: rule23
}, {
  start: 42804,
  length: 1,
  convRule: rule22
}, {
  start: 42805,
  length: 1,
  convRule: rule23
}, {
  start: 42806,
  length: 1,
  convRule: rule22
}, {
  start: 42807,
  length: 1,
  convRule: rule23
}, {
  start: 42808,
  length: 1,
  convRule: rule22
}, {
  start: 42809,
  length: 1,
  convRule: rule23
}, {
  start: 42810,
  length: 1,
  convRule: rule22
}, {
  start: 42811,
  length: 1,
  convRule: rule23
}, {
  start: 42812,
  length: 1,
  convRule: rule22
}, {
  start: 42813,
  length: 1,
  convRule: rule23
}, {
  start: 42814,
  length: 1,
  convRule: rule22
}, {
  start: 42815,
  length: 1,
  convRule: rule23
}, {
  start: 42816,
  length: 1,
  convRule: rule22
}, {
  start: 42817,
  length: 1,
  convRule: rule23
}, {
  start: 42818,
  length: 1,
  convRule: rule22
}, {
  start: 42819,
  length: 1,
  convRule: rule23
}, {
  start: 42820,
  length: 1,
  convRule: rule22
}, {
  start: 42821,
  length: 1,
  convRule: rule23
}, {
  start: 42822,
  length: 1,
  convRule: rule22
}, {
  start: 42823,
  length: 1,
  convRule: rule23
}, {
  start: 42824,
  length: 1,
  convRule: rule22
}, {
  start: 42825,
  length: 1,
  convRule: rule23
}, {
  start: 42826,
  length: 1,
  convRule: rule22
}, {
  start: 42827,
  length: 1,
  convRule: rule23
}, {
  start: 42828,
  length: 1,
  convRule: rule22
}, {
  start: 42829,
  length: 1,
  convRule: rule23
}, {
  start: 42830,
  length: 1,
  convRule: rule22
}, {
  start: 42831,
  length: 1,
  convRule: rule23
}, {
  start: 42832,
  length: 1,
  convRule: rule22
}, {
  start: 42833,
  length: 1,
  convRule: rule23
}, {
  start: 42834,
  length: 1,
  convRule: rule22
}, {
  start: 42835,
  length: 1,
  convRule: rule23
}, {
  start: 42836,
  length: 1,
  convRule: rule22
}, {
  start: 42837,
  length: 1,
  convRule: rule23
}, {
  start: 42838,
  length: 1,
  convRule: rule22
}, {
  start: 42839,
  length: 1,
  convRule: rule23
}, {
  start: 42840,
  length: 1,
  convRule: rule22
}, {
  start: 42841,
  length: 1,
  convRule: rule23
}, {
  start: 42842,
  length: 1,
  convRule: rule22
}, {
  start: 42843,
  length: 1,
  convRule: rule23
}, {
  start: 42844,
  length: 1,
  convRule: rule22
}, {
  start: 42845,
  length: 1,
  convRule: rule23
}, {
  start: 42846,
  length: 1,
  convRule: rule22
}, {
  start: 42847,
  length: 1,
  convRule: rule23
}, {
  start: 42848,
  length: 1,
  convRule: rule22
}, {
  start: 42849,
  length: 1,
  convRule: rule23
}, {
  start: 42850,
  length: 1,
  convRule: rule22
}, {
  start: 42851,
  length: 1,
  convRule: rule23
}, {
  start: 42852,
  length: 1,
  convRule: rule22
}, {
  start: 42853,
  length: 1,
  convRule: rule23
}, {
  start: 42854,
  length: 1,
  convRule: rule22
}, {
  start: 42855,
  length: 1,
  convRule: rule23
}, {
  start: 42856,
  length: 1,
  convRule: rule22
}, {
  start: 42857,
  length: 1,
  convRule: rule23
}, {
  start: 42858,
  length: 1,
  convRule: rule22
}, {
  start: 42859,
  length: 1,
  convRule: rule23
}, {
  start: 42860,
  length: 1,
  convRule: rule22
}, {
  start: 42861,
  length: 1,
  convRule: rule23
}, {
  start: 42862,
  length: 1,
  convRule: rule22
}, {
  start: 42863,
  length: 1,
  convRule: rule23
}, {
  start: 42864,
  length: 1,
  convRule: rule91
}, {
  start: 42865,
  length: 8,
  convRule: rule20
}, {
  start: 42873,
  length: 1,
  convRule: rule22
}, {
  start: 42874,
  length: 1,
  convRule: rule23
}, {
  start: 42875,
  length: 1,
  convRule: rule22
}, {
  start: 42876,
  length: 1,
  convRule: rule23
}, {
  start: 42877,
  length: 1,
  convRule: rule183
}, {
  start: 42878,
  length: 1,
  convRule: rule22
}, {
  start: 42879,
  length: 1,
  convRule: rule23
}, {
  start: 42880,
  length: 1,
  convRule: rule22
}, {
  start: 42881,
  length: 1,
  convRule: rule23
}, {
  start: 42882,
  length: 1,
  convRule: rule22
}, {
  start: 42883,
  length: 1,
  convRule: rule23
}, {
  start: 42884,
  length: 1,
  convRule: rule22
}, {
  start: 42885,
  length: 1,
  convRule: rule23
}, {
  start: 42886,
  length: 1,
  convRule: rule22
}, {
  start: 42887,
  length: 1,
  convRule: rule23
}, {
  start: 42888,
  length: 1,
  convRule: rule91
}, {
  start: 42889,
  length: 2,
  convRule: rule10
}, {
  start: 42891,
  length: 1,
  convRule: rule22
}, {
  start: 42892,
  length: 1,
  convRule: rule23
}, {
  start: 42893,
  length: 1,
  convRule: rule184
}, {
  start: 42894,
  length: 1,
  convRule: rule20
}, {
  start: 42895,
  length: 1,
  convRule: rule14
}, {
  start: 42896,
  length: 1,
  convRule: rule22
}, {
  start: 42897,
  length: 1,
  convRule: rule23
}, {
  start: 42898,
  length: 1,
  convRule: rule22
}, {
  start: 42899,
  length: 1,
  convRule: rule23
}, {
  start: 42900,
  length: 1,
  convRule: rule185
}, {
  start: 42901,
  length: 1,
  convRule: rule20
}, {
  start: 42902,
  length: 1,
  convRule: rule22
}, {
  start: 42903,
  length: 1,
  convRule: rule23
}, {
  start: 42904,
  length: 1,
  convRule: rule22
}, {
  start: 42905,
  length: 1,
  convRule: rule23
}, {
  start: 42906,
  length: 1,
  convRule: rule22
}, {
  start: 42907,
  length: 1,
  convRule: rule23
}, {
  start: 42908,
  length: 1,
  convRule: rule22
}, {
  start: 42909,
  length: 1,
  convRule: rule23
}, {
  start: 42910,
  length: 1,
  convRule: rule22
}, {
  start: 42911,
  length: 1,
  convRule: rule23
}, {
  start: 42912,
  length: 1,
  convRule: rule22
}, {
  start: 42913,
  length: 1,
  convRule: rule23
}, {
  start: 42914,
  length: 1,
  convRule: rule22
}, {
  start: 42915,
  length: 1,
  convRule: rule23
}, {
  start: 42916,
  length: 1,
  convRule: rule22
}, {
  start: 42917,
  length: 1,
  convRule: rule23
}, {
  start: 42918,
  length: 1,
  convRule: rule22
}, {
  start: 42919,
  length: 1,
  convRule: rule23
}, {
  start: 42920,
  length: 1,
  convRule: rule22
}, {
  start: 42921,
  length: 1,
  convRule: rule23
}, {
  start: 42922,
  length: 1,
  convRule: rule186
}, {
  start: 42923,
  length: 1,
  convRule: rule187
}, {
  start: 42924,
  length: 1,
  convRule: rule188
}, {
  start: 42925,
  length: 1,
  convRule: rule189
}, {
  start: 42926,
  length: 1,
  convRule: rule186
}, {
  start: 42927,
  length: 1,
  convRule: rule20
}, {
  start: 42928,
  length: 1,
  convRule: rule190
}, {
  start: 42929,
  length: 1,
  convRule: rule191
}, {
  start: 42930,
  length: 1,
  convRule: rule192
}, {
  start: 42931,
  length: 1,
  convRule: rule193
}, {
  start: 42932,
  length: 1,
  convRule: rule22
}, {
  start: 42933,
  length: 1,
  convRule: rule23
}, {
  start: 42934,
  length: 1,
  convRule: rule22
}, {
  start: 42935,
  length: 1,
  convRule: rule23
}, {
  start: 42936,
  length: 1,
  convRule: rule22
}, {
  start: 42937,
  length: 1,
  convRule: rule23
}, {
  start: 42938,
  length: 1,
  convRule: rule22
}, {
  start: 42939,
  length: 1,
  convRule: rule23
}, {
  start: 42940,
  length: 1,
  convRule: rule22
}, {
  start: 42941,
  length: 1,
  convRule: rule23
}, {
  start: 42942,
  length: 1,
  convRule: rule22
}, {
  start: 42943,
  length: 1,
  convRule: rule23
}, {
  start: 42946,
  length: 1,
  convRule: rule22
}, {
  start: 42947,
  length: 1,
  convRule: rule23
}, {
  start: 42948,
  length: 1,
  convRule: rule194
}, {
  start: 42949,
  length: 1,
  convRule: rule195
}, {
  start: 42950,
  length: 1,
  convRule: rule196
}, {
  start: 42951,
  length: 1,
  convRule: rule22
}, {
  start: 42952,
  length: 1,
  convRule: rule23
}, {
  start: 42953,
  length: 1,
  convRule: rule22
}, {
  start: 42954,
  length: 1,
  convRule: rule23
}, {
  start: 42997,
  length: 1,
  convRule: rule22
}, {
  start: 42998,
  length: 1,
  convRule: rule23
}, {
  start: 42999,
  length: 1,
  convRule: rule14
}, {
  start: 43e3,
  length: 2,
  convRule: rule91
}, {
  start: 43002,
  length: 1,
  convRule: rule20
}, {
  start: 43003,
  length: 7,
  convRule: rule14
}, {
  start: 43010,
  length: 1,
  convRule: rule92
}, {
  start: 43011,
  length: 3,
  convRule: rule14
}, {
  start: 43014,
  length: 1,
  convRule: rule92
}, {
  start: 43015,
  length: 4,
  convRule: rule14
}, {
  start: 43019,
  length: 1,
  convRule: rule92
}, {
  start: 43020,
  length: 23,
  convRule: rule14
}, {
  start: 43043,
  length: 2,
  convRule: rule124
}, {
  start: 43045,
  length: 2,
  convRule: rule92
}, {
  start: 43047,
  length: 1,
  convRule: rule124
}, {
  start: 43048,
  length: 4,
  convRule: rule13
}, {
  start: 43052,
  length: 1,
  convRule: rule92
}, {
  start: 43056,
  length: 6,
  convRule: rule17
}, {
  start: 43062,
  length: 2,
  convRule: rule13
}, {
  start: 43064,
  length: 1,
  convRule: rule3
}, {
  start: 43065,
  length: 1,
  convRule: rule13
}, {
  start: 43072,
  length: 52,
  convRule: rule14
}, {
  start: 43124,
  length: 4,
  convRule: rule2
}, {
  start: 43136,
  length: 2,
  convRule: rule124
}, {
  start: 43138,
  length: 50,
  convRule: rule14
}, {
  start: 43188,
  length: 16,
  convRule: rule124
}, {
  start: 43204,
  length: 2,
  convRule: rule92
}, {
  start: 43214,
  length: 2,
  convRule: rule2
}, {
  start: 43216,
  length: 10,
  convRule: rule8
}, {
  start: 43232,
  length: 18,
  convRule: rule92
}, {
  start: 43250,
  length: 6,
  convRule: rule14
}, {
  start: 43256,
  length: 3,
  convRule: rule2
}, {
  start: 43259,
  length: 1,
  convRule: rule14
}, {
  start: 43260,
  length: 1,
  convRule: rule2
}, {
  start: 43261,
  length: 2,
  convRule: rule14
}, {
  start: 43263,
  length: 1,
  convRule: rule92
}, {
  start: 43264,
  length: 10,
  convRule: rule8
}, {
  start: 43274,
  length: 28,
  convRule: rule14
}, {
  start: 43302,
  length: 8,
  convRule: rule92
}, {
  start: 43310,
  length: 2,
  convRule: rule2
}, {
  start: 43312,
  length: 23,
  convRule: rule14
}, {
  start: 43335,
  length: 11,
  convRule: rule92
}, {
  start: 43346,
  length: 2,
  convRule: rule124
}, {
  start: 43359,
  length: 1,
  convRule: rule2
}, {
  start: 43360,
  length: 29,
  convRule: rule14
}, {
  start: 43392,
  length: 3,
  convRule: rule92
}, {
  start: 43395,
  length: 1,
  convRule: rule124
}, {
  start: 43396,
  length: 47,
  convRule: rule14
}, {
  start: 43443,
  length: 1,
  convRule: rule92
}, {
  start: 43444,
  length: 2,
  convRule: rule124
}, {
  start: 43446,
  length: 4,
  convRule: rule92
}, {
  start: 43450,
  length: 2,
  convRule: rule124
}, {
  start: 43452,
  length: 2,
  convRule: rule92
}, {
  start: 43454,
  length: 3,
  convRule: rule124
}, {
  start: 43457,
  length: 13,
  convRule: rule2
}, {
  start: 43471,
  length: 1,
  convRule: rule91
}, {
  start: 43472,
  length: 10,
  convRule: rule8
}, {
  start: 43486,
  length: 2,
  convRule: rule2
}, {
  start: 43488,
  length: 5,
  convRule: rule14
}, {
  start: 43493,
  length: 1,
  convRule: rule92
}, {
  start: 43494,
  length: 1,
  convRule: rule91
}, {
  start: 43495,
  length: 9,
  convRule: rule14
}, {
  start: 43504,
  length: 10,
  convRule: rule8
}, {
  start: 43514,
  length: 5,
  convRule: rule14
}, {
  start: 43520,
  length: 41,
  convRule: rule14
}, {
  start: 43561,
  length: 6,
  convRule: rule92
}, {
  start: 43567,
  length: 2,
  convRule: rule124
}, {
  start: 43569,
  length: 2,
  convRule: rule92
}, {
  start: 43571,
  length: 2,
  convRule: rule124
}, {
  start: 43573,
  length: 2,
  convRule: rule92
}, {
  start: 43584,
  length: 3,
  convRule: rule14
}, {
  start: 43587,
  length: 1,
  convRule: rule92
}, {
  start: 43588,
  length: 8,
  convRule: rule14
}, {
  start: 43596,
  length: 1,
  convRule: rule92
}, {
  start: 43597,
  length: 1,
  convRule: rule124
}, {
  start: 43600,
  length: 10,
  convRule: rule8
}, {
  start: 43612,
  length: 4,
  convRule: rule2
}, {
  start: 43616,
  length: 16,
  convRule: rule14
}, {
  start: 43632,
  length: 1,
  convRule: rule91
}, {
  start: 43633,
  length: 6,
  convRule: rule14
}, {
  start: 43639,
  length: 3,
  convRule: rule13
}, {
  start: 43642,
  length: 1,
  convRule: rule14
}, {
  start: 43643,
  length: 1,
  convRule: rule124
}, {
  start: 43644,
  length: 1,
  convRule: rule92
}, {
  start: 43645,
  length: 1,
  convRule: rule124
}, {
  start: 43646,
  length: 50,
  convRule: rule14
}, {
  start: 43696,
  length: 1,
  convRule: rule92
}, {
  start: 43697,
  length: 1,
  convRule: rule14
}, {
  start: 43698,
  length: 3,
  convRule: rule92
}, {
  start: 43701,
  length: 2,
  convRule: rule14
}, {
  start: 43703,
  length: 2,
  convRule: rule92
}, {
  start: 43705,
  length: 5,
  convRule: rule14
}, {
  start: 43710,
  length: 2,
  convRule: rule92
}, {
  start: 43712,
  length: 1,
  convRule: rule14
}, {
  start: 43713,
  length: 1,
  convRule: rule92
}, {
  start: 43714,
  length: 1,
  convRule: rule14
}, {
  start: 43739,
  length: 2,
  convRule: rule14
}, {
  start: 43741,
  length: 1,
  convRule: rule91
}, {
  start: 43742,
  length: 2,
  convRule: rule2
}, {
  start: 43744,
  length: 11,
  convRule: rule14
}, {
  start: 43755,
  length: 1,
  convRule: rule124
}, {
  start: 43756,
  length: 2,
  convRule: rule92
}, {
  start: 43758,
  length: 2,
  convRule: rule124
}, {
  start: 43760,
  length: 2,
  convRule: rule2
}, {
  start: 43762,
  length: 1,
  convRule: rule14
}, {
  start: 43763,
  length: 2,
  convRule: rule91
}, {
  start: 43765,
  length: 1,
  convRule: rule124
}, {
  start: 43766,
  length: 1,
  convRule: rule92
}, {
  start: 43777,
  length: 6,
  convRule: rule14
}, {
  start: 43785,
  length: 6,
  convRule: rule14
}, {
  start: 43793,
  length: 6,
  convRule: rule14
}, {
  start: 43808,
  length: 7,
  convRule: rule14
}, {
  start: 43816,
  length: 7,
  convRule: rule14
}, {
  start: 43824,
  length: 35,
  convRule: rule20
}, {
  start: 43859,
  length: 1,
  convRule: rule197
}, {
  start: 43860,
  length: 7,
  convRule: rule20
}, {
  start: 43867,
  length: 1,
  convRule: rule10
}, {
  start: 43868,
  length: 4,
  convRule: rule91
}, {
  start: 43872,
  length: 9,
  convRule: rule20
}, {
  start: 43881,
  length: 1,
  convRule: rule91
}, {
  start: 43882,
  length: 2,
  convRule: rule10
}, {
  start: 43888,
  length: 80,
  convRule: rule198
}, {
  start: 43968,
  length: 35,
  convRule: rule14
}, {
  start: 44003,
  length: 2,
  convRule: rule124
}, {
  start: 44005,
  length: 1,
  convRule: rule92
}, {
  start: 44006,
  length: 2,
  convRule: rule124
}, {
  start: 44008,
  length: 1,
  convRule: rule92
}, {
  start: 44009,
  length: 2,
  convRule: rule124
}, {
  start: 44011,
  length: 1,
  convRule: rule2
}, {
  start: 44012,
  length: 1,
  convRule: rule124
}, {
  start: 44013,
  length: 1,
  convRule: rule92
}, {
  start: 44016,
  length: 10,
  convRule: rule8
}, {
  start: 44032,
  length: 11172,
  convRule: rule14
}, {
  start: 55216,
  length: 23,
  convRule: rule14
}, {
  start: 55243,
  length: 49,
  convRule: rule14
}, {
  start: 55296,
  length: 896,
  convRule: rule199
}, {
  start: 56192,
  length: 128,
  convRule: rule199
}, {
  start: 56320,
  length: 1024,
  convRule: rule199
}, {
  start: 57344,
  length: 6400,
  convRule: rule200
}, {
  start: 63744,
  length: 366,
  convRule: rule14
}, {
  start: 64112,
  length: 106,
  convRule: rule14
}, {
  start: 64256,
  length: 7,
  convRule: rule20
}, {
  start: 64275,
  length: 5,
  convRule: rule20
}, {
  start: 64285,
  length: 1,
  convRule: rule14
}, {
  start: 64286,
  length: 1,
  convRule: rule92
}, {
  start: 64287,
  length: 10,
  convRule: rule14
}, {
  start: 64297,
  length: 1,
  convRule: rule6
}, {
  start: 64298,
  length: 13,
  convRule: rule14
}, {
  start: 64312,
  length: 5,
  convRule: rule14
}, {
  start: 64318,
  length: 1,
  convRule: rule14
}, {
  start: 64320,
  length: 2,
  convRule: rule14
}, {
  start: 64323,
  length: 2,
  convRule: rule14
}, {
  start: 64326,
  length: 108,
  convRule: rule14
}, {
  start: 64434,
  length: 16,
  convRule: rule10
}, {
  start: 64467,
  length: 363,
  convRule: rule14
}, {
  start: 64830,
  length: 1,
  convRule: rule5
}, {
  start: 64831,
  length: 1,
  convRule: rule4
}, {
  start: 64848,
  length: 64,
  convRule: rule14
}, {
  start: 64914,
  length: 54,
  convRule: rule14
}, {
  start: 65008,
  length: 12,
  convRule: rule14
}, {
  start: 65020,
  length: 1,
  convRule: rule3
}, {
  start: 65021,
  length: 1,
  convRule: rule13
}, {
  start: 65024,
  length: 16,
  convRule: rule92
}, {
  start: 65040,
  length: 7,
  convRule: rule2
}, {
  start: 65047,
  length: 1,
  convRule: rule4
}, {
  start: 65048,
  length: 1,
  convRule: rule5
}, {
  start: 65049,
  length: 1,
  convRule: rule2
}, {
  start: 65056,
  length: 16,
  convRule: rule92
}, {
  start: 65072,
  length: 1,
  convRule: rule2
}, {
  start: 65073,
  length: 2,
  convRule: rule7
}, {
  start: 65075,
  length: 2,
  convRule: rule11
}, {
  start: 65077,
  length: 1,
  convRule: rule4
}, {
  start: 65078,
  length: 1,
  convRule: rule5
}, {
  start: 65079,
  length: 1,
  convRule: rule4
}, {
  start: 65080,
  length: 1,
  convRule: rule5
}, {
  start: 65081,
  length: 1,
  convRule: rule4
}, {
  start: 65082,
  length: 1,
  convRule: rule5
}, {
  start: 65083,
  length: 1,
  convRule: rule4
}, {
  start: 65084,
  length: 1,
  convRule: rule5
}, {
  start: 65085,
  length: 1,
  convRule: rule4
}, {
  start: 65086,
  length: 1,
  convRule: rule5
}, {
  start: 65087,
  length: 1,
  convRule: rule4
}, {
  start: 65088,
  length: 1,
  convRule: rule5
}, {
  start: 65089,
  length: 1,
  convRule: rule4
}, {
  start: 65090,
  length: 1,
  convRule: rule5
}, {
  start: 65091,
  length: 1,
  convRule: rule4
}, {
  start: 65092,
  length: 1,
  convRule: rule5
}, {
  start: 65093,
  length: 2,
  convRule: rule2
}, {
  start: 65095,
  length: 1,
  convRule: rule4
}, {
  start: 65096,
  length: 1,
  convRule: rule5
}, {
  start: 65097,
  length: 4,
  convRule: rule2
}, {
  start: 65101,
  length: 3,
  convRule: rule11
}, {
  start: 65104,
  length: 3,
  convRule: rule2
}, {
  start: 65108,
  length: 4,
  convRule: rule2
}, {
  start: 65112,
  length: 1,
  convRule: rule7
}, {
  start: 65113,
  length: 1,
  convRule: rule4
}, {
  start: 65114,
  length: 1,
  convRule: rule5
}, {
  start: 65115,
  length: 1,
  convRule: rule4
}, {
  start: 65116,
  length: 1,
  convRule: rule5
}, {
  start: 65117,
  length: 1,
  convRule: rule4
}, {
  start: 65118,
  length: 1,
  convRule: rule5
}, {
  start: 65119,
  length: 3,
  convRule: rule2
}, {
  start: 65122,
  length: 1,
  convRule: rule6
}, {
  start: 65123,
  length: 1,
  convRule: rule7
}, {
  start: 65124,
  length: 3,
  convRule: rule6
}, {
  start: 65128,
  length: 1,
  convRule: rule2
}, {
  start: 65129,
  length: 1,
  convRule: rule3
}, {
  start: 65130,
  length: 2,
  convRule: rule2
}, {
  start: 65136,
  length: 5,
  convRule: rule14
}, {
  start: 65142,
  length: 135,
  convRule: rule14
}, {
  start: 65279,
  length: 1,
  convRule: rule16
}, {
  start: 65281,
  length: 3,
  convRule: rule2
}, {
  start: 65284,
  length: 1,
  convRule: rule3
}, {
  start: 65285,
  length: 3,
  convRule: rule2
}, {
  start: 65288,
  length: 1,
  convRule: rule4
}, {
  start: 65289,
  length: 1,
  convRule: rule5
}, {
  start: 65290,
  length: 1,
  convRule: rule2
}, {
  start: 65291,
  length: 1,
  convRule: rule6
}, {
  start: 65292,
  length: 1,
  convRule: rule2
}, {
  start: 65293,
  length: 1,
  convRule: rule7
}, {
  start: 65294,
  length: 2,
  convRule: rule2
}, {
  start: 65296,
  length: 10,
  convRule: rule8
}, {
  start: 65306,
  length: 2,
  convRule: rule2
}, {
  start: 65308,
  length: 3,
  convRule: rule6
}, {
  start: 65311,
  length: 2,
  convRule: rule2
}, {
  start: 65313,
  length: 26,
  convRule: rule9
}, {
  start: 65339,
  length: 1,
  convRule: rule4
}, {
  start: 65340,
  length: 1,
  convRule: rule2
}, {
  start: 65341,
  length: 1,
  convRule: rule5
}, {
  start: 65342,
  length: 1,
  convRule: rule10
}, {
  start: 65343,
  length: 1,
  convRule: rule11
}, {
  start: 65344,
  length: 1,
  convRule: rule10
}, {
  start: 65345,
  length: 26,
  convRule: rule12
}, {
  start: 65371,
  length: 1,
  convRule: rule4
}, {
  start: 65372,
  length: 1,
  convRule: rule6
}, {
  start: 65373,
  length: 1,
  convRule: rule5
}, {
  start: 65374,
  length: 1,
  convRule: rule6
}, {
  start: 65375,
  length: 1,
  convRule: rule4
}, {
  start: 65376,
  length: 1,
  convRule: rule5
}, {
  start: 65377,
  length: 1,
  convRule: rule2
}, {
  start: 65378,
  length: 1,
  convRule: rule4
}, {
  start: 65379,
  length: 1,
  convRule: rule5
}, {
  start: 65380,
  length: 2,
  convRule: rule2
}, {
  start: 65382,
  length: 10,
  convRule: rule14
}, {
  start: 65392,
  length: 1,
  convRule: rule91
}, {
  start: 65393,
  length: 45,
  convRule: rule14
}, {
  start: 65438,
  length: 2,
  convRule: rule91
}, {
  start: 65440,
  length: 31,
  convRule: rule14
}, {
  start: 65474,
  length: 6,
  convRule: rule14
}, {
  start: 65482,
  length: 6,
  convRule: rule14
}, {
  start: 65490,
  length: 6,
  convRule: rule14
}, {
  start: 65498,
  length: 3,
  convRule: rule14
}, {
  start: 65504,
  length: 2,
  convRule: rule3
}, {
  start: 65506,
  length: 1,
  convRule: rule6
}, {
  start: 65507,
  length: 1,
  convRule: rule10
}, {
  start: 65508,
  length: 1,
  convRule: rule13
}, {
  start: 65509,
  length: 2,
  convRule: rule3
}, {
  start: 65512,
  length: 1,
  convRule: rule13
}, {
  start: 65513,
  length: 4,
  convRule: rule6
}, {
  start: 65517,
  length: 2,
  convRule: rule13
}, {
  start: 65529,
  length: 3,
  convRule: rule16
}, {
  start: 65532,
  length: 2,
  convRule: rule13
}, {
  start: 65536,
  length: 12,
  convRule: rule14
}, {
  start: 65549,
  length: 26,
  convRule: rule14
}, {
  start: 65576,
  length: 19,
  convRule: rule14
}, {
  start: 65596,
  length: 2,
  convRule: rule14
}, {
  start: 65599,
  length: 15,
  convRule: rule14
}, {
  start: 65616,
  length: 14,
  convRule: rule14
}, {
  start: 65664,
  length: 123,
  convRule: rule14
}, {
  start: 65792,
  length: 3,
  convRule: rule2
}, {
  start: 65799,
  length: 45,
  convRule: rule17
}, {
  start: 65847,
  length: 9,
  convRule: rule13
}, {
  start: 65856,
  length: 53,
  convRule: rule128
}, {
  start: 65909,
  length: 4,
  convRule: rule17
}, {
  start: 65913,
  length: 17,
  convRule: rule13
}, {
  start: 65930,
  length: 2,
  convRule: rule17
}, {
  start: 65932,
  length: 3,
  convRule: rule13
}, {
  start: 65936,
  length: 13,
  convRule: rule13
}, {
  start: 65952,
  length: 1,
  convRule: rule13
}, {
  start: 66e3,
  length: 45,
  convRule: rule13
}, {
  start: 66045,
  length: 1,
  convRule: rule92
}, {
  start: 66176,
  length: 29,
  convRule: rule14
}, {
  start: 66208,
  length: 49,
  convRule: rule14
}, {
  start: 66272,
  length: 1,
  convRule: rule92
}, {
  start: 66273,
  length: 27,
  convRule: rule17
}, {
  start: 66304,
  length: 32,
  convRule: rule14
}, {
  start: 66336,
  length: 4,
  convRule: rule17
}, {
  start: 66349,
  length: 20,
  convRule: rule14
}, {
  start: 66369,
  length: 1,
  convRule: rule128
}, {
  start: 66370,
  length: 8,
  convRule: rule14
}, {
  start: 66378,
  length: 1,
  convRule: rule128
}, {
  start: 66384,
  length: 38,
  convRule: rule14
}, {
  start: 66422,
  length: 5,
  convRule: rule92
}, {
  start: 66432,
  length: 30,
  convRule: rule14
}, {
  start: 66463,
  length: 1,
  convRule: rule2
}, {
  start: 66464,
  length: 36,
  convRule: rule14
}, {
  start: 66504,
  length: 8,
  convRule: rule14
}, {
  start: 66512,
  length: 1,
  convRule: rule2
}, {
  start: 66513,
  length: 5,
  convRule: rule128
}, {
  start: 66560,
  length: 40,
  convRule: rule201
}, {
  start: 66600,
  length: 40,
  convRule: rule202
}, {
  start: 66640,
  length: 78,
  convRule: rule14
}, {
  start: 66720,
  length: 10,
  convRule: rule8
}, {
  start: 66736,
  length: 36,
  convRule: rule201
}, {
  start: 66776,
  length: 36,
  convRule: rule202
}, {
  start: 66816,
  length: 40,
  convRule: rule14
}, {
  start: 66864,
  length: 52,
  convRule: rule14
}, {
  start: 66927,
  length: 1,
  convRule: rule2
}, {
  start: 67072,
  length: 311,
  convRule: rule14
}, {
  start: 67392,
  length: 22,
  convRule: rule14
}, {
  start: 67424,
  length: 8,
  convRule: rule14
}, {
  start: 67584,
  length: 6,
  convRule: rule14
}, {
  start: 67592,
  length: 1,
  convRule: rule14
}, {
  start: 67594,
  length: 44,
  convRule: rule14
}, {
  start: 67639,
  length: 2,
  convRule: rule14
}, {
  start: 67644,
  length: 1,
  convRule: rule14
}, {
  start: 67647,
  length: 23,
  convRule: rule14
}, {
  start: 67671,
  length: 1,
  convRule: rule2
}, {
  start: 67672,
  length: 8,
  convRule: rule17
}, {
  start: 67680,
  length: 23,
  convRule: rule14
}, {
  start: 67703,
  length: 2,
  convRule: rule13
}, {
  start: 67705,
  length: 7,
  convRule: rule17
}, {
  start: 67712,
  length: 31,
  convRule: rule14
}, {
  start: 67751,
  length: 9,
  convRule: rule17
}, {
  start: 67808,
  length: 19,
  convRule: rule14
}, {
  start: 67828,
  length: 2,
  convRule: rule14
}, {
  start: 67835,
  length: 5,
  convRule: rule17
}, {
  start: 67840,
  length: 22,
  convRule: rule14
}, {
  start: 67862,
  length: 6,
  convRule: rule17
}, {
  start: 67871,
  length: 1,
  convRule: rule2
}, {
  start: 67872,
  length: 26,
  convRule: rule14
}, {
  start: 67903,
  length: 1,
  convRule: rule2
}, {
  start: 67968,
  length: 56,
  convRule: rule14
}, {
  start: 68028,
  length: 2,
  convRule: rule17
}, {
  start: 68030,
  length: 2,
  convRule: rule14
}, {
  start: 68032,
  length: 16,
  convRule: rule17
}, {
  start: 68050,
  length: 46,
  convRule: rule17
}, {
  start: 68096,
  length: 1,
  convRule: rule14
}, {
  start: 68097,
  length: 3,
  convRule: rule92
}, {
  start: 68101,
  length: 2,
  convRule: rule92
}, {
  start: 68108,
  length: 4,
  convRule: rule92
}, {
  start: 68112,
  length: 4,
  convRule: rule14
}, {
  start: 68117,
  length: 3,
  convRule: rule14
}, {
  start: 68121,
  length: 29,
  convRule: rule14
}, {
  start: 68152,
  length: 3,
  convRule: rule92
}, {
  start: 68159,
  length: 1,
  convRule: rule92
}, {
  start: 68160,
  length: 9,
  convRule: rule17
}, {
  start: 68176,
  length: 9,
  convRule: rule2
}, {
  start: 68192,
  length: 29,
  convRule: rule14
}, {
  start: 68221,
  length: 2,
  convRule: rule17
}, {
  start: 68223,
  length: 1,
  convRule: rule2
}, {
  start: 68224,
  length: 29,
  convRule: rule14
}, {
  start: 68253,
  length: 3,
  convRule: rule17
}, {
  start: 68288,
  length: 8,
  convRule: rule14
}, {
  start: 68296,
  length: 1,
  convRule: rule13
}, {
  start: 68297,
  length: 28,
  convRule: rule14
}, {
  start: 68325,
  length: 2,
  convRule: rule92
}, {
  start: 68331,
  length: 5,
  convRule: rule17
}, {
  start: 68336,
  length: 7,
  convRule: rule2
}, {
  start: 68352,
  length: 54,
  convRule: rule14
}, {
  start: 68409,
  length: 7,
  convRule: rule2
}, {
  start: 68416,
  length: 22,
  convRule: rule14
}, {
  start: 68440,
  length: 8,
  convRule: rule17
}, {
  start: 68448,
  length: 19,
  convRule: rule14
}, {
  start: 68472,
  length: 8,
  convRule: rule17
}, {
  start: 68480,
  length: 18,
  convRule: rule14
}, {
  start: 68505,
  length: 4,
  convRule: rule2
}, {
  start: 68521,
  length: 7,
  convRule: rule17
}, {
  start: 68608,
  length: 73,
  convRule: rule14
}, {
  start: 68736,
  length: 51,
  convRule: rule97
}, {
  start: 68800,
  length: 51,
  convRule: rule102
}, {
  start: 68858,
  length: 6,
  convRule: rule17
}, {
  start: 68864,
  length: 36,
  convRule: rule14
}, {
  start: 68900,
  length: 4,
  convRule: rule92
}, {
  start: 68912,
  length: 10,
  convRule: rule8
}, {
  start: 69216,
  length: 31,
  convRule: rule17
}, {
  start: 69248,
  length: 42,
  convRule: rule14
}, {
  start: 69291,
  length: 2,
  convRule: rule92
}, {
  start: 69293,
  length: 1,
  convRule: rule7
}, {
  start: 69296,
  length: 2,
  convRule: rule14
}, {
  start: 69376,
  length: 29,
  convRule: rule14
}, {
  start: 69405,
  length: 10,
  convRule: rule17
}, {
  start: 69415,
  length: 1,
  convRule: rule14
}, {
  start: 69424,
  length: 22,
  convRule: rule14
}, {
  start: 69446,
  length: 11,
  convRule: rule92
}, {
  start: 69457,
  length: 4,
  convRule: rule17
}, {
  start: 69461,
  length: 5,
  convRule: rule2
}, {
  start: 69552,
  length: 21,
  convRule: rule14
}, {
  start: 69573,
  length: 7,
  convRule: rule17
}, {
  start: 69600,
  length: 23,
  convRule: rule14
}, {
  start: 69632,
  length: 1,
  convRule: rule124
}, {
  start: 69633,
  length: 1,
  convRule: rule92
}, {
  start: 69634,
  length: 1,
  convRule: rule124
}, {
  start: 69635,
  length: 53,
  convRule: rule14
}, {
  start: 69688,
  length: 15,
  convRule: rule92
}, {
  start: 69703,
  length: 7,
  convRule: rule2
}, {
  start: 69714,
  length: 20,
  convRule: rule17
}, {
  start: 69734,
  length: 10,
  convRule: rule8
}, {
  start: 69759,
  length: 3,
  convRule: rule92
}, {
  start: 69762,
  length: 1,
  convRule: rule124
}, {
  start: 69763,
  length: 45,
  convRule: rule14
}, {
  start: 69808,
  length: 3,
  convRule: rule124
}, {
  start: 69811,
  length: 4,
  convRule: rule92
}, {
  start: 69815,
  length: 2,
  convRule: rule124
}, {
  start: 69817,
  length: 2,
  convRule: rule92
}, {
  start: 69819,
  length: 2,
  convRule: rule2
}, {
  start: 69821,
  length: 1,
  convRule: rule16
}, {
  start: 69822,
  length: 4,
  convRule: rule2
}, {
  start: 69837,
  length: 1,
  convRule: rule16
}, {
  start: 69840,
  length: 25,
  convRule: rule14
}, {
  start: 69872,
  length: 10,
  convRule: rule8
}, {
  start: 69888,
  length: 3,
  convRule: rule92
}, {
  start: 69891,
  length: 36,
  convRule: rule14
}, {
  start: 69927,
  length: 5,
  convRule: rule92
}, {
  start: 69932,
  length: 1,
  convRule: rule124
}, {
  start: 69933,
  length: 8,
  convRule: rule92
}, {
  start: 69942,
  length: 10,
  convRule: rule8
}, {
  start: 69952,
  length: 4,
  convRule: rule2
}, {
  start: 69956,
  length: 1,
  convRule: rule14
}, {
  start: 69957,
  length: 2,
  convRule: rule124
}, {
  start: 69959,
  length: 1,
  convRule: rule14
}, {
  start: 69968,
  length: 35,
  convRule: rule14
}, {
  start: 70003,
  length: 1,
  convRule: rule92
}, {
  start: 70004,
  length: 2,
  convRule: rule2
}, {
  start: 70006,
  length: 1,
  convRule: rule14
}, {
  start: 70016,
  length: 2,
  convRule: rule92
}, {
  start: 70018,
  length: 1,
  convRule: rule124
}, {
  start: 70019,
  length: 48,
  convRule: rule14
}, {
  start: 70067,
  length: 3,
  convRule: rule124
}, {
  start: 70070,
  length: 9,
  convRule: rule92
}, {
  start: 70079,
  length: 2,
  convRule: rule124
}, {
  start: 70081,
  length: 4,
  convRule: rule14
}, {
  start: 70085,
  length: 4,
  convRule: rule2
}, {
  start: 70089,
  length: 4,
  convRule: rule92
}, {
  start: 70093,
  length: 1,
  convRule: rule2
}, {
  start: 70094,
  length: 1,
  convRule: rule124
}, {
  start: 70095,
  length: 1,
  convRule: rule92
}, {
  start: 70096,
  length: 10,
  convRule: rule8
}, {
  start: 70106,
  length: 1,
  convRule: rule14
}, {
  start: 70107,
  length: 1,
  convRule: rule2
}, {
  start: 70108,
  length: 1,
  convRule: rule14
}, {
  start: 70109,
  length: 3,
  convRule: rule2
}, {
  start: 70113,
  length: 20,
  convRule: rule17
}, {
  start: 70144,
  length: 18,
  convRule: rule14
}, {
  start: 70163,
  length: 25,
  convRule: rule14
}, {
  start: 70188,
  length: 3,
  convRule: rule124
}, {
  start: 70191,
  length: 3,
  convRule: rule92
}, {
  start: 70194,
  length: 2,
  convRule: rule124
}, {
  start: 70196,
  length: 1,
  convRule: rule92
}, {
  start: 70197,
  length: 1,
  convRule: rule124
}, {
  start: 70198,
  length: 2,
  convRule: rule92
}, {
  start: 70200,
  length: 6,
  convRule: rule2
}, {
  start: 70206,
  length: 1,
  convRule: rule92
}, {
  start: 70272,
  length: 7,
  convRule: rule14
}, {
  start: 70280,
  length: 1,
  convRule: rule14
}, {
  start: 70282,
  length: 4,
  convRule: rule14
}, {
  start: 70287,
  length: 15,
  convRule: rule14
}, {
  start: 70303,
  length: 10,
  convRule: rule14
}, {
  start: 70313,
  length: 1,
  convRule: rule2
}, {
  start: 70320,
  length: 47,
  convRule: rule14
}, {
  start: 70367,
  length: 1,
  convRule: rule92
}, {
  start: 70368,
  length: 3,
  convRule: rule124
}, {
  start: 70371,
  length: 8,
  convRule: rule92
}, {
  start: 70384,
  length: 10,
  convRule: rule8
}, {
  start: 70400,
  length: 2,
  convRule: rule92
}, {
  start: 70402,
  length: 2,
  convRule: rule124
}, {
  start: 70405,
  length: 8,
  convRule: rule14
}, {
  start: 70415,
  length: 2,
  convRule: rule14
}, {
  start: 70419,
  length: 22,
  convRule: rule14
}, {
  start: 70442,
  length: 7,
  convRule: rule14
}, {
  start: 70450,
  length: 2,
  convRule: rule14
}, {
  start: 70453,
  length: 5,
  convRule: rule14
}, {
  start: 70459,
  length: 2,
  convRule: rule92
}, {
  start: 70461,
  length: 1,
  convRule: rule14
}, {
  start: 70462,
  length: 2,
  convRule: rule124
}, {
  start: 70464,
  length: 1,
  convRule: rule92
}, {
  start: 70465,
  length: 4,
  convRule: rule124
}, {
  start: 70471,
  length: 2,
  convRule: rule124
}, {
  start: 70475,
  length: 3,
  convRule: rule124
}, {
  start: 70480,
  length: 1,
  convRule: rule14
}, {
  start: 70487,
  length: 1,
  convRule: rule124
}, {
  start: 70493,
  length: 5,
  convRule: rule14
}, {
  start: 70498,
  length: 2,
  convRule: rule124
}, {
  start: 70502,
  length: 7,
  convRule: rule92
}, {
  start: 70512,
  length: 5,
  convRule: rule92
}, {
  start: 70656,
  length: 53,
  convRule: rule14
}, {
  start: 70709,
  length: 3,
  convRule: rule124
}, {
  start: 70712,
  length: 8,
  convRule: rule92
}, {
  start: 70720,
  length: 2,
  convRule: rule124
}, {
  start: 70722,
  length: 3,
  convRule: rule92
}, {
  start: 70725,
  length: 1,
  convRule: rule124
}, {
  start: 70726,
  length: 1,
  convRule: rule92
}, {
  start: 70727,
  length: 4,
  convRule: rule14
}, {
  start: 70731,
  length: 5,
  convRule: rule2
}, {
  start: 70736,
  length: 10,
  convRule: rule8
}, {
  start: 70746,
  length: 2,
  convRule: rule2
}, {
  start: 70749,
  length: 1,
  convRule: rule2
}, {
  start: 70750,
  length: 1,
  convRule: rule92
}, {
  start: 70751,
  length: 3,
  convRule: rule14
}, {
  start: 70784,
  length: 48,
  convRule: rule14
}, {
  start: 70832,
  length: 3,
  convRule: rule124
}, {
  start: 70835,
  length: 6,
  convRule: rule92
}, {
  start: 70841,
  length: 1,
  convRule: rule124
}, {
  start: 70842,
  length: 1,
  convRule: rule92
}, {
  start: 70843,
  length: 4,
  convRule: rule124
}, {
  start: 70847,
  length: 2,
  convRule: rule92
}, {
  start: 70849,
  length: 1,
  convRule: rule124
}, {
  start: 70850,
  length: 2,
  convRule: rule92
}, {
  start: 70852,
  length: 2,
  convRule: rule14
}, {
  start: 70854,
  length: 1,
  convRule: rule2
}, {
  start: 70855,
  length: 1,
  convRule: rule14
}, {
  start: 70864,
  length: 10,
  convRule: rule8
}, {
  start: 71040,
  length: 47,
  convRule: rule14
}, {
  start: 71087,
  length: 3,
  convRule: rule124
}, {
  start: 71090,
  length: 4,
  convRule: rule92
}, {
  start: 71096,
  length: 4,
  convRule: rule124
}, {
  start: 71100,
  length: 2,
  convRule: rule92
}, {
  start: 71102,
  length: 1,
  convRule: rule124
}, {
  start: 71103,
  length: 2,
  convRule: rule92
}, {
  start: 71105,
  length: 23,
  convRule: rule2
}, {
  start: 71128,
  length: 4,
  convRule: rule14
}, {
  start: 71132,
  length: 2,
  convRule: rule92
}, {
  start: 71168,
  length: 48,
  convRule: rule14
}, {
  start: 71216,
  length: 3,
  convRule: rule124
}, {
  start: 71219,
  length: 8,
  convRule: rule92
}, {
  start: 71227,
  length: 2,
  convRule: rule124
}, {
  start: 71229,
  length: 1,
  convRule: rule92
}, {
  start: 71230,
  length: 1,
  convRule: rule124
}, {
  start: 71231,
  length: 2,
  convRule: rule92
}, {
  start: 71233,
  length: 3,
  convRule: rule2
}, {
  start: 71236,
  length: 1,
  convRule: rule14
}, {
  start: 71248,
  length: 10,
  convRule: rule8
}, {
  start: 71264,
  length: 13,
  convRule: rule2
}, {
  start: 71296,
  length: 43,
  convRule: rule14
}, {
  start: 71339,
  length: 1,
  convRule: rule92
}, {
  start: 71340,
  length: 1,
  convRule: rule124
}, {
  start: 71341,
  length: 1,
  convRule: rule92
}, {
  start: 71342,
  length: 2,
  convRule: rule124
}, {
  start: 71344,
  length: 6,
  convRule: rule92
}, {
  start: 71350,
  length: 1,
  convRule: rule124
}, {
  start: 71351,
  length: 1,
  convRule: rule92
}, {
  start: 71352,
  length: 1,
  convRule: rule14
}, {
  start: 71360,
  length: 10,
  convRule: rule8
}, {
  start: 71424,
  length: 27,
  convRule: rule14
}, {
  start: 71453,
  length: 3,
  convRule: rule92
}, {
  start: 71456,
  length: 2,
  convRule: rule124
}, {
  start: 71458,
  length: 4,
  convRule: rule92
}, {
  start: 71462,
  length: 1,
  convRule: rule124
}, {
  start: 71463,
  length: 5,
  convRule: rule92
}, {
  start: 71472,
  length: 10,
  convRule: rule8
}, {
  start: 71482,
  length: 2,
  convRule: rule17
}, {
  start: 71484,
  length: 3,
  convRule: rule2
}, {
  start: 71487,
  length: 1,
  convRule: rule13
}, {
  start: 71680,
  length: 44,
  convRule: rule14
}, {
  start: 71724,
  length: 3,
  convRule: rule124
}, {
  start: 71727,
  length: 9,
  convRule: rule92
}, {
  start: 71736,
  length: 1,
  convRule: rule124
}, {
  start: 71737,
  length: 2,
  convRule: rule92
}, {
  start: 71739,
  length: 1,
  convRule: rule2
}, {
  start: 71840,
  length: 32,
  convRule: rule9
}, {
  start: 71872,
  length: 32,
  convRule: rule12
}, {
  start: 71904,
  length: 10,
  convRule: rule8
}, {
  start: 71914,
  length: 9,
  convRule: rule17
}, {
  start: 71935,
  length: 8,
  convRule: rule14
}, {
  start: 71945,
  length: 1,
  convRule: rule14
}, {
  start: 71948,
  length: 8,
  convRule: rule14
}, {
  start: 71957,
  length: 2,
  convRule: rule14
}, {
  start: 71960,
  length: 24,
  convRule: rule14
}, {
  start: 71984,
  length: 6,
  convRule: rule124
}, {
  start: 71991,
  length: 2,
  convRule: rule124
}, {
  start: 71995,
  length: 2,
  convRule: rule92
}, {
  start: 71997,
  length: 1,
  convRule: rule124
}, {
  start: 71998,
  length: 1,
  convRule: rule92
}, {
  start: 71999,
  length: 1,
  convRule: rule14
}, {
  start: 72e3,
  length: 1,
  convRule: rule124
}, {
  start: 72001,
  length: 1,
  convRule: rule14
}, {
  start: 72002,
  length: 1,
  convRule: rule124
}, {
  start: 72003,
  length: 1,
  convRule: rule92
}, {
  start: 72004,
  length: 3,
  convRule: rule2
}, {
  start: 72016,
  length: 10,
  convRule: rule8
}, {
  start: 72096,
  length: 8,
  convRule: rule14
}, {
  start: 72106,
  length: 39,
  convRule: rule14
}, {
  start: 72145,
  length: 3,
  convRule: rule124
}, {
  start: 72148,
  length: 4,
  convRule: rule92
}, {
  start: 72154,
  length: 2,
  convRule: rule92
}, {
  start: 72156,
  length: 4,
  convRule: rule124
}, {
  start: 72160,
  length: 1,
  convRule: rule92
}, {
  start: 72161,
  length: 1,
  convRule: rule14
}, {
  start: 72162,
  length: 1,
  convRule: rule2
}, {
  start: 72163,
  length: 1,
  convRule: rule14
}, {
  start: 72164,
  length: 1,
  convRule: rule124
}, {
  start: 72192,
  length: 1,
  convRule: rule14
}, {
  start: 72193,
  length: 10,
  convRule: rule92
}, {
  start: 72203,
  length: 40,
  convRule: rule14
}, {
  start: 72243,
  length: 6,
  convRule: rule92
}, {
  start: 72249,
  length: 1,
  convRule: rule124
}, {
  start: 72250,
  length: 1,
  convRule: rule14
}, {
  start: 72251,
  length: 4,
  convRule: rule92
}, {
  start: 72255,
  length: 8,
  convRule: rule2
}, {
  start: 72263,
  length: 1,
  convRule: rule92
}, {
  start: 72272,
  length: 1,
  convRule: rule14
}, {
  start: 72273,
  length: 6,
  convRule: rule92
}, {
  start: 72279,
  length: 2,
  convRule: rule124
}, {
  start: 72281,
  length: 3,
  convRule: rule92
}, {
  start: 72284,
  length: 46,
  convRule: rule14
}, {
  start: 72330,
  length: 13,
  convRule: rule92
}, {
  start: 72343,
  length: 1,
  convRule: rule124
}, {
  start: 72344,
  length: 2,
  convRule: rule92
}, {
  start: 72346,
  length: 3,
  convRule: rule2
}, {
  start: 72349,
  length: 1,
  convRule: rule14
}, {
  start: 72350,
  length: 5,
  convRule: rule2
}, {
  start: 72384,
  length: 57,
  convRule: rule14
}, {
  start: 72704,
  length: 9,
  convRule: rule14
}, {
  start: 72714,
  length: 37,
  convRule: rule14
}, {
  start: 72751,
  length: 1,
  convRule: rule124
}, {
  start: 72752,
  length: 7,
  convRule: rule92
}, {
  start: 72760,
  length: 6,
  convRule: rule92
}, {
  start: 72766,
  length: 1,
  convRule: rule124
}, {
  start: 72767,
  length: 1,
  convRule: rule92
}, {
  start: 72768,
  length: 1,
  convRule: rule14
}, {
  start: 72769,
  length: 5,
  convRule: rule2
}, {
  start: 72784,
  length: 10,
  convRule: rule8
}, {
  start: 72794,
  length: 19,
  convRule: rule17
}, {
  start: 72816,
  length: 2,
  convRule: rule2
}, {
  start: 72818,
  length: 30,
  convRule: rule14
}, {
  start: 72850,
  length: 22,
  convRule: rule92
}, {
  start: 72873,
  length: 1,
  convRule: rule124
}, {
  start: 72874,
  length: 7,
  convRule: rule92
}, {
  start: 72881,
  length: 1,
  convRule: rule124
}, {
  start: 72882,
  length: 2,
  convRule: rule92
}, {
  start: 72884,
  length: 1,
  convRule: rule124
}, {
  start: 72885,
  length: 2,
  convRule: rule92
}, {
  start: 72960,
  length: 7,
  convRule: rule14
}, {
  start: 72968,
  length: 2,
  convRule: rule14
}, {
  start: 72971,
  length: 38,
  convRule: rule14
}, {
  start: 73009,
  length: 6,
  convRule: rule92
}, {
  start: 73018,
  length: 1,
  convRule: rule92
}, {
  start: 73020,
  length: 2,
  convRule: rule92
}, {
  start: 73023,
  length: 7,
  convRule: rule92
}, {
  start: 73030,
  length: 1,
  convRule: rule14
}, {
  start: 73031,
  length: 1,
  convRule: rule92
}, {
  start: 73040,
  length: 10,
  convRule: rule8
}, {
  start: 73056,
  length: 6,
  convRule: rule14
}, {
  start: 73063,
  length: 2,
  convRule: rule14
}, {
  start: 73066,
  length: 32,
  convRule: rule14
}, {
  start: 73098,
  length: 5,
  convRule: rule124
}, {
  start: 73104,
  length: 2,
  convRule: rule92
}, {
  start: 73107,
  length: 2,
  convRule: rule124
}, {
  start: 73109,
  length: 1,
  convRule: rule92
}, {
  start: 73110,
  length: 1,
  convRule: rule124
}, {
  start: 73111,
  length: 1,
  convRule: rule92
}, {
  start: 73112,
  length: 1,
  convRule: rule14
}, {
  start: 73120,
  length: 10,
  convRule: rule8
}, {
  start: 73440,
  length: 19,
  convRule: rule14
}, {
  start: 73459,
  length: 2,
  convRule: rule92
}, {
  start: 73461,
  length: 2,
  convRule: rule124
}, {
  start: 73463,
  length: 2,
  convRule: rule2
}, {
  start: 73648,
  length: 1,
  convRule: rule14
}, {
  start: 73664,
  length: 21,
  convRule: rule17
}, {
  start: 73685,
  length: 8,
  convRule: rule13
}, {
  start: 73693,
  length: 4,
  convRule: rule3
}, {
  start: 73697,
  length: 17,
  convRule: rule13
}, {
  start: 73727,
  length: 1,
  convRule: rule2
}, {
  start: 73728,
  length: 922,
  convRule: rule14
}, {
  start: 74752,
  length: 111,
  convRule: rule128
}, {
  start: 74864,
  length: 5,
  convRule: rule2
}, {
  start: 74880,
  length: 196,
  convRule: rule14
}, {
  start: 77824,
  length: 1071,
  convRule: rule14
}, {
  start: 78896,
  length: 9,
  convRule: rule16
}, {
  start: 82944,
  length: 583,
  convRule: rule14
}, {
  start: 92160,
  length: 569,
  convRule: rule14
}, {
  start: 92736,
  length: 31,
  convRule: rule14
}, {
  start: 92768,
  length: 10,
  convRule: rule8
}, {
  start: 92782,
  length: 2,
  convRule: rule2
}, {
  start: 92880,
  length: 30,
  convRule: rule14
}, {
  start: 92912,
  length: 5,
  convRule: rule92
}, {
  start: 92917,
  length: 1,
  convRule: rule2
}, {
  start: 92928,
  length: 48,
  convRule: rule14
}, {
  start: 92976,
  length: 7,
  convRule: rule92
}, {
  start: 92983,
  length: 5,
  convRule: rule2
}, {
  start: 92988,
  length: 4,
  convRule: rule13
}, {
  start: 92992,
  length: 4,
  convRule: rule91
}, {
  start: 92996,
  length: 1,
  convRule: rule2
}, {
  start: 92997,
  length: 1,
  convRule: rule13
}, {
  start: 93008,
  length: 10,
  convRule: rule8
}, {
  start: 93019,
  length: 7,
  convRule: rule17
}, {
  start: 93027,
  length: 21,
  convRule: rule14
}, {
  start: 93053,
  length: 19,
  convRule: rule14
}, {
  start: 93760,
  length: 32,
  convRule: rule9
}, {
  start: 93792,
  length: 32,
  convRule: rule12
}, {
  start: 93824,
  length: 23,
  convRule: rule17
}, {
  start: 93847,
  length: 4,
  convRule: rule2
}, {
  start: 93952,
  length: 75,
  convRule: rule14
}, {
  start: 94031,
  length: 1,
  convRule: rule92
}, {
  start: 94032,
  length: 1,
  convRule: rule14
}, {
  start: 94033,
  length: 55,
  convRule: rule124
}, {
  start: 94095,
  length: 4,
  convRule: rule92
}, {
  start: 94099,
  length: 13,
  convRule: rule91
}, {
  start: 94176,
  length: 2,
  convRule: rule91
}, {
  start: 94178,
  length: 1,
  convRule: rule2
}, {
  start: 94179,
  length: 1,
  convRule: rule91
}, {
  start: 94180,
  length: 1,
  convRule: rule92
}, {
  start: 94192,
  length: 2,
  convRule: rule124
}, {
  start: 94208,
  length: 6136,
  convRule: rule14
}, {
  start: 100352,
  length: 1238,
  convRule: rule14
}, {
  start: 101632,
  length: 9,
  convRule: rule14
}, {
  start: 110592,
  length: 287,
  convRule: rule14
}, {
  start: 110928,
  length: 3,
  convRule: rule14
}, {
  start: 110948,
  length: 4,
  convRule: rule14
}, {
  start: 110960,
  length: 396,
  convRule: rule14
}, {
  start: 113664,
  length: 107,
  convRule: rule14
}, {
  start: 113776,
  length: 13,
  convRule: rule14
}, {
  start: 113792,
  length: 9,
  convRule: rule14
}, {
  start: 113808,
  length: 10,
  convRule: rule14
}, {
  start: 113820,
  length: 1,
  convRule: rule13
}, {
  start: 113821,
  length: 2,
  convRule: rule92
}, {
  start: 113823,
  length: 1,
  convRule: rule2
}, {
  start: 113824,
  length: 4,
  convRule: rule16
}, {
  start: 118784,
  length: 246,
  convRule: rule13
}, {
  start: 119040,
  length: 39,
  convRule: rule13
}, {
  start: 119081,
  length: 60,
  convRule: rule13
}, {
  start: 119141,
  length: 2,
  convRule: rule124
}, {
  start: 119143,
  length: 3,
  convRule: rule92
}, {
  start: 119146,
  length: 3,
  convRule: rule13
}, {
  start: 119149,
  length: 6,
  convRule: rule124
}, {
  start: 119155,
  length: 8,
  convRule: rule16
}, {
  start: 119163,
  length: 8,
  convRule: rule92
}, {
  start: 119171,
  length: 2,
  convRule: rule13
}, {
  start: 119173,
  length: 7,
  convRule: rule92
}, {
  start: 119180,
  length: 30,
  convRule: rule13
}, {
  start: 119210,
  length: 4,
  convRule: rule92
}, {
  start: 119214,
  length: 59,
  convRule: rule13
}, {
  start: 119296,
  length: 66,
  convRule: rule13
}, {
  start: 119362,
  length: 3,
  convRule: rule92
}, {
  start: 119365,
  length: 1,
  convRule: rule13
}, {
  start: 119520,
  length: 20,
  convRule: rule17
}, {
  start: 119552,
  length: 87,
  convRule: rule13
}, {
  start: 119648,
  length: 25,
  convRule: rule17
}, {
  start: 119808,
  length: 26,
  convRule: rule107
}, {
  start: 119834,
  length: 26,
  convRule: rule20
}, {
  start: 119860,
  length: 26,
  convRule: rule107
}, {
  start: 119886,
  length: 7,
  convRule: rule20
}, {
  start: 119894,
  length: 18,
  convRule: rule20
}, {
  start: 119912,
  length: 26,
  convRule: rule107
}, {
  start: 119938,
  length: 26,
  convRule: rule20
}, {
  start: 119964,
  length: 1,
  convRule: rule107
}, {
  start: 119966,
  length: 2,
  convRule: rule107
}, {
  start: 119970,
  length: 1,
  convRule: rule107
}, {
  start: 119973,
  length: 2,
  convRule: rule107
}, {
  start: 119977,
  length: 4,
  convRule: rule107
}, {
  start: 119982,
  length: 8,
  convRule: rule107
}, {
  start: 119990,
  length: 4,
  convRule: rule20
}, {
  start: 119995,
  length: 1,
  convRule: rule20
}, {
  start: 119997,
  length: 7,
  convRule: rule20
}, {
  start: 120005,
  length: 11,
  convRule: rule20
}, {
  start: 120016,
  length: 26,
  convRule: rule107
}, {
  start: 120042,
  length: 26,
  convRule: rule20
}, {
  start: 120068,
  length: 2,
  convRule: rule107
}, {
  start: 120071,
  length: 4,
  convRule: rule107
}, {
  start: 120077,
  length: 8,
  convRule: rule107
}, {
  start: 120086,
  length: 7,
  convRule: rule107
}, {
  start: 120094,
  length: 26,
  convRule: rule20
}, {
  start: 120120,
  length: 2,
  convRule: rule107
}, {
  start: 120123,
  length: 4,
  convRule: rule107
}, {
  start: 120128,
  length: 5,
  convRule: rule107
}, {
  start: 120134,
  length: 1,
  convRule: rule107
}, {
  start: 120138,
  length: 7,
  convRule: rule107
}, {
  start: 120146,
  length: 26,
  convRule: rule20
}, {
  start: 120172,
  length: 26,
  convRule: rule107
}, {
  start: 120198,
  length: 26,
  convRule: rule20
}, {
  start: 120224,
  length: 26,
  convRule: rule107
}, {
  start: 120250,
  length: 26,
  convRule: rule20
}, {
  start: 120276,
  length: 26,
  convRule: rule107
}, {
  start: 120302,
  length: 26,
  convRule: rule20
}, {
  start: 120328,
  length: 26,
  convRule: rule107
}, {
  start: 120354,
  length: 26,
  convRule: rule20
}, {
  start: 120380,
  length: 26,
  convRule: rule107
}, {
  start: 120406,
  length: 26,
  convRule: rule20
}, {
  start: 120432,
  length: 26,
  convRule: rule107
}, {
  start: 120458,
  length: 28,
  convRule: rule20
}, {
  start: 120488,
  length: 25,
  convRule: rule107
}, {
  start: 120513,
  length: 1,
  convRule: rule6
}, {
  start: 120514,
  length: 25,
  convRule: rule20
}, {
  start: 120539,
  length: 1,
  convRule: rule6
}, {
  start: 120540,
  length: 6,
  convRule: rule20
}, {
  start: 120546,
  length: 25,
  convRule: rule107
}, {
  start: 120571,
  length: 1,
  convRule: rule6
}, {
  start: 120572,
  length: 25,
  convRule: rule20
}, {
  start: 120597,
  length: 1,
  convRule: rule6
}, {
  start: 120598,
  length: 6,
  convRule: rule20
}, {
  start: 120604,
  length: 25,
  convRule: rule107
}, {
  start: 120629,
  length: 1,
  convRule: rule6
}, {
  start: 120630,
  length: 25,
  convRule: rule20
}, {
  start: 120655,
  length: 1,
  convRule: rule6
}, {
  start: 120656,
  length: 6,
  convRule: rule20
}, {
  start: 120662,
  length: 25,
  convRule: rule107
}, {
  start: 120687,
  length: 1,
  convRule: rule6
}, {
  start: 120688,
  length: 25,
  convRule: rule20
}, {
  start: 120713,
  length: 1,
  convRule: rule6
}, {
  start: 120714,
  length: 6,
  convRule: rule20
}, {
  start: 120720,
  length: 25,
  convRule: rule107
}, {
  start: 120745,
  length: 1,
  convRule: rule6
}, {
  start: 120746,
  length: 25,
  convRule: rule20
}, {
  start: 120771,
  length: 1,
  convRule: rule6
}, {
  start: 120772,
  length: 6,
  convRule: rule20
}, {
  start: 120778,
  length: 1,
  convRule: rule107
}, {
  start: 120779,
  length: 1,
  convRule: rule20
}, {
  start: 120782,
  length: 50,
  convRule: rule8
}, {
  start: 120832,
  length: 512,
  convRule: rule13
}, {
  start: 121344,
  length: 55,
  convRule: rule92
}, {
  start: 121399,
  length: 4,
  convRule: rule13
}, {
  start: 121403,
  length: 50,
  convRule: rule92
}, {
  start: 121453,
  length: 8,
  convRule: rule13
}, {
  start: 121461,
  length: 1,
  convRule: rule92
}, {
  start: 121462,
  length: 14,
  convRule: rule13
}, {
  start: 121476,
  length: 1,
  convRule: rule92
}, {
  start: 121477,
  length: 2,
  convRule: rule13
}, {
  start: 121479,
  length: 5,
  convRule: rule2
}, {
  start: 121499,
  length: 5,
  convRule: rule92
}, {
  start: 121505,
  length: 15,
  convRule: rule92
}, {
  start: 122880,
  length: 7,
  convRule: rule92
}, {
  start: 122888,
  length: 17,
  convRule: rule92
}, {
  start: 122907,
  length: 7,
  convRule: rule92
}, {
  start: 122915,
  length: 2,
  convRule: rule92
}, {
  start: 122918,
  length: 5,
  convRule: rule92
}, {
  start: 123136,
  length: 45,
  convRule: rule14
}, {
  start: 123184,
  length: 7,
  convRule: rule92
}, {
  start: 123191,
  length: 7,
  convRule: rule91
}, {
  start: 123200,
  length: 10,
  convRule: rule8
}, {
  start: 123214,
  length: 1,
  convRule: rule14
}, {
  start: 123215,
  length: 1,
  convRule: rule13
}, {
  start: 123584,
  length: 44,
  convRule: rule14
}, {
  start: 123628,
  length: 4,
  convRule: rule92
}, {
  start: 123632,
  length: 10,
  convRule: rule8
}, {
  start: 123647,
  length: 1,
  convRule: rule3
}, {
  start: 124928,
  length: 197,
  convRule: rule14
}, {
  start: 125127,
  length: 9,
  convRule: rule17
}, {
  start: 125136,
  length: 7,
  convRule: rule92
}, {
  start: 125184,
  length: 34,
  convRule: rule203
}, {
  start: 125218,
  length: 34,
  convRule: rule204
}, {
  start: 125252,
  length: 7,
  convRule: rule92
}, {
  start: 125259,
  length: 1,
  convRule: rule91
}, {
  start: 125264,
  length: 10,
  convRule: rule8
}, {
  start: 125278,
  length: 2,
  convRule: rule2
}, {
  start: 126065,
  length: 59,
  convRule: rule17
}, {
  start: 126124,
  length: 1,
  convRule: rule13
}, {
  start: 126125,
  length: 3,
  convRule: rule17
}, {
  start: 126128,
  length: 1,
  convRule: rule3
}, {
  start: 126129,
  length: 4,
  convRule: rule17
}, {
  start: 126209,
  length: 45,
  convRule: rule17
}, {
  start: 126254,
  length: 1,
  convRule: rule13
}, {
  start: 126255,
  length: 15,
  convRule: rule17
}, {
  start: 126464,
  length: 4,
  convRule: rule14
}, {
  start: 126469,
  length: 27,
  convRule: rule14
}, {
  start: 126497,
  length: 2,
  convRule: rule14
}, {
  start: 126500,
  length: 1,
  convRule: rule14
}, {
  start: 126503,
  length: 1,
  convRule: rule14
}, {
  start: 126505,
  length: 10,
  convRule: rule14
}, {
  start: 126516,
  length: 4,
  convRule: rule14
}, {
  start: 126521,
  length: 1,
  convRule: rule14
}, {
  start: 126523,
  length: 1,
  convRule: rule14
}, {
  start: 126530,
  length: 1,
  convRule: rule14
}, {
  start: 126535,
  length: 1,
  convRule: rule14
}, {
  start: 126537,
  length: 1,
  convRule: rule14
}, {
  start: 126539,
  length: 1,
  convRule: rule14
}, {
  start: 126541,
  length: 3,
  convRule: rule14
}, {
  start: 126545,
  length: 2,
  convRule: rule14
}, {
  start: 126548,
  length: 1,
  convRule: rule14
}, {
  start: 126551,
  length: 1,
  convRule: rule14
}, {
  start: 126553,
  length: 1,
  convRule: rule14
}, {
  start: 126555,
  length: 1,
  convRule: rule14
}, {
  start: 126557,
  length: 1,
  convRule: rule14
}, {
  start: 126559,
  length: 1,
  convRule: rule14
}, {
  start: 126561,
  length: 2,
  convRule: rule14
}, {
  start: 126564,
  length: 1,
  convRule: rule14
}, {
  start: 126567,
  length: 4,
  convRule: rule14
}, {
  start: 126572,
  length: 7,
  convRule: rule14
}, {
  start: 126580,
  length: 4,
  convRule: rule14
}, {
  start: 126585,
  length: 4,
  convRule: rule14
}, {
  start: 126590,
  length: 1,
  convRule: rule14
}, {
  start: 126592,
  length: 10,
  convRule: rule14
}, {
  start: 126603,
  length: 17,
  convRule: rule14
}, {
  start: 126625,
  length: 3,
  convRule: rule14
}, {
  start: 126629,
  length: 5,
  convRule: rule14
}, {
  start: 126635,
  length: 17,
  convRule: rule14
}, {
  start: 126704,
  length: 2,
  convRule: rule6
}, {
  start: 126976,
  length: 44,
  convRule: rule13
}, {
  start: 127024,
  length: 100,
  convRule: rule13
}, {
  start: 127136,
  length: 15,
  convRule: rule13
}, {
  start: 127153,
  length: 15,
  convRule: rule13
}, {
  start: 127169,
  length: 15,
  convRule: rule13
}, {
  start: 127185,
  length: 37,
  convRule: rule13
}, {
  start: 127232,
  length: 13,
  convRule: rule17
}, {
  start: 127245,
  length: 161,
  convRule: rule13
}, {
  start: 127462,
  length: 29,
  convRule: rule13
}, {
  start: 127504,
  length: 44,
  convRule: rule13
}, {
  start: 127552,
  length: 9,
  convRule: rule13
}, {
  start: 127568,
  length: 2,
  convRule: rule13
}, {
  start: 127584,
  length: 6,
  convRule: rule13
}, {
  start: 127744,
  length: 251,
  convRule: rule13
}, {
  start: 127995,
  length: 5,
  convRule: rule10
}, {
  start: 128e3,
  length: 728,
  convRule: rule13
}, {
  start: 128736,
  length: 13,
  convRule: rule13
}, {
  start: 128752,
  length: 13,
  convRule: rule13
}, {
  start: 128768,
  length: 116,
  convRule: rule13
}, {
  start: 128896,
  length: 89,
  convRule: rule13
}, {
  start: 128992,
  length: 12,
  convRule: rule13
}, {
  start: 129024,
  length: 12,
  convRule: rule13
}, {
  start: 129040,
  length: 56,
  convRule: rule13
}, {
  start: 129104,
  length: 10,
  convRule: rule13
}, {
  start: 129120,
  length: 40,
  convRule: rule13
}, {
  start: 129168,
  length: 30,
  convRule: rule13
}, {
  start: 129200,
  length: 2,
  convRule: rule13
}, {
  start: 129280,
  length: 121,
  convRule: rule13
}, {
  start: 129402,
  length: 82,
  convRule: rule13
}, {
  start: 129485,
  length: 135,
  convRule: rule13
}, {
  start: 129632,
  length: 14,
  convRule: rule13
}, {
  start: 129648,
  length: 5,
  convRule: rule13
}, {
  start: 129656,
  length: 3,
  convRule: rule13
}, {
  start: 129664,
  length: 7,
  convRule: rule13
}, {
  start: 129680,
  length: 25,
  convRule: rule13
}, {
  start: 129712,
  length: 7,
  convRule: rule13
}, {
  start: 129728,
  length: 3,
  convRule: rule13
}, {
  start: 129744,
  length: 7,
  convRule: rule13
}, {
  start: 129792,
  length: 147,
  convRule: rule13
}, {
  start: 129940,
  length: 55,
  convRule: rule13
}, {
  start: 130032,
  length: 10,
  convRule: rule8
}, {
  start: 131072,
  length: 42718,
  convRule: rule14
}, {
  start: 173824,
  length: 4149,
  convRule: rule14
}, {
  start: 177984,
  length: 222,
  convRule: rule14
}, {
  start: 178208,
  length: 5762,
  convRule: rule14
}, {
  start: 183984,
  length: 7473,
  convRule: rule14
}, {
  start: 194560,
  length: 542,
  convRule: rule14
}, {
  start: 196608,
  length: 4939,
  convRule: rule14
}, {
  start: 917505,
  length: 1,
  convRule: rule16
}, {
  start: 917536,
  length: 96,
  convRule: rule16
}, {
  start: 917760,
  length: 240,
  convRule: rule92
}, {
  start: 983040,
  length: 65534,
  convRule: rule200
}, {
  start: 1048576,
  length: 65534,
  convRule: rule200
}];
var checkAttr = function(categories) {
  return function($$char) {
    var numOfBlocks = function() {
      var $43 = $$char < 256;
      if ($43) {
        return numLat1Blocks;
      }
      ;
      return numBlocks;
    }();
    var maybeConversionRule = getRule(allchars)($$char)(numOfBlocks);
    if (maybeConversionRule instanceof Nothing) {
      return false;
    }
    ;
    if (maybeConversionRule instanceof Just) {
      return isJust(elemIndex2(maybeConversionRule.value0.category)(categories));
    }
    ;
    throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5645, column 5 - line 5647, column 86): " + [maybeConversionRule.constructor.name]);
  };
};
var uIswalpha = /* @__PURE__ */ checkAttr([gencatLL, gencatLU, gencatLT, gencatLM, gencatLO]);
var uIswlower = /* @__PURE__ */ checkAttr([gencatLL]);

// output/Data.CodePoint.Unicode.Internal.Casing/index.js
var compare3 = /* @__PURE__ */ compare(ordInt);
var zeroRec = function(code) {
  return {
    code,
    lower: [],
    title: [],
    upper: [],
    fold: 0,
    foldFull: []
  };
};
var rules = [{
  code: 65,
  lower: [],
  title: [],
  upper: [],
  fold: 97,
  foldFull: [97]
}, {
  code: 66,
  lower: [],
  title: [],
  upper: [],
  fold: 98,
  foldFull: [98]
}, {
  code: 67,
  lower: [],
  title: [],
  upper: [],
  fold: 99,
  foldFull: [99]
}, {
  code: 68,
  lower: [],
  title: [],
  upper: [],
  fold: 100,
  foldFull: [100]
}, {
  code: 69,
  lower: [],
  title: [],
  upper: [],
  fold: 101,
  foldFull: [101]
}, {
  code: 70,
  lower: [],
  title: [],
  upper: [],
  fold: 102,
  foldFull: [102]
}, {
  code: 71,
  lower: [],
  title: [],
  upper: [],
  fold: 103,
  foldFull: [103]
}, {
  code: 72,
  lower: [],
  title: [],
  upper: [],
  fold: 104,
  foldFull: [104]
}, {
  code: 73,
  lower: [],
  title: [],
  upper: [],
  fold: 105,
  foldFull: [105]
}, {
  code: 74,
  lower: [],
  title: [],
  upper: [],
  fold: 106,
  foldFull: [106]
}, {
  code: 75,
  lower: [],
  title: [],
  upper: [],
  fold: 107,
  foldFull: [107]
}, {
  code: 76,
  lower: [],
  title: [],
  upper: [],
  fold: 108,
  foldFull: [108]
}, {
  code: 77,
  lower: [],
  title: [],
  upper: [],
  fold: 109,
  foldFull: [109]
}, {
  code: 78,
  lower: [],
  title: [],
  upper: [],
  fold: 110,
  foldFull: [110]
}, {
  code: 79,
  lower: [],
  title: [],
  upper: [],
  fold: 111,
  foldFull: [111]
}, {
  code: 80,
  lower: [],
  title: [],
  upper: [],
  fold: 112,
  foldFull: [112]
}, {
  code: 81,
  lower: [],
  title: [],
  upper: [],
  fold: 113,
  foldFull: [113]
}, {
  code: 82,
  lower: [],
  title: [],
  upper: [],
  fold: 114,
  foldFull: [114]
}, {
  code: 83,
  lower: [],
  title: [],
  upper: [],
  fold: 115,
  foldFull: [115]
}, {
  code: 84,
  lower: [],
  title: [],
  upper: [],
  fold: 116,
  foldFull: [116]
}, {
  code: 85,
  lower: [],
  title: [],
  upper: [],
  fold: 117,
  foldFull: [117]
}, {
  code: 86,
  lower: [],
  title: [],
  upper: [],
  fold: 118,
  foldFull: [118]
}, {
  code: 87,
  lower: [],
  title: [],
  upper: [],
  fold: 119,
  foldFull: [119]
}, {
  code: 88,
  lower: [],
  title: [],
  upper: [],
  fold: 120,
  foldFull: [120]
}, {
  code: 89,
  lower: [],
  title: [],
  upper: [],
  fold: 121,
  foldFull: [121]
}, {
  code: 90,
  lower: [],
  title: [],
  upper: [],
  fold: 122,
  foldFull: [122]
}, {
  code: 181,
  lower: [],
  title: [],
  upper: [],
  fold: 956,
  foldFull: [956]
}, {
  code: 192,
  lower: [],
  title: [],
  upper: [],
  fold: 224,
  foldFull: [224]
}, {
  code: 193,
  lower: [],
  title: [],
  upper: [],
  fold: 225,
  foldFull: [225]
}, {
  code: 194,
  lower: [],
  title: [],
  upper: [],
  fold: 226,
  foldFull: [226]
}, {
  code: 195,
  lower: [],
  title: [],
  upper: [],
  fold: 227,
  foldFull: [227]
}, {
  code: 196,
  lower: [],
  title: [],
  upper: [],
  fold: 228,
  foldFull: [228]
}, {
  code: 197,
  lower: [],
  title: [],
  upper: [],
  fold: 229,
  foldFull: [229]
}, {
  code: 198,
  lower: [],
  title: [],
  upper: [],
  fold: 230,
  foldFull: [230]
}, {
  code: 199,
  lower: [],
  title: [],
  upper: [],
  fold: 231,
  foldFull: [231]
}, {
  code: 200,
  lower: [],
  title: [],
  upper: [],
  fold: 232,
  foldFull: [232]
}, {
  code: 201,
  lower: [],
  title: [],
  upper: [],
  fold: 233,
  foldFull: [233]
}, {
  code: 202,
  lower: [],
  title: [],
  upper: [],
  fold: 234,
  foldFull: [234]
}, {
  code: 203,
  lower: [],
  title: [],
  upper: [],
  fold: 235,
  foldFull: [235]
}, {
  code: 204,
  lower: [],
  title: [],
  upper: [],
  fold: 236,
  foldFull: [236]
}, {
  code: 205,
  lower: [],
  title: [],
  upper: [],
  fold: 237,
  foldFull: [237]
}, {
  code: 206,
  lower: [],
  title: [],
  upper: [],
  fold: 238,
  foldFull: [238]
}, {
  code: 207,
  lower: [],
  title: [],
  upper: [],
  fold: 239,
  foldFull: [239]
}, {
  code: 208,
  lower: [],
  title: [],
  upper: [],
  fold: 240,
  foldFull: [240]
}, {
  code: 209,
  lower: [],
  title: [],
  upper: [],
  fold: 241,
  foldFull: [241]
}, {
  code: 210,
  lower: [],
  title: [],
  upper: [],
  fold: 242,
  foldFull: [242]
}, {
  code: 211,
  lower: [],
  title: [],
  upper: [],
  fold: 243,
  foldFull: [243]
}, {
  code: 212,
  lower: [],
  title: [],
  upper: [],
  fold: 244,
  foldFull: [244]
}, {
  code: 213,
  lower: [],
  title: [],
  upper: [],
  fold: 245,
  foldFull: [245]
}, {
  code: 214,
  lower: [],
  title: [],
  upper: [],
  fold: 246,
  foldFull: [246]
}, {
  code: 216,
  lower: [],
  title: [],
  upper: [],
  fold: 248,
  foldFull: [248]
}, {
  code: 217,
  lower: [],
  title: [],
  upper: [],
  fold: 249,
  foldFull: [249]
}, {
  code: 218,
  lower: [],
  title: [],
  upper: [],
  fold: 250,
  foldFull: [250]
}, {
  code: 219,
  lower: [],
  title: [],
  upper: [],
  fold: 251,
  foldFull: [251]
}, {
  code: 220,
  lower: [],
  title: [],
  upper: [],
  fold: 252,
  foldFull: [252]
}, {
  code: 221,
  lower: [],
  title: [],
  upper: [],
  fold: 253,
  foldFull: [253]
}, {
  code: 222,
  lower: [],
  title: [],
  upper: [],
  fold: 254,
  foldFull: [254]
}, {
  code: 223,
  lower: [223],
  title: [83, 115],
  upper: [83, 83],
  fold: 0,
  foldFull: [115, 115]
}, {
  code: 223,
  lower: [223],
  title: [83, 115],
  upper: [83, 83],
  fold: 0,
  foldFull: [115, 115]
}, {
  code: 256,
  lower: [],
  title: [],
  upper: [],
  fold: 257,
  foldFull: [257]
}, {
  code: 258,
  lower: [],
  title: [],
  upper: [],
  fold: 259,
  foldFull: [259]
}, {
  code: 260,
  lower: [],
  title: [],
  upper: [],
  fold: 261,
  foldFull: [261]
}, {
  code: 262,
  lower: [],
  title: [],
  upper: [],
  fold: 263,
  foldFull: [263]
}, {
  code: 264,
  lower: [],
  title: [],
  upper: [],
  fold: 265,
  foldFull: [265]
}, {
  code: 266,
  lower: [],
  title: [],
  upper: [],
  fold: 267,
  foldFull: [267]
}, {
  code: 268,
  lower: [],
  title: [],
  upper: [],
  fold: 269,
  foldFull: [269]
}, {
  code: 270,
  lower: [],
  title: [],
  upper: [],
  fold: 271,
  foldFull: [271]
}, {
  code: 272,
  lower: [],
  title: [],
  upper: [],
  fold: 273,
  foldFull: [273]
}, {
  code: 274,
  lower: [],
  title: [],
  upper: [],
  fold: 275,
  foldFull: [275]
}, {
  code: 276,
  lower: [],
  title: [],
  upper: [],
  fold: 277,
  foldFull: [277]
}, {
  code: 278,
  lower: [],
  title: [],
  upper: [],
  fold: 279,
  foldFull: [279]
}, {
  code: 280,
  lower: [],
  title: [],
  upper: [],
  fold: 281,
  foldFull: [281]
}, {
  code: 282,
  lower: [],
  title: [],
  upper: [],
  fold: 283,
  foldFull: [283]
}, {
  code: 284,
  lower: [],
  title: [],
  upper: [],
  fold: 285,
  foldFull: [285]
}, {
  code: 286,
  lower: [],
  title: [],
  upper: [],
  fold: 287,
  foldFull: [287]
}, {
  code: 288,
  lower: [],
  title: [],
  upper: [],
  fold: 289,
  foldFull: [289]
}, {
  code: 290,
  lower: [],
  title: [],
  upper: [],
  fold: 291,
  foldFull: [291]
}, {
  code: 292,
  lower: [],
  title: [],
  upper: [],
  fold: 293,
  foldFull: [293]
}, {
  code: 294,
  lower: [],
  title: [],
  upper: [],
  fold: 295,
  foldFull: [295]
}, {
  code: 296,
  lower: [],
  title: [],
  upper: [],
  fold: 297,
  foldFull: [297]
}, {
  code: 298,
  lower: [],
  title: [],
  upper: [],
  fold: 299,
  foldFull: [299]
}, {
  code: 300,
  lower: [],
  title: [],
  upper: [],
  fold: 301,
  foldFull: [301]
}, {
  code: 302,
  lower: [],
  title: [],
  upper: [],
  fold: 303,
  foldFull: [303]
}, {
  code: 304,
  lower: [105, 775],
  title: [304],
  upper: [304],
  fold: 0,
  foldFull: [105, 775]
}, {
  code: 304,
  lower: [105, 775],
  title: [304],
  upper: [304],
  fold: 0,
  foldFull: [105, 775]
}, {
  code: 306,
  lower: [],
  title: [],
  upper: [],
  fold: 307,
  foldFull: [307]
}, {
  code: 308,
  lower: [],
  title: [],
  upper: [],
  fold: 309,
  foldFull: [309]
}, {
  code: 310,
  lower: [],
  title: [],
  upper: [],
  fold: 311,
  foldFull: [311]
}, {
  code: 313,
  lower: [],
  title: [],
  upper: [],
  fold: 314,
  foldFull: [314]
}, {
  code: 315,
  lower: [],
  title: [],
  upper: [],
  fold: 316,
  foldFull: [316]
}, {
  code: 317,
  lower: [],
  title: [],
  upper: [],
  fold: 318,
  foldFull: [318]
}, {
  code: 319,
  lower: [],
  title: [],
  upper: [],
  fold: 320,
  foldFull: [320]
}, {
  code: 321,
  lower: [],
  title: [],
  upper: [],
  fold: 322,
  foldFull: [322]
}, {
  code: 323,
  lower: [],
  title: [],
  upper: [],
  fold: 324,
  foldFull: [324]
}, {
  code: 325,
  lower: [],
  title: [],
  upper: [],
  fold: 326,
  foldFull: [326]
}, {
  code: 327,
  lower: [],
  title: [],
  upper: [],
  fold: 328,
  foldFull: [328]
}, {
  code: 329,
  lower: [329],
  title: [700, 78],
  upper: [700, 78],
  fold: 0,
  foldFull: [700, 110]
}, {
  code: 329,
  lower: [329],
  title: [700, 78],
  upper: [700, 78],
  fold: 0,
  foldFull: [700, 110]
}, {
  code: 330,
  lower: [],
  title: [],
  upper: [],
  fold: 331,
  foldFull: [331]
}, {
  code: 332,
  lower: [],
  title: [],
  upper: [],
  fold: 333,
  foldFull: [333]
}, {
  code: 334,
  lower: [],
  title: [],
  upper: [],
  fold: 335,
  foldFull: [335]
}, {
  code: 336,
  lower: [],
  title: [],
  upper: [],
  fold: 337,
  foldFull: [337]
}, {
  code: 338,
  lower: [],
  title: [],
  upper: [],
  fold: 339,
  foldFull: [339]
}, {
  code: 340,
  lower: [],
  title: [],
  upper: [],
  fold: 341,
  foldFull: [341]
}, {
  code: 342,
  lower: [],
  title: [],
  upper: [],
  fold: 343,
  foldFull: [343]
}, {
  code: 344,
  lower: [],
  title: [],
  upper: [],
  fold: 345,
  foldFull: [345]
}, {
  code: 346,
  lower: [],
  title: [],
  upper: [],
  fold: 347,
  foldFull: [347]
}, {
  code: 348,
  lower: [],
  title: [],
  upper: [],
  fold: 349,
  foldFull: [349]
}, {
  code: 350,
  lower: [],
  title: [],
  upper: [],
  fold: 351,
  foldFull: [351]
}, {
  code: 352,
  lower: [],
  title: [],
  upper: [],
  fold: 353,
  foldFull: [353]
}, {
  code: 354,
  lower: [],
  title: [],
  upper: [],
  fold: 355,
  foldFull: [355]
}, {
  code: 356,
  lower: [],
  title: [],
  upper: [],
  fold: 357,
  foldFull: [357]
}, {
  code: 358,
  lower: [],
  title: [],
  upper: [],
  fold: 359,
  foldFull: [359]
}, {
  code: 360,
  lower: [],
  title: [],
  upper: [],
  fold: 361,
  foldFull: [361]
}, {
  code: 362,
  lower: [],
  title: [],
  upper: [],
  fold: 363,
  foldFull: [363]
}, {
  code: 364,
  lower: [],
  title: [],
  upper: [],
  fold: 365,
  foldFull: [365]
}, {
  code: 366,
  lower: [],
  title: [],
  upper: [],
  fold: 367,
  foldFull: [367]
}, {
  code: 368,
  lower: [],
  title: [],
  upper: [],
  fold: 369,
  foldFull: [369]
}, {
  code: 370,
  lower: [],
  title: [],
  upper: [],
  fold: 371,
  foldFull: [371]
}, {
  code: 372,
  lower: [],
  title: [],
  upper: [],
  fold: 373,
  foldFull: [373]
}, {
  code: 374,
  lower: [],
  title: [],
  upper: [],
  fold: 375,
  foldFull: [375]
}, {
  code: 376,
  lower: [],
  title: [],
  upper: [],
  fold: 255,
  foldFull: [255]
}, {
  code: 377,
  lower: [],
  title: [],
  upper: [],
  fold: 378,
  foldFull: [378]
}, {
  code: 379,
  lower: [],
  title: [],
  upper: [],
  fold: 380,
  foldFull: [380]
}, {
  code: 381,
  lower: [],
  title: [],
  upper: [],
  fold: 382,
  foldFull: [382]
}, {
  code: 383,
  lower: [],
  title: [],
  upper: [],
  fold: 115,
  foldFull: [115]
}, {
  code: 385,
  lower: [],
  title: [],
  upper: [],
  fold: 595,
  foldFull: [595]
}, {
  code: 386,
  lower: [],
  title: [],
  upper: [],
  fold: 387,
  foldFull: [387]
}, {
  code: 388,
  lower: [],
  title: [],
  upper: [],
  fold: 389,
  foldFull: [389]
}, {
  code: 390,
  lower: [],
  title: [],
  upper: [],
  fold: 596,
  foldFull: [596]
}, {
  code: 391,
  lower: [],
  title: [],
  upper: [],
  fold: 392,
  foldFull: [392]
}, {
  code: 393,
  lower: [],
  title: [],
  upper: [],
  fold: 598,
  foldFull: [598]
}, {
  code: 394,
  lower: [],
  title: [],
  upper: [],
  fold: 599,
  foldFull: [599]
}, {
  code: 395,
  lower: [],
  title: [],
  upper: [],
  fold: 396,
  foldFull: [396]
}, {
  code: 398,
  lower: [],
  title: [],
  upper: [],
  fold: 477,
  foldFull: [477]
}, {
  code: 399,
  lower: [],
  title: [],
  upper: [],
  fold: 601,
  foldFull: [601]
}, {
  code: 400,
  lower: [],
  title: [],
  upper: [],
  fold: 603,
  foldFull: [603]
}, {
  code: 401,
  lower: [],
  title: [],
  upper: [],
  fold: 402,
  foldFull: [402]
}, {
  code: 403,
  lower: [],
  title: [],
  upper: [],
  fold: 608,
  foldFull: [608]
}, {
  code: 404,
  lower: [],
  title: [],
  upper: [],
  fold: 611,
  foldFull: [611]
}, {
  code: 406,
  lower: [],
  title: [],
  upper: [],
  fold: 617,
  foldFull: [617]
}, {
  code: 407,
  lower: [],
  title: [],
  upper: [],
  fold: 616,
  foldFull: [616]
}, {
  code: 408,
  lower: [],
  title: [],
  upper: [],
  fold: 409,
  foldFull: [409]
}, {
  code: 412,
  lower: [],
  title: [],
  upper: [],
  fold: 623,
  foldFull: [623]
}, {
  code: 413,
  lower: [],
  title: [],
  upper: [],
  fold: 626,
  foldFull: [626]
}, {
  code: 415,
  lower: [],
  title: [],
  upper: [],
  fold: 629,
  foldFull: [629]
}, {
  code: 416,
  lower: [],
  title: [],
  upper: [],
  fold: 417,
  foldFull: [417]
}, {
  code: 418,
  lower: [],
  title: [],
  upper: [],
  fold: 419,
  foldFull: [419]
}, {
  code: 420,
  lower: [],
  title: [],
  upper: [],
  fold: 421,
  foldFull: [421]
}, {
  code: 422,
  lower: [],
  title: [],
  upper: [],
  fold: 640,
  foldFull: [640]
}, {
  code: 423,
  lower: [],
  title: [],
  upper: [],
  fold: 424,
  foldFull: [424]
}, {
  code: 425,
  lower: [],
  title: [],
  upper: [],
  fold: 643,
  foldFull: [643]
}, {
  code: 428,
  lower: [],
  title: [],
  upper: [],
  fold: 429,
  foldFull: [429]
}, {
  code: 430,
  lower: [],
  title: [],
  upper: [],
  fold: 648,
  foldFull: [648]
}, {
  code: 431,
  lower: [],
  title: [],
  upper: [],
  fold: 432,
  foldFull: [432]
}, {
  code: 433,
  lower: [],
  title: [],
  upper: [],
  fold: 650,
  foldFull: [650]
}, {
  code: 434,
  lower: [],
  title: [],
  upper: [],
  fold: 651,
  foldFull: [651]
}, {
  code: 435,
  lower: [],
  title: [],
  upper: [],
  fold: 436,
  foldFull: [436]
}, {
  code: 437,
  lower: [],
  title: [],
  upper: [],
  fold: 438,
  foldFull: [438]
}, {
  code: 439,
  lower: [],
  title: [],
  upper: [],
  fold: 658,
  foldFull: [658]
}, {
  code: 440,
  lower: [],
  title: [],
  upper: [],
  fold: 441,
  foldFull: [441]
}, {
  code: 444,
  lower: [],
  title: [],
  upper: [],
  fold: 445,
  foldFull: [445]
}, {
  code: 452,
  lower: [],
  title: [],
  upper: [],
  fold: 454,
  foldFull: [454]
}, {
  code: 453,
  lower: [],
  title: [],
  upper: [],
  fold: 454,
  foldFull: [454]
}, {
  code: 455,
  lower: [],
  title: [],
  upper: [],
  fold: 457,
  foldFull: [457]
}, {
  code: 456,
  lower: [],
  title: [],
  upper: [],
  fold: 457,
  foldFull: [457]
}, {
  code: 458,
  lower: [],
  title: [],
  upper: [],
  fold: 460,
  foldFull: [460]
}, {
  code: 459,
  lower: [],
  title: [],
  upper: [],
  fold: 460,
  foldFull: [460]
}, {
  code: 461,
  lower: [],
  title: [],
  upper: [],
  fold: 462,
  foldFull: [462]
}, {
  code: 463,
  lower: [],
  title: [],
  upper: [],
  fold: 464,
  foldFull: [464]
}, {
  code: 465,
  lower: [],
  title: [],
  upper: [],
  fold: 466,
  foldFull: [466]
}, {
  code: 467,
  lower: [],
  title: [],
  upper: [],
  fold: 468,
  foldFull: [468]
}, {
  code: 469,
  lower: [],
  title: [],
  upper: [],
  fold: 470,
  foldFull: [470]
}, {
  code: 471,
  lower: [],
  title: [],
  upper: [],
  fold: 472,
  foldFull: [472]
}, {
  code: 473,
  lower: [],
  title: [],
  upper: [],
  fold: 474,
  foldFull: [474]
}, {
  code: 475,
  lower: [],
  title: [],
  upper: [],
  fold: 476,
  foldFull: [476]
}, {
  code: 478,
  lower: [],
  title: [],
  upper: [],
  fold: 479,
  foldFull: [479]
}, {
  code: 480,
  lower: [],
  title: [],
  upper: [],
  fold: 481,
  foldFull: [481]
}, {
  code: 482,
  lower: [],
  title: [],
  upper: [],
  fold: 483,
  foldFull: [483]
}, {
  code: 484,
  lower: [],
  title: [],
  upper: [],
  fold: 485,
  foldFull: [485]
}, {
  code: 486,
  lower: [],
  title: [],
  upper: [],
  fold: 487,
  foldFull: [487]
}, {
  code: 488,
  lower: [],
  title: [],
  upper: [],
  fold: 489,
  foldFull: [489]
}, {
  code: 490,
  lower: [],
  title: [],
  upper: [],
  fold: 491,
  foldFull: [491]
}, {
  code: 492,
  lower: [],
  title: [],
  upper: [],
  fold: 493,
  foldFull: [493]
}, {
  code: 494,
  lower: [],
  title: [],
  upper: [],
  fold: 495,
  foldFull: [495]
}, {
  code: 496,
  lower: [496],
  title: [74, 780],
  upper: [74, 780],
  fold: 0,
  foldFull: [106, 780]
}, {
  code: 496,
  lower: [496],
  title: [74, 780],
  upper: [74, 780],
  fold: 0,
  foldFull: [106, 780]
}, {
  code: 497,
  lower: [],
  title: [],
  upper: [],
  fold: 499,
  foldFull: [499]
}, {
  code: 498,
  lower: [],
  title: [],
  upper: [],
  fold: 499,
  foldFull: [499]
}, {
  code: 500,
  lower: [],
  title: [],
  upper: [],
  fold: 501,
  foldFull: [501]
}, {
  code: 502,
  lower: [],
  title: [],
  upper: [],
  fold: 405,
  foldFull: [405]
}, {
  code: 503,
  lower: [],
  title: [],
  upper: [],
  fold: 447,
  foldFull: [447]
}, {
  code: 504,
  lower: [],
  title: [],
  upper: [],
  fold: 505,
  foldFull: [505]
}, {
  code: 506,
  lower: [],
  title: [],
  upper: [],
  fold: 507,
  foldFull: [507]
}, {
  code: 508,
  lower: [],
  title: [],
  upper: [],
  fold: 509,
  foldFull: [509]
}, {
  code: 510,
  lower: [],
  title: [],
  upper: [],
  fold: 511,
  foldFull: [511]
}, {
  code: 512,
  lower: [],
  title: [],
  upper: [],
  fold: 513,
  foldFull: [513]
}, {
  code: 514,
  lower: [],
  title: [],
  upper: [],
  fold: 515,
  foldFull: [515]
}, {
  code: 516,
  lower: [],
  title: [],
  upper: [],
  fold: 517,
  foldFull: [517]
}, {
  code: 518,
  lower: [],
  title: [],
  upper: [],
  fold: 519,
  foldFull: [519]
}, {
  code: 520,
  lower: [],
  title: [],
  upper: [],
  fold: 521,
  foldFull: [521]
}, {
  code: 522,
  lower: [],
  title: [],
  upper: [],
  fold: 523,
  foldFull: [523]
}, {
  code: 524,
  lower: [],
  title: [],
  upper: [],
  fold: 525,
  foldFull: [525]
}, {
  code: 526,
  lower: [],
  title: [],
  upper: [],
  fold: 527,
  foldFull: [527]
}, {
  code: 528,
  lower: [],
  title: [],
  upper: [],
  fold: 529,
  foldFull: [529]
}, {
  code: 530,
  lower: [],
  title: [],
  upper: [],
  fold: 531,
  foldFull: [531]
}, {
  code: 532,
  lower: [],
  title: [],
  upper: [],
  fold: 533,
  foldFull: [533]
}, {
  code: 534,
  lower: [],
  title: [],
  upper: [],
  fold: 535,
  foldFull: [535]
}, {
  code: 536,
  lower: [],
  title: [],
  upper: [],
  fold: 537,
  foldFull: [537]
}, {
  code: 538,
  lower: [],
  title: [],
  upper: [],
  fold: 539,
  foldFull: [539]
}, {
  code: 540,
  lower: [],
  title: [],
  upper: [],
  fold: 541,
  foldFull: [541]
}, {
  code: 542,
  lower: [],
  title: [],
  upper: [],
  fold: 543,
  foldFull: [543]
}, {
  code: 544,
  lower: [],
  title: [],
  upper: [],
  fold: 414,
  foldFull: [414]
}, {
  code: 546,
  lower: [],
  title: [],
  upper: [],
  fold: 547,
  foldFull: [547]
}, {
  code: 548,
  lower: [],
  title: [],
  upper: [],
  fold: 549,
  foldFull: [549]
}, {
  code: 550,
  lower: [],
  title: [],
  upper: [],
  fold: 551,
  foldFull: [551]
}, {
  code: 552,
  lower: [],
  title: [],
  upper: [],
  fold: 553,
  foldFull: [553]
}, {
  code: 554,
  lower: [],
  title: [],
  upper: [],
  fold: 555,
  foldFull: [555]
}, {
  code: 556,
  lower: [],
  title: [],
  upper: [],
  fold: 557,
  foldFull: [557]
}, {
  code: 558,
  lower: [],
  title: [],
  upper: [],
  fold: 559,
  foldFull: [559]
}, {
  code: 560,
  lower: [],
  title: [],
  upper: [],
  fold: 561,
  foldFull: [561]
}, {
  code: 562,
  lower: [],
  title: [],
  upper: [],
  fold: 563,
  foldFull: [563]
}, {
  code: 570,
  lower: [],
  title: [],
  upper: [],
  fold: 11365,
  foldFull: [11365]
}, {
  code: 571,
  lower: [],
  title: [],
  upper: [],
  fold: 572,
  foldFull: [572]
}, {
  code: 573,
  lower: [],
  title: [],
  upper: [],
  fold: 410,
  foldFull: [410]
}, {
  code: 574,
  lower: [],
  title: [],
  upper: [],
  fold: 11366,
  foldFull: [11366]
}, {
  code: 577,
  lower: [],
  title: [],
  upper: [],
  fold: 578,
  foldFull: [578]
}, {
  code: 579,
  lower: [],
  title: [],
  upper: [],
  fold: 384,
  foldFull: [384]
}, {
  code: 580,
  lower: [],
  title: [],
  upper: [],
  fold: 649,
  foldFull: [649]
}, {
  code: 581,
  lower: [],
  title: [],
  upper: [],
  fold: 652,
  foldFull: [652]
}, {
  code: 582,
  lower: [],
  title: [],
  upper: [],
  fold: 583,
  foldFull: [583]
}, {
  code: 584,
  lower: [],
  title: [],
  upper: [],
  fold: 585,
  foldFull: [585]
}, {
  code: 586,
  lower: [],
  title: [],
  upper: [],
  fold: 587,
  foldFull: [587]
}, {
  code: 588,
  lower: [],
  title: [],
  upper: [],
  fold: 589,
  foldFull: [589]
}, {
  code: 590,
  lower: [],
  title: [],
  upper: [],
  fold: 591,
  foldFull: [591]
}, {
  code: 837,
  lower: [],
  title: [],
  upper: [],
  fold: 953,
  foldFull: [953]
}, {
  code: 880,
  lower: [],
  title: [],
  upper: [],
  fold: 881,
  foldFull: [881]
}, {
  code: 882,
  lower: [],
  title: [],
  upper: [],
  fold: 883,
  foldFull: [883]
}, {
  code: 886,
  lower: [],
  title: [],
  upper: [],
  fold: 887,
  foldFull: [887]
}, {
  code: 895,
  lower: [],
  title: [],
  upper: [],
  fold: 1011,
  foldFull: [1011]
}, {
  code: 902,
  lower: [],
  title: [],
  upper: [],
  fold: 940,
  foldFull: [940]
}, {
  code: 904,
  lower: [],
  title: [],
  upper: [],
  fold: 941,
  foldFull: [941]
}, {
  code: 905,
  lower: [],
  title: [],
  upper: [],
  fold: 942,
  foldFull: [942]
}, {
  code: 906,
  lower: [],
  title: [],
  upper: [],
  fold: 943,
  foldFull: [943]
}, {
  code: 908,
  lower: [],
  title: [],
  upper: [],
  fold: 972,
  foldFull: [972]
}, {
  code: 910,
  lower: [],
  title: [],
  upper: [],
  fold: 973,
  foldFull: [973]
}, {
  code: 911,
  lower: [],
  title: [],
  upper: [],
  fold: 974,
  foldFull: [974]
}, {
  code: 912,
  lower: [912],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 912,
  lower: [912],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 913,
  lower: [],
  title: [],
  upper: [],
  fold: 945,
  foldFull: [945]
}, {
  code: 914,
  lower: [],
  title: [],
  upper: [],
  fold: 946,
  foldFull: [946]
}, {
  code: 915,
  lower: [],
  title: [],
  upper: [],
  fold: 947,
  foldFull: [947]
}, {
  code: 916,
  lower: [],
  title: [],
  upper: [],
  fold: 948,
  foldFull: [948]
}, {
  code: 917,
  lower: [],
  title: [],
  upper: [],
  fold: 949,
  foldFull: [949]
}, {
  code: 918,
  lower: [],
  title: [],
  upper: [],
  fold: 950,
  foldFull: [950]
}, {
  code: 919,
  lower: [],
  title: [],
  upper: [],
  fold: 951,
  foldFull: [951]
}, {
  code: 920,
  lower: [],
  title: [],
  upper: [],
  fold: 952,
  foldFull: [952]
}, {
  code: 921,
  lower: [],
  title: [],
  upper: [],
  fold: 953,
  foldFull: [953]
}, {
  code: 922,
  lower: [],
  title: [],
  upper: [],
  fold: 954,
  foldFull: [954]
}, {
  code: 923,
  lower: [],
  title: [],
  upper: [],
  fold: 955,
  foldFull: [955]
}, {
  code: 924,
  lower: [],
  title: [],
  upper: [],
  fold: 956,
  foldFull: [956]
}, {
  code: 925,
  lower: [],
  title: [],
  upper: [],
  fold: 957,
  foldFull: [957]
}, {
  code: 926,
  lower: [],
  title: [],
  upper: [],
  fold: 958,
  foldFull: [958]
}, {
  code: 927,
  lower: [],
  title: [],
  upper: [],
  fold: 959,
  foldFull: [959]
}, {
  code: 928,
  lower: [],
  title: [],
  upper: [],
  fold: 960,
  foldFull: [960]
}, {
  code: 929,
  lower: [],
  title: [],
  upper: [],
  fold: 961,
  foldFull: [961]
}, {
  code: 931,
  lower: [],
  title: [],
  upper: [],
  fold: 963,
  foldFull: [963]
}, {
  code: 932,
  lower: [],
  title: [],
  upper: [],
  fold: 964,
  foldFull: [964]
}, {
  code: 933,
  lower: [],
  title: [],
  upper: [],
  fold: 965,
  foldFull: [965]
}, {
  code: 934,
  lower: [],
  title: [],
  upper: [],
  fold: 966,
  foldFull: [966]
}, {
  code: 935,
  lower: [],
  title: [],
  upper: [],
  fold: 967,
  foldFull: [967]
}, {
  code: 936,
  lower: [],
  title: [],
  upper: [],
  fold: 968,
  foldFull: [968]
}, {
  code: 937,
  lower: [],
  title: [],
  upper: [],
  fold: 969,
  foldFull: [969]
}, {
  code: 938,
  lower: [],
  title: [],
  upper: [],
  fold: 970,
  foldFull: [970]
}, {
  code: 939,
  lower: [],
  title: [],
  upper: [],
  fold: 971,
  foldFull: [971]
}, {
  code: 944,
  lower: [944],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 944,
  lower: [944],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 962,
  lower: [],
  title: [],
  upper: [],
  fold: 963,
  foldFull: [963]
}, {
  code: 975,
  lower: [],
  title: [],
  upper: [],
  fold: 983,
  foldFull: [983]
}, {
  code: 976,
  lower: [],
  title: [],
  upper: [],
  fold: 946,
  foldFull: [946]
}, {
  code: 977,
  lower: [],
  title: [],
  upper: [],
  fold: 952,
  foldFull: [952]
}, {
  code: 981,
  lower: [],
  title: [],
  upper: [],
  fold: 966,
  foldFull: [966]
}, {
  code: 982,
  lower: [],
  title: [],
  upper: [],
  fold: 960,
  foldFull: [960]
}, {
  code: 984,
  lower: [],
  title: [],
  upper: [],
  fold: 985,
  foldFull: [985]
}, {
  code: 986,
  lower: [],
  title: [],
  upper: [],
  fold: 987,
  foldFull: [987]
}, {
  code: 988,
  lower: [],
  title: [],
  upper: [],
  fold: 989,
  foldFull: [989]
}, {
  code: 990,
  lower: [],
  title: [],
  upper: [],
  fold: 991,
  foldFull: [991]
}, {
  code: 992,
  lower: [],
  title: [],
  upper: [],
  fold: 993,
  foldFull: [993]
}, {
  code: 994,
  lower: [],
  title: [],
  upper: [],
  fold: 995,
  foldFull: [995]
}, {
  code: 996,
  lower: [],
  title: [],
  upper: [],
  fold: 997,
  foldFull: [997]
}, {
  code: 998,
  lower: [],
  title: [],
  upper: [],
  fold: 999,
  foldFull: [999]
}, {
  code: 1e3,
  lower: [],
  title: [],
  upper: [],
  fold: 1001,
  foldFull: [1001]
}, {
  code: 1002,
  lower: [],
  title: [],
  upper: [],
  fold: 1003,
  foldFull: [1003]
}, {
  code: 1004,
  lower: [],
  title: [],
  upper: [],
  fold: 1005,
  foldFull: [1005]
}, {
  code: 1006,
  lower: [],
  title: [],
  upper: [],
  fold: 1007,
  foldFull: [1007]
}, {
  code: 1008,
  lower: [],
  title: [],
  upper: [],
  fold: 954,
  foldFull: [954]
}, {
  code: 1009,
  lower: [],
  title: [],
  upper: [],
  fold: 961,
  foldFull: [961]
}, {
  code: 1012,
  lower: [],
  title: [],
  upper: [],
  fold: 952,
  foldFull: [952]
}, {
  code: 1013,
  lower: [],
  title: [],
  upper: [],
  fold: 949,
  foldFull: [949]
}, {
  code: 1015,
  lower: [],
  title: [],
  upper: [],
  fold: 1016,
  foldFull: [1016]
}, {
  code: 1017,
  lower: [],
  title: [],
  upper: [],
  fold: 1010,
  foldFull: [1010]
}, {
  code: 1018,
  lower: [],
  title: [],
  upper: [],
  fold: 1019,
  foldFull: [1019]
}, {
  code: 1021,
  lower: [],
  title: [],
  upper: [],
  fold: 891,
  foldFull: [891]
}, {
  code: 1022,
  lower: [],
  title: [],
  upper: [],
  fold: 892,
  foldFull: [892]
}, {
  code: 1023,
  lower: [],
  title: [],
  upper: [],
  fold: 893,
  foldFull: [893]
}, {
  code: 1024,
  lower: [],
  title: [],
  upper: [],
  fold: 1104,
  foldFull: [1104]
}, {
  code: 1025,
  lower: [],
  title: [],
  upper: [],
  fold: 1105,
  foldFull: [1105]
}, {
  code: 1026,
  lower: [],
  title: [],
  upper: [],
  fold: 1106,
  foldFull: [1106]
}, {
  code: 1027,
  lower: [],
  title: [],
  upper: [],
  fold: 1107,
  foldFull: [1107]
}, {
  code: 1028,
  lower: [],
  title: [],
  upper: [],
  fold: 1108,
  foldFull: [1108]
}, {
  code: 1029,
  lower: [],
  title: [],
  upper: [],
  fold: 1109,
  foldFull: [1109]
}, {
  code: 1030,
  lower: [],
  title: [],
  upper: [],
  fold: 1110,
  foldFull: [1110]
}, {
  code: 1031,
  lower: [],
  title: [],
  upper: [],
  fold: 1111,
  foldFull: [1111]
}, {
  code: 1032,
  lower: [],
  title: [],
  upper: [],
  fold: 1112,
  foldFull: [1112]
}, {
  code: 1033,
  lower: [],
  title: [],
  upper: [],
  fold: 1113,
  foldFull: [1113]
}, {
  code: 1034,
  lower: [],
  title: [],
  upper: [],
  fold: 1114,
  foldFull: [1114]
}, {
  code: 1035,
  lower: [],
  title: [],
  upper: [],
  fold: 1115,
  foldFull: [1115]
}, {
  code: 1036,
  lower: [],
  title: [],
  upper: [],
  fold: 1116,
  foldFull: [1116]
}, {
  code: 1037,
  lower: [],
  title: [],
  upper: [],
  fold: 1117,
  foldFull: [1117]
}, {
  code: 1038,
  lower: [],
  title: [],
  upper: [],
  fold: 1118,
  foldFull: [1118]
}, {
  code: 1039,
  lower: [],
  title: [],
  upper: [],
  fold: 1119,
  foldFull: [1119]
}, {
  code: 1040,
  lower: [],
  title: [],
  upper: [],
  fold: 1072,
  foldFull: [1072]
}, {
  code: 1041,
  lower: [],
  title: [],
  upper: [],
  fold: 1073,
  foldFull: [1073]
}, {
  code: 1042,
  lower: [],
  title: [],
  upper: [],
  fold: 1074,
  foldFull: [1074]
}, {
  code: 1043,
  lower: [],
  title: [],
  upper: [],
  fold: 1075,
  foldFull: [1075]
}, {
  code: 1044,
  lower: [],
  title: [],
  upper: [],
  fold: 1076,
  foldFull: [1076]
}, {
  code: 1045,
  lower: [],
  title: [],
  upper: [],
  fold: 1077,
  foldFull: [1077]
}, {
  code: 1046,
  lower: [],
  title: [],
  upper: [],
  fold: 1078,
  foldFull: [1078]
}, {
  code: 1047,
  lower: [],
  title: [],
  upper: [],
  fold: 1079,
  foldFull: [1079]
}, {
  code: 1048,
  lower: [],
  title: [],
  upper: [],
  fold: 1080,
  foldFull: [1080]
}, {
  code: 1049,
  lower: [],
  title: [],
  upper: [],
  fold: 1081,
  foldFull: [1081]
}, {
  code: 1050,
  lower: [],
  title: [],
  upper: [],
  fold: 1082,
  foldFull: [1082]
}, {
  code: 1051,
  lower: [],
  title: [],
  upper: [],
  fold: 1083,
  foldFull: [1083]
}, {
  code: 1052,
  lower: [],
  title: [],
  upper: [],
  fold: 1084,
  foldFull: [1084]
}, {
  code: 1053,
  lower: [],
  title: [],
  upper: [],
  fold: 1085,
  foldFull: [1085]
}, {
  code: 1054,
  lower: [],
  title: [],
  upper: [],
  fold: 1086,
  foldFull: [1086]
}, {
  code: 1055,
  lower: [],
  title: [],
  upper: [],
  fold: 1087,
  foldFull: [1087]
}, {
  code: 1056,
  lower: [],
  title: [],
  upper: [],
  fold: 1088,
  foldFull: [1088]
}, {
  code: 1057,
  lower: [],
  title: [],
  upper: [],
  fold: 1089,
  foldFull: [1089]
}, {
  code: 1058,
  lower: [],
  title: [],
  upper: [],
  fold: 1090,
  foldFull: [1090]
}, {
  code: 1059,
  lower: [],
  title: [],
  upper: [],
  fold: 1091,
  foldFull: [1091]
}, {
  code: 1060,
  lower: [],
  title: [],
  upper: [],
  fold: 1092,
  foldFull: [1092]
}, {
  code: 1061,
  lower: [],
  title: [],
  upper: [],
  fold: 1093,
  foldFull: [1093]
}, {
  code: 1062,
  lower: [],
  title: [],
  upper: [],
  fold: 1094,
  foldFull: [1094]
}, {
  code: 1063,
  lower: [],
  title: [],
  upper: [],
  fold: 1095,
  foldFull: [1095]
}, {
  code: 1064,
  lower: [],
  title: [],
  upper: [],
  fold: 1096,
  foldFull: [1096]
}, {
  code: 1065,
  lower: [],
  title: [],
  upper: [],
  fold: 1097,
  foldFull: [1097]
}, {
  code: 1066,
  lower: [],
  title: [],
  upper: [],
  fold: 1098,
  foldFull: [1098]
}, {
  code: 1067,
  lower: [],
  title: [],
  upper: [],
  fold: 1099,
  foldFull: [1099]
}, {
  code: 1068,
  lower: [],
  title: [],
  upper: [],
  fold: 1100,
  foldFull: [1100]
}, {
  code: 1069,
  lower: [],
  title: [],
  upper: [],
  fold: 1101,
  foldFull: [1101]
}, {
  code: 1070,
  lower: [],
  title: [],
  upper: [],
  fold: 1102,
  foldFull: [1102]
}, {
  code: 1071,
  lower: [],
  title: [],
  upper: [],
  fold: 1103,
  foldFull: [1103]
}, {
  code: 1120,
  lower: [],
  title: [],
  upper: [],
  fold: 1121,
  foldFull: [1121]
}, {
  code: 1122,
  lower: [],
  title: [],
  upper: [],
  fold: 1123,
  foldFull: [1123]
}, {
  code: 1124,
  lower: [],
  title: [],
  upper: [],
  fold: 1125,
  foldFull: [1125]
}, {
  code: 1126,
  lower: [],
  title: [],
  upper: [],
  fold: 1127,
  foldFull: [1127]
}, {
  code: 1128,
  lower: [],
  title: [],
  upper: [],
  fold: 1129,
  foldFull: [1129]
}, {
  code: 1130,
  lower: [],
  title: [],
  upper: [],
  fold: 1131,
  foldFull: [1131]
}, {
  code: 1132,
  lower: [],
  title: [],
  upper: [],
  fold: 1133,
  foldFull: [1133]
}, {
  code: 1134,
  lower: [],
  title: [],
  upper: [],
  fold: 1135,
  foldFull: [1135]
}, {
  code: 1136,
  lower: [],
  title: [],
  upper: [],
  fold: 1137,
  foldFull: [1137]
}, {
  code: 1138,
  lower: [],
  title: [],
  upper: [],
  fold: 1139,
  foldFull: [1139]
}, {
  code: 1140,
  lower: [],
  title: [],
  upper: [],
  fold: 1141,
  foldFull: [1141]
}, {
  code: 1142,
  lower: [],
  title: [],
  upper: [],
  fold: 1143,
  foldFull: [1143]
}, {
  code: 1144,
  lower: [],
  title: [],
  upper: [],
  fold: 1145,
  foldFull: [1145]
}, {
  code: 1146,
  lower: [],
  title: [],
  upper: [],
  fold: 1147,
  foldFull: [1147]
}, {
  code: 1148,
  lower: [],
  title: [],
  upper: [],
  fold: 1149,
  foldFull: [1149]
}, {
  code: 1150,
  lower: [],
  title: [],
  upper: [],
  fold: 1151,
  foldFull: [1151]
}, {
  code: 1152,
  lower: [],
  title: [],
  upper: [],
  fold: 1153,
  foldFull: [1153]
}, {
  code: 1162,
  lower: [],
  title: [],
  upper: [],
  fold: 1163,
  foldFull: [1163]
}, {
  code: 1164,
  lower: [],
  title: [],
  upper: [],
  fold: 1165,
  foldFull: [1165]
}, {
  code: 1166,
  lower: [],
  title: [],
  upper: [],
  fold: 1167,
  foldFull: [1167]
}, {
  code: 1168,
  lower: [],
  title: [],
  upper: [],
  fold: 1169,
  foldFull: [1169]
}, {
  code: 1170,
  lower: [],
  title: [],
  upper: [],
  fold: 1171,
  foldFull: [1171]
}, {
  code: 1172,
  lower: [],
  title: [],
  upper: [],
  fold: 1173,
  foldFull: [1173]
}, {
  code: 1174,
  lower: [],
  title: [],
  upper: [],
  fold: 1175,
  foldFull: [1175]
}, {
  code: 1176,
  lower: [],
  title: [],
  upper: [],
  fold: 1177,
  foldFull: [1177]
}, {
  code: 1178,
  lower: [],
  title: [],
  upper: [],
  fold: 1179,
  foldFull: [1179]
}, {
  code: 1180,
  lower: [],
  title: [],
  upper: [],
  fold: 1181,
  foldFull: [1181]
}, {
  code: 1182,
  lower: [],
  title: [],
  upper: [],
  fold: 1183,
  foldFull: [1183]
}, {
  code: 1184,
  lower: [],
  title: [],
  upper: [],
  fold: 1185,
  foldFull: [1185]
}, {
  code: 1186,
  lower: [],
  title: [],
  upper: [],
  fold: 1187,
  foldFull: [1187]
}, {
  code: 1188,
  lower: [],
  title: [],
  upper: [],
  fold: 1189,
  foldFull: [1189]
}, {
  code: 1190,
  lower: [],
  title: [],
  upper: [],
  fold: 1191,
  foldFull: [1191]
}, {
  code: 1192,
  lower: [],
  title: [],
  upper: [],
  fold: 1193,
  foldFull: [1193]
}, {
  code: 1194,
  lower: [],
  title: [],
  upper: [],
  fold: 1195,
  foldFull: [1195]
}, {
  code: 1196,
  lower: [],
  title: [],
  upper: [],
  fold: 1197,
  foldFull: [1197]
}, {
  code: 1198,
  lower: [],
  title: [],
  upper: [],
  fold: 1199,
  foldFull: [1199]
}, {
  code: 1200,
  lower: [],
  title: [],
  upper: [],
  fold: 1201,
  foldFull: [1201]
}, {
  code: 1202,
  lower: [],
  title: [],
  upper: [],
  fold: 1203,
  foldFull: [1203]
}, {
  code: 1204,
  lower: [],
  title: [],
  upper: [],
  fold: 1205,
  foldFull: [1205]
}, {
  code: 1206,
  lower: [],
  title: [],
  upper: [],
  fold: 1207,
  foldFull: [1207]
}, {
  code: 1208,
  lower: [],
  title: [],
  upper: [],
  fold: 1209,
  foldFull: [1209]
}, {
  code: 1210,
  lower: [],
  title: [],
  upper: [],
  fold: 1211,
  foldFull: [1211]
}, {
  code: 1212,
  lower: [],
  title: [],
  upper: [],
  fold: 1213,
  foldFull: [1213]
}, {
  code: 1214,
  lower: [],
  title: [],
  upper: [],
  fold: 1215,
  foldFull: [1215]
}, {
  code: 1216,
  lower: [],
  title: [],
  upper: [],
  fold: 1231,
  foldFull: [1231]
}, {
  code: 1217,
  lower: [],
  title: [],
  upper: [],
  fold: 1218,
  foldFull: [1218]
}, {
  code: 1219,
  lower: [],
  title: [],
  upper: [],
  fold: 1220,
  foldFull: [1220]
}, {
  code: 1221,
  lower: [],
  title: [],
  upper: [],
  fold: 1222,
  foldFull: [1222]
}, {
  code: 1223,
  lower: [],
  title: [],
  upper: [],
  fold: 1224,
  foldFull: [1224]
}, {
  code: 1225,
  lower: [],
  title: [],
  upper: [],
  fold: 1226,
  foldFull: [1226]
}, {
  code: 1227,
  lower: [],
  title: [],
  upper: [],
  fold: 1228,
  foldFull: [1228]
}, {
  code: 1229,
  lower: [],
  title: [],
  upper: [],
  fold: 1230,
  foldFull: [1230]
}, {
  code: 1232,
  lower: [],
  title: [],
  upper: [],
  fold: 1233,
  foldFull: [1233]
}, {
  code: 1234,
  lower: [],
  title: [],
  upper: [],
  fold: 1235,
  foldFull: [1235]
}, {
  code: 1236,
  lower: [],
  title: [],
  upper: [],
  fold: 1237,
  foldFull: [1237]
}, {
  code: 1238,
  lower: [],
  title: [],
  upper: [],
  fold: 1239,
  foldFull: [1239]
}, {
  code: 1240,
  lower: [],
  title: [],
  upper: [],
  fold: 1241,
  foldFull: [1241]
}, {
  code: 1242,
  lower: [],
  title: [],
  upper: [],
  fold: 1243,
  foldFull: [1243]
}, {
  code: 1244,
  lower: [],
  title: [],
  upper: [],
  fold: 1245,
  foldFull: [1245]
}, {
  code: 1246,
  lower: [],
  title: [],
  upper: [],
  fold: 1247,
  foldFull: [1247]
}, {
  code: 1248,
  lower: [],
  title: [],
  upper: [],
  fold: 1249,
  foldFull: [1249]
}, {
  code: 1250,
  lower: [],
  title: [],
  upper: [],
  fold: 1251,
  foldFull: [1251]
}, {
  code: 1252,
  lower: [],
  title: [],
  upper: [],
  fold: 1253,
  foldFull: [1253]
}, {
  code: 1254,
  lower: [],
  title: [],
  upper: [],
  fold: 1255,
  foldFull: [1255]
}, {
  code: 1256,
  lower: [],
  title: [],
  upper: [],
  fold: 1257,
  foldFull: [1257]
}, {
  code: 1258,
  lower: [],
  title: [],
  upper: [],
  fold: 1259,
  foldFull: [1259]
}, {
  code: 1260,
  lower: [],
  title: [],
  upper: [],
  fold: 1261,
  foldFull: [1261]
}, {
  code: 1262,
  lower: [],
  title: [],
  upper: [],
  fold: 1263,
  foldFull: [1263]
}, {
  code: 1264,
  lower: [],
  title: [],
  upper: [],
  fold: 1265,
  foldFull: [1265]
}, {
  code: 1266,
  lower: [],
  title: [],
  upper: [],
  fold: 1267,
  foldFull: [1267]
}, {
  code: 1268,
  lower: [],
  title: [],
  upper: [],
  fold: 1269,
  foldFull: [1269]
}, {
  code: 1270,
  lower: [],
  title: [],
  upper: [],
  fold: 1271,
  foldFull: [1271]
}, {
  code: 1272,
  lower: [],
  title: [],
  upper: [],
  fold: 1273,
  foldFull: [1273]
}, {
  code: 1274,
  lower: [],
  title: [],
  upper: [],
  fold: 1275,
  foldFull: [1275]
}, {
  code: 1276,
  lower: [],
  title: [],
  upper: [],
  fold: 1277,
  foldFull: [1277]
}, {
  code: 1278,
  lower: [],
  title: [],
  upper: [],
  fold: 1279,
  foldFull: [1279]
}, {
  code: 1280,
  lower: [],
  title: [],
  upper: [],
  fold: 1281,
  foldFull: [1281]
}, {
  code: 1282,
  lower: [],
  title: [],
  upper: [],
  fold: 1283,
  foldFull: [1283]
}, {
  code: 1284,
  lower: [],
  title: [],
  upper: [],
  fold: 1285,
  foldFull: [1285]
}, {
  code: 1286,
  lower: [],
  title: [],
  upper: [],
  fold: 1287,
  foldFull: [1287]
}, {
  code: 1288,
  lower: [],
  title: [],
  upper: [],
  fold: 1289,
  foldFull: [1289]
}, {
  code: 1290,
  lower: [],
  title: [],
  upper: [],
  fold: 1291,
  foldFull: [1291]
}, {
  code: 1292,
  lower: [],
  title: [],
  upper: [],
  fold: 1293,
  foldFull: [1293]
}, {
  code: 1294,
  lower: [],
  title: [],
  upper: [],
  fold: 1295,
  foldFull: [1295]
}, {
  code: 1296,
  lower: [],
  title: [],
  upper: [],
  fold: 1297,
  foldFull: [1297]
}, {
  code: 1298,
  lower: [],
  title: [],
  upper: [],
  fold: 1299,
  foldFull: [1299]
}, {
  code: 1300,
  lower: [],
  title: [],
  upper: [],
  fold: 1301,
  foldFull: [1301]
}, {
  code: 1302,
  lower: [],
  title: [],
  upper: [],
  fold: 1303,
  foldFull: [1303]
}, {
  code: 1304,
  lower: [],
  title: [],
  upper: [],
  fold: 1305,
  foldFull: [1305]
}, {
  code: 1306,
  lower: [],
  title: [],
  upper: [],
  fold: 1307,
  foldFull: [1307]
}, {
  code: 1308,
  lower: [],
  title: [],
  upper: [],
  fold: 1309,
  foldFull: [1309]
}, {
  code: 1310,
  lower: [],
  title: [],
  upper: [],
  fold: 1311,
  foldFull: [1311]
}, {
  code: 1312,
  lower: [],
  title: [],
  upper: [],
  fold: 1313,
  foldFull: [1313]
}, {
  code: 1314,
  lower: [],
  title: [],
  upper: [],
  fold: 1315,
  foldFull: [1315]
}, {
  code: 1316,
  lower: [],
  title: [],
  upper: [],
  fold: 1317,
  foldFull: [1317]
}, {
  code: 1318,
  lower: [],
  title: [],
  upper: [],
  fold: 1319,
  foldFull: [1319]
}, {
  code: 1320,
  lower: [],
  title: [],
  upper: [],
  fold: 1321,
  foldFull: [1321]
}, {
  code: 1322,
  lower: [],
  title: [],
  upper: [],
  fold: 1323,
  foldFull: [1323]
}, {
  code: 1324,
  lower: [],
  title: [],
  upper: [],
  fold: 1325,
  foldFull: [1325]
}, {
  code: 1326,
  lower: [],
  title: [],
  upper: [],
  fold: 1327,
  foldFull: [1327]
}, {
  code: 1329,
  lower: [],
  title: [],
  upper: [],
  fold: 1377,
  foldFull: [1377]
}, {
  code: 1330,
  lower: [],
  title: [],
  upper: [],
  fold: 1378,
  foldFull: [1378]
}, {
  code: 1331,
  lower: [],
  title: [],
  upper: [],
  fold: 1379,
  foldFull: [1379]
}, {
  code: 1332,
  lower: [],
  title: [],
  upper: [],
  fold: 1380,
  foldFull: [1380]
}, {
  code: 1333,
  lower: [],
  title: [],
  upper: [],
  fold: 1381,
  foldFull: [1381]
}, {
  code: 1334,
  lower: [],
  title: [],
  upper: [],
  fold: 1382,
  foldFull: [1382]
}, {
  code: 1335,
  lower: [],
  title: [],
  upper: [],
  fold: 1383,
  foldFull: [1383]
}, {
  code: 1336,
  lower: [],
  title: [],
  upper: [],
  fold: 1384,
  foldFull: [1384]
}, {
  code: 1337,
  lower: [],
  title: [],
  upper: [],
  fold: 1385,
  foldFull: [1385]
}, {
  code: 1338,
  lower: [],
  title: [],
  upper: [],
  fold: 1386,
  foldFull: [1386]
}, {
  code: 1339,
  lower: [],
  title: [],
  upper: [],
  fold: 1387,
  foldFull: [1387]
}, {
  code: 1340,
  lower: [],
  title: [],
  upper: [],
  fold: 1388,
  foldFull: [1388]
}, {
  code: 1341,
  lower: [],
  title: [],
  upper: [],
  fold: 1389,
  foldFull: [1389]
}, {
  code: 1342,
  lower: [],
  title: [],
  upper: [],
  fold: 1390,
  foldFull: [1390]
}, {
  code: 1343,
  lower: [],
  title: [],
  upper: [],
  fold: 1391,
  foldFull: [1391]
}, {
  code: 1344,
  lower: [],
  title: [],
  upper: [],
  fold: 1392,
  foldFull: [1392]
}, {
  code: 1345,
  lower: [],
  title: [],
  upper: [],
  fold: 1393,
  foldFull: [1393]
}, {
  code: 1346,
  lower: [],
  title: [],
  upper: [],
  fold: 1394,
  foldFull: [1394]
}, {
  code: 1347,
  lower: [],
  title: [],
  upper: [],
  fold: 1395,
  foldFull: [1395]
}, {
  code: 1348,
  lower: [],
  title: [],
  upper: [],
  fold: 1396,
  foldFull: [1396]
}, {
  code: 1349,
  lower: [],
  title: [],
  upper: [],
  fold: 1397,
  foldFull: [1397]
}, {
  code: 1350,
  lower: [],
  title: [],
  upper: [],
  fold: 1398,
  foldFull: [1398]
}, {
  code: 1351,
  lower: [],
  title: [],
  upper: [],
  fold: 1399,
  foldFull: [1399]
}, {
  code: 1352,
  lower: [],
  title: [],
  upper: [],
  fold: 1400,
  foldFull: [1400]
}, {
  code: 1353,
  lower: [],
  title: [],
  upper: [],
  fold: 1401,
  foldFull: [1401]
}, {
  code: 1354,
  lower: [],
  title: [],
  upper: [],
  fold: 1402,
  foldFull: [1402]
}, {
  code: 1355,
  lower: [],
  title: [],
  upper: [],
  fold: 1403,
  foldFull: [1403]
}, {
  code: 1356,
  lower: [],
  title: [],
  upper: [],
  fold: 1404,
  foldFull: [1404]
}, {
  code: 1357,
  lower: [],
  title: [],
  upper: [],
  fold: 1405,
  foldFull: [1405]
}, {
  code: 1358,
  lower: [],
  title: [],
  upper: [],
  fold: 1406,
  foldFull: [1406]
}, {
  code: 1359,
  lower: [],
  title: [],
  upper: [],
  fold: 1407,
  foldFull: [1407]
}, {
  code: 1360,
  lower: [],
  title: [],
  upper: [],
  fold: 1408,
  foldFull: [1408]
}, {
  code: 1361,
  lower: [],
  title: [],
  upper: [],
  fold: 1409,
  foldFull: [1409]
}, {
  code: 1362,
  lower: [],
  title: [],
  upper: [],
  fold: 1410,
  foldFull: [1410]
}, {
  code: 1363,
  lower: [],
  title: [],
  upper: [],
  fold: 1411,
  foldFull: [1411]
}, {
  code: 1364,
  lower: [],
  title: [],
  upper: [],
  fold: 1412,
  foldFull: [1412]
}, {
  code: 1365,
  lower: [],
  title: [],
  upper: [],
  fold: 1413,
  foldFull: [1413]
}, {
  code: 1366,
  lower: [],
  title: [],
  upper: [],
  fold: 1414,
  foldFull: [1414]
}, {
  code: 1415,
  lower: [1415],
  title: [1333, 1410],
  upper: [1333, 1362],
  fold: 0,
  foldFull: [1381, 1410]
}, {
  code: 1415,
  lower: [1415],
  title: [1333, 1410],
  upper: [1333, 1362],
  fold: 0,
  foldFull: [1381, 1410]
}, {
  code: 4256,
  lower: [],
  title: [],
  upper: [],
  fold: 11520,
  foldFull: [11520]
}, {
  code: 4257,
  lower: [],
  title: [],
  upper: [],
  fold: 11521,
  foldFull: [11521]
}, {
  code: 4258,
  lower: [],
  title: [],
  upper: [],
  fold: 11522,
  foldFull: [11522]
}, {
  code: 4259,
  lower: [],
  title: [],
  upper: [],
  fold: 11523,
  foldFull: [11523]
}, {
  code: 4260,
  lower: [],
  title: [],
  upper: [],
  fold: 11524,
  foldFull: [11524]
}, {
  code: 4261,
  lower: [],
  title: [],
  upper: [],
  fold: 11525,
  foldFull: [11525]
}, {
  code: 4262,
  lower: [],
  title: [],
  upper: [],
  fold: 11526,
  foldFull: [11526]
}, {
  code: 4263,
  lower: [],
  title: [],
  upper: [],
  fold: 11527,
  foldFull: [11527]
}, {
  code: 4264,
  lower: [],
  title: [],
  upper: [],
  fold: 11528,
  foldFull: [11528]
}, {
  code: 4265,
  lower: [],
  title: [],
  upper: [],
  fold: 11529,
  foldFull: [11529]
}, {
  code: 4266,
  lower: [],
  title: [],
  upper: [],
  fold: 11530,
  foldFull: [11530]
}, {
  code: 4267,
  lower: [],
  title: [],
  upper: [],
  fold: 11531,
  foldFull: [11531]
}, {
  code: 4268,
  lower: [],
  title: [],
  upper: [],
  fold: 11532,
  foldFull: [11532]
}, {
  code: 4269,
  lower: [],
  title: [],
  upper: [],
  fold: 11533,
  foldFull: [11533]
}, {
  code: 4270,
  lower: [],
  title: [],
  upper: [],
  fold: 11534,
  foldFull: [11534]
}, {
  code: 4271,
  lower: [],
  title: [],
  upper: [],
  fold: 11535,
  foldFull: [11535]
}, {
  code: 4272,
  lower: [],
  title: [],
  upper: [],
  fold: 11536,
  foldFull: [11536]
}, {
  code: 4273,
  lower: [],
  title: [],
  upper: [],
  fold: 11537,
  foldFull: [11537]
}, {
  code: 4274,
  lower: [],
  title: [],
  upper: [],
  fold: 11538,
  foldFull: [11538]
}, {
  code: 4275,
  lower: [],
  title: [],
  upper: [],
  fold: 11539,
  foldFull: [11539]
}, {
  code: 4276,
  lower: [],
  title: [],
  upper: [],
  fold: 11540,
  foldFull: [11540]
}, {
  code: 4277,
  lower: [],
  title: [],
  upper: [],
  fold: 11541,
  foldFull: [11541]
}, {
  code: 4278,
  lower: [],
  title: [],
  upper: [],
  fold: 11542,
  foldFull: [11542]
}, {
  code: 4279,
  lower: [],
  title: [],
  upper: [],
  fold: 11543,
  foldFull: [11543]
}, {
  code: 4280,
  lower: [],
  title: [],
  upper: [],
  fold: 11544,
  foldFull: [11544]
}, {
  code: 4281,
  lower: [],
  title: [],
  upper: [],
  fold: 11545,
  foldFull: [11545]
}, {
  code: 4282,
  lower: [],
  title: [],
  upper: [],
  fold: 11546,
  foldFull: [11546]
}, {
  code: 4283,
  lower: [],
  title: [],
  upper: [],
  fold: 11547,
  foldFull: [11547]
}, {
  code: 4284,
  lower: [],
  title: [],
  upper: [],
  fold: 11548,
  foldFull: [11548]
}, {
  code: 4285,
  lower: [],
  title: [],
  upper: [],
  fold: 11549,
  foldFull: [11549]
}, {
  code: 4286,
  lower: [],
  title: [],
  upper: [],
  fold: 11550,
  foldFull: [11550]
}, {
  code: 4287,
  lower: [],
  title: [],
  upper: [],
  fold: 11551,
  foldFull: [11551]
}, {
  code: 4288,
  lower: [],
  title: [],
  upper: [],
  fold: 11552,
  foldFull: [11552]
}, {
  code: 4289,
  lower: [],
  title: [],
  upper: [],
  fold: 11553,
  foldFull: [11553]
}, {
  code: 4290,
  lower: [],
  title: [],
  upper: [],
  fold: 11554,
  foldFull: [11554]
}, {
  code: 4291,
  lower: [],
  title: [],
  upper: [],
  fold: 11555,
  foldFull: [11555]
}, {
  code: 4292,
  lower: [],
  title: [],
  upper: [],
  fold: 11556,
  foldFull: [11556]
}, {
  code: 4293,
  lower: [],
  title: [],
  upper: [],
  fold: 11557,
  foldFull: [11557]
}, {
  code: 4295,
  lower: [],
  title: [],
  upper: [],
  fold: 11559,
  foldFull: [11559]
}, {
  code: 4301,
  lower: [],
  title: [],
  upper: [],
  fold: 11565,
  foldFull: [11565]
}, {
  code: 5112,
  lower: [],
  title: [],
  upper: [],
  fold: 5104,
  foldFull: [5104]
}, {
  code: 5113,
  lower: [],
  title: [],
  upper: [],
  fold: 5105,
  foldFull: [5105]
}, {
  code: 5114,
  lower: [],
  title: [],
  upper: [],
  fold: 5106,
  foldFull: [5106]
}, {
  code: 5115,
  lower: [],
  title: [],
  upper: [],
  fold: 5107,
  foldFull: [5107]
}, {
  code: 5116,
  lower: [],
  title: [],
  upper: [],
  fold: 5108,
  foldFull: [5108]
}, {
  code: 5117,
  lower: [],
  title: [],
  upper: [],
  fold: 5109,
  foldFull: [5109]
}, {
  code: 7296,
  lower: [],
  title: [],
  upper: [],
  fold: 1074,
  foldFull: [1074]
}, {
  code: 7297,
  lower: [],
  title: [],
  upper: [],
  fold: 1076,
  foldFull: [1076]
}, {
  code: 7298,
  lower: [],
  title: [],
  upper: [],
  fold: 1086,
  foldFull: [1086]
}, {
  code: 7299,
  lower: [],
  title: [],
  upper: [],
  fold: 1089,
  foldFull: [1089]
}, {
  code: 7300,
  lower: [],
  title: [],
  upper: [],
  fold: 1090,
  foldFull: [1090]
}, {
  code: 7301,
  lower: [],
  title: [],
  upper: [],
  fold: 1090,
  foldFull: [1090]
}, {
  code: 7302,
  lower: [],
  title: [],
  upper: [],
  fold: 1098,
  foldFull: [1098]
}, {
  code: 7303,
  lower: [],
  title: [],
  upper: [],
  fold: 1123,
  foldFull: [1123]
}, {
  code: 7304,
  lower: [],
  title: [],
  upper: [],
  fold: 42571,
  foldFull: [42571]
}, {
  code: 7312,
  lower: [],
  title: [],
  upper: [],
  fold: 4304,
  foldFull: [4304]
}, {
  code: 7313,
  lower: [],
  title: [],
  upper: [],
  fold: 4305,
  foldFull: [4305]
}, {
  code: 7314,
  lower: [],
  title: [],
  upper: [],
  fold: 4306,
  foldFull: [4306]
}, {
  code: 7315,
  lower: [],
  title: [],
  upper: [],
  fold: 4307,
  foldFull: [4307]
}, {
  code: 7316,
  lower: [],
  title: [],
  upper: [],
  fold: 4308,
  foldFull: [4308]
}, {
  code: 7317,
  lower: [],
  title: [],
  upper: [],
  fold: 4309,
  foldFull: [4309]
}, {
  code: 7318,
  lower: [],
  title: [],
  upper: [],
  fold: 4310,
  foldFull: [4310]
}, {
  code: 7319,
  lower: [],
  title: [],
  upper: [],
  fold: 4311,
  foldFull: [4311]
}, {
  code: 7320,
  lower: [],
  title: [],
  upper: [],
  fold: 4312,
  foldFull: [4312]
}, {
  code: 7321,
  lower: [],
  title: [],
  upper: [],
  fold: 4313,
  foldFull: [4313]
}, {
  code: 7322,
  lower: [],
  title: [],
  upper: [],
  fold: 4314,
  foldFull: [4314]
}, {
  code: 7323,
  lower: [],
  title: [],
  upper: [],
  fold: 4315,
  foldFull: [4315]
}, {
  code: 7324,
  lower: [],
  title: [],
  upper: [],
  fold: 4316,
  foldFull: [4316]
}, {
  code: 7325,
  lower: [],
  title: [],
  upper: [],
  fold: 4317,
  foldFull: [4317]
}, {
  code: 7326,
  lower: [],
  title: [],
  upper: [],
  fold: 4318,
  foldFull: [4318]
}, {
  code: 7327,
  lower: [],
  title: [],
  upper: [],
  fold: 4319,
  foldFull: [4319]
}, {
  code: 7328,
  lower: [],
  title: [],
  upper: [],
  fold: 4320,
  foldFull: [4320]
}, {
  code: 7329,
  lower: [],
  title: [],
  upper: [],
  fold: 4321,
  foldFull: [4321]
}, {
  code: 7330,
  lower: [],
  title: [],
  upper: [],
  fold: 4322,
  foldFull: [4322]
}, {
  code: 7331,
  lower: [],
  title: [],
  upper: [],
  fold: 4323,
  foldFull: [4323]
}, {
  code: 7332,
  lower: [],
  title: [],
  upper: [],
  fold: 4324,
  foldFull: [4324]
}, {
  code: 7333,
  lower: [],
  title: [],
  upper: [],
  fold: 4325,
  foldFull: [4325]
}, {
  code: 7334,
  lower: [],
  title: [],
  upper: [],
  fold: 4326,
  foldFull: [4326]
}, {
  code: 7335,
  lower: [],
  title: [],
  upper: [],
  fold: 4327,
  foldFull: [4327]
}, {
  code: 7336,
  lower: [],
  title: [],
  upper: [],
  fold: 4328,
  foldFull: [4328]
}, {
  code: 7337,
  lower: [],
  title: [],
  upper: [],
  fold: 4329,
  foldFull: [4329]
}, {
  code: 7338,
  lower: [],
  title: [],
  upper: [],
  fold: 4330,
  foldFull: [4330]
}, {
  code: 7339,
  lower: [],
  title: [],
  upper: [],
  fold: 4331,
  foldFull: [4331]
}, {
  code: 7340,
  lower: [],
  title: [],
  upper: [],
  fold: 4332,
  foldFull: [4332]
}, {
  code: 7341,
  lower: [],
  title: [],
  upper: [],
  fold: 4333,
  foldFull: [4333]
}, {
  code: 7342,
  lower: [],
  title: [],
  upper: [],
  fold: 4334,
  foldFull: [4334]
}, {
  code: 7343,
  lower: [],
  title: [],
  upper: [],
  fold: 4335,
  foldFull: [4335]
}, {
  code: 7344,
  lower: [],
  title: [],
  upper: [],
  fold: 4336,
  foldFull: [4336]
}, {
  code: 7345,
  lower: [],
  title: [],
  upper: [],
  fold: 4337,
  foldFull: [4337]
}, {
  code: 7346,
  lower: [],
  title: [],
  upper: [],
  fold: 4338,
  foldFull: [4338]
}, {
  code: 7347,
  lower: [],
  title: [],
  upper: [],
  fold: 4339,
  foldFull: [4339]
}, {
  code: 7348,
  lower: [],
  title: [],
  upper: [],
  fold: 4340,
  foldFull: [4340]
}, {
  code: 7349,
  lower: [],
  title: [],
  upper: [],
  fold: 4341,
  foldFull: [4341]
}, {
  code: 7350,
  lower: [],
  title: [],
  upper: [],
  fold: 4342,
  foldFull: [4342]
}, {
  code: 7351,
  lower: [],
  title: [],
  upper: [],
  fold: 4343,
  foldFull: [4343]
}, {
  code: 7352,
  lower: [],
  title: [],
  upper: [],
  fold: 4344,
  foldFull: [4344]
}, {
  code: 7353,
  lower: [],
  title: [],
  upper: [],
  fold: 4345,
  foldFull: [4345]
}, {
  code: 7354,
  lower: [],
  title: [],
  upper: [],
  fold: 4346,
  foldFull: [4346]
}, {
  code: 7357,
  lower: [],
  title: [],
  upper: [],
  fold: 4349,
  foldFull: [4349]
}, {
  code: 7358,
  lower: [],
  title: [],
  upper: [],
  fold: 4350,
  foldFull: [4350]
}, {
  code: 7359,
  lower: [],
  title: [],
  upper: [],
  fold: 4351,
  foldFull: [4351]
}, {
  code: 7680,
  lower: [],
  title: [],
  upper: [],
  fold: 7681,
  foldFull: [7681]
}, {
  code: 7682,
  lower: [],
  title: [],
  upper: [],
  fold: 7683,
  foldFull: [7683]
}, {
  code: 7684,
  lower: [],
  title: [],
  upper: [],
  fold: 7685,
  foldFull: [7685]
}, {
  code: 7686,
  lower: [],
  title: [],
  upper: [],
  fold: 7687,
  foldFull: [7687]
}, {
  code: 7688,
  lower: [],
  title: [],
  upper: [],
  fold: 7689,
  foldFull: [7689]
}, {
  code: 7690,
  lower: [],
  title: [],
  upper: [],
  fold: 7691,
  foldFull: [7691]
}, {
  code: 7692,
  lower: [],
  title: [],
  upper: [],
  fold: 7693,
  foldFull: [7693]
}, {
  code: 7694,
  lower: [],
  title: [],
  upper: [],
  fold: 7695,
  foldFull: [7695]
}, {
  code: 7696,
  lower: [],
  title: [],
  upper: [],
  fold: 7697,
  foldFull: [7697]
}, {
  code: 7698,
  lower: [],
  title: [],
  upper: [],
  fold: 7699,
  foldFull: [7699]
}, {
  code: 7700,
  lower: [],
  title: [],
  upper: [],
  fold: 7701,
  foldFull: [7701]
}, {
  code: 7702,
  lower: [],
  title: [],
  upper: [],
  fold: 7703,
  foldFull: [7703]
}, {
  code: 7704,
  lower: [],
  title: [],
  upper: [],
  fold: 7705,
  foldFull: [7705]
}, {
  code: 7706,
  lower: [],
  title: [],
  upper: [],
  fold: 7707,
  foldFull: [7707]
}, {
  code: 7708,
  lower: [],
  title: [],
  upper: [],
  fold: 7709,
  foldFull: [7709]
}, {
  code: 7710,
  lower: [],
  title: [],
  upper: [],
  fold: 7711,
  foldFull: [7711]
}, {
  code: 7712,
  lower: [],
  title: [],
  upper: [],
  fold: 7713,
  foldFull: [7713]
}, {
  code: 7714,
  lower: [],
  title: [],
  upper: [],
  fold: 7715,
  foldFull: [7715]
}, {
  code: 7716,
  lower: [],
  title: [],
  upper: [],
  fold: 7717,
  foldFull: [7717]
}, {
  code: 7718,
  lower: [],
  title: [],
  upper: [],
  fold: 7719,
  foldFull: [7719]
}, {
  code: 7720,
  lower: [],
  title: [],
  upper: [],
  fold: 7721,
  foldFull: [7721]
}, {
  code: 7722,
  lower: [],
  title: [],
  upper: [],
  fold: 7723,
  foldFull: [7723]
}, {
  code: 7724,
  lower: [],
  title: [],
  upper: [],
  fold: 7725,
  foldFull: [7725]
}, {
  code: 7726,
  lower: [],
  title: [],
  upper: [],
  fold: 7727,
  foldFull: [7727]
}, {
  code: 7728,
  lower: [],
  title: [],
  upper: [],
  fold: 7729,
  foldFull: [7729]
}, {
  code: 7730,
  lower: [],
  title: [],
  upper: [],
  fold: 7731,
  foldFull: [7731]
}, {
  code: 7732,
  lower: [],
  title: [],
  upper: [],
  fold: 7733,
  foldFull: [7733]
}, {
  code: 7734,
  lower: [],
  title: [],
  upper: [],
  fold: 7735,
  foldFull: [7735]
}, {
  code: 7736,
  lower: [],
  title: [],
  upper: [],
  fold: 7737,
  foldFull: [7737]
}, {
  code: 7738,
  lower: [],
  title: [],
  upper: [],
  fold: 7739,
  foldFull: [7739]
}, {
  code: 7740,
  lower: [],
  title: [],
  upper: [],
  fold: 7741,
  foldFull: [7741]
}, {
  code: 7742,
  lower: [],
  title: [],
  upper: [],
  fold: 7743,
  foldFull: [7743]
}, {
  code: 7744,
  lower: [],
  title: [],
  upper: [],
  fold: 7745,
  foldFull: [7745]
}, {
  code: 7746,
  lower: [],
  title: [],
  upper: [],
  fold: 7747,
  foldFull: [7747]
}, {
  code: 7748,
  lower: [],
  title: [],
  upper: [],
  fold: 7749,
  foldFull: [7749]
}, {
  code: 7750,
  lower: [],
  title: [],
  upper: [],
  fold: 7751,
  foldFull: [7751]
}, {
  code: 7752,
  lower: [],
  title: [],
  upper: [],
  fold: 7753,
  foldFull: [7753]
}, {
  code: 7754,
  lower: [],
  title: [],
  upper: [],
  fold: 7755,
  foldFull: [7755]
}, {
  code: 7756,
  lower: [],
  title: [],
  upper: [],
  fold: 7757,
  foldFull: [7757]
}, {
  code: 7758,
  lower: [],
  title: [],
  upper: [],
  fold: 7759,
  foldFull: [7759]
}, {
  code: 7760,
  lower: [],
  title: [],
  upper: [],
  fold: 7761,
  foldFull: [7761]
}, {
  code: 7762,
  lower: [],
  title: [],
  upper: [],
  fold: 7763,
  foldFull: [7763]
}, {
  code: 7764,
  lower: [],
  title: [],
  upper: [],
  fold: 7765,
  foldFull: [7765]
}, {
  code: 7766,
  lower: [],
  title: [],
  upper: [],
  fold: 7767,
  foldFull: [7767]
}, {
  code: 7768,
  lower: [],
  title: [],
  upper: [],
  fold: 7769,
  foldFull: [7769]
}, {
  code: 7770,
  lower: [],
  title: [],
  upper: [],
  fold: 7771,
  foldFull: [7771]
}, {
  code: 7772,
  lower: [],
  title: [],
  upper: [],
  fold: 7773,
  foldFull: [7773]
}, {
  code: 7774,
  lower: [],
  title: [],
  upper: [],
  fold: 7775,
  foldFull: [7775]
}, {
  code: 7776,
  lower: [],
  title: [],
  upper: [],
  fold: 7777,
  foldFull: [7777]
}, {
  code: 7778,
  lower: [],
  title: [],
  upper: [],
  fold: 7779,
  foldFull: [7779]
}, {
  code: 7780,
  lower: [],
  title: [],
  upper: [],
  fold: 7781,
  foldFull: [7781]
}, {
  code: 7782,
  lower: [],
  title: [],
  upper: [],
  fold: 7783,
  foldFull: [7783]
}, {
  code: 7784,
  lower: [],
  title: [],
  upper: [],
  fold: 7785,
  foldFull: [7785]
}, {
  code: 7786,
  lower: [],
  title: [],
  upper: [],
  fold: 7787,
  foldFull: [7787]
}, {
  code: 7788,
  lower: [],
  title: [],
  upper: [],
  fold: 7789,
  foldFull: [7789]
}, {
  code: 7790,
  lower: [],
  title: [],
  upper: [],
  fold: 7791,
  foldFull: [7791]
}, {
  code: 7792,
  lower: [],
  title: [],
  upper: [],
  fold: 7793,
  foldFull: [7793]
}, {
  code: 7794,
  lower: [],
  title: [],
  upper: [],
  fold: 7795,
  foldFull: [7795]
}, {
  code: 7796,
  lower: [],
  title: [],
  upper: [],
  fold: 7797,
  foldFull: [7797]
}, {
  code: 7798,
  lower: [],
  title: [],
  upper: [],
  fold: 7799,
  foldFull: [7799]
}, {
  code: 7800,
  lower: [],
  title: [],
  upper: [],
  fold: 7801,
  foldFull: [7801]
}, {
  code: 7802,
  lower: [],
  title: [],
  upper: [],
  fold: 7803,
  foldFull: [7803]
}, {
  code: 7804,
  lower: [],
  title: [],
  upper: [],
  fold: 7805,
  foldFull: [7805]
}, {
  code: 7806,
  lower: [],
  title: [],
  upper: [],
  fold: 7807,
  foldFull: [7807]
}, {
  code: 7808,
  lower: [],
  title: [],
  upper: [],
  fold: 7809,
  foldFull: [7809]
}, {
  code: 7810,
  lower: [],
  title: [],
  upper: [],
  fold: 7811,
  foldFull: [7811]
}, {
  code: 7812,
  lower: [],
  title: [],
  upper: [],
  fold: 7813,
  foldFull: [7813]
}, {
  code: 7814,
  lower: [],
  title: [],
  upper: [],
  fold: 7815,
  foldFull: [7815]
}, {
  code: 7816,
  lower: [],
  title: [],
  upper: [],
  fold: 7817,
  foldFull: [7817]
}, {
  code: 7818,
  lower: [],
  title: [],
  upper: [],
  fold: 7819,
  foldFull: [7819]
}, {
  code: 7820,
  lower: [],
  title: [],
  upper: [],
  fold: 7821,
  foldFull: [7821]
}, {
  code: 7822,
  lower: [],
  title: [],
  upper: [],
  fold: 7823,
  foldFull: [7823]
}, {
  code: 7824,
  lower: [],
  title: [],
  upper: [],
  fold: 7825,
  foldFull: [7825]
}, {
  code: 7826,
  lower: [],
  title: [],
  upper: [],
  fold: 7827,
  foldFull: [7827]
}, {
  code: 7828,
  lower: [],
  title: [],
  upper: [],
  fold: 7829,
  foldFull: [7829]
}, {
  code: 7830,
  lower: [7830],
  title: [72, 817],
  upper: [72, 817],
  fold: 0,
  foldFull: [104, 817]
}, {
  code: 7830,
  lower: [7830],
  title: [72, 817],
  upper: [72, 817],
  fold: 0,
  foldFull: [104, 817]
}, {
  code: 7831,
  lower: [7831],
  title: [84, 776],
  upper: [84, 776],
  fold: 0,
  foldFull: [116, 776]
}, {
  code: 7831,
  lower: [7831],
  title: [84, 776],
  upper: [84, 776],
  fold: 0,
  foldFull: [116, 776]
}, {
  code: 7832,
  lower: [7832],
  title: [87, 778],
  upper: [87, 778],
  fold: 0,
  foldFull: [119, 778]
}, {
  code: 7832,
  lower: [7832],
  title: [87, 778],
  upper: [87, 778],
  fold: 0,
  foldFull: [119, 778]
}, {
  code: 7833,
  lower: [7833],
  title: [89, 778],
  upper: [89, 778],
  fold: 0,
  foldFull: [121, 778]
}, {
  code: 7833,
  lower: [7833],
  title: [89, 778],
  upper: [89, 778],
  fold: 0,
  foldFull: [121, 778]
}, {
  code: 7834,
  lower: [7834],
  title: [65, 702],
  upper: [65, 702],
  fold: 0,
  foldFull: [97, 702]
}, {
  code: 7834,
  lower: [7834],
  title: [65, 702],
  upper: [65, 702],
  fold: 0,
  foldFull: [97, 702]
}, {
  code: 7835,
  lower: [],
  title: [],
  upper: [],
  fold: 7777,
  foldFull: [7777]
}, {
  code: 7838,
  lower: [],
  title: [],
  upper: [],
  fold: 223,
  foldFull: [115, 115]
}, {
  code: 7840,
  lower: [],
  title: [],
  upper: [],
  fold: 7841,
  foldFull: [7841]
}, {
  code: 7842,
  lower: [],
  title: [],
  upper: [],
  fold: 7843,
  foldFull: [7843]
}, {
  code: 7844,
  lower: [],
  title: [],
  upper: [],
  fold: 7845,
  foldFull: [7845]
}, {
  code: 7846,
  lower: [],
  title: [],
  upper: [],
  fold: 7847,
  foldFull: [7847]
}, {
  code: 7848,
  lower: [],
  title: [],
  upper: [],
  fold: 7849,
  foldFull: [7849]
}, {
  code: 7850,
  lower: [],
  title: [],
  upper: [],
  fold: 7851,
  foldFull: [7851]
}, {
  code: 7852,
  lower: [],
  title: [],
  upper: [],
  fold: 7853,
  foldFull: [7853]
}, {
  code: 7854,
  lower: [],
  title: [],
  upper: [],
  fold: 7855,
  foldFull: [7855]
}, {
  code: 7856,
  lower: [],
  title: [],
  upper: [],
  fold: 7857,
  foldFull: [7857]
}, {
  code: 7858,
  lower: [],
  title: [],
  upper: [],
  fold: 7859,
  foldFull: [7859]
}, {
  code: 7860,
  lower: [],
  title: [],
  upper: [],
  fold: 7861,
  foldFull: [7861]
}, {
  code: 7862,
  lower: [],
  title: [],
  upper: [],
  fold: 7863,
  foldFull: [7863]
}, {
  code: 7864,
  lower: [],
  title: [],
  upper: [],
  fold: 7865,
  foldFull: [7865]
}, {
  code: 7866,
  lower: [],
  title: [],
  upper: [],
  fold: 7867,
  foldFull: [7867]
}, {
  code: 7868,
  lower: [],
  title: [],
  upper: [],
  fold: 7869,
  foldFull: [7869]
}, {
  code: 7870,
  lower: [],
  title: [],
  upper: [],
  fold: 7871,
  foldFull: [7871]
}, {
  code: 7872,
  lower: [],
  title: [],
  upper: [],
  fold: 7873,
  foldFull: [7873]
}, {
  code: 7874,
  lower: [],
  title: [],
  upper: [],
  fold: 7875,
  foldFull: [7875]
}, {
  code: 7876,
  lower: [],
  title: [],
  upper: [],
  fold: 7877,
  foldFull: [7877]
}, {
  code: 7878,
  lower: [],
  title: [],
  upper: [],
  fold: 7879,
  foldFull: [7879]
}, {
  code: 7880,
  lower: [],
  title: [],
  upper: [],
  fold: 7881,
  foldFull: [7881]
}, {
  code: 7882,
  lower: [],
  title: [],
  upper: [],
  fold: 7883,
  foldFull: [7883]
}, {
  code: 7884,
  lower: [],
  title: [],
  upper: [],
  fold: 7885,
  foldFull: [7885]
}, {
  code: 7886,
  lower: [],
  title: [],
  upper: [],
  fold: 7887,
  foldFull: [7887]
}, {
  code: 7888,
  lower: [],
  title: [],
  upper: [],
  fold: 7889,
  foldFull: [7889]
}, {
  code: 7890,
  lower: [],
  title: [],
  upper: [],
  fold: 7891,
  foldFull: [7891]
}, {
  code: 7892,
  lower: [],
  title: [],
  upper: [],
  fold: 7893,
  foldFull: [7893]
}, {
  code: 7894,
  lower: [],
  title: [],
  upper: [],
  fold: 7895,
  foldFull: [7895]
}, {
  code: 7896,
  lower: [],
  title: [],
  upper: [],
  fold: 7897,
  foldFull: [7897]
}, {
  code: 7898,
  lower: [],
  title: [],
  upper: [],
  fold: 7899,
  foldFull: [7899]
}, {
  code: 7900,
  lower: [],
  title: [],
  upper: [],
  fold: 7901,
  foldFull: [7901]
}, {
  code: 7902,
  lower: [],
  title: [],
  upper: [],
  fold: 7903,
  foldFull: [7903]
}, {
  code: 7904,
  lower: [],
  title: [],
  upper: [],
  fold: 7905,
  foldFull: [7905]
}, {
  code: 7906,
  lower: [],
  title: [],
  upper: [],
  fold: 7907,
  foldFull: [7907]
}, {
  code: 7908,
  lower: [],
  title: [],
  upper: [],
  fold: 7909,
  foldFull: [7909]
}, {
  code: 7910,
  lower: [],
  title: [],
  upper: [],
  fold: 7911,
  foldFull: [7911]
}, {
  code: 7912,
  lower: [],
  title: [],
  upper: [],
  fold: 7913,
  foldFull: [7913]
}, {
  code: 7914,
  lower: [],
  title: [],
  upper: [],
  fold: 7915,
  foldFull: [7915]
}, {
  code: 7916,
  lower: [],
  title: [],
  upper: [],
  fold: 7917,
  foldFull: [7917]
}, {
  code: 7918,
  lower: [],
  title: [],
  upper: [],
  fold: 7919,
  foldFull: [7919]
}, {
  code: 7920,
  lower: [],
  title: [],
  upper: [],
  fold: 7921,
  foldFull: [7921]
}, {
  code: 7922,
  lower: [],
  title: [],
  upper: [],
  fold: 7923,
  foldFull: [7923]
}, {
  code: 7924,
  lower: [],
  title: [],
  upper: [],
  fold: 7925,
  foldFull: [7925]
}, {
  code: 7926,
  lower: [],
  title: [],
  upper: [],
  fold: 7927,
  foldFull: [7927]
}, {
  code: 7928,
  lower: [],
  title: [],
  upper: [],
  fold: 7929,
  foldFull: [7929]
}, {
  code: 7930,
  lower: [],
  title: [],
  upper: [],
  fold: 7931,
  foldFull: [7931]
}, {
  code: 7932,
  lower: [],
  title: [],
  upper: [],
  fold: 7933,
  foldFull: [7933]
}, {
  code: 7934,
  lower: [],
  title: [],
  upper: [],
  fold: 7935,
  foldFull: [7935]
}, {
  code: 7944,
  lower: [],
  title: [],
  upper: [],
  fold: 7936,
  foldFull: [7936]
}, {
  code: 7945,
  lower: [],
  title: [],
  upper: [],
  fold: 7937,
  foldFull: [7937]
}, {
  code: 7946,
  lower: [],
  title: [],
  upper: [],
  fold: 7938,
  foldFull: [7938]
}, {
  code: 7947,
  lower: [],
  title: [],
  upper: [],
  fold: 7939,
  foldFull: [7939]
}, {
  code: 7948,
  lower: [],
  title: [],
  upper: [],
  fold: 7940,
  foldFull: [7940]
}, {
  code: 7949,
  lower: [],
  title: [],
  upper: [],
  fold: 7941,
  foldFull: [7941]
}, {
  code: 7950,
  lower: [],
  title: [],
  upper: [],
  fold: 7942,
  foldFull: [7942]
}, {
  code: 7951,
  lower: [],
  title: [],
  upper: [],
  fold: 7943,
  foldFull: [7943]
}, {
  code: 7960,
  lower: [],
  title: [],
  upper: [],
  fold: 7952,
  foldFull: [7952]
}, {
  code: 7961,
  lower: [],
  title: [],
  upper: [],
  fold: 7953,
  foldFull: [7953]
}, {
  code: 7962,
  lower: [],
  title: [],
  upper: [],
  fold: 7954,
  foldFull: [7954]
}, {
  code: 7963,
  lower: [],
  title: [],
  upper: [],
  fold: 7955,
  foldFull: [7955]
}, {
  code: 7964,
  lower: [],
  title: [],
  upper: [],
  fold: 7956,
  foldFull: [7956]
}, {
  code: 7965,
  lower: [],
  title: [],
  upper: [],
  fold: 7957,
  foldFull: [7957]
}, {
  code: 7976,
  lower: [],
  title: [],
  upper: [],
  fold: 7968,
  foldFull: [7968]
}, {
  code: 7977,
  lower: [],
  title: [],
  upper: [],
  fold: 7969,
  foldFull: [7969]
}, {
  code: 7978,
  lower: [],
  title: [],
  upper: [],
  fold: 7970,
  foldFull: [7970]
}, {
  code: 7979,
  lower: [],
  title: [],
  upper: [],
  fold: 7971,
  foldFull: [7971]
}, {
  code: 7980,
  lower: [],
  title: [],
  upper: [],
  fold: 7972,
  foldFull: [7972]
}, {
  code: 7981,
  lower: [],
  title: [],
  upper: [],
  fold: 7973,
  foldFull: [7973]
}, {
  code: 7982,
  lower: [],
  title: [],
  upper: [],
  fold: 7974,
  foldFull: [7974]
}, {
  code: 7983,
  lower: [],
  title: [],
  upper: [],
  fold: 7975,
  foldFull: [7975]
}, {
  code: 7992,
  lower: [],
  title: [],
  upper: [],
  fold: 7984,
  foldFull: [7984]
}, {
  code: 7993,
  lower: [],
  title: [],
  upper: [],
  fold: 7985,
  foldFull: [7985]
}, {
  code: 7994,
  lower: [],
  title: [],
  upper: [],
  fold: 7986,
  foldFull: [7986]
}, {
  code: 7995,
  lower: [],
  title: [],
  upper: [],
  fold: 7987,
  foldFull: [7987]
}, {
  code: 7996,
  lower: [],
  title: [],
  upper: [],
  fold: 7988,
  foldFull: [7988]
}, {
  code: 7997,
  lower: [],
  title: [],
  upper: [],
  fold: 7989,
  foldFull: [7989]
}, {
  code: 7998,
  lower: [],
  title: [],
  upper: [],
  fold: 7990,
  foldFull: [7990]
}, {
  code: 7999,
  lower: [],
  title: [],
  upper: [],
  fold: 7991,
  foldFull: [7991]
}, {
  code: 8008,
  lower: [],
  title: [],
  upper: [],
  fold: 8e3,
  foldFull: [8e3]
}, {
  code: 8009,
  lower: [],
  title: [],
  upper: [],
  fold: 8001,
  foldFull: [8001]
}, {
  code: 8010,
  lower: [],
  title: [],
  upper: [],
  fold: 8002,
  foldFull: [8002]
}, {
  code: 8011,
  lower: [],
  title: [],
  upper: [],
  fold: 8003,
  foldFull: [8003]
}, {
  code: 8012,
  lower: [],
  title: [],
  upper: [],
  fold: 8004,
  foldFull: [8004]
}, {
  code: 8013,
  lower: [],
  title: [],
  upper: [],
  fold: 8005,
  foldFull: [8005]
}, {
  code: 8016,
  lower: [8016],
  title: [933, 787],
  upper: [933, 787],
  fold: 0,
  foldFull: [965, 787]
}, {
  code: 8016,
  lower: [8016],
  title: [933, 787],
  upper: [933, 787],
  fold: 0,
  foldFull: [965, 787]
}, {
  code: 8018,
  lower: [8018],
  title: [933, 787, 768],
  upper: [933, 787, 768],
  fold: 0,
  foldFull: [965, 787, 768]
}, {
  code: 8018,
  lower: [8018],
  title: [933, 787, 768],
  upper: [933, 787, 768],
  fold: 0,
  foldFull: [965, 787, 768]
}, {
  code: 8020,
  lower: [8020],
  title: [933, 787, 769],
  upper: [933, 787, 769],
  fold: 0,
  foldFull: [965, 787, 769]
}, {
  code: 8020,
  lower: [8020],
  title: [933, 787, 769],
  upper: [933, 787, 769],
  fold: 0,
  foldFull: [965, 787, 769]
}, {
  code: 8022,
  lower: [8022],
  title: [933, 787, 834],
  upper: [933, 787, 834],
  fold: 0,
  foldFull: [965, 787, 834]
}, {
  code: 8022,
  lower: [8022],
  title: [933, 787, 834],
  upper: [933, 787, 834],
  fold: 0,
  foldFull: [965, 787, 834]
}, {
  code: 8025,
  lower: [],
  title: [],
  upper: [],
  fold: 8017,
  foldFull: [8017]
}, {
  code: 8027,
  lower: [],
  title: [],
  upper: [],
  fold: 8019,
  foldFull: [8019]
}, {
  code: 8029,
  lower: [],
  title: [],
  upper: [],
  fold: 8021,
  foldFull: [8021]
}, {
  code: 8031,
  lower: [],
  title: [],
  upper: [],
  fold: 8023,
  foldFull: [8023]
}, {
  code: 8040,
  lower: [],
  title: [],
  upper: [],
  fold: 8032,
  foldFull: [8032]
}, {
  code: 8041,
  lower: [],
  title: [],
  upper: [],
  fold: 8033,
  foldFull: [8033]
}, {
  code: 8042,
  lower: [],
  title: [],
  upper: [],
  fold: 8034,
  foldFull: [8034]
}, {
  code: 8043,
  lower: [],
  title: [],
  upper: [],
  fold: 8035,
  foldFull: [8035]
}, {
  code: 8044,
  lower: [],
  title: [],
  upper: [],
  fold: 8036,
  foldFull: [8036]
}, {
  code: 8045,
  lower: [],
  title: [],
  upper: [],
  fold: 8037,
  foldFull: [8037]
}, {
  code: 8046,
  lower: [],
  title: [],
  upper: [],
  fold: 8038,
  foldFull: [8038]
}, {
  code: 8047,
  lower: [],
  title: [],
  upper: [],
  fold: 8039,
  foldFull: [8039]
}, {
  code: 8064,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 0,
  foldFull: [7936, 953]
}, {
  code: 8064,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 0,
  foldFull: [7936, 953]
}, {
  code: 8065,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 0,
  foldFull: [7937, 953]
}, {
  code: 8065,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 0,
  foldFull: [7937, 953]
}, {
  code: 8066,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 0,
  foldFull: [7938, 953]
}, {
  code: 8066,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 0,
  foldFull: [7938, 953]
}, {
  code: 8067,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 0,
  foldFull: [7939, 953]
}, {
  code: 8067,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 0,
  foldFull: [7939, 953]
}, {
  code: 8068,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 0,
  foldFull: [7940, 953]
}, {
  code: 8068,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 0,
  foldFull: [7940, 953]
}, {
  code: 8069,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 0,
  foldFull: [7941, 953]
}, {
  code: 8069,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 0,
  foldFull: [7941, 953]
}, {
  code: 8070,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 0,
  foldFull: [7942, 953]
}, {
  code: 8070,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 0,
  foldFull: [7942, 953]
}, {
  code: 8071,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 0,
  foldFull: [7943, 953]
}, {
  code: 8071,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 0,
  foldFull: [7943, 953]
}, {
  code: 8072,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 8064,
  foldFull: [7936, 953]
}, {
  code: 8072,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 8064,
  foldFull: [7936, 953]
}, {
  code: 8073,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 8065,
  foldFull: [7937, 953]
}, {
  code: 8073,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 8065,
  foldFull: [7937, 953]
}, {
  code: 8074,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 8066,
  foldFull: [7938, 953]
}, {
  code: 8074,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 8066,
  foldFull: [7938, 953]
}, {
  code: 8075,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 8067,
  foldFull: [7939, 953]
}, {
  code: 8075,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 8067,
  foldFull: [7939, 953]
}, {
  code: 8076,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 8068,
  foldFull: [7940, 953]
}, {
  code: 8076,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 8068,
  foldFull: [7940, 953]
}, {
  code: 8077,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 8069,
  foldFull: [7941, 953]
}, {
  code: 8077,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 8069,
  foldFull: [7941, 953]
}, {
  code: 8078,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 8070,
  foldFull: [7942, 953]
}, {
  code: 8078,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 8070,
  foldFull: [7942, 953]
}, {
  code: 8079,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 8071,
  foldFull: [7943, 953]
}, {
  code: 8079,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 8071,
  foldFull: [7943, 953]
}, {
  code: 8080,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 0,
  foldFull: [7968, 953]
}, {
  code: 8080,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 0,
  foldFull: [7968, 953]
}, {
  code: 8081,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 0,
  foldFull: [7969, 953]
}, {
  code: 8081,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 0,
  foldFull: [7969, 953]
}, {
  code: 8082,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 0,
  foldFull: [7970, 953]
}, {
  code: 8082,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 0,
  foldFull: [7970, 953]
}, {
  code: 8083,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 0,
  foldFull: [7971, 953]
}, {
  code: 8083,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 0,
  foldFull: [7971, 953]
}, {
  code: 8084,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 0,
  foldFull: [7972, 953]
}, {
  code: 8084,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 0,
  foldFull: [7972, 953]
}, {
  code: 8085,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 0,
  foldFull: [7973, 953]
}, {
  code: 8085,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 0,
  foldFull: [7973, 953]
}, {
  code: 8086,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 0,
  foldFull: [7974, 953]
}, {
  code: 8086,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 0,
  foldFull: [7974, 953]
}, {
  code: 8087,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 0,
  foldFull: [7975, 953]
}, {
  code: 8087,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 0,
  foldFull: [7975, 953]
}, {
  code: 8088,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 8080,
  foldFull: [7968, 953]
}, {
  code: 8088,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 8080,
  foldFull: [7968, 953]
}, {
  code: 8089,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 8081,
  foldFull: [7969, 953]
}, {
  code: 8089,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 8081,
  foldFull: [7969, 953]
}, {
  code: 8090,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 8082,
  foldFull: [7970, 953]
}, {
  code: 8090,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 8082,
  foldFull: [7970, 953]
}, {
  code: 8091,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 8083,
  foldFull: [7971, 953]
}, {
  code: 8091,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 8083,
  foldFull: [7971, 953]
}, {
  code: 8092,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 8084,
  foldFull: [7972, 953]
}, {
  code: 8092,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 8084,
  foldFull: [7972, 953]
}, {
  code: 8093,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 8085,
  foldFull: [7973, 953]
}, {
  code: 8093,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 8085,
  foldFull: [7973, 953]
}, {
  code: 8094,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 8086,
  foldFull: [7974, 953]
}, {
  code: 8094,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 8086,
  foldFull: [7974, 953]
}, {
  code: 8095,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 8087,
  foldFull: [7975, 953]
}, {
  code: 8095,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 8087,
  foldFull: [7975, 953]
}, {
  code: 8096,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 0,
  foldFull: [8032, 953]
}, {
  code: 8096,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 0,
  foldFull: [8032, 953]
}, {
  code: 8097,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 0,
  foldFull: [8033, 953]
}, {
  code: 8097,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 0,
  foldFull: [8033, 953]
}, {
  code: 8098,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 0,
  foldFull: [8034, 953]
}, {
  code: 8098,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 0,
  foldFull: [8034, 953]
}, {
  code: 8099,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 0,
  foldFull: [8035, 953]
}, {
  code: 8099,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 0,
  foldFull: [8035, 953]
}, {
  code: 8100,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 0,
  foldFull: [8036, 953]
}, {
  code: 8100,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 0,
  foldFull: [8036, 953]
}, {
  code: 8101,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 0,
  foldFull: [8037, 953]
}, {
  code: 8101,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 0,
  foldFull: [8037, 953]
}, {
  code: 8102,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 0,
  foldFull: [8038, 953]
}, {
  code: 8102,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 0,
  foldFull: [8038, 953]
}, {
  code: 8103,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 0,
  foldFull: [8039, 953]
}, {
  code: 8103,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 0,
  foldFull: [8039, 953]
}, {
  code: 8104,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 8096,
  foldFull: [8032, 953]
}, {
  code: 8104,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 8096,
  foldFull: [8032, 953]
}, {
  code: 8105,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 8097,
  foldFull: [8033, 953]
}, {
  code: 8105,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 8097,
  foldFull: [8033, 953]
}, {
  code: 8106,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 8098,
  foldFull: [8034, 953]
}, {
  code: 8106,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 8098,
  foldFull: [8034, 953]
}, {
  code: 8107,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 8099,
  foldFull: [8035, 953]
}, {
  code: 8107,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 8099,
  foldFull: [8035, 953]
}, {
  code: 8108,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 8100,
  foldFull: [8036, 953]
}, {
  code: 8108,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 8100,
  foldFull: [8036, 953]
}, {
  code: 8109,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 8101,
  foldFull: [8037, 953]
}, {
  code: 8109,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 8101,
  foldFull: [8037, 953]
}, {
  code: 8110,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 8102,
  foldFull: [8038, 953]
}, {
  code: 8110,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 8102,
  foldFull: [8038, 953]
}, {
  code: 8111,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 8103,
  foldFull: [8039, 953]
}, {
  code: 8111,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 8103,
  foldFull: [8039, 953]
}, {
  code: 8114,
  lower: [8114],
  title: [8122, 837],
  upper: [8122, 921],
  fold: 0,
  foldFull: [8048, 953]
}, {
  code: 8114,
  lower: [8114],
  title: [8122, 837],
  upper: [8122, 921],
  fold: 0,
  foldFull: [8048, 953]
}, {
  code: 8115,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 0,
  foldFull: [945, 953]
}, {
  code: 8115,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 0,
  foldFull: [945, 953]
}, {
  code: 8116,
  lower: [8116],
  title: [902, 837],
  upper: [902, 921],
  fold: 0,
  foldFull: [940, 953]
}, {
  code: 8116,
  lower: [8116],
  title: [902, 837],
  upper: [902, 921],
  fold: 0,
  foldFull: [940, 953]
}, {
  code: 8118,
  lower: [8118],
  title: [913, 834],
  upper: [913, 834],
  fold: 0,
  foldFull: [945, 834]
}, {
  code: 8118,
  lower: [8118],
  title: [913, 834],
  upper: [913, 834],
  fold: 0,
  foldFull: [945, 834]
}, {
  code: 8119,
  lower: [8119],
  title: [913, 834, 837],
  upper: [913, 834, 921],
  fold: 0,
  foldFull: [945, 834, 953]
}, {
  code: 8119,
  lower: [8119],
  title: [913, 834, 837],
  upper: [913, 834, 921],
  fold: 0,
  foldFull: [945, 834, 953]
}, {
  code: 8120,
  lower: [],
  title: [],
  upper: [],
  fold: 8112,
  foldFull: [8112]
}, {
  code: 8121,
  lower: [],
  title: [],
  upper: [],
  fold: 8113,
  foldFull: [8113]
}, {
  code: 8122,
  lower: [],
  title: [],
  upper: [],
  fold: 8048,
  foldFull: [8048]
}, {
  code: 8123,
  lower: [],
  title: [],
  upper: [],
  fold: 8049,
  foldFull: [8049]
}, {
  code: 8124,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 8115,
  foldFull: [945, 953]
}, {
  code: 8124,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 8115,
  foldFull: [945, 953]
}, {
  code: 8126,
  lower: [],
  title: [],
  upper: [],
  fold: 953,
  foldFull: [953]
}, {
  code: 8130,
  lower: [8130],
  title: [8138, 837],
  upper: [8138, 921],
  fold: 0,
  foldFull: [8052, 953]
}, {
  code: 8130,
  lower: [8130],
  title: [8138, 837],
  upper: [8138, 921],
  fold: 0,
  foldFull: [8052, 953]
}, {
  code: 8131,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 0,
  foldFull: [951, 953]
}, {
  code: 8131,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 0,
  foldFull: [951, 953]
}, {
  code: 8132,
  lower: [8132],
  title: [905, 837],
  upper: [905, 921],
  fold: 0,
  foldFull: [942, 953]
}, {
  code: 8132,
  lower: [8132],
  title: [905, 837],
  upper: [905, 921],
  fold: 0,
  foldFull: [942, 953]
}, {
  code: 8134,
  lower: [8134],
  title: [919, 834],
  upper: [919, 834],
  fold: 0,
  foldFull: [951, 834]
}, {
  code: 8134,
  lower: [8134],
  title: [919, 834],
  upper: [919, 834],
  fold: 0,
  foldFull: [951, 834]
}, {
  code: 8135,
  lower: [8135],
  title: [919, 834, 837],
  upper: [919, 834, 921],
  fold: 0,
  foldFull: [951, 834, 953]
}, {
  code: 8135,
  lower: [8135],
  title: [919, 834, 837],
  upper: [919, 834, 921],
  fold: 0,
  foldFull: [951, 834, 953]
}, {
  code: 8136,
  lower: [],
  title: [],
  upper: [],
  fold: 8050,
  foldFull: [8050]
}, {
  code: 8137,
  lower: [],
  title: [],
  upper: [],
  fold: 8051,
  foldFull: [8051]
}, {
  code: 8138,
  lower: [],
  title: [],
  upper: [],
  fold: 8052,
  foldFull: [8052]
}, {
  code: 8139,
  lower: [],
  title: [],
  upper: [],
  fold: 8053,
  foldFull: [8053]
}, {
  code: 8140,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 8131,
  foldFull: [951, 953]
}, {
  code: 8140,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 8131,
  foldFull: [951, 953]
}, {
  code: 8146,
  lower: [8146],
  title: [921, 776, 768],
  upper: [921, 776, 768],
  fold: 0,
  foldFull: [953, 776, 768]
}, {
  code: 8146,
  lower: [8146],
  title: [921, 776, 768],
  upper: [921, 776, 768],
  fold: 0,
  foldFull: [953, 776, 768]
}, {
  code: 8147,
  lower: [8147],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 8147,
  lower: [8147],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 8150,
  lower: [8150],
  title: [921, 834],
  upper: [921, 834],
  fold: 0,
  foldFull: [953, 834]
}, {
  code: 8150,
  lower: [8150],
  title: [921, 834],
  upper: [921, 834],
  fold: 0,
  foldFull: [953, 834]
}, {
  code: 8151,
  lower: [8151],
  title: [921, 776, 834],
  upper: [921, 776, 834],
  fold: 0,
  foldFull: [953, 776, 834]
}, {
  code: 8151,
  lower: [8151],
  title: [921, 776, 834],
  upper: [921, 776, 834],
  fold: 0,
  foldFull: [953, 776, 834]
}, {
  code: 8152,
  lower: [],
  title: [],
  upper: [],
  fold: 8144,
  foldFull: [8144]
}, {
  code: 8153,
  lower: [],
  title: [],
  upper: [],
  fold: 8145,
  foldFull: [8145]
}, {
  code: 8154,
  lower: [],
  title: [],
  upper: [],
  fold: 8054,
  foldFull: [8054]
}, {
  code: 8155,
  lower: [],
  title: [],
  upper: [],
  fold: 8055,
  foldFull: [8055]
}, {
  code: 8162,
  lower: [8162],
  title: [933, 776, 768],
  upper: [933, 776, 768],
  fold: 0,
  foldFull: [965, 776, 768]
}, {
  code: 8162,
  lower: [8162],
  title: [933, 776, 768],
  upper: [933, 776, 768],
  fold: 0,
  foldFull: [965, 776, 768]
}, {
  code: 8163,
  lower: [8163],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 8163,
  lower: [8163],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 8164,
  lower: [8164],
  title: [929, 787],
  upper: [929, 787],
  fold: 0,
  foldFull: [961, 787]
}, {
  code: 8164,
  lower: [8164],
  title: [929, 787],
  upper: [929, 787],
  fold: 0,
  foldFull: [961, 787]
}, {
  code: 8166,
  lower: [8166],
  title: [933, 834],
  upper: [933, 834],
  fold: 0,
  foldFull: [965, 834]
}, {
  code: 8166,
  lower: [8166],
  title: [933, 834],
  upper: [933, 834],
  fold: 0,
  foldFull: [965, 834]
}, {
  code: 8167,
  lower: [8167],
  title: [933, 776, 834],
  upper: [933, 776, 834],
  fold: 0,
  foldFull: [965, 776, 834]
}, {
  code: 8167,
  lower: [8167],
  title: [933, 776, 834],
  upper: [933, 776, 834],
  fold: 0,
  foldFull: [965, 776, 834]
}, {
  code: 8168,
  lower: [],
  title: [],
  upper: [],
  fold: 8160,
  foldFull: [8160]
}, {
  code: 8169,
  lower: [],
  title: [],
  upper: [],
  fold: 8161,
  foldFull: [8161]
}, {
  code: 8170,
  lower: [],
  title: [],
  upper: [],
  fold: 8058,
  foldFull: [8058]
}, {
  code: 8171,
  lower: [],
  title: [],
  upper: [],
  fold: 8059,
  foldFull: [8059]
}, {
  code: 8172,
  lower: [],
  title: [],
  upper: [],
  fold: 8165,
  foldFull: [8165]
}, {
  code: 8178,
  lower: [8178],
  title: [8186, 837],
  upper: [8186, 921],
  fold: 0,
  foldFull: [8060, 953]
}, {
  code: 8178,
  lower: [8178],
  title: [8186, 837],
  upper: [8186, 921],
  fold: 0,
  foldFull: [8060, 953]
}, {
  code: 8179,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 0,
  foldFull: [969, 953]
}, {
  code: 8179,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 0,
  foldFull: [969, 953]
}, {
  code: 8180,
  lower: [8180],
  title: [911, 837],
  upper: [911, 921],
  fold: 0,
  foldFull: [974, 953]
}, {
  code: 8180,
  lower: [8180],
  title: [911, 837],
  upper: [911, 921],
  fold: 0,
  foldFull: [974, 953]
}, {
  code: 8182,
  lower: [8182],
  title: [937, 834],
  upper: [937, 834],
  fold: 0,
  foldFull: [969, 834]
}, {
  code: 8182,
  lower: [8182],
  title: [937, 834],
  upper: [937, 834],
  fold: 0,
  foldFull: [969, 834]
}, {
  code: 8183,
  lower: [8183],
  title: [937, 834, 837],
  upper: [937, 834, 921],
  fold: 0,
  foldFull: [969, 834, 953]
}, {
  code: 8183,
  lower: [8183],
  title: [937, 834, 837],
  upper: [937, 834, 921],
  fold: 0,
  foldFull: [969, 834, 953]
}, {
  code: 8184,
  lower: [],
  title: [],
  upper: [],
  fold: 8056,
  foldFull: [8056]
}, {
  code: 8185,
  lower: [],
  title: [],
  upper: [],
  fold: 8057,
  foldFull: [8057]
}, {
  code: 8186,
  lower: [],
  title: [],
  upper: [],
  fold: 8060,
  foldFull: [8060]
}, {
  code: 8187,
  lower: [],
  title: [],
  upper: [],
  fold: 8061,
  foldFull: [8061]
}, {
  code: 8188,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 8179,
  foldFull: [969, 953]
}, {
  code: 8188,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 8179,
  foldFull: [969, 953]
}, {
  code: 8486,
  lower: [],
  title: [],
  upper: [],
  fold: 969,
  foldFull: [969]
}, {
  code: 8490,
  lower: [],
  title: [],
  upper: [],
  fold: 107,
  foldFull: [107]
}, {
  code: 8491,
  lower: [],
  title: [],
  upper: [],
  fold: 229,
  foldFull: [229]
}, {
  code: 8498,
  lower: [],
  title: [],
  upper: [],
  fold: 8526,
  foldFull: [8526]
}, {
  code: 8544,
  lower: [],
  title: [],
  upper: [],
  fold: 8560,
  foldFull: [8560]
}, {
  code: 8545,
  lower: [],
  title: [],
  upper: [],
  fold: 8561,
  foldFull: [8561]
}, {
  code: 8546,
  lower: [],
  title: [],
  upper: [],
  fold: 8562,
  foldFull: [8562]
}, {
  code: 8547,
  lower: [],
  title: [],
  upper: [],
  fold: 8563,
  foldFull: [8563]
}, {
  code: 8548,
  lower: [],
  title: [],
  upper: [],
  fold: 8564,
  foldFull: [8564]
}, {
  code: 8549,
  lower: [],
  title: [],
  upper: [],
  fold: 8565,
  foldFull: [8565]
}, {
  code: 8550,
  lower: [],
  title: [],
  upper: [],
  fold: 8566,
  foldFull: [8566]
}, {
  code: 8551,
  lower: [],
  title: [],
  upper: [],
  fold: 8567,
  foldFull: [8567]
}, {
  code: 8552,
  lower: [],
  title: [],
  upper: [],
  fold: 8568,
  foldFull: [8568]
}, {
  code: 8553,
  lower: [],
  title: [],
  upper: [],
  fold: 8569,
  foldFull: [8569]
}, {
  code: 8554,
  lower: [],
  title: [],
  upper: [],
  fold: 8570,
  foldFull: [8570]
}, {
  code: 8555,
  lower: [],
  title: [],
  upper: [],
  fold: 8571,
  foldFull: [8571]
}, {
  code: 8556,
  lower: [],
  title: [],
  upper: [],
  fold: 8572,
  foldFull: [8572]
}, {
  code: 8557,
  lower: [],
  title: [],
  upper: [],
  fold: 8573,
  foldFull: [8573]
}, {
  code: 8558,
  lower: [],
  title: [],
  upper: [],
  fold: 8574,
  foldFull: [8574]
}, {
  code: 8559,
  lower: [],
  title: [],
  upper: [],
  fold: 8575,
  foldFull: [8575]
}, {
  code: 8579,
  lower: [],
  title: [],
  upper: [],
  fold: 8580,
  foldFull: [8580]
}, {
  code: 9398,
  lower: [],
  title: [],
  upper: [],
  fold: 9424,
  foldFull: [9424]
}, {
  code: 9399,
  lower: [],
  title: [],
  upper: [],
  fold: 9425,
  foldFull: [9425]
}, {
  code: 9400,
  lower: [],
  title: [],
  upper: [],
  fold: 9426,
  foldFull: [9426]
}, {
  code: 9401,
  lower: [],
  title: [],
  upper: [],
  fold: 9427,
  foldFull: [9427]
}, {
  code: 9402,
  lower: [],
  title: [],
  upper: [],
  fold: 9428,
  foldFull: [9428]
}, {
  code: 9403,
  lower: [],
  title: [],
  upper: [],
  fold: 9429,
  foldFull: [9429]
}, {
  code: 9404,
  lower: [],
  title: [],
  upper: [],
  fold: 9430,
  foldFull: [9430]
}, {
  code: 9405,
  lower: [],
  title: [],
  upper: [],
  fold: 9431,
  foldFull: [9431]
}, {
  code: 9406,
  lower: [],
  title: [],
  upper: [],
  fold: 9432,
  foldFull: [9432]
}, {
  code: 9407,
  lower: [],
  title: [],
  upper: [],
  fold: 9433,
  foldFull: [9433]
}, {
  code: 9408,
  lower: [],
  title: [],
  upper: [],
  fold: 9434,
  foldFull: [9434]
}, {
  code: 9409,
  lower: [],
  title: [],
  upper: [],
  fold: 9435,
  foldFull: [9435]
}, {
  code: 9410,
  lower: [],
  title: [],
  upper: [],
  fold: 9436,
  foldFull: [9436]
}, {
  code: 9411,
  lower: [],
  title: [],
  upper: [],
  fold: 9437,
  foldFull: [9437]
}, {
  code: 9412,
  lower: [],
  title: [],
  upper: [],
  fold: 9438,
  foldFull: [9438]
}, {
  code: 9413,
  lower: [],
  title: [],
  upper: [],
  fold: 9439,
  foldFull: [9439]
}, {
  code: 9414,
  lower: [],
  title: [],
  upper: [],
  fold: 9440,
  foldFull: [9440]
}, {
  code: 9415,
  lower: [],
  title: [],
  upper: [],
  fold: 9441,
  foldFull: [9441]
}, {
  code: 9416,
  lower: [],
  title: [],
  upper: [],
  fold: 9442,
  foldFull: [9442]
}, {
  code: 9417,
  lower: [],
  title: [],
  upper: [],
  fold: 9443,
  foldFull: [9443]
}, {
  code: 9418,
  lower: [],
  title: [],
  upper: [],
  fold: 9444,
  foldFull: [9444]
}, {
  code: 9419,
  lower: [],
  title: [],
  upper: [],
  fold: 9445,
  foldFull: [9445]
}, {
  code: 9420,
  lower: [],
  title: [],
  upper: [],
  fold: 9446,
  foldFull: [9446]
}, {
  code: 9421,
  lower: [],
  title: [],
  upper: [],
  fold: 9447,
  foldFull: [9447]
}, {
  code: 9422,
  lower: [],
  title: [],
  upper: [],
  fold: 9448,
  foldFull: [9448]
}, {
  code: 9423,
  lower: [],
  title: [],
  upper: [],
  fold: 9449,
  foldFull: [9449]
}, {
  code: 11264,
  lower: [],
  title: [],
  upper: [],
  fold: 11312,
  foldFull: [11312]
}, {
  code: 11265,
  lower: [],
  title: [],
  upper: [],
  fold: 11313,
  foldFull: [11313]
}, {
  code: 11266,
  lower: [],
  title: [],
  upper: [],
  fold: 11314,
  foldFull: [11314]
}, {
  code: 11267,
  lower: [],
  title: [],
  upper: [],
  fold: 11315,
  foldFull: [11315]
}, {
  code: 11268,
  lower: [],
  title: [],
  upper: [],
  fold: 11316,
  foldFull: [11316]
}, {
  code: 11269,
  lower: [],
  title: [],
  upper: [],
  fold: 11317,
  foldFull: [11317]
}, {
  code: 11270,
  lower: [],
  title: [],
  upper: [],
  fold: 11318,
  foldFull: [11318]
}, {
  code: 11271,
  lower: [],
  title: [],
  upper: [],
  fold: 11319,
  foldFull: [11319]
}, {
  code: 11272,
  lower: [],
  title: [],
  upper: [],
  fold: 11320,
  foldFull: [11320]
}, {
  code: 11273,
  lower: [],
  title: [],
  upper: [],
  fold: 11321,
  foldFull: [11321]
}, {
  code: 11274,
  lower: [],
  title: [],
  upper: [],
  fold: 11322,
  foldFull: [11322]
}, {
  code: 11275,
  lower: [],
  title: [],
  upper: [],
  fold: 11323,
  foldFull: [11323]
}, {
  code: 11276,
  lower: [],
  title: [],
  upper: [],
  fold: 11324,
  foldFull: [11324]
}, {
  code: 11277,
  lower: [],
  title: [],
  upper: [],
  fold: 11325,
  foldFull: [11325]
}, {
  code: 11278,
  lower: [],
  title: [],
  upper: [],
  fold: 11326,
  foldFull: [11326]
}, {
  code: 11279,
  lower: [],
  title: [],
  upper: [],
  fold: 11327,
  foldFull: [11327]
}, {
  code: 11280,
  lower: [],
  title: [],
  upper: [],
  fold: 11328,
  foldFull: [11328]
}, {
  code: 11281,
  lower: [],
  title: [],
  upper: [],
  fold: 11329,
  foldFull: [11329]
}, {
  code: 11282,
  lower: [],
  title: [],
  upper: [],
  fold: 11330,
  foldFull: [11330]
}, {
  code: 11283,
  lower: [],
  title: [],
  upper: [],
  fold: 11331,
  foldFull: [11331]
}, {
  code: 11284,
  lower: [],
  title: [],
  upper: [],
  fold: 11332,
  foldFull: [11332]
}, {
  code: 11285,
  lower: [],
  title: [],
  upper: [],
  fold: 11333,
  foldFull: [11333]
}, {
  code: 11286,
  lower: [],
  title: [],
  upper: [],
  fold: 11334,
  foldFull: [11334]
}, {
  code: 11287,
  lower: [],
  title: [],
  upper: [],
  fold: 11335,
  foldFull: [11335]
}, {
  code: 11288,
  lower: [],
  title: [],
  upper: [],
  fold: 11336,
  foldFull: [11336]
}, {
  code: 11289,
  lower: [],
  title: [],
  upper: [],
  fold: 11337,
  foldFull: [11337]
}, {
  code: 11290,
  lower: [],
  title: [],
  upper: [],
  fold: 11338,
  foldFull: [11338]
}, {
  code: 11291,
  lower: [],
  title: [],
  upper: [],
  fold: 11339,
  foldFull: [11339]
}, {
  code: 11292,
  lower: [],
  title: [],
  upper: [],
  fold: 11340,
  foldFull: [11340]
}, {
  code: 11293,
  lower: [],
  title: [],
  upper: [],
  fold: 11341,
  foldFull: [11341]
}, {
  code: 11294,
  lower: [],
  title: [],
  upper: [],
  fold: 11342,
  foldFull: [11342]
}, {
  code: 11295,
  lower: [],
  title: [],
  upper: [],
  fold: 11343,
  foldFull: [11343]
}, {
  code: 11296,
  lower: [],
  title: [],
  upper: [],
  fold: 11344,
  foldFull: [11344]
}, {
  code: 11297,
  lower: [],
  title: [],
  upper: [],
  fold: 11345,
  foldFull: [11345]
}, {
  code: 11298,
  lower: [],
  title: [],
  upper: [],
  fold: 11346,
  foldFull: [11346]
}, {
  code: 11299,
  lower: [],
  title: [],
  upper: [],
  fold: 11347,
  foldFull: [11347]
}, {
  code: 11300,
  lower: [],
  title: [],
  upper: [],
  fold: 11348,
  foldFull: [11348]
}, {
  code: 11301,
  lower: [],
  title: [],
  upper: [],
  fold: 11349,
  foldFull: [11349]
}, {
  code: 11302,
  lower: [],
  title: [],
  upper: [],
  fold: 11350,
  foldFull: [11350]
}, {
  code: 11303,
  lower: [],
  title: [],
  upper: [],
  fold: 11351,
  foldFull: [11351]
}, {
  code: 11304,
  lower: [],
  title: [],
  upper: [],
  fold: 11352,
  foldFull: [11352]
}, {
  code: 11305,
  lower: [],
  title: [],
  upper: [],
  fold: 11353,
  foldFull: [11353]
}, {
  code: 11306,
  lower: [],
  title: [],
  upper: [],
  fold: 11354,
  foldFull: [11354]
}, {
  code: 11307,
  lower: [],
  title: [],
  upper: [],
  fold: 11355,
  foldFull: [11355]
}, {
  code: 11308,
  lower: [],
  title: [],
  upper: [],
  fold: 11356,
  foldFull: [11356]
}, {
  code: 11309,
  lower: [],
  title: [],
  upper: [],
  fold: 11357,
  foldFull: [11357]
}, {
  code: 11310,
  lower: [],
  title: [],
  upper: [],
  fold: 11358,
  foldFull: [11358]
}, {
  code: 11360,
  lower: [],
  title: [],
  upper: [],
  fold: 11361,
  foldFull: [11361]
}, {
  code: 11362,
  lower: [],
  title: [],
  upper: [],
  fold: 619,
  foldFull: [619]
}, {
  code: 11363,
  lower: [],
  title: [],
  upper: [],
  fold: 7549,
  foldFull: [7549]
}, {
  code: 11364,
  lower: [],
  title: [],
  upper: [],
  fold: 637,
  foldFull: [637]
}, {
  code: 11367,
  lower: [],
  title: [],
  upper: [],
  fold: 11368,
  foldFull: [11368]
}, {
  code: 11369,
  lower: [],
  title: [],
  upper: [],
  fold: 11370,
  foldFull: [11370]
}, {
  code: 11371,
  lower: [],
  title: [],
  upper: [],
  fold: 11372,
  foldFull: [11372]
}, {
  code: 11373,
  lower: [],
  title: [],
  upper: [],
  fold: 593,
  foldFull: [593]
}, {
  code: 11374,
  lower: [],
  title: [],
  upper: [],
  fold: 625,
  foldFull: [625]
}, {
  code: 11375,
  lower: [],
  title: [],
  upper: [],
  fold: 592,
  foldFull: [592]
}, {
  code: 11376,
  lower: [],
  title: [],
  upper: [],
  fold: 594,
  foldFull: [594]
}, {
  code: 11378,
  lower: [],
  title: [],
  upper: [],
  fold: 11379,
  foldFull: [11379]
}, {
  code: 11381,
  lower: [],
  title: [],
  upper: [],
  fold: 11382,
  foldFull: [11382]
}, {
  code: 11390,
  lower: [],
  title: [],
  upper: [],
  fold: 575,
  foldFull: [575]
}, {
  code: 11391,
  lower: [],
  title: [],
  upper: [],
  fold: 576,
  foldFull: [576]
}, {
  code: 11392,
  lower: [],
  title: [],
  upper: [],
  fold: 11393,
  foldFull: [11393]
}, {
  code: 11394,
  lower: [],
  title: [],
  upper: [],
  fold: 11395,
  foldFull: [11395]
}, {
  code: 11396,
  lower: [],
  title: [],
  upper: [],
  fold: 11397,
  foldFull: [11397]
}, {
  code: 11398,
  lower: [],
  title: [],
  upper: [],
  fold: 11399,
  foldFull: [11399]
}, {
  code: 11400,
  lower: [],
  title: [],
  upper: [],
  fold: 11401,
  foldFull: [11401]
}, {
  code: 11402,
  lower: [],
  title: [],
  upper: [],
  fold: 11403,
  foldFull: [11403]
}, {
  code: 11404,
  lower: [],
  title: [],
  upper: [],
  fold: 11405,
  foldFull: [11405]
}, {
  code: 11406,
  lower: [],
  title: [],
  upper: [],
  fold: 11407,
  foldFull: [11407]
}, {
  code: 11408,
  lower: [],
  title: [],
  upper: [],
  fold: 11409,
  foldFull: [11409]
}, {
  code: 11410,
  lower: [],
  title: [],
  upper: [],
  fold: 11411,
  foldFull: [11411]
}, {
  code: 11412,
  lower: [],
  title: [],
  upper: [],
  fold: 11413,
  foldFull: [11413]
}, {
  code: 11414,
  lower: [],
  title: [],
  upper: [],
  fold: 11415,
  foldFull: [11415]
}, {
  code: 11416,
  lower: [],
  title: [],
  upper: [],
  fold: 11417,
  foldFull: [11417]
}, {
  code: 11418,
  lower: [],
  title: [],
  upper: [],
  fold: 11419,
  foldFull: [11419]
}, {
  code: 11420,
  lower: [],
  title: [],
  upper: [],
  fold: 11421,
  foldFull: [11421]
}, {
  code: 11422,
  lower: [],
  title: [],
  upper: [],
  fold: 11423,
  foldFull: [11423]
}, {
  code: 11424,
  lower: [],
  title: [],
  upper: [],
  fold: 11425,
  foldFull: [11425]
}, {
  code: 11426,
  lower: [],
  title: [],
  upper: [],
  fold: 11427,
  foldFull: [11427]
}, {
  code: 11428,
  lower: [],
  title: [],
  upper: [],
  fold: 11429,
  foldFull: [11429]
}, {
  code: 11430,
  lower: [],
  title: [],
  upper: [],
  fold: 11431,
  foldFull: [11431]
}, {
  code: 11432,
  lower: [],
  title: [],
  upper: [],
  fold: 11433,
  foldFull: [11433]
}, {
  code: 11434,
  lower: [],
  title: [],
  upper: [],
  fold: 11435,
  foldFull: [11435]
}, {
  code: 11436,
  lower: [],
  title: [],
  upper: [],
  fold: 11437,
  foldFull: [11437]
}, {
  code: 11438,
  lower: [],
  title: [],
  upper: [],
  fold: 11439,
  foldFull: [11439]
}, {
  code: 11440,
  lower: [],
  title: [],
  upper: [],
  fold: 11441,
  foldFull: [11441]
}, {
  code: 11442,
  lower: [],
  title: [],
  upper: [],
  fold: 11443,
  foldFull: [11443]
}, {
  code: 11444,
  lower: [],
  title: [],
  upper: [],
  fold: 11445,
  foldFull: [11445]
}, {
  code: 11446,
  lower: [],
  title: [],
  upper: [],
  fold: 11447,
  foldFull: [11447]
}, {
  code: 11448,
  lower: [],
  title: [],
  upper: [],
  fold: 11449,
  foldFull: [11449]
}, {
  code: 11450,
  lower: [],
  title: [],
  upper: [],
  fold: 11451,
  foldFull: [11451]
}, {
  code: 11452,
  lower: [],
  title: [],
  upper: [],
  fold: 11453,
  foldFull: [11453]
}, {
  code: 11454,
  lower: [],
  title: [],
  upper: [],
  fold: 11455,
  foldFull: [11455]
}, {
  code: 11456,
  lower: [],
  title: [],
  upper: [],
  fold: 11457,
  foldFull: [11457]
}, {
  code: 11458,
  lower: [],
  title: [],
  upper: [],
  fold: 11459,
  foldFull: [11459]
}, {
  code: 11460,
  lower: [],
  title: [],
  upper: [],
  fold: 11461,
  foldFull: [11461]
}, {
  code: 11462,
  lower: [],
  title: [],
  upper: [],
  fold: 11463,
  foldFull: [11463]
}, {
  code: 11464,
  lower: [],
  title: [],
  upper: [],
  fold: 11465,
  foldFull: [11465]
}, {
  code: 11466,
  lower: [],
  title: [],
  upper: [],
  fold: 11467,
  foldFull: [11467]
}, {
  code: 11468,
  lower: [],
  title: [],
  upper: [],
  fold: 11469,
  foldFull: [11469]
}, {
  code: 11470,
  lower: [],
  title: [],
  upper: [],
  fold: 11471,
  foldFull: [11471]
}, {
  code: 11472,
  lower: [],
  title: [],
  upper: [],
  fold: 11473,
  foldFull: [11473]
}, {
  code: 11474,
  lower: [],
  title: [],
  upper: [],
  fold: 11475,
  foldFull: [11475]
}, {
  code: 11476,
  lower: [],
  title: [],
  upper: [],
  fold: 11477,
  foldFull: [11477]
}, {
  code: 11478,
  lower: [],
  title: [],
  upper: [],
  fold: 11479,
  foldFull: [11479]
}, {
  code: 11480,
  lower: [],
  title: [],
  upper: [],
  fold: 11481,
  foldFull: [11481]
}, {
  code: 11482,
  lower: [],
  title: [],
  upper: [],
  fold: 11483,
  foldFull: [11483]
}, {
  code: 11484,
  lower: [],
  title: [],
  upper: [],
  fold: 11485,
  foldFull: [11485]
}, {
  code: 11486,
  lower: [],
  title: [],
  upper: [],
  fold: 11487,
  foldFull: [11487]
}, {
  code: 11488,
  lower: [],
  title: [],
  upper: [],
  fold: 11489,
  foldFull: [11489]
}, {
  code: 11490,
  lower: [],
  title: [],
  upper: [],
  fold: 11491,
  foldFull: [11491]
}, {
  code: 11499,
  lower: [],
  title: [],
  upper: [],
  fold: 11500,
  foldFull: [11500]
}, {
  code: 11501,
  lower: [],
  title: [],
  upper: [],
  fold: 11502,
  foldFull: [11502]
}, {
  code: 11506,
  lower: [],
  title: [],
  upper: [],
  fold: 11507,
  foldFull: [11507]
}, {
  code: 42560,
  lower: [],
  title: [],
  upper: [],
  fold: 42561,
  foldFull: [42561]
}, {
  code: 42562,
  lower: [],
  title: [],
  upper: [],
  fold: 42563,
  foldFull: [42563]
}, {
  code: 42564,
  lower: [],
  title: [],
  upper: [],
  fold: 42565,
  foldFull: [42565]
}, {
  code: 42566,
  lower: [],
  title: [],
  upper: [],
  fold: 42567,
  foldFull: [42567]
}, {
  code: 42568,
  lower: [],
  title: [],
  upper: [],
  fold: 42569,
  foldFull: [42569]
}, {
  code: 42570,
  lower: [],
  title: [],
  upper: [],
  fold: 42571,
  foldFull: [42571]
}, {
  code: 42572,
  lower: [],
  title: [],
  upper: [],
  fold: 42573,
  foldFull: [42573]
}, {
  code: 42574,
  lower: [],
  title: [],
  upper: [],
  fold: 42575,
  foldFull: [42575]
}, {
  code: 42576,
  lower: [],
  title: [],
  upper: [],
  fold: 42577,
  foldFull: [42577]
}, {
  code: 42578,
  lower: [],
  title: [],
  upper: [],
  fold: 42579,
  foldFull: [42579]
}, {
  code: 42580,
  lower: [],
  title: [],
  upper: [],
  fold: 42581,
  foldFull: [42581]
}, {
  code: 42582,
  lower: [],
  title: [],
  upper: [],
  fold: 42583,
  foldFull: [42583]
}, {
  code: 42584,
  lower: [],
  title: [],
  upper: [],
  fold: 42585,
  foldFull: [42585]
}, {
  code: 42586,
  lower: [],
  title: [],
  upper: [],
  fold: 42587,
  foldFull: [42587]
}, {
  code: 42588,
  lower: [],
  title: [],
  upper: [],
  fold: 42589,
  foldFull: [42589]
}, {
  code: 42590,
  lower: [],
  title: [],
  upper: [],
  fold: 42591,
  foldFull: [42591]
}, {
  code: 42592,
  lower: [],
  title: [],
  upper: [],
  fold: 42593,
  foldFull: [42593]
}, {
  code: 42594,
  lower: [],
  title: [],
  upper: [],
  fold: 42595,
  foldFull: [42595]
}, {
  code: 42596,
  lower: [],
  title: [],
  upper: [],
  fold: 42597,
  foldFull: [42597]
}, {
  code: 42598,
  lower: [],
  title: [],
  upper: [],
  fold: 42599,
  foldFull: [42599]
}, {
  code: 42600,
  lower: [],
  title: [],
  upper: [],
  fold: 42601,
  foldFull: [42601]
}, {
  code: 42602,
  lower: [],
  title: [],
  upper: [],
  fold: 42603,
  foldFull: [42603]
}, {
  code: 42604,
  lower: [],
  title: [],
  upper: [],
  fold: 42605,
  foldFull: [42605]
}, {
  code: 42624,
  lower: [],
  title: [],
  upper: [],
  fold: 42625,
  foldFull: [42625]
}, {
  code: 42626,
  lower: [],
  title: [],
  upper: [],
  fold: 42627,
  foldFull: [42627]
}, {
  code: 42628,
  lower: [],
  title: [],
  upper: [],
  fold: 42629,
  foldFull: [42629]
}, {
  code: 42630,
  lower: [],
  title: [],
  upper: [],
  fold: 42631,
  foldFull: [42631]
}, {
  code: 42632,
  lower: [],
  title: [],
  upper: [],
  fold: 42633,
  foldFull: [42633]
}, {
  code: 42634,
  lower: [],
  title: [],
  upper: [],
  fold: 42635,
  foldFull: [42635]
}, {
  code: 42636,
  lower: [],
  title: [],
  upper: [],
  fold: 42637,
  foldFull: [42637]
}, {
  code: 42638,
  lower: [],
  title: [],
  upper: [],
  fold: 42639,
  foldFull: [42639]
}, {
  code: 42640,
  lower: [],
  title: [],
  upper: [],
  fold: 42641,
  foldFull: [42641]
}, {
  code: 42642,
  lower: [],
  title: [],
  upper: [],
  fold: 42643,
  foldFull: [42643]
}, {
  code: 42644,
  lower: [],
  title: [],
  upper: [],
  fold: 42645,
  foldFull: [42645]
}, {
  code: 42646,
  lower: [],
  title: [],
  upper: [],
  fold: 42647,
  foldFull: [42647]
}, {
  code: 42648,
  lower: [],
  title: [],
  upper: [],
  fold: 42649,
  foldFull: [42649]
}, {
  code: 42650,
  lower: [],
  title: [],
  upper: [],
  fold: 42651,
  foldFull: [42651]
}, {
  code: 42786,
  lower: [],
  title: [],
  upper: [],
  fold: 42787,
  foldFull: [42787]
}, {
  code: 42788,
  lower: [],
  title: [],
  upper: [],
  fold: 42789,
  foldFull: [42789]
}, {
  code: 42790,
  lower: [],
  title: [],
  upper: [],
  fold: 42791,
  foldFull: [42791]
}, {
  code: 42792,
  lower: [],
  title: [],
  upper: [],
  fold: 42793,
  foldFull: [42793]
}, {
  code: 42794,
  lower: [],
  title: [],
  upper: [],
  fold: 42795,
  foldFull: [42795]
}, {
  code: 42796,
  lower: [],
  title: [],
  upper: [],
  fold: 42797,
  foldFull: [42797]
}, {
  code: 42798,
  lower: [],
  title: [],
  upper: [],
  fold: 42799,
  foldFull: [42799]
}, {
  code: 42802,
  lower: [],
  title: [],
  upper: [],
  fold: 42803,
  foldFull: [42803]
}, {
  code: 42804,
  lower: [],
  title: [],
  upper: [],
  fold: 42805,
  foldFull: [42805]
}, {
  code: 42806,
  lower: [],
  title: [],
  upper: [],
  fold: 42807,
  foldFull: [42807]
}, {
  code: 42808,
  lower: [],
  title: [],
  upper: [],
  fold: 42809,
  foldFull: [42809]
}, {
  code: 42810,
  lower: [],
  title: [],
  upper: [],
  fold: 42811,
  foldFull: [42811]
}, {
  code: 42812,
  lower: [],
  title: [],
  upper: [],
  fold: 42813,
  foldFull: [42813]
}, {
  code: 42814,
  lower: [],
  title: [],
  upper: [],
  fold: 42815,
  foldFull: [42815]
}, {
  code: 42816,
  lower: [],
  title: [],
  upper: [],
  fold: 42817,
  foldFull: [42817]
}, {
  code: 42818,
  lower: [],
  title: [],
  upper: [],
  fold: 42819,
  foldFull: [42819]
}, {
  code: 42820,
  lower: [],
  title: [],
  upper: [],
  fold: 42821,
  foldFull: [42821]
}, {
  code: 42822,
  lower: [],
  title: [],
  upper: [],
  fold: 42823,
  foldFull: [42823]
}, {
  code: 42824,
  lower: [],
  title: [],
  upper: [],
  fold: 42825,
  foldFull: [42825]
}, {
  code: 42826,
  lower: [],
  title: [],
  upper: [],
  fold: 42827,
  foldFull: [42827]
}, {
  code: 42828,
  lower: [],
  title: [],
  upper: [],
  fold: 42829,
  foldFull: [42829]
}, {
  code: 42830,
  lower: [],
  title: [],
  upper: [],
  fold: 42831,
  foldFull: [42831]
}, {
  code: 42832,
  lower: [],
  title: [],
  upper: [],
  fold: 42833,
  foldFull: [42833]
}, {
  code: 42834,
  lower: [],
  title: [],
  upper: [],
  fold: 42835,
  foldFull: [42835]
}, {
  code: 42836,
  lower: [],
  title: [],
  upper: [],
  fold: 42837,
  foldFull: [42837]
}, {
  code: 42838,
  lower: [],
  title: [],
  upper: [],
  fold: 42839,
  foldFull: [42839]
}, {
  code: 42840,
  lower: [],
  title: [],
  upper: [],
  fold: 42841,
  foldFull: [42841]
}, {
  code: 42842,
  lower: [],
  title: [],
  upper: [],
  fold: 42843,
  foldFull: [42843]
}, {
  code: 42844,
  lower: [],
  title: [],
  upper: [],
  fold: 42845,
  foldFull: [42845]
}, {
  code: 42846,
  lower: [],
  title: [],
  upper: [],
  fold: 42847,
  foldFull: [42847]
}, {
  code: 42848,
  lower: [],
  title: [],
  upper: [],
  fold: 42849,
  foldFull: [42849]
}, {
  code: 42850,
  lower: [],
  title: [],
  upper: [],
  fold: 42851,
  foldFull: [42851]
}, {
  code: 42852,
  lower: [],
  title: [],
  upper: [],
  fold: 42853,
  foldFull: [42853]
}, {
  code: 42854,
  lower: [],
  title: [],
  upper: [],
  fold: 42855,
  foldFull: [42855]
}, {
  code: 42856,
  lower: [],
  title: [],
  upper: [],
  fold: 42857,
  foldFull: [42857]
}, {
  code: 42858,
  lower: [],
  title: [],
  upper: [],
  fold: 42859,
  foldFull: [42859]
}, {
  code: 42860,
  lower: [],
  title: [],
  upper: [],
  fold: 42861,
  foldFull: [42861]
}, {
  code: 42862,
  lower: [],
  title: [],
  upper: [],
  fold: 42863,
  foldFull: [42863]
}, {
  code: 42873,
  lower: [],
  title: [],
  upper: [],
  fold: 42874,
  foldFull: [42874]
}, {
  code: 42875,
  lower: [],
  title: [],
  upper: [],
  fold: 42876,
  foldFull: [42876]
}, {
  code: 42877,
  lower: [],
  title: [],
  upper: [],
  fold: 7545,
  foldFull: [7545]
}, {
  code: 42878,
  lower: [],
  title: [],
  upper: [],
  fold: 42879,
  foldFull: [42879]
}, {
  code: 42880,
  lower: [],
  title: [],
  upper: [],
  fold: 42881,
  foldFull: [42881]
}, {
  code: 42882,
  lower: [],
  title: [],
  upper: [],
  fold: 42883,
  foldFull: [42883]
}, {
  code: 42884,
  lower: [],
  title: [],
  upper: [],
  fold: 42885,
  foldFull: [42885]
}, {
  code: 42886,
  lower: [],
  title: [],
  upper: [],
  fold: 42887,
  foldFull: [42887]
}, {
  code: 42891,
  lower: [],
  title: [],
  upper: [],
  fold: 42892,
  foldFull: [42892]
}, {
  code: 42893,
  lower: [],
  title: [],
  upper: [],
  fold: 613,
  foldFull: [613]
}, {
  code: 42896,
  lower: [],
  title: [],
  upper: [],
  fold: 42897,
  foldFull: [42897]
}, {
  code: 42898,
  lower: [],
  title: [],
  upper: [],
  fold: 42899,
  foldFull: [42899]
}, {
  code: 42902,
  lower: [],
  title: [],
  upper: [],
  fold: 42903,
  foldFull: [42903]
}, {
  code: 42904,
  lower: [],
  title: [],
  upper: [],
  fold: 42905,
  foldFull: [42905]
}, {
  code: 42906,
  lower: [],
  title: [],
  upper: [],
  fold: 42907,
  foldFull: [42907]
}, {
  code: 42908,
  lower: [],
  title: [],
  upper: [],
  fold: 42909,
  foldFull: [42909]
}, {
  code: 42910,
  lower: [],
  title: [],
  upper: [],
  fold: 42911,
  foldFull: [42911]
}, {
  code: 42912,
  lower: [],
  title: [],
  upper: [],
  fold: 42913,
  foldFull: [42913]
}, {
  code: 42914,
  lower: [],
  title: [],
  upper: [],
  fold: 42915,
  foldFull: [42915]
}, {
  code: 42916,
  lower: [],
  title: [],
  upper: [],
  fold: 42917,
  foldFull: [42917]
}, {
  code: 42918,
  lower: [],
  title: [],
  upper: [],
  fold: 42919,
  foldFull: [42919]
}, {
  code: 42920,
  lower: [],
  title: [],
  upper: [],
  fold: 42921,
  foldFull: [42921]
}, {
  code: 42922,
  lower: [],
  title: [],
  upper: [],
  fold: 614,
  foldFull: [614]
}, {
  code: 42923,
  lower: [],
  title: [],
  upper: [],
  fold: 604,
  foldFull: [604]
}, {
  code: 42924,
  lower: [],
  title: [],
  upper: [],
  fold: 609,
  foldFull: [609]
}, {
  code: 42925,
  lower: [],
  title: [],
  upper: [],
  fold: 620,
  foldFull: [620]
}, {
  code: 42926,
  lower: [],
  title: [],
  upper: [],
  fold: 618,
  foldFull: [618]
}, {
  code: 42928,
  lower: [],
  title: [],
  upper: [],
  fold: 670,
  foldFull: [670]
}, {
  code: 42929,
  lower: [],
  title: [],
  upper: [],
  fold: 647,
  foldFull: [647]
}, {
  code: 42930,
  lower: [],
  title: [],
  upper: [],
  fold: 669,
  foldFull: [669]
}, {
  code: 42931,
  lower: [],
  title: [],
  upper: [],
  fold: 43859,
  foldFull: [43859]
}, {
  code: 42932,
  lower: [],
  title: [],
  upper: [],
  fold: 42933,
  foldFull: [42933]
}, {
  code: 42934,
  lower: [],
  title: [],
  upper: [],
  fold: 42935,
  foldFull: [42935]
}, {
  code: 42936,
  lower: [],
  title: [],
  upper: [],
  fold: 42937,
  foldFull: [42937]
}, {
  code: 42938,
  lower: [],
  title: [],
  upper: [],
  fold: 42939,
  foldFull: [42939]
}, {
  code: 42940,
  lower: [],
  title: [],
  upper: [],
  fold: 42941,
  foldFull: [42941]
}, {
  code: 42942,
  lower: [],
  title: [],
  upper: [],
  fold: 42943,
  foldFull: [42943]
}, {
  code: 42946,
  lower: [],
  title: [],
  upper: [],
  fold: 42947,
  foldFull: [42947]
}, {
  code: 42948,
  lower: [],
  title: [],
  upper: [],
  fold: 42900,
  foldFull: [42900]
}, {
  code: 42949,
  lower: [],
  title: [],
  upper: [],
  fold: 642,
  foldFull: [642]
}, {
  code: 42950,
  lower: [],
  title: [],
  upper: [],
  fold: 7566,
  foldFull: [7566]
}, {
  code: 42951,
  lower: [],
  title: [],
  upper: [],
  fold: 42952,
  foldFull: [42952]
}, {
  code: 42953,
  lower: [],
  title: [],
  upper: [],
  fold: 42954,
  foldFull: [42954]
}, {
  code: 42997,
  lower: [],
  title: [],
  upper: [],
  fold: 42998,
  foldFull: [42998]
}, {
  code: 43888,
  lower: [],
  title: [],
  upper: [],
  fold: 5024,
  foldFull: [5024]
}, {
  code: 43889,
  lower: [],
  title: [],
  upper: [],
  fold: 5025,
  foldFull: [5025]
}, {
  code: 43890,
  lower: [],
  title: [],
  upper: [],
  fold: 5026,
  foldFull: [5026]
}, {
  code: 43891,
  lower: [],
  title: [],
  upper: [],
  fold: 5027,
  foldFull: [5027]
}, {
  code: 43892,
  lower: [],
  title: [],
  upper: [],
  fold: 5028,
  foldFull: [5028]
}, {
  code: 43893,
  lower: [],
  title: [],
  upper: [],
  fold: 5029,
  foldFull: [5029]
}, {
  code: 43894,
  lower: [],
  title: [],
  upper: [],
  fold: 5030,
  foldFull: [5030]
}, {
  code: 43895,
  lower: [],
  title: [],
  upper: [],
  fold: 5031,
  foldFull: [5031]
}, {
  code: 43896,
  lower: [],
  title: [],
  upper: [],
  fold: 5032,
  foldFull: [5032]
}, {
  code: 43897,
  lower: [],
  title: [],
  upper: [],
  fold: 5033,
  foldFull: [5033]
}, {
  code: 43898,
  lower: [],
  title: [],
  upper: [],
  fold: 5034,
  foldFull: [5034]
}, {
  code: 43899,
  lower: [],
  title: [],
  upper: [],
  fold: 5035,
  foldFull: [5035]
}, {
  code: 43900,
  lower: [],
  title: [],
  upper: [],
  fold: 5036,
  foldFull: [5036]
}, {
  code: 43901,
  lower: [],
  title: [],
  upper: [],
  fold: 5037,
  foldFull: [5037]
}, {
  code: 43902,
  lower: [],
  title: [],
  upper: [],
  fold: 5038,
  foldFull: [5038]
}, {
  code: 43903,
  lower: [],
  title: [],
  upper: [],
  fold: 5039,
  foldFull: [5039]
}, {
  code: 43904,
  lower: [],
  title: [],
  upper: [],
  fold: 5040,
  foldFull: [5040]
}, {
  code: 43905,
  lower: [],
  title: [],
  upper: [],
  fold: 5041,
  foldFull: [5041]
}, {
  code: 43906,
  lower: [],
  title: [],
  upper: [],
  fold: 5042,
  foldFull: [5042]
}, {
  code: 43907,
  lower: [],
  title: [],
  upper: [],
  fold: 5043,
  foldFull: [5043]
}, {
  code: 43908,
  lower: [],
  title: [],
  upper: [],
  fold: 5044,
  foldFull: [5044]
}, {
  code: 43909,
  lower: [],
  title: [],
  upper: [],
  fold: 5045,
  foldFull: [5045]
}, {
  code: 43910,
  lower: [],
  title: [],
  upper: [],
  fold: 5046,
  foldFull: [5046]
}, {
  code: 43911,
  lower: [],
  title: [],
  upper: [],
  fold: 5047,
  foldFull: [5047]
}, {
  code: 43912,
  lower: [],
  title: [],
  upper: [],
  fold: 5048,
  foldFull: [5048]
}, {
  code: 43913,
  lower: [],
  title: [],
  upper: [],
  fold: 5049,
  foldFull: [5049]
}, {
  code: 43914,
  lower: [],
  title: [],
  upper: [],
  fold: 5050,
  foldFull: [5050]
}, {
  code: 43915,
  lower: [],
  title: [],
  upper: [],
  fold: 5051,
  foldFull: [5051]
}, {
  code: 43916,
  lower: [],
  title: [],
  upper: [],
  fold: 5052,
  foldFull: [5052]
}, {
  code: 43917,
  lower: [],
  title: [],
  upper: [],
  fold: 5053,
  foldFull: [5053]
}, {
  code: 43918,
  lower: [],
  title: [],
  upper: [],
  fold: 5054,
  foldFull: [5054]
}, {
  code: 43919,
  lower: [],
  title: [],
  upper: [],
  fold: 5055,
  foldFull: [5055]
}, {
  code: 43920,
  lower: [],
  title: [],
  upper: [],
  fold: 5056,
  foldFull: [5056]
}, {
  code: 43921,
  lower: [],
  title: [],
  upper: [],
  fold: 5057,
  foldFull: [5057]
}, {
  code: 43922,
  lower: [],
  title: [],
  upper: [],
  fold: 5058,
  foldFull: [5058]
}, {
  code: 43923,
  lower: [],
  title: [],
  upper: [],
  fold: 5059,
  foldFull: [5059]
}, {
  code: 43924,
  lower: [],
  title: [],
  upper: [],
  fold: 5060,
  foldFull: [5060]
}, {
  code: 43925,
  lower: [],
  title: [],
  upper: [],
  fold: 5061,
  foldFull: [5061]
}, {
  code: 43926,
  lower: [],
  title: [],
  upper: [],
  fold: 5062,
  foldFull: [5062]
}, {
  code: 43927,
  lower: [],
  title: [],
  upper: [],
  fold: 5063,
  foldFull: [5063]
}, {
  code: 43928,
  lower: [],
  title: [],
  upper: [],
  fold: 5064,
  foldFull: [5064]
}, {
  code: 43929,
  lower: [],
  title: [],
  upper: [],
  fold: 5065,
  foldFull: [5065]
}, {
  code: 43930,
  lower: [],
  title: [],
  upper: [],
  fold: 5066,
  foldFull: [5066]
}, {
  code: 43931,
  lower: [],
  title: [],
  upper: [],
  fold: 5067,
  foldFull: [5067]
}, {
  code: 43932,
  lower: [],
  title: [],
  upper: [],
  fold: 5068,
  foldFull: [5068]
}, {
  code: 43933,
  lower: [],
  title: [],
  upper: [],
  fold: 5069,
  foldFull: [5069]
}, {
  code: 43934,
  lower: [],
  title: [],
  upper: [],
  fold: 5070,
  foldFull: [5070]
}, {
  code: 43935,
  lower: [],
  title: [],
  upper: [],
  fold: 5071,
  foldFull: [5071]
}, {
  code: 43936,
  lower: [],
  title: [],
  upper: [],
  fold: 5072,
  foldFull: [5072]
}, {
  code: 43937,
  lower: [],
  title: [],
  upper: [],
  fold: 5073,
  foldFull: [5073]
}, {
  code: 43938,
  lower: [],
  title: [],
  upper: [],
  fold: 5074,
  foldFull: [5074]
}, {
  code: 43939,
  lower: [],
  title: [],
  upper: [],
  fold: 5075,
  foldFull: [5075]
}, {
  code: 43940,
  lower: [],
  title: [],
  upper: [],
  fold: 5076,
  foldFull: [5076]
}, {
  code: 43941,
  lower: [],
  title: [],
  upper: [],
  fold: 5077,
  foldFull: [5077]
}, {
  code: 43942,
  lower: [],
  title: [],
  upper: [],
  fold: 5078,
  foldFull: [5078]
}, {
  code: 43943,
  lower: [],
  title: [],
  upper: [],
  fold: 5079,
  foldFull: [5079]
}, {
  code: 43944,
  lower: [],
  title: [],
  upper: [],
  fold: 5080,
  foldFull: [5080]
}, {
  code: 43945,
  lower: [],
  title: [],
  upper: [],
  fold: 5081,
  foldFull: [5081]
}, {
  code: 43946,
  lower: [],
  title: [],
  upper: [],
  fold: 5082,
  foldFull: [5082]
}, {
  code: 43947,
  lower: [],
  title: [],
  upper: [],
  fold: 5083,
  foldFull: [5083]
}, {
  code: 43948,
  lower: [],
  title: [],
  upper: [],
  fold: 5084,
  foldFull: [5084]
}, {
  code: 43949,
  lower: [],
  title: [],
  upper: [],
  fold: 5085,
  foldFull: [5085]
}, {
  code: 43950,
  lower: [],
  title: [],
  upper: [],
  fold: 5086,
  foldFull: [5086]
}, {
  code: 43951,
  lower: [],
  title: [],
  upper: [],
  fold: 5087,
  foldFull: [5087]
}, {
  code: 43952,
  lower: [],
  title: [],
  upper: [],
  fold: 5088,
  foldFull: [5088]
}, {
  code: 43953,
  lower: [],
  title: [],
  upper: [],
  fold: 5089,
  foldFull: [5089]
}, {
  code: 43954,
  lower: [],
  title: [],
  upper: [],
  fold: 5090,
  foldFull: [5090]
}, {
  code: 43955,
  lower: [],
  title: [],
  upper: [],
  fold: 5091,
  foldFull: [5091]
}, {
  code: 43956,
  lower: [],
  title: [],
  upper: [],
  fold: 5092,
  foldFull: [5092]
}, {
  code: 43957,
  lower: [],
  title: [],
  upper: [],
  fold: 5093,
  foldFull: [5093]
}, {
  code: 43958,
  lower: [],
  title: [],
  upper: [],
  fold: 5094,
  foldFull: [5094]
}, {
  code: 43959,
  lower: [],
  title: [],
  upper: [],
  fold: 5095,
  foldFull: [5095]
}, {
  code: 43960,
  lower: [],
  title: [],
  upper: [],
  fold: 5096,
  foldFull: [5096]
}, {
  code: 43961,
  lower: [],
  title: [],
  upper: [],
  fold: 5097,
  foldFull: [5097]
}, {
  code: 43962,
  lower: [],
  title: [],
  upper: [],
  fold: 5098,
  foldFull: [5098]
}, {
  code: 43963,
  lower: [],
  title: [],
  upper: [],
  fold: 5099,
  foldFull: [5099]
}, {
  code: 43964,
  lower: [],
  title: [],
  upper: [],
  fold: 5100,
  foldFull: [5100]
}, {
  code: 43965,
  lower: [],
  title: [],
  upper: [],
  fold: 5101,
  foldFull: [5101]
}, {
  code: 43966,
  lower: [],
  title: [],
  upper: [],
  fold: 5102,
  foldFull: [5102]
}, {
  code: 43967,
  lower: [],
  title: [],
  upper: [],
  fold: 5103,
  foldFull: [5103]
}, {
  code: 64256,
  lower: [64256],
  title: [70, 102],
  upper: [70, 70],
  fold: 0,
  foldFull: [102, 102]
}, {
  code: 64256,
  lower: [64256],
  title: [70, 102],
  upper: [70, 70],
  fold: 0,
  foldFull: [102, 102]
}, {
  code: 64257,
  lower: [64257],
  title: [70, 105],
  upper: [70, 73],
  fold: 0,
  foldFull: [102, 105]
}, {
  code: 64257,
  lower: [64257],
  title: [70, 105],
  upper: [70, 73],
  fold: 0,
  foldFull: [102, 105]
}, {
  code: 64258,
  lower: [64258],
  title: [70, 108],
  upper: [70, 76],
  fold: 0,
  foldFull: [102, 108]
}, {
  code: 64258,
  lower: [64258],
  title: [70, 108],
  upper: [70, 76],
  fold: 0,
  foldFull: [102, 108]
}, {
  code: 64259,
  lower: [64259],
  title: [70, 102, 105],
  upper: [70, 70, 73],
  fold: 0,
  foldFull: [102, 102, 105]
}, {
  code: 64259,
  lower: [64259],
  title: [70, 102, 105],
  upper: [70, 70, 73],
  fold: 0,
  foldFull: [102, 102, 105]
}, {
  code: 64260,
  lower: [64260],
  title: [70, 102, 108],
  upper: [70, 70, 76],
  fold: 0,
  foldFull: [102, 102, 108]
}, {
  code: 64260,
  lower: [64260],
  title: [70, 102, 108],
  upper: [70, 70, 76],
  fold: 0,
  foldFull: [102, 102, 108]
}, {
  code: 64261,
  lower: [64261],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64261,
  lower: [64261],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64262,
  lower: [64262],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64262,
  lower: [64262],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64275,
  lower: [64275],
  title: [1348, 1398],
  upper: [1348, 1350],
  fold: 0,
  foldFull: [1396, 1398]
}, {
  code: 64275,
  lower: [64275],
  title: [1348, 1398],
  upper: [1348, 1350],
  fold: 0,
  foldFull: [1396, 1398]
}, {
  code: 64276,
  lower: [64276],
  title: [1348, 1381],
  upper: [1348, 1333],
  fold: 0,
  foldFull: [1396, 1381]
}, {
  code: 64276,
  lower: [64276],
  title: [1348, 1381],
  upper: [1348, 1333],
  fold: 0,
  foldFull: [1396, 1381]
}, {
  code: 64277,
  lower: [64277],
  title: [1348, 1387],
  upper: [1348, 1339],
  fold: 0,
  foldFull: [1396, 1387]
}, {
  code: 64277,
  lower: [64277],
  title: [1348, 1387],
  upper: [1348, 1339],
  fold: 0,
  foldFull: [1396, 1387]
}, {
  code: 64278,
  lower: [64278],
  title: [1358, 1398],
  upper: [1358, 1350],
  fold: 0,
  foldFull: [1406, 1398]
}, {
  code: 64278,
  lower: [64278],
  title: [1358, 1398],
  upper: [1358, 1350],
  fold: 0,
  foldFull: [1406, 1398]
}, {
  code: 64279,
  lower: [64279],
  title: [1348, 1389],
  upper: [1348, 1341],
  fold: 0,
  foldFull: [1396, 1389]
}, {
  code: 64279,
  lower: [64279],
  title: [1348, 1389],
  upper: [1348, 1341],
  fold: 0,
  foldFull: [1396, 1389]
}, {
  code: 65313,
  lower: [],
  title: [],
  upper: [],
  fold: 65345,
  foldFull: [65345]
}, {
  code: 65314,
  lower: [],
  title: [],
  upper: [],
  fold: 65346,
  foldFull: [65346]
}, {
  code: 65315,
  lower: [],
  title: [],
  upper: [],
  fold: 65347,
  foldFull: [65347]
}, {
  code: 65316,
  lower: [],
  title: [],
  upper: [],
  fold: 65348,
  foldFull: [65348]
}, {
  code: 65317,
  lower: [],
  title: [],
  upper: [],
  fold: 65349,
  foldFull: [65349]
}, {
  code: 65318,
  lower: [],
  title: [],
  upper: [],
  fold: 65350,
  foldFull: [65350]
}, {
  code: 65319,
  lower: [],
  title: [],
  upper: [],
  fold: 65351,
  foldFull: [65351]
}, {
  code: 65320,
  lower: [],
  title: [],
  upper: [],
  fold: 65352,
  foldFull: [65352]
}, {
  code: 65321,
  lower: [],
  title: [],
  upper: [],
  fold: 65353,
  foldFull: [65353]
}, {
  code: 65322,
  lower: [],
  title: [],
  upper: [],
  fold: 65354,
  foldFull: [65354]
}, {
  code: 65323,
  lower: [],
  title: [],
  upper: [],
  fold: 65355,
  foldFull: [65355]
}, {
  code: 65324,
  lower: [],
  title: [],
  upper: [],
  fold: 65356,
  foldFull: [65356]
}, {
  code: 65325,
  lower: [],
  title: [],
  upper: [],
  fold: 65357,
  foldFull: [65357]
}, {
  code: 65326,
  lower: [],
  title: [],
  upper: [],
  fold: 65358,
  foldFull: [65358]
}, {
  code: 65327,
  lower: [],
  title: [],
  upper: [],
  fold: 65359,
  foldFull: [65359]
}, {
  code: 65328,
  lower: [],
  title: [],
  upper: [],
  fold: 65360,
  foldFull: [65360]
}, {
  code: 65329,
  lower: [],
  title: [],
  upper: [],
  fold: 65361,
  foldFull: [65361]
}, {
  code: 65330,
  lower: [],
  title: [],
  upper: [],
  fold: 65362,
  foldFull: [65362]
}, {
  code: 65331,
  lower: [],
  title: [],
  upper: [],
  fold: 65363,
  foldFull: [65363]
}, {
  code: 65332,
  lower: [],
  title: [],
  upper: [],
  fold: 65364,
  foldFull: [65364]
}, {
  code: 65333,
  lower: [],
  title: [],
  upper: [],
  fold: 65365,
  foldFull: [65365]
}, {
  code: 65334,
  lower: [],
  title: [],
  upper: [],
  fold: 65366,
  foldFull: [65366]
}, {
  code: 65335,
  lower: [],
  title: [],
  upper: [],
  fold: 65367,
  foldFull: [65367]
}, {
  code: 65336,
  lower: [],
  title: [],
  upper: [],
  fold: 65368,
  foldFull: [65368]
}, {
  code: 65337,
  lower: [],
  title: [],
  upper: [],
  fold: 65369,
  foldFull: [65369]
}, {
  code: 65338,
  lower: [],
  title: [],
  upper: [],
  fold: 65370,
  foldFull: [65370]
}, {
  code: 66560,
  lower: [],
  title: [],
  upper: [],
  fold: 66600,
  foldFull: [66600]
}, {
  code: 66561,
  lower: [],
  title: [],
  upper: [],
  fold: 66601,
  foldFull: [66601]
}, {
  code: 66562,
  lower: [],
  title: [],
  upper: [],
  fold: 66602,
  foldFull: [66602]
}, {
  code: 66563,
  lower: [],
  title: [],
  upper: [],
  fold: 66603,
  foldFull: [66603]
}, {
  code: 66564,
  lower: [],
  title: [],
  upper: [],
  fold: 66604,
  foldFull: [66604]
}, {
  code: 66565,
  lower: [],
  title: [],
  upper: [],
  fold: 66605,
  foldFull: [66605]
}, {
  code: 66566,
  lower: [],
  title: [],
  upper: [],
  fold: 66606,
  foldFull: [66606]
}, {
  code: 66567,
  lower: [],
  title: [],
  upper: [],
  fold: 66607,
  foldFull: [66607]
}, {
  code: 66568,
  lower: [],
  title: [],
  upper: [],
  fold: 66608,
  foldFull: [66608]
}, {
  code: 66569,
  lower: [],
  title: [],
  upper: [],
  fold: 66609,
  foldFull: [66609]
}, {
  code: 66570,
  lower: [],
  title: [],
  upper: [],
  fold: 66610,
  foldFull: [66610]
}, {
  code: 66571,
  lower: [],
  title: [],
  upper: [],
  fold: 66611,
  foldFull: [66611]
}, {
  code: 66572,
  lower: [],
  title: [],
  upper: [],
  fold: 66612,
  foldFull: [66612]
}, {
  code: 66573,
  lower: [],
  title: [],
  upper: [],
  fold: 66613,
  foldFull: [66613]
}, {
  code: 66574,
  lower: [],
  title: [],
  upper: [],
  fold: 66614,
  foldFull: [66614]
}, {
  code: 66575,
  lower: [],
  title: [],
  upper: [],
  fold: 66615,
  foldFull: [66615]
}, {
  code: 66576,
  lower: [],
  title: [],
  upper: [],
  fold: 66616,
  foldFull: [66616]
}, {
  code: 66577,
  lower: [],
  title: [],
  upper: [],
  fold: 66617,
  foldFull: [66617]
}, {
  code: 66578,
  lower: [],
  title: [],
  upper: [],
  fold: 66618,
  foldFull: [66618]
}, {
  code: 66579,
  lower: [],
  title: [],
  upper: [],
  fold: 66619,
  foldFull: [66619]
}, {
  code: 66580,
  lower: [],
  title: [],
  upper: [],
  fold: 66620,
  foldFull: [66620]
}, {
  code: 66581,
  lower: [],
  title: [],
  upper: [],
  fold: 66621,
  foldFull: [66621]
}, {
  code: 66582,
  lower: [],
  title: [],
  upper: [],
  fold: 66622,
  foldFull: [66622]
}, {
  code: 66583,
  lower: [],
  title: [],
  upper: [],
  fold: 66623,
  foldFull: [66623]
}, {
  code: 66584,
  lower: [],
  title: [],
  upper: [],
  fold: 66624,
  foldFull: [66624]
}, {
  code: 66585,
  lower: [],
  title: [],
  upper: [],
  fold: 66625,
  foldFull: [66625]
}, {
  code: 66586,
  lower: [],
  title: [],
  upper: [],
  fold: 66626,
  foldFull: [66626]
}, {
  code: 66587,
  lower: [],
  title: [],
  upper: [],
  fold: 66627,
  foldFull: [66627]
}, {
  code: 66588,
  lower: [],
  title: [],
  upper: [],
  fold: 66628,
  foldFull: [66628]
}, {
  code: 66589,
  lower: [],
  title: [],
  upper: [],
  fold: 66629,
  foldFull: [66629]
}, {
  code: 66590,
  lower: [],
  title: [],
  upper: [],
  fold: 66630,
  foldFull: [66630]
}, {
  code: 66591,
  lower: [],
  title: [],
  upper: [],
  fold: 66631,
  foldFull: [66631]
}, {
  code: 66592,
  lower: [],
  title: [],
  upper: [],
  fold: 66632,
  foldFull: [66632]
}, {
  code: 66593,
  lower: [],
  title: [],
  upper: [],
  fold: 66633,
  foldFull: [66633]
}, {
  code: 66594,
  lower: [],
  title: [],
  upper: [],
  fold: 66634,
  foldFull: [66634]
}, {
  code: 66595,
  lower: [],
  title: [],
  upper: [],
  fold: 66635,
  foldFull: [66635]
}, {
  code: 66596,
  lower: [],
  title: [],
  upper: [],
  fold: 66636,
  foldFull: [66636]
}, {
  code: 66597,
  lower: [],
  title: [],
  upper: [],
  fold: 66637,
  foldFull: [66637]
}, {
  code: 66598,
  lower: [],
  title: [],
  upper: [],
  fold: 66638,
  foldFull: [66638]
}, {
  code: 66599,
  lower: [],
  title: [],
  upper: [],
  fold: 66639,
  foldFull: [66639]
}, {
  code: 66736,
  lower: [],
  title: [],
  upper: [],
  fold: 66776,
  foldFull: [66776]
}, {
  code: 66737,
  lower: [],
  title: [],
  upper: [],
  fold: 66777,
  foldFull: [66777]
}, {
  code: 66738,
  lower: [],
  title: [],
  upper: [],
  fold: 66778,
  foldFull: [66778]
}, {
  code: 66739,
  lower: [],
  title: [],
  upper: [],
  fold: 66779,
  foldFull: [66779]
}, {
  code: 66740,
  lower: [],
  title: [],
  upper: [],
  fold: 66780,
  foldFull: [66780]
}, {
  code: 66741,
  lower: [],
  title: [],
  upper: [],
  fold: 66781,
  foldFull: [66781]
}, {
  code: 66742,
  lower: [],
  title: [],
  upper: [],
  fold: 66782,
  foldFull: [66782]
}, {
  code: 66743,
  lower: [],
  title: [],
  upper: [],
  fold: 66783,
  foldFull: [66783]
}, {
  code: 66744,
  lower: [],
  title: [],
  upper: [],
  fold: 66784,
  foldFull: [66784]
}, {
  code: 66745,
  lower: [],
  title: [],
  upper: [],
  fold: 66785,
  foldFull: [66785]
}, {
  code: 66746,
  lower: [],
  title: [],
  upper: [],
  fold: 66786,
  foldFull: [66786]
}, {
  code: 66747,
  lower: [],
  title: [],
  upper: [],
  fold: 66787,
  foldFull: [66787]
}, {
  code: 66748,
  lower: [],
  title: [],
  upper: [],
  fold: 66788,
  foldFull: [66788]
}, {
  code: 66749,
  lower: [],
  title: [],
  upper: [],
  fold: 66789,
  foldFull: [66789]
}, {
  code: 66750,
  lower: [],
  title: [],
  upper: [],
  fold: 66790,
  foldFull: [66790]
}, {
  code: 66751,
  lower: [],
  title: [],
  upper: [],
  fold: 66791,
  foldFull: [66791]
}, {
  code: 66752,
  lower: [],
  title: [],
  upper: [],
  fold: 66792,
  foldFull: [66792]
}, {
  code: 66753,
  lower: [],
  title: [],
  upper: [],
  fold: 66793,
  foldFull: [66793]
}, {
  code: 66754,
  lower: [],
  title: [],
  upper: [],
  fold: 66794,
  foldFull: [66794]
}, {
  code: 66755,
  lower: [],
  title: [],
  upper: [],
  fold: 66795,
  foldFull: [66795]
}, {
  code: 66756,
  lower: [],
  title: [],
  upper: [],
  fold: 66796,
  foldFull: [66796]
}, {
  code: 66757,
  lower: [],
  title: [],
  upper: [],
  fold: 66797,
  foldFull: [66797]
}, {
  code: 66758,
  lower: [],
  title: [],
  upper: [],
  fold: 66798,
  foldFull: [66798]
}, {
  code: 66759,
  lower: [],
  title: [],
  upper: [],
  fold: 66799,
  foldFull: [66799]
}, {
  code: 66760,
  lower: [],
  title: [],
  upper: [],
  fold: 66800,
  foldFull: [66800]
}, {
  code: 66761,
  lower: [],
  title: [],
  upper: [],
  fold: 66801,
  foldFull: [66801]
}, {
  code: 66762,
  lower: [],
  title: [],
  upper: [],
  fold: 66802,
  foldFull: [66802]
}, {
  code: 66763,
  lower: [],
  title: [],
  upper: [],
  fold: 66803,
  foldFull: [66803]
}, {
  code: 66764,
  lower: [],
  title: [],
  upper: [],
  fold: 66804,
  foldFull: [66804]
}, {
  code: 66765,
  lower: [],
  title: [],
  upper: [],
  fold: 66805,
  foldFull: [66805]
}, {
  code: 66766,
  lower: [],
  title: [],
  upper: [],
  fold: 66806,
  foldFull: [66806]
}, {
  code: 66767,
  lower: [],
  title: [],
  upper: [],
  fold: 66807,
  foldFull: [66807]
}, {
  code: 66768,
  lower: [],
  title: [],
  upper: [],
  fold: 66808,
  foldFull: [66808]
}, {
  code: 66769,
  lower: [],
  title: [],
  upper: [],
  fold: 66809,
  foldFull: [66809]
}, {
  code: 66770,
  lower: [],
  title: [],
  upper: [],
  fold: 66810,
  foldFull: [66810]
}, {
  code: 66771,
  lower: [],
  title: [],
  upper: [],
  fold: 66811,
  foldFull: [66811]
}, {
  code: 68736,
  lower: [],
  title: [],
  upper: [],
  fold: 68800,
  foldFull: [68800]
}, {
  code: 68737,
  lower: [],
  title: [],
  upper: [],
  fold: 68801,
  foldFull: [68801]
}, {
  code: 68738,
  lower: [],
  title: [],
  upper: [],
  fold: 68802,
  foldFull: [68802]
}, {
  code: 68739,
  lower: [],
  title: [],
  upper: [],
  fold: 68803,
  foldFull: [68803]
}, {
  code: 68740,
  lower: [],
  title: [],
  upper: [],
  fold: 68804,
  foldFull: [68804]
}, {
  code: 68741,
  lower: [],
  title: [],
  upper: [],
  fold: 68805,
  foldFull: [68805]
}, {
  code: 68742,
  lower: [],
  title: [],
  upper: [],
  fold: 68806,
  foldFull: [68806]
}, {
  code: 68743,
  lower: [],
  title: [],
  upper: [],
  fold: 68807,
  foldFull: [68807]
}, {
  code: 68744,
  lower: [],
  title: [],
  upper: [],
  fold: 68808,
  foldFull: [68808]
}, {
  code: 68745,
  lower: [],
  title: [],
  upper: [],
  fold: 68809,
  foldFull: [68809]
}, {
  code: 68746,
  lower: [],
  title: [],
  upper: [],
  fold: 68810,
  foldFull: [68810]
}, {
  code: 68747,
  lower: [],
  title: [],
  upper: [],
  fold: 68811,
  foldFull: [68811]
}, {
  code: 68748,
  lower: [],
  title: [],
  upper: [],
  fold: 68812,
  foldFull: [68812]
}, {
  code: 68749,
  lower: [],
  title: [],
  upper: [],
  fold: 68813,
  foldFull: [68813]
}, {
  code: 68750,
  lower: [],
  title: [],
  upper: [],
  fold: 68814,
  foldFull: [68814]
}, {
  code: 68751,
  lower: [],
  title: [],
  upper: [],
  fold: 68815,
  foldFull: [68815]
}, {
  code: 68752,
  lower: [],
  title: [],
  upper: [],
  fold: 68816,
  foldFull: [68816]
}, {
  code: 68753,
  lower: [],
  title: [],
  upper: [],
  fold: 68817,
  foldFull: [68817]
}, {
  code: 68754,
  lower: [],
  title: [],
  upper: [],
  fold: 68818,
  foldFull: [68818]
}, {
  code: 68755,
  lower: [],
  title: [],
  upper: [],
  fold: 68819,
  foldFull: [68819]
}, {
  code: 68756,
  lower: [],
  title: [],
  upper: [],
  fold: 68820,
  foldFull: [68820]
}, {
  code: 68757,
  lower: [],
  title: [],
  upper: [],
  fold: 68821,
  foldFull: [68821]
}, {
  code: 68758,
  lower: [],
  title: [],
  upper: [],
  fold: 68822,
  foldFull: [68822]
}, {
  code: 68759,
  lower: [],
  title: [],
  upper: [],
  fold: 68823,
  foldFull: [68823]
}, {
  code: 68760,
  lower: [],
  title: [],
  upper: [],
  fold: 68824,
  foldFull: [68824]
}, {
  code: 68761,
  lower: [],
  title: [],
  upper: [],
  fold: 68825,
  foldFull: [68825]
}, {
  code: 68762,
  lower: [],
  title: [],
  upper: [],
  fold: 68826,
  foldFull: [68826]
}, {
  code: 68763,
  lower: [],
  title: [],
  upper: [],
  fold: 68827,
  foldFull: [68827]
}, {
  code: 68764,
  lower: [],
  title: [],
  upper: [],
  fold: 68828,
  foldFull: [68828]
}, {
  code: 68765,
  lower: [],
  title: [],
  upper: [],
  fold: 68829,
  foldFull: [68829]
}, {
  code: 68766,
  lower: [],
  title: [],
  upper: [],
  fold: 68830,
  foldFull: [68830]
}, {
  code: 68767,
  lower: [],
  title: [],
  upper: [],
  fold: 68831,
  foldFull: [68831]
}, {
  code: 68768,
  lower: [],
  title: [],
  upper: [],
  fold: 68832,
  foldFull: [68832]
}, {
  code: 68769,
  lower: [],
  title: [],
  upper: [],
  fold: 68833,
  foldFull: [68833]
}, {
  code: 68770,
  lower: [],
  title: [],
  upper: [],
  fold: 68834,
  foldFull: [68834]
}, {
  code: 68771,
  lower: [],
  title: [],
  upper: [],
  fold: 68835,
  foldFull: [68835]
}, {
  code: 68772,
  lower: [],
  title: [],
  upper: [],
  fold: 68836,
  foldFull: [68836]
}, {
  code: 68773,
  lower: [],
  title: [],
  upper: [],
  fold: 68837,
  foldFull: [68837]
}, {
  code: 68774,
  lower: [],
  title: [],
  upper: [],
  fold: 68838,
  foldFull: [68838]
}, {
  code: 68775,
  lower: [],
  title: [],
  upper: [],
  fold: 68839,
  foldFull: [68839]
}, {
  code: 68776,
  lower: [],
  title: [],
  upper: [],
  fold: 68840,
  foldFull: [68840]
}, {
  code: 68777,
  lower: [],
  title: [],
  upper: [],
  fold: 68841,
  foldFull: [68841]
}, {
  code: 68778,
  lower: [],
  title: [],
  upper: [],
  fold: 68842,
  foldFull: [68842]
}, {
  code: 68779,
  lower: [],
  title: [],
  upper: [],
  fold: 68843,
  foldFull: [68843]
}, {
  code: 68780,
  lower: [],
  title: [],
  upper: [],
  fold: 68844,
  foldFull: [68844]
}, {
  code: 68781,
  lower: [],
  title: [],
  upper: [],
  fold: 68845,
  foldFull: [68845]
}, {
  code: 68782,
  lower: [],
  title: [],
  upper: [],
  fold: 68846,
  foldFull: [68846]
}, {
  code: 68783,
  lower: [],
  title: [],
  upper: [],
  fold: 68847,
  foldFull: [68847]
}, {
  code: 68784,
  lower: [],
  title: [],
  upper: [],
  fold: 68848,
  foldFull: [68848]
}, {
  code: 68785,
  lower: [],
  title: [],
  upper: [],
  fold: 68849,
  foldFull: [68849]
}, {
  code: 68786,
  lower: [],
  title: [],
  upper: [],
  fold: 68850,
  foldFull: [68850]
}, {
  code: 71840,
  lower: [],
  title: [],
  upper: [],
  fold: 71872,
  foldFull: [71872]
}, {
  code: 71841,
  lower: [],
  title: [],
  upper: [],
  fold: 71873,
  foldFull: [71873]
}, {
  code: 71842,
  lower: [],
  title: [],
  upper: [],
  fold: 71874,
  foldFull: [71874]
}, {
  code: 71843,
  lower: [],
  title: [],
  upper: [],
  fold: 71875,
  foldFull: [71875]
}, {
  code: 71844,
  lower: [],
  title: [],
  upper: [],
  fold: 71876,
  foldFull: [71876]
}, {
  code: 71845,
  lower: [],
  title: [],
  upper: [],
  fold: 71877,
  foldFull: [71877]
}, {
  code: 71846,
  lower: [],
  title: [],
  upper: [],
  fold: 71878,
  foldFull: [71878]
}, {
  code: 71847,
  lower: [],
  title: [],
  upper: [],
  fold: 71879,
  foldFull: [71879]
}, {
  code: 71848,
  lower: [],
  title: [],
  upper: [],
  fold: 71880,
  foldFull: [71880]
}, {
  code: 71849,
  lower: [],
  title: [],
  upper: [],
  fold: 71881,
  foldFull: [71881]
}, {
  code: 71850,
  lower: [],
  title: [],
  upper: [],
  fold: 71882,
  foldFull: [71882]
}, {
  code: 71851,
  lower: [],
  title: [],
  upper: [],
  fold: 71883,
  foldFull: [71883]
}, {
  code: 71852,
  lower: [],
  title: [],
  upper: [],
  fold: 71884,
  foldFull: [71884]
}, {
  code: 71853,
  lower: [],
  title: [],
  upper: [],
  fold: 71885,
  foldFull: [71885]
}, {
  code: 71854,
  lower: [],
  title: [],
  upper: [],
  fold: 71886,
  foldFull: [71886]
}, {
  code: 71855,
  lower: [],
  title: [],
  upper: [],
  fold: 71887,
  foldFull: [71887]
}, {
  code: 71856,
  lower: [],
  title: [],
  upper: [],
  fold: 71888,
  foldFull: [71888]
}, {
  code: 71857,
  lower: [],
  title: [],
  upper: [],
  fold: 71889,
  foldFull: [71889]
}, {
  code: 71858,
  lower: [],
  title: [],
  upper: [],
  fold: 71890,
  foldFull: [71890]
}, {
  code: 71859,
  lower: [],
  title: [],
  upper: [],
  fold: 71891,
  foldFull: [71891]
}, {
  code: 71860,
  lower: [],
  title: [],
  upper: [],
  fold: 71892,
  foldFull: [71892]
}, {
  code: 71861,
  lower: [],
  title: [],
  upper: [],
  fold: 71893,
  foldFull: [71893]
}, {
  code: 71862,
  lower: [],
  title: [],
  upper: [],
  fold: 71894,
  foldFull: [71894]
}, {
  code: 71863,
  lower: [],
  title: [],
  upper: [],
  fold: 71895,
  foldFull: [71895]
}, {
  code: 71864,
  lower: [],
  title: [],
  upper: [],
  fold: 71896,
  foldFull: [71896]
}, {
  code: 71865,
  lower: [],
  title: [],
  upper: [],
  fold: 71897,
  foldFull: [71897]
}, {
  code: 71866,
  lower: [],
  title: [],
  upper: [],
  fold: 71898,
  foldFull: [71898]
}, {
  code: 71867,
  lower: [],
  title: [],
  upper: [],
  fold: 71899,
  foldFull: [71899]
}, {
  code: 71868,
  lower: [],
  title: [],
  upper: [],
  fold: 71900,
  foldFull: [71900]
}, {
  code: 71869,
  lower: [],
  title: [],
  upper: [],
  fold: 71901,
  foldFull: [71901]
}, {
  code: 71870,
  lower: [],
  title: [],
  upper: [],
  fold: 71902,
  foldFull: [71902]
}, {
  code: 71871,
  lower: [],
  title: [],
  upper: [],
  fold: 71903,
  foldFull: [71903]
}, {
  code: 93760,
  lower: [],
  title: [],
  upper: [],
  fold: 93792,
  foldFull: [93792]
}, {
  code: 93761,
  lower: [],
  title: [],
  upper: [],
  fold: 93793,
  foldFull: [93793]
}, {
  code: 93762,
  lower: [],
  title: [],
  upper: [],
  fold: 93794,
  foldFull: [93794]
}, {
  code: 93763,
  lower: [],
  title: [],
  upper: [],
  fold: 93795,
  foldFull: [93795]
}, {
  code: 93764,
  lower: [],
  title: [],
  upper: [],
  fold: 93796,
  foldFull: [93796]
}, {
  code: 93765,
  lower: [],
  title: [],
  upper: [],
  fold: 93797,
  foldFull: [93797]
}, {
  code: 93766,
  lower: [],
  title: [],
  upper: [],
  fold: 93798,
  foldFull: [93798]
}, {
  code: 93767,
  lower: [],
  title: [],
  upper: [],
  fold: 93799,
  foldFull: [93799]
}, {
  code: 93768,
  lower: [],
  title: [],
  upper: [],
  fold: 93800,
  foldFull: [93800]
}, {
  code: 93769,
  lower: [],
  title: [],
  upper: [],
  fold: 93801,
  foldFull: [93801]
}, {
  code: 93770,
  lower: [],
  title: [],
  upper: [],
  fold: 93802,
  foldFull: [93802]
}, {
  code: 93771,
  lower: [],
  title: [],
  upper: [],
  fold: 93803,
  foldFull: [93803]
}, {
  code: 93772,
  lower: [],
  title: [],
  upper: [],
  fold: 93804,
  foldFull: [93804]
}, {
  code: 93773,
  lower: [],
  title: [],
  upper: [],
  fold: 93805,
  foldFull: [93805]
}, {
  code: 93774,
  lower: [],
  title: [],
  upper: [],
  fold: 93806,
  foldFull: [93806]
}, {
  code: 93775,
  lower: [],
  title: [],
  upper: [],
  fold: 93807,
  foldFull: [93807]
}, {
  code: 93776,
  lower: [],
  title: [],
  upper: [],
  fold: 93808,
  foldFull: [93808]
}, {
  code: 93777,
  lower: [],
  title: [],
  upper: [],
  fold: 93809,
  foldFull: [93809]
}, {
  code: 93778,
  lower: [],
  title: [],
  upper: [],
  fold: 93810,
  foldFull: [93810]
}, {
  code: 93779,
  lower: [],
  title: [],
  upper: [],
  fold: 93811,
  foldFull: [93811]
}, {
  code: 93780,
  lower: [],
  title: [],
  upper: [],
  fold: 93812,
  foldFull: [93812]
}, {
  code: 93781,
  lower: [],
  title: [],
  upper: [],
  fold: 93813,
  foldFull: [93813]
}, {
  code: 93782,
  lower: [],
  title: [],
  upper: [],
  fold: 93814,
  foldFull: [93814]
}, {
  code: 93783,
  lower: [],
  title: [],
  upper: [],
  fold: 93815,
  foldFull: [93815]
}, {
  code: 93784,
  lower: [],
  title: [],
  upper: [],
  fold: 93816,
  foldFull: [93816]
}, {
  code: 93785,
  lower: [],
  title: [],
  upper: [],
  fold: 93817,
  foldFull: [93817]
}, {
  code: 93786,
  lower: [],
  title: [],
  upper: [],
  fold: 93818,
  foldFull: [93818]
}, {
  code: 93787,
  lower: [],
  title: [],
  upper: [],
  fold: 93819,
  foldFull: [93819]
}, {
  code: 93788,
  lower: [],
  title: [],
  upper: [],
  fold: 93820,
  foldFull: [93820]
}, {
  code: 93789,
  lower: [],
  title: [],
  upper: [],
  fold: 93821,
  foldFull: [93821]
}, {
  code: 93790,
  lower: [],
  title: [],
  upper: [],
  fold: 93822,
  foldFull: [93822]
}, {
  code: 93791,
  lower: [],
  title: [],
  upper: [],
  fold: 93823,
  foldFull: [93823]
}, {
  code: 125184,
  lower: [],
  title: [],
  upper: [],
  fold: 125218,
  foldFull: [125218]
}, {
  code: 125185,
  lower: [],
  title: [],
  upper: [],
  fold: 125219,
  foldFull: [125219]
}, {
  code: 125186,
  lower: [],
  title: [],
  upper: [],
  fold: 125220,
  foldFull: [125220]
}, {
  code: 125187,
  lower: [],
  title: [],
  upper: [],
  fold: 125221,
  foldFull: [125221]
}, {
  code: 125188,
  lower: [],
  title: [],
  upper: [],
  fold: 125222,
  foldFull: [125222]
}, {
  code: 125189,
  lower: [],
  title: [],
  upper: [],
  fold: 125223,
  foldFull: [125223]
}, {
  code: 125190,
  lower: [],
  title: [],
  upper: [],
  fold: 125224,
  foldFull: [125224]
}, {
  code: 125191,
  lower: [],
  title: [],
  upper: [],
  fold: 125225,
  foldFull: [125225]
}, {
  code: 125192,
  lower: [],
  title: [],
  upper: [],
  fold: 125226,
  foldFull: [125226]
}, {
  code: 125193,
  lower: [],
  title: [],
  upper: [],
  fold: 125227,
  foldFull: [125227]
}, {
  code: 125194,
  lower: [],
  title: [],
  upper: [],
  fold: 125228,
  foldFull: [125228]
}, {
  code: 125195,
  lower: [],
  title: [],
  upper: [],
  fold: 125229,
  foldFull: [125229]
}, {
  code: 125196,
  lower: [],
  title: [],
  upper: [],
  fold: 125230,
  foldFull: [125230]
}, {
  code: 125197,
  lower: [],
  title: [],
  upper: [],
  fold: 125231,
  foldFull: [125231]
}, {
  code: 125198,
  lower: [],
  title: [],
  upper: [],
  fold: 125232,
  foldFull: [125232]
}, {
  code: 125199,
  lower: [],
  title: [],
  upper: [],
  fold: 125233,
  foldFull: [125233]
}, {
  code: 125200,
  lower: [],
  title: [],
  upper: [],
  fold: 125234,
  foldFull: [125234]
}, {
  code: 125201,
  lower: [],
  title: [],
  upper: [],
  fold: 125235,
  foldFull: [125235]
}, {
  code: 125202,
  lower: [],
  title: [],
  upper: [],
  fold: 125236,
  foldFull: [125236]
}, {
  code: 125203,
  lower: [],
  title: [],
  upper: [],
  fold: 125237,
  foldFull: [125237]
}, {
  code: 125204,
  lower: [],
  title: [],
  upper: [],
  fold: 125238,
  foldFull: [125238]
}, {
  code: 125205,
  lower: [],
  title: [],
  upper: [],
  fold: 125239,
  foldFull: [125239]
}, {
  code: 125206,
  lower: [],
  title: [],
  upper: [],
  fold: 125240,
  foldFull: [125240]
}, {
  code: 125207,
  lower: [],
  title: [],
  upper: [],
  fold: 125241,
  foldFull: [125241]
}, {
  code: 125208,
  lower: [],
  title: [],
  upper: [],
  fold: 125242,
  foldFull: [125242]
}, {
  code: 125209,
  lower: [],
  title: [],
  upper: [],
  fold: 125243,
  foldFull: [125243]
}, {
  code: 125210,
  lower: [],
  title: [],
  upper: [],
  fold: 125244,
  foldFull: [125244]
}, {
  code: 125211,
  lower: [],
  title: [],
  upper: [],
  fold: 125245,
  foldFull: [125245]
}, {
  code: 125212,
  lower: [],
  title: [],
  upper: [],
  fold: 125246,
  foldFull: [125246]
}, {
  code: 125213,
  lower: [],
  title: [],
  upper: [],
  fold: 125247,
  foldFull: [125247]
}, {
  code: 125214,
  lower: [],
  title: [],
  upper: [],
  fold: 125248,
  foldFull: [125248]
}, {
  code: 125215,
  lower: [],
  title: [],
  upper: [],
  fold: 125249,
  foldFull: [125249]
}, {
  code: 125216,
  lower: [],
  title: [],
  upper: [],
  fold: 125250,
  foldFull: [125250]
}, {
  code: 125217,
  lower: [],
  title: [],
  upper: [],
  fold: 125251,
  foldFull: [125251]
}];
var recCmp = function(v) {
  return function(v1) {
    return compare3(v.code)(v1.code);
  };
};
var findRule = function(code) {
  var v = bsearch(zeroRec(code))(rules)(length3(rules))(recCmp);
  if (v instanceof Nothing) {
    return zeroRec(code);
  }
  ;
  if (v instanceof Just) {
    return v.value0;
  }
  ;
  throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal.Casing (line 1627, column 17 - line 1629, column 14): " + [v.constructor.name]);
};
var lower = function(code) {
  var lowered = findRule(code).lower;
  var $13 = $$null(lowered);
  if ($13) {
    return [uTowlower(code)];
  }
  ;
  return lowered;
};
var title = function(code) {
  var titled = findRule(code).title;
  var $14 = $$null(titled);
  if ($14) {
    return [uTowtitle(code)];
  }
  ;
  return titled;
};
var upper = function(code) {
  var uppered = findRule(code).upper;
  var $15 = $$null(uppered);
  if ($15) {
    return [uTowupper(code)];
  }
  ;
  return uppered;
};

// output/Data.CodePoint.Unicode/index.js
var fromEnum3 = /* @__PURE__ */ fromEnum(boundedEnumCodePoint);
var modifyFull = unsafeCoerce2;
var toLower2 = /* @__PURE__ */ modifyFull(lower);
var toTitle = /* @__PURE__ */ modifyFull(title);
var toUpper2 = /* @__PURE__ */ modifyFull(upper);
var isLower = function($68) {
  return uIswlower(fromEnum3($68));
};
var isAlpha = function($71) {
  return uIswalpha(fromEnum3($71));
};

// output/Data.GraphQL.AST/index.js
var SCHEMA = /* @__PURE__ */ function() {
  function SCHEMA2() {
  }
  ;
  SCHEMA2.value = new SCHEMA2();
  return SCHEMA2;
}();
var SCALAR = /* @__PURE__ */ function() {
  function SCALAR2() {
  }
  ;
  SCALAR2.value = new SCALAR2();
  return SCALAR2;
}();
var OBJECT = /* @__PURE__ */ function() {
  function OBJECT2() {
  }
  ;
  OBJECT2.value = new OBJECT2();
  return OBJECT2;
}();
var FIELD_DEFINITION = /* @__PURE__ */ function() {
  function FIELD_DEFINITION2() {
  }
  ;
  FIELD_DEFINITION2.value = new FIELD_DEFINITION2();
  return FIELD_DEFINITION2;
}();
var ARGUMENT_DEFINITION = /* @__PURE__ */ function() {
  function ARGUMENT_DEFINITION2() {
  }
  ;
  ARGUMENT_DEFINITION2.value = new ARGUMENT_DEFINITION2();
  return ARGUMENT_DEFINITION2;
}();
var INTERFACE = /* @__PURE__ */ function() {
  function INTERFACE2() {
  }
  ;
  INTERFACE2.value = new INTERFACE2();
  return INTERFACE2;
}();
var UNION = /* @__PURE__ */ function() {
  function UNION2() {
  }
  ;
  UNION2.value = new UNION2();
  return UNION2;
}();
var ENUM = /* @__PURE__ */ function() {
  function ENUM2() {
  }
  ;
  ENUM2.value = new ENUM2();
  return ENUM2;
}();
var ENUM_VALUE = /* @__PURE__ */ function() {
  function ENUM_VALUE2() {
  }
  ;
  ENUM_VALUE2.value = new ENUM_VALUE2();
  return ENUM_VALUE2;
}();
var INPUT_OBJECT = /* @__PURE__ */ function() {
  function INPUT_OBJECT2() {
  }
  ;
  INPUT_OBJECT2.value = new INPUT_OBJECT2();
  return INPUT_OBJECT2;
}();
var INPUT_FIELD_DEFINITION = /* @__PURE__ */ function() {
  function INPUT_FIELD_DEFINITION2() {
  }
  ;
  INPUT_FIELD_DEFINITION2.value = new INPUT_FIELD_DEFINITION2();
  return INPUT_FIELD_DEFINITION2;
}();
var Query = /* @__PURE__ */ function() {
  function Query2() {
  }
  ;
  Query2.value = new Query2();
  return Query2;
}();
var Mutation = /* @__PURE__ */ function() {
  function Mutation2() {
  }
  ;
  Mutation2.value = new Mutation2();
  return Mutation2;
}();
var Subscription = /* @__PURE__ */ function() {
  function Subscription2() {
  }
  ;
  Subscription2.value = new Subscription2();
  return Subscription2;
}();
var NamedType = function(x) {
  return x;
};
var UnionMemberTypes = function(x) {
  return x;
};
var Type_NamedType = /* @__PURE__ */ function() {
  function Type_NamedType2(value0) {
    this.value0 = value0;
  }
  ;
  Type_NamedType2.create = function(value0) {
    return new Type_NamedType2(value0);
  };
  return Type_NamedType2;
}();
var Type_ListType = /* @__PURE__ */ function() {
  function Type_ListType2(value0) {
    this.value0 = value0;
  }
  ;
  Type_ListType2.create = function(value0) {
    return new Type_ListType2(value0);
  };
  return Type_ListType2;
}();
var Type_NonNullType = /* @__PURE__ */ function() {
  function Type_NonNullType2(value0) {
    this.value0 = value0;
  }
  ;
  Type_NonNullType2.create = function(value0) {
    return new Type_NonNullType2(value0);
  };
  return Type_NonNullType2;
}();
var NonNullType_NamedType = /* @__PURE__ */ function() {
  function NonNullType_NamedType2(value0) {
    this.value0 = value0;
  }
  ;
  NonNullType_NamedType2.create = function(value0) {
    return new NonNullType_NamedType2(value0);
  };
  return NonNullType_NamedType2;
}();
var NonNullType_ListType = /* @__PURE__ */ function() {
  function NonNullType_ListType2(value0) {
    this.value0 = value0;
  }
  ;
  NonNullType_ListType2.create = function(value0) {
    return new NonNullType_ListType2(value0);
  };
  return NonNullType_ListType2;
}();
var QUERY = /* @__PURE__ */ function() {
  function QUERY2() {
  }
  ;
  QUERY2.value = new QUERY2();
  return QUERY2;
}();
var MUTATION = /* @__PURE__ */ function() {
  function MUTATION2() {
  }
  ;
  MUTATION2.value = new MUTATION2();
  return MUTATION2;
}();
var SUBSCRIPTION = /* @__PURE__ */ function() {
  function SUBSCRIPTION2() {
  }
  ;
  SUBSCRIPTION2.value = new SUBSCRIPTION2();
  return SUBSCRIPTION2;
}();
var FIELD = /* @__PURE__ */ function() {
  function FIELD2() {
  }
  ;
  FIELD2.value = new FIELD2();
  return FIELD2;
}();
var FRAGMENT_DEFINITION = /* @__PURE__ */ function() {
  function FRAGMENT_DEFINITION2() {
  }
  ;
  FRAGMENT_DEFINITION2.value = new FRAGMENT_DEFINITION2();
  return FRAGMENT_DEFINITION2;
}();
var FRAGMENT_SPREAD = /* @__PURE__ */ function() {
  function FRAGMENT_SPREAD2() {
  }
  ;
  FRAGMENT_SPREAD2.value = new FRAGMENT_SPREAD2();
  return FRAGMENT_SPREAD2;
}();
var INLINE_FRAGMENT = /* @__PURE__ */ function() {
  function INLINE_FRAGMENT2() {
  }
  ;
  INLINE_FRAGMENT2.value = new INLINE_FRAGMENT2();
  return INLINE_FRAGMENT2;
}();
var DirectiveLocation_ExecutableDirectiveLocation = /* @__PURE__ */ function() {
  function DirectiveLocation_ExecutableDirectiveLocation2(value0) {
    this.value0 = value0;
  }
  ;
  DirectiveLocation_ExecutableDirectiveLocation2.create = function(value0) {
    return new DirectiveLocation_ExecutableDirectiveLocation2(value0);
  };
  return DirectiveLocation_ExecutableDirectiveLocation2;
}();
var DirectiveLocation_TypeSystemDirectiveLocation = /* @__PURE__ */ function() {
  function DirectiveLocation_TypeSystemDirectiveLocation2(value0) {
    this.value0 = value0;
  }
  ;
  DirectiveLocation_TypeSystemDirectiveLocation2.create = function(value0) {
    return new DirectiveLocation_TypeSystemDirectiveLocation2(value0);
  };
  return DirectiveLocation_TypeSystemDirectiveLocation2;
}();
var EnumValuesDefinition = function(x) {
  return x;
};
var ArgumentsDefinition = function(x) {
  return x;
};
var FieldsDefinition = function(x) {
  return x;
};
var InputFieldsDefinition = function(x) {
  return x;
};
var TypeDefinition_ScalarTypeDefinition = /* @__PURE__ */ function() {
  function TypeDefinition_ScalarTypeDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeDefinition_ScalarTypeDefinition2.create = function(value0) {
    return new TypeDefinition_ScalarTypeDefinition2(value0);
  };
  return TypeDefinition_ScalarTypeDefinition2;
}();
var TypeDefinition_ObjectTypeDefinition = /* @__PURE__ */ function() {
  function TypeDefinition_ObjectTypeDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeDefinition_ObjectTypeDefinition2.create = function(value0) {
    return new TypeDefinition_ObjectTypeDefinition2(value0);
  };
  return TypeDefinition_ObjectTypeDefinition2;
}();
var TypeDefinition_InterfaceTypeDefinition = /* @__PURE__ */ function() {
  function TypeDefinition_InterfaceTypeDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeDefinition_InterfaceTypeDefinition2.create = function(value0) {
    return new TypeDefinition_InterfaceTypeDefinition2(value0);
  };
  return TypeDefinition_InterfaceTypeDefinition2;
}();
var TypeDefinition_UnionTypeDefinition = /* @__PURE__ */ function() {
  function TypeDefinition_UnionTypeDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeDefinition_UnionTypeDefinition2.create = function(value0) {
    return new TypeDefinition_UnionTypeDefinition2(value0);
  };
  return TypeDefinition_UnionTypeDefinition2;
}();
var TypeDefinition_EnumTypeDefinition = /* @__PURE__ */ function() {
  function TypeDefinition_EnumTypeDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeDefinition_EnumTypeDefinition2.create = function(value0) {
    return new TypeDefinition_EnumTypeDefinition2(value0);
  };
  return TypeDefinition_EnumTypeDefinition2;
}();
var TypeDefinition_InputObjectTypeDefinition = /* @__PURE__ */ function() {
  function TypeDefinition_InputObjectTypeDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeDefinition_InputObjectTypeDefinition2.create = function(value0) {
    return new TypeDefinition_InputObjectTypeDefinition2(value0);
  };
  return TypeDefinition_InputObjectTypeDefinition2;
}();
var TypeSystemDefinition_SchemaDefinition = /* @__PURE__ */ function() {
  function TypeSystemDefinition_SchemaDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeSystemDefinition_SchemaDefinition2.create = function(value0) {
    return new TypeSystemDefinition_SchemaDefinition2(value0);
  };
  return TypeSystemDefinition_SchemaDefinition2;
}();
var TypeSystemDefinition_TypeDefinition = /* @__PURE__ */ function() {
  function TypeSystemDefinition_TypeDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeSystemDefinition_TypeDefinition2.create = function(value0) {
    return new TypeSystemDefinition_TypeDefinition2(value0);
  };
  return TypeSystemDefinition_TypeDefinition2;
}();
var TypeSystemDefinition_DirectiveDefinition = /* @__PURE__ */ function() {
  function TypeSystemDefinition_DirectiveDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  TypeSystemDefinition_DirectiveDefinition2.create = function(value0) {
    return new TypeSystemDefinition_DirectiveDefinition2(value0);
  };
  return TypeSystemDefinition_DirectiveDefinition2;
}();
var Definition_ExecutableDefinition = /* @__PURE__ */ function() {
  function Definition_ExecutableDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  Definition_ExecutableDefinition2.create = function(value0) {
    return new Definition_ExecutableDefinition2(value0);
  };
  return Definition_ExecutableDefinition2;
}();
var Definition_TypeSystemDefinition = /* @__PURE__ */ function() {
  function Definition_TypeSystemDefinition2(value0) {
    this.value0 = value0;
  }
  ;
  Definition_TypeSystemDefinition2.create = function(value0) {
    return new Definition_TypeSystemDefinition2(value0);
  };
  return Definition_TypeSystemDefinition2;
}();
var Definition_TypeSystemExtension = /* @__PURE__ */ function() {
  function Definition_TypeSystemExtension2(value0) {
    this.value0 = value0;
  }
  ;
  Definition_TypeSystemExtension2.create = function(value0) {
    return new Definition_TypeSystemExtension2(value0);
  };
  return Definition_TypeSystemExtension2;
}();
var Document = function(x) {
  return x;
};
var _TypeSystemDefinition_TypeDefinition = /* @__PURE__ */ function() {
  return new Tuple(TypeSystemDefinition_TypeDefinition.create, function(v) {
    if (v instanceof TypeSystemDefinition_TypeDefinition) {
      return new Just(v.value0);
    }
    ;
    return Nothing.value;
  });
}();
var _TypeDefinition_ObjectTypeDefinition = /* @__PURE__ */ function() {
  return new Tuple(TypeDefinition_ObjectTypeDefinition.create, function(v) {
    if (v instanceof TypeDefinition_ObjectTypeDefinition) {
      return new Just(v.value0);
    }
    ;
    return Nothing.value;
  });
}();
var _TypeDefinition_InputObjectTypeDefinition = /* @__PURE__ */ function() {
  return new Tuple(TypeDefinition_InputObjectTypeDefinition.create, function(v) {
    if (v instanceof TypeDefinition_InputObjectTypeDefinition) {
      return new Just(v.value0);
    }
    ;
    return Nothing.value;
  });
}();
var _InputFieldsDefinition = /* @__PURE__ */ function() {
  return new Tuple(InputFieldsDefinition, function(v) {
    return new Just(v);
  });
}();
var _Document = /* @__PURE__ */ function() {
  return new Tuple(Document, function(v) {
    return new Just(v);
  });
}();
var _Definition_TypeSystemDefinition = /* @__PURE__ */ function() {
  return new Tuple(Definition_TypeSystemDefinition.create, function(v) {
    if (v instanceof Definition_TypeSystemDefinition) {
      return new Just(v.value0);
    }
    ;
    return Nothing.value;
  });
}();

// output/Data.String.Regex/foreign.js
var regexImpl = function(left2) {
  return function(right2) {
    return function(s1) {
      return function(s2) {
        try {
          return right2(new RegExp(s1, s2));
        } catch (e) {
          return left2(e.message);
        }
      };
    };
  };
};
var test = function(r) {
  return function(s) {
    var lastIndex = r.lastIndex;
    var result = r.test(s);
    r.lastIndex = lastIndex;
    return result;
  };
};
var _match = function(just) {
  return function(nothing) {
    return function(r) {
      return function(s) {
        var m = s.match(r);
        if (m == null || m.length === 0) {
          return nothing;
        } else {
          for (var i = 0; i < m.length; i++) {
            m[i] = m[i] == null ? nothing : just(m[i]);
          }
          return just(m);
        }
      };
    };
  };
};
var split2 = function(r) {
  return function(s) {
    return s.split(r);
  };
};

// output/Data.String.Regex.Flags/index.js
var global = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  sticky: false,
  unicode: false
};

// output/Data.String.Regex/index.js
var renderFlags = function(v) {
  return function() {
    if (v.global) {
      return "g";
    }
    ;
    return "";
  }() + (function() {
    if (v.ignoreCase) {
      return "i";
    }
    ;
    return "";
  }() + (function() {
    if (v.multiline) {
      return "m";
    }
    ;
    return "";
  }() + (function() {
    if (v.dotAll) {
      return "s";
    }
    ;
    return "";
  }() + (function() {
    if (v.sticky) {
      return "y";
    }
    ;
    return "";
  }() + function() {
    if (v.unicode) {
      return "u";
    }
    ;
    return "";
  }()))));
};
var regex = function(s) {
  return function(f) {
    return regexImpl(Left.create)(Right.create)(s)(renderFlags(f));
  };
};
var match = /* @__PURE__ */ function() {
  return _match(Just.create)(Nothing.value);
}();

// output/Data.String.Regex.Unsafe/index.js
var identity12 = /* @__PURE__ */ identity(categoryFn);
var unsafeRegex = function(s) {
  return function(f) {
    return either(unsafeCrashWith)(identity12)(regex(s)(f));
  };
};

// output/Data.String.Unicode/index.js
var bindFlipped3 = /* @__PURE__ */ bindFlipped(bindArray);
var convertFull = function(f) {
  var $4 = bindFlipped3(f);
  return function($5) {
    return fromCodePointArray($4(toCodePointArray($5)));
  };
};
var toLower3 = /* @__PURE__ */ convertFull(toLower2);
var toUpper3 = /* @__PURE__ */ convertFull(toUpper2);

// output/Data.String.Extra/index.js
var foldMap3 = /* @__PURE__ */ foldMap(foldableMaybe);
var foldMap12 = /* @__PURE__ */ foldMap3(monoidString);
var foldMap22 = /* @__PURE__ */ foldMap3(monoidArray);
var foldMap32 = /* @__PURE__ */ foldMap(foldableArray)(monoidString);
var upperCaseFirst = /* @__PURE__ */ function() {
  var $17 = foldMap12(function(v) {
    return fromCodePointArray(toTitle(v.head)) + toLower3(v.tail);
  });
  return function($18) {
    return $17(uncons3($18));
  };
}();
var regexGlobal = function(regexStr) {
  return unsafeRegex(regexStr)(global);
};
var regexHasASCIIWords = /* @__PURE__ */ regexGlobal("[^\0-/:-@[-`{-\x7F]+");
var regexHasUnicodeWords = /* @__PURE__ */ regexGlobal("[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9]");
var regexUnicodeWords = /* @__PURE__ */ function() {
  var rsUpper = "[A-Z\\xc0-\\xd6\\xd8-\\xde]";
  var rsOptVar = "[\\ufe0e\\ufe0f]?";
  var rsLower = "[a-z\\xdf-\\xf6\\xf8-\\xff]";
  var rsDingbat = "[\\u2700-\\u27bf]";
  var rsBreakRange = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
  var rsBreak = "[" + (rsBreakRange + "]");
  var rsMisc = "[^" + ("\\ud800-\\udfff" + (rsBreakRange + "\\d\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]"));
  var rsMiscLower = "(?:" + (rsLower + ("|" + (rsMisc + ")")));
  var rsMiscUpper = "(?:" + (rsUpper + ("|" + (rsMisc + ")")));
  var rsNonAstral = "[^\\ud800-\\udfff]";
  var rsOptContrLower = "(?:['\\u2019](?:d|ll|m|re|s|t|ve))?";
  var rsOptContrUpper = "(?:['\\u2019](?:D|LL|M|RE|S|T|VE))?";
  var rsComboRange = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\u1ab0-\\u1aff\\u1dc0-\\u1dff";
  var rsCombo = "[" + (rsComboRange + "]");
  var rsModifier = "(?:" + (rsCombo + "|\\ud83c[\\udffb-\\udfff])");
  var reOptMod = rsModifier + "?";
  var rsOptJoin = "(?:" + ("\\u200d" + ("(?:" + (rsNonAstral + ("|" + ("(?:\\ud83c[\\udde6-\\uddff]){2}" + ("|" + ("[\\ud800-\\udbff][\\udc00-\\udfff]" + (")" + (rsOptVar + (reOptMod + ")*"))))))))));
  var rsSeq = rsOptVar + (reOptMod + rsOptJoin);
  var rsEmoji = "(?:" + (rsDingbat + ("|" + ("(?:\\ud83c[\\udde6-\\uddff]){2}" + ("|" + ("[\\ud800-\\udbff][\\udc00-\\udfff]" + (")" + rsSeq))))));
  return regexGlobal(joinWith("|")([rsUpper + ("?" + (rsLower + ("+" + (rsOptContrLower + ("(?=" + (rsBreak + ("|" + (rsUpper + "|$)")))))))), rsMiscUpper + ("+" + (rsOptContrUpper + ("(?=" + (rsBreak + ("|" + (rsUpper + (rsMiscLower + "|$)"))))))), rsUpper + ("?" + (rsMiscLower + ("+" + rsOptContrLower))), rsUpper + ("+" + rsOptContrUpper), "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", rsEmoji]));
}();
var unicodeWords = /* @__PURE__ */ function() {
  var $19 = foldMap22(catMaybes3);
  var $20 = match(regexUnicodeWords);
  return function($21) {
    return $19($20($21));
  };
}();
var hasUnicodeWords = /* @__PURE__ */ test(regexHasUnicodeWords);
var asciiWords = /* @__PURE__ */ function() {
  var $22 = foldMap22(catMaybes3);
  var $23 = match(regexHasASCIIWords);
  return function($24) {
    return $22($23($24));
  };
}();
var words = function(string) {
  var $13 = hasUnicodeWords(string);
  if ($13) {
    return unicodeWords(string);
  }
  ;
  return asciiWords(string);
};
var pascalCase = /* @__PURE__ */ function() {
  var $28 = foldMap32(upperCaseFirst);
  return function($29) {
    return $28(words($29));
  };
}();

// output/GraphQL.Client.CodeGen.IntrospectionResult/index.js
var map12 = /* @__PURE__ */ map(functorEither);
var wrap2 = /* @__PURE__ */ wrap();
var gDecodeJsonCons2 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonString));
var gDecodeJsonCons1 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(decodeJsonString));
var ofTypeIsSymbol = {
  reflectSymbol: function() {
    return "ofType";
  }
};
var nameIsSymbol = {
  reflectSymbol: function() {
    return "name";
  }
};
var kindIsSymbol = {
  reflectSymbol: function() {
    return "kind";
  }
};
var decodeJsonTypeRef = {
  decodeJson: function(a) {
    return map12(wrap2)(decodeJson(decodeRecord(gDecodeJsonCons2(gDecodeJsonCons1(gDecodeJsonCons(decodeFieldMaybe(decodeJsonTypeRef))(gDecodeJsonNil)(ofTypeIsSymbol)()())(nameIsSymbol)()())(kindIsSymbol)()())())(a));
  }
};

// output/Parsing/index.js
var ParseError = /* @__PURE__ */ function() {
  function ParseError2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  ParseError2.create = function(value0) {
    return function(value1) {
      return new ParseError2(value0, value1);
    };
  };
  return ParseError2;
}();
var parseErrorMessage = function(v) {
  return v.value0;
};
var initialPos = {
  index: 0,
  line: 1,
  column: 1
};

// output/GraphQL.Client.CodeGen.DocumentFromIntrospection/index.js
var bind3 = /* @__PURE__ */ bind(bindEither);
var pure4 = /* @__PURE__ */ pure(applicativeEither);
var pure1 = /* @__PURE__ */ pure(applicativeList);
var wrap3 = /* @__PURE__ */ wrap();
var unwrap3 = /* @__PURE__ */ unwrap();
var fold4 = /* @__PURE__ */ fold(foldableMaybe)(monoidString);
var fromFoldable6 = /* @__PURE__ */ fromFoldable(foldableArray);
var map13 = /* @__PURE__ */ map(functorList);
var map1 = /* @__PURE__ */ map(functorMaybe);
var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeEither);
var map23 = /* @__PURE__ */ map(functorEither);
var append12 = /* @__PURE__ */ append(semigroupList);
var bind1 = /* @__PURE__ */ bind(bindMaybe);
var traverse12 = /* @__PURE__ */ traverse(traversableList)(applicativeEither);
var append2 = /* @__PURE__ */ append(/* @__PURE__ */ semigroupEither(semigroupList));
var gDecodeJsonCons3 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(decodeJsonString));
var gDecodeJsonCons12 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonString));
var nameIsSymbol2 = {
  reflectSymbol: function() {
    return "name";
  }
};
var gDecodeJsonCons22 = /* @__PURE__ */ gDecodeJsonCons12(/* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonTypeRef))(gDecodeJsonNil)({
  reflectSymbol: function() {
    return "type";
  }
})()())(nameIsSymbol2)()();
var descriptionIsSymbol = {
  reflectSymbol: function() {
    return "description";
  }
};
var decodeArray3 = /* @__PURE__ */ decodeArray2(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons3(/* @__PURE__ */ gDecodeJsonCons3(gDecodeJsonCons22)(descriptionIsSymbol)()())({
  reflectSymbol: function() {
    return "defaultValue";
  }
})()())());
var gDecodeJsonCons32 = /* @__PURE__ */ gDecodeJsonCons12(gDecodeJsonNil)(nameIsSymbol2)()();
var argsIsSymbol = {
  reflectSymbol: function() {
    return "args";
  }
};
var decodeRecord2 = /* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons3(gDecodeJsonNil)(nameIsSymbol2)()())();
var gDecodeJsonCons4 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(decodeRecord2));
var gDecodeJsonCons5 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonBoolean));
var isDeprecatedIsSymbol = {
  reflectSymbol: function() {
    return "isDeprecated";
  }
};
var deprecationReasonIsSymbol = {
  reflectSymbol: function() {
    return "deprecationReason";
  }
};
var gDecodeJsonCons6 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(decodeArray3));
var gDecodeJsonCons7 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(/* @__PURE__ */ decodeArray2(decodeJsonTypeRef)));
var lmap4 = /* @__PURE__ */ lmap(bifunctorEither);
var JsonDecodeError = /* @__PURE__ */ function() {
  function JsonDecodeError2(value0) {
    this.value0 = value0;
  }
  ;
  JsonDecodeError2.create = function(value0) {
    return new JsonDecodeError2(value0);
  };
  return JsonDecodeError2;
}();
var InvalidIntrospectionSchema = /* @__PURE__ */ function() {
  function InvalidIntrospectionSchema2(value0) {
    this.value0 = value0;
  }
  ;
  InvalidIntrospectionSchema2.create = function(value0) {
    return new InvalidIntrospectionSchema2(value0);
  };
  return InvalidIntrospectionSchema2;
}();
var toParserError = function(v) {
  if (v instanceof JsonDecodeError) {
    return new ParseError(printJsonDecodeError(v.value0), initialPos);
  }
  ;
  if (v instanceof InvalidIntrospectionSchema) {
    return new ParseError(v.value0, initialPos);
  }
  ;
  throw new Error("Failed pattern match at GraphQL.Client.CodeGen.DocumentFromIntrospection (line 241, column 17 - line 243, column 58): " + [v.constructor.name]);
};
var startsWith = function(pre) {
  return function(str) {
    return take4(length4(pre))(str) === pre;
  };
};
var noSchemaTypes = /* @__PURE__ */ filter3(/* @__PURE__ */ function() {
  var $260 = maybe(true)(not(heytingAlgebraFunction(heytingAlgebraFunction(heytingAlgebraBoolean)))(startsWith)("__"));
  return function($261) {
    return $260(function(v) {
      return v.name;
    }($261));
  };
}());
var documentFromIntrospection = /* @__PURE__ */ function() {
  var toDocument = function(v) {
    var toScalarDefinition = function(fullType) {
      return bind3(note("No name for scalar type")(fullType.name))(function(name2) {
        return pure4({
          description: fullType.description,
          name: name2,
          directives: Nothing.value
        });
      });
    };
    var toRootOp = function(opType) {
      return function(name2) {
        return pure1({
          namedType: wrap3(name2),
          operationType: opType
        });
      };
    };
    var toNamedType = function($262) {
      return NamedType(fold4(function(v1) {
        return v1.name;
      }(unwrap3($262))));
    };
    var toUnionMemberTypes = function() {
      var $263 = map13(toNamedType);
      return function($264) {
        return UnionMemberTypes($263(fromFoldable6($264)));
      };
    }();
    var toUnionDefinition = function(fullType) {
      return bind3(note("No name for union type")(fullType.name))(function(name2) {
        return pure4({
          description: fullType.description,
          directives: Nothing.value,
          name: name2,
          unionMemberTypes: map1(toUnionMemberTypes)(fullType.possibleTypes)
        });
      });
    };
    var toType = function(v1) {
      var v2 = function(v3) {
        var v4 = function(v5) {
          return new Type_NamedType(fold4(v1.name));
        };
        if (v1.kind === "NON_NULL") {
          if (v1.ofType instanceof Just) {
            return new Type_NonNullType(toNonNullType(v1.ofType.value0));
          }
          ;
          return v4(true);
        }
        ;
        return v4(true);
      };
      if (v1.kind === "LIST") {
        if (v1.ofType instanceof Just) {
          return new Type_ListType(toListType(v1.ofType.value0));
        }
        ;
        return v2(true);
      }
      ;
      return v2(true);
    };
    var toNonNullType = function(v1) {
      var v2 = function(v3) {
        return new NonNullType_NamedType(fold4(v1.name));
      };
      if (v1.kind === "LIST") {
        if (v1.ofType instanceof Just) {
          return new NonNullType_ListType(toListType(v1.ofType.value0));
        }
        ;
        return v2(true);
      }
      ;
      return v2(true);
    };
    var toListType = function(t) {
      return toType(t);
    };
    var toInputValueDefinition = function(inputValue) {
      return {
        defaultValue: Nothing.value,
        description: inputValue.description,
        directives: Nothing.value,
        name: inputValue.name,
        type: toType(inputValue.type)
      };
    };
    var toInputFieldsDefintion = function() {
      var $265 = map13(toInputValueDefinition);
      return function($266) {
        return InputFieldsDefinition($265(fromFoldable6($266)));
      };
    }();
    var toInputObjectDefinition = function(fullType) {
      return bind3(note("No name for input object type")(fullType.name))(function(name2) {
        return pure4({
          description: fullType.description,
          directives: Nothing.value,
          inputFieldsDefinition: map1(toInputFieldsDefintion)(fullType.inputFields),
          name: name2
        });
      });
    };
    var toEnumValueDefinition = function(enumValue) {
      return {
        description: enumValue.description,
        directives: Nothing.value,
        enumValue: wrap3(enumValue.name)
      };
    };
    var toEnumValuesDefintion = function() {
      var $267 = map13(toEnumValueDefinition);
      return function($268) {
        return EnumValuesDefinition($267(fromFoldable6($268)));
      };
    }();
    var toEnumDefinition = function(fullType) {
      return bind3(note("No name for enum type")(fullType.name))(function(name2) {
        return pure4({
          description: fullType.description,
          directives: Nothing.value,
          name: name2,
          enumValuesDefinition: map1(toEnumValuesDefintion)(fullType.enumValues)
        });
      });
    };
    var toDirectiveLocation = function(v1) {
      if (v1 === "QUERY") {
        return new Right(new DirectiveLocation_ExecutableDirectiveLocation(QUERY.value));
      }
      ;
      if (v1 === "MUTATION") {
        return new Right(new DirectiveLocation_ExecutableDirectiveLocation(MUTATION.value));
      }
      ;
      if (v1 === "SUBSCRIPTION") {
        return new Right(new DirectiveLocation_ExecutableDirectiveLocation(SUBSCRIPTION.value));
      }
      ;
      if (v1 === "FIELD") {
        return new Right(new DirectiveLocation_ExecutableDirectiveLocation(FIELD.value));
      }
      ;
      if (v1 === "FRAGMENT_DEFINITION") {
        return new Right(new DirectiveLocation_ExecutableDirectiveLocation(FRAGMENT_DEFINITION.value));
      }
      ;
      if (v1 === "FRAGMENT_SPREAD") {
        return new Right(new DirectiveLocation_ExecutableDirectiveLocation(FRAGMENT_SPREAD.value));
      }
      ;
      if (v1 === "INLINE_FRAGMENT") {
        return new Right(new DirectiveLocation_ExecutableDirectiveLocation(INLINE_FRAGMENT.value));
      }
      ;
      if (v1 === "SCHEMA") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(SCHEMA.value));
      }
      ;
      if (v1 === "SCALAR") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(SCALAR.value));
      }
      ;
      if (v1 === "OBJECT") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(OBJECT.value));
      }
      ;
      if (v1 === "FIELD_DEFINITION") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(FIELD_DEFINITION.value));
      }
      ;
      if (v1 === "ARGUMENT_DEFINITION") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(ARGUMENT_DEFINITION.value));
      }
      ;
      if (v1 === "INTERFACE") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(INTERFACE.value));
      }
      ;
      if (v1 === "UNION") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(UNION.value));
      }
      ;
      if (v1 === "ENUM") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(ENUM.value));
      }
      ;
      if (v1 === "ENUM_VALUE") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(ENUM_VALUE.value));
      }
      ;
      if (v1 === "INPUT_OBJECT") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(INPUT_OBJECT.value));
      }
      ;
      if (v1 === "INPUT_FIELD_DEFINITION") {
        return new Right(new DirectiveLocation_TypeSystemDirectiveLocation(INPUT_FIELD_DEFINITION.value));
      }
      ;
      return new Left("Unknown directive location: " + v1);
    };
    var toArgumentsDefinition = function() {
      var $269 = map13(toInputValueDefinition);
      return function($270) {
        return ArgumentsDefinition($269(fromFoldable6($270)));
      };
    }();
    var toDirectiveDefinition = function(directive) {
      return bind3(traverse2(toDirectiveLocation)(directive.locations))(function(directiveLocations) {
        return pure4(new Just({
          argumentsDefinition: new Just(toArgumentsDefinition(directive.args)),
          description: directive.description,
          directiveLocations: fromFoldable6(directiveLocations),
          name: directive.name
        }));
      });
    };
    var toFieldDefinition = function(field) {
      return {
        argumentsDefinition: map1(toArgumentsDefinition)(field.args),
        description: field.description,
        directives: Nothing.value,
        name: field.name,
        type: toType(field.type)
      };
    };
    var toFieldsDefinition = function() {
      var $271 = map13(toFieldDefinition);
      return function($272) {
        return FieldsDefinition($271(fromFoldable6($272)));
      };
    }();
    var toObjectDefinition = function(fullType) {
      return bind3(note("No name for object type")(fullType.name))(function(name2) {
        return pure4({
          description: fullType.description,
          name: name2,
          implementsInterfaces: Nothing.value,
          directives: Nothing.value,
          fieldsDefinition: map1(toFieldsDefinition)(fullType.fields)
        });
      });
    };
    var toTypeSystemDefinition = function(fullType) {
      if (fullType.kind === "OBJECT") {
        return map23(function($273) {
          return Just.create(TypeDefinition_ObjectTypeDefinition.create($273));
        })(toObjectDefinition(fullType));
      }
      ;
      if (fullType.kind === "INPUT_OBJECT") {
        return map23(function($274) {
          return Just.create(TypeDefinition_InputObjectTypeDefinition.create($274));
        })(toInputObjectDefinition(fullType));
      }
      ;
      if (fullType.kind === "ENUM") {
        return map23(function($275) {
          return Just.create(TypeDefinition_EnumTypeDefinition.create($275));
        })(toEnumDefinition(fullType));
      }
      ;
      if (fullType.kind === "SCALAR") {
        return map23(function($276) {
          return Just.create(TypeDefinition_ScalarTypeDefinition.create($276));
        })(toScalarDefinition(fullType));
      }
      ;
      if (fullType.kind === "UNION") {
        return map23(function($277) {
          return Just.create(TypeDefinition_UnionTypeDefinition.create($277));
        })(toUnionDefinition(fullType));
      }
      ;
      return new Left("Unsupported TypeDefinition kind: " + fullType.kind);
    };
    var root = bind3(note("No query type")(v["__schema"].queryType.name))(function(query) {
      return pure4(new Definition_TypeSystemDefinition(new TypeSystemDefinition_SchemaDefinition({
        directives: Nothing.value,
        rootOperationTypeDefinition: append12(toRootOp(Query.value)(query))(append12(maybe(Nil.value)(toRootOp(Mutation.value))(bind1(v["__schema"].mutationType)(function(v1) {
          return v1.name;
        })))(maybe(Nil.value)(toRootOp(Subscription.value))(bind1(v["__schema"].subscriptionType)(function(v1) {
          return v1.name;
        }))))
      })));
    });
    var nonSchemaTypes = noSchemaTypes(v["__schema"].types);
    var fullTypeToDefinition = function() {
      var $278 = map23(map1(function($280) {
        return Definition_TypeSystemDefinition.create(TypeSystemDefinition_TypeDefinition.create($280));
      }));
      return function($279) {
        return $278(toTypeSystemDefinition($279));
      };
    }();
    var typeDefinitions = map23(catMaybes)(traverse12(fullTypeToDefinition)(fromFoldable6(nonSchemaTypes)));
    var directiveToDefinition = function() {
      var $281 = map23(map1(function($283) {
        return Definition_TypeSystemDefinition.create(TypeSystemDefinition_DirectiveDefinition.create($283));
      }));
      return function($282) {
        return $281(toDirectiveDefinition($282));
      };
    }();
    var directiveDefinitions = map23(catMaybes)(traverse12(directiveToDefinition)(fromFoldable6(v["__schema"].directives)));
    return map23(Document)(append2(directiveDefinitions)(append2(map23(pure1)(root))(typeDefinitions)));
  };
  return composeKleisli(bindEither)(function() {
    var $284 = lmap4(JsonDecodeError.create);
    var $285 = decodeJson(decodeRecord(gDecodeJsonCons(decodeFieldId(decodeRecord(gDecodeJsonCons(decodeFieldId(decodeArray2(decodeRecord(gDecodeJsonCons(decodeFieldId(decodeArray3))(gDecodeJsonCons3(gDecodeJsonCons(decodeFieldId(decodeArray2(decodeJsonString)))(gDecodeJsonCons32)({
      reflectSymbol: function() {
        return "locations";
      }
    })()())(descriptionIsSymbol)()())(argsIsSymbol)()())())))(gDecodeJsonCons4(gDecodeJsonCons(decodeFieldId(decodeRecord2))(gDecodeJsonCons4(gDecodeJsonCons(decodeFieldId(decodeArray2(decodeRecord(gDecodeJsonCons3(gDecodeJsonCons(decodeFieldMaybe(decodeArray2(decodeRecord(gDecodeJsonCons3(gDecodeJsonCons3(gDecodeJsonCons5(gDecodeJsonCons32)(isDeprecatedIsSymbol)()())(descriptionIsSymbol)()())(deprecationReasonIsSymbol)()())())))(gDecodeJsonCons(decodeFieldMaybe(decodeArray2(decodeRecord(gDecodeJsonCons6(gDecodeJsonCons3(gDecodeJsonCons3(gDecodeJsonCons5(gDecodeJsonCons22)(isDeprecatedIsSymbol)()())(descriptionIsSymbol)()())(deprecationReasonIsSymbol)()())(argsIsSymbol)()())())))(gDecodeJsonCons6(gDecodeJsonCons7(gDecodeJsonCons12(gDecodeJsonCons3(gDecodeJsonCons7(gDecodeJsonNil)({
      reflectSymbol: function() {
        return "possibleTypes";
      }
    })()())(nameIsSymbol2)()())({
      reflectSymbol: function() {
        return "kind";
      }
    })()())({
      reflectSymbol: function() {
        return "interfaces";
      }
    })()())({
      reflectSymbol: function() {
        return "inputFields";
      }
    })()())({
      reflectSymbol: function() {
        return "fields";
      }
    })()())({
      reflectSymbol: function() {
        return "enumValues";
      }
    })()())(descriptionIsSymbol)()())())))(gDecodeJsonNil)({
      reflectSymbol: function() {
        return "types";
      }
    })()())({
      reflectSymbol: function() {
        return "subscriptionType";
      }
    })()())({
      reflectSymbol: function() {
        return "queryType";
      }
    })()())({
      reflectSymbol: function() {
        return "mutationType";
      }
    })()())({
      reflectSymbol: function() {
        return "directives";
      }
    })()())()))(gDecodeJsonNil)({
      reflectSymbol: function() {
        return "__schema";
      }
    })()())());
    return function($286) {
      return $284($285($286));
    };
  }())(function() {
    var $287 = lmap4(InvalidIntrospectionSchema.create);
    return function($288) {
      return $287(toDocument($288));
    };
  }());
}();

// output/GraphQL.Client.CodeGen.GetSymbols/index.js
var foldMap4 = /* @__PURE__ */ foldMap(foldableArray)(monoidString);
var show2 = /* @__PURE__ */ show(showString);
var nub3 = /* @__PURE__ */ nub2(ordString);
var bind4 = /* @__PURE__ */ bind(bindList);
var monoidFn2 = /* @__PURE__ */ monoidFn(monoidList);
var mempty3 = /* @__PURE__ */ mempty(monoidList);
var sort3 = /* @__PURE__ */ sort(ordString);
var nub1 = /* @__PURE__ */ nub(ordString);
var not2 = /* @__PURE__ */ not(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean));
var unwrap4 = /* @__PURE__ */ unwrap();
var symbolsToCode = function(dictFoldable) {
  var fromFoldable8 = fromFoldable3(dictFoldable);
  return function(modulePrefix) {
    return function(symbols) {
      var symbolsString = foldMap4(function(s) {
        return "\n" + (s + (" = Proxy :: Proxy" + show2(s)));
      })(nub3(fromFoldable8(symbols)));
      return "module " + (modulePrefix + ("Symbols where\n\nimport Type.Proxy (Proxy(..))\n" + symbolsString));
    };
  };
};
var keyword = /* @__PURE__ */ flip(/* @__PURE__ */ elem2(eqString))(["data", "type"]);
var getSymbols = function(doc) {
  var inputValueDefinitionsToSymbols1 = mempty(monoidFn2);
  var argumentsDefinitionToSymbols = function(v) {
    return bind4(v)(inputValueDefinitionsToSymbols1);
  };
  var fieldDefinitionToSymbols = function(v) {
    return new Cons(v.name, maybe(mempty3)(argumentsDefinitionToSymbols)(v.argumentsDefinition));
  };
  var fieldsDefinitionToSymbols = function(v) {
    return bind4(v)(fieldDefinitionToSymbols);
  };
  var objectTypeDefinitionToSymbols = function(v) {
    return maybe(mempty3)(fieldsDefinitionToSymbols)(v.fieldsDefinition);
  };
  var typeDefinitionToSymbols = function(v) {
    if (v instanceof TypeDefinition_ScalarTypeDefinition) {
      return mempty3;
    }
    ;
    if (v instanceof TypeDefinition_ObjectTypeDefinition) {
      return objectTypeDefinitionToSymbols(v.value0);
    }
    ;
    if (v instanceof TypeDefinition_InterfaceTypeDefinition) {
      return mempty3;
    }
    ;
    if (v instanceof TypeDefinition_UnionTypeDefinition) {
      return mempty3;
    }
    ;
    if (v instanceof TypeDefinition_EnumTypeDefinition) {
      return mempty3;
    }
    ;
    if (v instanceof TypeDefinition_InputObjectTypeDefinition) {
      return mempty3;
    }
    ;
    throw new Error("Failed pattern match at GraphQL.Client.CodeGen.GetSymbols (line 52, column 29 - line 58, column 61): " + [v.constructor.name]);
  };
  var typeSystemDefinitionToSymbols = function(v) {
    if (v instanceof TypeSystemDefinition_SchemaDefinition) {
      return mempty3;
    }
    ;
    if (v instanceof TypeSystemDefinition_TypeDefinition) {
      return typeDefinitionToSymbols(v.value0);
    }
    ;
    if (v instanceof TypeSystemDefinition_DirectiveDefinition) {
      return mempty3;
    }
    ;
    throw new Error("Failed pattern match at GraphQL.Client.CodeGen.GetSymbols (line 46, column 35 - line 49, column 61): " + [v.constructor.name]);
  };
  var definitionToSymbols = function(v) {
    if (v instanceof Definition_ExecutableDefinition) {
      return mempty3;
    }
    ;
    if (v instanceof Definition_TypeSystemDefinition) {
      return typeSystemDefinitionToSymbols(v.value0);
    }
    ;
    if (v instanceof Definition_TypeSystemExtension) {
      return mempty3;
    }
    ;
    throw new Error("Failed pattern match at GraphQL.Client.CodeGen.GetSymbols (line 40, column 25 - line 43, column 51): " + [v.constructor.name]);
  };
  return sort3(nub1(filter(not2(keyword))(bind4(unwrap4(doc))(definitionToSymbols))));
};

// output/GraphQL.Client.CodeGen.Lines/index.js
var map14 = /* @__PURE__ */ map(functorArray);
var toLines = /* @__PURE__ */ split2(/* @__PURE__ */ unsafeRegex("\\n")(global));
var fromLines = /* @__PURE__ */ joinWith("\n");
var prependLines = function(pre) {
  var $8 = map14(function(l) {
    var $7 = l === "";
    if ($7) {
      return l;
    }
    ;
    return pre + l;
  });
  return function($9) {
    return fromLines($8(toLines($9)));
  };
};
var indent = /* @__PURE__ */ prependLines("  ");
var commentPrefix = " -- | ";
var docComment = function(dictFoldable) {
  return foldMap(dictFoldable)(monoidString)(function(str) {
    return "\n" + (prependLines(commentPrefix)(str) + "\n");
  });
};

// output/GraphQL.Client.CodeGen.Template.Enum/index.js
var guard3 = /* @__PURE__ */ guard(monoidString);
var not3 = /* @__PURE__ */ not(/* @__PURE__ */ heytingAlgebraFunction(heytingAlgebraBoolean));
var intercalate5 = /* @__PURE__ */ intercalate2(foldableArray)(monoidString);
var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorArray);
var map15 = /* @__PURE__ */ map(functorArray);
var docComment2 = /* @__PURE__ */ docComment(foldableMaybe);
var show3 = /* @__PURE__ */ show(showString);
var defaultEnumValueName = function(s) {
  var alphaStart = guard3(maybe(false)(function() {
    var $20 = not3(isAlpha);
    return function($21) {
      return $20(codePointFromChar($21));
    };
  }())(charAt2(0)(s)))("ENUM_");
  return alphaStart + (toUpper3(take4(1)(s)) + drop4(1)(s));
};
var template = function(modulePrefix) {
  return function(v) {
    var enumValueName = fromMaybe(defaultEnumValueName)(v.enumValueNameTransform);
    var showMember = intercalate5("\n")(mapFlipped2(v.values)(function(v1) {
      return "    " + (enumValueName(v1) + (' -> "' + (v1 + '"')));
    }));
    var valuesAndTransforms = mapFlipped2(v.values)(function(v1) {
      return {
        gql: v1,
        transformed: enumValueName(v1)
      };
    });
    var enumCtrs = intercalate5("\n  | ")(map15(enumValueName)(v.values));
    var decodeMember = intercalate5("\n")(mapFlipped2(v.values)(function(v1) {
      return '    "' + (v1 + ('" -> pure ' + (enumValueName(v1) + "")));
    }));
    return "module " + (modulePrefix + ("Schema." + (v.schemaName + (".Enum." + (v.name + (" where\n\nimport Prelude\n\nimport Data.Argonaut.Decode (class DecodeJson, JsonDecodeError(..), decodeJson)\nimport Data.Argonaut.Encode (class EncodeJson, encodeJson)\nimport Data.Either (Either(..))\nimport Data.Function (on)\nimport GraphQL.Client.Args (class ArgGql)\nimport GraphQL.Client.ToGqlString (class GqlArgString)\nimport GraphQL.Hasura.Decode (class DecodeHasura)\nimport GraphQL.Hasura.Encode (class EncodeHasura)\nimport GraphQL.Client.Variables.TypeName (class VarTypeName)\n" + (intercalate5("\n")(v.imports) + ("\n\n" + (docComment2(v.description) + ("data " + (v.name + (" \n  = " + (enumCtrs + ("\n" + (v.customCode({
      name: v.name,
      values: valuesAndTransforms
    }) + ("\n\ninstance eq" + (v.name + (" :: Eq " + (v.name + (" where \n  eq = eq `on` show\n\ninstance ord" + (v.name + (" :: Ord " + (v.name + (" where\n  compare = compare `on` show\n\ninstance argToGql" + (v.name + (" :: ArgGql " + (v.name + (" " + (v.name + ("\n\ninstance gqlArgString" + (v.name + (" :: GqlArgString " + (v.name + (" where\n  toGqlArgStringImpl = show\n\ninstance decodeJson" + (v.name + (" :: DecodeJson " + (v.name + (" where\n  decodeJson = decodeJson >=> case _ of \n" + (decodeMember + ('\n    s -> Left $ TypeMismatch $ "Not a ' + (v.name + (': " <> s\n\ninstance encodeJson' + (v.name + (" :: EncodeJson " + (v.name + (" where \n  encodeJson = show >>> encodeJson\n\ninstance decdoeHasura" + (v.name + (" :: DecodeHasura " + (v.name + (" where \n  decodeHasura = decodeJson\n\ninstance encodeHasura" + (v.name + (" :: EncodeHasura " + (v.name + (" where \n  encodeHasura = encodeJson\n\ninstance varTypeName" + (v.name + (" :: VarTypeName " + (v.name + (" where \n  varTypeName _ = " + (show3(v.name + "!") + ("\n\ninstance show" + (v.name + (" :: Show " + (v.name + (" where\n  show a = case a of \n" + (showMember + "\n")))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
  };
};

// output/GraphQL.Client.CodeGen.Template.Schema/index.js
var intercalate6 = /* @__PURE__ */ intercalate2(foldableArray)(monoidString);
var mapFlipped3 = /* @__PURE__ */ mapFlipped(functorArray);
var guard4 = /* @__PURE__ */ guard(monoidString);
var template2 = function(v) {
  var getImport = function(v1) {
    return v1.moduleName + (" (" + (v1.typeName + ")"));
  };
  var enumImports = intercalate6("\n")(mapFlipped3(v.enums)(function(v1) {
    return "import " + (v.modulePrefix + ("Schema." + (v.name + (".Enum." + (v1 + (" (" + (v1 + ")")))))));
  }));
  return "module " + (v.modulePrefix + ("Schema." + (v.name + (" where\n\nimport Data.Maybe (Maybe)\nimport Data.Newtype (class Newtype)\nimport GraphQL.Client.Args (class ArgGql, class RecordArg, NotNull)\n" + (guard4(contains("GqlUnion")(v.mainSchemaCode))("import GraphQL.Client.Union (GqlUnion)") + ("\nimport " + (maybe("GraphQL.Client.ID (ID)")(getImport)(v.idImport) + ("\n" + (enumImports + ("\n\n" + (v.mainSchemaCode + "\n")))))))))));
};

// output/Data.Profunctor.Choice/index.js
var right = function(dict) {
  return dict.right;
};
var choiceFn = {
  left: function(v) {
    return function(v1) {
      if (v1 instanceof Left) {
        return new Left(v(v1.value0));
      }
      ;
      if (v1 instanceof Right) {
        return new Right(v1.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Profunctor.Choice (line 32, column 1 - line 35, column 16): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  right: /* @__PURE__ */ map(functorEither),
  Profunctor0: function() {
    return profunctorFn;
  }
};

// output/Data.Profunctor.Strong/index.js
var strongFn = {
  first: function(a2b) {
    return function(v) {
      return new Tuple(a2b(v.value0), v.value1);
    };
  },
  second: /* @__PURE__ */ map(functorTuple),
  Profunctor0: function() {
    return profunctorFn;
  }
};

// output/Data.Lens.Internal.Wander/index.js
var alaF2 = /* @__PURE__ */ alaF()()()();
var wanderFunction = {
  wander: function(t) {
    return alaF2(Identity)(t(applicativeIdentity));
  },
  Strong0: function() {
    return strongFn;
  },
  Choice1: function() {
    return choiceFn;
  }
};
var wander = function(dict) {
  return dict.wander;
};

// output/Data.Lens.Iso/index.js
var coerce4 = /* @__PURE__ */ coerce();
var iso = function(f) {
  return function(g) {
    return function(dictProfunctor) {
      var dimap2 = dimap(dictProfunctor);
      return function(pab) {
        return dimap2(f)(g)(pab);
      };
    };
  };
};
var coerced = function() {
  return function() {
    return function(dictProfunctor) {
      return iso(coerce4)(coerce4)(dictProfunctor);
    };
  };
};

// output/Data.Lens.Iso.Newtype/index.js
var coerced2 = /* @__PURE__ */ coerced()();
var _Newtype = function() {
  return function() {
    return function(dictProfunctor) {
      return coerced2(dictProfunctor);
    };
  };
};

// output/Data.Lens.Prism/index.js
var identity13 = /* @__PURE__ */ identity(categoryFn);
var prism = function(to) {
  return function(fro) {
    return function(dictChoice) {
      var Profunctor0 = dictChoice.Profunctor0();
      var dimap2 = dimap(Profunctor0);
      var right2 = right(dictChoice);
      var rmap2 = rmap(Profunctor0);
      return function(pab) {
        return dimap2(fro)(either(identity13)(identity13))(right2(rmap2(to)(pab)));
      };
    };
  };
};
var prism$prime = function(to) {
  return function(fro) {
    return function(dictChoice) {
      return prism(to)(function(s) {
        return maybe(new Left(s))(Right.create)(fro(s));
      })(dictChoice);
    };
  };
};

// output/Data.Lens.Setter/index.js
var over2 = function(l) {
  return l;
};

// output/Data.Lens.Traversal/index.js
var traversed = function(dictTraversable) {
  var traverse4 = traverse(dictTraversable);
  return function(dictWander) {
    return wander(dictWander)(function(dictApplicative) {
      return traverse4(dictApplicative);
    });
  };
};

// output/GraphQL.Client.CodeGen.Transform.NullableOverrides/index.js
var traversed2 = /* @__PURE__ */ traversed(traversableList);
var lookup3 = /* @__PURE__ */ lookup(ordString);
var _Newtype2 = /* @__PURE__ */ _Newtype()()(profunctorFn);
var traversed1 = /* @__PURE__ */ traversed(traversableMaybe)(wanderFunction);
var traversed22 = /* @__PURE__ */ traversed2(wanderFunction);
var uPrism = /* @__PURE__ */ uncurry(prism$prime);
var setNullable = function(v) {
  return function(v1) {
    if (v && (v1 instanceof Type_NonNullType && v1.value0 instanceof NonNullType_NamedType)) {
      return new Type_NamedType(v1.value0.value0);
    }
    ;
    if (v && (v1 instanceof Type_NonNullType && v1.value0 instanceof NonNullType_ListType)) {
      return new Type_ListType(v1.value0.value0);
    }
    ;
    if (!v && v1 instanceof Type_NamedType) {
      return new Type_NonNullType(new NonNullType_NamedType(v1.value0));
    }
    ;
    if (!v && v1 instanceof Type_ListType) {
      return new Type_NonNullType(new NonNullType_ListType(v1.value0));
    }
    ;
    return v1;
  };
};
var objectTypeDefinitionLens = function(dictChoice) {
  return function(dictWander) {
    var $96 = uPrism(_Document)(dictChoice);
    var $97 = traversed2(dictWander);
    var $98 = uPrism(_Definition_TypeSystemDefinition)(dictChoice);
    var $99 = uPrism(_TypeSystemDefinition_TypeDefinition)(dictChoice);
    var $100 = uPrism(_TypeDefinition_ObjectTypeDefinition)(dictChoice);
    return function($101) {
      return $96($97($98($99($100($101)))));
    };
  };
};
var objectTypeDefinitionLens1 = /* @__PURE__ */ objectTypeDefinitionLens(choiceFn)(wanderFunction);
var inputObjectTypeDefinitionLens = function(dictChoice) {
  return function(dictWander) {
    var $102 = uPrism(_Document)(dictChoice);
    var $103 = traversed2(dictWander);
    var $104 = uPrism(_Definition_TypeSystemDefinition)(dictChoice);
    var $105 = uPrism(_TypeSystemDefinition_TypeDefinition)(dictChoice);
    var $106 = uPrism(_TypeDefinition_InputObjectTypeDefinition)(dictChoice);
    return function($107) {
      return $102($103($104($105($106($107)))));
    };
  };
};
var inputObjectTypeDefinitionLens1 = /* @__PURE__ */ inputObjectTypeDefinitionLens(choiceFn)(wanderFunction);
var inputFieldsLens = function(dictTraversable) {
  var traversed3 = traversed(dictTraversable);
  return function(dictWander) {
    var $108 = traversed3(dictWander);
    var $109 = uPrism(_InputFieldsDefinition)(dictWander.Choice1());
    var $110 = traversed2(dictWander);
    return function($111) {
      return $108($109($110($111)));
    };
  };
};
var inputFieldsLens1 = /* @__PURE__ */ inputFieldsLens(traversableMaybe)(wanderFunction);
var applyNullableOverrides = function(overrides) {
  var applyToInputFieldsDefinition = function(v) {
    return function(v1) {
      var v2 = function(v3) {
        return v1;
      };
      var $60 = lookup3(v1.name)(v);
      if ($60 instanceof Just) {
        var $61 = {};
        for (var $62 in v1) {
          if ({}.hasOwnProperty.call(v1, $62)) {
            $61[$62] = v1[$62];
          }
          ;
        }
        ;
        $61.type = setNullable($60.value0)(v1.type);
        return $61;
      }
      ;
      return v2(true);
    };
  };
  var applyToInputDefinition = function(v) {
    var v1 = function(v2) {
      return v;
    };
    var $69 = lookup3(v.name)(overrides);
    if ($69 instanceof Just) {
      var $70 = {};
      for (var $71 in v) {
        if ({}.hasOwnProperty.call(v, $71)) {
          $70[$71] = v[$71];
        }
        ;
      }
      ;
      $70.inputFieldsDefinition = over2(function($112) {
        return inputFieldsLens1(_Newtype2($112));
      })(applyToInputFieldsDefinition($69.value0))(v.inputFieldsDefinition);
      return $70;
    }
    ;
    return v1(true);
  };
  var applyToFieldsDefinition = function(v) {
    return function(v1) {
      var v2 = function(v3) {
        return v1;
      };
      var $80 = lookup3(v1.name)(v);
      if ($80 instanceof Just) {
        var $81 = {};
        for (var $82 in v1) {
          if ({}.hasOwnProperty.call(v1, $82)) {
            $81[$82] = v1[$82];
          }
          ;
        }
        ;
        $81.type = setNullable($80.value0)(v1.type);
        return $81;
      }
      ;
      return v2(true);
    };
  };
  var applyToTypeDefinition = function(v) {
    var v1 = function(v2) {
      return v;
    };
    var $89 = lookup3(v.name)(overrides);
    if ($89 instanceof Just) {
      var $90 = {};
      for (var $91 in v) {
        if ({}.hasOwnProperty.call(v, $91)) {
          $90[$91] = v[$91];
        }
        ;
      }
      ;
      $90.fieldsDefinition = over2(function($113) {
        return traversed1(_Newtype2(traversed22(_Newtype2($113))));
      })(applyToFieldsDefinition($89.value0))(v.fieldsDefinition);
      return $90;
    }
    ;
    return v1(true);
  };
  var $114 = over2(function($117) {
    return objectTypeDefinitionLens1(_Newtype2($117));
  })(applyToTypeDefinition);
  var $115 = over2(function($118) {
    return inputObjectTypeDefinitionLens1(_Newtype2($118));
  })(applyToInputDefinition);
  return function($116) {
    return $114($115($116));
  };
};

// output/GraphQL.Client.CodeGen.Schema/index.js
var lookup4 = /* @__PURE__ */ lookup(ordString);
var map16 = /* @__PURE__ */ map(functorArray);
var show4 = /* @__PURE__ */ show(showString);
var foldMap5 = /* @__PURE__ */ foldMap(foldableMaybe)(monoidString);
var docComment3 = /* @__PURE__ */ docComment(foldableMaybe);
var intercalate7 = /* @__PURE__ */ intercalate2(foldableList)(monoidString);
var map17 = /* @__PURE__ */ map(functorList);
var unwrap5 = /* @__PURE__ */ unwrap();
var guard5 = /* @__PURE__ */ guard(monoidString);
var nub4 = /* @__PURE__ */ nub2(ordString);
var append13 = /* @__PURE__ */ append(semigroupArray);
var fromFoldable7 = /* @__PURE__ */ fromFoldable3(foldableMap);
var foldl3 = /* @__PURE__ */ foldl(foldableMap);
var notEq1 = /* @__PURE__ */ notEq(eqCodePoint);
var compare4 = /* @__PURE__ */ compare(ordString);
var notElem3 = /* @__PURE__ */ notElem2(eqString);
var bind5 = /* @__PURE__ */ bind(bindMaybe);
var fromFoldable1 = /* @__PURE__ */ fromFoldable3(foldableList);
var mapFlipped4 = /* @__PURE__ */ mapFlipped(functorList);
var mapFlipped1 = /* @__PURE__ */ mapFlipped(functorEither);
var lmap5 = /* @__PURE__ */ lmap(bifunctorEither);
var pure5 = /* @__PURE__ */ pure(applicativeAff);
var bind12 = /* @__PURE__ */ bind(bindAff);
var gDecodeJsonCons8 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(decodeJsonString));
var gDecodeJsonCons13 = /* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(/* @__PURE__ */ decodeArray2(decodeJsonString)))(gDecodeJsonNil);
var valuesIsSymbol = {
  reflectSymbol: function() {
    return "values";
  }
};
var nameIsSymbol3 = {
  reflectSymbol: function() {
    return "name";
  }
};
var descriptionIsSymbol2 = {
  reflectSymbol: function() {
    return "description";
  }
};
var symbolsIsSymbol = {
  reflectSymbol: function() {
    return "symbols";
  }
};
var moduleNameIsSymbol = {
  reflectSymbol: function() {
    return "moduleName";
  }
};
var mainSchemaCodeIsSymbol = {
  reflectSymbol: function() {
    return "mainSchemaCode";
  }
};
var enumsIsSymbol = {
  reflectSymbol: function() {
    return "enums";
  }
};
var decodeJson2 = /* @__PURE__ */ decodeJson(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldId(/* @__PURE__ */ decodeArray2(/* @__PURE__ */ decodeRecord(/* @__PURE__ */ gDecodeJsonCons(/* @__PURE__ */ decodeFieldMaybe(decodeJsonString))(/* @__PURE__ */ gDecodeJsonCons8(/* @__PURE__ */ gDecodeJsonCons13(valuesIsSymbol)()())(nameIsSymbol3)()())(descriptionIsSymbol2)()())())))(/* @__PURE__ */ gDecodeJsonCons8(/* @__PURE__ */ gDecodeJsonCons8(/* @__PURE__ */ gDecodeJsonCons13(symbolsIsSymbol)()())(moduleNameIsSymbol)()())(mainSchemaCodeIsSymbol)()())(enumsIsSymbol)()())());
var discard2 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var gEncodeJsonCons2 = /* @__PURE__ */ gEncodeJsonCons(encodeJsonJString);
var gEncodeJsonCons1 = /* @__PURE__ */ gEncodeJsonCons(/* @__PURE__ */ encodeJsonArray(encodeJsonJString))(gEncodeJsonNil);
var encodeJson2 = /* @__PURE__ */ encodeJson(/* @__PURE__ */ encodeRecord(/* @__PURE__ */ gEncodeJsonCons(/* @__PURE__ */ encodeJsonArray(/* @__PURE__ */ encodeRecord(/* @__PURE__ */ gEncodeJsonCons(/* @__PURE__ */ encodeJsonMaybe(encodeJsonJString))(/* @__PURE__ */ gEncodeJsonCons2(/* @__PURE__ */ gEncodeJsonCons1(valuesIsSymbol)())(nameIsSymbol3)())(descriptionIsSymbol2)())()))(/* @__PURE__ */ gEncodeJsonCons2(/* @__PURE__ */ gEncodeJsonCons2(/* @__PURE__ */ gEncodeJsonCons1(symbolsIsSymbol)())(moduleNameIsSymbol)())(mainSchemaCodeIsSymbol)())(enumsIsSymbol)())());
var unions2 = /* @__PURE__ */ unions(ordString)(foldableMap);
var mapWithIndex4 = /* @__PURE__ */ mapWithIndex(functorWithIndexMap);
var fromFoldable22 = /* @__PURE__ */ fromFoldable2(ordString)(foldableArray);
var map24 = /* @__PURE__ */ map(functorMap);
var foldMap13 = /* @__PURE__ */ foldMap(foldableArray)(monoidString);
var mapFlipped22 = /* @__PURE__ */ mapFlipped(functorArray);
var bind22 = /* @__PURE__ */ bind(bindArray);
var symbolsToCode2 = /* @__PURE__ */ symbolsToCode(foldableArray);
var traverse3 = /* @__PURE__ */ traverse(traversableArray)(applicativeAff);
var map32 = /* @__PURE__ */ map(functorAff);
var sequence2 = /* @__PURE__ */ sequence(traversableArray)(applicativeEither);
var map42 = /* @__PURE__ */ map(functorEither);
var typeName = function(gqlScalarsToPursTypes) {
  return function(str) {
    return fromMaybe$prime(function(v) {
      if (str === "_text") {
        return "GraphQL.Hasura.Array.Hasura_text";
      }
      ;
      var v1 = pascalCase(str);
      if (v1 === "Id") {
        return "ID";
      }
      ;
      if (v1 === "Float") {
        return "Number";
      }
      ;
      if (v1 === "Numeric") {
        return "Number";
      }
      ;
      if (v1 === "Bigint") {
        return "Number";
      }
      ;
      if (v1 === "Smallint") {
        return "Int";
      }
      ;
      if (v1 === "Integer") {
        return "Int";
      }
      ;
      if (v1 === "Int") {
        return "Int";
      }
      ;
      if (v1 === "Int2") {
        return "Int";
      }
      ;
      if (v1 === "Int4") {
        return "Int";
      }
      ;
      if (v1 === "Int8") {
        return "Int";
      }
      ;
      if (v1 === "Text") {
        return "String";
      }
      ;
      if (v1 === "Citext") {
        return "String";
      }
      ;
      if (v1 === "Jsonb") {
        return "Json";
      }
      ;
      if (v1 === "Timestamp") {
        return "DateTime";
      }
      ;
      if (v1 === "Timestamptz") {
        return "DateTime";
      }
      ;
      return v1;
    })(lookup4(str)(gqlScalarsToPursTypes));
  };
};
var toImports = /* @__PURE__ */ map16(function(t) {
  return "import " + (t + (" as " + t));
});
var safeFieldname = function(s) {
  var isSafe = maybe(false)(function(c) {
    return c === "_" || isLower(codePointFromChar(c));
  })(charAt2(0)(s));
  if (isSafe) {
    return s;
  }
  ;
  return show4(s);
};
var namedTypeToPurs = function(gqlScalarsToPursTypes) {
  return function(v) {
    return typeName(gqlScalarsToPursTypes)(v);
  };
};
var inlineComment = /* @__PURE__ */ foldMap5(function(str) {
  return "\n{- " + (str + " -}\n");
});
var gqlToPursMainSchemaCode = function(v) {
  return function(doc) {
    var wrapArray = function(s) {
      return "(Array " + (s + ")");
    };
    var unionMemberTypeToPurs = function(ty) {
      return '"' + (ty + ('" :: ' + ty));
    };
    var unionTypeDefinitionToPurs = function(v1) {
      if (v1.directives instanceof Nothing && v1.unionMemberTypes instanceof Just) {
        return new Just(docComment3(v1.description) + ("type " + (v1.name + (" = GqlUnion" + indent("\n( " + (intercalate7("\n, ")(map17(function($307) {
          return unionMemberTypeToPurs(unwrap5($307));
        })(v1.unionMemberTypes.value0)) + "\n)"))))));
      }
      ;
      return Nothing.value;
    };
    var typeName_ = typeName(v.gqlScalarsToPursTypes);
    var startsWith2 = function(pre) {
      return function(str) {
        return pre === take4(length4(pre))(str);
      };
    };
    var wrapMaybe = function(s) {
      var $193 = startsWith2("(Maybe ")(s);
      if ($193) {
        return s;
      }
      ;
      return "(Maybe " + (s + ")");
    };
    var wrapNotNull = function(s) {
      var $194 = startsWith2("(NotNull ")(trim(s));
      if ($194) {
        return s;
      }
      ;
      return "(NotNull " + (s + ")");
    };
    var namedTypeToPurs_ = namedTypeToPurs(v.gqlScalarsToPursTypes);
    var rootOperationTypeDefinitionToPurs = function(v1) {
      var opStr = function() {
        if (v1.operationType instanceof Query) {
          return "Query";
        }
        ;
        if (v1.operationType instanceof Mutation) {
          return "Mutation";
        }
        ;
        if (v1.operationType instanceof Subscription) {
          return "Subscription";
        }
        ;
        throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 206, column 13 - line 209, column 41): " + [v1.operationType.constructor.name]);
      }();
      var actualType = namedTypeToPurs_(v1.namedType);
      return guard5(opStr !== actualType)("type " + (opStr + (" = " + actualType)));
    };
    var schemaDefinitionToPurs = function(v1) {
      return intercalate7("\n\n")(map17(rootOperationTypeDefinitionToPurs)(v1.rootOperationTypeDefinition));
    };
    var namedTypeToPursNullable = function($308) {
      return wrapMaybe(namedTypeToPurs_($308));
    };
    var typeToPurs = function(v1) {
      if (v1 instanceof Type_NamedType) {
        return namedTypeToPursNullable(v1.value0);
      }
      ;
      if (v1 instanceof Type_ListType) {
        return listTypeToPursNullable(v1.value0);
      }
      ;
      if (v1 instanceof Type_NonNullType) {
        return notNullTypeToPurs(v1.value0);
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 439, column 16 - line 442, column 72): " + [v1.constructor.name]);
    };
    var notNullTypeToPurs = function(v1) {
      if (v1 instanceof NonNullType_NamedType) {
        return namedTypeToPurs_(v1.value0);
      }
      ;
      if (v1 instanceof NonNullType_ListType) {
        return listTypeToPurs(v1.value0);
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 453, column 23 - line 455, column 51): " + [v1.constructor.name]);
    };
    var listTypeToPursNullable = function(t) {
      return wrapMaybe(listTypeToPurs(t));
    };
    var listTypeToPurs = function(v1) {
      return wrapArray(typeToPurs(v1));
    };
    var interfaceTypeDefinitionToPurs = function(v1) {
      return Nothing.value;
    };
    var imports = joinWith("\n")(toImports(nub4(append13(map16(function(v1) {
      return v1.moduleName;
    })(fromFoldable7(v.externalTypes)))(append13(map16(function(v1) {
      return v1.moduleName;
    })(foldl3(function(res) {
      return function(m) {
        return append13(res)(fromFoldable7(m));
      };
    })([])(v.fieldTypeOverrides)))(["Data.Argonaut.Core", "GraphQL.Hasura.Array"])))));
    var getDefinitionTypeName = function() {
      var $309 = filter3(function(l) {
        return take4(length4(commentPrefix))(l) !== commentPrefix;
      });
      var $310 = takeWhile3(notEq1(codePointFromChar("=")));
      return function($311) {
        return fromLines($309(toLines($310($311))));
      };
    }();
    var removeDuplicateDefinitions = nubBy(on(compare4)(getDefinitionTypeName));
    var enumTypeDefinitionToPurs = function(v1) {
      return Nothing.value;
    };
    var directiveDefinitionToPurs = function(v1) {
      return Nothing.value;
    };
    var builtInTypes = ["Int", "Number", "String", "Boolean", "GraphQL.Hasura.Array.Hasura_text"];
    var scalarTypeDefinitionToPurs = function(v1) {
      var tName = typeName_(v1.name);
      var typeAndModule = fromMaybe({
        moduleName: "Data.Argonaut.Core",
        typeName: "Json -- Unknown scalar type. Add " + (tName + " to externalTypes in codegen options to override this behaviour")
      })(lookup4(tName)(v.externalTypes));
      return guard5(notElem3(tName)(builtInTypes))(docComment3(v1.description) + ("type " + (tName + (" = " + (typeAndModule.moduleName + ("." + typeAndModule.typeName))))));
    };
    var argTypeToPurs = function(v1) {
      if (v1 instanceof Type_NamedType) {
        return namedTypeToPurs_(v1.value0);
      }
      ;
      if (v1 instanceof Type_ListType) {
        return argListTypeToPurs(v1.value0);
      }
      ;
      if (v1 instanceof Type_NonNullType) {
        return wrapNotNull(argNotNullTypeToPurs(v1.value0));
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 421, column 19 - line 424, column 89): " + [v1.constructor.name]);
    };
    var argNotNullTypeToPurs = function(v1) {
      if (v1 instanceof NonNullType_NamedType) {
        return namedTypeToPurs_(v1.value0);
      }
      ;
      if (v1 instanceof NonNullType_ListType) {
        return argListTypeToPurs(v1.value0);
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 427, column 26 - line 429, column 54): " + [v1.constructor.name]);
    };
    var argListTypeToPurs = function(v1) {
      return "(Array " + (argTypeToPurs(v1) + ")");
    };
    var inputValueDefinitionToPurs = function(objectName) {
      return function(v1) {
        return inlineComment(v1.description) + (safeFieldname(v1.name) + (" :: " + function() {
          var v2 = bind5(lookup4(objectName)(v.fieldTypeOverrides))(lookup4(v1.name));
          if (v2 instanceof Nothing) {
            return argTypeToPurs(v1.type);
          }
          ;
          if (v2 instanceof Just) {
            if (v1.type instanceof Type_NonNullType) {
              return wrapNotNull(v2.value0.moduleName + ("." + v2.value0.typeName));
            }
            ;
            if (v1.type instanceof Type_ListType) {
              return wrapArray(v2.value0.moduleName + ("." + v2.value0.typeName));
            }
            ;
            return v2.value0.moduleName + ("." + v2.value0.typeName);
          }
          ;
          throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 410, column 10 - line 415, column 53): " + [v2.constructor.name]);
        }()));
      };
    };
    var inputValueToFieldsDefinitionToPurs = function(objectName) {
      return function(definitions) {
        return indent("\n{ " + (intercalate7("\n, ")(map17(inputValueDefinitionToPurs(objectName))(definitions)) + "\n}"));
      };
    };
    var inputObjectTypeDefinitionToPurs = function(v1) {
      var tName = typeName_(v1.name);
      return docComment3(v1.description) + ("newtype " + (tName + (" = " + (tName + (maybe("{}")(function(v2) {
        return inputValueToFieldsDefinitionToPurs(tName)(v2);
      })(v1.inputFieldsDefinition) + ("\nderive instance newtype" + (tName + (" :: Newtype " + (tName + (" _" + ("\ninstance argToGql" + (tName + (" :: (Newtype " + (tName + (" {| p},  RecordArg p a u) => ArgGql " + (tName + " { | a }"))))))))))))))));
    };
    var inputValueDefinitionsToPurs = function(v1) {
      return inlineComment(v1.description) + (safeFieldname(v1.name) + (" :: " + argTypeToPurs(v1.type)));
    };
    var argumentsDefinitionToPurs = function(v1) {
      return indent("\n{ " + (intercalate7("\n, ")(map17(inputValueDefinitionsToPurs)(v1)) + "\n}\n-> "));
    };
    var fieldDefinitionToPurs = function(objectName) {
      return function(v1) {
        return inlineComment(v1.description) + (safeFieldname(v1.name) + (" :: " + (foldMap5(argumentsDefinitionToPurs)(v1.argumentsDefinition) + function() {
          var v2 = bind5(lookup4(objectName)(v.fieldTypeOverrides))(lookup4(v1.name));
          if (v2 instanceof Nothing) {
            return typeToPurs(v1.type);
          }
          ;
          if (v2 instanceof Just) {
            if (v1.type instanceof Type_NonNullType) {
              return v2.value0.moduleName + ("." + v2.value0.typeName);
            }
            ;
            if (v1.type instanceof Type_ListType) {
              return wrapArray(v2.value0.moduleName + ("." + v2.value0.typeName));
            }
            ;
            return wrapMaybe(v2.value0.moduleName + ("." + v2.value0.typeName));
          }
          ;
          throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 300, column 10 - line 305, column 65): " + [v2.constructor.name]);
        }())));
      };
    };
    var fieldsDefinitionToPurs = function(objectName) {
      return function(v1) {
        return indent("\n{ " + (intercalate7("\n, ")(map17(fieldDefinitionToPurs(objectName))(v1)) + "\n}"));
      };
    };
    var objectTypeDefinitionToPurs = function(v1) {
      var tName = typeName_(v1.name);
      return docComment3(v1.description) + function() {
        if (v.useNewtypesForRecords) {
          return "newtype " + (typeName_(v1.name) + (" = " + (typeName_(v1.name) + (" " + (maybe("{}")(fieldsDefinitionToPurs(tName))(v1.fieldsDefinition) + ("\nderive instance newtype" + (tName + (" :: Newtype " + (tName + (" _" + ("\ninstance argToGql" + (tName + (" :: (Newtype " + (tName + (" {| p},  RecordArg p a u) => ArgGql " + (tName + " { | a }"))))))))))))))));
        }
        ;
        return "type " + (typeName_(v1.name) + foldMap5(function(fd) {
          return " = " + fieldsDefinitionToPurs(tName)(fd);
        })(v1.fieldsDefinition));
      }();
    };
    var typeDefinitionToPurs = function(v1) {
      if (v1 instanceof TypeDefinition_ScalarTypeDefinition) {
        return new Just(scalarTypeDefinitionToPurs(v1.value0));
      }
      ;
      if (v1 instanceof TypeDefinition_ObjectTypeDefinition) {
        return new Just(objectTypeDefinitionToPurs(v1.value0));
      }
      ;
      if (v1 instanceof TypeDefinition_InterfaceTypeDefinition) {
        return interfaceTypeDefinitionToPurs(v1.value0);
      }
      ;
      if (v1 instanceof TypeDefinition_UnionTypeDefinition) {
        return unionTypeDefinitionToPurs(v1.value0);
      }
      ;
      if (v1 instanceof TypeDefinition_EnumTypeDefinition) {
        return enumTypeDefinitionToPurs(v1.value0);
      }
      ;
      if (v1 instanceof TypeDefinition_InputObjectTypeDefinition) {
        return new Just(inputObjectTypeDefinitionToPurs(v1.value0));
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 212, column 26 - line 218, column 143): " + [v1.constructor.name]);
    };
    var typeSystemDefinitionToPurs = function(v1) {
      if (v1 instanceof TypeSystemDefinition_SchemaDefinition) {
        return new Just(schemaDefinitionToPurs(v1.value0));
      }
      ;
      if (v1 instanceof TypeSystemDefinition_TypeDefinition) {
        return typeDefinitionToPurs(v1.value0);
      }
      ;
      if (v1 instanceof TypeSystemDefinition_DirectiveDefinition) {
        return directiveDefinitionToPurs(v1.value0);
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 188, column 32 - line 191, column 118): " + [v1.constructor.name]);
    };
    var definitionToPurs = function(v1) {
      if (v1 instanceof Definition_ExecutableDefinition) {
        return Nothing.value;
      }
      ;
      if (v1 instanceof Definition_TypeSystemDefinition) {
        return typeSystemDefinitionToPurs(v1.value0);
      }
      ;
      if (v1 instanceof Definition_TypeSystemExtension) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 182, column 22 - line 185, column 52): " + [v1.constructor.name]);
    };
    var mainCode = intercalate7("\n\n")(removeDuplicateDefinitions(mapMaybe(definitionToPurs)(unwrap5(doc))));
    return imports + (guard5(imports !== "")("\n") + ("\n" + mainCode));
  };
};
var gqlToPursEnums = function(gqlScalarsToPursTypes) {
  var typeName_ = typeName(gqlScalarsToPursTypes);
  var enumValuesDefinitionToPurs = function(def) {
    return fromFoldable1(mapFlipped4(unwrap5(def))(function(v) {
      return unwrap5(v.enumValue);
    }));
  };
  var typeDefinitionToPurs = function(v) {
    if (v instanceof TypeDefinition_EnumTypeDefinition) {
      return new Just({
        name: typeName_(v.value0.name),
        description: v.value0.description,
        values: maybe([])(enumValuesDefinitionToPurs)(v.value0.enumValuesDefinition)
      });
    }
    ;
    return Nothing.value;
  };
  var typeSystemDefinitionToPurs = function(v) {
    if (v instanceof TypeSystemDefinition_TypeDefinition) {
      return typeDefinitionToPurs(v.value0);
    }
    ;
    return Nothing.value;
  };
  var definitionToEnum = function(v) {
    if (v instanceof Definition_TypeSystemDefinition) {
      return typeSystemDefinitionToPurs(v.value0);
    }
    ;
    return Nothing.value;
  };
  var $312 = mapMaybe(definitionToEnum);
  return function($313) {
    return fromFoldable1($312(unwrap5($313)));
  };
};
var schemaFromGqlToPurs = function(opts) {
  return function(v) {
    return mapFlipped1(mapFlipped1(lmap5(toParserError)(documentFromIntrospection(v.schema)))(applyNullableOverrides(opts.nullableOverrides)))(function(ast) {
      var symbols = fromFoldable1(getSymbols(ast));
      return {
        mainSchemaCode: gqlToPursMainSchemaCode(opts)(ast),
        enums: gqlToPursEnums(opts.gqlScalarsToPursTypes)(ast),
        symbols,
        moduleName: v.moduleName
      };
    });
  };
};
var schemaFromGqlToPursWithCache = function(opts) {
  return function(v) {
    var stringSchema = stringify(v.schema);
    var go = function(v1) {
      if (v1 instanceof Nothing) {
        return pure5(schemaFromGqlToPurs(opts)({
          schema: v.schema,
          moduleName: v.moduleName
        }));
      }
      ;
      if (v1 instanceof Just) {
        return bind12(v1.value0.get(stringSchema))(function(jsonMay) {
          var v2 = bind5(jsonMay)(function($314) {
            return hush(decodeJson2($314));
          });
          if (v2 instanceof Nothing) {
            return bind12(go(Nothing.value))(function(eVal) {
              return discard2(function() {
                var v3 = schemaFromGqlToPurs(opts)({
                  schema: v.schema,
                  moduleName: v.moduleName
                });
                if (v3 instanceof Right) {
                  return v1.value0.set({
                    key: stringSchema,
                    val: encodeJson2(v3.value0)
                  });
                }
                ;
                return pure5(unit);
              }())(function() {
                return pure5(eVal);
              });
            });
          }
          ;
          if (v2 instanceof Just) {
            return pure5(new Right(v2.value0));
          }
          ;
          throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 114, column 5 - line 121, column 35): " + [v2.constructor.name]);
        });
      }
      ;
      throw new Error("Failed pattern match at GraphQL.Client.CodeGen.Schema (line 110, column 3 - line 110, column 70): " + [v1.constructor.name]);
    };
    return go(opts.cache);
  };
};
var schemasFromGqlToPurs = function(opts_) {
  var fieldTypeOverrides = unions2(mapWithIndex4(function(gqlObjectName) {
    return function(obj) {
      return fromFoldable22([new Tuple(gqlObjectName, obj), new Tuple(gqlObjectName + "InsertInput", obj), new Tuple(gqlObjectName + "MinFields", obj), new Tuple(gqlObjectName + "MaxFields", obj), new Tuple(gqlObjectName + "SetInput", obj), new Tuple(gqlObjectName + "BoolExp", map24(function(o) {
        return {
          typeName: o.typeName + "ComparisonExp",
          moduleName: o.moduleName
        };
      })(obj))]);
    };
  })(opts_.fieldTypeOverrides));
  var opts = {
    fieldTypeOverrides,
    cache: opts_.cache,
    customEnumCode: opts_.customEnumCode,
    dir: opts_.dir,
    enumImports: opts_.enumImports,
    enumValueNameTransform: opts_.enumValueNameTransform,
    externalTypes: opts_.externalTypes,
    gqlScalarsToPursTypes: opts_.gqlScalarsToPursTypes,
    idImport: opts_.idImport,
    isHasura: opts_.isHasura,
    modulePath: opts_.modulePath,
    nullableOverrides: opts_.nullableOverrides,
    useNewtypesForRecords: opts_.useNewtypesForRecords
  };
  var modulePrefix = foldMap13(function(v) {
    return v + ".";
  })(opts.modulePath);
  var collectSchemas = function(pursGqls) {
    return {
      schemas: mapFlipped22(pursGqls)(function(pg) {
        return {
          code: template2({
            name: pg.moduleName,
            mainSchemaCode: pg.mainSchemaCode,
            idImport: opts.idImport,
            enums: map16(function(v) {
              return v.name;
            })(pg.enums),
            modulePrefix
          }),
          path: opts.dir + ("/Schema/" + (pg.moduleName + ".purs"))
        };
      }),
      enums: nubBy2(on(compare4)(function(v) {
        return v.path;
      }))(bind22(pursGqls)(function(pg) {
        return mapFlipped22(pg.enums)(function(v) {
          return {
            code: template(modulePrefix)({
              name: v.name,
              schemaName: pg.moduleName,
              values: v.values,
              description: v.description,
              imports: opts.enumImports,
              customCode: opts.customEnumCode,
              enumValueNameTransform: opts.enumValueNameTransform
            }),
            path: opts.dir + ("/Schema/" + (pg.moduleName + ("/Enum/" + (v.name + ".purs"))))
          };
        });
      })),
      symbols: function(syms) {
        return {
          path: opts.dir + "/Symbols.purs",
          code: symbolsToCode2(modulePrefix)(syms)
        };
      }(bind22(pursGqls)(function(v) {
        return v.symbols;
      }))
    };
  };
  var $315 = map32(map42(collectSchemas));
  var $316 = map32(sequence2);
  var $317 = traverse3(schemaFromGqlToPursWithCache(opts));
  return function($318) {
    return $315($316($317($318)));
  };
};

// output/GraphQL.Client.CodeGen.Js/index.js
var fromFoldableWithIndex2 = /* @__PURE__ */ fromFoldableWithIndex(ordString)(foldableWithIndexObject);
var semigroupRecord3 = /* @__PURE__ */ semigroupRecord()(/* @__PURE__ */ semigroupRecordCons({
  reflectSymbol: function() {
    return "moduleName";
  }
})()(/* @__PURE__ */ semigroupRecordCons({
  reflectSymbol: function() {
    return "typeName";
  }
})()(semigroupRecordNil)(semigroupString))(semigroupString));
var mempty4 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidObject(semigroupRecord3));
var map18 = /* @__PURE__ */ map(functorMap);
var mempty1 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidObject(/* @__PURE__ */ semigroupObject(semigroupRecord3)));
var mempty22 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidObject(semigroupString));
var mapFlipped5 = /* @__PURE__ */ mapFlipped(functorMaybe);
var map19 = /* @__PURE__ */ map(functorFn);
var map25 = /* @__PURE__ */ map(functorAff);
var mempty32 = /* @__PURE__ */ mempty(monoidString);
var monoidRecord2 = /* @__PURE__ */ monoidRecord();
var mempty42 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidRecord2(/* @__PURE__ */ monoidRecordCons({
  reflectSymbol: function() {
    return "enums";
  }
})(monoidArray)()(/* @__PURE__ */ monoidRecordCons({
  reflectSymbol: function() {
    return "schemas";
  }
})(monoidArray)()(/* @__PURE__ */ monoidRecordCons({
  reflectSymbol: function() {
    return "symbols";
  }
})(/* @__PURE__ */ monoidRecord2(/* @__PURE__ */ monoidRecordCons({
  reflectSymbol: function() {
    return "code";
  }
})(monoidString)()(/* @__PURE__ */ monoidRecordCons({
  reflectSymbol: function() {
    return "path";
  }
})(monoidString)()(monoidRecordNil))))()(monoidRecordNil)))));
var fromNullable = function(a) {
  var $62 = fromMaybe(a);
  return function($63) {
    return $62(toMaybe($63));
  };
};
var schemasFromGqlToPursJs = /* @__PURE__ */ function() {
  var go = function(optsJs) {
    var opts = {
      externalTypes: fromFoldableWithIndex2(fromNullable(mempty4)(optsJs.externalTypes)),
      fieldTypeOverrides: map18(fromFoldableWithIndex2)(fromFoldableWithIndex2(fromNullable(mempty1)(optsJs.fieldTypeOverrides))),
      gqlScalarsToPursTypes: fromFoldableWithIndex2(fromNullable(mempty22)(optsJs.gqlScalarsToPursTypes)),
      nullableOverrides: map18(fromFoldableWithIndex2)(fromFoldableWithIndex2(fromNullable(empty3)(optsJs.nullableOverrides))),
      dir: fromNullable("")(optsJs.dir),
      modulePath: fromNullable([])(optsJs.modulePath),
      isHasura: fromNullable(false)(optsJs.isHasura),
      useNewtypesForRecords: fromNullable(true)(optsJs.useNewtypesForRecords),
      enumImports: fromNullable([])(optsJs.enumImports),
      customEnumCode: fromNullable($$const(""))(optsJs.customEnumCode),
      idImport: toMaybe(optsJs.idImport),
      enumValueNameTransform: toMaybe(optsJs.enumValueNameTransform),
      cache: mapFlipped5(toMaybe(optsJs.cache))(function(v) {
        return {
          get: map19(function() {
            var $64 = map25(toMaybe);
            return function($65) {
              return $64(toAff($65));
            };
          }())(v.get),
          set: map19(toAff)(v.set)
        };
      })
    };
    var getError = function(err) {
      return {
        parseError: parseErrorMessage(err),
        argsTypeError: mempty32,
        result: mempty42
      };
    };
    var $66 = map25(either(getError)(function(v) {
      return {
        result: v,
        parseError: "",
        argsTypeError: ""
      };
    }));
    var $67 = schemasFromGqlToPurs(opts);
    return function($68) {
      return fromAff($66($67($68)));
    };
  };
  return mkFn2(go);
}();
export {
  fromNullable,
  schemasFromGqlToPursJs
};
