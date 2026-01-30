var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
if (typeof BigInt === "undefined") BigInt = function(n) {
  if (isNaN(n)) throw new Error("");
  return n;
};
const C_ZERO = BigInt(0);
const C_ONE = BigInt(1);
const C_TWO = BigInt(2);
const C_THREE = BigInt(3);
const C_FIVE = BigInt(5);
const C_TEN = BigInt(10);
BigInt(Number.MAX_SAFE_INTEGER);
const MAX_CYCLE_LEN = 2e3;
const P$1 = {
  "s": C_ONE,
  "n": C_ZERO,
  "d": C_ONE
};
function assign(n, s) {
  try {
    n = BigInt(n);
  } catch (e) {
    throw InvalidParameter();
  }
  return n * s;
}
function ifloor(x3) {
  return typeof x3 === "bigint" ? x3 : Math.floor(x3);
}
function newFraction(n, d2) {
  if (d2 === C_ZERO) {
    throw DivisionByZero();
  }
  const f2 = Object.create(Fraction.prototype);
  f2["s"] = n < C_ZERO ? -C_ONE : C_ONE;
  n = n < C_ZERO ? -n : n;
  const a = gcd(n, d2);
  f2["n"] = n / a;
  f2["d"] = d2 / a;
  return f2;
}
const FACTORSTEPS = [C_TWO * C_TWO, C_TWO, C_TWO * C_TWO, C_TWO, C_TWO * C_TWO, C_TWO * C_THREE, C_TWO, C_TWO * C_THREE];
function factorize(n) {
  const factors = /* @__PURE__ */ Object.create(null);
  if (n <= C_ONE) {
    factors[n] = C_ONE;
    return factors;
  }
  const add = (p) => {
    factors[p] = (factors[p] || C_ZERO) + C_ONE;
  };
  while (n % C_TWO === C_ZERO) {
    add(C_TWO);
    n /= C_TWO;
  }
  while (n % C_THREE === C_ZERO) {
    add(C_THREE);
    n /= C_THREE;
  }
  while (n % C_FIVE === C_ZERO) {
    add(C_FIVE);
    n /= C_FIVE;
  }
  for (let si2 = 0, p = C_TWO + C_FIVE; p * p <= n; ) {
    while (n % p === C_ZERO) {
      add(p);
      n /= p;
    }
    p += FACTORSTEPS[si2];
    si2 = si2 + 1 & 7;
  }
  if (n > C_ONE) add(n);
  return factors;
}
const parse$1 = function(p1, p2) {
  let n = C_ZERO, d2 = C_ONE, s = C_ONE;
  if (p1 === void 0 || p1 === null) ;
  else if (p2 !== void 0) {
    if (typeof p1 === "bigint") {
      n = p1;
    } else if (isNaN(p1)) {
      throw InvalidParameter();
    } else if (p1 % 1 !== 0) {
      throw NonIntegerParameter();
    } else {
      n = BigInt(p1);
    }
    if (typeof p2 === "bigint") {
      d2 = p2;
    } else if (isNaN(p2)) {
      throw InvalidParameter();
    } else if (p2 % 1 !== 0) {
      throw NonIntegerParameter();
    } else {
      d2 = BigInt(p2);
    }
    s = n * d2;
  } else if (typeof p1 === "object") {
    if ("d" in p1 && "n" in p1) {
      n = BigInt(p1["n"]);
      d2 = BigInt(p1["d"]);
      if ("s" in p1)
        n *= BigInt(p1["s"]);
    } else if (0 in p1) {
      n = BigInt(p1[0]);
      if (1 in p1)
        d2 = BigInt(p1[1]);
    } else if (typeof p1 === "bigint") {
      n = p1;
    } else {
      throw InvalidParameter();
    }
    s = n * d2;
  } else if (typeof p1 === "number") {
    if (isNaN(p1)) {
      throw InvalidParameter();
    }
    if (p1 < 0) {
      s = -C_ONE;
      p1 = -p1;
    }
    if (p1 % 1 === 0) {
      n = BigInt(p1);
    } else {
      let z2 = 1;
      let A2 = 0, B2 = 1;
      let C3 = 1, D2 = 1;
      let N2 = 1e7;
      if (p1 >= 1) {
        z2 = 10 ** Math.floor(1 + Math.log10(p1));
        p1 /= z2;
      }
      while (B2 <= N2 && D2 <= N2) {
        let M2 = (A2 + C3) / (B2 + D2);
        if (p1 === M2) {
          if (B2 + D2 <= N2) {
            n = A2 + C3;
            d2 = B2 + D2;
          } else if (D2 > B2) {
            n = C3;
            d2 = D2;
          } else {
            n = A2;
            d2 = B2;
          }
          break;
        } else {
          if (p1 > M2) {
            A2 += C3;
            B2 += D2;
          } else {
            C3 += A2;
            D2 += B2;
          }
          if (B2 > N2) {
            n = C3;
            d2 = D2;
          } else {
            n = A2;
            d2 = B2;
          }
        }
      }
      n = BigInt(n) * BigInt(z2);
      d2 = BigInt(d2);
    }
  } else if (typeof p1 === "string") {
    let ndx = 0;
    let v2 = C_ZERO, w2 = C_ZERO, x3 = C_ZERO, y = C_ONE, z2 = C_ONE;
    let match = p1.replace(/_/g, "").match(/\d+|./g);
    if (match === null)
      throw InvalidParameter();
    if (match[ndx] === "-") {
      s = -C_ONE;
      ndx++;
    } else if (match[ndx] === "+") {
      ndx++;
    }
    if (match.length === ndx + 1) {
      w2 = assign(match[ndx++], s);
    } else if (match[ndx + 1] === "." || match[ndx] === ".") {
      if (match[ndx] !== ".") {
        v2 = assign(match[ndx++], s);
      }
      ndx++;
      if (ndx + 1 === match.length || match[ndx + 1] === "(" && match[ndx + 3] === ")" || match[ndx + 1] === "'" && match[ndx + 3] === "'") {
        w2 = assign(match[ndx], s);
        y = C_TEN ** BigInt(match[ndx].length);
        ndx++;
      }
      if (match[ndx] === "(" && match[ndx + 2] === ")" || match[ndx] === "'" && match[ndx + 2] === "'") {
        x3 = assign(match[ndx + 1], s);
        z2 = C_TEN ** BigInt(match[ndx + 1].length) - C_ONE;
        ndx += 3;
      }
    } else if (match[ndx + 1] === "/" || match[ndx + 1] === ":") {
      w2 = assign(match[ndx], s);
      y = assign(match[ndx + 2], C_ONE);
      ndx += 3;
    } else if (match[ndx + 3] === "/" && match[ndx + 1] === " ") {
      v2 = assign(match[ndx], s);
      w2 = assign(match[ndx + 2], s);
      y = assign(match[ndx + 4], C_ONE);
      ndx += 5;
    }
    if (match.length <= ndx) {
      d2 = y * z2;
      s = /* void */
      n = x3 + d2 * v2 + z2 * w2;
    } else {
      throw InvalidParameter();
    }
  } else if (typeof p1 === "bigint") {
    n = p1;
    s = p1;
    d2 = C_ONE;
  } else {
    throw InvalidParameter();
  }
  if (d2 === C_ZERO) {
    throw DivisionByZero();
  }
  P$1["s"] = s < C_ZERO ? -C_ONE : C_ONE;
  P$1["n"] = n < C_ZERO ? -n : n;
  P$1["d"] = d2 < C_ZERO ? -d2 : d2;
};
function modpow(b2, e, m2) {
  let r = C_ONE;
  for (; e > C_ZERO; b2 = b2 * b2 % m2, e >>= C_ONE) {
    if (e & C_ONE) {
      r = r * b2 % m2;
    }
  }
  return r;
}
function cycleLen(n, d2) {
  for (; d2 % C_TWO === C_ZERO; d2 /= C_TWO) {
  }
  for (; d2 % C_FIVE === C_ZERO; d2 /= C_FIVE) {
  }
  if (d2 === C_ONE)
    return C_ZERO;
  let rem = C_TEN % d2;
  let t2 = 1;
  for (; rem !== C_ONE; t2++) {
    rem = rem * C_TEN % d2;
    if (t2 > MAX_CYCLE_LEN)
      return C_ZERO;
  }
  return BigInt(t2);
}
function cycleStart(n, d2, len) {
  let rem1 = C_ONE;
  let rem2 = modpow(C_TEN, len, d2);
  for (let t2 = 0; t2 < 300; t2++) {
    if (rem1 === rem2)
      return BigInt(t2);
    rem1 = rem1 * C_TEN % d2;
    rem2 = rem2 * C_TEN % d2;
  }
  return 0;
}
function gcd(a, b2) {
  if (!a)
    return b2;
  if (!b2)
    return a;
  while (1) {
    a %= b2;
    if (!a)
      return b2;
    b2 %= a;
    if (!b2)
      return a;
  }
}
function Fraction(a, b2) {
  parse$1(a, b2);
  if (this instanceof Fraction) {
    a = gcd(P$1["d"], P$1["n"]);
    this["s"] = P$1["s"];
    this["n"] = P$1["n"] / a;
    this["d"] = P$1["d"] / a;
  } else {
    return newFraction(P$1["s"] * P$1["n"], P$1["d"]);
  }
}
const DivisionByZero = function() {
  return new Error("Division by Zero");
};
const InvalidParameter = function() {
  return new Error("Invalid argument");
};
const NonIntegerParameter = function() {
  return new Error("Parameters must be integer");
};
Fraction.prototype = {
  "s": C_ONE,
  "n": C_ZERO,
  "d": C_ONE,
  /**
   * Calculates the absolute value
   *
   * Ex: new Fraction(-4).abs() => 4
   **/
  "abs": function() {
    return newFraction(this["n"], this["d"]);
  },
  /**
   * Inverts the sign of the current fraction
   *
   * Ex: new Fraction(-4).neg() => 4
   **/
  "neg": function() {
    return newFraction(-this["s"] * this["n"], this["d"]);
  },
  /**
   * Adds two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
   **/
  "add": function(a, b2) {
    parse$1(a, b2);
    return newFraction(
      this["s"] * this["n"] * P$1["d"] + P$1["s"] * this["d"] * P$1["n"],
      this["d"] * P$1["d"]
    );
  },
  /**
   * Subtracts two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
   **/
  "sub": function(a, b2) {
    parse$1(a, b2);
    return newFraction(
      this["s"] * this["n"] * P$1["d"] - P$1["s"] * this["d"] * P$1["n"],
      this["d"] * P$1["d"]
    );
  },
  /**
   * Multiplies two rational numbers
   *
   * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
   **/
  "mul": function(a, b2) {
    parse$1(a, b2);
    return newFraction(
      this["s"] * P$1["s"] * this["n"] * P$1["n"],
      this["d"] * P$1["d"]
    );
  },
  /**
   * Divides two rational numbers
   *
   * Ex: new Fraction("-17.(345)").inverse().div(3)
   **/
  "div": function(a, b2) {
    parse$1(a, b2);
    return newFraction(
      this["s"] * P$1["s"] * this["n"] * P$1["d"],
      this["d"] * P$1["n"]
    );
  },
  /**
   * Clones the actual object
   *
   * Ex: new Fraction("-17.(345)").clone()
   **/
  "clone": function() {
    return newFraction(this["s"] * this["n"], this["d"]);
  },
  /**
   * Calculates the modulo of two rational numbers - a more precise fmod
   *
   * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
   * Ex: new Fraction(20, 10).mod().equals(0) ? "is Integer"
   **/
  "mod": function(a, b2) {
    if (a === void 0) {
      return newFraction(this["s"] * this["n"] % this["d"], C_ONE);
    }
    parse$1(a, b2);
    if (C_ZERO === P$1["n"] * this["d"]) {
      throw DivisionByZero();
    }
    return newFraction(
      this["s"] * (P$1["d"] * this["n"]) % (P$1["n"] * this["d"]),
      P$1["d"] * this["d"]
    );
  },
  /**
   * Calculates the fractional gcd of two rational numbers
   *
   * Ex: new Fraction(5,8).gcd(3,7) => 1/56
   */
  "gcd": function(a, b2) {
    parse$1(a, b2);
    return newFraction(gcd(P$1["n"], this["n"]) * gcd(P$1["d"], this["d"]), P$1["d"] * this["d"]);
  },
  /**
   * Calculates the fractional lcm of two rational numbers
   *
   * Ex: new Fraction(5,8).lcm(3,7) => 15
   */
  "lcm": function(a, b2) {
    parse$1(a, b2);
    if (P$1["n"] === C_ZERO && this["n"] === C_ZERO) {
      return newFraction(C_ZERO, C_ONE);
    }
    return newFraction(P$1["n"] * this["n"], gcd(P$1["n"], this["n"]) * gcd(P$1["d"], this["d"]));
  },
  /**
   * Gets the inverse of the fraction, means numerator and denominator are exchanged
   *
   * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
   **/
  "inverse": function() {
    return newFraction(this["s"] * this["d"], this["n"]);
  },
  /**
   * Calculates the fraction to some integer exponent
   *
   * Ex: new Fraction(-1,2).pow(-3) => -8
   */
  "pow": function(a, b2) {
    parse$1(a, b2);
    if (P$1["d"] === C_ONE) {
      if (P$1["s"] < C_ZERO) {
        return newFraction((this["s"] * this["d"]) ** P$1["n"], this["n"] ** P$1["n"]);
      } else {
        return newFraction((this["s"] * this["n"]) ** P$1["n"], this["d"] ** P$1["n"]);
      }
    }
    if (this["s"] < C_ZERO) return null;
    let N2 = factorize(this["n"]);
    let D2 = factorize(this["d"]);
    let n = C_ONE;
    let d2 = C_ONE;
    for (let k2 in N2) {
      if (k2 === "1") continue;
      if (k2 === "0") {
        n = C_ZERO;
        break;
      }
      N2[k2] *= P$1["n"];
      if (N2[k2] % P$1["d"] === C_ZERO) {
        N2[k2] /= P$1["d"];
      } else return null;
      n *= BigInt(k2) ** N2[k2];
    }
    for (let k2 in D2) {
      if (k2 === "1") continue;
      D2[k2] *= P$1["n"];
      if (D2[k2] % P$1["d"] === C_ZERO) {
        D2[k2] /= P$1["d"];
      } else return null;
      d2 *= BigInt(k2) ** D2[k2];
    }
    if (P$1["s"] < C_ZERO) {
      return newFraction(d2, n);
    }
    return newFraction(n, d2);
  },
  /**
   * Calculates the logarithm of a fraction to a given rational base
   *
   * Ex: new Fraction(27, 8).log(9, 4) => 3/2
   */
  "log": function(a, b2) {
    parse$1(a, b2);
    if (this["s"] <= C_ZERO || P$1["s"] <= C_ZERO) return null;
    const allPrimes = /* @__PURE__ */ Object.create(null);
    const baseFactors = factorize(P$1["n"]);
    const T1 = factorize(P$1["d"]);
    const numberFactors = factorize(this["n"]);
    const T2 = factorize(this["d"]);
    for (const prime in T1) {
      baseFactors[prime] = (baseFactors[prime] || C_ZERO) - T1[prime];
    }
    for (const prime in T2) {
      numberFactors[prime] = (numberFactors[prime] || C_ZERO) - T2[prime];
    }
    for (const prime in baseFactors) {
      if (prime === "1") continue;
      allPrimes[prime] = true;
    }
    for (const prime in numberFactors) {
      if (prime === "1") continue;
      allPrimes[prime] = true;
    }
    let retN = null;
    let retD = null;
    for (const prime in allPrimes) {
      const baseExponent = baseFactors[prime] || C_ZERO;
      const numberExponent = numberFactors[prime] || C_ZERO;
      if (baseExponent === C_ZERO) {
        if (numberExponent !== C_ZERO) {
          return null;
        }
        continue;
      }
      let curN = numberExponent;
      let curD = baseExponent;
      const gcdValue = gcd(curN, curD);
      curN /= gcdValue;
      curD /= gcdValue;
      if (retN === null && retD === null) {
        retN = curN;
        retD = curD;
      } else if (curN * retD !== retN * curD) {
        return null;
      }
    }
    return retN !== null && retD !== null ? newFraction(retN, retD) : null;
  },
  /**
   * Check if two rational numbers are the same
   *
   * Ex: new Fraction(19.6).equals([98, 5]);
   **/
  "equals": function(a, b2) {
    parse$1(a, b2);
    return this["s"] * this["n"] * P$1["d"] === P$1["s"] * P$1["n"] * this["d"];
  },
  /**
   * Check if this rational number is less than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "lt": function(a, b2) {
    parse$1(a, b2);
    return this["s"] * this["n"] * P$1["d"] < P$1["s"] * P$1["n"] * this["d"];
  },
  /**
   * Check if this rational number is less than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "lte": function(a, b2) {
    parse$1(a, b2);
    return this["s"] * this["n"] * P$1["d"] <= P$1["s"] * P$1["n"] * this["d"];
  },
  /**
   * Check if this rational number is greater than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "gt": function(a, b2) {
    parse$1(a, b2);
    return this["s"] * this["n"] * P$1["d"] > P$1["s"] * P$1["n"] * this["d"];
  },
  /**
   * Check if this rational number is greater than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "gte": function(a, b2) {
    parse$1(a, b2);
    return this["s"] * this["n"] * P$1["d"] >= P$1["s"] * P$1["n"] * this["d"];
  },
  /**
   * Compare two rational numbers
   * < 0 iff this < that
   * > 0 iff this > that
   * = 0 iff this = that
   *
   * Ex: new Fraction(19.6).compare([98, 5]);
   **/
  "compare": function(a, b2) {
    parse$1(a, b2);
    let t2 = this["s"] * this["n"] * P$1["d"] - P$1["s"] * P$1["n"] * this["d"];
    return (C_ZERO < t2) - (t2 < C_ZERO);
  },
  /**
   * Calculates the ceil of a rational number
   *
   * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
   **/
  "ceil": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      ifloor(this["s"] * places * this["n"] / this["d"]) + (places * this["n"] % this["d"] > C_ZERO && this["s"] >= C_ZERO ? C_ONE : C_ZERO),
      places
    );
  },
  /**
   * Calculates the floor of a rational number
   *
   * Ex: new Fraction('4.(3)').floor() => (4 / 1)
   **/
  "floor": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      ifloor(this["s"] * places * this["n"] / this["d"]) - (places * this["n"] % this["d"] > C_ZERO && this["s"] < C_ZERO ? C_ONE : C_ZERO),
      places
    );
  },
  /**
   * Rounds a rational numbers
   *
   * Ex: new Fraction('4.(3)').round() => (4 / 1)
   **/
  "round": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      ifloor(this["s"] * places * this["n"] / this["d"]) + this["s"] * ((this["s"] >= C_ZERO ? C_ONE : C_ZERO) + C_TWO * (places * this["n"] % this["d"]) > this["d"] ? C_ONE : C_ZERO),
      places
    );
  },
  /**
    * Rounds a rational number to a multiple of another rational number
    *
    * Ex: new Fraction('0.9').roundTo("1/8") => 7 / 8
    **/
  "roundTo": function(a, b2) {
    parse$1(a, b2);
    const n = this["n"] * P$1["d"];
    const d2 = this["d"] * P$1["n"];
    const r = n % d2;
    let k2 = ifloor(n / d2);
    if (r + r >= d2) {
      k2++;
    }
    return newFraction(this["s"] * k2 * P$1["n"], P$1["d"]);
  },
  /**
   * Check if two rational numbers are divisible
   *
   * Ex: new Fraction(19.6).divisible(1.5);
   */
  "divisible": function(a, b2) {
    parse$1(a, b2);
    if (P$1["n"] === C_ZERO) return false;
    return this["n"] * P$1["d"] % (P$1["n"] * this["d"]) === C_ZERO;
  },
  /**
   * Returns a decimal representation of the fraction
   *
   * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
   **/
  "valueOf": function() {
    return Number(this["s"] * this["n"]) / Number(this["d"]);
  },
  /**
   * Creates a string representation of a fraction with all digits
   *
   * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
   **/
  "toString": function(dec = 15) {
    let N2 = this["n"];
    let D2 = this["d"];
    let cycLen = cycleLen(N2, D2);
    let cycOff = cycleStart(N2, D2, cycLen);
    let str = this["s"] < C_ZERO ? "-" : "";
    str += ifloor(N2 / D2);
    N2 %= D2;
    N2 *= C_TEN;
    if (N2)
      str += ".";
    if (cycLen) {
      for (let i2 = cycOff; i2--; ) {
        str += ifloor(N2 / D2);
        N2 %= D2;
        N2 *= C_TEN;
      }
      str += "(";
      for (let i2 = cycLen; i2--; ) {
        str += ifloor(N2 / D2);
        N2 %= D2;
        N2 *= C_TEN;
      }
      str += ")";
    } else {
      for (let i2 = dec; N2 && i2--; ) {
        str += ifloor(N2 / D2);
        N2 %= D2;
        N2 *= C_TEN;
      }
    }
    return str;
  },
  /**
   * Returns a string-fraction representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
   **/
  "toFraction": function(showMixed = false) {
    let n = this["n"];
    let d2 = this["d"];
    let str = this["s"] < C_ZERO ? "-" : "";
    if (d2 === C_ONE) {
      str += n;
    } else {
      const whole = ifloor(n / d2);
      if (showMixed && whole > C_ZERO) {
        str += whole;
        str += " ";
        n %= d2;
      }
      str += n;
      str += "/";
      str += d2;
    }
    return str;
  },
  /**
   * Returns a latex representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
   **/
  "toLatex": function(showMixed = false) {
    let n = this["n"];
    let d2 = this["d"];
    let str = this["s"] < C_ZERO ? "-" : "";
    if (d2 === C_ONE) {
      str += n;
    } else {
      const whole = ifloor(n / d2);
      if (showMixed && whole > C_ZERO) {
        str += whole;
        n %= d2;
      }
      str += "\\frac{";
      str += n;
      str += "}{";
      str += d2;
      str += "}";
    }
    return str;
  },
  /**
   * Returns an array of continued fraction elements
   *
   * Ex: new Fraction("7/8").toContinued() => [0,1,7]
   */
  "toContinued": function() {
    let a = this["n"];
    let b2 = this["d"];
    const res = [];
    while (b2) {
      res.push(ifloor(a / b2));
      const t2 = a % b2;
      a = b2;
      b2 = t2;
    }
    return res;
  },
  "simplify": function(eps = 1e-3) {
    const ieps = BigInt(Math.ceil(1 / eps));
    const thisABS = this["abs"]();
    const cont = thisABS["toContinued"]();
    for (let i2 = 1; i2 < cont.length; i2++) {
      let s = newFraction(cont[i2 - 1], C_ONE);
      for (let k2 = i2 - 2; k2 >= 0; k2--) {
        s = s["inverse"]()["add"](cont[k2]);
      }
      let t2 = s["sub"](thisABS);
      if (t2["n"] * ieps < t2["d"]) {
        return s["mul"](this["s"]);
      }
    }
    return this;
  }
};
const Dt = "strudel.log";
let Oe = 1e3, Wt, $t;
function Gt(t2, e = "cyclist") {
  E$2(`[${e}] error: ${t2.message}`);
}
function E$2(t2, e, n = {}) {
  let s = performance.now();
  Wt === t2 && s - $t < Oe || (Wt = t2, $t = s, console.log(`%c${t2}`, "background-color: black;color:white;border-radius:15px"), typeof document < "u" && typeof CustomEvent < "u" && document.dispatchEvent(
    new CustomEvent(Dt, {
      detail: {
        message: t2,
        type: e,
        data: n
      }
    })
  ));
}
E$2.key = Dt;
const $a = (t2) => /^[a-gA-G][#bs]*[0-9]$/.test(t2), qt = (t2) => /^[a-gA-G][#bsf]*-?[0-9]?$/.test(t2), ze$1 = (t2) => {
  var _a2;
  if (typeof t2 != "string")
    return [];
  const [e, n = "", s] = ((_a2 = t2.match(/^([a-gA-G])([#bsf]*)(-?[0-9]*)$/)) == null ? void 0 : _a2.slice(1)) || [];
  return e ? [e, n, s ? Number(s) : void 0] : [];
}, Ee = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, Me$1 = { "#": 1, b: -1, s: 1, f: -1 }, pt$1 = (t2, e = 3) => {
  const [n, s, r = e] = ze$1(t2);
  if (!n)
    throw new Error('not a note: "' + t2 + '"');
  const o = Ee[n.toLowerCase()], c = (s == null ? void 0 : s.split("").reduce((u, a) => u + Me$1[a], 0)) || 0;
  return (Number(r) + 1) * 12 + o + c;
}, nt$2 = (t2) => Math.pow(2, (t2 - 69) / 12) * 440, Pe$1 = (t2) => 12 * Math.log(t2 / 440) / Math.LN2 + 69, Ra = (t2, e) => {
  if (typeof t2 != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: n, note: s } = t2;
  if (typeof n == "number")
    return Pe$1(n);
  if (typeof s == "string")
    return pt$1(s);
  if (typeof s == "number")
    return s;
  if (!e)
    throw new Error("valueToMidi: expected freq or note to be set");
  return e;
}, La = (t2, e) => (t2 - e) * 1e3, Je$1 = (t2) => nt$2(typeof t2 == "number" ? t2 : pt$1(t2)), je$1 = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], Ia = (t2) => {
  const e = Math.floor(t2 / 12) - 1;
  return je$1[t2 % 12] + e;
}, ft$1 = (t2, e) => (t2 % e + e) % e, Ne$1 = (t2) => t2.reduce((e, n) => e + n) / t2.length;
function We$1(t2, e = 0) {
  return isNaN(Number(t2)) ? (E$2(`"${t2}" is not a number, falling back to ${e}`, "warning"), e) : t2;
}
const Ha = (t2, e) => ft$1(Math.round(We$1(t2 ?? 0, 0)), e), Va = (t2) => {
  let { value: e, context: n } = t2, s = e;
  if (typeof s == "object" && !Array.isArray(s) && (s = s.note || s.n || s.value, s === void 0))
    throw new Error(`cannot find a playable note for ${JSON.stringify(e)}`);
  if (typeof s == "number" && n.type !== "frequency")
    s = nt$2(t2.value);
  else if (typeof s == "number" && n.type === "frequency")
    s = t2.value;
  else if (typeof s != "string" || !qt(s))
    throw new Error("not a note: " + JSON.stringify(s));
  return s;
}, Fa = (t2) => {
  let { value: e, context: n } = t2;
  if (typeof e == "object")
    return e.freq ? e.freq : Je$1(e.note || e.n || e.value);
  if (typeof e == "number" && n.type !== "frequency")
    e = nt$2(t2.value);
  else if (typeof e == "string" && qt(e))
    e = nt$2(pt$1(t2.value));
  else if (typeof e != "number")
    throw new Error("not a note or frequency: " + e);
  return e;
}, $e$1 = (t2, e) => t2.slice(e).concat(t2.slice(0, e)), Re$1 = (...t2) => t2.reduce(
  (e, n) => (...s) => e(n(...s)),
  (e) => e
), Da = (...t2) => Re$1(...t2.reverse()), it$2 = (t2) => t2.filter((e) => e != null), D$3 = (t2) => [].concat(...t2), et$2 = (t2) => t2, Ga = (t2, e) => t2, ht$1 = (t2, e) => Array.from({ length: e - t2 + 1 }, (n, s) => s + t2);
function w$1(t2, e, n = t2.length) {
  const s = function r(...o) {
    if (o.length >= n)
      return t2.apply(this, o);
    {
      const c = function(...u) {
        return r.apply(this, o.concat(u));
      };
      return e && e(c, o), c;
    }
  };
  return e && e(s, []), s;
}
function Qt$1(t2) {
  const e = Number(t2);
  if (!isNaN(e))
    return e;
  if (qt(t2))
    return pt$1(t2);
  throw new Error(`cannot parse as numeral: "${t2}"`);
}
function Ut$1(t2, e) {
  return (...n) => t2(...n.map(e));
}
function $$2(t2) {
  return Ut$1(t2, Qt$1);
}
function Le$1(t2) {
  const e = Number(t2);
  if (!isNaN(e))
    return e;
  const n = {
    pi: Math.PI,
    w: 1,
    h: 0.5,
    q: 0.25,
    e: 0.125,
    s: 0.0625,
    t: 1 / 3,
    f: 0.2,
    x: 1 / 6
  }[t2];
  if (typeof n < "u")
    return n;
  throw new Error(`cannot parse as fractional: "${t2}"`);
}
const Qa = (t2) => Ut$1(t2, Le$1), Kt$1 = function(t2, e) {
  return [e.slice(0, t2), e.slice(t2)];
}, At = (t2, e, n) => e.map((s, r) => t2(s, n[r])), Ie$1 = function(t2) {
  const e = [];
  for (let n = 0; n < t2.length - 1; ++n)
    e.push([t2[n], t2[n + 1]]);
  return e;
}, He$1 = (t2, e, n) => Math.min(Math.max(t2, e), n), Ve$2 = ["Do", "Reb", "Re", "Mib", "Mi", "Fa", "Solb", "Sol", "Lab", "La", "Sib", "Si"], Fe$1 = [
  "Sa",
  "Re",
  "Ga",
  "Ma",
  "Pa",
  "Dha",
  "Ni"
], De$1 = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Hb", "H"], Ge$1 = [
  "Ni",
  "Pab",
  "Pa",
  "Voub",
  "Vou",
  "Ga",
  "Dib",
  "Di",
  "Keb",
  "Ke",
  "Zob",
  "Zo"
], Qe$2 = [
  "I",
  "Ro",
  "Ha",
  "Ni",
  "Ho",
  "He",
  "To"
], Ue$2 = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"], Ua = (t2, e = "letters") => {
  const s = (e === "solfeggio" ? Ve$2 : e === "indian" ? Fe$1 : e === "german" ? De$1 : e === "byzantine" ? Ge$1 : e === "japanese" ? Qe$2 : Ue$2)[t2 % 12], r = Math.floor(t2 / 12) - 1;
  return s + r;
};
function Ka(t2) {
  var e = {};
  return t2.filter(function(n) {
    return e.hasOwn(n) ? false : e[n] = true;
  });
}
function Xa(t2) {
  return t2.sort().filter(function(e, n, s) {
    return !n || e != s[n - 1];
  });
}
function Ke$2(t2) {
  return t2.sort((e, n) => e.compare(n)).filter(function(e, n, s) {
    return !n || e.ne(s[n - 1]);
  });
}
function Xe$2(t2) {
  const e = new TextEncoder().encode(t2);
  return btoa(String.fromCharCode(...e));
}
function Ye$2(t2) {
  const e = new Uint8Array(
    atob(t2).split("").map((s) => s.charCodeAt(0))
  );
  return new TextDecoder().decode(e);
}
function Ya(t2) {
  return encodeURIComponent(Xe$2(t2));
}
function Za(t2) {
  return Ye$2(decodeURIComponent(t2));
}
function Ze$2(t2, e) {
  return Array.isArray(t2) ? t2.map(e) : Object.fromEntries(Object.entries(t2).map(([n, s], r) => [n, e(s, n, r)]));
}
function Rt(t2, e) {
  return t2 / e;
}
class tn {
  constructor({
    getTargetClockTime: e = en,
    weight: n = 16,
    offsetDelta: s = 5e-3,
    checkAfterTime: r = 2,
    resetAfterTime: o = 8
  }) {
    this.offsetTime, this.timeAtPrevOffsetSample, this.prevOffsetTimes = [], this.getTargetClockTime = e, this.weight = n, this.offsetDelta = s, this.checkAfterTime = r, this.resetAfterTime = o, this.reset = () => {
      this.prevOffsetTimes = [], this.offsetTime = null, this.timeAtPrevOffsetSample = null;
    };
  }
  calculateOffset(e) {
    const n = this.getTargetClockTime(), s = n - this.timeAtPrevOffsetSample, r = n - e;
    if (s > this.resetAfterTime && this.reset(), this.offsetTime == null && (this.offsetTime = r), this.prevOffsetTimes.push(r), this.prevOffsetTimes.length > this.weight && this.prevOffsetTimes.shift(), this.timeAtPrevOffsetSample == null || s > this.checkAfterTime) {
      this.timeAtPrevOffsetSample = n;
      const o = Ne$1(this.prevOffsetTimes);
      Math.abs(o - this.offsetTime) > this.offsetDelta && (this.offsetTime = o);
    }
    return this.offsetTime;
  }
  calculateTimestamp(e, n) {
    return this.calculateOffset(e) + n;
  }
}
function tl() {
  return performance.now() * 1e-3;
}
function en() {
  return Date.now() * 1e-3;
}
const nn = /* @__PURE__ */ new Map([
  ["control", "Control"],
  ["ctrl", "Control"],
  ["alt", "Alt"],
  ["shift", "Shift"],
  ["down", "ArrowDown"],
  ["up", "ArrowUp"],
  ["left", "ArrowLeft"],
  ["right", "ArrowRight"]
]);
let tt$2;
function sn() {
  if (tt$2 == null) {
    if (typeof window > "u")
      return;
    tt$2 = {}, window.addEventListener("keydown", (t2) => {
      tt$2[t2.key] = true;
    }), window.addEventListener("keyup", (t2) => {
      tt$2[t2.key] = false;
    });
  }
  return { ...tt$2 };
}
function Xt(t2, e = false) {
  return typeof t2 == "object" ? e ? JSON.stringify(t2).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(t2) : t2;
}
Fraction.prototype.sam = function() {
  return this.floor();
};
Fraction.prototype.nextSam = function() {
  return this.sam().add(1);
};
Fraction.prototype.wholeCycle = function() {
  return new x$2(this.sam(), this.nextSam());
};
Fraction.prototype.cyclePos = function() {
  return this.sub(this.sam());
};
Fraction.prototype.lt = function(t2) {
  return this.compare(t2) < 0;
};
Fraction.prototype.gt = function(t2) {
  return this.compare(t2) > 0;
};
Fraction.prototype.lte = function(t2) {
  return this.compare(t2) <= 0;
};
Fraction.prototype.gte = function(t2) {
  return this.compare(t2) >= 0;
};
Fraction.prototype.eq = function(t2) {
  return this.compare(t2) == 0;
};
Fraction.prototype.ne = function(t2) {
  return this.compare(t2) != 0;
};
Fraction.prototype.max = function(t2) {
  return this.gt(t2) ? this : t2;
};
Fraction.prototype.maximum = function(...t2) {
  return t2 = t2.map((e) => new Fraction(e)), t2.reduce((e, n) => n.max(e), this);
};
Fraction.prototype.min = function(t2) {
  return this.lt(t2) ? this : t2;
};
Fraction.prototype.mulmaybe = function(t2) {
  return t2 !== void 0 ? this.mul(t2) : void 0;
};
Fraction.prototype.divmaybe = function(t2) {
  return t2 !== void 0 ? this.div(t2) : void 0;
};
Fraction.prototype.addmaybe = function(t2) {
  return t2 !== void 0 ? this.add(t2) : void 0;
};
Fraction.prototype.submaybe = function(t2) {
  return t2 !== void 0 ? this.sub(t2) : void 0;
};
Fraction.prototype.show = function() {
  return this.s * this.n + "/" + this.d;
};
Fraction.prototype.or = function(t2) {
  return this.eq(0) ? t2 : this;
};
const h = (t2) => Fraction(t2), rn = (...t2) => {
  if (t2 = it$2(t2), t2.length !== 0)
    return t2.reduce((e, n) => e.gcd(n), h(1));
}, U$3 = (...t2) => {
  if (t2 = it$2(t2), t2.length === 0)
    return;
  const e = t2.pop();
  return t2.reduce(
    (n, s) => n === void 0 || s === void 0 ? void 0 : n.lcm(s),
    e
  );
}, on$1 = (t2) => t2 instanceof Fraction;
h._original = Fraction;
let x$2 = class x2 {
  constructor(e, n) {
    this.begin = h(e), this.end = h(n);
  }
  get spanCycles() {
    const e = [];
    var n = this.begin;
    const s = this.end, r = s.sam();
    if (n.equals(s))
      return [new x2(n, s)];
    for (; s.gt(n); ) {
      if (n.sam().equals(r)) {
        e.push(new x2(n, this.end));
        break;
      }
      const o = n.nextSam();
      e.push(new x2(n, o)), n = o;
    }
    return e;
  }
  get duration() {
    return this.end.sub(this.begin);
  }
  cycleArc() {
    const e = this.begin.cyclePos(), n = e.add(this.duration);
    return new x2(e, n);
  }
  withTime(e) {
    return new x2(e(this.begin), e(this.end));
  }
  withEnd(e) {
    return new x2(this.begin, e(this.end));
  }
  withCycle(e) {
    const n = this.begin.sam(), s = n.add(e(this.begin.sub(n))), r = n.add(e(this.end.sub(n)));
    return new x2(s, r);
  }
  intersection(e) {
    const n = this.begin.max(e.begin), s = this.end.min(e.end);
    if (!n.gt(s) && !(n.equals(s) && (n.equals(this.end) && this.begin.lt(this.end) || n.equals(e.end) && e.begin.lt(e.end))))
      return new x2(n, s);
  }
  intersection_e(e) {
    const n = this.intersection(e);
    if (n == null)
      throw "TimeSpans do not intersect";
    return n;
  }
  midpoint() {
    return this.begin.add(this.duration.div(h(2)));
  }
  equals(e) {
    return this.begin.equals(e.begin) && this.end.equals(e.end);
  }
  show() {
    return this.begin.show() + " → " + this.end.show();
  }
};
let C$4 = class C2 {
  /*
        Event class, representing a value active during the timespan
        'part'. This might be a fragment of an event, in which case the
        timespan will be smaller than the 'whole' timespan, otherwise the
        two timespans will be the same. The 'part' must never extend outside of the
        'whole'. If the event represents a continuously changing value
        then the whole will be returned as None, in which case the given
        value will have been sampled from the point halfway between the
        start and end of the 'part' timespan.
        The context is to store a list of source code locations causing the event.
  
        The word 'Event' is more or less a reserved word in javascript, hence this
        class is named called 'Hap'.
        */
  constructor(e, n, s, r = {}, o = false) {
    this.whole = e, this.part = n, this.value = s, this.context = r, this.stateful = o, o && console.assert(typeof this.value == "function", "Stateful values must be functions");
  }
  get duration() {
    var _a2, _b;
    let e;
    return typeof ((_a2 = this.value) == null ? void 0 : _a2.duration) == "number" ? e = h(this.value.duration) : e = this.whole.end.sub(this.whole.begin), typeof ((_b = this.value) == null ? void 0 : _b.clip) == "number" ? e.mul(this.value.clip) : e;
  }
  get endClipped() {
    return this.whole.begin.add(this.duration);
  }
  isActive(e) {
    return this.whole.begin <= e && this.endClipped >= e;
  }
  isInPast(e) {
    return e > this.endClipped;
  }
  isInNearPast(e, n) {
    return n - e <= this.endClipped;
  }
  isInFuture(e) {
    return e < this.whole.begin;
  }
  isInNearFuture(e, n) {
    return n < this.whole.begin && n > this.whole.begin - e;
  }
  isWithinTime(e, n) {
    return this.whole.begin <= n && this.endClipped >= e;
  }
  wholeOrPart() {
    return this.whole ? this.whole : this.part;
  }
  withSpan(e) {
    const n = this.whole ? e(this.whole) : void 0;
    return new C2(n, e(this.part), this.value, this.context);
  }
  withValue(e) {
    return new C2(this.whole, this.part, e(this.value), this.context);
  }
  hasOnset() {
    return this.whole != null && this.whole.begin.equals(this.part.begin);
  }
  hasTag(e) {
    var _a2;
    return (_a2 = this.context.tags) == null ? void 0 : _a2.includes(e);
  }
  resolveState(e) {
    if (this.stateful && this.hasOnset()) {
      console.log("stateful");
      const n = this.value, [s, r] = n(e);
      return [s, new C2(this.whole, this.part, r, this.context, false)];
    }
    return [e, this];
  }
  spanEquals(e) {
    return this.whole == null && e.whole == null || this.whole.equals(e.whole);
  }
  equals(e) {
    return this.spanEquals(e) && this.part.equals(e.part) && // TODO would == be better ??
    this.value === e.value;
  }
  show(e = false) {
    const n = typeof this.value == "object" ? e ? JSON.stringify(this.value).slice(1, -1).replaceAll('"', "").replaceAll(",", " ") : JSON.stringify(this.value) : this.value;
    var s = "";
    if (this.whole == null)
      s = "~" + this.part.show;
    else {
      var r = this.whole.begin.equals(this.part.begin) && this.whole.end.equals(this.part.end);
      this.whole.begin.equals(this.part.begin) || (s = this.whole.begin.show() + " ⇜ "), r || (s += "("), s += this.part.show(), r || (s += ")"), this.whole.end.equals(this.part.end) || (s += " ⇝ " + this.whole.end.show());
    }
    return "[ " + s + " | " + n + " ]";
  }
  showWhole(e = false) {
    return `${this.whole == null ? "~" : this.whole.show()}: ${Xt(this.value, e)}`;
  }
  combineContext(e) {
    const n = this;
    return { ...n.context, ...e.context, locations: (n.context.locations || []).concat(e.context.locations || []) };
  }
  setContext(e) {
    return new C2(this.whole, this.part, this.value, e);
  }
  ensureObjectValue() {
    if (typeof this.value != "object")
      throw new Error(
        `expected hap.value to be an object, but got "${this.value}". Hint: append .note() or .s() to the end`,
        "error"
      );
  }
};
let st$1 = class st2 {
  constructor(e, n = {}) {
    this.span = e, this.controls = n;
  }
  // Returns new State with different span
  setSpan(e) {
    return new st2(e, this.controls);
  }
  withSpan(e) {
    return this.setSpan(e(this.span));
  }
  // Returns new State with added controls.
  setControls(e) {
    return new st2(this.span, { ...this.controls, ...e });
  }
};
function cn(t2, e, n) {
  if ((e == null ? void 0 : e.value) !== void 0 && Object.keys(e).length === 1)
    return E$2("[warn]: Can't do arithmetic on control pattern."), t2;
  const s = Object.keys(t2).filter((r) => Object.keys(e).includes(r));
  return Object.assign({}, t2, e, Object.fromEntries(s.map((r) => [r, n(t2[r], e[r])])));
}
w$1((t2, e) => t2 * e);
w$1((t2, e) => e.map(t2));
function un(t2, e = 60) {
  let n = 0, s = h(0), r = [""], o = "";
  for (; r[0].length < e; ) {
    const c = t2.queryArc(n, n + 1), u = c.filter((m2) => m2.hasOnset()).map((m2) => m2.duration), a = rn(...u), p = a.inverse();
    r = r.map((m2) => m2 + "|"), o += "|";
    for (let m2 = 0; m2 < p; m2++) {
      const [y, _2] = [s, s.add(a)], g = c.filter((q2) => q2.whole.begin.lte(y) && q2.whole.end.gte(_2)), k2 = g.length - r.length;
      k2 > 0 && (r = r.concat(Array(k2).fill(o))), r = r.map((q2, M2) => {
        const P2 = g[M2];
        if (P2) {
          const T2 = P2.whole.begin.eq(y) ? "" + P2.value : "-";
          return q2 + T2;
        }
        return q2 + ".";
      }), o += ".", s = s.add(a);
    }
    n++;
  }
  return r.join(`
`);
}
let _t, j$3 = true;
const el = function(t2) {
  j$3 = !!t2;
}, nl = (t2) => _t = t2;
class f {
  /**
   * Create a pattern. As an end user, you will most likely not create a Pattern directly.
   *
   * @param {function} query - The function that maps a `State` to an array of `Hap`.
   * @noAutocomplete
   */
  constructor(e, n = void 0) {
    __publicField(this, "polyJoin", function() {
      const e = this;
      return e.fmap((n) => n.extend(e._steps.div(n._steps))).outerJoin();
    });
    this.query = e, this._Pattern = true, this._steps = n;
  }
  get _steps() {
    return this.__steps;
  }
  set _steps(e) {
    this.__steps = e === void 0 ? void 0 : h(e);
  }
  setSteps(e) {
    return this._steps = e, this;
  }
  withSteps(e) {
    return j$3 ? new f(this.query, this._steps === void 0 ? void 0 : e(this._steps)) : this;
  }
  get hasSteps() {
    return this._steps !== void 0;
  }
  //////////////////////////////////////////////////////////////////////
  // Haskell-style functor, applicative and monadic operations
  /**
   * Returns a new pattern, with the function applied to the value of
   * each hap. It has the alias `fmap`.
   * @synonyms fmap
   * @param {Function} func to to apply to the value
   * @returns Pattern
   * @example
   * "0 1 2".withValue(v => v + 10).log()
   */
  withValue(e) {
    const n = new f((s) => this.query(s).map((r) => r.withValue(e)));
    return n._steps = this._steps, n;
  }
  // runs func on query state
  withState(e) {
    return new f((n) => this.query(e(n)));
  }
  /**
   * see `withValue`
   * @noAutocomplete
   */
  fmap(e) {
    return this.withValue(e);
  }
  /**
   * Assumes 'this' is a pattern of functions, and given a function to
   * resolve wholes, applies a given pattern of values to that
   * pattern of functions.
   * @param {Function} whole_func
   * @param {Function} func
   * @noAutocomplete
   * @returns Pattern
   */
  appWhole(e, n) {
    const s = this, r = function(o) {
      const c = s.query(o), u = n.query(o), a = function(p, m2) {
        const y = p.part.intersection(m2.part);
        if (y != null)
          return new C$4(
            e(p.whole, m2.whole),
            y,
            p.value(m2.value),
            m2.combineContext(p)
          );
      };
      return D$3(
        c.map((p) => it$2(u.map((m2) => a(p, m2))))
      );
    };
    return new f(r);
  }
  /**
   * When this method is called on a pattern of functions, it matches its haps
   * with those in the given pattern of values.  A new pattern is returned, with
   * each matching value applied to the corresponding function.
   *
   * In this `_appBoth` variant, where timespans of the function and value haps
   * are not the same but do intersect, the resulting hap has a timespan of the
   * intersection. This applies to both the part and the whole timespan.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appBoth(e) {
    const n = this, s = function(o, c) {
      if (!(o == null || c == null))
        return o.intersection_e(c);
    }, r = n.appWhole(s, e);
    return j$3 && (r._steps = U$3(e._steps, n._steps)), r;
  }
  /**
   * As with `appBoth`, but the `whole` timespan is not the intersection,
   * but the timespan from the function of patterns that this method is called
   * on. In practice, this means that the pattern structure, including onsets,
   * are preserved from the pattern of functions (often referred to as the left
   * hand or inner pattern).
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appLeft(e) {
    const n = this, s = function(o) {
      const c = [];
      for (const u of n.query(o)) {
        const a = e.query(o.setSpan(u.wholeOrPart()));
        for (const p of a) {
          const m2 = u.whole, y = u.part.intersection(p.part);
          if (y) {
            const _2 = u.value(p.value), g = p.combineContext(u), k2 = new C$4(m2, y, _2, g);
            c.push(k2);
          }
        }
      }
      return c;
    }, r = new f(s);
    return r._steps = this._steps, r;
  }
  /**
   * As with `appLeft`, but `whole` timespans are instead taken from the
   * pattern of values, i.e. structure is preserved from the right hand/outer
   * pattern.
   * @param {Pattern} pat_val
   * @noAutocomplete
   * @returns Pattern
   */
  appRight(e) {
    const n = this, s = function(o) {
      const c = [];
      for (const u of e.query(o)) {
        const a = n.query(o.setSpan(u.wholeOrPart()));
        for (const p of a) {
          const m2 = u.whole, y = p.part.intersection(u.part);
          if (y) {
            const _2 = p.value(u.value), g = u.combineContext(p), k2 = new C$4(m2, y, _2, g);
            c.push(k2);
          }
        }
      }
      return c;
    }, r = new f(s);
    return r._steps = e._steps, r;
  }
  bindWhole(e, n) {
    const s = this, r = function(o) {
      const c = function(a, p) {
        return new C$4(
          e(a.whole, p.whole),
          p.part,
          p.value,
          Object.assign({}, a.context, p.context, {
            locations: (a.context.locations || []).concat(p.context.locations || [])
          })
        );
      }, u = function(a) {
        return n(a.value).query(o.setSpan(a.part)).map((p) => c(a, p));
      };
      return D$3(s.query(o).map((a) => u(a)));
    };
    return new f(r);
  }
  bind(e) {
    const n = function(s, r) {
      if (!(s == null || r == null))
        return s.intersection_e(r);
    };
    return this.bindWhole(n, e);
  }
  join() {
    return this.bind(et$2);
  }
  outerBind(e) {
    return this.bindWhole((n) => n, e).setSteps(this._steps);
  }
  outerJoin() {
    return this.outerBind(et$2);
  }
  innerBind(e) {
    return this.bindWhole((n, s) => s, e);
  }
  innerJoin() {
    return this.innerBind(et$2);
  }
  // Flatterns patterns of patterns, by retriggering/resetting inner patterns at onsets of outer pattern haps
  resetJoin(e = false) {
    const n = this;
    return new f((s) => n.discreteOnly().query(s).map((r) => r.value.late(e ? r.whole.begin : r.whole.begin.cyclePos()).query(s).map(
      (o) => new C$4(
        // Supports continuous haps in the inner pattern
        o.whole ? o.whole.intersection(r.whole) : void 0,
        o.part.intersection(r.part),
        o.value
      ).setContext(r.combineContext(o))
    ).filter((o) => o.part)).flat());
  }
  restartJoin() {
    return this.resetJoin(true);
  }
  // Like the other joins above, joins a pattern of patterns of values, into a flatter
  // pattern of values. In this case it takes whole cycles of the inner pattern to fit each event
  // in the outer pattern.
  squeezeJoin() {
    const e = this;
    function n(s) {
      const r = e.discreteOnly().query(s);
      function o(u) {
        const p = u.value._focusSpan(u.wholeOrPart()).query(s.setSpan(u.part));
        function m2(y, _2) {
          let g;
          if (_2.whole && y.whole && (g = _2.whole.intersection(y.whole), !g))
            return;
          const k2 = _2.part.intersection(y.part);
          if (!k2)
            return;
          const q2 = _2.combineContext(y);
          return new C$4(g, k2, _2.value, q2);
        }
        return p.map((y) => m2(u, y));
      }
      return D$3(r.map(o)).filter((u) => u);
    }
    return new f(n);
  }
  squeezeBind(e) {
    return this.fmap(e).squeezeJoin();
  }
  polyBind(e) {
    return this.fmap(e).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // Utility methods mainly for internal use
  /**
   * Query haps inside the given time span.
   *
   * @param {Fraction | number} begin from time
   * @param {Fraction | number} end to time
   * @returns Hap[]
   * @example
   * const pattern = sequence('a', ['b', 'c'])
   * const haps = pattern.queryArc(0, 1)
   * console.log(haps)
   * silence
   * @noAutocomplete
   */
  queryArc(e, n, s = {}) {
    try {
      return this.query(new st$1(new x$2(e, n), s));
    } catch (r) {
      return E$2(`[query]: ${r.message}`, "error"), [];
    }
  }
  /**
   * Returns a new pattern, with queries split at cycle boundaries. This makes
   * some calculations easier to express, as all haps are then constrained to
   * happen within a cycle.
   * @returns Pattern
   * @noAutocomplete
   */
  splitQueries() {
    const e = this, n = (s) => D$3(s.span.spanCycles.map((r) => e.query(s.setSpan(r))));
    return new f(n);
  }
  /**
   * Returns a new pattern, where the given function is applied to the query
   * timespan before passing it to the original pattern.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQuerySpan(e) {
    return new f((n) => this.query(n.withSpan(e)));
  }
  withQuerySpanMaybe(e) {
    const n = this;
    return new f((s) => {
      const r = s.withSpan(e);
      return r.span ? n.query(r) : [];
    });
  }
  /**
   * As with `withQuerySpan`, but the function is applied to both the
   * begin and end time of the query timespan.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withQueryTime(e) {
    return new f((n) => this.query(n.withSpan((s) => s.withTime(e))));
  }
  /**
   * Similar to `withQuerySpan`, but the function is applied to the timespans
   * of all haps returned by pattern queries (both `part` timespans, and where
   * present, `whole` timespans).
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHapSpan(e) {
    return new f((n) => this.query(n).map((s) => s.withSpan(e)));
  }
  /**
   * As with `withHapSpan`, but the function is applied to both the
   * begin and end time of the hap timespans.
   * @param {Function} func the function to apply
   * @returns Pattern
   * @noAutocomplete
   */
  withHapTime(e) {
    return this.withHapSpan((n) => n.withTime(e));
  }
  /**
   * Returns a new pattern with the given function applied to the list of haps returned by every query.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHaps(e) {
    const n = new f((s) => e(this.query(s), s));
    return n._steps = this._steps, n;
  }
  /**
   * As with `withHaps`, but applies the function to every hap, rather than every list of haps.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withHap(e) {
    return this.withHaps((n) => n.map(e));
  }
  /**
   * Returns a new pattern with the context field set to every hap set to the given value.
   * @param {*} context
   * @returns Pattern
   * @noAutocomplete
   */
  setContext(e) {
    return this.withHap((n) => n.setContext(e));
  }
  /**
   * Returns a new pattern with the given function applied to the context field of every hap.
   * @param {Function} func
   * @returns Pattern
   * @noAutocomplete
   */
  withContext(e) {
    const n = this.withHap((s) => s.setContext(e(s.context)));
    return this.__pure !== void 0 && (n.__pure = this.__pure, n.__pure_loc = this.__pure_loc), n;
  }
  /**
   * Returns a new pattern with the context field of every hap set to an empty object.
   * @returns Pattern
   * @noAutocomplete
   */
  stripContext() {
    return this.withHap((e) => e.setContext({}));
  }
  /**
   * Returns a new pattern with the given location information added to the
   * context of every hap.
   * @param {Number} start start offset
   * @param {Number} end end offset
   * @returns Pattern
   * @noAutocomplete
   */
  withLoc(e, n) {
    const s = {
      start: e,
      end: n
    }, r = this.withContext((o) => {
      const c = (o.locations || []).concat([s]);
      return { ...o, locations: c };
    });
    return this.__pure && (r.__pure = this.__pure, r.__pure_loc = s), r;
  }
  /**
   * Returns a new Pattern, which only returns haps that meet the given test.
   * @param {Function} hap_test - a function which returns false for haps to be removed from the pattern
   * @returns Pattern
   * @noAutocomplete
   */
  filterHaps(e) {
    return new f((n) => this.query(n).filter(e));
  }
  /**
   * As with `filterHaps`, but the function is applied to values
   * inside haps.
   * @param {Function} value_test
   * @returns Pattern
   * @noAutocomplete
   */
  filterValues(e) {
    return new f((n) => this.query(n).filter((s) => e(s.value))).setSteps(this._steps);
  }
  /**
   * Returns a new pattern, with haps containing undefined values removed from
   * query results.
   * @returns Pattern
   * @noAutocomplete
   */
  removeUndefineds() {
    return this.filterValues((e) => e != null);
  }
  /**
   * Returns a new pattern, with all haps without onsets filtered out. A hap
   * with an onset is one with a `whole` timespan that begins at the same time
   * as its `part` timespan.
   * @returns Pattern
   * @noAutocomplete
   */
  onsetsOnly() {
    return this.filterHaps((e) => e.hasOnset());
  }
  /**
   * Returns a new pattern, with 'continuous' haps (those without 'whole'
   * timespans) removed from query results.
   * @returns Pattern
   * @noAutocomplete
   */
  discreteOnly() {
    return this.filterHaps((e) => e.whole);
  }
  /**
   * Combines adjacent haps with the same value and whole.  Only
   * intended for use in tests.
   * @noAutocomplete
   */
  defragmentHaps() {
    return this.discreteOnly().withHaps((n) => {
      const s = [];
      for (var r = 0; r < n.length; ++r) {
        for (var o = true, c = n[r]; o; ) {
          const p = JSON.stringify(n[r].value);
          for (var u = false, a = r + 1; a < n.length; a++) {
            const m2 = n[a];
            if (c.whole.equals(m2.whole)) {
              if (c.part.begin.eq(m2.part.end)) {
                if (p === JSON.stringify(m2.value)) {
                  c = new C$4(c.whole, new x$2(m2.part.begin, c.part.end), c.value), n.splice(a, 1), u = true;
                  break;
                }
              } else if (m2.part.begin.eq(c.part.end) && p == JSON.stringify(m2.value)) {
                c = new C$4(c.whole, new x$2(c.part.begin, m2.part.end), c.value), n.splice(a, 1), u = true;
                break;
              }
            }
          }
          o = u;
        }
        s.push(c);
      }
      return s;
    });
  }
  /**
   * Queries the pattern for the first cycle, returning Haps. Mainly of use when
   * debugging a pattern.
   * @param {Boolean} with_context - set to true, otherwise the context field
   * will be stripped from the resulting haps.
   * @returns [Hap]
   * @noAutocomplete
   */
  firstCycle(e = false) {
    var n = this;
    return e || (n = n.stripContext()), n.query(new st$1(new x$2(h(0), h(1))));
  }
  /**
   * Accessor for a list of values returned by querying the first cycle.
   * @noAutocomplete
   */
  get firstCycleValues() {
    return this.firstCycle().map((e) => e.value);
  }
  /**
   * More human-readable version of the `firstCycleValues` accessor.
   * @noAutocomplete
   */
  get showFirstCycle() {
    return this.firstCycle().map(
      (e) => `${e.value}: ${e.whole.begin.toFraction()} - ${e.whole.end.toFraction()}`
    );
  }
  /**
   * Returns a new pattern, which returns haps sorted in temporal order. Mainly
   * of use when comparing two patterns for equality, in tests.
   * @returns Pattern
   * @noAutocomplete
   */
  sortHapsByPart() {
    return this.withHaps(
      (e) => e.sort(
        (n, s) => n.part.begin.sub(s.part.begin).or(n.part.end.sub(s.part.end)).or(n.whole.begin.sub(s.whole.begin).or(n.whole.end.sub(s.whole.end)))
      )
    );
  }
  asNumber() {
    return this.fmap(Qt$1);
  }
  //////////////////////////////////////////////////////////////////////
  // Operators - see 'make composers' later..
  _opIn(e, n) {
    return this.fmap(n).appLeft(d$1(e));
  }
  _opOut(e, n) {
    return this.fmap(n).appRight(d$1(e));
  }
  _opMix(e, n) {
    return this.fmap(n).appBoth(d$1(e));
  }
  _opSqueeze(e, n) {
    const s = d$1(e);
    return this.fmap((r) => s.fmap((o) => n(r)(o))).squeezeJoin();
  }
  _opSqueezeOut(e, n) {
    const s = this;
    return d$1(e).fmap((o) => s.fmap((c) => n(c)(o))).squeezeJoin();
  }
  _opReset(e, n) {
    return d$1(e).fmap((r) => this.fmap((o) => n(o)(r))).resetJoin();
  }
  _opRestart(e, n) {
    return d$1(e).fmap((r) => this.fmap((o) => n(o)(r))).restartJoin();
  }
  _opPoly(e, n) {
    const s = d$1(e);
    return this.fmap((r) => s.fmap((o) => n(o)(r))).polyJoin();
  }
  //////////////////////////////////////////////////////////////////////
  // End-user methods.
  // Those beginning with an underscore (_) are 'patternified',
  // i.e. versions are created without the underscore, that are
  // magically transformed to accept patterns for all their arguments.
  //////////////////////////////////////////////////////////////////////
  // Methods without corresponding toplevel functions
  /**
   * Layers the result of the given function(s). Like `superimpose`, but without the original pattern:
   * @name layer
   * @memberof Pattern
   * @synonyms apply
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .layer(x=>x.add("0,2"))
   *   .scale('C minor').note()
   */
  layer(...e) {
    return B$2(...e.map((n) => n(this)));
  }
  /**
   * Superimposes the result of the given function(s) on top of the original pattern:
   * @name superimpose
   * @memberof Pattern
   * @returns Pattern
   * @example
   * "<0 2 4 6 ~ 4 ~ 2 0!3 ~!5>*8"
   *   .superimpose(x=>x.add(2))
   *   .scale('C minor').note()
   */
  superimpose(...e) {
    return this.stack(...e.map((n) => n(this)));
  }
  //////////////////////////////////////////////////////////////////////
  // Multi-pattern functions
  stack(...e) {
    return B$2(this, ...e);
  }
  sequence(...e) {
    return G$3(this, ...e);
  }
  seq(...e) {
    return G$3(this, ...e);
  }
  cat(...e) {
    return at$1(this, ...e);
  }
  fastcat(...e) {
    return W$3(this, ...e);
  }
  slowcat(...e) {
    return K$1(this, ...e);
  }
  //////////////////////////////////////////////////////////////////////
  // Context methods - ones that deal with metadata
  onTrigger(e, n = true) {
    return this.withHap(
      (s) => s.setContext({
        ...s.context,
        onTrigger: (...r) => {
          var _a2, _b;
          (_b = (_a2 = s.context).onTrigger) == null ? void 0 : _b.call(_a2, ...r), e(...r);
        },
        // if dominantTrigger is set to true, the default output (webaudio) will be disabled
        // when using multiple triggers, you cannot flip this flag to false again!
        // example: x.csound('CooLSynth').log() as well as x.log().csound('CooLSynth') should work the same
        dominantTrigger: s.context.dominantTrigger || n
      })
    );
  }
  /**
   * Writes the content of the current event to the console (visible in the side menu).
   * @name log
   * @memberof Pattern
   * @example
   * s("bd sd").log()
   */
  log(e = (s) => `[hap] ${s.showWhole(true)}`, n = (s) => ({ hap: s })) {
    return this.onTrigger((...s) => {
      E$2(e(...s), void 0, n(...s));
    }, false);
  }
  /**
   * A simplified version of `log` which writes all "values" (various configurable parameters)
   * within the event to the console (visible in the side menu).
   * @name logValues
   * @memberof Pattern
   * @example
   * s("bd sd").gain("0.25 0.5 1").n("2 1 0").logValues()
   */
  logValues(e = (n) => `[hap] ${Xt(n, true)}`) {
    return this.log((n) => e(n.value));
  }
  //////////////////////////////////////////////////////////////////////
  // Visualisation
  drawLine() {
    return console.log(un(this)), this;
  }
  //////////////////////////////////////////////////////////////////////
  // methods relating to breaking patterns into subcycles
  // Breaks a pattern into a pattern of patterns, according to the structure of the given binary pattern.
  unjoin(e, n = et$2) {
    return e.withHap(
      (s) => s.withValue((r) => r ? n(this.ribbon(s.whole.begin, s.whole.duration)) : this)
    );
  }
  /**
   * Breaks a pattern into pieces according to the structure of a given pattern.
   * True values in the given pattern cause the corresponding subcycle of the
   * source pattern to be looped, and for an (optional) given function to be
   * applied. False values result in the corresponding part of the source pattern
   * to be played unchanged.
   * @name into
   * @memberof Pattern
   * @example
   * sound("bd sd ht lt").into("1 0", hurry(2))
   */
  into(e, n) {
    return this.unjoin(e, n).innerJoin();
  }
}
function an(t2, e) {
  let n = [];
  return e.forEach((s) => {
    const r = n.findIndex(([o]) => t2(s, o));
    r === -1 ? n.push([s]) : n[r].push(s);
  }), n;
}
const ln = (t2, e) => t2.spanEquals(e);
f.prototype.collect = function() {
  return this.withHaps(
    (t2) => an(ln, t2).map((e) => new C$4(e[0].whole, e[0].part, e, {}))
  );
};
const sl = l("arpWith", (t2, e) => e.collect().fmap((n) => d$1(t2(n))).innerJoin().withHap((n) => new C$4(n.whole, n.part, n.value.value, n.combineContext(n.value)))), rl = l(
  "arp",
  (t2, e) => e.arpWith((n) => d$1(t2).fmap((s) => n[s % n.length])),
  false
);
function ut$1(t2) {
  return !Array.isArray(t2) && typeof t2 == "object" && !on$1(t2);
}
function pn(t2, e, n) {
  return ut$1(t2) || ut$1(e) ? (ut$1(t2) || (t2 = { value: t2 }), ut$1(e) || (e = { value: e }), cn(t2, e, n)) : n(t2, e);
}
(function() {
  const t2 = {
    set: [(n, s) => s],
    keep: [(n) => n],
    keepif: [(n, s) => s ? n : void 0],
    // numerical functions
    /**
     *
     * Assumes a pattern of numbers. Adds the given number to each item in the pattern.
     * @name add
     * @memberof Pattern
     * @example
     * // Here, the triad 0, 2, 4 is shifted by different amounts
     * n("0 2 4".add("<0 3 4 0>")).scale("C:major")
     * // Without add, the equivalent would be:
     * // n("<[0 2 4] [3 5 7] [4 6 8] [0 2 4]>").scale("C:major")
     * @example
     * // You can also use add with notes:
     * note("c3 e3 g3".add("<0 5 7 0>"))
     * // Behind the scenes, the notes are converted to midi numbers:
     * // note("48 52 55".add("<0 5 7 0>"))
     */
    add: [$$2((n, s) => n + s)],
    // support string concatenation
    /**
     *
     * Like add, but the given numbers are subtracted.
     * @name sub
     * @memberof Pattern
     * @example
     * n("0 2 4".sub("<0 1 2 3>")).scale("C4:minor")
     * // See add for more information.
     */
    sub: [$$2((n, s) => n - s)],
    /**
     *
     * Multiplies each number by the given factor.
     * @name mul
     * @memberof Pattern
     * @example
     * "<1 1.5 [1.66, <2 2.33>]>*4".mul(150).freq()
     */
    mul: [$$2((n, s) => n * s)],
    /**
     *
     * Divides each number by the given factor.
     * @name div
     * @memberof Pattern
     */
    div: [$$2((n, s) => n / s)],
    mod: [$$2(ft$1)],
    pow: [$$2(Math.pow)],
    log2: [$$2(Math.log2)],
    band: [$$2((n, s) => n & s)],
    bor: [$$2((n, s) => n | s)],
    bxor: [$$2((n, s) => n ^ s)],
    blshift: [$$2((n, s) => n << s)],
    brshift: [$$2((n, s) => n >> s)],
    // TODO - force numerical comparison if both look like numbers?
    lt: [(n, s) => n < s],
    gt: [(n, s) => n > s],
    lte: [(n, s) => n <= s],
    gte: [(n, s) => n >= s],
    eq: [(n, s) => n == s],
    eqt: [(n, s) => n === s],
    ne: [(n, s) => n != s],
    net: [(n, s) => n !== s],
    and: [(n, s) => n && s],
    or: [(n, s) => n || s],
    //  bitwise ops
    func: [(n, s) => s(n)]
  }, e = ["In", "Out", "Mix", "Squeeze", "SqueezeOut", "Reset", "Restart", "Poly"];
  for (const [n, [s, r]] of Object.entries(t2)) {
    f.prototype["_" + n] = function(o) {
      return this.fmap((c) => s(c, o));
    }, Object.defineProperty(f.prototype, n, {
      // a getter that returns a function, so 'pat' can be
      // accessed by closures that are methods of that function..
      get: function() {
        const o = this, c = (...u) => o[n].in(...u);
        for (const u of e)
          c[u.toLowerCase()] = function(...a) {
            var p = o;
            a = G$3(a), r && (p = r(p), a = r(a));
            var m2;
            return n === "keepif" ? (m2 = p["_op" + u](a, (y) => (_2) => s(y, _2)), m2 = m2.removeUndefineds()) : m2 = p["_op" + u](a, (y) => (_2) => pn(y, _2, s)), m2;
          };
        return c.squeezein = c.squeeze, c;
      }
    });
    for (const o of e)
      f.prototype[o.toLowerCase()] = function(...c) {
        return this.set[o.toLowerCase()](c);
      };
  }
  f.prototype.struct = function(...n) {
    return this.keepif.out(...n);
  }, f.prototype.structAll = function(...n) {
    return this.keep.out(...n);
  }, f.prototype.mask = function(...n) {
    return this.keepif.in(...n);
  }, f.prototype.maskAll = function(...n) {
    return this.keep.in(...n);
  }, f.prototype.reset = function(...n) {
    return this.keepif.reset(...n);
  }, f.prototype.resetAll = function(...n) {
    return this.keep.reset(...n);
  }, f.prototype.restart = function(...n) {
    return this.keepif.restart(...n);
  }, f.prototype.restartAll = function(...n) {
    return this.keep.restart(...n);
  };
})();
const ol = B$2, il = B$2, cl = xt, ct$2 = (t2) => new f(() => [], t2), v$2 = ct$2(1), R$2 = ct$2(0);
function z$1(t2) {
  function e(s) {
    return s.span.spanCycles.map((r) => new C$4(h(r.begin).wholeCycle(), r, t2));
  }
  const n = new f(e, 1);
  return n.__pure = t2, n;
}
function Yt(t2) {
  return t2 instanceof f || (t2 == null ? void 0 : t2._Pattern);
}
function d$1(t2) {
  return Yt(t2) ? t2 : _t && typeof t2 == "string" ? _t(t2) : z$1(t2);
}
function fn$1(t2) {
  let e = z$1([]);
  for (const n of t2)
    e = e.bind((s) => n.fmap((r) => s.concat([r])));
  return e;
}
function B$2(...t2) {
  t2 = t2.map((s) => Array.isArray(s) ? G$3(...s) : d$1(s));
  const e = (s) => D$3(t2.map((r) => r.query(s))), n = new f(e);
  return j$3 && (n._steps = U$3(...t2.map((s) => s._steps))), n;
}
function St(t2, e) {
  if (e = e.map((o) => Array.isArray(o) ? G$3(...o) : d$1(o)), e.length === 0)
    return v$2;
  if (e.length === 1)
    return e[0];
  const [n, ...s] = e.map((o) => o._steps), r = j$3 ? n.maximum(...s) : void 0;
  return B$2(...t2(r, e));
}
function hn(...t2) {
  return St(
    (e, n) => n.map((s) => s._steps.eq(e) ? s : N$4(s, ct$2(e.sub(s._steps)))),
    t2
  );
}
function dn(...t2) {
  return St(
    (e, n) => n.map((s) => s._steps.eq(e) ? s : N$4(ct$2(e.sub(s._steps)), s)),
    t2
  );
}
function mn(...t2) {
  return St(
    (e, n) => n.map((s) => {
      if (s._steps.eq(e))
        return s;
      const r = ct$2(e.sub(s._steps).div(2));
      return N$4(r, s, r);
    }),
    t2
  );
}
function ul(t2, ...e) {
  const [n, ...s] = e.map((c) => c._steps), r = n.maximum(...s), o = {
    centre: mn,
    left: hn,
    right: dn,
    expand: B$2,
    repeat: (...c) => xt(...c).steps(r)
  };
  return t2.inhabit(o).fmap((c) => c(...e)).innerJoin().setSteps(r);
}
function K$1(...t2) {
  if (t2 = t2.map((s) => Array.isArray(s) ? W$3(...s) : d$1(s)), t2.length == 1)
    return t2[0];
  const e = function(s) {
    const r = s.span, o = ft$1(r.begin.sam(), t2.length), c = t2[o];
    if (!c)
      return [];
    const u = r.begin.floor().sub(r.begin.div(t2.length).floor());
    return c.withHapTime((a) => a.add(u)).query(s.setSpan(r.withTime((a) => a.sub(u))));
  }, n = j$3 ? U$3(...t2.map((s) => s._steps)) : void 0;
  return new f(e).splitQueries().setSteps(n);
}
function Zt(...t2) {
  t2 = t2.map(d$1);
  const e = function(n) {
    var _a2;
    const s = Math.floor(n.span.begin) % t2.length;
    return ((_a2 = t2[s]) == null ? void 0 : _a2.query(n)) || [];
  };
  return new f(e).splitQueries();
}
function at$1(...t2) {
  return K$1(...t2);
}
function al(...t2) {
  const e = t2.reduce((n, [s]) => n + s, 0);
  return t2 = t2.map(([n, s]) => [n, s.fast(n)]), N$4(...t2).slow(e);
}
function ll(...t2) {
  let e = h(0);
  for (let n of t2)
    n.length == 2 && n.unshift(e), e = n[1];
  return B$2(
    ...t2.map(
      ([n, s, r]) => z$1(d$1(r)).compress(h(n).div(e), h(s).div(e))
    )
  ).slow(e).innerJoin();
}
function W$3(...t2) {
  let e = K$1(...t2);
  return t2.length > 1 && (e = e._fast(t2.length), e._steps = t2.length), t2.length == 1 && t2[0].__steps_source && (t2._steps = t2[0]._steps), e;
}
function G$3(...t2) {
  return W$3(...t2);
}
function yn(...t2) {
  return W$3(...t2);
}
function vt$1(t2) {
  return Array.isArray(t2) ? t2.length == 0 ? [v$2, 0] : t2.length == 1 ? vt$1(t2[0]) : [W$3(...t2.map((e) => vt$1(e)[0])), t2.length] : [d$1(t2), 1];
}
const pl = w$1((t2, e) => d$1(e).mask(t2)), fl = w$1((t2, e) => d$1(e).struct(t2)), hl = w$1((t2, e) => d$1(e).superimpose(...t2)), dl = w$1((t2, e) => d$1(e).withValue(t2)), ml = w$1((t2, e) => d$1(e).bind(t2)), yl = w$1((t2, e) => d$1(e).innerBind(t2)), wl = w$1((t2, e) => d$1(e).outerBind(t2)), gl = w$1((t2, e) => d$1(e).squeezeBind(t2)), bl = w$1((t2, e) => d$1(e).stepBind(t2)), _l = w$1((t2, e) => d$1(e).polyBind(t2)), vl = w$1((t2, e) => d$1(e).set(t2)), kl = w$1((t2, e) => d$1(e).keep(t2)), ql = w$1((t2, e) => d$1(e).keepif(t2)), Al = w$1((t2, e) => d$1(e).add(t2)), Sl = w$1((t2, e) => d$1(e).sub(t2)), Tl = w$1((t2, e) => d$1(e).mul(t2)), Cl = w$1((t2, e) => d$1(e).div(t2)), xl = w$1((t2, e) => d$1(e).mod(t2)), Bl = w$1((t2, e) => d$1(e).pow(t2)), Ol = w$1((t2, e) => d$1(e).band(t2)), zl = w$1((t2, e) => d$1(e).bor(t2)), El = w$1((t2, e) => d$1(e).bxor(t2)), Ml = w$1((t2, e) => d$1(e).blshift(t2)), Pl = w$1((t2, e) => d$1(e).brshift(t2)), Jl = w$1((t2, e) => d$1(e).lt(t2)), jl = w$1((t2, e) => d$1(e).gt(t2)), Nl = w$1((t2, e) => d$1(e).lte(t2)), Wl = w$1((t2, e) => d$1(e).gte(t2)), $l = w$1((t2, e) => d$1(e).eq(t2)), Rl = w$1((t2, e) => d$1(e).eqt(t2)), Ll = w$1((t2, e) => d$1(e).ne(t2)), Il = w$1((t2, e) => d$1(e).net(t2)), Hl = w$1((t2, e) => d$1(e).and(t2)), Vl = w$1((t2, e) => d$1(e).or(t2)), Fl = w$1((t2, e) => d$1(e).func(t2));
function l(t2, e, n = true, s = false, r = (o) => o.innerJoin()) {
  if (Array.isArray(t2)) {
    const u = {};
    for (const a of t2)
      u[a] = l(a, e, n, s, r);
    return u;
  }
  const o = e.length;
  var c;
  return n ? c = function(...u) {
    u = u.map(d$1);
    const a = u[u.length - 1];
    let p;
    if (o === 1)
      p = e(a);
    else {
      const m2 = u.slice(0, -1);
      if (m2.every((y) => y.__pure != null)) {
        const y = m2.map((g) => g.__pure), _2 = m2.filter((g) => g.__pure_loc).map((g) => g.__pure_loc);
        p = e(...y, a), p = p.withContext((g) => {
          const k2 = (g.locations || []).concat(_2);
          return { ...g, locations: k2 };
        });
      } else {
        const [y, ..._2] = m2;
        let g = (...k2) => e(...k2, a);
        g = w$1(g, null, o - 1), p = r(_2.reduce((k2, q2) => k2.appLeft(q2), y.fmap(g)));
      }
    }
    return s && (p._steps = a._steps), p;
  } : c = function(...u) {
    u = u.map(d$1);
    const a = e(...u);
    return s && (a._steps = u[u.length - 1]._steps), a;
  }, f.prototype[t2] = function(...u) {
    if (o === 2 && u.length !== 1)
      u = [G$3(...u)];
    else if (o !== u.length + 1)
      throw new Error(`.${t2}() expects ${o - 1} inputs but got ${u.length}.`);
    return u = u.map(d$1), c(...u, this);
  }, o > 1 && (f.prototype["_" + t2] = function(...u) {
    const a = e(...u, this);
    return s && a.setSteps(this._steps), a;
  }), w$1(c, null, o);
}
function X$3(t2, e, n = true, s = false, r = (o) => o.stepJoin()) {
  return l(t2, e, n, s, r);
}
const Dl = l("round", function(t2) {
  return t2.asNumber().fmap((e) => Math.round(e));
}), Gl = l("floor", function(t2) {
  return t2.asNumber().fmap((e) => Math.floor(e));
}), Ql = l("ceil", function(t2) {
  return t2.asNumber().fmap((e) => Math.ceil(e));
}), Ul = l("toBipolar", function(t2) {
  return t2.fmap((e) => e * 2 - 1);
}), Kl = l("fromBipolar", function(t2) {
  return t2.fmap((e) => (e + 1) / 2);
}), Xl = l("range", function(t2, e, n) {
  return n.mul(e - t2).add(t2);
}), Yl = l("rangex", function(t2, e, n) {
  return n._range(Math.log(t2), Math.log(e)).fmap(Math.exp);
}), Zl = l("range2", function(t2, e, n) {
  return n.fromBipolar()._range(t2, e);
}), tp = l(
  "ratio",
  (t2) => t2.fmap((e) => Array.isArray(e) ? e.slice(1).reduce((n, s) => n / s, e[0]) : e)
), ep = l("compress", function(t2, e, n) {
  return t2 = h(t2), e = h(e), t2.gt(e) || t2.gt(1) || e.gt(1) || t2.lt(0) || e.lt(0) ? v$2 : n._fastGap(h(1).div(e.sub(t2)))._late(t2);
}), { compressSpan: np, compressspan: sp } = l(["compressSpan", "compressspan"], function(t2, e) {
  return e._compress(t2.begin, t2.end);
}), { fastGap: rp, fastgap: op } = l(["fastGap", "fastgap"], function(t2, e) {
  const n = function(r) {
    const o = r.begin.sam(), c = r.begin.sub(o).mul(t2).min(1), u = r.end.sub(o).mul(t2).min(1);
    if (!(c >= 1))
      return new x$2(o.add(c), o.add(u));
  }, s = function(r) {
    const o = r.part.begin, c = r.part.end, u = o.sam(), a = o.sub(u).div(t2).min(1), p = c.sub(u).div(t2).min(1), m2 = new x$2(u.add(a), u.add(p)), y = r.whole ? new x$2(
      m2.begin.sub(o.sub(r.whole.begin).div(t2)),
      m2.end.add(r.whole.end.sub(c).div(t2))
    ) : void 0;
    return new C$4(y, m2, r.value, r.context);
  };
  return e.withQuerySpanMaybe(n).withHap(s).splitQueries();
}), ip = l("focus", function(t2, e, n) {
  return t2 = h(t2), e = h(e), n._early(t2.sam())._fast(h(1).div(e.sub(t2)))._late(t2);
}), { focusSpan: cp, focusspan: up } = l(["focusSpan", "focusspan"], function(t2, e) {
  return e._focus(t2.begin, t2.end);
}), ap = l("ply", function(t2, e) {
  const n = e.fmap((s) => z$1(s)._fast(t2)).squeezeJoin();
  return j$3 && (n._steps = h(t2).mulmaybe(e._steps)), n;
}), { fast: lp, density: pp$a } = l(
  ["fast", "density"],
  function(t2, e) {
    return t2 === 0 ? v$2 : (t2 = h(t2), e.withQueryTime((s) => s.mul(t2)).withHapTime((s) => s.div(t2)).setSteps(e._steps));
  },
  true,
  true
), fp = l("hurry", function(t2, e) {
  return e._fast(t2).mul(z$1({ speed: t2 }));
}), { slow: hp, sparsity: dp } = l(["slow", "sparsity"], function(t2, e) {
  return t2 === 0 ? v$2 : e._fast(h(1).div(t2));
}), mp = l("inside", function(t2, e, n) {
  return e(n._slow(t2))._fast(t2);
}), yp = l("outside", function(t2, e, n) {
  return e(n._fast(t2))._slow(t2);
}), wp = l("lastOf", function(t2, e, n) {
  const s = Array(t2 - 1).fill(n);
  return s.push(e(n)), Zt(...s);
}), { firstOf: gp, every: bp } = l(["firstOf", "every"], function(t2, e, n) {
  const s = Array(t2 - 1).fill(n);
  return s.unshift(e(n)), Zt(...s);
}), _p = l("apply", function(t2, e) {
  return t2(e);
}), vp = l("cpm", function(t2, e) {
  return e._fast(t2 / 60 / 1);
}), kp = l(
  "early",
  function(t2, e) {
    return t2 = h(t2), e.withQueryTime((n) => n.add(t2)).withHapTime((n) => n.sub(t2));
  },
  true,
  true
), wn$1 = l(
  "late",
  function(t2, e) {
    return t2 = h(t2), e._early(h(0).sub(t2));
  },
  true,
  true
), qp = l("zoom", function(t2, e, n) {
  var _a2;
  if (e = h(e), t2 = h(t2), t2.gte(e))
    return R$2;
  const s = e.sub(t2), r = j$3 ? (_a2 = n._steps) == null ? void 0 : _a2.mulmaybe(s) : void 0;
  return n.withQuerySpan((o) => o.withCycle((c) => c.mul(s).add(t2))).withHapSpan((o) => o.withCycle((c) => c.sub(t2).div(s))).splitQueries().setSteps(r);
}), { zoomArc: Ap, zoomarc: Sp } = l(["zoomArc", "zoomarc"], function(t2, e) {
  return e.zoom(t2.begin, t2.end);
}), Tp = l(
  "bite",
  (t2, e, n) => e.fmap((s) => (r) => {
    const o = h(s).div(r).mod(1), c = o.add(h(1).div(r));
    return n.zoom(o, c);
  }).appLeft(t2).squeezeJoin(),
  false
), Cp = l(
  "linger",
  function(t2, e) {
    return t2 == 0 ? v$2 : t2 < 0 ? e._zoom(t2.add(1), 1)._slow(t2) : e._zoom(0, t2)._slow(t2);
  },
  true,
  true
), { segment: xp, seg: Bp } = l(["segment", "seg"], function(t2, e) {
  return e.struct(z$1(true)._fast(t2)).setSteps(t2);
}), Op = l("swingBy", (t2, e, n) => n.inside(e, wn$1(yn(0, t2 / 2)))), zp = l("swing", (t2, e) => e.swingBy(1 / 3, t2)), { invert: Ep, inv: Mp } = l(
  ["invert", "inv"],
  function(t2) {
    return t2.fmap((e) => !e);
  },
  true,
  true
), Pp = l("when", function(t2, e, n) {
  return t2 ? e(n) : n;
}), Jp = l("off", function(t2, e, n) {
  return B$2(n, e(n.late(t2)));
}), jp = l("brak", function(t2) {
  return t2.when(K$1(false, true), (e) => W$3(e, v$2)._late(0.25));
}), gn$1 = l(
  "rev",
  function(t2) {
    const e = function(n) {
      const s = n.span, r = s.begin.sam(), o = s.begin.nextSam(), c = function(a) {
        const p = a.withTime((y) => r.add(o.sub(y))), m2 = p.begin;
        return p.begin = p.end, p.end = m2, p;
      };
      return t2.query(n.setSpan(c(s))).map((a) => a.withSpan(c));
    };
    return new f(e).splitQueries();
  },
  false,
  true
), Np = l("pressBy", function(t2, e) {
  return e.fmap((n) => z$1(n).compress(t2, 1)).squeezeJoin();
}), Wp = l("press", function(t2) {
  return t2._pressBy(0.5);
});
f.prototype.hush = function() {
  return v$2;
};
const $p = l(
  "palindrome",
  function(t2) {
    return t2.lastOf(2, gn$1);
  },
  true,
  true
), { juxBy: Rp, juxby: Lp } = l(["juxBy", "juxby"], function(t2, e, n) {
  t2 /= 2;
  const s = function(c, u, a) {
    return u in c ? c[u] : a;
  }, r = n.withValue((c) => Object.assign({}, c, { pan: s(c, "pan", 0.5) - t2 })), o = e(n.withValue((c) => Object.assign({}, c, { pan: s(c, "pan", 0.5) + t2 })));
  return B$2(r, o).setSteps(j$3 ? U$3(r._steps, o._steps) : void 0);
}), Ip = l("jux", function(t2, e) {
  return e._juxBy(1, t2, e);
}), { echoWith: Hp, echowith: Vp, stutWith: Fp, stutwith: Dp } = l(
  ["echoWith", "echowith", "stutWith", "stutwith"],
  function(t2, e, n, s) {
    return B$2(...ht$1(0, t2 - 1).map((r) => n(s.late(h(e).mul(r)), r)));
  }
), Gp = l("echo", function(t2, e, n, s) {
  return s._echoWith(t2, e, (r, o) => r.gain(Math.pow(n, o)));
}), Qp = l("stut", function(t2, e, n, s) {
  return s._echoWith(t2, n, (r, o) => r.gain(Math.pow(e, o)));
}), bn = l("applyN", function(t2, e, n) {
  let s = n;
  for (let r = 0; r < t2; r++)
    s = e(s);
  return s;
}), Up = l(["plyWith", "plywith"], function(t2, e, n) {
  const s = n.fmap((r) => at$1(...ht$1(0, t2 - 1).map((o) => bn(o, e, r)))._fast(t2)).squeezeJoin();
  return j$3 && (s._steps = h(t2).mulmaybe(n._steps)), s;
}), Kp = l(["plyForEach", "plyforeach"], function(t2, e, n) {
  const s = n.fmap((r) => at$1(at$1(z$1(r), ...ht$1(1, t2 - 1).map((o) => e(z$1(r), o))))._fast(t2)).squeezeJoin();
  return j$3 && (s._steps = h(t2).mulmaybe(n._steps)), s;
}), Tt$1 = function(t2, e, n = false) {
  return t2 = h(t2), K$1(
    ...ht$1(0, t2.sub(1)).map(
      (s) => n ? e.late(h(s).div(t2)) : e.early(h(s).div(t2))
    )
  );
}, Xp = l(
  "iter",
  function(t2, e) {
    return Tt$1(t2, e, false);
  },
  true,
  true
), { iterBack: Yp, iterback: Zp } = l(
  ["iterBack", "iterback"],
  function(t2, e) {
    return Tt$1(t2, e, true);
  },
  true,
  true
), { repeatCycles: tf } = l(
  "repeatCycles",
  function(t2, e) {
    return new f(function(n) {
      const s = n.span.begin.sam(), r = s.div(t2).sam(), o = s.sub(r);
      return n = n.withSpan((c) => c.withTime((u) => u.sub(o))), e.query(n).map((c) => c.withSpan((u) => u.withTime((a) => a.add(o))));
    }).splitQueries();
  },
  true,
  true
), Ct$1 = function(t2, e, n, s = false, r = false) {
  const o = Array(t2 - 1).fill(false);
  o.unshift(true);
  const c = Tt$1(t2, G$3(...o), !s);
  return r || (n = n.repeatCycles(t2)), n.when(c, e);
}, { chunk: ef, slowchunk: nf, slowChunk: sf } = l(
  ["chunk", "slowchunk", "slowChunk"],
  function(t2, e, n) {
    return Ct$1(t2, e, n, false, false);
  },
  true,
  true
), { chunkBack: rf, chunkback: of } = l(
  ["chunkBack", "chunkback"],
  function(t2, e, n) {
    return Ct$1(t2, e, n, true);
  },
  true,
  true
), { fastchunk: cf, fastChunk: uf } = l(
  ["fastchunk", "fastChunk"],
  function(t2, e, n) {
    return Ct$1(t2, e, n, false, true);
  },
  true,
  true
), { chunkinto: af, chunkInto: lf } = l(["chunkinto", "chunkInto"], function(t2, e, n) {
  return n.into(W$3(true, ...Array(t2 - 1).fill(false))._iterback(t2), e);
}), { chunkbackinto: pf, chunkBackInto: ff } = l(["chunkbackinto", "chunkBackInto"], function(t2, e, n) {
  return n.into(
    W$3(true, ...Array(t2 - 1).fill(false))._iter(t2)._early(1),
    e
  );
}), hf = l(
  "bypass",
  function(t2, e) {
    return t2 = !!parseInt(t2), t2 ? v$2 : e;
  },
  true,
  true
), { ribbon: df, rib: mf } = l(
  ["ribbon", "rib"],
  (t2, e, n) => n.early(t2).restart(z$1(1).slow(e))
), yf = l("hsla", (t2, e, n, s, r) => r.color(`hsla(${t2}turn,${e * 100}%,${n * 100}%,${s})`)), wf = l("hsl", (t2, e, n, s) => s.color(`hsl(${t2}turn,${e * 100}%,${n * 100}%)`));
f.prototype.tag = function(t2) {
  return this.withContext((e) => ({ ...e, tags: (e.tags || []).concat([t2]) }));
};
const gf = l("filter", (t2, e) => e.withHaps((n) => n.filter(t2))), bf = l("filterWhen", (t2, e) => e.filter((n) => t2(n.whole.begin))), _f = l(
  "within",
  (t2, e, n, s) => B$2(
    n(s.filterWhen((r) => r.cyclePos() >= t2 && r.cyclePos() <= e)),
    s.filterWhen((r) => r.cyclePos() < t2 || r.cyclePos() > e)
  )
);
f.prototype.stepJoin = function() {
  const t2 = this, e = N$4(...Lt$1(It$1(t2.queryArc(0, 1))))._steps, n = function(s) {
    const o = t2.early(s.span.begin.sam()).query(s.setSpan(new x$2(h(0), h(1))));
    return N$4(...Lt$1(It$1(o))).query(s);
  };
  return new f(n, e);
};
f.prototype.stepBind = function(t2) {
  return this.fmap(t2).stepJoin();
};
function Lt$1(t2) {
  const e = t2.filter((o, c) => c.hasSteps).reduce((o, c) => o.add(c), h(0)), n = it$2(t2.map((o, c) => c._steps)).reduce(
    (o, c) => o.add(c),
    h(0)
  ), s = e.eq(0) ? void 0 : n.div(e);
  function r(o, c) {
    return c._steps === void 0 ? [o.mulmaybe(s), c] : [c._steps, c];
  }
  return t2.map((o) => r(...o));
}
function It$1(t2) {
  const e = D$3(t2.map((r) => [r.part.begin, r.part.end])), n = Ke$2([h(0), h(1), ...e]);
  return Ie$1(n).map((r) => [
    r[1].sub(r[0]),
    B$2(..._n$1(new x$2(...r), t2).map((o) => o.value.withHap((c) => c.setContext(c.combineContext(o)))))
  ]);
}
function _n$1(t2, e) {
  return it$2(e.map((n) => vn$1(t2, n)));
}
function vn$1(t2, e) {
  const n = t2.intersection(e.part);
  if (n != null)
    return new C$4(e.whole, n, e.value, e.context);
}
const kn$1 = l("pace", function(t2, e) {
  return e._steps === void 0 ? e : e._steps.eq(h(0)) ? R$2 : e._fast(h(t2).div(e._steps)).setSteps(t2);
});
function qn$1(t2, ...e) {
  const n = e.map((r) => vt$1(r));
  if (n.length == 0)
    return v$2;
  t2 == 0 && (t2 = n[0][1]);
  const s = [];
  for (const r of n)
    r[1] != 0 && (t2 == r[1] ? s.push(r[0]) : s.push(r[0]._fast(h(t2).div(h(r[1])))));
  return B$2(...s);
}
function xt(...t2) {
  if (Array.isArray(t2[0]))
    return qn$1(0, ...t2);
  if (t2 = t2.filter((s) => s.hasSteps), t2.length == 0)
    return v$2;
  const e = U$3(...t2.map((s) => s._steps));
  if (e.eq(h(0)))
    return R$2;
  const n = B$2(...t2.map((s) => s.pace(e)));
  return n._steps = e, n;
}
function N$4(...t2) {
  if (t2.length === 0)
    return R$2;
  const e = (c) => Array.isArray(c) ? c : [c._steps ?? 1, c];
  if (t2 = t2.map(e), t2.find((c) => c[0] === void 0)) {
    const c = t2.map((a) => a[0]).filter((a) => a !== void 0);
    if (c.length === 0)
      return W$3(...t2.map((a) => a[1]));
    if (c.length === t2.length)
      return R$2;
    const u = c.reduce((a, p) => a.add(p), h(0)).div(c.length);
    for (let a of t2)
      a[0] === void 0 && (a[0] = u);
  }
  if (t2.length == 1)
    return d$1(t2[0][1]).withSteps((u) => t2[0][0]);
  const n = t2.map((c) => c[0]).reduce((c, u) => c.add(u), h(0));
  let s = h(0);
  const r = [];
  for (const [c, u] of t2) {
    if (h(c).eq(0))
      continue;
    const a = s.add(c);
    r.push(d$1(u)._compress(s.div(n), a.div(n))), s = a;
  }
  const o = B$2(...r);
  return o._steps = n, o;
}
function An$1(...t2) {
  t2 = t2.map((r) => Array.isArray(r) ? r.map(d$1) : [d$1(r)]);
  const e = U$3(...t2.map((r) => h(r.length)));
  let n = [];
  for (let r = 0; r < e; ++r)
    n.push(...t2.map((o) => o.length == 0 ? v$2 : o[r % o.length]));
  n = n.filter((r) => r.hasSteps && r._steps > 0);
  const s = n.reduce((r, o) => r.add(o._steps), h(0));
  return n = N$4(...n), n._steps = s, n;
}
const Sn$1 = X$3("take", function(t2, e) {
  if (!e.hasSteps || e._steps.lte(0) || (t2 = h(t2), t2.eq(0)))
    return R$2;
  const n = t2 < 0;
  n && (t2 = t2.abs());
  const s = t2.div(e._steps);
  return s.lte(0) ? R$2 : s.gte(1) ? e : n ? e.zoom(h(1).sub(s), 1) : e.zoom(0, s);
}), Tn$1 = X$3("drop", function(t2, e) {
  return e.hasSteps ? (t2 = h(t2), t2.lt(0) ? e.take(e._steps.add(t2)) : e.take(h(0).sub(e._steps.sub(t2)))) : R$2;
}), Cn$1 = X$3("extend", function(t2, e) {
  return e.fast(t2).expand(t2);
}), vf = X$3("replicate", function(t2, e) {
  return e.repeatCycles(t2).fast(t2).expand(t2);
}), xn$1 = X$3("expand", function(t2, e) {
  return e.withSteps((n) => n.mul(h(t2)));
}), Bn$1 = X$3("contract", function(t2, e) {
  return e.withSteps((n) => n.div(h(t2)));
});
f.prototype.shrinklist = function(t2) {
  const e = this;
  if (!e.hasSteps)
    return [e];
  let [n, s] = Array.isArray(t2) ? t2 : [t2, e._steps];
  if (n = h(n), s === 0 || n === 0)
    return [e];
  const r = n > 0, o = [];
  if (r) {
    const c = h(1).div(e._steps).mul(n);
    for (let u = 0; u < s; ++u) {
      const a = c.mul(u);
      if (a.gt(1))
        break;
      o.push([a, 1]);
    }
  } else {
    n = h(0).sub(n);
    const c = h(1).div(e._steps).mul(n);
    for (let u = 0; u < s; ++u) {
      const a = h(1).sub(c.mul(u));
      if (a.lt(0))
        break;
      o.push([h(0), a]);
    }
  }
  return o.map((c) => e.zoom(...c));
};
const On$1 = (t2, e) => e.shrinklist(t2), zn$1 = l(
  "shrink",
  function(t2, e) {
    if (!e.hasSteps)
      return R$2;
    const n = e.shrinklist(t2), s = N$4(...n);
    return s._steps = n.reduce((r, o) => r.add(o._steps), h(0)), s;
  },
  true,
  false,
  (t2) => t2.stepJoin()
), kf = l(
  "grow",
  function(t2, e) {
    if (!e.hasSteps)
      return R$2;
    const n = e.shrinklist(h(0).sub(t2));
    n.reverse();
    const s = N$4(...n);
    return s._steps = n.reduce((r, o) => r.add(o._steps), h(0)), s;
  },
  true,
  false,
  (t2) => t2.stepJoin()
), En$1 = function(t2, ...e) {
  return t2.tour(...e);
};
f.prototype.tour = function(...t2) {
  return N$4(
    ...[].concat(
      ...t2.map((e, n) => [...t2.slice(0, t2.length - n), this, ...t2.slice(t2.length - n)]),
      this,
      ...t2
    )
  );
};
const Mn$1 = function(...t2) {
  t2 = t2.filter((s) => s.hasSteps);
  const e = K$1(...t2.map((s) => s._slow(s._steps))), n = U$3(...t2.map((s) => s._steps));
  return e._fast(n).setSteps(n);
}, qf = N$4, Pn$1 = N$4, Af = N$4, Sf = An$1, Tf = xt;
f.prototype.s_polymeter = f.prototype.polymeter;
const Cf = zn$1;
f.prototype.s_taper = f.prototype.shrink;
const xf = On$1;
f.prototype.s_taperlist = f.prototype.shrinklist;
const Bf = Sn$1;
f.prototype.s_add = f.prototype.take;
const Of = Tn$1;
f.prototype.s_sub = f.prototype.drop;
const zf = xn$1;
f.prototype.s_expand = f.prototype.expand;
const Ef = Cn$1;
f.prototype.s_extend = f.prototype.extend;
const Mf = Bn$1;
f.prototype.s_contract = f.prototype.contract;
const Pf = En$1;
f.prototype.s_tour = f.prototype.tour;
const Jf = Mn$1;
f.prototype.s_zip = f.prototype.zip;
const jf = kn$1;
f.prototype.steps = f.prototype.pace;
const Nf = l("chop", function(t2, e) {
  const s = Array.from({ length: t2 }, (c, u) => u).map((c) => ({ begin: c / t2, end: (c + 1) / t2 })), r = function(c, u) {
    if ("begin" in c && "end" in c && c.begin !== void 0 && c.end !== void 0) {
      const a = c.end - c.begin;
      u = { begin: c.begin + u.begin * a, end: c.begin + u.end * a };
    }
    return Object.assign({}, c, u);
  }, o = function(c) {
    return G$3(s.map((u) => r(c, u)));
  };
  return e.squeezeBind(o).setSteps(j$3 ? h(t2).mulmaybe(e._steps) : void 0);
}), Wf = l("striate", function(t2, e) {
  const s = Array.from({ length: t2 }, (o, c) => c).map((o) => ({ begin: o / t2, end: (o + 1) / t2 })), r = K$1(...s);
  return e.set(r)._fast(t2).setSteps(j$3 ? h(t2).mulmaybe(e._steps) : void 0);
}), te$1 = function(t2, e, n = 0.5) {
  return e.speed(1 / t2 * n).unit("c").slow(t2);
}, Jn$1 = l(
  "slice",
  function(t2, e, n) {
    return t2.innerBind(
      (s) => e.outerBind(
        (r) => n.outerBind((o) => {
          o = o instanceof Object ? o : { s: o };
          const c = Array.isArray(s) ? s[r] : r / s, u = Array.isArray(s) ? s[r + 1] : (r + 1) / s;
          return z$1({ begin: c, end: u, _slices: s, ...o });
        })
      )
    ).setSteps(e._steps);
  },
  false
  // turns off auto-patternification
);
f.prototype.onTriggerTime = function(t2) {
  return this.onTrigger((e, n, s, r) => {
    const o = r - n;
    window.setTimeout(() => {
      t2(e);
    }, o * 1e3);
  }, false);
};
const $f = l(
  "splice",
  function(t2, e, n) {
    const s = Jn$1(t2, e, n);
    return new f((r) => {
      const o = r.controls._cps || 1;
      return s.query(r).map(
        (u) => u.withValue((a) => ({
          speed: o / a._slices / u.whole.duration * (a.speed || 1),
          unit: "c",
          ...a
        }))
      );
    }).setSteps(e._steps);
  },
  false
  // turns off auto-patternification
), { loopAt: Rf, loopat: Lf } = l(["loopAt", "loopat"], function(t2, e) {
  const n = e._steps ? e._steps.div(t2) : void 0;
  return new f((s) => te$1(t2, e, s.controls._cps).query(s), n);
}), If = l(
  "fit",
  (t2) => t2.withHaps(
    (e, n) => e.map(
      (s) => s.withValue((r) => {
        const o = ("end" in r ? r.end : 1) - ("begin" in r ? r.begin : 0);
        return {
          ...r,
          speed: (n.controls._cps || 1) / s.whole.duration * o,
          unit: "c"
        };
      })
    )
  )
), { loopAtCps: Hf, loopatcps: Vf } = l(["loopAtCps", "loopatcps"], function(t2, e, n) {
  return te$1(t2, n, e);
}), Ff = (t2) => z$1(1).withValue(() => d$1(t2())).innerJoin();
let Ht$1 = (t2) => t2 < 0.5 ? 1 : 1 - (t2 - 0.5) / 0.5, jn$1 = (t2, e, n) => {
  e = d$1(e), t2 = d$1(t2), n = d$1(n);
  let s = e.fmap((o) => ({ gain: Ht$1(o) })), r = e.fmap((o) => ({ gain: Ht$1(1 - o) }));
  return B$2(t2.mul(s), n.mul(r));
};
f.prototype.xfade = function(t2, e) {
  return jn$1(this, t2, e);
};
const Nn$1 = (t2) => (e, n, s) => {
  e = h(e).mod(n), n = h(n);
  const r = e.div(n), o = e.add(1).div(n);
  return t2(s.fmap((c) => z$1(c)._compress(r, o)));
}, { beat: Df } = l(
  ["beat"],
  Nn$1((t2) => t2.innerJoin())
), ee$2 = (t2, e, n) => {
  n = h(n);
  const s = h(1).div(t2.length), r = (u) => {
    const a = [];
    for (const [p, m2] of u.entries())
      m2 && a.push([h(p).div(u.length), m2]);
    return a;
  }, o = At(
    ([u, a], [p, m2]) => {
      const y = n.mul(p - u).add(u), _2 = y.add(s);
      return new x$2(y, _2);
    },
    r(t2),
    r(e)
  );
  function c(u) {
    const a = u.span.begin.sam(), p = u.span.cycleArc(), m2 = [];
    for (const y of o) {
      const _2 = y.intersection(p);
      _2 !== void 0 && m2.push(
        new C$4(
          y.withTime((g) => g.add(a)),
          _2.withTime((g) => g.add(a)),
          true
        )
      );
    }
    return m2;
  }
  return new f(c).splitQueries();
}, Gf = (t2, e, n) => (t2 = d$1(t2), e = d$1(e), n = d$1(n), t2.innerBind((s) => e.innerBind((r) => n.innerBind((o) => ee$2(s, r, o))))), Wn$1 = ["scurve", "soft", "hard", "cubic", "diode", "asym", "fold", "sinefold", "chebyshev"];
for (const t2 of Wn$1)
  f.prototype[t2] = function(e) {
    const n = d$1(e).fmap((s) => Array.isArray(s) ? [...s, t2] : [s, 1, t2]);
    return this.distort(n);
  };
function Bt$1(t2) {
  let e = Array.isArray(t2);
  t2 = e ? t2 : [t2];
  const n = t2[0], s = (o) => {
    let c;
    if (typeof o == "object" && o.value !== void 0 && (c = { ...o }, o = o.value, delete c.value), e && Array.isArray(o)) {
      const u = c || {};
      return o.forEach((a, p) => {
        p < t2.length && (u[t2[p]] = a);
      }), u;
    } else return c ? (c[n] = o, c) : { [n]: o };
  }, r = function(o, c) {
    return c ? typeof o > "u" ? c.fmap(s) : c.set(d$1(o).withValue(s)) : d$1(o).withValue(s);
  };
  return f.prototype[n] = function(o) {
    return r(o, this);
  }, r;
}
const rt$2 = /* @__PURE__ */ new Map();
function $n$1(t2) {
  return rt$2.has(t2);
}
function i$1(t2, ...e) {
  const n = Array.isArray(t2) ? t2[0] : t2;
  let s = {};
  return s[n] = Bt$1(t2), rt$2.set(n, n), e.forEach((r) => {
    s[r] = s[n], rt$2.set(r, n), f.prototype[r] = f.prototype[n];
  }), s;
}
const { s: Rn$1, sound: Ln$1 } = i$1(["s", "n", "gain"], "sound"), { wt: In$1, wavetablePosition: Hn$1 } = i$1("wt", "wavetablePosition"), { wtenv: Vn$1 } = i$1("wtenv"), { wtattack: Fn$1, wtatt: Dn$1 } = i$1("wtattack", "wtatt"), { wtdecay: Gn$1, wtdec: Qn$1 } = i$1("wtdecay", "wtdec"), { wtsustain: Un$1, wtsus: Kn$1 } = i$1("wtsustain", "wtsus"), { wtrelease: Xn, wtrel: Yn$1 } = i$1("wtrelease", "wtrel"), { wtrate: Zn } = i$1("wtrate"), { wtsync: ts } = i$1("wtsync"), { wtdepth: es } = i$1("wtdepth"), { wtshape: ns } = i$1("wtshape"), { wtdc: ss } = i$1("wtdc"), { wtskew: rs } = i$1("wtskew"), { warp: os, wavetableWarp: is } = i$1("warp", "wavetableWarp"), { warpattack: cs, warpatt: us$1 } = i$1("warpattack", "warpatt"), { warpdecay: as, warpdec: ls } = i$1("warpdecay", "warpdec"), { warpsustain: ps, warpsus: fs } = i$1("warpsustain", "warpsus"), { warprelease: hs, warprel: ds } = i$1("warprelease", "warprel"), { warprate: ms } = i$1("warprate"), { warpdepth: ys } = i$1("warpdepth"), { warpshape: ws } = i$1("warpshape"), { warpdc: gs } = i$1("warpdc"), { warpskew: bs } = i$1("warpskew"), { warpmode: _s, wavetableWarpMode: vs } = i$1("warpmode", "wavetableWarpMode"), { wtphaserand: ks, wavetablePhaseRand: qs } = i$1("wtphaserand", "wavetablePhaseRand"), { warpenv: As } = i$1("warpenv"), { warpsync: Ss } = i$1("warpsync"), { source: Ts, src: Cs } = i$1("source", "src"), { n: xs } = i$1("n"), { note: Bs } = i$1(["note", "n"]), { accelerate: Os } = i$1("accelerate"), { velocity: zs } = i$1("velocity"), { gain: Es } = i$1("gain"), { postgain: Ms } = i$1("postgain"), { amp: Ps } = i$1("amp"), { attack: Js, att: js } = i$1("attack", "att"), { fmh: Ns } = i$1(["fmh", "fmi"], "fmh"), { fmi: Ws, fm: $s } = i$1(["fmi", "fmh"], "fm"), { fmenv: Rs } = i$1("fmenv"), { fmattack: Ls } = i$1("fmattack"), { fmwave: Is } = i$1("fmwave"), { fmdecay: Hs } = i$1("fmdecay"), { fmsustain: Vs } = i$1("fmsustain"), { fmrelease: Fs } = i$1("fmrelease"), { fmvelocity: Ds } = i$1("fmvelocity"), { bank: Gs } = i$1("bank"), { chorus: Qs } = i$1("chorus"), { analyze: Us } = i$1("analyze"), { fft: Ks } = i$1("fft"), { decay: Xs, dec: Ys } = i$1("decay", "dec"), { sustain: Zs, sus: tr } = i$1("sustain", "sus"), { release: er, rel: nr } = i$1("release", "rel"), { hold: sr } = i$1("hold"), { bandf: rr, bpf: or, bp: ir } = i$1(["bandf", "bandq", "bpenv"], "bpf", "bp"), { bandq: cr, bpq: ur } = i$1("bandq", "bpq"), { begin: ar } = i$1("begin"), { end: lr } = i$1("end"), { loop: pr } = i$1("loop"), { loopBegin: fr, loopb: hr } = i$1("loopBegin", "loopb"), { loopEnd: dr, loope: mr } = i$1("loopEnd", "loope"), { crush: yr } = i$1("crush"), { coarse: wr } = i$1("coarse"), { tremolo: gr } = i$1(["tremolo", "tremolodepth", "tremoloskew", "tremolophase"], "trem"), { tremolosync: br } = i$1(
  ["tremolosync", "tremolodepth", "tremoloskew", "tremolophase"],
  "tremsync"
), { tremolodepth: _r } = i$1("tremolodepth", "tremdepth"), { tremoloskew: vr } = i$1("tremoloskew", "tremskew"), { tremolophase: kr } = i$1("tremolophase", "tremphase"), { tremoloshape: qr } = i$1("tremoloshape", "tremshape"), { drive: Ar } = i$1("drive"), { duck: Sr } = i$1("duckorbit", "duck"), { duckdepth: Tr$1 } = i$1("duckdepth"), { duckonset: Cr } = i$1("duckonset", "duckons"), { duckattack: xr } = i$1("duckattack", "duckatt"), { byteBeatExpression: Br, bbexpr: Or$1 } = i$1("byteBeatExpression", "bbexpr"), { byteBeatStartTime: zr$1, bbst: Er } = i$1("byteBeatStartTime", "bbst"), { channels: Mr$1, ch: Pr } = i$1("channels", "ch"), { pw: Jr$1 } = i$1(["pw", "pwrate", "pwsweep"]), { pwrate: jr } = i$1("pwrate"), { pwsweep: Nr } = i$1("pwsweep"), { phaserrate: Wr$1, ph: $r, phaser: Rr } = i$1(
  ["phaserrate", "phaserdepth", "phasercenter", "phasersweep"],
  "ph",
  "phaser"
), { phasersweep: Lr, phs: Ir } = i$1("phasersweep", "phs"), { phasercenter: Hr$1, phc: Vr$1 } = i$1("phasercenter", "phc"), { phaserdepth: Fr, phd: Dr, phasdp: Gr$1 } = i$1("phaserdepth", "phd", "phasdp"), { channel: Qr$1 } = i$1("channel"), { cut: Ur$1 } = i$1("cut"), { cutoff: Kr$1, ctf: Xr$1, lpf: Yr$1, lp: Zr$1 } = i$1(["cutoff", "resonance", "lpenv"], "ctf", "lpf", "lp"), { lpenv: to$1, lpe: eo$1 } = i$1("lpenv", "lpe"), { hpenv: no$1, hpe: so$1 } = i$1("hpenv", "hpe"), { bpenv: ro$1, bpe: oo$1 } = i$1("bpenv", "bpe"), { lpattack: io$1, lpa: co$1 } = i$1("lpattack", "lpa"), { hpattack: uo$1, hpa: ao$1 } = i$1("hpattack", "hpa"), { bpattack: lo$1, bpa: po$1 } = i$1("bpattack", "bpa"), { lpdecay: fo$1, lpd: ho$1 } = i$1("lpdecay", "lpd"), { hpdecay: mo$1, hpd: yo$1 } = i$1("hpdecay", "hpd"), { bpdecay: wo$1, bpd: go$1 } = i$1("bpdecay", "bpd"), { lpsustain: bo$1, lps: _o$1 } = i$1("lpsustain", "lps"), { hpsustain: vo$1, hps: ko$1 } = i$1("hpsustain", "hps"), { bpsustain: qo$1, bps: Ao$1 } = i$1("bpsustain", "bps"), { lprelease: So$1, lpr: To$1 } = i$1("lprelease", "lpr"), { hprelease: Co$1, hpr: xo$1 } = i$1("hprelease", "hpr"), { bprelease: Bo$1, bpr: Oo$1 } = i$1("bprelease", "bpr"), { ftype: zo$1 } = i$1("ftype"), { fanchor: Eo$1 } = i$1("fanchor"), { vib: Mo$1, vibrato: Po$1, v: Jo$1 } = i$1(["vib", "vibmod"], "vibrato", "v"), { noise: jo$1 } = i$1("noise"), { vibmod: No$1, vmod: Wo$1 } = i$1(["vibmod", "vib"], "vmod"), { hcutoff: $o$1, hpf: Ro$1, hp: Lo$1 } = i$1(["hcutoff", "hresonance", "hpenv"], "hpf", "hp"), { hresonance: Io$1, hpq: Ho$1 } = i$1("hresonance", "hpq"), { resonance: Vo$1, lpq: Fo$1 } = i$1("resonance", "lpq"), { djf: Do$1 } = i$1("djf"), { delay: Go$1 } = i$1(["delay", "delaytime", "delayfeedback"]), { delayfeedback: Qo$1, delayfb: Uo$1, dfb: Ko$1 } = i$1("delayfeedback", "delayfb", "dfb"), { delayspeed: Xo$1 } = i$1("delayspeed"), { delaytime: Yo, delayt: Zo$1, dt: ti } = i$1("delaytime", "delayt", "dt"), { delaysync: ei } = i$1("delaysync"), { lock: ni } = i$1("lock"), { detune: si, det: ri } = i$1("detune", "det"), { unison: oi } = i$1("unison"), { spread: ii } = i$1("spread"), { dry: ci } = i$1("dry"), { fadeTime: ui, fadeOutTime: ai } = i$1("fadeTime", "fadeOutTime"), { fadeInTime: li } = i$1("fadeInTime"), { freq: pi } = i$1("freq"), { pattack: fi, patt: hi } = i$1("pattack", "patt"), { pdecay: di, pdec: mi } = i$1("pdecay", "pdec"), { psustain: yi, psus: wi } = i$1("psustain", "psus"), { prelease: gi, prel: bi } = i$1("prelease", "prel"), { penv: _i } = i$1("penv"), { pcurve: vi } = i$1("pcurve"), { panchor: ki } = i$1("panchor"), { gate: qi, gat: Ai } = i$1("gate", "gat"), { leslie: Si } = i$1("leslie"), { lrate: Ti } = i$1("lrate"), { lsize: Ci } = i$1("lsize"), { activeLabel: xi } = i$1("activeLabel"), { label: Bi } = i$1(["label", "activeLabel"]), { degree: Oi } = i$1("degree"), { mtranspose: zi } = i$1("mtranspose"), { ctranspose: Ei } = i$1("ctranspose"), { harmonic: Mi } = i$1("harmonic"), { stepsPerOctave: Pi } = i$1("stepsPerOctave"), { octaveR: Ji } = i$1("octaveR"), { nudge: ji } = i$1("nudge"), { octave: Ni } = i$1("octave"), { orbit: Wi } = i$1("orbit"), { overgain: $i } = i$1("overgain"), { overshape: Ri } = i$1("overshape"), { pan: Li } = i$1("pan"), { panspan: Ii } = i$1("panspan"), { pansplay: Hi } = i$1("pansplay"), { panwidth: Vi } = i$1("panwidth"), { panorient: Fi } = i$1("panorient"), { rate: Di } = i$1("rate"), { slide: Gi } = i$1("slide"), { semitone: Qi } = i$1("semitone"), { voice: Ui } = i$1("voice"), { chord: Ki } = i$1("chord"), { dictionary: Xi, dict: Yi } = i$1("dictionary", "dict"), { anchor: Zi } = i$1("anchor"), { offset: tc$1 } = i$1("offset"), { octaves: ec$1 } = i$1("octaves"), { mode: nc$1 } = i$1(["mode", "anchor"]), { room: sc$1 } = i$1(["room", "size"]), { roomlp: rc, rlp: oc$1 } = i$1("roomlp", "rlp"), { roomdim: ic, rdim: cc$1 } = i$1("roomdim", "rdim"), { roomfade: uc, rfade: ac } = i$1("roomfade", "rfade"), { ir: lc, iresponse: pc } = i$1(["ir", "i"], "iresponse"), { irspeed: fc } = i$1("irspeed"), { irbegin: hc } = i$1("irbegin"), { roomsize: dc, size: mc, sz: yc, rsize: wc } = i$1("roomsize", "size", "sz", "rsize"), { shape: gc } = i$1(["shape", "shapevol"]), { distort: bc, dist: _c } = i$1(["distort", "distortvol", "distorttype"], "dist"), { distortvol: vc } = i$1("distortvol", "distvol"), { distorttype: kc } = i$1("distorttype", "disttype"), { compressor: qc } = i$1([
  "compressor",
  "compressorRatio",
  "compressorKnee",
  "compressorAttack",
  "compressorRelease"
]), { compressorKnee: Ac } = i$1("compressorKnee"), { compressorRatio: Sc } = i$1("compressorRatio"), { compressorAttack: Tc } = i$1("compressorAttack"), { compressorRelease: Cc } = i$1("compressorRelease"), { speed: ne$1 } = i$1("speed"), { stretch: xc } = i$1("stretch"), { unit: Bc } = i$1("unit"), { squiz: Oc } = i$1("squiz"), { vowel: zc } = i$1("vowel"), { waveloss: Ec } = i$1("waveloss"), { density: Mc } = i$1("density"), { expression: Pc } = i$1("expression"), { sustainpedal: Jc } = i$1("sustainpedal"), { fshift: jc } = i$1("fshift"), { fshiftnote: Nc } = i$1("fshiftnote"), { fshiftphase: Wc } = i$1("fshiftphase"), { triode: $c } = i$1("triode"), { krush: Rc } = i$1("krush"), { kcutoff: Lc } = i$1("kcutoff"), { octer: Ic } = i$1("octer"), { octersub: Hc } = i$1("octersub"), { octersubsub: Vc } = i$1("octersubsub"), { ring: Fc } = i$1("ring"), { ringf: Dc } = i$1("ringf"), { ringdf: Gc } = i$1("ringdf"), { freeze: Qc } = i$1("freeze"), { xsdelay: Uc } = i$1("xsdelay"), { tsdelay: Kc } = i$1("tsdelay"), { real: Xc } = i$1("real"), { imag: Yc } = i$1("imag"), { enhance: Zc } = i$1("enhance"), { partials: tu } = i$1("partials"), { comb: eu } = i$1("comb"), { smear: nu$1 } = i$1("smear"), { scram: su } = i$1("scram"), { binshift: ru$1 } = i$1("binshift"), { hbrick: ou } = i$1("hbrick"), { lbrick: iu } = i$1("lbrick"), { frameRate: cu$1 } = i$1("frameRate"), { frames: uu$1 } = i$1("frames"), { hours: au } = i$1("hours"), { minutes: lu } = i$1("minutes"), { seconds: pu } = i$1("seconds"), { songPtr: fu } = i$1("songPtr"), { uid: hu } = i$1("uid"), { val: du$1 } = i$1("val"), { cps: mu } = i$1("cps"), { clip: yu, legato: wu } = i$1("clip", "legato"), { duration: gu, dur: bu } = i$1("duration", "dur"), { zrand: _u } = i$1("zrand"), { curve: vu } = i$1("curve"), { deltaSlide: ku } = i$1("deltaSlide"), { pitchJump: qu } = i$1("pitchJump"), { pitchJumpTime: Au$1 } = i$1("pitchJumpTime"), { lfo: Su, repeatTime: Tu } = i$1("lfo", "repeatTime"), { znoise: Cu$1 } = i$1("znoise"), { zmod: xu } = i$1("zmod"), { zcrush: Bu } = i$1("zcrush"), { zdelay: Ou } = i$1("zdelay"), { zzfx: zu } = i$1("zzfx"), { color: Eu, colour: Mu } = i$1(["color", "colour"]);
let Pu = (...t2) => t2.reduce((e, n) => Object.assign(e, { [n]: Bt$1(n) }), {});
const Ju = l("adsr", (t2, e) => {
  t2 = Array.isArray(t2) ? t2 : [t2];
  const [n, s, r, o] = t2;
  return e.set({ attack: n, decay: s, sustain: r, release: o });
}), ju = l("ad", (t2, e) => {
  t2 = Array.isArray(t2) ? t2 : [t2];
  const [n, s = n] = t2;
  return e.attack(n).decay(s);
}), Nu = l("ds", (t2, e) => {
  t2 = Array.isArray(t2) ? t2 : [t2];
  const [n, s = 0] = t2;
  return e.set({ decay: n, sustain: s });
}), Wu = l("ar", (t2, e) => {
  t2 = Array.isArray(t2) ? t2 : [t2];
  const [n, s = n] = t2;
  return e.set({ attack: n, release: s });
}), { midichan: $u } = i$1("midichan"), { midimap: Ru } = i$1("midimap"), { midiport: Lu } = i$1("midiport"), { midicmd: Iu } = i$1("midicmd"), Hu = l("control", (t2, e) => {
  if (!Array.isArray(t2))
    throw new Error("control expects an array of [ccn, ccv]");
  const [n, s] = t2;
  return e.ccn(n).ccv(s);
}), { ccn: Vu } = i$1("ccn"), { ccv: Fu } = i$1("ccv"), { ctlNum: Du$1 } = i$1("ctlNum"), { nrpnn: Gu } = i$1("nrpnn"), { nrpv: Qu$1 } = i$1("nrpv"), { progNum: Uu } = i$1("progNum"), Ku = l("sysex", (t2, e) => {
  if (!Array.isArray(t2))
    throw new Error("sysex expects an array of [id, data]");
  const [n, s] = t2;
  return e.sysexid(n).sysexdata(s);
}), { sysexid: Xu } = i$1("sysexid"), { sysexdata: Yu } = i$1("sysexdata"), { midibend: Zu } = i$1("midibend"), { miditouch: ta } = i$1("miditouch"), { polyTouch: ea } = i$1("polyTouch"), { oschost: na } = i$1("oschost"), { oscport: sa } = i$1("oscport"), se = (t2) => rt$2.has(t2) ? rt$2.get(t2) : t2, ra = l("as", (t2, e) => (t2 = Array.isArray(t2) ? t2 : [t2], e.fmap((n) => (n = Array.isArray(n) ? n : [n], n = Object.fromEntries(t2.map((s, r) => [se(s), n[r]])), n)))), oa = l(
  "scrub",
  (t2, e) => t2.outerBind((n) => {
    Array.isArray(n) || (n = [n]);
    const [s, r = 1] = n;
    return e.begin(s).mul(ne$1(r)).clip(1);
  }),
  false
), Qf = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  accelerate: Os,
  activeLabel: xi,
  ad: ju,
  adsr: Ju,
  amp: Ps,
  analyze: Us,
  anchor: Zi,
  ar: Wu,
  as: ra,
  att: js,
  attack: Js,
  bandf: rr,
  bandq: cr,
  bank: Gs,
  bbexpr: Or$1,
  bbst: Er,
  begin: ar,
  binshift: ru$1,
  bp: ir,
  bpa: po$1,
  bpattack: lo$1,
  bpd: go$1,
  bpdecay: wo$1,
  bpe: oo$1,
  bpenv: ro$1,
  bpf: or,
  bpq: ur,
  bpr: Oo$1,
  bprelease: Bo$1,
  bps: Ao$1,
  bpsustain: qo$1,
  byteBeatExpression: Br,
  byteBeatStartTime: zr$1,
  ccn: Vu,
  ccv: Fu,
  ch: Pr,
  channel: Qr$1,
  channels: Mr$1,
  chord: Ki,
  chorus: Qs,
  clip: yu,
  coarse: wr,
  color: Eu,
  colour: Mu,
  comb: eu,
  compressor: qc,
  compressorAttack: Tc,
  compressorKnee: Ac,
  compressorRatio: Sc,
  compressorRelease: Cc,
  control: Hu,
  cps: mu,
  createParam: Bt$1,
  createParams: Pu,
  crush: yr,
  ctf: Xr$1,
  ctlNum: Du$1,
  ctranspose: Ei,
  curve: vu,
  cut: Ur$1,
  cutoff: Kr$1,
  dec: Ys,
  decay: Xs,
  degree: Oi,
  delay: Go$1,
  delayfb: Uo$1,
  delayfeedback: Qo$1,
  delayspeed: Xo$1,
  delaysync: ei,
  delayt: Zo$1,
  delaytime: Yo,
  deltaSlide: ku,
  density: Mc,
  det: ri,
  detune: si,
  dfb: Ko$1,
  dict: Yi,
  dictionary: Xi,
  dist: _c,
  distort: bc,
  distorttype: kc,
  distortvol: vc,
  djf: Do$1,
  drive: Ar,
  dry: ci,
  ds: Nu,
  dt: ti,
  duck: Sr,
  duckattack: xr,
  duckdepth: Tr$1,
  duckonset: Cr,
  dur: bu,
  duration: gu,
  end: lr,
  enhance: Zc,
  expression: Pc,
  fadeInTime: li,
  fadeOutTime: ai,
  fadeTime: ui,
  fanchor: Eo$1,
  fft: Ks,
  fm: $s,
  fmattack: Ls,
  fmdecay: Hs,
  fmenv: Rs,
  fmh: Ns,
  fmi: Ws,
  fmrelease: Fs,
  fmsustain: Vs,
  fmvelocity: Ds,
  fmwave: Is,
  frameRate: cu$1,
  frames: uu$1,
  freeze: Qc,
  freq: pi,
  fshift: jc,
  fshiftnote: Nc,
  fshiftphase: Wc,
  ftype: zo$1,
  gain: Es,
  gat: Ai,
  gate: qi,
  getControlName: se,
  harmonic: Mi,
  hbrick: ou,
  hcutoff: $o$1,
  hold: sr,
  hours: au,
  hp: Lo$1,
  hpa: ao$1,
  hpattack: uo$1,
  hpd: yo$1,
  hpdecay: mo$1,
  hpe: so$1,
  hpenv: no$1,
  hpf: Ro$1,
  hpq: Ho$1,
  hpr: xo$1,
  hprelease: Co$1,
  hps: ko$1,
  hpsustain: vo$1,
  hresonance: Io$1,
  imag: Yc,
  ir: lc,
  irbegin: hc,
  iresponse: pc,
  irspeed: fc,
  isControlName: $n$1,
  kcutoff: Lc,
  krush: Rc,
  label: Bi,
  lbrick: iu,
  legato: wu,
  leslie: Si,
  lfo: Su,
  lock: ni,
  loop: pr,
  loopBegin: fr,
  loopEnd: dr,
  loopb: hr,
  loope: mr,
  lp: Zr$1,
  lpa: co$1,
  lpattack: io$1,
  lpd: ho$1,
  lpdecay: fo$1,
  lpe: eo$1,
  lpenv: to$1,
  lpf: Yr$1,
  lpq: Fo$1,
  lpr: To$1,
  lprelease: So$1,
  lps: _o$1,
  lpsustain: bo$1,
  lrate: Ti,
  lsize: Ci,
  midibend: Zu,
  midichan: $u,
  midicmd: Iu,
  midimap: Ru,
  midiport: Lu,
  miditouch: ta,
  minutes: lu,
  mode: nc$1,
  mtranspose: zi,
  n: xs,
  noise: jo$1,
  note: Bs,
  nrpnn: Gu,
  nrpv: Qu$1,
  nudge: ji,
  octave: Ni,
  octaveR: Ji,
  octaves: ec$1,
  octer: Ic,
  octersub: Hc,
  octersubsub: Vc,
  offset: tc$1,
  orbit: Wi,
  oschost: na,
  oscport: sa,
  overgain: $i,
  overshape: Ri,
  pan: Li,
  panchor: ki,
  panorient: Fi,
  panspan: Ii,
  pansplay: Hi,
  panwidth: Vi,
  partials: tu,
  patt: hi,
  pattack: fi,
  pcurve: vi,
  pdec: mi,
  pdecay: di,
  penv: _i,
  ph: $r,
  phasdp: Gr$1,
  phaser: Rr,
  phasercenter: Hr$1,
  phaserdepth: Fr,
  phaserrate: Wr$1,
  phasersweep: Lr,
  phc: Vr$1,
  phd: Dr,
  phs: Ir,
  pitchJump: qu,
  pitchJumpTime: Au$1,
  polyTouch: ea,
  postgain: Ms,
  prel: bi,
  prelease: gi,
  progNum: Uu,
  psus: wi,
  psustain: yi,
  pw: Jr$1,
  pwrate: jr,
  pwsweep: Nr,
  rate: Di,
  rdim: cc$1,
  real: Xc,
  registerControl: i$1,
  rel: nr,
  release: er,
  repeatTime: Tu,
  resonance: Vo$1,
  rfade: ac,
  ring: Fc,
  ringdf: Gc,
  ringf: Dc,
  rlp: oc$1,
  room: sc$1,
  roomdim: ic,
  roomfade: uc,
  roomlp: rc,
  roomsize: dc,
  rsize: wc,
  s: Rn$1,
  scram: su,
  scrub: oa,
  seconds: pu,
  semitone: Qi,
  shape: gc,
  size: mc,
  slide: Gi,
  smear: nu$1,
  songPtr: fu,
  sound: Ln$1,
  source: Ts,
  speed: ne$1,
  spread: ii,
  squiz: Oc,
  src: Cs,
  stepsPerOctave: Pi,
  stretch: xc,
  sus: tr,
  sustain: Zs,
  sustainpedal: Jc,
  sysex: Ku,
  sysexdata: Yu,
  sysexid: Xu,
  sz: yc,
  tremolo: gr,
  tremolodepth: _r,
  tremolophase: kr,
  tremoloshape: qr,
  tremoloskew: vr,
  tremolosync: br,
  triode: $c,
  tsdelay: Kc,
  uid: hu,
  unison: oi,
  unit: Bc,
  v: Jo$1,
  val: du$1,
  velocity: zs,
  vib: Mo$1,
  vibmod: No$1,
  vibrato: Po$1,
  vmod: Wo$1,
  voice: Ui,
  vowel: zc,
  warp: os,
  warpatt: us$1,
  warpattack: cs,
  warpdc: gs,
  warpdec: ls,
  warpdecay: as,
  warpdepth: ys,
  warpenv: As,
  warpmode: _s,
  warprate: ms,
  warprel: ds,
  warprelease: hs,
  warpshape: ws,
  warpskew: bs,
  warpsus: fs,
  warpsustain: ps,
  warpsync: Ss,
  waveloss: Ec,
  wavetablePhaseRand: qs,
  wavetablePosition: Hn$1,
  wavetableWarp: is,
  wavetableWarpMode: vs,
  wt: In$1,
  wtatt: Dn$1,
  wtattack: Fn$1,
  wtdc: ss,
  wtdec: Qn$1,
  wtdecay: Gn$1,
  wtdepth: es,
  wtenv: Vn$1,
  wtphaserand: ks,
  wtrate: Zn,
  wtrel: Yn$1,
  wtrelease: Xn,
  wtshape: ns,
  wtskew: rs,
  wtsus: Kn$1,
  wtsustain: Un$1,
  wtsync: ts,
  xsdelay: Uc,
  zcrush: Bu,
  zdelay: Ou,
  zmod: xu,
  znoise: Cu$1,
  zrand: _u,
  zzfx: zu
}, Symbol.toStringTag, { value: "Module" })), ia = function(t2, e) {
  const [n, s] = t2, [r, o] = e, [c, u] = Kt$1(s, r);
  return [
    [s, n - s],
    [At((a, p) => a.concat(p), c, o), u]
  ];
}, ca = function(t2, e) {
  const [n, s] = t2, [r, o] = e, [c, u] = Kt$1(n, o);
  return [
    [n, s - n],
    [At((p, m2) => p.concat(m2), r, c), u]
  ];
}, re = function(t2, e) {
  const [n, s] = t2;
  return Math.min(n, s) <= 1 ? [t2, e] : re(...n > s ? ia(t2, e) : ca(t2, e));
}, oe = function(t2, e) {
  const n = t2 < 0, s = Math.abs(t2), r = e - s, o = Array(s).fill([1]), c = Array(r).fill([0]), u = re([s, r], [o, c]), a = D$3(u[1][0]).concat(D$3(u[1][1]));
  return n ? a.map((p) => 1 - p) : a;
}, dt$2 = function(t2, e, n) {
  const s = oe(t2, e);
  return n ? $e$1(s, -n) : s;
}, Uf = l("euclid", function(t2, e, n) {
  return n.struct(dt$2(t2, e, 0));
}), Kf = l("e", function(t2, e) {
  Array.isArray(t2) || (t2 = [t2]);
  const [n, s = n, r = 0] = t2;
  return e.struct(dt$2(n, s, r));
}), { euclidrot: Xf, euclidRot: Yf } = l(["euclidrot", "euclidRot"], function(t2, e, n, s) {
  return s.struct(dt$2(t2, e, n));
}), ie = function(t2, e, n, s) {
  if (t2 < 1)
    return v$2;
  const o = dt$2(t2, e, 0).join("").split("1").slice(1).map((c) => [c.length + 1, true]);
  return s.struct(Pn$1(...o)).late(h(n).div(e));
}, Zf = l(["euclidLegato"], function(t2, e, n) {
  return ie(t2, e, 0, n);
}), th = l(["euclidLegatoRot"], function(t2, e, n, s) {
  return ie(t2, e, n, s);
}), { euclidish: eh, eish: nh } = l(["euclidish", "eish"], function(t2, e, n, s) {
  const r = ee$2(oe(t2, e), new Array(t2).fill(1), n);
  return s.struct(r).setSteps(e);
});
function ua(t2, e, n = 0.05, s = 0.1, r = 0.1, o = globalThis.setInterval, c = globalThis.clearInterval, u = true) {
  let a = 0, p = 0, m2 = 10 ** 4, y = 0.01;
  const _2 = (J2) => n = J2(n);
  r = r || s / 2;
  const g = () => {
    const J2 = t2(), Q2 = J2 + s + r;
    for (p === 0 && (p = J2 + y); p < Q2; )
      p = u ? Math.round(p * m2) / m2 : p, e(p, n, a, J2), p += n, a++;
  };
  let k2;
  const q2 = () => {
    M2(), g(), k2 = o(g, s * 1e3);
  }, M2 = () => {
    k2 !== void 0 && c(k2), k2 = void 0;
  };
  return { setDuration: _2, start: q2, stop: () => {
    a = 0, p = 0, M2();
  }, pause: () => M2(), duration: n, interval: s, getPhase: () => p, minLatency: y };
}
function sh(t2) {
  return new f((e) => [new C$4(void 0, e.span, t2)]);
}
const I$3 = (t2) => {
  const e = (n) => [new C$4(void 0, n.span, t2(n.span.begin))];
  return new f(e);
}, mt$1 = I$3((t2) => t2 % 1), ce$2 = mt$1.toBipolar(), Ot$1 = I$3((t2) => 1 - t2 % 1), ue$2 = Ot$1.toBipolar(), ae$1 = I$3((t2) => Math.sin(Math.PI * 2 * t2)), aa = ae$1.fromBipolar(), rh = aa._early(h(1).div(4)), oh = ae$1._early(h(1).div(4)), la = I$3((t2) => Math.floor(t2 * 2 % 2)), ih = la.toBipolar(), ch = W$3(mt$1, Ot$1), uh = W$3(ce$2, ue$2), ah = W$3(Ot$1, mt$1), lh = W$3(ue$2, ce$2), le = I$3(et$2);
let zt$1 = 0, Et$1 = 0;
typeof window < "u" && document.addEventListener("mousemove", (t2) => {
  zt$1 = t2.clientY / document.body.clientHeight, Et$1 = t2.clientX / document.body.clientWidth;
});
const ph = I$3(() => zt$1), fh = I$3(() => zt$1), hh = I$3(() => Et$1), dh = I$3(() => Et$1), pe$2 = (t2) => {
  const e = t2 << 13 ^ t2, n = e >> 17 ^ e;
  return n << 5 ^ n;
}, pa = (t2) => t2 - Math.trunc(t2), fe$2 = (t2) => pe$2(Math.trunc(pa(t2 / 300) * 536870912)), he$2 = (t2) => t2 % 536870912 / 536870912, ot$2 = (t2) => Math.abs(he$2(fe$2(t2))), fa = (t2, e) => {
  const n = [];
  for (let s = 0; s < e; ++s)
    n.push(he$2(t2)), t2 = pe$2(t2);
  return n;
}, ha = (t2, e) => fa(fe$2(t2), e), da = (t2) => mt$1.range(0, t2).round().segment(t2), mh = (t2) => {
  const e = d$1(t2).log2(0).floor().add(1);
  return ma(t2, e);
}, ma = (t2, e = 16) => {
  e = d$1(e);
  const n = da(e).mul(-1).add(e.sub(1));
  return d$1(t2).segment(e).brshift(n).band(z$1(1));
}, ya = (t2) => I$3((e) => {
  const s = ha(e.floor().add(0.5), t2).map((o, c) => [o, c]).sort((o, c) => (o[0] > c[0]) - (o[0] < c[0])).map((o) => o[1]), r = e.cyclePos().mul(t2).floor() % t2;
  return s[r];
})._segment(t2), de$1 = (t2, e, n) => {
  const s = [...Array(e).keys()].map((r) => n.zoom(h(r).div(e), h(r + 1).div(e)));
  return t2.fmap((r) => s[r].repeatCycles(e)._fast(e)).innerJoin();
}, yh = l("shuffle", (t2, e) => de$1(ya(t2), t2, e)), wh = l("scramble", (t2, e) => de$1(ye$2(t2)._segment(t2), t2, e)), L$2 = I$3(ot$2), gh = L$2.toBipolar(), me$2 = (t2) => L$2.fmap((e) => e < t2), bh = (t2) => d$1(t2).fmap(me$2).innerJoin(), _h = me$2(0.5), ye$2 = (t2) => L$2.fmap((e) => Math.trunc(e * t2)), vh = (t2) => d$1(t2).fmap(ye$2).innerJoin(), we$2 = (t2, e) => (e = e.map(d$1), e.length == 0 ? v$2 : t2.range(0, e.length).fmap((n) => {
  const s = Math.min(Math.max(Math.floor(n), 0), e.length - 1);
  return e[s];
})), Mt = (t2, e) => we$2(t2, e).outerJoin(), ge$2 = (t2, e) => we$2(t2, e).innerJoin(), wa = (...t2) => Mt(L$2, t2), kh = (...t2) => ge$2(L$2, t2), qh = wa;
f.prototype.choose = function(...t2) {
  return Mt(this, t2);
};
f.prototype.choose2 = function(...t2) {
  return Mt(this.fromBipolar(), t2);
};
const ga = (...t2) => ge$2(L$2.segment(1), t2), Ah = ga, be$2 = function(t2, ...e) {
  const n = e.map((u) => d$1(u[0])), s = [];
  let r = z$1(0);
  for (const u of e)
    r = r.add(u[1]), s.push(r);
  const o = fn$1(s), c = function(u) {
    const a = r.mul(u);
    return o.fmap((p) => (m2) => n[p.findIndex((y) => y > m2, p)]).appLeft(a);
  };
  return t2.bind(c);
}, ba = (...t2) => be$2(...t2).outerJoin(), Sh = (...t2) => ba(L$2, ...t2), _a = (...t2) => be$2(L$2.segment(1), ...t2).innerJoin(), Th = _a;
function va(t2) {
  let e = Math.floor(t2), n = e + 1;
  const s = (c) => 6 * c ** 5 - 15 * c ** 4 + 10 * c ** 3;
  return (/* @__PURE__ */ ((c) => (u) => (a) => u + s(c) * (a - u))(t2 - e))(ot$2(e))(ot$2(n));
}
const ka = (t2) => t2.fmap(va);
function qa(t2) {
  const e = Math.floor(t2), n = e + 1, s = ot$2(e), r = ot$2(n) + s, o = (t2 - e) / (n - e);
  return ((u, a, p) => u + (a - u) * p)(s, r, o) / 2;
}
const Aa = (t2) => t2.fmap(qa), Ch = ka(le.fmap((t2) => Number(t2))), xh = Aa(le.fmap((t2) => Number(t2))), Bh = l(
  "degradeByWith",
  (t2, e, n) => n.fmap((s) => (r) => s).appLeft(t2.filterValues((s) => s > e)),
  true,
  true
), Oh = l(
  "degradeBy",
  function(t2, e) {
    return e._degradeByWith(L$2, t2);
  },
  true,
  true
), zh = l("degrade", (t2) => t2._degradeBy(0.5), true, true), Eh = l(
  "undegradeBy",
  function(t2, e) {
    return e._degradeByWith(
      L$2.fmap((n) => 1 - n),
      t2
    );
  },
  true,
  true
), Mh = l("undegrade", (t2) => t2._undegradeBy(0.5), true, true), Ph = l("sometimesBy", function(t2, e, n) {
  return d$1(t2).fmap((s) => B$2(n._degradeBy(s), e(n._undegradeBy(1 - s)))).innerJoin();
}), Jh = l("sometimes", function(t2, e) {
  return e._sometimesBy(0.5, t2);
}), jh = l("someCyclesBy", function(t2, e, n) {
  return d$1(t2).fmap(
    (s) => B$2(
      n._degradeByWith(L$2._segment(1), s),
      e(n._degradeByWith(L$2.fmap((r) => 1 - r)._segment(1), 1 - s))
    )
  ).innerJoin();
}), Nh = l("someCycles", function(t2, e) {
  return e._someCyclesBy(0.5, t2);
}), Wh = l("often", function(t2, e) {
  return e.sometimesBy(0.75, t2);
}), $h = l("rarely", function(t2, e) {
  return e.sometimesBy(0.25, t2);
}), Rh = l("almostNever", function(t2, e) {
  return e.sometimesBy(0.1, t2);
}), Lh = l("almostAlways", function(t2, e) {
  return e.sometimesBy(0.9, t2);
}), Ih = l("never", function(t2, e) {
  return e;
}), Hh = l("always", function(t2, e) {
  return t2(e);
});
function _e(t2) {
  Array.isArray(t2) === false && (t2 = [t2]);
  const e = sn();
  return t2.every((n) => {
    const s = nn.get(n) ?? n;
    return e[s];
  });
}
const Vh = l("whenKey", function(t2, e, n) {
  return n.when(_e(t2), e);
}), Fh = l("keyDown", function(t2) {
  return t2.fmap(_e);
}), H$3 = function(t2, e, n = true) {
  const s = Array.isArray(t2), r = Object.keys(t2).length;
  return t2 = Ze$2(t2, d$1), r === 0 ? v$2 : e.fmap((o) => {
    let c = o;
    return s && (c = n ? Math.round(c) % r : He$1(Math.round(c), 0, t2.length - 1)), t2[c];
  });
}, Sa = function(t2, e) {
  return Array.isArray(e) && ([e, t2] = [t2, e]), Ta(t2, e);
}, Ta = l("pick", function(t2, e) {
  return H$3(t2, e, false).innerJoin();
}), Ca = l("pickmod", function(t2, e) {
  return H$3(t2, e, true).innerJoin();
}), Dh = l("pickF", function(t2, e, n) {
  return n.apply(Sa(t2, e));
}), Gh = l("pickmodF", function(t2, e, n) {
  return n.apply(Ca(t2, e));
}), Qh = l("pickOut", function(t2, e) {
  return H$3(t2, e, false).outerJoin();
}), Uh = l("pickmodOut", function(t2, e) {
  return H$3(t2, e, true).outerJoin();
}), Kh = l("pickRestart", function(t2, e) {
  return H$3(t2, e, false).restartJoin();
}), Xh = l("pickmodRestart", function(t2, e) {
  return H$3(t2, e, true).restartJoin();
}), Yh = l("pickReset", function(t2, e) {
  return H$3(t2, e, false).resetJoin();
}), Zh = l("pickmodReset", function(t2, e) {
  return H$3(t2, e, true).resetJoin();
}), { inhabit: td, pickSqueeze: ed } = l(["inhabit", "pickSqueeze"], function(t2, e) {
  return H$3(t2, e, false).squeezeJoin();
}), { inhabitmod: nd, pickmodSqueeze: sd } = l(["inhabitmod", "pickmodSqueeze"], function(t2, e) {
  return H$3(t2, e, true).squeezeJoin();
}), rd = (t2, e) => (e = e.map(d$1), e.length == 0 ? v$2 : t2.fmap((n) => {
  const s = ft$1(Math.round(n), e.length);
  return e[s];
}).squeezeJoin());
let lt$2;
try {
  lt$2 = window == null ? void 0 : window.speechSynthesis;
} catch {
  console.warn("cannot use window: not in browser?");
}
let Vt = lt$2 == null ? void 0 : lt$2.getVoices();
function xa(t2, e, n) {
  lt$2.cancel();
  const s = new SpeechSynthesisUtterance(t2);
  s.lang = e, Vt = lt$2.getVoices();
  const r = Vt.filter((o) => o.lang.includes(e));
  typeof n == "number" ? s.voice = r[n % r.length] : typeof n == "string" && (s.voice = r.find((o) => o.name === o)), speechSynthesis.speak(s);
}
const od = l("speak", function(t2, e, n) {
  return n.onTrigger((s) => {
    xa(s.value, t2, e);
  });
}), Ba = {}, Oa = async (...t2) => {
  const e = await Promise.allSettled(t2), n = e.filter((s) => s.status === "fulfilled").map((s) => s.value);
  return e.forEach((s, r) => {
    s.status === "rejected" && console.warn(`evalScope: module with index ${r} could not be loaded:`, s.reason);
  }), n.forEach((s) => {
    Object.entries(s).forEach(([r, o]) => {
      globalThis[r] = o, Ba[r] = o;
    });
  }), n;
};
function za(t2, e = {}) {
  const { wrapExpression: n = true, wrapAsync: s = true } = e;
  n && (t2 = `{${t2}}`), s && (t2 = `(async ()=>${t2})()`);
  const r = `"use strict";return (${t2})`;
  return Function(r)();
}
const Ea = async (t2, e, n) => {
  let s = {};
  if (e) {
    const c = e(t2, n);
    t2 = c.output, s = c;
  }
  return { mode: "javascript", pattern: await za(t2, { wrapExpression: !!e }), meta: s };
};
class Ma {
  constructor({ onTrigger: e, onToggle: n, getTime: s }) {
    this.started = false, this.cps = 0.5, this.getTime = s, this.time_at_last_tick_message = 0, this.collator = new tn({ getTargetClockTime: s }), this.onToggle = n, this.latency = 0.1, this.cycle = 0, this.id = Math.round(Date.now() * Math.random()), this.worker = new SharedWorker(new URL(
      /* @vite-ignore */
      "" + new URL("data:text/javascript;base64,KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2Z1bmN0aW9uIEwoKXtyZXR1cm4gcGVyZm9ybWFuY2Uubm93KCkqLjAwMX1sZXQgXz0wLHI9MCxvPS41O2NvbnN0IGg9bmV3IE1hcCxtPS4xLE09bmV3IEJyb2FkY2FzdENoYW5uZWwoInN0cnVkZWx0aWNrIiksYj0ocyxlKT0+e00ucG9zdE1lc3NhZ2Uoe3R5cGU6cyxwYXlsb2FkOmV9KX0sQz1FKEwsKHMsZSx0LG4pPT57Y29uc3QgaT1yKmUsZD1zLW4sYz1uK2QsdT1pKm8sbD1fK3UsZz1uLWMtZSxmPWUqbyxwPWwrZix5PWwrZypvO2IoInRpY2siLHtiZWdpbjpsLGVuZDpwLGNwczpvLHRpbWU6bixjeWNsZTp5fSkscisrfSxtKTtsZXQgaz0hMTtjb25zdCBJPXM9PntoLnNldChzLHtzdGFydGVkOiEwfSksIWsmJihDLnN0YXJ0KCksaz0hMCl9LEE9YXN5bmMgcz0+e2guc2V0KHMse3N0YXJ0ZWQ6ITF9KTtjb25zdCBlPUFycmF5LmZyb20oaC52YWx1ZXMoKSkuc29tZSh0PT50LnN0YXJ0ZWQpOyFrfHxlfHwoQy5zdG9wKCksdygwKSxrPSExKX0sdz1zPT57cj0wLF89c30sRD1zPT57Y29uc3R7dHlwZTplLHBheWxvYWQ6dH09cztzd2l0Y2goZSl7Y2FzZSJjcHNjaGFuZ2UiOntpZih0LmNwcyE9PW8pe2NvbnN0IG49ciptO189XytuKm8sbz10LmNwcyxyPTB9YnJlYWt9Y2FzZSJzZXRjeWNsZSI6e3codC5jeWNsZSk7YnJlYWt9Y2FzZSJ0b2dnbGUiOnt0LnN0YXJ0ZWQ/SShzLmlkKTpBKHMuaWQpO2JyZWFrfX19O3NlbGYub25jb25uZWN0PWZ1bmN0aW9uKHMpe2NvbnN0IGU9cy5wb3J0c1swXTtlLmFkZEV2ZW50TGlzdGVuZXIoIm1lc3NhZ2UiLGZ1bmN0aW9uKHQpe0QodC5kYXRhKX0pLGUuc3RhcnQoKX07ZnVuY3Rpb24gRShzLGUsdD0uMDUsbj0uMSxpPS4xKXtsZXQgZD0wLGM9MCx1PTEwKio0LGw9LjAxO2NvbnN0IGc9YT0+dD1hKHQpO2k9aXx8bi8yO2NvbnN0IGY9KCk9Pntjb25zdCBhPXMoKSxPPWErbitpO2ZvcihjPT09MCYmKGM9YStsKTtjPE87KWM9TWF0aC5yb3VuZChjKnUpL3UsYz49YSYmZShjLHQsZCxhKSxjPGEmJmNvbnNvbGUubG9nKCJUT08gTEFURSIsYyksYys9dCxkKyt9O2xldCBwO2NvbnN0IHk9KCk9PntUKCksZigpLHA9c2V0SW50ZXJ2YWwoZixuKjFlMyl9LFQ9KCk9PnAhPT12b2lkIDAmJmNsZWFySW50ZXJ2YWwocCk7cmV0dXJue3NldER1cmF0aW9uOmcsc3RhcnQ6eSxzdG9wOigpPT57ZD0wLGM9MCxUKCl9LHBhdXNlOigpPT5UKCksZHVyYXRpb246dCxpbnRlcnZhbDpuLGdldFBoYXNlOigpPT5jLG1pbkxhdGVuY3k6bH19fSkoKTsK", import.meta.url).href,
      import.meta.url
    )), this.worker.port.start(), this.channel = new BroadcastChannel("strudeltick");
    const r = (c) => {
      const { cps: u, begin: a, end: p, cycle: m2, time: y } = c;
      this.cps = u, this.cycle = m2;
      const _2 = this.collator.calculateOffset(y) + y;
      o(a, p, _2), this.time_at_last_tick_message = _2;
    }, o = (c, u, a) => {
      if (this.started === false)
        return;
      this.pattern.queryArc(c, u, { _cps: this.cps, cyclist: "neocyclist" }).forEach((m2) => {
        if (m2.hasOnset()) {
          const _2 = Rt(m2.whole.begin - this.cycle, this.cps) + a + this.latency, g = Rt(m2.duration, this.cps);
          e == null ? void 0 : e(m2, 0, g, this.cps, _2);
        }
      });
    };
    this.channel.onmessage = (c) => {
      if (!this.started)
        return;
      const { payload: u, type: a } = c.data;
      switch (a) {
        case "tick":
          r(u);
      }
    };
  }
  sendMessage(e, n) {
    this.worker.port.postMessage({ type: e, payload: n, id: this.id });
  }
  now() {
    const e = (this.getTime() - this.time_at_last_tick_message) * this.cps;
    return this.cycle + e;
  }
  setCps(e = 1) {
    this.sendMessage("cpschange", { cps: e });
  }
  setCycle(e) {
    this.sendMessage("setcycle", { cycle: e });
  }
  setStarted(e) {
    var _a2;
    this.sendMessage("toggle", { started: e }), this.started = e, (_a2 = this.onToggle) == null ? void 0 : _a2.call(this, e);
  }
  start() {
    E$2("[cyclist] start"), this.setStarted(true);
  }
  stop() {
    E$2("[cyclist] stop"), this.collator.reset(), this.setStarted(false);
  }
  setPattern(e, n = false) {
    this.pattern = e, n && !this.started && this.start();
  }
  log(e, n, s) {
    const r = s.filter((o) => o.hasOnset());
    console.log(`${e.toFixed(4)} - ${n.toFixed(4)} ${Array(r.length).fill("I").join("")}`);
  }
}
class Pa {
  constructor({
    interval: e,
    onTrigger: n,
    onToggle: s,
    onError: r,
    getTime: o,
    latency: c = 0.1,
    setInterval: u,
    clearInterval: a,
    beforeStart: p
  }) {
    this.started = false, this.beforeStart = p, this.cps = 0.5, this.num_ticks_since_cps_change = 0, this.lastTick = 0, this.lastBegin = 0, this.lastEnd = 0, this.getTime = o, this.num_cycles_at_cps_change = 0, this.seconds_at_cps_change, this.onToggle = s, this.latency = c, this.clock = ua(
      o,
      // called slightly before each cycle
      (m2, y, _2, g) => {
        this.num_ticks_since_cps_change === 0 && (this.num_cycles_at_cps_change = this.lastEnd, this.seconds_at_cps_change = m2), this.num_ticks_since_cps_change++;
        const q2 = this.num_ticks_since_cps_change * y * this.cps;
        try {
          const M2 = this.lastEnd;
          this.lastBegin = M2;
          const P2 = this.num_cycles_at_cps_change + q2;
          if (this.lastEnd = P2, this.lastTick = m2, m2 < g) {
            console.log("skip query: too late");
            return;
          }
          this.pattern.queryArc(M2, P2, { _cps: this.cps, cyclist: "cyclist" }).forEach((T2) => {
            if (T2.hasOnset()) {
              const J2 = (T2.whole.begin - this.num_cycles_at_cps_change) / this.cps + this.seconds_at_cps_change + c, Q2 = T2.duration / this.cps, V2 = J2 - m2;
              n == null ? void 0 : n(T2, V2, Q2, this.cps, J2), T2.value.cps !== void 0 && this.cps != T2.value.cps && (this.cps = T2.value.cps, this.num_ticks_since_cps_change = 0);
            }
          });
        } catch (M2) {
          Gt(M2), r == null ? void 0 : r(M2);
        }
      },
      e,
      // duration of each cycle
      0.1,
      0.1,
      u,
      a
    );
  }
  now() {
    if (!this.started)
      return 0;
    const e = this.getTime() - this.lastTick - this.clock.duration;
    return this.lastBegin + e * this.cps;
  }
  setStarted(e) {
    var _a2;
    this.started = e, (_a2 = this.onToggle) == null ? void 0 : _a2.call(this, e);
  }
  async start() {
    var _a2;
    if (await ((_a2 = this.beforeStart) == null ? void 0 : _a2.call(this)), this.num_ticks_since_cps_change = 0, this.num_cycles_at_cps_change = 0, !this.pattern)
      throw new Error("Scheduler: no pattern set! call .setPattern first.");
    E$2("[cyclist] start"), this.clock.start(), this.setStarted(true);
  }
  pause() {
    E$2("[cyclist] pause"), this.clock.pause(), this.setStarted(false);
  }
  stop() {
    E$2("[cyclist] stop"), this.clock.stop(), this.lastEnd = 0, this.setStarted(false);
  }
  async setPattern(e, n = false) {
    this.pattern = e, n && !this.started && await this.start();
  }
  setCps(e = 0.5) {
    this.cps !== e && (this.cps = e, this.num_ticks_since_cps_change = 0);
  }
  log(e, n, s) {
    const r = s.filter((o) => o.hasOnset());
    console.log(`${e.toFixed(4)} - ${n.toFixed(4)} ${Array(r.length).fill("I").join("")}`);
  }
}
let kt$1;
function id() {
  if (!kt$1)
    throw new Error("no time set! use setTime to define a time source");
  return kt$1();
}
function Ft(t2) {
  kt$1 = t2;
}
function cd({
  defaultOutput: t2,
  onEvalError: e,
  beforeEval: n,
  beforeStart: s,
  afterEval: r,
  getTime: o,
  transpiler: c,
  onToggle: u,
  editPattern: a,
  onUpdateState: p,
  sync: m2 = false,
  setInterval: y,
  clearInterval: _2,
  id: g,
  mondo: k2 = false
}) {
  const q2 = {
    schedulerError: void 0,
    evalError: void 0,
    code: "// LOADING",
    activeCode: "// LOADING",
    pattern: void 0,
    miniLocations: [],
    widgets: [],
    pending: false,
    started: false
  }, M2 = {
    id: g
  }, P2 = (b2) => {
    Object.assign(q2, b2), q2.isDirty = q2.code !== q2.activeCode, q2.error = q2.evalError || q2.schedulerError, p == null ? void 0 : p(q2);
  }, Y2 = {
    onTrigger: Ja({ defaultOutput: t2, getTime: o }),
    getTime: o,
    onToggle: (b2) => {
      P2({ started: b2 }), u == null ? void 0 : u(b2);
    },
    setInterval: y,
    clearInterval: _2,
    beforeStart: s
  }, T2 = m2 && typeof SharedWorker < "u" ? new Ma(Y2) : new Pa(Y2);
  let J2 = {}, Q2 = 0, V2;
  const Pt2 = function() {
    return J2 = {}, Q2 = 0, V2 = void 0, v$2;
  };
  function Jt2(b2) {
    return b2._Pattern ? b2.__pure : b2;
  }
  const jt2 = async (b2, A2 = true) => (b2 = (a == null ? void 0 : a(b2)) || b2, await T2.setPattern(b2, A2), b2);
  Ft(() => T2.now());
  const ve2 = () => T2.stop(), ke2 = () => T2.start(), qe = () => T2.pause(), Ae = () => T2.toggle(), yt = (b2) => (T2.setCps(Jt2(b2)), v$2), Nt = (b2) => (T2.setCps(Jt2(b2) / 60), v$2);
  let Z2 = [];
  const Se2 = function(b2) {
    return Z2.push(b2), v$2;
  }, Te2 = function(b2) {
    return V2 = b2, v$2;
  }, Ce2 = () => {
    f.prototype.p = function(A2) {
      return typeof A2 == "string" && (A2.startsWith("_") || A2.endsWith("_")) ? v$2 : (A2 === "$" && (A2 = `$${Q2}`, Q2++), J2[A2] = this, this);
    }, f.prototype.q = function(A2) {
      return v$2;
    };
    try {
      for (let A2 = 1; A2 < 10; ++A2)
        Object.defineProperty(f.prototype, `d${A2}`, {
          get() {
            return this.p(A2);
          },
          configurable: true
        }), Object.defineProperty(f.prototype, `p${A2}`, {
          get() {
            return this.p(A2);
          },
          configurable: true
        }), f.prototype[`q${A2}`] = v$2;
    } catch (A2) {
      console.warn("injectPatternMethods: error:", A2);
    }
    const b2 = l("cpm", function(A2, wt) {
      return wt._fast(A2 / 60 / T2.cps);
    });
    return Oa({
      all: Se2,
      each: Te2,
      hush: Pt2,
      cpm: b2,
      setCps: yt,
      setcps: yt,
      setCpm: Nt,
      setcpm: Nt
    });
  };
  return { scheduler: T2, evaluate: async (b2, A2 = true, wt = true) => {
    if (!b2)
      throw new Error("no code to evaluate");
    try {
      P2({ code: b2, pending: true }), await Ce2(), Ft(() => T2.now()), await (n == null ? void 0 : n({ code: b2 })), Z2 = [], wt && Pt2(), k2 && (b2 = `mondolang\`${b2}\``);
      let { pattern: O2, meta: gt2 } = await Ea(b2, c, M2);
      if (Object.keys(J2).length) {
        let F2 = [];
        for (const [bt, xe2] of Object.entries(J2))
          F2.push(xe2.withState((Be2) => Be2.setControls({ id: bt })));
        V2 && (F2 = F2.map((bt) => V2(bt))), O2 = B$2(...F2);
      } else V2 && (O2 = V2(O2));
      if (Z2.length)
        for (let F2 in Z2)
          O2 = Z2[F2](O2);
      if (!Yt(O2)) {
        const F2 = `got "${typeof evaluated}" instead of pattern`;
        throw new Error(F2 + (typeof evaluated == "function" ? ", did you forget to call a function?" : "."));
      }
      return E$2("[eval] code updated"), O2 = await jt2(O2, A2), P2({
        miniLocations: (gt2 == null ? void 0 : gt2.miniLocations) || [],
        widgets: (gt2 == null ? void 0 : gt2.widgets) || [],
        activeCode: b2,
        pattern: O2,
        evalError: void 0,
        schedulerError: void 0,
        pending: false
      }), r == null ? void 0 : r({ code: b2, pattern: O2, meta: gt2 }), O2;
    } catch (O2) {
      E$2(`[eval] error: ${O2.message}`, "error"), console.error(O2), P2({ evalError: O2, pending: false }), e == null ? void 0 : e(O2);
    }
  }, start: ke2, stop: ve2, pause: qe, setCps: yt, setPattern: jt2, setCode: (b2) => P2({ code: b2 }), toggle: Ae, state: q2 };
}
const Ja = ({ getTime: t2, defaultOutput: e }) => async (n, s, r, o, c) => {
  try {
    (!n.context.onTrigger || !n.context.dominantTrigger) && await e(n, s, r, o, c), n.context.onTrigger && await n.context.onTrigger(n, t2(), o, c);
  } catch (u) {
    Gt(u, "getTrigger");
  }
}, ud = function(t2, e = {}) {
  const n = document.getElementById("code"), s = "background-image:url(" + t2 + ");background-size:contain;";
  n.style = s;
  const { className: r } = n, o = (a, p) => {
    ({
      style: () => n.style = s + ";" + p,
      className: () => n.className = p + " " + r
    })[a]();
  }, c = Object.entries(e).filter(([a, p]) => typeof p == "function");
  Object.entries(e).filter(([a, p]) => typeof p == "string").forEach(([a, p]) => o(a, p)), c.length;
}, ad = () => {
  const t2 = document.getElementById("code");
  t2 && (t2.style = "");
};
E$2("🌀 @strudel/core loaded 🌀");
globalThis._strudelLoaded && console.warn(
  `@strudel/core was loaded more than once...
This might happen when you have multiple versions of strudel installed. 
Please check with "npm ls @strudel/core".`
);
globalThis._strudelLoaded = true;
const Core = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ClockCollator: tn,
  Cyclist: Pa,
  Fraction: h,
  Hap: C$4,
  Pattern: f,
  State: st$1,
  TimeSpan: x$2,
  __chooseWith: we$2,
  _brandBy: me$2,
  _fitslice: _n$1,
  _irand: ye$2,
  _keyDown: _e,
  _match: vn$1,
  _mod: ft$1,
  _morph: ee$2,
  _polymeterListSteps: qn$1,
  _retime: Lt$1,
  _slices: It$1,
  accelerate: Os,
  activeLabel: xi,
  ad: ju,
  add: Al,
  adsr: Ju,
  almostAlways: Lh,
  almostNever: Rh,
  always: Hh,
  amp: Ps,
  analyze: Us,
  anchor: Zi,
  and: Hl,
  apply: _p,
  applyN: bn,
  ar: Wu,
  arp: rl,
  arpWith: sl,
  arrange: al,
  as: ra,
  att: js,
  attack: Js,
  averageArray: Ne$1,
  backgroundImage: ud,
  band: Ol,
  bandf: rr,
  bandq: cr,
  bank: Gs,
  base64ToUnicode: Ye$2,
  bbexpr: Or$1,
  bbst: Er,
  beat: Df,
  begin: ar,
  berlin: xh,
  berlinWith: Aa,
  binary: mh,
  binaryN: ma,
  bind: ml,
  binshift: ru$1,
  bite: Tp,
  bjork: oe,
  blshift: Ml,
  bor: zl,
  bp: ir,
  bpa: po$1,
  bpattack: lo$1,
  bpd: go$1,
  bpdecay: wo$1,
  bpe: oo$1,
  bpenv: ro$1,
  bpf: or,
  bpq: ur,
  bpr: Oo$1,
  bprelease: Bo$1,
  bps: Ao$1,
  bpsustain: qo$1,
  brak: jp,
  brand: _h,
  brandBy: bh,
  brshift: Pl,
  bxor: El,
  bypass: hf,
  byteBeatExpression: Br,
  byteBeatStartTime: zr$1,
  calculateSteps: el,
  cat: at$1,
  ccn: Vu,
  ccv: Fu,
  ceil: Ql,
  ch: Pr,
  channel: Qr$1,
  channels: Mr$1,
  choose: wa,
  chooseCycles: ga,
  chooseIn: kh,
  chooseInWith: ge$2,
  chooseOut: qh,
  chooseWith: Mt,
  chop: Nf,
  chord: Ki,
  chorus: Qs,
  chunk: ef,
  chunkBack: rf,
  chunkBackInto: ff,
  chunkInto: lf,
  chunkback: of,
  chunkbackinto: pf,
  chunkinto: af,
  clamp: He$1,
  cleanupUi: ad,
  clip: yu,
  coarse: wr,
  code2hash: Ya,
  color: Eu,
  colour: Mu,
  comb: eu,
  compose: Da,
  compress: ep,
  compressSpan: np,
  compressor: qc,
  compressorAttack: Tc,
  compressorKnee: Ac,
  compressorRatio: Sc,
  compressorRelease: Cc,
  compressspan: sp,
  constant: Ga,
  contract: Bn$1,
  control: Hu,
  controls: Qf,
  cosine: rh,
  cosine2: oh,
  cpm: vp,
  cps: mu,
  createClock: ua,
  createParam: Bt$1,
  createParams: Pu,
  crush: yr,
  ctf: Xr$1,
  ctlNum: Du$1,
  ctranspose: Ei,
  curry: w$1,
  curve: vu,
  cut: Ur$1,
  cutoff: Kr$1,
  cycleToSeconds: Rt,
  dec: Ys,
  decay: Xs,
  degrade: zh,
  degradeBy: Oh,
  degradeByWith: Bh,
  degree: Oi,
  delay: Go$1,
  delayfb: Uo$1,
  delayfeedback: Qo$1,
  delayspeed: Xo$1,
  delaysync: ei,
  delayt: Zo$1,
  delaytime: Yo,
  deltaSlide: ku,
  det: ri,
  detune: si,
  dfb: Ko$1,
  dict: Yi,
  dictionary: Xi,
  dist: _c,
  distort: bc,
  distorttype: kc,
  distortvol: vc,
  div: Cl,
  djf: Do$1,
  drawLine: un,
  drive: Ar,
  drop: Tn$1,
  dry: ci,
  ds: Nu,
  dt: ti,
  duck: Sr,
  duckattack: xr,
  duckdepth: Tr$1,
  duckonset: Cr,
  dur: bu,
  duration: gu,
  e: Kf,
  early: kp,
  echo: Gp,
  echoWith: Hp,
  echowith: Vp,
  eish: nh,
  end: lr,
  enhance: Zc,
  eq: $l,
  eqt: Rl,
  errorLogger: Gt,
  euclid: Uf,
  euclidLegato: Zf,
  euclidLegatoRot: th,
  euclidRot: Yf,
  euclidish: eh,
  euclidrot: Xf,
  evalScope: Oa,
  evaluate: Ea,
  every: bp,
  expand: xn$1,
  expression: Pc,
  extend: Cn$1,
  fadeInTime: li,
  fadeOutTime: ai,
  fadeTime: ui,
  fanchor: Eo$1,
  fast: lp,
  fastChunk: uf,
  fastGap: rp,
  fastcat: W$3,
  fastchunk: cf,
  fastgap: op,
  fft: Ks,
  filter: gf,
  filterWhen: bf,
  firstOf: gp,
  fit: If,
  flatten: D$3,
  floor: Gl,
  fm: $s,
  fmattack: Ls,
  fmdecay: Hs,
  fmenv: Rs,
  fmh: Ns,
  fmi: Ws,
  fmrelease: Fs,
  fmsustain: Vs,
  fmvelocity: Ds,
  fmwave: Is,
  focus: ip,
  focusSpan: cp,
  focusspan: up,
  fractionalArgs: Qa,
  frameRate: cu$1,
  frames: uu$1,
  freeze: Qc,
  freq: pi,
  freqToMidi: Pe$1,
  fromBipolar: Kl,
  fshift: jc,
  fshiftnote: Nc,
  fshiftphase: Wc,
  ftype: zo$1,
  func: Fl,
  gain: Es,
  gap: ct$2,
  gat: Ai,
  gate: qi,
  getControlName: se,
  getCurrentKeyboardState: sn,
  getEventOffsetMs: La,
  getFreq: Je$1,
  getFrequency: Fa,
  getPerformanceTimeSeconds: tl,
  getPlayableNoteValue: Va,
  getSoundIndex: Ha,
  getTime: id,
  getTrigger: Ja,
  grow: kf,
  gt: jl,
  gte: Wl,
  harmonic: Mi,
  hash2code: Za,
  hbrick: ou,
  hcutoff: $o$1,
  hold: sr,
  hours: au,
  hp: Lo$1,
  hpa: ao$1,
  hpattack: uo$1,
  hpd: yo$1,
  hpdecay: mo$1,
  hpe: so$1,
  hpenv: no$1,
  hpf: Ro$1,
  hpq: Ho$1,
  hpr: xo$1,
  hprelease: Co$1,
  hps: ko$1,
  hpsustain: vo$1,
  hresonance: Io$1,
  hsl: wf,
  hsla: yf,
  hurry: fp,
  id: et$2,
  imag: Yc,
  inhabit: td,
  inhabitmod: nd,
  innerBind: yl,
  inside: mp,
  inv: Mp,
  invert: Ep,
  ir: lc,
  irand: vh,
  irbegin: hc,
  iresponse: pc,
  irspeed: fc,
  isControlName: $n$1,
  isNote: qt,
  isNoteWithOctave: $a,
  isPattern: Yt,
  isaw: Ot$1,
  isaw2: ue$2,
  iter: Xp,
  iterBack: Yp,
  iterback: Zp,
  itri: ah,
  itri2: lh,
  jux: Ip,
  juxBy: Rp,
  juxby: Lp,
  kcutoff: Lc,
  keep: kl,
  keepif: ql,
  keyAlias: nn,
  keyDown: Fh,
  krush: Rc,
  label: Bi,
  lastOf: wp,
  late: wn$1,
  lbrick: iu,
  legato: wu,
  leslie: Si,
  lfo: Su,
  linger: Cp,
  listRange: ht$1,
  lock: ni,
  logKey: Dt,
  logger: E$2,
  loop: pr,
  loopAt: Rf,
  loopAtCps: Hf,
  loopBegin: fr,
  loopEnd: dr,
  loopat: Lf,
  loopatcps: Vf,
  loopb: hr,
  loope: mr,
  lp: Zr$1,
  lpa: co$1,
  lpattack: io$1,
  lpd: ho$1,
  lpdecay: fo$1,
  lpe: eo$1,
  lpenv: to$1,
  lpf: Yr$1,
  lpq: Fo$1,
  lpr: To$1,
  lprelease: So$1,
  lps: _o$1,
  lpsustain: bo$1,
  lrate: Ti,
  lsize: Ci,
  lt: Jl,
  lte: Nl,
  mapArgs: Ut$1,
  mask: pl,
  midi2note: Ia,
  midiToFreq: nt$2,
  midibend: Zu,
  midichan: $u,
  midicmd: Iu,
  midimap: Ru,
  midiport: Lu,
  miditouch: ta,
  minutes: lu,
  mod: xl,
  mode: nc$1,
  morph: Gf,
  mouseX: dh,
  mouseY: fh,
  mousex: hh,
  mousey: ph,
  mtranspose: zi,
  mul: Tl,
  n: xs,
  nanFallback: We$1,
  ne: Ll,
  net: Il,
  never: Ih,
  noise: jo$1,
  note: Bs,
  noteToMidi: pt$1,
  nothing: R$2,
  nrpnn: Gu,
  nrpv: Qu$1,
  nudge: ji,
  numeralArgs: $$2,
  objectMap: Ze$2,
  octave: Ni,
  octaveR: Ji,
  octaves: ec$1,
  octer: Ic,
  octersub: Hc,
  octersubsub: Vc,
  off: Jp,
  offset: tc$1,
  often: Wh,
  or: Vl,
  orbit: Wi,
  oschost: na,
  oscport: sa,
  outerBind: wl,
  outside: yp,
  overgain: $i,
  overshape: Ri,
  pace: kn$1,
  pairs: Ie$1,
  palindrome: $p,
  pan: Li,
  panchor: ki,
  panorient: Fi,
  panspan: Ii,
  pansplay: Hi,
  panwidth: Vi,
  parseFractional: Le$1,
  parseNumeral: Qt$1,
  partials: tu,
  patt: hi,
  pattack: fi,
  pcurve: vi,
  pdec: mi,
  pdecay: di,
  penv: _i,
  perlin: Ch,
  perlinWith: ka,
  ph: $r,
  phasdp: Gr$1,
  phaser: Rr,
  phasercenter: Hr$1,
  phaserdepth: Fr,
  phaserrate: Wr$1,
  phasersweep: Lr,
  phc: Vr$1,
  phd: Dr,
  phs: Ir,
  pick: Sa,
  pickF: Dh,
  pickOut: Qh,
  pickReset: Yh,
  pickRestart: Kh,
  pickSqueeze: ed,
  pickmod: Ca,
  pickmodF: Gh,
  pickmodOut: Uh,
  pickmodReset: Zh,
  pickmodRestart: Xh,
  pickmodSqueeze: sd,
  pipe: Re$1,
  pitchJump: qu,
  pitchJumpTime: Au$1,
  ply: ap,
  plyForEach: Kp,
  plyWith: Up,
  pm: cl,
  polyBind: _l,
  polyTouch: ea,
  polymeter: xt,
  polyrhythm: ol,
  postgain: Ms,
  pow: Bl,
  pr: il,
  prel: bi,
  prelease: gi,
  press: Wp,
  pressBy: Np,
  progNum: Uu,
  psus: wi,
  psustain: yi,
  pure: z$1,
  pw: Jr$1,
  pwrate: jr,
  pwsweep: Nr,
  rand: L$2,
  rand2: gh,
  randcat: Ah,
  randrun: ya,
  range: Xl,
  range2: Zl,
  rangex: Yl,
  rarely: $h,
  rate: Di,
  ratio: tp,
  rdim: cc$1,
  real: Xc,
  ref: Ff,
  register: l,
  registerControl: i$1,
  reify: d$1,
  rel: nr,
  release: er,
  removeUndefineds: it$2,
  repeatCycles: tf,
  repeatTime: Tu,
  repl: cd,
  replicate: vf,
  resonance: Vo$1,
  rev: gn$1,
  rfade: ac,
  rib: mf,
  ribbon: df,
  ring: Fc,
  ringdf: Gc,
  ringf: Dc,
  rlp: oc$1,
  room: sc$1,
  roomdim: ic,
  roomfade: uc,
  roomlp: rc,
  roomsize: dc,
  rotate: $e$1,
  round: Dl,
  rsize: wc,
  run: da,
  s: Rn$1,
  s_add: Bf,
  s_alt: Sf,
  s_cat: Af,
  s_contract: Mf,
  s_expand: zf,
  s_extend: Ef,
  s_polymeter: Tf,
  s_sub: Of,
  s_taper: Cf,
  s_taperlist: xf,
  s_tour: Pf,
  s_zip: Jf,
  saw: mt$1,
  saw2: ce$2,
  scram: su,
  scramble: wh,
  scrub: oa,
  seconds: pu,
  seg: Bp,
  segment: xp,
  semitone: Qi,
  seq: yn,
  seqPLoop: ll,
  sequence: G$3,
  sequenceP: fn$1,
  set: vl,
  setStringParser: nl,
  setTime: Ft,
  shape: gc,
  shrink: zn$1,
  shrinklist: On$1,
  shuffle: yh,
  signal: I$3,
  silence: v$2,
  sine: aa,
  sine2: ae$1,
  size: mc,
  slice: Jn$1,
  slide: Gi,
  slow: hp,
  slowChunk: sf,
  slowcat: K$1,
  slowcatPrime: Zt,
  slowchunk: nf,
  smear: nu$1,
  sol2note: Ua,
  someCycles: Nh,
  someCyclesBy: jh,
  sometimes: Jh,
  sometimesBy: Ph,
  songPtr: fu,
  sound: Ln$1,
  source: Ts,
  sparsity: dp,
  speak: od,
  speed: ne$1,
  splice: $f,
  splitAt: Kt$1,
  spread: ii,
  square: la,
  square2: ih,
  squeeze: rd,
  squeezeBind: gl,
  squiz: Oc,
  src: Cs,
  stack: B$2,
  stackBy: ul,
  stackCentre: mn,
  stackLeft: hn,
  stackRight: dn,
  steady: sh,
  stepBind: bl,
  stepalt: An$1,
  stepcat: N$4,
  steps: jf,
  stepsPerOctave: Pi,
  stretch: xc,
  striate: Wf,
  stringifyValues: Xt,
  struct: fl,
  strudelScope: Ba,
  stut: Qp,
  stutWith: Fp,
  stutwith: Dp,
  sub: Sl,
  superimpose: hl,
  sus: tr,
  sustain: Zs,
  sustainpedal: Jc,
  swing: zp,
  swingBy: Op,
  sysex: Ku,
  sysexdata: Yu,
  sysexid: Xu,
  sz: yc,
  take: Sn$1,
  time: le,
  timeCat: Pn$1,
  timecat: qf,
  toBipolar: Ul,
  tokenizeNote: ze$1,
  tour: En$1,
  tremolo: gr,
  tremolodepth: _r,
  tremolophase: kr,
  tremoloshape: qr,
  tremoloskew: vr,
  tremolosync: br,
  tri: ch,
  tri2: uh,
  triode: $c,
  tsdelay: Kc,
  uid: hu,
  undegrade: Mh,
  undegradeBy: Eh,
  unicodeToBase64: Xe$2,
  uniq: Ka,
  uniqsort: Xa,
  uniqsortr: Ke$2,
  unison: oi,
  unit: Bc,
  v: Jo$1,
  val: du$1,
  valueToMidi: Ra,
  velocity: zs,
  vib: Mo$1,
  vibmod: No$1,
  vibrato: Po$1,
  vmod: Wo$1,
  voice: Ui,
  vowel: zc,
  warp: os,
  warpatt: us$1,
  warpattack: cs,
  warpdc: gs,
  warpdec: ls,
  warpdecay: as,
  warpdepth: ys,
  warpenv: As,
  warpmode: _s,
  warprate: ms,
  warprel: ds,
  warprelease: hs,
  warpshape: ws,
  warpskew: bs,
  warpsus: fs,
  warpsustain: ps,
  warpsync: Ss,
  waveloss: Ec,
  wavetablePhaseRand: qs,
  wavetablePosition: Hn$1,
  wavetableWarp: is,
  wavetableWarpMode: vs,
  wchoose: Sh,
  wchooseCycles: _a,
  when: Pp,
  whenKey: Vh,
  withValue: dl,
  within: _f,
  wrandcat: Th,
  wt: In$1,
  wtatt: Dn$1,
  wtattack: Fn$1,
  wtdc: ss,
  wtdec: Qn$1,
  wtdecay: Gn$1,
  wtdepth: es,
  wtenv: Vn$1,
  wtphaserand: ks,
  wtrate: Zn,
  wtrel: Yn$1,
  wtrelease: Xn,
  wtshape: ns,
  wtskew: rs,
  wtsus: Kn$1,
  wtsustain: Un$1,
  wtsync: ts,
  xfade: jn$1,
  xsdelay: Uc,
  zcrush: Bu,
  zdelay: Ou,
  zip: Mn$1,
  zipWith: At,
  zmod: xu,
  znoise: Cu$1,
  zoom: qp,
  zoomArc: Ap,
  zoomarc: Sp,
  zrand: _u,
  zzfx: zu
}, Symbol.toStringTag, { value: "Module" }));
const Z$2 = (t2 = "test-canvas", e) => {
  let { contextType: n = "2d", pixelated: o = false, pixelRatio: a = window.devicePixelRatio } = e || {}, r = document.querySelector("#" + t2);
  if (!r) {
    r = document.createElement("canvas"), r.id = t2, r.width = window.innerWidth * a, r.height = window.innerHeight * a, r.style = "pointer-events:none;width:100%;height:100%;position:fixed;top:0;left:0", o && (r.style.imageRendering = "pixelated"), document.body.prepend(r);
    let l2;
    window.addEventListener("resize", () => {
      l2 && clearTimeout(l2), l2 = setTimeout(() => {
        r.width = window.innerWidth * a, r.height = window.innerHeight * a;
      }, 200);
    });
  }
  return r.getContext(n, { willReadFrequently: true });
};
let $$1 = {};
function pe$1(t2) {
  $$1[t2] !== void 0 && (cancelAnimationFrame($$1[t2]), delete $$1[t2]);
}
function De(t2) {
  Object.keys($$1).forEach((e) => (!t2 || e.startsWith(t2)) && pe$1(e));
}
let R$1 = {};
f.prototype.draw = function(t2, e) {
  if (typeof window > "u")
    return this;
  let { id: n = 1, lookbehind: o = 0, lookahead: a = 0 } = e, r = Math.max(id(), 0);
  pe$1(n), o = Math.abs(o), R$1[n] = (R$1[n] || []).filter((g) => !g.isInFuture(r));
  let l2 = this.queryArc(r, r + a).filter((g) => g.hasOnset());
  R$1[n] = R$1[n].concat(l2);
  let f2;
  const i2 = () => {
    const g = id(), u = g + a;
    R$1[n] = R$1[n].filter((d2) => d2.isInNearPast(o, g));
    let c = Math.max(f2 || u, u - 1 / 10);
    const b2 = this.queryArc(c, u).filter((d2) => d2.hasOnset());
    R$1[n] = R$1[n].concat(b2), f2 = u, t2(R$1[n], g, u, this), $$1[n] = requestAnimationFrame(i2);
  };
  return $$1[n] = requestAnimationFrame(i2), this;
};
const Ke$1 = (t2 = true, e) => {
  const n = Z$2();
  t2 && n.clearRect(0, 0, n.canvas.width, n.canvas.height), De(e);
};
f.prototype.onPaint = function(t2) {
  return this.withState((e) => (e.controls.painters || (e.controls.painters = []), e.controls.painters.push(t2), e));
};
f.prototype.getPainters = function() {
  let t2 = [];
  return this.queryArc(0, 0, { painters: t2 }), t2;
};
class $e {
  constructor(e, n) {
    this.onFrame = e, this.onError = n;
  }
  start() {
    const e = this;
    let n = requestAnimationFrame(function o(a) {
      try {
        e.onFrame(a);
      } catch (r) {
        e.onError(r);
      }
      n = requestAnimationFrame(o);
    });
    e.cancel = () => {
      cancelAnimationFrame(n);
    };
  }
  stop() {
    this.cancel && this.cancel();
  }
}
let Qe$1 = class Qe2 {
  constructor(e, n) {
    this.visibleHaps = [], this.lastFrame = null, this.drawTime = n, this.painters = [], this.framer = new $e(
      () => {
        if (!this.scheduler) {
          console.warn("Drawer: no scheduler");
          return;
        }
        const o = Math.abs(this.drawTime[0]), a = this.drawTime[1], r = this.scheduler.now() + a;
        if (this.lastFrame === null) {
          this.lastFrame = r;
          return;
        }
        const l2 = this.scheduler.pattern.queryArc(Math.max(this.lastFrame, r - 1 / 10), r);
        this.lastFrame = r, this.visibleHaps = (this.visibleHaps || []).filter((i2) => i2.whole && i2.endClipped >= r - o - a).concat(l2.filter((i2) => i2.hasOnset()));
        const f2 = r - a;
        e(this.visibleHaps, f2, this, this.painters);
      },
      (o) => {
        console.warn("draw error", o);
      }
    );
  }
  setDrawTime(e) {
    this.drawTime = e;
  }
  invalidate(e = this.scheduler, n) {
    if (!e)
      return;
    n = n ?? e.now(), this.scheduler = e;
    let [o, a] = this.drawTime;
    const [r, l2] = [Math.max(n, 0), n + a + 0.1];
    this.visibleHaps = this.visibleHaps.filter((i2) => {
      var _a2;
      return ((_a2 = i2.whole) == null ? void 0 : _a2.begin) < n;
    }), this.painters = [];
    const f2 = e.pattern.queryArc(r, l2, { painters: this.painters });
    this.visibleHaps = this.visibleHaps.concat(f2);
  }
  start(e) {
    this.scheduler = e, this.invalidate(), this.framer.start();
  }
  stop() {
    this.framer && this.framer.stop();
  }
};
function Ue$1(t2) {
  return typeof window > "u" ? "#fff" : getComputedStyle(document.documentElement).getPropertyValue(t2);
}
let ye$1 = {
  background: "#222",
  foreground: "#75baff",
  caret: "#ffcc00",
  selection: "rgba(128, 203, 196, 0.5)",
  selectionMatch: "#036dd626",
  lineHighlight: "#00000050",
  gutterBackground: "transparent",
  gutterForeground: "#8a919966"
};
function W$2() {
  return ye$1;
}
function Ze$1(t2) {
  ye$1 = t2;
}
let fe$1 = "#22222210";
f.prototype.animate = function({ callback: t2, sync: e = false, smear: n = 0.5 } = {}) {
  window.frame && cancelAnimationFrame(window.frame);
  const o = Z$2();
  let { clientWidth: a, clientHeight: r } = o.canvas;
  a *= window.devicePixelRatio, r *= window.devicePixelRatio;
  let l2 = n === 0 ? "99" : Number((1 - n) * 100).toFixed(0);
  l2 = l2.length === 1 ? `0${l2}` : l2, fe$1 = `#200010${l2}`;
  const f2 = (i2) => {
    let g;
    i2 = Math.round(i2), g = this.slow(1e3).queryArc(i2, i2), o.fillStyle = fe$1, o.fillRect(0, 0, a, r), g.forEach((u) => {
      let { x: c, y: b2, w: d2, h: w2, s: p, r: k2, angle: h2 = 0, fill: S2 = "darkseagreen" } = u.value;
      if (d2 *= a, w2 *= r, k2 !== void 0 && h2 !== void 0) {
        const v2 = h2 * 2 * Math.PI, [y, P2] = [(a - d2) / 2, (r - w2) / 2];
        c = y + Math.cos(v2) * k2 * y, b2 = P2 + Math.sin(v2) * k2 * P2;
      } else
        c *= a - d2, b2 *= r - w2;
      const A2 = { ...u.value, x: c, y: b2, w: d2, h: w2 };
      o.fillStyle = S2, p === "rect" ? o.fillRect(c, b2, d2, w2) : p === "ellipse" && (o.beginPath(), o.ellipse(c + d2 / 2, b2 + w2 / 2, d2 / 2, w2 / 2, 0, 0, 2 * Math.PI), o.fill()), t2 && t2(o, A2, u);
    }), window.frame = requestAnimationFrame(f2);
  };
  return window.frame = requestAnimationFrame(f2), v$2;
};
const { x: we$1, y: xe$1, w: et$1, h: tt$1, angle: nt$1, r: rt$1, fill: at, smear: ot$1 } = Pu("x", "y", "w", "h", "angle", "r", "fill", "smear"), it$1 = l("rescale", function(t2, e) {
  return e.mul(we$1(t2).w(t2).y(t2).h(t2));
}), lt$1 = l("moveXY", function(t2, e, n) {
  return n.add(we$1(t2).y(e));
}), st = l("zoomIn", function(t2, e) {
  const n = z$1(1).sub(t2).div(2);
  return e.rescale(t2).move(n, n);
}), ce$1 = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkgrey: "#a9a9a9",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkslategrey: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dimgrey: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  grey: "#808080",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightgrey: "#d3d3d3",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightslategrey: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  slategrey: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32"
};
function ft(t2) {
  return t2 = t2.toLowerCase(), t2[0] === "#" ? de(t2) : ce$1[t2] !== void 0 ? de(ce$1[t2]) : -1;
}
function de(t2) {
  return t2 = t2.slice(1), parseInt(t2, 16);
}
const G$2 = (t2, e, n) => t2 * (n - e) + e, he$1 = (t2) => {
  let { value: e } = t2;
  typeof t2.value != "object" && (e = { value: e });
  let { note: n, n: o, freq: a, s: r } = e;
  if (a)
    return Pe$1(a);
  if (n = n ?? o, typeof n == "string")
    try {
      return pt$1(n);
    } catch {
      return 0;
    }
  return typeof n == "number" ? n : r ? "_" + r : e;
};
f.prototype.pianoroll = function(t2 = {}) {
  let { cycles: e = 4, playhead: n = 0.5, overscan: o = 0, hideNegative: a = false, ctx: r = Z$2(), id: l2 = 1 } = t2, f2 = -e * n, i2 = e * (1 - n);
  const g = (u, c) => (!a || u.whole.begin >= 0) && u.isWithinTime(c + f2, c + i2);
  return this.draw(
    (u, c) => {
      ee$1({
        ...t2,
        time: c,
        ctx: r,
        haps: u.filter((b2) => g(b2, c))
      });
    },
    {
      lookbehind: f2 - o,
      lookahead: i2 + o,
      id: l2
    }
  ), this;
};
function ct$1(t2) {
  return Yt(t2) ? t2.pianoroll() : (e) => e.pianoroll(t2);
}
function ee$1({
  time: t2,
  haps: e,
  cycles: n = 4,
  playhead: o = 0.5,
  flipTime: a = 0,
  flipValues: r = 0,
  hideNegative: l2 = false,
  inactive: f2 = W$2().foreground,
  active: i2 = W$2().foreground,
  background: g = "transparent",
  smear: u = 0,
  playheadColor: c = W$2().foreground,
  minMidi: b2 = 10,
  maxMidi: d2 = 90,
  autorange: w2 = 0,
  timeframe: p,
  fold: k2 = 1,
  vertical: h2 = 0,
  labels: S2 = false,
  fill: A2 = 1,
  fillActive: v2 = false,
  strokeActive: y = true,
  stroke: P2,
  hideInactive: H2 = 0,
  colorizeInactive: q2 = 1,
  fontFamily: C3,
  ctx: s,
  id: _2
} = {}) {
  const T2 = s.canvas.width, I2 = s.canvas.height;
  let z2 = -n * o, j2 = n * (1 - o);
  _2 && (e = e.filter((m2) => m2.hasTag(_2))), p && (console.warn("timeframe is deprecated! use from/to instead"), z2 = 0, j2 = p);
  const N2 = h2 ? I2 : T2, E2 = h2 ? T2 : I2;
  let L3 = h2 ? [N2, 0] : [0, N2];
  const J2 = j2 - z2, te2 = h2 ? [0, E2] : [E2, 0];
  let K2 = d2 - b2 + 1, D2 = E2 / K2, Q2 = [];
  a && L3.reverse(), r && te2.reverse();
  const { min: ke2, max: Pe2, values: Te2 } = e.reduce(
    ({ min: m2, max: F2, values: X2 }, Y2) => {
      const M2 = he$1(Y2);
      return {
        min: M2 < m2 ? M2 : m2,
        max: M2 > F2 ? M2 : F2,
        values: X2.includes(M2) ? X2 : [...X2, M2]
      };
    },
    { min: 1 / 0, max: -1 / 0, values: [] }
  );
  w2 && (b2 = ke2, d2 = Pe2, K2 = d2 - b2 + 1), Q2 = Te2.sort(
    (m2, F2) => typeof m2 == "number" && typeof F2 == "number" ? m2 - F2 : typeof m2 == "number" ? 1 : String(m2).localeCompare(String(F2))
  ), D2 = k2 ? E2 / Q2.length : E2 / K2, s.fillStyle = g, s.globalAlpha = 1, u || (s.clearRect(0, 0, T2, I2), s.fillRect(0, 0, T2, I2)), e.forEach((m2) => {
    var _a2;
    const F2 = m2.whole.begin <= t2 && m2.endClipped > t2;
    let X2 = P2 ?? (y && F2), Y2 = !F2 && A2 || F2 && v2;
    if (H2 && !F2)
      return;
    let M2 = (_a2 = m2.value) == null ? void 0 : _a2.color;
    i2 = M2 || i2, f2 = q2 && M2 || f2, M2 = F2 ? i2 : f2, s.fillStyle = Y2 ? M2 : "transparent", s.strokeStyle = M2;
    const { velocity: Ae = 1, gain: qe = 1 } = m2.value || {};
    s.globalAlpha = Ae * qe;
    const Fe2 = (m2.whole.begin - (a ? j2 : z2)) / J2, ne2 = G$2(Fe2, ...L3);
    let B2 = G$2(m2.duration / J2, 0, N2);
    const re2 = he$1(m2), Me2 = k2 ? Q2.indexOf(re2) / Q2.length : (Number(re2) - b2) / K2, ae2 = G$2(Me2, ...te2);
    let oe2 = 0;
    const ie2 = G$2(t2 / J2, ...L3);
    let V2;
    if (h2 ? V2 = [
      ae2 + 1 - (r ? D2 : 0),
      // x
      N2 - ie2 + ne2 + oe2 + 1 - (a ? 0 : B2),
      // y
      D2 - 2,
      // width
      B2 - 2
      // height
    ] : V2 = [
      ne2 - ie2 + oe2 + 1 - (a ? B2 : 0),
      // x
      ae2 + 1 - (r ? 0 : D2),
      // y
      B2 - 2,
      // widith
      D2 - 2
      // height
    ], X2 && s.strokeRect(...V2), Y2 && s.fillRect(...V2), S2) {
      const Se2 = m2.value.note ?? m2.value.s + (m2.value.n ? `:${m2.value.n}` : ""), { label: le2, activeLabel: Ce2 } = m2.value, He2 = (F2 && Ce2 || le2) ?? Se2;
      let Ie2 = h2 ? B2 : D2 * 0.75;
      s.font = `${Ie2}px ${C3 || "monospace"}`, s.fillStyle = /* isActive &&  */
      Y2 ? "black" : M2, s.textBaseline = "top", s.fillText(He2, ...V2);
    }
  }), s.globalAlpha = 1;
  const U2 = G$2(-z2 / J2, ...L3);
  return s.strokeStyle = c, s.beginPath(), h2 ? (s.moveTo(0, U2), s.lineTo(E2, U2)) : (s.moveTo(U2, 0), s.lineTo(U2, E2)), s.stroke(), this;
}
function ve$1(t2, e = {}) {
  let [n, o] = t2;
  n = Math.abs(n);
  const a = o + n, r = a !== 0 ? n / a : 0;
  return { fold: 1, ...e, cycles: a, playhead: r };
}
const je = (t2 = {}) => (e, n, o, a) => ee$1({ ctx: e, time: n, haps: o, ...ve$1(a, t2) });
f.prototype.punchcard = function(t2) {
  return this.onPaint(je(t2));
};
f.prototype.wordfall = function(t2) {
  return this.punchcard({ vertical: 1, labels: 1, stroke: 0, fillActive: 1, active: "white", ...t2 });
};
function dt$1(t2) {
  const { drawTime: e, ...n } = t2;
  ee$1({ ...ve$1(e), ...n });
}
function Xe$1(t2, e, n, o) {
  const a = (t2 - 90) * Math.PI / 180;
  return [n + Math.cos(a) * e, o + Math.sin(a) * e];
}
const ue$1 = (t2, e, n, o, a = 0) => Xe$1((t2 + a) * 360, e * t2, n, o);
function me$1(t2) {
  let {
    ctx: e,
    from: n = 0,
    to: o = 3,
    margin: a = 50,
    cx: r = 100,
    cy: l2 = 100,
    rotate: f2 = 0,
    thickness: i2 = a / 2,
    color: g = W$2().foreground,
    cap: u = "round",
    stretch: c = 1,
    fromOpacity: b2 = 1,
    toOpacity: d2 = 1
  } = t2;
  n *= c, o *= c, f2 *= c, e.lineWidth = i2, e.lineCap = u, e.strokeStyle = g, e.globalAlpha = b2, e.beginPath();
  let [w2, p] = ue$1(n, a, r, l2, f2);
  e.moveTo(w2, p);
  const k2 = 1 / 60;
  let h2 = n;
  for (; h2 <= o; ) {
    const [S2, A2] = ue$1(h2, a, r, l2, f2);
    e.globalAlpha = (h2 - n) / (o - n) * d2, e.lineTo(S2, A2), h2 += k2;
  }
  e.stroke();
}
function Ye$1(t2) {
  let {
    stretch: e = 1,
    size: n = 80,
    thickness: o = n / 2,
    cap: a = "butt",
    // round butt squar,
    inset: r = 3,
    // start angl,
    playheadColor: l2 = "#ffffff",
    playheadLength: f2 = 0.02,
    playheadThickness: i2 = o,
    padding: g = 0,
    steady: u = 1,
    activeColor: c = W$2().foreground,
    inactiveColor: b2 = W$2().gutterForeground,
    colorizeInactive: d2 = 0,
    fade: w2 = true,
    // logSpiral = true,
    ctx: p,
    time: k2,
    haps: h2,
    drawTime: S2,
    id: A2
  } = t2;
  A2 && (h2 = h2.filter((T2) => T2.hasTag(A2)));
  const [v2, y] = [p.canvas.width, p.canvas.height];
  p.clearRect(0, 0, v2 * 2, y * 2);
  const [P2, H2] = [v2 / 2, y / 2], q2 = {
    margin: n / e,
    cx: P2,
    cy: H2,
    stretch: e,
    cap: a,
    thickness: o
  }, C3 = {
    ...q2,
    thickness: i2,
    from: r - f2,
    to: r,
    color: l2
  }, [s] = S2, _2 = u * k2;
  h2.forEach((T2) => {
    var _a2;
    const I2 = T2.whole.begin <= k2 && T2.endClipped > k2, z2 = T2.whole.begin - k2 + r, j2 = T2.endClipped - k2 + r - g, N2 = ((_a2 = T2.value) == null ? void 0 : _a2.color) || c, E2 = d2 || I2 ? N2 : b2, L3 = w2 ? 1 - Math.abs((T2.whole.begin - k2) / s) : 1;
    me$1({
      ctx: p,
      ...q2,
      from: z2,
      to: j2,
      rotate: _2,
      color: E2,
      fromOpacity: L3,
      toOpacity: L3
    });
  }), me$1({
    ctx: p,
    ...C3,
    rotate: _2
  });
}
f.prototype.spiral = function(t2 = {}) {
  return this.onPaint((e, n, o, a) => Ye$1({ ctx: e, time: n, haps: o, drawTime: a, ...t2 }));
};
const Be$1 = nt$2(36), ge$1 = (t2, e, n, o) => {
  o = o * Math.PI * 2;
  const a = Math.sin(o) * n + t2, r = Math.cos(o) * n + e;
  return [a, r];
}, be$1 = (t2, e) => 0.5 - Math.log2(t2 / e) % 1;
function Ve$1({
  haps: t2,
  ctx: e,
  id: n,
  hapcircles: o = 1,
  circle: a = 0,
  edo: r = 12,
  root: l2 = Be$1,
  thickness: f2 = 3,
  hapRadius: i2 = 6,
  mode: g = "flake",
  margin: u = 10
} = {}) {
  const c = g === "polygon", b2 = g === "flake", d2 = e.canvas.width, w2 = e.canvas.height;
  e.clearRect(0, 0, d2, w2);
  const p = W$2().foreground, h2 = Math.min(d2, w2) / 2 - f2 / 2 - i2 - u, S2 = d2 / 2, A2 = w2 / 2;
  n && (t2 = t2.filter((y) => y.hasTag(n))), e.strokeStyle = p, e.fillStyle = p, e.globalAlpha = 1, e.lineWidth = f2, a && (e.beginPath(), e.arc(S2, A2, h2, 0, 2 * Math.PI), e.stroke()), r && (Array.from({ length: r }, (y, P2) => {
    const H2 = be$1(l2 * Math.pow(2, P2 / r), l2), [q2, C3] = ge$1(S2, A2, h2, H2);
    e.beginPath(), e.arc(q2, C3, i2, 0, 2 * Math.PI), e.fill();
  }), e.stroke());
  let v2 = [];
  e.lineWidth = i2, t2.forEach((y) => {
    let P2;
    try {
      P2 = Fa(y);
    } catch {
      return;
    }
    const H2 = be$1(P2, l2), [q2, C3] = ge$1(S2, A2, h2, H2), s = y.value.color || p;
    e.strokeStyle = s, e.fillStyle = s;
    const { velocity: _2 = 1, gain: T2 = 1 } = y.value || {}, I2 = _2 * T2;
    e.globalAlpha = I2, v2.push([q2, C3, H2, s, I2]), e.beginPath(), o && (e.moveTo(q2 + i2, C3), e.arc(q2, C3, i2, 0, 2 * Math.PI), e.fill()), b2 && (e.moveTo(S2, A2), e.lineTo(q2, C3)), e.stroke();
  }), e.strokeStyle = p, e.globalAlpha = 1, c && v2.length && (v2 = v2.sort((y, P2) => y[2] - P2[2]), e.beginPath(), e.moveTo(v2[0][0], v2[0][1]), v2.forEach(([y, P2, H2, q2, C3]) => {
    e.strokeStyle = q2, e.globalAlpha = C3, e.lineTo(y, P2);
  }), e.lineTo(v2[0][0], v2[0][1]), e.stroke());
}
f.prototype.pitchwheel = function(t2 = {}) {
  let { ctx: e = Z$2(), id: n = 1 } = t2;
  return this.tag(n).onPaint(
    (o, a, r) => Ve$1({
      ...t2,
      ctx: e,
      haps: r.filter((l2) => l2.isActive(a)),
      id: n
    })
  );
};
const Draw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Drawer: Qe$1,
  Framer: $e,
  __pianoroll: ee$1,
  angle: nt$1,
  cleanupDraw: Ke$1,
  colorMap: ce$1,
  convertColorToNumber: ft,
  convertHexToNumber: de,
  drawPianoroll: dt$1,
  fill: at,
  getComputedPropertyValue: Ue$1,
  getDrawContext: Z$2,
  getDrawOptions: ve$1,
  getPunchcardPainter: je,
  getTheme: W$2,
  h: tt$1,
  moveXY: lt$1,
  pianoroll: ct$1,
  pitchwheel: Ve$1,
  r: rt$1,
  rescale: it$1,
  setTheme: Ze$1,
  smear: ot$1,
  w: et$1,
  x: we$1,
  y: xe$1,
  zoomIn: st
}, Symbol.toStringTag, { value: "Module" }));
function Or(t2, i2) {
  function e() {
    this.constructor = t2;
  }
  e.prototype = i2.prototype, t2.prototype = new e();
}
function uu(t2, i2, e, f2) {
  var l2 = Error.call(this, t2);
  return Object.setPrototypeOf && Object.setPrototypeOf(l2, uu.prototype), l2.expected = i2, l2.found = e, l2.location = f2, l2.name = "SyntaxError", l2;
}
Or(uu, Error);
function Cu(t2, i2, e) {
  return e = e || " ", t2.length > i2 ? t2 : (i2 -= t2.length, e += e.repeat(i2), t2 + e.slice(0, i2));
}
uu.prototype.format = function(t2) {
  var i2 = "Error: " + this.message;
  if (this.location) {
    var e = null, f2;
    for (f2 = 0; f2 < t2.length; f2++)
      if (t2[f2].source === this.location.source) {
        e = t2[f2].text.split(/\r\n|\n|\r/g);
        break;
      }
    var l2 = this.location.start, a = this.location.source && typeof this.location.source.offset == "function" ? this.location.source.offset(l2) : l2, D2 = this.location.source + ":" + a.line + ":" + a.column;
    if (e) {
      var v2 = this.location.end, g = Cu("", a.line.toString().length, " "), c = e[l2.line - 1], F2 = l2.line === v2.line ? v2.column : c.length + 1, p = F2 - l2.column || 1;
      i2 += `
 --> ` + D2 + `
` + g + ` |
` + a.line + " | " + c + `
` + g + " | " + Cu("", l2.column - 1, " ") + Cu("", p, "^");
    } else
      i2 += `
 at ` + D2;
  }
  return i2;
};
uu.buildMessage = function(t2, i2) {
  var e = {
    literal: function(c) {
      return '"' + l2(c.text) + '"';
    },
    class: function(c) {
      var F2 = c.parts.map(function(p) {
        return Array.isArray(p) ? a(p[0]) + "-" + a(p[1]) : a(p);
      });
      return "[" + (c.inverted ? "^" : "") + F2.join("") + "]";
    },
    any: function() {
      return "any character";
    },
    end: function() {
      return "end of input";
    },
    other: function(c) {
      return c.description;
    }
  };
  function f2(c) {
    return c.charCodeAt(0).toString(16).toUpperCase();
  }
  function l2(c) {
    return c.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(F2) {
      return "\\x0" + f2(F2);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(F2) {
      return "\\x" + f2(F2);
    });
  }
  function a(c) {
    return c.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\^/g, "\\^").replace(/-/g, "\\-").replace(/\0/g, "\\0").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/[\x00-\x0F]/g, function(F2) {
      return "\\x0" + f2(F2);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function(F2) {
      return "\\x" + f2(F2);
    });
  }
  function D2(c) {
    return e[c.type](c);
  }
  function v2(c) {
    var F2 = c.map(D2), p, w2;
    if (F2.sort(), F2.length > 0) {
      for (p = 1, w2 = 1; p < F2.length; p++)
        F2[p - 1] !== F2[p] && (F2[w2] = F2[p], w2++);
      F2.length = w2;
    }
    switch (F2.length) {
      case 1:
        return F2[0];
      case 2:
        return F2[0] + " or " + F2[1];
      default:
        return F2.slice(0, -1).join(", ") + ", or " + F2[F2.length - 1];
    }
  }
  function g(c) {
    return c ? '"' + l2(c) + '"' : "end of input";
  }
  return "Expected " + v2(t2) + " but " + g(i2) + " found.";
};
function Mr(t2, i2) {
  i2 = i2 !== void 0 ? i2 : {};
  var e = {}, f2 = i2.grammarSource, l2 = { start: Uu2 }, a = Uu2, D2 = ".", v2 = "-", g = "0", c = ",", F2 = "|", p = "[", w2 = "]", P2 = "{", R2 = "}", su2 = "%", iu2 = "<", re2 = ">", ne2 = "!", se2 = "(", ie2 = ")", fe2 = "/", oe2 = "*", ae2 = "?", le2 = ":", Eu2 = "..", ce2 = "^", vu2 = "struct", $u2 = "target", mu2 = "euclid", _u2 = "slow", yu2 = "rotL", wu2 = "rotR", bu2 = "fast", xu2 = "scale", Iu2 = "//", ku2 = "cat", Ae = "$", Nu2 = "setcps", Pu2 = "setbpm", qu2 = "hush", pe2 = /^[1-9]/, ge2 = /^[eE]/, Fe2 = /^[+\-]/, he2 = /^[0-9]/, ju2 = /^[ \n\r\t\xA0]/, Be2 = /^["']/, Ce2 = /^[#\--.0-9A-Z\^-_a-z~\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376-\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u09FC\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60-\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E46\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7B9\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD-\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/, De2 = /^[@_]/, Su2 = /^[^\n]/, de2 = pu2("number"), Ru2 = _2(".", false), Ee2 = O2([["1", "9"]], false, false), ve2 = O2(["e", "E"], false, false), $e2 = O2(["+", "-"], false, false), me2 = _2("-", false), _e2 = _2("0", false), ye2 = O2([["0", "9"]], false, false), we2 = pu2("whitespace"), Lu2 = O2([" ", `
`, "\r", "	", " "], false, false), be2 = _2(",", false), xe2 = _2("|", false), Ie2 = O2(['"', "'"], false, false), ke2 = pu2('a letter, a number, "-", "#", ".", "^", "_"'), Ne2 = O2(["#", ["-", "."], ["0", "9"], ["A", "Z"], ["^", "_"], ["a", "z"], "~", "ª", "µ", "º", ["À", "Ö"], ["Ø", "ö"], ["ø", "ˁ"], ["ˆ", "ˑ"], ["ˠ", "ˤ"], "ˬ", "ˮ", ["Ͱ", "ʹ"], ["Ͷ", "ͷ"], ["ͺ", "ͽ"], "Ϳ", "Ά", ["Έ", "Ί"], "Ό", ["Ύ", "Ρ"], ["Σ", "ϵ"], ["Ϸ", "ҁ"], ["Ҋ", "ԯ"], ["Ա", "Ֆ"], "ՙ", ["ՠ", "ֈ"], ["א", "ת"], ["ׯ", "ײ"], ["ؠ", "ي"], ["ٮ", "ٯ"], ["ٱ", "ۓ"], "ە", ["ۥ", "ۦ"], ["ۮ", "ۯ"], ["ۺ", "ۼ"], "ۿ", "ܐ", ["ܒ", "ܯ"], ["ݍ", "ޥ"], "ޱ", ["ߊ", "ߪ"], ["ߴ", "ߵ"], "ߺ", ["ࠀ", "ࠕ"], "ࠚ", "ࠤ", "ࠨ", ["ࡀ", "ࡘ"], ["ࡠ", "ࡪ"], ["ࢠ", "ࢴ"], ["ࢶ", "ࢽ"], ["ऄ", "ह"], "ऽ", "ॐ", ["क़", "ॡ"], ["ॱ", "ঀ"], ["অ", "ঌ"], ["এ", "ঐ"], ["ও", "ন"], ["প", "র"], "ল", ["শ", "হ"], "ঽ", "ৎ", ["ড়", "ঢ়"], ["য়", "ৡ"], ["ৰ", "ৱ"], "ৼ", ["ਅ", "ਊ"], ["ਏ", "ਐ"], ["ਓ", "ਨ"], ["ਪ", "ਰ"], ["ਲ", "ਲ਼"], ["ਵ", "ਸ਼"], ["ਸ", "ਹ"], ["ਖ਼", "ੜ"], "ਫ਼", ["ੲ", "ੴ"], ["અ", "ઍ"], ["એ", "ઑ"], ["ઓ", "ન"], ["પ", "ર"], ["લ", "ળ"], ["વ", "હ"], "ઽ", "ૐ", ["ૠ", "ૡ"], "ૹ", ["ଅ", "ଌ"], ["ଏ", "ଐ"], ["ଓ", "ନ"], ["ପ", "ର"], ["ଲ", "ଳ"], ["ଵ", "ହ"], "ଽ", ["ଡ଼", "ଢ଼"], ["ୟ", "ୡ"], "ୱ", "ஃ", ["அ", "ஊ"], ["எ", "ஐ"], ["ஒ", "க"], ["ங", "ச"], "ஜ", ["ஞ", "ட"], ["ண", "த"], ["ந", "ப"], ["ம", "ஹ"], "ௐ", ["అ", "ఌ"], ["ఎ", "ఐ"], ["ఒ", "న"], ["ప", "హ"], "ఽ", ["ౘ", "ౚ"], ["ౠ", "ౡ"], "ಀ", ["ಅ", "ಌ"], ["ಎ", "ಐ"], ["ಒ", "ನ"], ["ಪ", "ಳ"], ["ವ", "ಹ"], "ಽ", "ೞ", ["ೠ", "ೡ"], ["ೱ", "ೲ"], ["അ", "ഌ"], ["എ", "ഐ"], ["ഒ", "ഺ"], "ഽ", "ൎ", ["ൔ", "ൖ"], ["ൟ", "ൡ"], ["ൺ", "ൿ"], ["අ", "ඖ"], ["ක", "න"], ["ඳ", "ර"], "ල", ["ව", "ෆ"], ["ก", "ะ"], ["า", "ำ"], ["เ", "ๆ"], ["ກ", "ຂ"], "ຄ", ["ງ", "ຈ"], "ຊ", "ຍ", ["ດ", "ທ"], ["ນ", "ຟ"], ["ມ", "ຣ"], "ລ", "ວ", ["ສ", "ຫ"], ["ອ", "ະ"], ["າ", "ຳ"], "ຽ", ["ເ", "ໄ"], "ໆ", ["ໜ", "ໟ"], "ༀ", ["ཀ", "ཇ"], ["ཉ", "ཬ"], ["ྈ", "ྌ"], ["က", "ဪ"], "ဿ", ["ၐ", "ၕ"], ["ၚ", "ၝ"], "ၡ", ["ၥ", "ၦ"], ["ၮ", "ၰ"], ["ၵ", "ႁ"], "ႎ", ["Ⴀ", "Ⴥ"], "Ⴧ", "Ⴭ", ["ა", "ჺ"], ["ჼ", "ቈ"], ["ቊ", "ቍ"], ["ቐ", "ቖ"], "ቘ", ["ቚ", "ቝ"], ["በ", "ኈ"], ["ኊ", "ኍ"], ["ነ", "ኰ"], ["ኲ", "ኵ"], ["ኸ", "ኾ"], "ዀ", ["ዂ", "ዅ"], ["ወ", "ዖ"], ["ዘ", "ጐ"], ["ጒ", "ጕ"], ["ጘ", "ፚ"], ["ᎀ", "ᎏ"], ["Ꭰ", "Ᏽ"], ["ᏸ", "ᏽ"], ["ᐁ", "ᙬ"], ["ᙯ", "ᙿ"], ["ᚁ", "ᚚ"], ["ᚠ", "ᛪ"], ["ᛮ", "ᛸ"], ["ᜀ", "ᜌ"], ["ᜎ", "ᜑ"], ["ᜠ", "ᜱ"], ["ᝀ", "ᝑ"], ["ᝠ", "ᝬ"], ["ᝮ", "ᝰ"], ["ក", "ឳ"], "ៗ", "ៜ", ["ᠠ", "ᡸ"], ["ᢀ", "ᢄ"], ["ᢇ", "ᢨ"], "ᢪ", ["ᢰ", "ᣵ"], ["ᤀ", "ᤞ"], ["ᥐ", "ᥭ"], ["ᥰ", "ᥴ"], ["ᦀ", "ᦫ"], ["ᦰ", "ᧉ"], ["ᨀ", "ᨖ"], ["ᨠ", "ᩔ"], "ᪧ", ["ᬅ", "ᬳ"], ["ᭅ", "ᭋ"], ["ᮃ", "ᮠ"], ["ᮮ", "ᮯ"], ["ᮺ", "ᯥ"], ["ᰀ", "ᰣ"], ["ᱍ", "ᱏ"], ["ᱚ", "ᱽ"], ["ᲀ", "ᲈ"], ["Ა", "Ჺ"], ["Ჽ", "Ჿ"], ["ᳩ", "ᳬ"], ["ᳮ", "ᳱ"], ["ᳵ", "ᳶ"], ["ᴀ", "ᶿ"], ["Ḁ", "ἕ"], ["Ἐ", "Ἕ"], ["ἠ", "ὅ"], ["Ὀ", "Ὅ"], ["ὐ", "ὗ"], "Ὑ", "Ὓ", "Ὕ", ["Ὗ", "ώ"], ["ᾀ", "ᾴ"], ["ᾶ", "ᾼ"], "ι", ["ῂ", "ῄ"], ["ῆ", "ῌ"], ["ῐ", "ΐ"], ["ῖ", "Ί"], ["ῠ", "Ῥ"], ["ῲ", "ῴ"], ["ῶ", "ῼ"], "ⁱ", "ⁿ", ["ₐ", "ₜ"], "ℂ", "ℇ", ["ℊ", "ℓ"], "ℕ", ["ℙ", "ℝ"], "ℤ", "Ω", "ℨ", ["K", "ℭ"], ["ℯ", "ℹ"], ["ℼ", "ℿ"], ["ⅅ", "ⅉ"], "ⅎ", ["Ⅰ", "ↈ"], ["Ⰰ", "Ⱞ"], ["ⰰ", "ⱞ"], ["Ⱡ", "ⳤ"], ["Ⳬ", "ⳮ"], ["Ⳳ", "ⳳ"], ["ⴀ", "ⴥ"], "ⴧ", "ⴭ", ["ⴰ", "ⵧ"], "ⵯ", ["ⶀ", "ⶖ"], ["ⶠ", "ⶦ"], ["ⶨ", "ⶮ"], ["ⶰ", "ⶶ"], ["ⶸ", "ⶾ"], ["ⷀ", "ⷆ"], ["ⷈ", "ⷎ"], ["ⷐ", "ⷖ"], ["ⷘ", "ⷞ"], "ⸯ", ["々", "〇"], ["〡", "〩"], ["〱", "〵"], ["〸", "〼"], ["ぁ", "ゖ"], ["ゝ", "ゟ"], ["ァ", "ヺ"], ["ー", "ヿ"], ["ㄅ", "ㄯ"], ["ㄱ", "ㆎ"], ["ㆠ", "ㆺ"], ["ㇰ", "ㇿ"], ["㐀", "䶵"], ["一", "鿯"], ["ꀀ", "ꒌ"], ["ꓐ", "ꓽ"], ["ꔀ", "ꘌ"], ["ꘐ", "ꘟ"], ["ꘪ", "ꘫ"], ["Ꙁ", "ꙮ"], ["ꙿ", "ꚝ"], ["ꚠ", "ꛯ"], ["ꜗ", "ꜟ"], ["Ꜣ", "ꞈ"], ["Ꞌ", "ꞹ"], ["ꟷ", "ꠁ"], ["ꠃ", "ꠅ"], ["ꠇ", "ꠊ"], ["ꠌ", "ꠢ"], ["ꡀ", "ꡳ"], ["ꢂ", "ꢳ"], ["ꣲ", "ꣷ"], "ꣻ", ["ꣽ", "ꣾ"], ["ꤊ", "ꤥ"], ["ꤰ", "ꥆ"], ["ꥠ", "ꥼ"], ["ꦄ", "ꦲ"], "ꧏ", ["ꧠ", "ꧤ"], ["ꧦ", "ꧯ"], ["ꧺ", "ꧾ"], ["ꨀ", "ꨨ"], ["ꩀ", "ꩂ"], ["ꩄ", "ꩋ"], ["ꩠ", "ꩶ"], "ꩺ", ["ꩾ", "ꪯ"], "ꪱ", ["ꪵ", "ꪶ"], ["ꪹ", "ꪽ"], "ꫀ", "ꫂ", ["ꫛ", "ꫝ"], ["ꫠ", "ꫪ"], ["ꫲ", "ꫴ"], ["ꬁ", "ꬆ"], ["ꬉ", "ꬎ"], ["ꬑ", "ꬖ"], ["ꬠ", "ꬦ"], ["ꬨ", "ꬮ"], ["ꬰ", "ꭚ"], ["ꭜ", "ꭥ"], ["ꭰ", "ꯢ"], ["가", "힣"], ["ힰ", "ퟆ"], ["ퟋ", "ퟻ"], ["豈", "舘"], ["並", "龎"], ["ﬀ", "ﬆ"], ["ﬓ", "ﬗ"], "יִ", ["ײַ", "ﬨ"], ["שׁ", "זּ"], ["טּ", "לּ"], "מּ", ["נּ", "סּ"], ["ףּ", "פּ"], ["צּ", "ﮱ"], ["ﯓ", "ﴽ"], ["ﵐ", "ﶏ"], ["ﶒ", "ﷇ"], ["ﷰ", "ﷻ"], ["ﹰ", "ﹴ"], ["ﹶ", "ﻼ"], ["Ａ", "Ｚ"], ["ａ", "ｚ"], ["ｦ", "ﾾ"], ["ￂ", "ￇ"], ["ￊ", "ￏ"], ["ￒ", "ￗ"], ["ￚ", "ￜ"]], false, false), Ou2 = _2("[", false), Mu2 = _2("]", false), Pe2 = _2("{", false), qe = _2("}", false), je2 = _2("%", false), Se2 = _2("<", false), Re2 = _2(">", false), Le2 = O2(["@", "_"], false, false), Oe2 = _2("!", false), Me2 = _2("(", false), ze2 = _2(")", false), Te2 = _2("/", false), Ze2 = _2("*", false), We2 = _2("?", false), Ue2 = _2(":", false), Ve2 = _2("..", false), Xe2 = _2("^", false), Ge2 = _2("struct", false), Ye2 = _2("target", false), He2 = _2("euclid", false), Je2 = _2("slow", false), Ke2 = _2("rotL", false), Qe3 = _2("rotR", false), ut2 = _2("fast", false), et2 = _2("scale", false), tt2 = _2("//", false), zu2 = O2([`
`], true, false), rt2 = _2("cat", false), nt2 = _2("$", false), st3 = _2("setcps", false), it2 = _2("setbpm", false), ft2 = _2("hush", false), ot2 = function() {
    return parseFloat(Xt2());
  }, at3 = function(u) {
    const r = u.join("");
    return r === "." || r === "_";
  }, lt2 = function(u) {
    return new Sr2(u.join(""));
  }, ct2 = function(u) {
    return u;
  }, At2 = function(u, r) {
    return u.arguments_.stepsPerCycle = r, u;
  }, pt2 = function(u) {
    return u;
  }, gt2 = function(u) {
    return u.arguments_.alignment = "polymeter_slowcat", u;
  }, Ft2 = function(u) {
    return (r) => r.options_.weight = (r.options_.weight ?? 1) + (u ?? 2) - 1;
  }, ht2 = function(u) {
    return (r) => {
      const s = (r.options_.reps ?? 1) + (u ?? 2) - 1;
      r.options_.reps = s, r.options_.ops = r.options_.ops.filter((o) => o.type_ !== "replicate"), r.options_.ops.push({ type_: "replicate", arguments_: { amount: s } }), r.options_.weight = s;
    };
  }, Bt2 = function(u, r, s) {
    return (o) => o.options_.ops.push({ type_: "bjorklund", arguments_: { pulse: u, step: r, rotation: s } });
  }, Ct2 = function(u) {
    return (r) => r.options_.ops.push({ type_: "stretch", arguments_: { amount: u, type: "slow" } });
  }, Dt2 = function(u) {
    return (r) => r.options_.ops.push({ type_: "stretch", arguments_: { amount: u, type: "fast" } });
  }, dt2 = function(u) {
    return (r) => r.options_.ops.push({ type_: "degradeBy", arguments_: { amount: u, seed: Bu2++ } });
  }, Et2 = function(u) {
    return (r) => r.options_.ops.push({ type_: "tail", arguments_: { element: u } });
  }, vt2 = function(u) {
    return (r) => r.options_.ops.push({ type_: "range", arguments_: { element: u } });
  }, $t2 = function(u, r) {
    const s = new Lr2(u, { ops: [], weight: 1, reps: 1 });
    for (const o of r)
      o(s);
    return s;
  }, mt2 = function(u, r) {
    return new lu2(r, "fastcat", void 0, !!u);
  }, _t2 = function(u) {
    return { alignment: "stack", list: u };
  }, yt = function(u) {
    return { alignment: "rand", list: u, seed: Bu2++ };
  }, wt = function(u) {
    return { alignment: "feet", list: u, seed: Bu2++ };
  }, bt = function(u, r) {
    return r && r.list.length > 0 ? new lu2([u, ...r.list], r.alignment, r.seed) : u;
  }, xt2 = function(u, r) {
    return new lu2(r ? [u, ...r.list] : [u], "polymeter");
  }, It2 = function(u) {
    return u;
  }, kt2 = function(u) {
    return { name: "struct", args: { mini: u } };
  }, Nt = function(u) {
    return { name: "target", args: { name: u } };
  }, Pt2 = function(u, r, s) {
    return { name: "bjorklund", args: { pulse: u, step: parseInt(r) } };
  }, qt2 = function(u) {
    return { name: "stretch", args: { amount: u } };
  }, jt2 = function(u) {
    return { name: "shift", args: { amount: "-" + u } };
  }, St2 = function(u) {
    return { name: "shift", args: { amount: u } };
  }, Rt2 = function(u) {
    return { name: "stretch", args: { amount: "1/" + u } };
  }, Lt2 = function(u) {
    return { name: "scale", args: { scale: u.join("") } };
  }, Tu2 = function(u, r) {
    return r;
  }, Ot2 = function(u, r) {
    return r.unshift(u), new lu2(r, "slowcat");
  }, Mt2 = function(u) {
    return u;
  }, zt2 = function(u, r) {
    return new Rr2(u.name, u.args, r);
  }, Tt2 = function(u) {
    return u;
  }, Zt2 = function(u) {
    return u;
  }, Wt2 = function(u) {
    return new hu2("setcps", { value: u });
  }, Ut2 = function(u) {
    return new hu2("setcps", { value: u / 120 / 2 });
  }, Vt2 = function() {
    return new hu2("hush");
  }, n = i2.peg$currPos | 0, $2 = n, V2 = [{ line: 1, column: 1 }], q2 = n, fu2 = i2.peg$maxFailExpected || [], h2 = i2.peg$silentFails | 0, eu2;
  if (i2.startRule) {
    if (!(i2.startRule in l2))
      throw new Error(`Can't start parsing from rule "` + i2.startRule + '".');
    a = l2[i2.startRule];
  }
  function Xt2() {
    return t2.substring($2, n);
  }
  function Zu2() {
    return gu2($2, n);
  }
  function _2(u, r) {
    return { type: "literal", text: u, ignoreCase: r };
  }
  function O2(u, r, s) {
    return { type: "class", parts: u, inverted: r, ignoreCase: s };
  }
  function Gt2() {
    return { type: "end" };
  }
  function pu2(u) {
    return { type: "other", description: u };
  }
  function Wu2(u) {
    var r = V2[u], s;
    if (r)
      return r;
    if (u >= V2.length)
      s = V2.length - 1;
    else
      for (s = u; !V2[--s]; )
        ;
    for (r = V2[s], r = {
      line: r.line,
      column: r.column
    }; s < u; )
      t2.charCodeAt(s) === 10 ? (r.line++, r.column = 1) : r.column++, s++;
    return V2[u] = r, r;
  }
  function gu2(u, r, s) {
    var o = Wu2(u), B2 = Wu2(r), x3 = {
      source: f2,
      start: {
        offset: u,
        line: o.line,
        column: o.column
      },
      end: {
        offset: r,
        line: B2.line,
        column: B2.column
      }
    };
    return x3;
  }
  function d2(u) {
    n < q2 || (n > q2 && (q2 = n, fu2 = []), fu2.push(u));
  }
  function Yt2(u, r, s) {
    return new uu(
      uu.buildMessage(u, r),
      u,
      r,
      s
    );
  }
  function Uu2() {
    var u;
    return u = jr2(), u;
  }
  function M2() {
    var u, r;
    return h2++, u = n, er2(), r = ou2(), r !== e ? (ur2(), Qt2(), $2 = u, u = ot2()) : (n = u, u = e), h2--, u === e && h2 === 0 && d2(de2), u;
  }
  function Ht2() {
    var u;
    return t2.charCodeAt(n) === 46 ? (u = D2, n++) : (u = e, h2 === 0 && d2(Ru2)), u;
  }
  function Jt2() {
    var u;
    return u = t2.charAt(n), pe2.test(u) ? n++ : (u = e, h2 === 0 && d2(Ee2)), u;
  }
  function Kt2() {
    var u;
    return u = t2.charAt(n), ge2.test(u) ? n++ : (u = e, h2 === 0 && d2(ve2)), u;
  }
  function Qt2() {
    var u, r, s, o, B2;
    if (u = n, r = Kt2(), r !== e) {
      if (s = t2.charAt(n), Fe2.test(s) ? n++ : (s = e, h2 === 0 && d2($e2)), s === e && (s = null), o = [], B2 = X2(), B2 !== e)
        for (; B2 !== e; )
          o.push(B2), B2 = X2();
      else
        o = e;
      o !== e ? (r = [r, s, o], u = r) : (n = u, u = e);
    } else
      n = u, u = e;
    return u;
  }
  function ur2() {
    var u, r, s, o;
    if (u = n, r = Ht2(), r !== e) {
      if (s = [], o = X2(), o !== e)
        for (; o !== e; )
          s.push(o), o = X2();
      else
        s = e;
      s !== e ? (r = [r, s], u = r) : (n = u, u = e);
    } else
      n = u, u = e;
    return u;
  }
  function ou2() {
    var u, r, s, o;
    if (u = tr2(), u === e)
      if (u = n, r = Jt2(), r !== e) {
        for (s = [], o = X2(); o !== e; )
          s.push(o), o = X2();
        r = [r, s], u = r;
      } else
        n = u, u = e;
    return u;
  }
  function er2() {
    var u;
    return t2.charCodeAt(n) === 45 ? (u = v2, n++) : (u = e, h2 === 0 && d2(me2)), u;
  }
  function tr2() {
    var u;
    return t2.charCodeAt(n) === 48 ? (u = g, n++) : (u = e, h2 === 0 && d2(_e2)), u;
  }
  function X2() {
    var u;
    return u = t2.charAt(n), he2.test(u) ? n++ : (u = e, h2 === 0 && d2(ye2)), u;
  }
  function E2() {
    var u, r;
    for (h2++, u = [], r = t2.charAt(n), ju2.test(r) ? n++ : (r = e, h2 === 0 && d2(Lu2)); r !== e; )
      u.push(r), r = t2.charAt(n), ju2.test(r) ? n++ : (r = e, h2 === 0 && d2(Lu2));
    return h2--, r = e, h2 === 0 && d2(we2), u;
  }
  function G2() {
    var u, r, s, o;
    return u = n, r = E2(), t2.charCodeAt(n) === 44 ? (s = c, n++) : (s = e, h2 === 0 && d2(be2)), s !== e ? (o = E2(), r = [r, s, o], u = r) : (n = u, u = e), u;
  }
  function Vu2() {
    var u, r, s, o;
    return u = n, r = E2(), t2.charCodeAt(n) === 124 ? (s = F2, n++) : (s = e, h2 === 0 && d2(xe2)), s !== e ? (o = E2(), r = [r, s, o], u = r) : (n = u, u = e), u;
  }
  function Xu2() {
    var u, r, s, o;
    return u = n, r = E2(), t2.charCodeAt(n) === 46 ? (s = D2, n++) : (s = e, h2 === 0 && d2(Ru2)), s !== e ? (o = E2(), r = [r, s, o], u = r) : (n = u, u = e), u;
  }
  function Y2() {
    var u;
    return u = t2.charAt(n), Be2.test(u) ? n++ : (u = e, h2 === 0 && d2(Ie2)), u;
  }
  function au2() {
    var u;
    return h2++, u = t2.charAt(n), Ce2.test(u) ? n++ : (u = e, h2 === 0 && d2(Ne2)), h2--, u === e && h2 === 0 && d2(ke2), u;
  }
  function Gu2() {
    var u, r, s, o;
    if (u = n, E2(), r = [], s = au2(), s !== e)
      for (; s !== e; )
        r.push(s), s = au2();
    else
      r = e;
    return r !== e ? (s = E2(), $2 = n, o = at3(r), o ? o = e : o = void 0, o !== e ? ($2 = u, u = lt2(r)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function rr2() {
    var u, r, s, o;
    return u = n, E2(), t2.charCodeAt(n) === 91 ? (r = p, n++) : (r = e, h2 === 0 && d2(Ou2)), r !== e ? (E2(), s = Ju2(), s !== e ? (E2(), t2.charCodeAt(n) === 93 ? (o = w2, n++) : (o = e, h2 === 0 && d2(Mu2)), o !== e ? (E2(), $2 = u, u = ct2(s)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function nr2() {
    var u, r, s, o, B2;
    return u = n, E2(), t2.charCodeAt(n) === 123 ? (r = P2, n++) : (r = e, h2 === 0 && d2(Pe2)), r !== e ? (E2(), s = Ku2(), s !== e ? (E2(), t2.charCodeAt(n) === 125 ? (o = R2, n++) : (o = e, h2 === 0 && d2(qe)), o !== e ? (B2 = sr2(), B2 === e && (B2 = null), E2(), $2 = u, u = At2(s, B2)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function sr2() {
    var u, r, s;
    return u = n, t2.charCodeAt(n) === 37 ? (r = su2, n++) : (r = e, h2 === 0 && d2(je2)), r !== e ? (s = H2(), s !== e ? ($2 = u, u = pt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function ir2() {
    var u, r, s, o;
    return u = n, E2(), t2.charCodeAt(n) === 60 ? (r = iu2, n++) : (r = e, h2 === 0 && d2(Se2)), r !== e ? (E2(), s = Ku2(), s !== e ? (E2(), t2.charCodeAt(n) === 62 ? (o = re2, n++) : (o = e, h2 === 0 && d2(Re2)), o !== e ? (E2(), $2 = u, u = gt2(s)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function H2() {
    var u;
    return u = Gu2(), u === e && (u = rr2(), u === e && (u = nr2(), u === e && (u = ir2()))), u;
  }
  function Yu2() {
    var u;
    return u = fr2(), u === e && (u = ar2(), u === e && (u = lr2(), u === e && (u = cr2(), u === e && (u = or2(), u === e && (u = Ar2(), u === e && (u = pr2(), u === e && (u = gr2()))))))), u;
  }
  function fr2() {
    var u, r, s;
    return u = n, E2(), r = t2.charAt(n), De2.test(r) ? n++ : (r = e, h2 === 0 && d2(Le2)), r !== e ? (s = M2(), s === e && (s = null), $2 = u, u = Ft2(s)) : (n = u, u = e), u;
  }
  function or2() {
    var u, r, s;
    return u = n, E2(), t2.charCodeAt(n) === 33 ? (r = ne2, n++) : (r = e, h2 === 0 && d2(Oe2)), r !== e ? (s = M2(), s === e && (s = null), $2 = u, u = ht2(s)) : (n = u, u = e), u;
  }
  function ar2() {
    var u, r, s, o, B2, x3, j2;
    return u = n, t2.charCodeAt(n) === 40 ? (r = se2, n++) : (r = e, h2 === 0 && d2(Me2)), r !== e ? (E2(), s = tu2(), s !== e ? (E2(), o = G2(), o !== e ? (E2(), B2 = tu2(), B2 !== e ? (E2(), G2(), E2(), x3 = tu2(), x3 === e && (x3 = null), E2(), t2.charCodeAt(n) === 41 ? (j2 = ie2, n++) : (j2 = e, h2 === 0 && d2(ze2)), j2 !== e ? ($2 = u, u = Bt2(s, B2, x3)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function lr2() {
    var u, r, s;
    return u = n, t2.charCodeAt(n) === 47 ? (r = fe2, n++) : (r = e, h2 === 0 && d2(Te2)), r !== e ? (s = H2(), s !== e ? ($2 = u, u = Ct2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function cr2() {
    var u, r, s;
    return u = n, t2.charCodeAt(n) === 42 ? (r = oe2, n++) : (r = e, h2 === 0 && d2(Ze2)), r !== e ? (s = H2(), s !== e ? ($2 = u, u = Dt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function Ar2() {
    var u, r, s;
    return u = n, t2.charCodeAt(n) === 63 ? (r = ae2, n++) : (r = e, h2 === 0 && d2(We2)), r !== e ? (s = M2(), s === e && (s = null), $2 = u, u = dt2(s)) : (n = u, u = e), u;
  }
  function pr2() {
    var u, r, s;
    return u = n, t2.charCodeAt(n) === 58 ? (r = le2, n++) : (r = e, h2 === 0 && d2(Ue2)), r !== e ? (s = H2(), s !== e ? ($2 = u, u = Et2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function gr2() {
    var u, r, s;
    return u = n, t2.substr(n, 2) === Eu2 ? (r = Eu2, n += 2) : (r = e, h2 === 0 && d2(Ve2)), r !== e ? (s = H2(), s !== e ? ($2 = u, u = vt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function tu2() {
    var u, r, s, o;
    if (u = n, r = H2(), r !== e) {
      for (s = [], o = Yu2(); o !== e; )
        s.push(o), o = Yu2();
      $2 = u, u = $t2(r, s);
    } else
      n = u, u = e;
    return u;
  }
  function T2() {
    var u, r, s, o;
    if (u = n, t2.charCodeAt(n) === 94 ? (r = ce2, n++) : (r = e, h2 === 0 && d2(Xe2)), r === e && (r = null), s = [], o = tu2(), o !== e)
      for (; o !== e; )
        s.push(o), o = tu2();
    else
      s = e;
    return s !== e ? ($2 = u, u = mt2(r, s)) : (n = u, u = e), u;
  }
  function Hu2() {
    var u, r, s, o, B2;
    if (u = n, r = [], s = n, o = G2(), o !== e ? (B2 = T2(), B2 !== e ? s = B2 : (n = s, s = e)) : (n = s, s = e), s !== e)
      for (; s !== e; )
        r.push(s), s = n, o = G2(), o !== e ? (B2 = T2(), B2 !== e ? s = B2 : (n = s, s = e)) : (n = s, s = e);
    else
      r = e;
    return r !== e && ($2 = u, r = _t2(r)), u = r, u;
  }
  function Fr2() {
    var u, r, s, o, B2;
    if (u = n, r = [], s = n, o = Vu2(), o !== e ? (B2 = T2(), B2 !== e ? s = B2 : (n = s, s = e)) : (n = s, s = e), s !== e)
      for (; s !== e; )
        r.push(s), s = n, o = Vu2(), o !== e ? (B2 = T2(), B2 !== e ? s = B2 : (n = s, s = e)) : (n = s, s = e);
    else
      r = e;
    return r !== e && ($2 = u, r = yt(r)), u = r, u;
  }
  function hr2() {
    var u, r, s, o, B2;
    if (u = n, r = [], s = n, o = Xu2(), o !== e ? (B2 = T2(), B2 !== e ? s = B2 : (n = s, s = e)) : (n = s, s = e), s !== e)
      for (; s !== e; )
        r.push(s), s = n, o = Xu2(), o !== e ? (B2 = T2(), B2 !== e ? s = B2 : (n = s, s = e)) : (n = s, s = e);
    else
      r = e;
    return r !== e && ($2 = u, r = wt(r)), u = r, u;
  }
  function Ju2() {
    var u, r, s;
    return u = n, r = T2(), r !== e ? (s = Hu2(), s === e && (s = Fr2(), s === e && (s = hr2())), s === e && (s = null), $2 = u, u = bt(r, s)) : (n = u, u = e), u;
  }
  function Ku2() {
    var u, r, s;
    return u = n, r = T2(), r !== e ? (s = Hu2(), s === e && (s = null), $2 = u, u = xt2(r, s)) : (n = u, u = e), u;
  }
  function Br2() {
    var u, r, s, o;
    return u = n, E2(), r = Y2(), r !== e ? (E2(), s = Ju2(), s !== e ? (E2(), o = Y2(), o !== e ? ($2 = u, u = It2(s)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function Cr2() {
    var u;
    return u = yr2(), u === e && (u = vr2(), u === e && (u = _r2(), u === e && (u = dr2(), u === e && (u = Er2(), u === e && (u = Dr2(), u === e && (u = mr2(), u === e && (u = $r2()))))))), u;
  }
  function Dr2() {
    var u, r, s;
    return u = n, t2.substr(n, 6) === vu2 ? (r = vu2, n += 6) : (r = e, h2 === 0 && d2(Ge2)), r !== e ? (E2(), s = J2(), s !== e ? ($2 = u, u = kt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function dr2() {
    var u, r, s, o, B2;
    return u = n, t2.substr(n, 6) === $u2 ? (r = $u2, n += 6) : (r = e, h2 === 0 && d2(Ye2)), r !== e ? (E2(), s = Y2(), s !== e ? (o = Gu2(), o !== e ? (B2 = Y2(), B2 !== e ? ($2 = u, u = Nt(o)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function Er2() {
    var u, r, s, o;
    return u = n, t2.substr(n, 6) === mu2 ? (r = mu2, n += 6) : (r = e, h2 === 0 && d2(He2)), r !== e ? (E2(), s = ou2(), s !== e ? (E2(), o = ou2(), o !== e ? (E2(), ou2(), $2 = u, u = Pt2(s, o)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function vr2() {
    var u, r, s;
    return u = n, t2.substr(n, 4) === _u2 ? (r = _u2, n += 4) : (r = e, h2 === 0 && d2(Je2)), r !== e ? (E2(), s = M2(), s !== e ? ($2 = u, u = qt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function $r2() {
    var u, r, s;
    return u = n, t2.substr(n, 4) === yu2 ? (r = yu2, n += 4) : (r = e, h2 === 0 && d2(Ke2)), r !== e ? (E2(), s = M2(), s !== e ? ($2 = u, u = jt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function mr2() {
    var u, r, s;
    return u = n, t2.substr(n, 4) === wu2 ? (r = wu2, n += 4) : (r = e, h2 === 0 && d2(Qe3)), r !== e ? (E2(), s = M2(), s !== e ? ($2 = u, u = St2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function _r2() {
    var u, r, s;
    return u = n, t2.substr(n, 4) === bu2 ? (r = bu2, n += 4) : (r = e, h2 === 0 && d2(ut2)), r !== e ? (E2(), s = M2(), s !== e ? ($2 = u, u = Rt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function yr2() {
    var u, r, s, o, B2;
    if (u = n, t2.substr(n, 5) === xu2 ? (r = xu2, n += 5) : (r = e, h2 === 0 && d2(et2)), r !== e)
      if (E2(), s = Y2(), s !== e) {
        if (o = [], B2 = au2(), B2 !== e)
          for (; B2 !== e; )
            o.push(B2), B2 = au2();
        else
          o = e;
        o !== e ? (B2 = Y2(), B2 !== e ? ($2 = u, u = Lt2(o)) : (n = u, u = e)) : (n = u, u = e);
      } else
        n = u, u = e;
    else
      n = u, u = e;
    return u;
  }
  function Fu2() {
    var u, r, s, o;
    if (u = n, t2.substr(n, 2) === Iu2 ? (r = Iu2, n += 2) : (r = e, h2 === 0 && d2(tt2)), r !== e) {
      for (s = [], o = t2.charAt(n), Su2.test(o) ? n++ : (o = e, h2 === 0 && d2(zu2)); o !== e; )
        s.push(o), o = t2.charAt(n), Su2.test(o) ? n++ : (o = e, h2 === 0 && d2(zu2));
      r = [r, s], u = r;
    } else
      n = u, u = e;
    return u;
  }
  function wr2() {
    var u, r, s, o, B2, x3, j2, K2;
    if (u = n, t2.substr(n, 3) === ku2 ? (r = ku2, n += 3) : (r = e, h2 === 0 && d2(rt2)), r !== e)
      if (E2(), t2.charCodeAt(n) === 91 ? (s = p, n++) : (s = e, h2 === 0 && d2(Ou2)), s !== e)
        if (E2(), o = J2(), o !== e) {
          for (B2 = [], x3 = n, j2 = G2(), j2 !== e ? (K2 = J2(), K2 !== e ? ($2 = x3, x3 = Tu2(o, K2)) : (n = x3, x3 = e)) : (n = x3, x3 = e); x3 !== e; )
            B2.push(x3), x3 = n, j2 = G2(), j2 !== e ? (K2 = J2(), K2 !== e ? ($2 = x3, x3 = Tu2(o, K2)) : (n = x3, x3 = e)) : (n = x3, x3 = e);
          x3 = E2(), t2.charCodeAt(n) === 93 ? (j2 = w2, n++) : (j2 = e, h2 === 0 && d2(Mu2)), j2 !== e ? ($2 = u, u = Ot2(o, B2)) : (n = u, u = e);
        } else
          n = u, u = e;
      else
        n = u, u = e;
    else
      n = u, u = e;
    return u;
  }
  function br2() {
    var u;
    return u = wr2(), u === e && (u = Br2()), u;
  }
  function J2() {
    var u, r, s, o, B2;
    if (u = n, r = br2(), r !== e) {
      for (E2(), s = [], o = Fu2(); o !== e; )
        s.push(o), o = Fu2();
      $2 = u, u = Mt2(r);
    } else
      n = u, u = e;
    return u === e && (u = n, r = Cr2(), r !== e ? (E2(), t2.charCodeAt(n) === 36 ? (s = Ae, n++) : (s = e, h2 === 0 && d2(nt2)), s !== e ? (o = E2(), B2 = J2(), B2 !== e ? ($2 = u, u = zt2(r, B2)) : (n = u, u = e)) : (n = u, u = e)) : (n = u, u = e)), u;
  }
  function xr2() {
    var u, r;
    return u = n, r = J2(), r !== e && ($2 = u, r = Tt2(r)), u = r, u === e && (u = Fu2()), u;
  }
  function Ir2() {
    var u;
    return u = xr2(), u;
  }
  function kr2() {
    var u, r;
    return u = n, E2(), r = Nr2(), r === e && (r = Pr2(), r === e && (r = qr2())), r !== e ? (E2(), $2 = u, u = Zt2(r)) : (n = u, u = e), u;
  }
  function Nr2() {
    var u, r, s;
    return u = n, t2.substr(n, 6) === Nu2 ? (r = Nu2, n += 6) : (r = e, h2 === 0 && d2(st3)), r !== e ? (E2(), s = M2(), s !== e ? ($2 = u, u = Wt2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function Pr2() {
    var u, r, s;
    return u = n, t2.substr(n, 6) === Pu2 ? (r = Pu2, n += 6) : (r = e, h2 === 0 && d2(it2)), r !== e ? (E2(), s = M2(), s !== e ? ($2 = u, u = Ut2(s)) : (n = u, u = e)) : (n = u, u = e), u;
  }
  function qr2() {
    var u, r;
    return u = n, t2.substr(n, 4) === qu2 ? (r = qu2, n += 4) : (r = e, h2 === 0 && d2(ft2)), r !== e && ($2 = u, r = Vt2()), u = r, u;
  }
  function jr2() {
    var u;
    return u = Ir2(), u === e && (u = kr2()), u;
  }
  var Sr2 = function(u) {
    this.type_ = "atom", this.source_ = u, this.location_ = Zu2();
  }, lu2 = function(u, r, s, o) {
    this.type_ = "pattern", this.arguments_ = { alignment: r, _steps: o }, s !== void 0 && (this.arguments_.seed = s), this.source_ = u;
  }, Rr2 = function(u, r, s) {
    this.type_ = u, this.arguments_ = r, this.source_ = s;
  }, Lr2 = function(u, r) {
    this.type_ = "element", this.source_ = u, this.options_ = r, this.location_ = Zu2();
  }, hu2 = function(u, r) {
    this.type_ = "command", this.name_ = u, this.options_ = r;
  }, Bu2 = 0;
  if (eu2 = a(), i2.peg$library)
    return (
      /** @type {any} */
      {
        peg$result: eu2,
        peg$currPos: n,
        peg$FAILED: e,
        peg$maxFailExpected: fu2,
        peg$maxFailPos: q2
      }
    );
  if (eu2 !== e && n === t2.length)
    return eu2;
  throw eu2 !== e && n < t2.length && d2(Gt2()), Yt2(
    fu2,
    q2 < t2.length ? t2.charAt(q2) : null,
    q2 < t2.length ? gu2(q2, q2 + 1) : gu2(q2, q2)
  );
}
const Gr = [
  "start"
];
typeof BigInt > "u" && (BigInt = function(t2) {
  if (isNaN(t2)) throw new Error("");
  return t2;
});
const C$3 = BigInt(0), m$2 = BigInt(1), ru = BigInt(2), Du = BigInt(5), N$3 = BigInt(10), zr = 2e3, A$1 = {
  s: m$2,
  n: C$3,
  d: m$2
};
function z(t2, i2) {
  try {
    t2 = BigInt(t2);
  } catch {
    throw Z$1();
  }
  return t2 * i2;
}
function S$1(t2) {
  return typeof t2 == "bigint" ? t2 : Math.floor(t2);
}
function I$2(t2, i2) {
  if (i2 === C$3)
    throw du();
  const e = Object.create(b$1.prototype);
  e.s = t2 < C$3 ? -m$2 : m$2, t2 = t2 < C$3 ? -t2 : t2;
  const f2 = U$2(t2, i2);
  return e.n = t2 / f2, e.d = i2 / f2, e;
}
function Q$4(t2) {
  const i2 = {};
  let e = t2, f2 = ru, l2 = Du - m$2;
  for (; l2 <= e; ) {
    for (; e % f2 === C$3; )
      e /= f2, i2[f2] = (i2[f2] || C$3) + m$2;
    l2 += m$2 + ru * f2++;
  }
  return e !== t2 ? e > 1 && (i2[e] = (i2[e] || C$3) + m$2) : i2[t2] = (i2[t2] || C$3) + m$2, i2;
}
const k$3 = function(t2, i2) {
  let e = C$3, f2 = m$2, l2 = m$2;
  if (t2 != null) if (i2 !== void 0) {
    if (typeof t2 == "bigint")
      e = t2;
    else {
      if (isNaN(t2))
        throw Z$1();
      if (t2 % 1 !== 0)
        throw Qu();
      e = BigInt(t2);
    }
    if (typeof i2 == "bigint")
      f2 = i2;
    else {
      if (isNaN(i2))
        throw Z$1();
      if (i2 % 1 !== 0)
        throw Qu();
      f2 = BigInt(i2);
    }
    l2 = e * f2;
  } else if (typeof t2 == "object") {
    if ("d" in t2 && "n" in t2)
      e = BigInt(t2.n), f2 = BigInt(t2.d), "s" in t2 && (e *= BigInt(t2.s));
    else if (0 in t2)
      e = BigInt(t2[0]), 1 in t2 && (f2 = BigInt(t2[1]));
    else if (typeof t2 == "bigint")
      e = t2;
    else
      throw Z$1();
    l2 = e * f2;
  } else if (typeof t2 == "number") {
    if (isNaN(t2))
      throw Z$1();
    if (t2 < 0 && (l2 = -m$2, t2 = -t2), t2 % 1 === 0)
      e = BigInt(t2);
    else if (t2 > 0) {
      let a = 1, D2 = 0, v2 = 1, g = 1, c = 1, F2 = 1e7;
      for (t2 >= 1 && (a = 10 ** Math.floor(1 + Math.log10(t2)), t2 /= a); v2 <= F2 && c <= F2; ) {
        let p = (D2 + g) / (v2 + c);
        if (t2 === p) {
          v2 + c <= F2 ? (e = D2 + g, f2 = v2 + c) : c > v2 ? (e = g, f2 = c) : (e = D2, f2 = v2);
          break;
        } else
          t2 > p ? (D2 += g, v2 += c) : (g += D2, c += v2), v2 > F2 ? (e = g, f2 = c) : (e = D2, f2 = v2);
      }
      e = BigInt(e) * BigInt(a), f2 = BigInt(f2);
    }
  } else if (typeof t2 == "string") {
    let a = 0, D2 = C$3, v2 = C$3, g = C$3, c = m$2, F2 = m$2, p = t2.replace(/_/g, "").match(/\d+|./g);
    if (p === null)
      throw Z$1();
    if (p[a] === "-" ? (l2 = -m$2, a++) : p[a] === "+" && a++, p.length === a + 1 ? v2 = z(p[a++], l2) : p[a + 1] === "." || p[a] === "." ? (p[a] !== "." && (D2 = z(p[a++], l2)), a++, (a + 1 === p.length || p[a + 1] === "(" && p[a + 3] === ")" || p[a + 1] === "'" && p[a + 3] === "'") && (v2 = z(p[a], l2), c = N$3 ** BigInt(p[a].length), a++), (p[a] === "(" && p[a + 2] === ")" || p[a] === "'" && p[a + 2] === "'") && (g = z(p[a + 1], l2), F2 = N$3 ** BigInt(p[a + 1].length) - m$2, a += 3)) : p[a + 1] === "/" || p[a + 1] === ":" ? (v2 = z(p[a], l2), c = z(p[a + 2], m$2), a += 3) : p[a + 3] === "/" && p[a + 1] === " " && (D2 = z(p[a], l2), v2 = z(p[a + 2], l2), c = z(p[a + 4], m$2), a += 5), p.length <= a)
      f2 = c * F2, l2 = /* void */
      e = g + f2 * D2 + F2 * v2;
    else
      throw Z$1();
  } else if (typeof t2 == "bigint")
    e = t2, l2 = t2, f2 = m$2;
  else
    throw Z$1();
  if (f2 === C$3)
    throw du();
  A$1.s = l2 < C$3 ? -m$2 : m$2, A$1.n = e < C$3 ? -e : e, A$1.d = f2 < C$3 ? -f2 : f2;
};
function Tr(t2, i2, e) {
  let f2 = m$2;
  for (; i2 > C$3; t2 = t2 * t2 % e, i2 >>= m$2)
    i2 & m$2 && (f2 = f2 * t2 % e);
  return f2;
}
function Zr(t2, i2) {
  for (; i2 % ru === C$3; i2 /= ru)
    ;
  for (; i2 % Du === C$3; i2 /= Du)
    ;
  if (i2 === m$2)
    return C$3;
  let e = N$3 % i2, f2 = 1;
  for (; e !== m$2; f2++)
    if (e = e * N$3 % i2, f2 > zr)
      return C$3;
  return BigInt(f2);
}
function Wr(t2, i2, e) {
  let f2 = m$2, l2 = Tr(N$3, e, i2);
  for (let a = 0; a < 300; a++) {
    if (f2 === l2)
      return BigInt(a);
    f2 = f2 * N$3 % i2, l2 = l2 * N$3 % i2;
  }
  return 0;
}
function U$2(t2, i2) {
  if (!t2)
    return i2;
  if (!i2)
    return t2;
  for (; ; ) {
    if (t2 %= i2, !t2)
      return i2;
    if (i2 %= t2, !i2)
      return t2;
  }
}
function b$1(t2, i2) {
  if (k$3(t2, i2), this instanceof b$1)
    t2 = U$2(A$1.d, A$1.n), this.s = A$1.s, this.n = A$1.n / t2, this.d = A$1.d / t2;
  else
    return I$2(A$1.s * A$1.n, A$1.d);
}
var du = function() {
  return new Error("Division by Zero");
}, Z$1 = function() {
  return new Error("Invalid argument");
}, Qu = function() {
  return new Error("Parameters must be integer");
};
b$1.prototype = {
  s: m$2,
  n: C$3,
  d: m$2,
  /**
   * Calculates the absolute value
   *
   * Ex: new Fraction(-4).abs() => 4
   **/
  abs: function() {
    return I$2(this.n, this.d);
  },
  /**
   * Inverts the sign of the current fraction
   *
   * Ex: new Fraction(-4).neg() => 4
   **/
  neg: function() {
    return I$2(-this.s * this.n, this.d);
  },
  /**
   * Adds two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
   **/
  add: function(t2, i2) {
    return k$3(t2, i2), I$2(
      this.s * this.n * A$1.d + A$1.s * this.d * A$1.n,
      this.d * A$1.d
    );
  },
  /**
   * Subtracts two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
   **/
  sub: function(t2, i2) {
    return k$3(t2, i2), I$2(
      this.s * this.n * A$1.d - A$1.s * this.d * A$1.n,
      this.d * A$1.d
    );
  },
  /**
   * Multiplies two rational numbers
   *
   * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
   **/
  mul: function(t2, i2) {
    return k$3(t2, i2), I$2(
      this.s * A$1.s * this.n * A$1.n,
      this.d * A$1.d
    );
  },
  /**
   * Divides two rational numbers
   *
   * Ex: new Fraction("-17.(345)").inverse().div(3)
   **/
  div: function(t2, i2) {
    return k$3(t2, i2), I$2(
      this.s * A$1.s * this.n * A$1.d,
      this.d * A$1.n
    );
  },
  /**
   * Clones the actual object
   *
   * Ex: new Fraction("-17.(345)").clone()
   **/
  clone: function() {
    return I$2(this.s * this.n, this.d);
  },
  /**
   * Calculates the modulo of two rational numbers - a more precise fmod
   *
   * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
   * Ex: new Fraction(20, 10).mod().equals(0) ? "is Integer"
   **/
  mod: function(t2, i2) {
    if (t2 === void 0)
      return I$2(this.s * this.n % this.d, m$2);
    if (k$3(t2, i2), C$3 === A$1.n * this.d)
      throw du();
    return I$2(
      this.s * (A$1.d * this.n) % (A$1.n * this.d),
      A$1.d * this.d
    );
  },
  /**
   * Calculates the fractional gcd of two rational numbers
   *
   * Ex: new Fraction(5,8).gcd(3,7) => 1/56
   */
  gcd: function(t2, i2) {
    return k$3(t2, i2), I$2(U$2(A$1.n, this.n) * U$2(A$1.d, this.d), A$1.d * this.d);
  },
  /**
   * Calculates the fractional lcm of two rational numbers
   *
   * Ex: new Fraction(5,8).lcm(3,7) => 15
   */
  lcm: function(t2, i2) {
    return k$3(t2, i2), A$1.n === C$3 && this.n === C$3 ? I$2(C$3, m$2) : I$2(A$1.n * this.n, U$2(A$1.n, this.n) * U$2(A$1.d, this.d));
  },
  /**
   * Gets the inverse of the fraction, means numerator and denominator are exchanged
   *
   * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
   **/
  inverse: function() {
    return I$2(this.s * this.d, this.n);
  },
  /**
   * Calculates the fraction to some integer exponent
   *
   * Ex: new Fraction(-1,2).pow(-3) => -8
   */
  pow: function(t2, i2) {
    if (k$3(t2, i2), A$1.d === m$2)
      return A$1.s < C$3 ? I$2((this.s * this.d) ** A$1.n, this.n ** A$1.n) : I$2((this.s * this.n) ** A$1.n, this.d ** A$1.n);
    if (this.s < C$3) return null;
    let e = Q$4(this.n), f2 = Q$4(this.d), l2 = m$2, a = m$2;
    for (let D2 in e)
      if (D2 !== "1") {
        if (D2 === "0") {
          l2 = C$3;
          break;
        }
        if (e[D2] *= A$1.n, e[D2] % A$1.d === C$3)
          e[D2] /= A$1.d;
        else return null;
        l2 *= BigInt(D2) ** e[D2];
      }
    for (let D2 in f2)
      if (D2 !== "1") {
        if (f2[D2] *= A$1.n, f2[D2] % A$1.d === C$3)
          f2[D2] /= A$1.d;
        else return null;
        a *= BigInt(D2) ** f2[D2];
      }
    return A$1.s < C$3 ? I$2(a, l2) : I$2(l2, a);
  },
  /**
   * Calculates the logarithm of a fraction to a given rational base
   *
   * Ex: new Fraction(27, 8).log(9, 4) => 3/2
   */
  log: function(t2, i2) {
    if (k$3(t2, i2), this.s <= C$3 || A$1.s <= C$3) return null;
    const e = {}, f2 = Q$4(A$1.n), l2 = Q$4(A$1.d), a = Q$4(this.n), D2 = Q$4(this.d);
    for (const c in l2)
      f2[c] = (f2[c] || C$3) - l2[c];
    for (const c in D2)
      a[c] = (a[c] || C$3) - D2[c];
    for (const c in f2)
      c !== "1" && (e[c] = true);
    for (const c in a)
      c !== "1" && (e[c] = true);
    let v2 = null, g = null;
    for (const c in e) {
      const F2 = f2[c] || C$3, p = a[c] || C$3;
      if (F2 === C$3) {
        if (p !== C$3)
          return null;
        continue;
      }
      let w2 = p, P2 = F2;
      const R2 = U$2(w2, P2);
      if (w2 /= R2, P2 /= R2, v2 === null && g === null)
        v2 = w2, g = P2;
      else if (w2 * g !== v2 * P2)
        return null;
    }
    return v2 !== null && g !== null ? I$2(v2, g) : null;
  },
  /**
   * Check if two rational numbers are the same
   *
   * Ex: new Fraction(19.6).equals([98, 5]);
   **/
  equals: function(t2, i2) {
    return k$3(t2, i2), this.s * this.n * A$1.d === A$1.s * A$1.n * this.d;
  },
  /**
   * Check if this rational number is less than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  lt: function(t2, i2) {
    return k$3(t2, i2), this.s * this.n * A$1.d < A$1.s * A$1.n * this.d;
  },
  /**
   * Check if this rational number is less than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  lte: function(t2, i2) {
    return k$3(t2, i2), this.s * this.n * A$1.d <= A$1.s * A$1.n * this.d;
  },
  /**
   * Check if this rational number is greater than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  gt: function(t2, i2) {
    return k$3(t2, i2), this.s * this.n * A$1.d > A$1.s * A$1.n * this.d;
  },
  /**
   * Check if this rational number is greater than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  gte: function(t2, i2) {
    return k$3(t2, i2), this.s * this.n * A$1.d >= A$1.s * A$1.n * this.d;
  },
  /**
   * Compare two rational numbers
   * < 0 iff this < that
   * > 0 iff this > that
   * = 0 iff this = that
   *
   * Ex: new Fraction(19.6).compare([98, 5]);
   **/
  compare: function(t2, i2) {
    k$3(t2, i2);
    let e = this.s * this.n * A$1.d - A$1.s * A$1.n * this.d;
    return (C$3 < e) - (e < C$3);
  },
  /**
   * Calculates the ceil of a rational number
   *
   * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
   **/
  ceil: function(t2) {
    return t2 = N$3 ** BigInt(t2 || 0), I$2(
      S$1(this.s * t2 * this.n / this.d) + (t2 * this.n % this.d > C$3 && this.s >= C$3 ? m$2 : C$3),
      t2
    );
  },
  /**
   * Calculates the floor of a rational number
   *
   * Ex: new Fraction('4.(3)').floor() => (4 / 1)
   **/
  floor: function(t2) {
    return t2 = N$3 ** BigInt(t2 || 0), I$2(
      S$1(this.s * t2 * this.n / this.d) - (t2 * this.n % this.d > C$3 && this.s < C$3 ? m$2 : C$3),
      t2
    );
  },
  /**
   * Rounds a rational numbers
   *
   * Ex: new Fraction('4.(3)').round() => (4 / 1)
   **/
  round: function(t2) {
    return t2 = N$3 ** BigInt(t2 || 0), I$2(
      S$1(this.s * t2 * this.n / this.d) + this.s * ((this.s >= C$3 ? m$2 : C$3) + ru * (t2 * this.n % this.d) > this.d ? m$2 : C$3),
      t2
    );
  },
  /**
    * Rounds a rational number to a multiple of another rational number
    *
    * Ex: new Fraction('0.9').roundTo("1/8") => 7 / 8
    **/
  roundTo: function(t2, i2) {
    k$3(t2, i2);
    const e = this.n * A$1.d, f2 = this.d * A$1.n, l2 = e % f2;
    let a = S$1(e / f2);
    return l2 + l2 >= f2 && a++, I$2(this.s * a * A$1.n, A$1.d);
  },
  /**
   * Check if two rational numbers are divisible
   *
   * Ex: new Fraction(19.6).divisible(1.5);
   */
  divisible: function(t2, i2) {
    return k$3(t2, i2), !(!(A$1.n * this.d) || this.n * A$1.d % (A$1.n * this.d));
  },
  /**
   * Returns a decimal representation of the fraction
   *
   * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
   **/
  valueOf: function() {
    return Number(this.s * this.n) / Number(this.d);
  },
  /**
   * Creates a string representation of a fraction with all digits
   *
   * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
   **/
  toString: function(t2) {
    let i2 = this.n, e = this.d;
    t2 = t2 || 15;
    let f2 = Zr(i2, e), l2 = Wr(i2, e, f2), a = this.s < C$3 ? "-" : "";
    if (a += S$1(i2 / e), i2 %= e, i2 *= N$3, i2 && (a += "."), f2) {
      for (let D2 = l2; D2--; )
        a += S$1(i2 / e), i2 %= e, i2 *= N$3;
      a += "(";
      for (let D2 = f2; D2--; )
        a += S$1(i2 / e), i2 %= e, i2 *= N$3;
      a += ")";
    } else
      for (let D2 = t2; i2 && D2--; )
        a += S$1(i2 / e), i2 %= e, i2 *= N$3;
    return a;
  },
  /**
   * Returns a string-fraction representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
   **/
  toFraction: function(t2) {
    let i2 = this.n, e = this.d, f2 = this.s < C$3 ? "-" : "";
    if (e === m$2)
      f2 += i2;
    else {
      let l2 = S$1(i2 / e);
      t2 && l2 > C$3 && (f2 += l2, f2 += " ", i2 %= e), f2 += i2, f2 += "/", f2 += e;
    }
    return f2;
  },
  /**
   * Returns a latex representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
   **/
  toLatex: function(t2) {
    let i2 = this.n, e = this.d, f2 = this.s < C$3 ? "-" : "";
    if (e === m$2)
      f2 += i2;
    else {
      let l2 = S$1(i2 / e);
      t2 && l2 > C$3 && (f2 += l2, i2 %= e), f2 += "\\frac{", f2 += i2, f2 += "}{", f2 += e, f2 += "}";
    }
    return f2;
  },
  /**
   * Returns an array of continued fraction elements
   *
   * Ex: new Fraction("7/8").toContinued() => [0,1,7]
   */
  toContinued: function() {
    let t2 = this.n, i2 = this.d, e = [];
    do {
      e.push(S$1(t2 / i2));
      let f2 = t2 % i2;
      t2 = i2, i2 = f2;
    } while (t2 !== m$2);
    return e;
  },
  simplify: function(t2) {
    const i2 = BigInt(1 / (t2 || 1e-3) | 0), e = this.abs(), f2 = e.toContinued();
    for (let l2 = 1; l2 < f2.length; l2++) {
      let a = I$2(f2[l2 - 1], m$2);
      for (let v2 = l2 - 2; v2 >= 0; v2--)
        a = a.inverse().add(f2[v2]);
      let D2 = a.sub(e);
      if (D2.n * i2 < D2.d)
        return a.mul(this.s);
    }
    return this;
  }
};
let L$1 = class L2 {
  constructor(i2, e) {
    this.begin = W$1(i2), this.end = W$1(e);
  }
  get spanCycles() {
    const i2 = [];
    var e = this.begin;
    const f2 = this.end, l2 = f2.sam();
    if (e.equals(f2))
      return [new L2(e, f2)];
    for (; f2.gt(e); ) {
      if (e.sam().equals(l2)) {
        i2.push(new L2(e, this.end));
        break;
      }
      const a = e.nextSam();
      i2.push(new L2(e, a)), e = a;
    }
    return i2;
  }
  get duration() {
    return this.end.sub(this.begin);
  }
  cycleArc() {
    const i2 = this.begin.cyclePos(), e = i2.add(this.duration);
    return new L2(i2, e);
  }
  withTime(i2) {
    return new L2(i2(this.begin), i2(this.end));
  }
  withEnd(i2) {
    return new L2(this.begin, i2(this.end));
  }
  withCycle(i2) {
    const e = this.begin.sam(), f2 = e.add(i2(this.begin.sub(e))), l2 = e.add(i2(this.end.sub(e)));
    return new L2(f2, l2);
  }
  intersection(i2) {
    const e = this.begin.max(i2.begin), f2 = this.end.min(i2.end);
    if (!e.gt(f2) && !(e.equals(f2) && (e.equals(this.end) && this.begin.lt(this.end) || e.equals(i2.end) && i2.begin.lt(i2.end))))
      return new L2(e, f2);
  }
  intersection_e(i2) {
    const e = this.intersection(i2);
    if (e == null)
      throw "TimeSpans do not intersect";
    return e;
  }
  midpoint() {
    return this.begin.add(this.duration.div(W$1(2)));
  }
  equals(i2) {
    return this.begin.equals(i2.begin) && this.end.equals(i2.end);
  }
  show() {
    return this.begin.show() + " → " + this.end.show();
  }
};
const Ur = (t2) => t2.filter((i2) => i2 != null);
b$1.prototype.sam = function() {
  return this.floor();
};
b$1.prototype.nextSam = function() {
  return this.sam().add(1);
};
b$1.prototype.wholeCycle = function() {
  return new L$1(this.sam(), this.nextSam());
};
b$1.prototype.cyclePos = function() {
  return this.sub(this.sam());
};
b$1.prototype.lt = function(t2) {
  return this.compare(t2) < 0;
};
b$1.prototype.gt = function(t2) {
  return this.compare(t2) > 0;
};
b$1.prototype.lte = function(t2) {
  return this.compare(t2) <= 0;
};
b$1.prototype.gte = function(t2) {
  return this.compare(t2) >= 0;
};
b$1.prototype.eq = function(t2) {
  return this.compare(t2) == 0;
};
b$1.prototype.ne = function(t2) {
  return this.compare(t2) != 0;
};
b$1.prototype.max = function(t2) {
  return this.gt(t2) ? this : t2;
};
b$1.prototype.maximum = function(...t2) {
  return t2 = t2.map((i2) => new b$1(i2)), t2.reduce((i2, e) => e.max(i2), this);
};
b$1.prototype.min = function(t2) {
  return this.lt(t2) ? this : t2;
};
b$1.prototype.mulmaybe = function(t2) {
  return t2 !== void 0 ? this.mul(t2) : void 0;
};
b$1.prototype.divmaybe = function(t2) {
  return t2 !== void 0 ? this.div(t2) : void 0;
};
b$1.prototype.addmaybe = function(t2) {
  return t2 !== void 0 ? this.add(t2) : void 0;
};
b$1.prototype.submaybe = function(t2) {
  return t2 !== void 0 ? this.sub(t2) : void 0;
};
b$1.prototype.show = function() {
  return this.s * this.n + "/" + this.d;
};
b$1.prototype.or = function(t2) {
  return this.eq(0) ? t2 : this;
};
const W$1 = (t2) => b$1(t2), cu = (...t2) => {
  if (t2 = Ur(t2), t2.length === 0)
    return;
  const i2 = t2.pop();
  return t2.reduce(
    (e, f2) => e === void 0 || f2 === void 0 ? void 0 : e.lcm(f2),
    i2
  );
};
W$1._original = b$1;
const ue = 3e-4, Vr = (t2, i2) => (e, f2) => {
  var _a2;
  const D2 = (_a2 = t2.source_[f2].options_) == null ? void 0 : _a2.ops, v2 = e.__steps_source;
  if (D2)
    for (const g of D2)
      switch (g.type_) {
        case "stretch": {
          const c = ["fast", "slow"], { type: F2, amount: p } = g.arguments_;
          if (!c.includes(F2))
            throw new Error(`mini: stretch: type must be one of ${c.join("|")} but got ${F2}`);
          e = d$1(e)[F2](i2(p));
          break;
        }
        case "replicate": {
          const { amount: c } = g.arguments_;
          e = d$1(e), e = e._repeatCycles(c)._fast(c);
          break;
        }
        case "bjorklund": {
          g.arguments_.rotation ? e = e.euclidRot(i2(g.arguments_.pulse), i2(g.arguments_.step), i2(g.arguments_.rotation)) : e = e.euclid(i2(g.arguments_.pulse), i2(g.arguments_.step));
          break;
        }
        case "degradeBy": {
          e = d$1(e)._degradeByWith(L$2.early(ue * g.arguments_.seed), g.arguments_.amount ?? 0.5);
          break;
        }
        case "tail": {
          const c = i2(g.arguments_.element);
          e = e.fmap((F2) => (p) => Array.isArray(F2) ? [...F2, p] : [F2, p]).appLeft(c);
          break;
        }
        case "range": {
          const c = i2(g.arguments_.element);
          e = d$1(e);
          const F2 = (w2, P2, R2 = 1) => Array.from(
            { length: Math.abs(P2 - w2) / R2 + 1 },
            (su2, iu2) => w2 < P2 ? w2 + iu2 * R2 : w2 - iu2 * R2
          );
          e = ((w2, P2) => w2.squeezeBind((R2) => P2.bind((su2) => W$3(...F2(R2, su2)))))(e, c);
          break;
        }
        default:
          console.warn(`operator "${g.type_}" not implemented`);
      }
  return e.__steps_source = e.__steps_source || v2, e;
};
function nu(t2, i2, e, f2 = 0) {
  e == null ? void 0 : e(t2);
  const l2 = (a) => nu(a, i2, e, f2);
  switch (t2.type_) {
    case "pattern": {
      const a = t2.source_.map((c) => l2(c)).map(Vr(t2, l2)), D2 = t2.arguments_.alignment, v2 = a.filter((c) => c.__steps_source);
      let g;
      switch (D2) {
        case "stack": {
          g = B$2(...a), v2.length && (g._steps = cu(...v2.map((c) => W$1(c._steps))));
          break;
        }
        case "polymeter_slowcat": {
          g = B$2(...a.map((c) => c._slow(c.__weight))), v2.length && (g._steps = cu(...v2.map((c) => W$1(c._steps))));
          break;
        }
        case "polymeter": {
          const c = t2.arguments_.stepsPerCycle ? l2(t2.arguments_.stepsPerCycle).fmap((p) => h(p)) : z$1(h(a.length > 0 ? a[0].__weight : 1)), F2 = a.map((p) => p.fast(c.fmap((w2) => w2.div(p.__weight))));
          g = B$2(...F2);
          break;
        }
        case "rand": {
          g = ge$2(L$2.early(ue * t2.arguments_.seed).segment(1), a), v2.length && (g._steps = cu(...v2.map((c) => W$1(c._steps))));
          break;
        }
        case "feet": {
          g = W$3(...a);
          break;
        }
        default: {
          if (t2.source_.some((F2) => {
            var _a2;
            return !!((_a2 = F2.options_) == null ? void 0 : _a2.weight);
          })) {
            const F2 = t2.source_.reduce(
              (p, w2) => {
                var _a2;
                return p.add(((_a2 = w2.options_) == null ? void 0 : _a2.weight) || h(1));
              },
              h(0)
            );
            g = Pn$1(
              ...t2.source_.map((p, w2) => {
                var _a2;
                return [((_a2 = p.options_) == null ? void 0 : _a2.weight) || h(1), a[w2]];
              })
            ), g.__weight = F2, g._steps = F2, v2.length && (g._steps = g._steps.mul(cu(...v2.map((p) => W$1(p._steps)))));
          } else
            g = G$3(...a), g._steps = a.length;
          t2.arguments_._steps && (g.__steps_source = true);
        }
      }
      return v2.length && (g.__steps_source = true), g;
    }
    case "element":
      return l2(t2.source_);
    case "atom": {
      if (t2.source_ === "~" || t2.source_ === "-")
        return v$2;
      if (!t2.location_)
        return console.warn("no location for", t2), t2.source_;
      const a = isNaN(Number(t2.source_)) ? t2.source_ : Number(t2.source_);
      if (f2 === -1)
        return z$1(a);
      const [D2, v2] = ee(i2, t2, f2);
      return z$1(a).withLoc(D2, v2);
    }
    case "stretch":
      return l2(t2.source_).slow(l2(t2.arguments_.amount));
    default:
      return console.warn(`node type "${t2.type_}" not implemented -> returning silence`), v$2;
  }
}
const ee = (t2, i2, e = 0) => {
  const { start: f2, end: l2 } = i2.location_, a = t2 == null ? void 0 : t2.split("").slice(f2.offset, l2.offset).join(""), [D2 = 0, v2 = 0] = a ? a.split(i2.source_).map((g) => g.split("").filter((c) => c === " ").length) : [];
  return [f2.offset + D2 + e, l2.offset - v2 + e];
}, Au = (t2, i2 = 0, e = t2) => {
  try {
    return Mr(t2);
  } catch (f2) {
    const l2 = [f2.location.start.offset + i2, f2.location.end.offset + i2], a = e.slice(0, l2[0]).split(`
`).length;
    throw new Error(`[mini] parse error at line ${a}: ${f2.message}`);
  }
}, Xr = (t2, i2, e) => {
  const f2 = Au(t2, i2, e);
  let l2 = [];
  return nu(
    f2,
    t2,
    (a) => {
      a.type_ === "atom" && l2.push(a);
    },
    -1
  ), l2;
}, Yr = (t2, i2 = 0, e) => Xr(t2, i2, e).map((f2) => ee(t2, f2, i2)), te = (...t2) => {
  const i2 = t2.map((e) => {
    const f2 = `"${e}"`, l2 = Au(f2);
    return nu(l2, f2);
  });
  return G$3(...i2);
}, Hr = (t2, i2) => {
  const e = `"${t2}"`, f2 = Au(e);
  return nu(f2, e, null, i2);
}, Jr = (t2) => {
  const i2 = Au(t2);
  return nu(i2, t2);
};
function Kr(t2) {
  return typeof t2 == "string" ? te(t2) : d$1(t2);
}
function Qr() {
  nl(te);
}
const Mini = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  StartRules: Gr,
  SyntaxError: uu,
  getLeafLocation: ee,
  getLeafLocations: Yr,
  getLeaves: Xr,
  h: Jr,
  m: Hr,
  mini: te,
  mini2ast: Au,
  miniAllStrings: Qr,
  minify: Kr,
  parse: Mr,
  patternifyAST: nu
}, Symbol.toStringTag, { value: "Module" }));
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 7, 9, 32, 4, 318, 1, 80, 3, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 68, 8, 2, 0, 3, 0, 2, 3, 2, 4, 2, 0, 15, 1, 83, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 7, 19, 58, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 343, 9, 54, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 10, 5350, 0, 7, 14, 11465, 27, 2343, 9, 87, 9, 39, 4, 60, 6, 26, 9, 535, 9, 470, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4178, 9, 519, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 245, 1, 2, 9, 726, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 4, 51, 13, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 39, 27, 10, 22, 251, 41, 7, 1, 17, 2, 60, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 31, 9, 2, 0, 3, 0, 2, 37, 2, 0, 26, 0, 2, 0, 45, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 200, 32, 32, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 26, 3994, 6, 582, 6842, 29, 1763, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 433, 44, 212, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 42, 9, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 229, 29, 3, 0, 496, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191];
var nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߽߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࢗ-࢟࣊-ࣣ࣡-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯৾ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ૺ-૿ଁ-ଃ଼ା-ୄେୈୋ-୍୕-ୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఄ఼ా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ೳഀ-ഃ഻഼ാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ඁ-ඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ຼ່-໎໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜕ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠏-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᪿ-ᫎᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭᳴᳷-᳹᷀-᷿‌‍‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯・꘠-꘩꙯ꙴ-꙽ꚞꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧ꠬ꢀꢁꢴ-ꣅ꣐-꣙꣠-꣱ꣿ-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︯︳︴﹍-﹏０-９＿･";
var nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࡰ-ࢇࢉ-ࢎࢠ-ࣉऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౝౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೝೞೠೡೱೲഄ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜑᜟ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭌᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲊᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆿㇰ-ㇿ㐀-䶿一-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꟍꟐꟑꟓꟕ-Ƛꟲ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭩꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords$1 = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
function isInAstralSet(code2, set) {
  var pos = 65536;
  for (var i2 = 0; i2 < set.length; i2 += 2) {
    pos += set[i2];
    if (pos > code2) {
      return false;
    }
    pos += set[i2 + 1];
    if (pos >= code2) {
      return true;
    }
  }
  return false;
}
function isIdentifierStart(code2, astral) {
  if (code2 < 65) {
    return code2 === 36;
  }
  if (code2 < 91) {
    return true;
  }
  if (code2 < 97) {
    return code2 === 95;
  }
  if (code2 < 123) {
    return true;
  }
  if (code2 <= 65535) {
    return code2 >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code2));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code2, astralIdentifierStartCodes);
}
function isIdentifierChar(code2, astral) {
  if (code2 < 48) {
    return code2 === 36;
  }
  if (code2 < 58) {
    return true;
  }
  if (code2 < 65) {
    return false;
  }
  if (code2 < 91) {
    return true;
  }
  if (code2 < 97) {
    return code2 === 95;
  }
  if (code2 < 123) {
    return true;
  }
  if (code2 <= 65535) {
    return code2 >= 170 && nonASCIIidentifier.test(String.fromCharCode(code2));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code2, astralIdentifierStartCodes) || isInAstralSet(code2, astralIdentifierCodes);
}
var TokenType = function TokenType2(label, conf) {
  if (conf === void 0) conf = {};
  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};
function binop(name2, prec) {
  return new TokenType(name2, { beforeExpr: true, binop: prec });
}
var beforeExpr = { beforeExpr: true }, startsExpr = { startsExpr: true };
var keywords = {};
function kw(name2, options) {
  if (options === void 0) options = {};
  options.keyword = name2;
  return keywords[name2] = new TokenType(name2, options);
}
var types$1 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  privateId: new TokenType("privateId", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: true }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: true, beforeExpr: true }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: true }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: true }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: true, startsExpr: true }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: true, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
  _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
  _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code2) {
  return code2 === 10 || code2 === 13 || code2 === 8232 || code2 === 8233;
}
function nextLineBreak(code2, from, end) {
  if (end === void 0) end = code2.length;
  for (var i2 = from; i2 < end; i2++) {
    var next = code2.charCodeAt(i2);
    if (isNewLine(next)) {
      return i2 < end - 1 && next === 13 && code2.charCodeAt(i2 + 1) === 10 ? i2 + 2 : i2 + 1;
    }
  }
  return -1;
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString = ref.toString;
var hasOwn = Object.hasOwn || function(obj, propName) {
  return hasOwnProperty.call(obj, propName);
};
var isArray = Array.isArray || function(obj) {
  return toString.call(obj) === "[object Array]";
};
var regexpCache = /* @__PURE__ */ Object.create(null);
function wordsRegexp(words) {
  return regexpCache[words] || (regexpCache[words] = new RegExp("^(?:" + words.replace(/ /g, "|") + ")$"));
}
function codePointToString(code2) {
  if (code2 <= 65535) {
    return String.fromCharCode(code2);
  }
  code2 -= 65536;
  return String.fromCharCode((code2 >> 10) + 55296, (code2 & 1023) + 56320);
}
var loneSurrogate = /(?:[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/;
var Position = function Position2(line, col) {
  this.line = line;
  this.column = col;
};
Position.prototype.offset = function offset(n) {
  return new Position(this.line, this.column + n);
};
var SourceLocation = function SourceLocation2(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) {
    this.source = p.sourceFile;
  }
};
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    var nextBreak = nextLineBreak(input, cur, offset2);
    if (nextBreak < 0) {
      return new Position(line, offset2 - cur);
    }
    ++line;
    cur = nextBreak;
  }
}
var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (or 2015), 7 (2016), 8 (2017), 9 (2018), 10
  // (2019), 11 (2020), 12 (2021), 13 (2022), 14 (2023), or `"latest"`
  // (the latest version the library supports). This influences
  // support for strict mode, the set of reserved words, and support
  // for new syntax features.
  ecmaVersion: null,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called when
  // a semicolon is automatically inserted. It will be passed the
  // position of the inserted semicolon as an offset, and if
  // `locations` is enabled, it is given the location as a `{line,
  // column}` object as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program, and an import.meta expression
  // in a script isn't considered an error.
  allowImportExportEverywhere: false,
  // By default, await identifiers are allowed to appear at the top-level scope only if ecmaVersion >= 2022.
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: null,
  // When enabled, super identifiers are not constrained to
  // appearing in methods and do not raise an error when they appear elsewhere.
  allowSuperOutsideMethod: null,
  // When enabled, hashbang directive in the beginning of file is
  // allowed and treated as a line comment. Enabled by default when
  // `ecmaVersion` >= 2023.
  allowHashBang: false,
  // By default, the parser will verify that private properties are
  // only used in places where they are valid and have been declared.
  // Set this to false to turn such checks off.
  checkPrivateFields: true,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  // When this option has an array as value, objects representing the
  // comments are pushed to it.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};
var warnedAboutEcmaVersion = false;
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions) {
    options[opt] = opts && hasOwn(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }
  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }
  if (!opts || opts.allowHashBang == null) {
    options.allowHashBang = options.ecmaVersion >= 14;
  }
  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }
  return options;
}
function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment2 = {
      type: block ? "Block" : "Line",
      value: text,
      start,
      end
    };
    if (options.locations) {
      comment2.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment2.range = [start, end];
    }
    array.push(comment2);
  };
}
var SCOPE_TOP = 1, SCOPE_FUNCTION = 2, SCOPE_ASYNC = 4, SCOPE_GENERATOR = 8, SCOPE_ARROW = 16, SCOPE_SIMPLE_CATCH = 32, SCOPE_SUPER = 64, SCOPE_DIRECT_SUPER = 128, SCOPE_CLASS_STATIC_BLOCK = 256, SCOPE_CLASS_FIELD_INIT = 512, SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION | SCOPE_CLASS_STATIC_BLOCK;
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0, BIND_VAR = 1, BIND_LEXICAL = 2, BIND_FUNCTION = 3, BIND_SIMPLE_CATCH = 4, BIND_OUTSIDE = 5;
var Parser = function Parser2(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords$1[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved = "";
  if (options.allowReserved !== true) {
    reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
    if (options.sourceType === "module") {
      reserved += " await";
    }
  }
  this.reservedWords = wordsRegexp(reserved);
  var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);
  this.containsEsc = false;
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }
  this.type = types$1.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;
  this.context = this.initialContext();
  this.exprAllowed = true;
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);
  this.potentialArrowAt = -1;
  this.potentialArrowInForAwait = false;
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = /* @__PURE__ */ Object.create(null);
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);
  this.regexpState = null;
  this.privateNameStack = [];
};
var prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, canAwait: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, allowNewDotTarget: { configurable: true }, inClassStaticBlock: { configurable: true } };
Parser.prototype.parse = function parse2() {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node);
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
};
prototypeAccessors.canAwait.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT)) {
      return false;
    }
    if (flags & SCOPE_FUNCTION) {
      return (flags & SCOPE_ASYNC) > 0;
    }
  }
  return this.inModule && this.options.ecmaVersion >= 13 || this.options.allowAwaitOutsideFunction;
};
prototypeAccessors.allowSuper.get = function() {
  var ref2 = this.currentThisScope();
  var flags = ref2.flags;
  return (flags & SCOPE_SUPER) > 0 || this.options.allowSuperOutsideMethod;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
prototypeAccessors.allowNewDotTarget.get = function() {
  for (var i2 = this.scopeStack.length - 1; i2 >= 0; i2--) {
    var ref2 = this.scopeStack[i2];
    var flags = ref2.flags;
    if (flags & (SCOPE_CLASS_STATIC_BLOCK | SCOPE_CLASS_FIELD_INIT) || flags & SCOPE_FUNCTION && !(flags & SCOPE_ARROW)) {
      return true;
    }
  }
  return false;
};
prototypeAccessors.inClassStaticBlock.get = function() {
  return (this.currentVarScope().flags & SCOPE_CLASS_STATIC_BLOCK) > 0;
};
Parser.extend = function extend() {
  var plugins = [], len = arguments.length;
  while (len--) plugins[len] = arguments[len];
  var cls = this;
  for (var i2 = 0; i2 < plugins.length; i2++) {
    cls = plugins[i2](cls);
  }
  return cls;
};
Parser.parse = function parse3(input, options) {
  return new this(options, input).parse();
};
Parser.parseExpressionAt = function parseExpressionAt(input, pos, options) {
  var parser = new this(options, input, pos);
  parser.nextToken();
  return parser.parseExpression();
};
Parser.tokenizer = function tokenizer(input, options) {
  return new this(options, input);
};
Object.defineProperties(Parser.prototype, prototypeAccessors);
var pp$9 = Parser.prototype;
var literal$1 = /^(?:'((?:\\[^]|[^'\\])*?)'|"((?:\\[^]|[^"\\])*?)")/;
pp$9.strictDirective = function(start) {
  if (this.options.ecmaVersion < 5) {
    return false;
  }
  for (; ; ) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal$1.exec(this.input.slice(start));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next = this.input.charAt(end);
      return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
    }
    start += match[0].length;
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";") {
      start++;
    }
  }
};
pp$9.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};
pp$9.isContextual = function(name2) {
  return this.type === types$1.name && this.value === name2 && !this.containsEsc;
};
pp$9.eatContextual = function(name2) {
  if (!this.isContextual(name2)) {
    return false;
  }
  this.next();
  return true;
};
pp$9.expectContextual = function(name2) {
  if (!this.eatContextual(name2)) {
    this.unexpected();
  }
};
pp$9.canInsertSemicolon = function() {
  return this.type === types$1.eof || this.type === types$1.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$9.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};
pp$9.semicolon = function() {
  if (!this.eat(types$1.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};
pp$9.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};
pp$9.expect = function(type) {
  this.eat(type) || this.unexpected();
};
pp$9.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};
var DestructuringErrors = function DestructuringErrors2() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
};
pp$9.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, isAssign ? "Assigning to rvalue" : "Parenthesized pattern");
  }
};
pp$9.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};
pp$9.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};
pp$9.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$8 = Parser.prototype;
pp$8.parseTopLevel = function(node) {
  var exports$1 = /* @__PURE__ */ Object.create(null);
  if (!node.body) {
    node.body = [];
  }
  while (this.type !== types$1.eof) {
    var stmt = this.parseStatement(null, true, exports$1);
    node.body.push(stmt);
  }
  if (this.inModule) {
    for (var i2 = 0, list2 = Object.keys(this.undefinedExports); i2 < list2.length; i2 += 1) {
      var name2 = list2[i2];
      this.raiseRecoverable(this.undefinedExports[name2].start, "Export '" + name2 + "' is not defined");
    }
  }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program");
};
var loopLabel = { kind: "loop" }, switchLabel = { kind: "switch" };
pp$8.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
  if (nextCh === 91 || nextCh === 92) {
    return true;
  }
  if (context) {
    return false;
  }
  if (nextCh === 123 || nextCh > 55295 && nextCh < 56320) {
    return true;
  }
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) {
      ++pos;
    }
    if (nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
      return true;
    }
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) {
      return true;
    }
  }
  return false;
};
pp$8.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, after;
  return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 55295 && after < 56320));
};
pp$8.isUsingKeyword = function(isAwaitUsing, isFor) {
  if (this.options.ecmaVersion < 17 || !this.isContextual(isAwaitUsing ? "await" : "using")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length;
  if (lineBreak.test(this.input.slice(this.pos, next))) {
    return false;
  }
  if (isAwaitUsing) {
    var awaitEndPos = next + 5, after;
    if (this.input.slice(next, awaitEndPos) !== "using" || awaitEndPos === this.input.length || isIdentifierChar(after = this.input.charCodeAt(awaitEndPos)) || after > 55295 && after < 56320) {
      return false;
    }
    skipWhiteSpace.lastIndex = awaitEndPos;
    var skipAfterUsing = skipWhiteSpace.exec(this.input);
    if (skipAfterUsing && lineBreak.test(this.input.slice(awaitEndPos, awaitEndPos + skipAfterUsing[0].length))) {
      return false;
    }
  }
  if (isFor) {
    var ofEndPos = next + 2, after$1;
    if (this.input.slice(next, ofEndPos) === "of") {
      if (ofEndPos === this.input.length || !isIdentifierChar(after$1 = this.input.charCodeAt(ofEndPos)) && !(after$1 > 55295 && after$1 < 56320)) {
        return false;
      }
    }
  }
  var ch2 = this.input.charCodeAt(next);
  return isIdentifierStart(ch2, true) || ch2 === 92;
};
pp$8.isAwaitUsing = function(isFor) {
  return this.isUsingKeyword(true, isFor);
};
pp$8.isUsing = function(isFor) {
  return this.isUsingKeyword(false, isFor);
};
pp$8.parseStatement = function(context, topLevel, exports$1) {
  var starttype = this.type, node = this.startNode(), kind;
  if (this.isLet(context)) {
    starttype = types$1._var;
    kind = "let";
  }
  switch (starttype) {
    case types$1._break:
    case types$1._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case types$1._debugger:
      return this.parseDebuggerStatement(node);
    case types$1._do:
      return this.parseDoStatement(node);
    case types$1._for:
      return this.parseForStatement(node);
    case types$1._function:
      if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node, false, !context);
    case types$1._class:
      if (context) {
        this.unexpected();
      }
      return this.parseClass(node, true);
    case types$1._if:
      return this.parseIfStatement(node);
    case types$1._return:
      return this.parseReturnStatement(node);
    case types$1._switch:
      return this.parseSwitchStatement(node);
    case types$1._throw:
      return this.parseThrowStatement(node);
    case types$1._try:
      return this.parseTryStatement(node);
    case types$1._const:
    case types$1._var:
      kind = kind || this.value;
      if (context && kind !== "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node, kind);
    case types$1._while:
      return this.parseWhileStatement(node);
    case types$1._with:
      return this.parseWithStatement(node);
    case types$1.braceL:
      return this.parseBlock(true, node);
    case types$1.semi:
      return this.parseEmptyStatement(node);
    case types$1._export:
    case types$1._import:
      if (this.options.ecmaVersion > 10 && starttype === types$1._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40 || nextCh === 46) {
          return this.parseExpressionStatement(node, this.parseExpression());
        }
      }
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types$1._import ? this.parseImport(node) : this.parseExport(node, exports$1);
    default:
      if (this.isAsyncFunction()) {
        if (context) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node, true, !context);
      }
      var usingKind = this.isAwaitUsing(false) ? "await using" : this.isUsing(false) ? "using" : null;
      if (usingKind) {
        if (topLevel && this.options.sourceType === "script") {
          this.raise(this.start, "Using declaration cannot appear in the top level when source type is `script`");
        }
        if (usingKind === "await using") {
          if (!this.canAwait) {
            this.raise(this.start, "Await using cannot appear outside of async function");
          }
          this.next();
        }
        this.next();
        this.parseVar(node, false, usingKind);
        this.semicolon();
        return this.finishNode(node, "VariableDeclaration");
      }
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types$1.name && expr.type === "Identifier" && this.eat(types$1.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};
pp$8.parseBreakContinueStatement = function(node, keyword2) {
  var isBreak = keyword2 === "break";
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.label = null;
  } else if (this.type !== types$1.name) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }
  var i2 = 0;
  for (; i2 < this.labels.length; ++i2) {
    var lab = this.labels[i2];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node.label && isBreak) {
        break;
      }
    }
  }
  if (i2 === this.labels.length) {
    this.raise(node.start, "Unsyntactic " + keyword2);
  }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$8.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};
pp$8.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types$1._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types$1.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node, "DoWhileStatement");
};
pp$8.parseForStatement = function(node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && this.canAwait && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types$1.parenL);
  if (this.type === types$1.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types$1._var || this.type === types$1._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    return this.parseForAfterInit(node, init$1, awaitAt);
  }
  var startsWithLet = this.isContextual("let"), isForOf = false;
  var usingKind = this.isUsing(true) ? "using" : this.isAwaitUsing(true) ? "await using" : null;
  if (usingKind) {
    var init$2 = this.startNode();
    this.next();
    if (usingKind === "await using") {
      this.next();
    }
    this.parseVar(init$2, true, usingKind);
    this.finishNode(init$2, "VariableDeclaration");
    return this.parseForAfterInit(node, init$2, awaitAt);
  }
  var containsEsc = this.containsEsc;
  var refDestructuringErrors = new DestructuringErrors();
  var initPos = this.start;
  var init = awaitAt > -1 ? this.parseExprSubscripts(refDestructuringErrors, "await") : this.parseExpression(true, refDestructuringErrors);
  if (this.type === types$1._in || (isForOf = this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
    if (awaitAt > -1) {
      if (this.type === types$1._in) {
        this.unexpected(awaitAt);
      }
      node.await = true;
    } else if (isForOf && this.options.ecmaVersion >= 8) {
      if (init.start === initPos && !containsEsc && init.type === "Identifier" && init.name === "async") {
        this.unexpected();
      } else if (this.options.ecmaVersion >= 9) {
        node.await = false;
      }
    }
    if (startsWithLet && isForOf) {
      this.raise(init.start, "The left-hand side of a for-of loop may not start with 'let'.");
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLValPattern(init);
    return this.parseForIn(node, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseForAfterInit = function(node, init, awaitAt) {
  if ((this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init.declarations.length === 1) {
    if (this.options.ecmaVersion >= 9) {
      if (this.type === types$1._in) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
      } else {
        node.await = awaitAt > -1;
      }
    }
    return this.parseForIn(node, init);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$8.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$8.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types$1._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement");
};
pp$8.parseReturnStatement = function(node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();
  if (this.eat(types$1.semi) || this.insertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};
pp$8.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types$1.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);
  var cur;
  for (var sawDefault = false; this.type !== types$1.braceR; ) {
    if (this.type === types$1._case || this.type === types$1._default) {
      var isCase = this.type === types$1._case;
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) {
          this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types$1.colon);
    } else {
      if (!cur) {
        this.unexpected();
      }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next();
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};
pp$8.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};
var empty$1 = [];
pp$8.parseCatchClauseParam = function() {
  var param = this.parseBindingAtom();
  var simple = param.type === "Identifier";
  this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
  this.checkLValPattern(param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
  this.expect(types$1.parenR);
  return param;
};
pp$8.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types$1._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types$1.parenL)) {
      clause.param = this.parseCatchClauseParam();
    } else {
      if (this.options.ecmaVersion < 10) {
        this.unexpected();
      }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types$1._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }
  return this.finishNode(node, "TryStatement");
};
pp$8.parseVarStatement = function(node, kind, allowMissingInitializer) {
  this.next();
  this.parseVar(node, false, kind, allowMissingInitializer);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};
pp$8.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};
pp$8.parseWithStatement = function(node) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement");
};
pp$8.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};
pp$8.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$12 = 0, list2 = this.labels; i$12 < list2.length; i$12 += 1) {
    var label = list2[i$12];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types$1._switch ? "switch" : null;
  for (var i2 = this.labels.length - 1; i2 >= 0; i2--) {
    var label$1 = this.labels[i2];
    if (label$1.statementStart === node.start) {
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({ name: maybeName, kind, statementStart: this.start });
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};
pp$8.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};
pp$8.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if (createNewLexicalScope === void 0) createNewLexicalScope = true;
  if (node === void 0) node = this.startNode();
  node.body = [];
  this.expect(types$1.braceL);
  if (createNewLexicalScope) {
    this.enterScope(0);
  }
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) {
    this.strict = false;
  }
  this.next();
  if (createNewLexicalScope) {
    this.exitScope();
  }
  return this.finishNode(node, "BlockStatement");
};
pp$8.parseFor = function(node, init) {
  node.init = init;
  this.expect(types$1.semi);
  node.test = this.type === types$1.semi ? null : this.parseExpression();
  this.expect(types$1.semi);
  node.update = this.type === types$1.parenR ? null : this.parseExpression();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};
pp$8.parseForIn = function(node, init) {
  var isForIn = this.type === types$1._in;
  this.next();
  if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
    this.raise(
      init.start,
      (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
    );
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types$1.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$8.parseVar = function(node, isFor, kind, allowMissingInitializer) {
  node.declarations = [];
  node.kind = kind;
  for (; ; ) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types$1.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (!allowMissingInitializer && kind === "const" && !(this.type === types$1._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.unexpected();
    } else if (!allowMissingInitializer && (kind === "using" || kind === "await using") && this.options.ecmaVersion >= 17 && this.type !== types$1._in && !this.isContextual("of")) {
      this.raise(this.lastTokEnd, "Missing initializer in " + kind + " declaration");
    } else if (!allowMissingInitializer && decl.id.type !== "Identifier" && !(isFor && (this.type === types$1._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types$1.comma)) {
      break;
    }
  }
  return node;
};
pp$8.parseVarId = function(decl, kind) {
  decl.id = kind === "using" || kind === "await using" ? this.parseIdent() : this.parseBindingAtom();
  this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1, FUNC_HANGING_STATEMENT = 2, FUNC_NULLABLE_ID = 4;
pp$8.parseFunction = function(node, statement, allowExpressionBody, isAsync, forInit) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types$1.star && statement & FUNC_HANGING_STATEMENT) {
      this.unexpected();
    }
    node.generator = this.eat(types$1.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  if (statement & FUNC_STATEMENT) {
    node.id = statement & FUNC_NULLABLE_ID && this.type !== types$1.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
      this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
    }
  }
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));
  if (!(statement & FUNC_STATEMENT)) {
    node.id = this.type === types$1.name ? this.parseIdent() : null;
  }
  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$8.parseFunctionParams = function(node) {
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};
pp$8.parseClass = function(node, isStatement) {
  this.next();
  var oldStrict = this.strict;
  this.strict = true;
  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var privateNameMap = this.enterClassBody();
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types$1.braceL);
  while (this.type !== types$1.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) {
          this.raiseRecoverable(element.start, "Duplicate constructor in the same class");
        }
        hadConstructor = true;
      } else if (element.key && element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
        this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  this.exitClassBody();
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$8.parseClassElement = function(constructorAllowsSuper) {
  if (this.eat(types$1.semi)) {
    return null;
  }
  var ecmaVersion2 = this.options.ecmaVersion;
  var node = this.startNode();
  var keyName = "";
  var isGenerator = false;
  var isAsync = false;
  var kind = "method";
  var isStatic = false;
  if (this.eatContextual("static")) {
    if (ecmaVersion2 >= 13 && this.eat(types$1.braceL)) {
      this.parseClassStaticBlock(node);
      return node;
    }
    if (this.isClassElementNameStart() || this.type === types$1.star) {
      isStatic = true;
    } else {
      keyName = "static";
    }
  }
  node.static = isStatic;
  if (!keyName && ecmaVersion2 >= 8 && this.eatContextual("async")) {
    if ((this.isClassElementNameStart() || this.type === types$1.star) && !this.canInsertSemicolon()) {
      isAsync = true;
    } else {
      keyName = "async";
    }
  }
  if (!keyName && (ecmaVersion2 >= 9 || !isAsync) && this.eat(types$1.star)) {
    isGenerator = true;
  }
  if (!keyName && !isAsync && !isGenerator) {
    var lastValue = this.value;
    if (this.eatContextual("get") || this.eatContextual("set")) {
      if (this.isClassElementNameStart()) {
        kind = lastValue;
      } else {
        keyName = lastValue;
      }
    }
  }
  if (keyName) {
    node.computed = false;
    node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
    node.key.name = keyName;
    this.finishNode(node.key, "Identifier");
  } else {
    this.parseClassElementName(node);
  }
  if (ecmaVersion2 < 13 || this.type === types$1.parenL || kind !== "method" || isGenerator || isAsync) {
    var isConstructor = !node.static && checkKeyName(node, "constructor");
    var allowsDirectSuper = isConstructor && constructorAllowsSuper;
    if (isConstructor && kind !== "method") {
      this.raise(node.key.start, "Constructor can't have get/set modifier");
    }
    node.kind = isConstructor ? "constructor" : kind;
    this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
  } else {
    this.parseClassField(node);
  }
  return node;
};
pp$8.isClassElementNameStart = function() {
  return this.type === types$1.name || this.type === types$1.privateId || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword;
};
pp$8.parseClassElementName = function(element) {
  if (this.type === types$1.privateId) {
    if (this.value === "constructor") {
      this.raise(this.start, "Classes can't have an element named '#constructor'");
    }
    element.computed = false;
    element.key = this.parsePrivateIdent();
  } else {
    this.parsePropertyName(element);
  }
};
pp$8.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  var key = method.key;
  if (method.kind === "constructor") {
    if (isGenerator) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
  } else if (method.static && checkKeyName(method, "prototype")) {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
  if (method.kind === "get" && value.params.length !== 0) {
    this.raiseRecoverable(value.start, "getter should have no params");
  }
  if (method.kind === "set" && value.params.length !== 1) {
    this.raiseRecoverable(value.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && value.params[0].type === "RestElement") {
    this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
  }
  return this.finishNode(method, "MethodDefinition");
};
pp$8.parseClassField = function(field) {
  if (checkKeyName(field, "constructor")) {
    this.raise(field.key.start, "Classes can't have a field named 'constructor'");
  } else if (field.static && checkKeyName(field, "prototype")) {
    this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
  }
  if (this.eat(types$1.eq)) {
    this.enterScope(SCOPE_CLASS_FIELD_INIT | SCOPE_SUPER);
    field.value = this.parseMaybeAssign();
    this.exitScope();
  } else {
    field.value = null;
  }
  this.semicolon();
  return this.finishNode(field, "PropertyDefinition");
};
pp$8.parseClassStaticBlock = function(node) {
  node.body = [];
  var oldLabels = this.labels;
  this.labels = [];
  this.enterScope(SCOPE_CLASS_STATIC_BLOCK | SCOPE_SUPER);
  while (this.type !== types$1.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  this.next();
  this.exitScope();
  this.labels = oldLabels;
  return this.finishNode(node, "StaticBlock");
};
pp$8.parseClassId = function(node, isStatement) {
  if (this.type === types$1.name) {
    node.id = this.parseIdent();
    if (isStatement) {
      this.checkLValSimple(node.id, BIND_LEXICAL, false);
    }
  } else {
    if (isStatement === true) {
      this.unexpected();
    }
    node.id = null;
  }
};
pp$8.parseClassSuper = function(node) {
  node.superClass = this.eat(types$1._extends) ? this.parseExprSubscripts(null, false) : null;
};
pp$8.enterClassBody = function() {
  var element = { declared: /* @__PURE__ */ Object.create(null), used: [] };
  this.privateNameStack.push(element);
  return element.declared;
};
pp$8.exitClassBody = function() {
  var ref2 = this.privateNameStack.pop();
  var declared = ref2.declared;
  var used = ref2.used;
  if (!this.options.checkPrivateFields) {
    return;
  }
  var len = this.privateNameStack.length;
  var parent = len === 0 ? null : this.privateNameStack[len - 1];
  for (var i2 = 0; i2 < used.length; ++i2) {
    var id2 = used[i2];
    if (!hasOwn(declared, id2.name)) {
      if (parent) {
        parent.used.push(id2);
      } else {
        this.raiseRecoverable(id2.start, "Private field '#" + id2.name + "' must be declared in an enclosing class");
      }
    }
  }
};
function isPrivateNameConflicted(privateNameMap, element) {
  var name2 = element.key.name;
  var curr = privateNameMap[name2];
  var next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next = (element.static ? "s" : "i") + element.kind;
  }
  if (curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget") {
    privateNameMap[name2] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name2] = next;
    return false;
  } else {
    return true;
  }
}
function checkKeyName(node, name2) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name2 || key.type === "Literal" && key.value === name2);
}
pp$8.parseExportAllDeclaration = function(node, exports$1) {
  if (this.options.ecmaVersion >= 11) {
    if (this.eatContextual("as")) {
      node.exported = this.parseModuleExportName();
      this.checkExport(exports$1, node.exported, this.lastTokStart);
    } else {
      node.exported = null;
    }
  }
  this.expectContextual("from");
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.source = this.parseExprAtom();
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ExportAllDeclaration");
};
pp$8.parseExport = function(node, exports$1) {
  this.next();
  if (this.eat(types$1.star)) {
    return this.parseExportAllDeclaration(node, exports$1);
  }
  if (this.eat(types$1._default)) {
    this.checkExport(exports$1, "default", this.lastTokStart);
    node.declaration = this.parseExportDefaultDeclaration();
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseExportDeclaration(node);
    if (node.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports$1, node.declaration.declarations);
    } else {
      this.checkExport(exports$1, node.declaration.id, node.declaration.id.start);
    }
    node.specifiers = [];
    node.source = null;
    if (this.options.ecmaVersion >= 16) {
      node.attributes = [];
    }
  } else {
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports$1);
    if (this.eatContextual("from")) {
      if (this.type !== types$1.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
      if (this.options.ecmaVersion >= 16) {
        node.attributes = this.parseWithClause();
      }
    } else {
      for (var i2 = 0, list2 = node.specifiers; i2 < list2.length; i2 += 1) {
        var spec = list2[i2];
        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);
        if (spec.local.type === "Literal") {
          this.raise(spec.local.start, "A string literal cannot be used as an exported binding without `from`.");
        }
      }
      node.source = null;
      if (this.options.ecmaVersion >= 16) {
        node.attributes = [];
      }
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};
pp$8.parseExportDeclaration = function(node) {
  return this.parseStatement(null);
};
pp$8.parseExportDefaultDeclaration = function() {
  var isAsync;
  if (this.type === types$1._function || (isAsync = this.isAsyncFunction())) {
    var fNode = this.startNode();
    this.next();
    if (isAsync) {
      this.next();
    }
    return this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
  } else if (this.type === types$1._class) {
    var cNode = this.startNode();
    return this.parseClass(cNode, "nullableID");
  } else {
    var declaration = this.parseMaybeAssign();
    this.semicolon();
    return declaration;
  }
};
pp$8.checkExport = function(exports$1, name2, pos) {
  if (!exports$1) {
    return;
  }
  if (typeof name2 !== "string") {
    name2 = name2.type === "Identifier" ? name2.name : name2.value;
  }
  if (hasOwn(exports$1, name2)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name2 + "'");
  }
  exports$1[name2] = true;
};
pp$8.checkPatternExport = function(exports$1, pat) {
  var type = pat.type;
  if (type === "Identifier") {
    this.checkExport(exports$1, pat, pat.start);
  } else if (type === "ObjectPattern") {
    for (var i2 = 0, list2 = pat.properties; i2 < list2.length; i2 += 1) {
      var prop = list2[i2];
      this.checkPatternExport(exports$1, prop);
    }
  } else if (type === "ArrayPattern") {
    for (var i$12 = 0, list$12 = pat.elements; i$12 < list$12.length; i$12 += 1) {
      var elt = list$12[i$12];
      if (elt) {
        this.checkPatternExport(exports$1, elt);
      }
    }
  } else if (type === "Property") {
    this.checkPatternExport(exports$1, pat.value);
  } else if (type === "AssignmentPattern") {
    this.checkPatternExport(exports$1, pat.left);
  } else if (type === "RestElement") {
    this.checkPatternExport(exports$1, pat.argument);
  }
};
pp$8.checkVariableExport = function(exports$1, decls) {
  if (!exports$1) {
    return;
  }
  for (var i2 = 0, list2 = decls; i2 < list2.length; i2 += 1) {
    var decl = list2[i2];
    this.checkPatternExport(exports$1, decl.id);
  }
};
pp$8.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$8.parseExportSpecifier = function(exports$1) {
  var node = this.startNode();
  node.local = this.parseModuleExportName();
  node.exported = this.eatContextual("as") ? this.parseModuleExportName() : node.local;
  this.checkExport(
    exports$1,
    node.exported,
    node.exported.start
  );
  return this.finishNode(node, "ExportSpecifier");
};
pp$8.parseExportSpecifiers = function(exports$1) {
  var nodes = [], first = true;
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseExportSpecifier(exports$1));
  }
  return nodes;
};
pp$8.parseImport = function(node) {
  this.next();
  if (this.type === types$1.string) {
    node.specifiers = empty$1;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types$1.string ? this.parseExprAtom() : this.unexpected();
  }
  if (this.options.ecmaVersion >= 16) {
    node.attributes = this.parseWithClause();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};
pp$8.parseImportSpecifier = function() {
  var node = this.startNode();
  node.imported = this.parseModuleExportName();
  if (this.eatContextual("as")) {
    node.local = this.parseIdent();
  } else {
    this.checkUnreserved(node.imported);
    node.local = node.imported;
  }
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportSpecifier");
};
pp$8.parseImportDefaultSpecifier = function() {
  var node = this.startNode();
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportDefaultSpecifier");
};
pp$8.parseImportNamespaceSpecifier = function() {
  var node = this.startNode();
  this.next();
  this.expectContextual("as");
  node.local = this.parseIdent();
  this.checkLValSimple(node.local, BIND_LEXICAL);
  return this.finishNode(node, "ImportNamespaceSpecifier");
};
pp$8.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types$1.name) {
    nodes.push(this.parseImportDefaultSpecifier());
    if (!this.eat(types$1.comma)) {
      return nodes;
    }
  }
  if (this.type === types$1.star) {
    nodes.push(this.parseImportNamespaceSpecifier());
    return nodes;
  }
  this.expect(types$1.braceL);
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    nodes.push(this.parseImportSpecifier());
  }
  return nodes;
};
pp$8.parseWithClause = function() {
  var nodes = [];
  if (!this.eat(types$1._with)) {
    return nodes;
  }
  this.expect(types$1.braceL);
  var attributeKeys = {};
  var first = true;
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var attr = this.parseImportAttribute();
    var keyName = attr.key.type === "Identifier" ? attr.key.name : attr.key.value;
    if (hasOwn(attributeKeys, keyName)) {
      this.raiseRecoverable(attr.key.start, "Duplicate attribute key '" + keyName + "'");
    }
    attributeKeys[keyName] = true;
    nodes.push(attr);
  }
  return nodes;
};
pp$8.parseImportAttribute = function() {
  var node = this.startNode();
  node.key = this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
  this.expect(types$1.colon);
  if (this.type !== types$1.string) {
    this.unexpected();
  }
  node.value = this.parseExprAtom();
  return this.finishNode(node, "ImportAttribute");
};
pp$8.parseModuleExportName = function() {
  if (this.options.ecmaVersion >= 13 && this.type === types$1.string) {
    var stringLiteral = this.parseLiteral(this.value);
    if (loneSurrogate.test(stringLiteral.value)) {
      this.raise(stringLiteral.start, "An export name cannot include a lone surrogate.");
    }
    return stringLiteral;
  }
  return this.parseIdent(true);
};
pp$8.adaptDirectivePrologue = function(statements) {
  for (var i2 = 0; i2 < statements.length && this.isDirectiveCandidate(statements[i2]); ++i2) {
    statements[i2].directive = statements[i2].expression.raw.slice(1, -1);
  }
};
pp$8.isDirectiveCandidate = function(statement) {
  return this.options.ecmaVersion >= 5 && statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
  (this.input[statement.start] === '"' || this.input[statement.start] === "'");
};
var pp$7 = Parser.prototype;
pp$7.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await") {
          this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
        }
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i2 = 0, list2 = node.properties; i2 < list2.length; i2 += 1) {
          var prop = list2[i2];
          this.toAssignable(prop, isBinding);
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;
      case "Property":
        if (node.kind !== "init") {
          this.raise(node.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node.value, isBinding);
        break;
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node.elements, isBinding);
        break;
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern") {
          this.raise(node.argument.start, "Rest elements cannot have a default value");
        }
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break;
      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!isBinding) {
          break;
        }
      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node;
};
pp$7.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i2 = 0; i2 < end; i2++) {
    var elt = exprList[i2];
    if (elt) {
      this.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};
pp$7.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};
pp$7.parseRestBinding = function() {
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion === 6 && this.type !== types$1.name) {
    this.unexpected();
  }
  node.argument = this.parseBindingAtom();
  return this.finishNode(node, "RestElement");
};
pp$7.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types$1.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types$1.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern");
      case types$1.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};
pp$7.parseBindingList = function(close, allowEmpty, allowTrailingComma, allowModifiers) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this.expect(types$1.comma);
    }
    if (allowEmpty && this.type === types$1.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === types$1.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      this.expect(close);
      break;
    } else {
      elts.push(this.parseAssignableListItem(allowModifiers));
    }
  }
  return elts;
};
pp$7.parseAssignableListItem = function(allowModifiers) {
  var elem = this.parseMaybeDefault(this.start, this.startLoc);
  this.parseBindingListItem(elem);
  return elem;
};
pp$7.parseBindingListItem = function(param) {
  return param;
};
pp$7.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types$1.eq)) {
    return left;
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};
pp$7.checkLValSimple = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  var isBind = bindingType !== BIND_NONE;
  switch (expr.type) {
    case "Identifier":
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (isBind) {
        if (bindingType === BIND_LEXICAL && expr.name === "let") {
          this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
        }
        if (checkClashes) {
          if (hasOwn(checkClashes, expr.name)) {
            this.raiseRecoverable(expr.start, "Argument name clash");
          }
          checkClashes[expr.name] = true;
        }
        if (bindingType !== BIND_OUTSIDE) {
          this.declareName(expr.name, bindingType, expr.start);
        }
      }
      break;
    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;
    case "ParenthesizedExpression":
      if (isBind) {
        this.raiseRecoverable(expr.start, "Binding parenthesized expression");
      }
      return this.checkLValSimple(expr.expression, bindingType, checkClashes);
    default:
      this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
  }
};
pp$7.checkLValPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "ObjectPattern":
      for (var i2 = 0, list2 = expr.properties; i2 < list2.length; i2 += 1) {
        var prop = list2[i2];
        this.checkLValInnerPattern(prop, bindingType, checkClashes);
      }
      break;
    case "ArrayPattern":
      for (var i$12 = 0, list$12 = expr.elements; i$12 < list$12.length; i$12 += 1) {
        var elem = list$12[i$12];
        if (elem) {
          this.checkLValInnerPattern(elem, bindingType, checkClashes);
        }
      }
      break;
    default:
      this.checkLValSimple(expr, bindingType, checkClashes);
  }
};
pp$7.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0) bindingType = BIND_NONE;
  switch (expr.type) {
    case "Property":
      this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
      break;
    case "AssignmentPattern":
      this.checkLValPattern(expr.left, bindingType, checkClashes);
      break;
    case "RestElement":
      this.checkLValPattern(expr.argument, bindingType, checkClashes);
      break;
    default:
      this.checkLValPattern(expr, bindingType, checkClashes);
  }
};
var TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};
var types = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};
var pp$6 = Parser.prototype;
pp$6.initialContext = function() {
  return [types.b_stat];
};
pp$6.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$6.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  if (parent === types.f_expr || parent === types.f_stat) {
    return true;
  }
  if (prevType === types$1.colon && (parent === types.b_stat || parent === types.b_expr)) {
    return !parent.isExpr;
  }
  if (prevType === types$1._return || prevType === types$1.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types$1._else || prevType === types$1.semi || prevType === types$1.eof || prevType === types$1.parenR || prevType === types$1.arrow) {
    return true;
  }
  if (prevType === types$1.braceL) {
    return parent === types.b_stat;
  }
  if (prevType === types$1._var || prevType === types$1._const || prevType === types$1.name) {
    return false;
  }
  return !this.exprAllowed;
};
pp$6.inGeneratorContext = function() {
  for (var i2 = this.context.length - 1; i2 >= 1; i2--) {
    var context = this.context[i2];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};
pp$6.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types$1.dot) {
    this.exprAllowed = false;
  } else if (update = type.updateContext) {
    update.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};
pp$6.overrideContext = function(tokenCtx) {
  if (this.curContext() !== tokenCtx) {
    this.context[this.context.length - 1] = tokenCtx;
  }
};
types$1.parenR.updateContext = types$1.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};
types$1.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
  this.exprAllowed = true;
};
types$1.dollarBraceL.updateContext = function() {
  this.context.push(types.b_tmpl);
  this.exprAllowed = true;
};
types$1.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types$1._if || prevType === types$1._for || prevType === types$1._with || prevType === types$1._while;
  this.context.push(statementParens ? types.p_stat : types.p_expr);
  this.exprAllowed = true;
};
types$1.incDec.updateContext = function() {
};
types$1._function.updateContext = types$1._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types$1._else && !(prevType === types$1.semi && this.curContext() !== types.p_stat) && !(prevType === types$1._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types$1.colon || prevType === types$1.braceL) && this.curContext() === types.b_stat)) {
    this.context.push(types.f_expr);
  } else {
    this.context.push(types.f_stat);
  }
  this.exprAllowed = false;
};
types$1.colon.updateContext = function() {
  if (this.curContext().token === "function") {
    this.context.pop();
  }
  this.exprAllowed = true;
};
types$1.backQuote.updateContext = function() {
  if (this.curContext() === types.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types.q_tmpl);
  }
  this.exprAllowed = false;
};
types$1.star.updateContext = function(prevType) {
  if (prevType === types$1._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types.f_expr) {
      this.context[index] = types.f_expr_gen;
    } else {
      this.context[index] = types.f_gen;
    }
  }
  this.exprAllowed = true;
};
types$1.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types$1.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};
var pp$5 = Parser.prototype;
pp$5.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name2;
  switch (key.type) {
    case "Identifier":
      name2 = key.name;
      break;
    case "Literal":
      name2 = String(key.value);
      break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name2 === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return;
  }
  name2 = "$" + name2;
  var other = propHash[name2];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name2] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};
pp$5.parseExpression = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
  if (this.type === types$1.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types$1.comma)) {
      node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
    }
    return this.finishNode(node, "SequenceExpression");
  }
  return expr;
};
pp$5.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) {
      return this.parseYield(forInit);
    } else {
      this.exprAllowed = false;
    }
  }
  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldDoubleProto = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    oldDoubleProto = refDestructuringErrors.doubleProto;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }
  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types$1.parenL || this.type === types$1.name) {
    this.potentialArrowAt = this.start;
    this.potentialArrowInForAwait = forInit === "await";
  }
  var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    if (this.type === types$1.eq) {
      left = this.toAssignable(left, false, refDestructuringErrors);
    }
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= left.start) {
      refDestructuringErrors.shorthandAssign = -1;
    }
    if (this.type === types$1.eq) {
      this.checkLValPattern(left);
    } else {
      this.checkLValSimple(left);
    }
    node.left = left;
    this.next();
    node.right = this.parseMaybeAssign(forInit);
    if (oldDoubleProto > -1) {
      refDestructuringErrors.doubleProto = oldDoubleProto;
    }
    return this.finishNode(node, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};
pp$5.parseMaybeConditional = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(forInit, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (this.eat(types$1.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types$1.colon);
    node.alternate = this.parseMaybeAssign(forInit);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};
pp$5.parseExprOps = function(forInit, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false, false, forInit);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
};
pp$5.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
  var prec = this.type.binop;
  if (prec != null && (!forInit || this.type !== types$1._in)) {
    if (prec > minPrec) {
      var logical = this.type === types$1.logicalOR || this.type === types$1.logicalAND;
      var coalesce = this.type === types$1.coalesce;
      if (coalesce) {
        prec = types$1.logicalAND.binop;
      }
      var op2 = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false, false, forInit), startPos, startLoc, prec, forInit);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op2, logical || coalesce);
      if (logical && this.type === types$1.coalesce || coalesce && (this.type === types$1.logicalOR || this.type === types$1.logicalAND)) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
    }
  }
  return left;
};
pp$5.buildBinary = function(startPos, startLoc, left, right, op2, logical) {
  if (right.type === "PrivateIdentifier") {
    this.raise(right.start, "Private identifier can only be left side of binary expression");
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op2;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$5.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec, forInit) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && this.canAwait) {
    expr = this.parseAwait(forInit);
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types$1.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true, update, forInit);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) {
      this.checkLValSimple(node.argument);
    } else if (this.strict && node.operator === "delete" && isLocalVariableAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
    } else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) {
      this.raiseRecoverable(node.start, "Private fields can not be deleted");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else if (!sawUnary && this.type === types$1.privateId) {
    if ((forInit || this.privateNameStack.length === 0) && this.options.checkPrivateFields) {
      this.unexpected();
    }
    expr = this.parsePrivateIdent();
    if (this.type !== types$1._in) {
      this.unexpected();
    }
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors, forInit);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLValSimple(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }
  if (!incDec && this.eat(types$1.starstar)) {
    if (sawUnary) {
      this.unexpected(this.lastTokStart);
    } else {
      return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false, false, forInit), "**", false);
    }
  } else {
    return expr;
  }
};
function isLocalVariableAccess(node) {
  return node.type === "Identifier" || node.type === "ParenthesizedExpression" && isLocalVariableAccess(node.expression);
}
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression) || node.type === "ParenthesizedExpression" && isPrivateFieldAccess(node.expression);
}
pp$5.parseExprSubscripts = function(refDestructuringErrors, forInit) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors, forInit);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc, false, forInit);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
    if (refDestructuringErrors.trailingComma >= result.start) {
      refDestructuringErrors.trailingComma = -1;
    }
  }
  return result;
};
pp$5.parseSubscripts = function(base, startPos, startLoc, noCalls, forInit) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
  var optionalChained = false;
  while (true) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit);
    if (element.optional) {
      optionalChained = true;
    }
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element;
    }
    base = element;
  }
};
pp$5.shouldParseAsyncArrow = function() {
  return !this.canInsertSemicolon() && this.eat(types$1.arrow);
};
pp$5.parseSubscriptAsyncArrow = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true, forInit);
};
pp$5.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained, forInit) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types$1.questionDot);
  if (noCalls && optional) {
    this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  }
  var computed = this.eat(types$1.bracketL);
  if (computed || optional && this.type !== types$1.parenL && this.type !== types$1.backQuote || this.eat(types$1.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(types$1.bracketR);
    } else if (this.type === types$1.privateId && base.type !== "Super") {
      node.property = this.parsePrivateIdent();
    } else {
      node.property = this.parseIdent(this.options.allowReserved !== "never");
    }
    node.computed = !!computed;
    if (optionalSupported) {
      node.optional = optional;
    }
    base = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types$1.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && this.shouldParseAsyncArrow()) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0) {
        this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseSubscriptAsyncArrow(startPos, startLoc, exprList, forInit);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types$1.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({ isTagged: true });
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base;
};
pp$5.parseExprAtom = function(refDestructuringErrors, forInit, forNew) {
  if (this.type === types$1.slash) {
    this.readRegexp();
  }
  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types$1._super:
      if (!this.allowSuper) {
        this.raise(this.start, "'super' keyword outside a method");
      }
      node = this.startNode();
      this.next();
      if (this.type === types$1.parenL && !this.allowDirectSuper) {
        this.raise(node.start, "super() call outside constructor of a subclass");
      }
      if (this.type !== types$1.dot && this.type !== types$1.bracketL && this.type !== types$1.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, "Super");
    case types$1._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression");
    case types$1.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id2 = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id2.name === "async" && !this.canInsertSemicolon() && this.eat(types$1._function)) {
        this.overrideContext(types.f_expr);
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true, forInit);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types$1.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id2], false, forInit);
        }
        if (this.options.ecmaVersion >= 8 && id2.name === "async" && this.type === types$1.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
          id2 = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types$1.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id2], true, forInit);
        }
      }
      return id2;
    case types$1.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = { pattern: value.pattern, flags: value.flags };
      return node;
    case types$1.num:
    case types$1.string:
      return this.parseLiteral(this.value);
    case types$1._null:
    case types$1._true:
    case types$1._false:
      node = this.startNode();
      node.value = this.type === types$1._null ? null : this.type === types$1._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal");
    case types$1.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow, forInit);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start;
        }
      }
      return expr;
    case types$1.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types$1.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression");
    case types$1.braceL:
      this.overrideContext(types.b_expr);
      return this.parseObj(false, refDestructuringErrors);
    case types$1._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0);
    case types$1._class:
      return this.parseClass(this.startNode(), false);
    case types$1._new:
      return this.parseNew();
    case types$1.backQuote:
      return this.parseTemplate();
    case types$1._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport(forNew);
      } else {
        return this.unexpected();
      }
    default:
      return this.parseExprAtomDefault();
  }
};
pp$5.parseExprAtomDefault = function() {
  this.unexpected();
};
pp$5.parseExprImport = function(forNew) {
  var node = this.startNode();
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  }
  this.next();
  if (this.type === types$1.parenL && !forNew) {
    return this.parseDynamicImport(node);
  } else if (this.type === types$1.dot) {
    var meta2 = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta2.name = "import";
    node.meta = this.finishNode(meta2, "Identifier");
    return this.parseImportMeta(node);
  } else {
    this.unexpected();
  }
};
pp$5.parseDynamicImport = function(node) {
  this.next();
  node.source = this.parseMaybeAssign();
  if (this.options.ecmaVersion >= 16) {
    if (!this.eat(types$1.parenR)) {
      this.expect(types$1.comma);
      if (!this.afterTrailingComma(types$1.parenR)) {
        node.options = this.parseMaybeAssign();
        if (!this.eat(types$1.parenR)) {
          this.expect(types$1.comma);
          if (!this.afterTrailingComma(types$1.parenR)) {
            this.unexpected();
          }
        }
      } else {
        node.options = null;
      }
    } else {
      node.options = null;
    }
  } else {
    if (!this.eat(types$1.parenR)) {
      var errorPos = this.start;
      if (this.eat(types$1.comma) && this.eat(types$1.parenR)) {
        this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
      } else {
        this.unexpected(errorPos);
      }
    }
  }
  return this.finishNode(node, "ImportExpression");
};
pp$5.parseImportMeta = function(node) {
  this.next();
  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);
  if (node.property.name !== "meta") {
    this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
  }
  if (containsEsc) {
    this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
  }
  if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
    this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
  }
  return this.finishNode(node, "MetaProperty");
};
pp$5.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
    node.bigint = node.value != null ? node.value.toString() : node.raw.slice(0, -1).replace(/_/g, "");
  }
  this.next();
  return this.finishNode(node, "Literal");
};
pp$5.parseParenExpression = function() {
  this.expect(types$1.parenL);
  var val = this.parseExpression();
  this.expect(types$1.parenR);
  return val;
};
pp$5.shouldParseArrow = function(exprList) {
  return !this.canInsertSemicolon();
};
pp$5.parseParenAndDistinguishExpression = function(canBeArrow, forInit) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types$1.parenR) {
      first ? first = false : this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(types$1.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this.type === types$1.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types$1.comma) {
          this.raiseRecoverable(
            this.start,
            "Comma is not permitted after the rest element"
          );
        }
        break;
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.lastTokEnd, innerEndLoc = this.lastTokEndLoc;
    this.expect(types$1.parenR);
    if (canBeArrow && this.shouldParseArrow(exprList) && this.eat(types$1.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList, forInit);
    }
    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }
  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};
pp$5.parseParenItem = function(item) {
  return item;
};
pp$5.parseParenArrowList = function(startPos, startLoc, exprList, forInit) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, false, forInit);
};
var empty = [];
pp$5.parseNew = function() {
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  }
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion >= 6 && this.type === types$1.dot) {
    var meta2 = this.startNodeAt(node.start, node.loc && node.loc.start);
    meta2.name = "new";
    node.meta = this.finishNode(meta2, "Identifier");
    this.next();
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target") {
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
    }
    if (containsEsc) {
      this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
    }
    if (!this.allowNewDotTarget) {
      this.raiseRecoverable(node.start, "'new.target' can only be used in functions and class static block");
    }
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc;
  node.callee = this.parseSubscripts(this.parseExprAtom(null, false, true), startPos, startLoc, true, false);
  if (this.eat(types$1.parenL)) {
    node.arguments = this.parseExprList(types$1.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node.arguments = empty;
  }
  return this.finishNode(node, "NewExpression");
};
pp$5.parseTemplateElement = function(ref2) {
  var isTagged = ref2.isTagged;
  var elem = this.startNode();
  if (this.type === types$1.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value.replace(/\r\n?/g, "\n"),
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types$1.backQuote;
  return this.finishNode(elem, "TemplateElement");
};
pp$5.parseTemplate = function(ref2) {
  if (ref2 === void 0) ref2 = {};
  var isTagged = ref2.isTagged;
  if (isTagged === void 0) isTagged = false;
  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({ isTagged });
  node.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types$1.eof) {
      this.raise(this.pos, "Unterminated template literal");
    }
    this.expect(types$1.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types$1.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};
pp$5.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types$1.name || this.type === types$1.num || this.type === types$1.string || this.type === types$1.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types$1.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$5.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types$1.braceR)) {
    if (!first) {
      this.expect(types$1.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types$1.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$5.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types$1.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types$1.comma) {
        this.raiseRecoverable(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types$1.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator = this.eat(types$1.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types$1.star);
    this.parsePropertyName(prop);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};
pp$5.parseGetterSetter = function(prop) {
  var kind = prop.key.name;
  this.parsePropertyName(prop);
  prop.value = this.parseMethod(false);
  prop.kind = kind;
  var paramCount = prop.kind === "get" ? 0 : 1;
  if (prop.value.params.length !== paramCount) {
    var start = prop.value.start;
    if (prop.kind === "get") {
      this.raiseRecoverable(start, "getter should have no params");
    } else {
      this.raiseRecoverable(start, "setter should have exactly one param");
    }
  } else {
    if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
      this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
    }
  }
};
pp$5.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types$1.colon) {
    this.unexpected();
  }
  if (this.eat(types$1.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types$1.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
    prop.kind = "init";
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types$1.comma && this.type !== types$1.braceR && this.type !== types$1.eq)) {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.parseGetterSetter(prop);
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = startPos;
    }
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else if (this.type === types$1.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
    } else {
      prop.value = this.copyNode(prop.key);
    }
    prop.kind = "init";
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};
pp$5.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types$1.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types$1.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types$1.num || this.type === types$1.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$5.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) {
    node.generator = node.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = false;
  }
};
pp$5.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) {
    node.generator = isGenerator;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  this.expect(types$1.parenL);
  node.params = this.parseBindingList(types$1.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression");
};
pp$5.parseArrowExpression = function(node, params, isAsync, forInit) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false, forInit);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression");
};
pp$5.parseFunctionBody = function(node, isArrowFunction, isMethod, forInit) {
  var isExpression = isArrowFunction && this.type !== types$1.braceL;
  var oldStrict = this.strict, useStrict = false;
  if (isExpression) {
    node.body = this.parseMaybeAssign(forInit);
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    if (this.strict && node.id) {
      this.checkLValSimple(node.id, BIND_OUTSIDE);
    }
    node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};
pp$5.isSimpleParamList = function(params) {
  for (var i2 = 0, list2 = params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};
pp$5.checkParams = function(node, allowDuplicates) {
  var nameHash = /* @__PURE__ */ Object.create(null);
  for (var i2 = 0, list2 = node.params; i2 < list2.length; i2 += 1) {
    var param = list2[i2];
    this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};
pp$5.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types$1.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }
    var elt = void 0;
    if (allowEmpty && this.type === types$1.comma) {
      elt = null;
    } else if (this.type === types$1.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types$1.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};
pp$5.checkUnreserved = function(ref2) {
  var start = ref2.start;
  var end = ref2.end;
  var name2 = ref2.name;
  if (this.inGenerator && name2 === "yield") {
    this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name2 === "await") {
    this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
  }
  if (!(this.currentThisScope().flags & SCOPE_VAR) && name2 === "arguments") {
    this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
  }
  if (this.inClassStaticBlock && (name2 === "arguments" || name2 === "await")) {
    this.raise(start, "Cannot use " + name2 + " in class static initialization block");
  }
  if (this.keywords.test(name2)) {
    this.raise(start, "Unexpected keyword '" + name2 + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
    return;
  }
  var re2 = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re2.test(name2)) {
    if (!this.inAsync && name2 === "await") {
      this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start, "The keyword '" + name2 + "' is reserved");
  }
};
pp$5.parseIdent = function(liberal) {
  var node = this.parseIdentNode();
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = node.start;
    }
  }
  return node;
};
pp$5.parseIdentNode = function() {
  var node = this.startNode();
  if (this.type === types$1.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;
    if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
    this.type = types$1.name;
  } else {
    this.unexpected();
  }
  return node;
};
pp$5.parsePrivateIdent = function() {
  var node = this.startNode();
  if (this.type === types$1.privateId) {
    node.name = this.value;
  } else {
    this.unexpected();
  }
  this.next();
  this.finishNode(node, "PrivateIdentifier");
  if (this.options.checkPrivateFields) {
    if (this.privateNameStack.length === 0) {
      this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
    } else {
      this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
    }
  }
  return node;
};
pp$5.parseYield = function(forInit) {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }
  var node = this.startNode();
  this.next();
  if (this.type === types$1.semi || this.canInsertSemicolon() || this.type !== types$1.star && !this.type.startsExpr) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types$1.star);
    node.argument = this.parseMaybeAssign(forInit);
  }
  return this.finishNode(node, "YieldExpression");
};
pp$5.parseAwait = function(forInit) {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, true, false, forInit);
  return this.finishNode(node, "AwaitExpression");
};
var pp$4 = Parser.prototype;
pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  if (this.sourceFile) {
    message += " in " + this.sourceFile;
  }
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};
var pp$3 = Parser.prototype;
var Scope = function Scope2(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
};
pp$3.enterScope = function(flags) {
  this.scopeStack.push(new Scope(flags));
};
pp$3.exitScope = function() {
  this.scopeStack.pop();
};
pp$3.treatFunctionsAsVarInScope = function(scope) {
  return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
};
pp$3.declareName = function(name2, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name2) > -1 || scope.functions.indexOf(name2) > -1 || scope.var.indexOf(name2) > -1;
    scope.lexical.push(name2);
    if (this.inModule && scope.flags & SCOPE_TOP) {
      delete this.undefinedExports[name2];
    }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name2);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar) {
      redeclared = scope$2.lexical.indexOf(name2) > -1;
    } else {
      redeclared = scope$2.lexical.indexOf(name2) > -1 || scope$2.var.indexOf(name2) > -1;
    }
    scope$2.functions.push(name2);
  } else {
    for (var i2 = this.scopeStack.length - 1; i2 >= 0; --i2) {
      var scope$3 = this.scopeStack[i2];
      if (scope$3.lexical.indexOf(name2) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name2) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name2) > -1) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name2);
      if (this.inModule && scope$3.flags & SCOPE_TOP) {
        delete this.undefinedExports[name2];
      }
      if (scope$3.flags & SCOPE_VAR) {
        break;
      }
    }
  }
  if (redeclared) {
    this.raiseRecoverable(pos, "Identifier '" + name2 + "' has already been declared");
  }
};
pp$3.checkLocalExport = function(id2) {
  if (this.scopeStack[0].lexical.indexOf(id2.name) === -1 && this.scopeStack[0].var.indexOf(id2.name) === -1) {
    this.undefinedExports[id2.name] = id2;
  }
};
pp$3.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$3.currentVarScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK)) {
      return scope;
    }
  }
};
pp$3.currentThisScope = function() {
  for (var i2 = this.scopeStack.length - 1; ; i2--) {
    var scope = this.scopeStack[i2];
    if (scope.flags & (SCOPE_VAR | SCOPE_CLASS_FIELD_INIT | SCOPE_CLASS_STATIC_BLOCK) && !(scope.flags & SCOPE_ARROW)) {
      return scope;
    }
  }
};
var Node = function Node2(parser, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser.options.locations) {
    this.loc = new SourceLocation(parser, loc);
  }
  if (parser.options.directSourceFile) {
    this.sourceFile = parser.options.directSourceFile;
  }
  if (parser.options.ranges) {
    this.range = [pos, 0];
  }
};
var pp$2 = Parser.prototype;
pp$2.startNode = function() {
  return new Node(this, this.start, this.startLoc);
};
pp$2.startNodeAt = function(pos, loc) {
  return new Node(this, pos, loc);
};
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
pp$2.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};
pp$2.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};
pp$2.copyNode = function(node) {
  var newNode = new Node(this, node.start, this.startLoc);
  for (var prop in node) {
    newNode[prop] = node[prop];
  }
  return newNode;
};
var scriptValuesAddedInUnicode = "Gara Garay Gukh Gurung_Khema Hrkt Katakana_Or_Hiragana Kawi Kirat_Rai Krai Nag_Mundari Nagm Ol_Onal Onao Sunu Sunuwar Todhri Todr Tulu_Tigalari Tutg Unknown Zzzz";
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
var ecma13BinaryProperties = ecma12BinaryProperties;
var ecma14BinaryProperties = ecma13BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties,
  12: ecma12BinaryProperties,
  13: ecma13BinaryProperties,
  14: ecma14BinaryProperties
};
var ecma14BinaryPropertiesOfStrings = "Basic_Emoji Emoji_Keycap_Sequence RGI_Emoji_Modifier_Sequence RGI_Emoji_Flag_Sequence RGI_Emoji_Tag_Sequence RGI_Emoji_ZWJ_Sequence RGI_Emoji";
var unicodeBinaryPropertiesOfStrings = {
  9: "",
  10: "",
  11: "",
  12: "",
  13: "",
  14: ecma14BinaryPropertiesOfStrings
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
var ecma13ScriptValues = ecma12ScriptValues + " Cypro_Minoan Cpmn Old_Uyghur Ougr Tangsa Tnsa Toto Vithkuqi Vith";
var ecma14ScriptValues = ecma13ScriptValues + " " + scriptValuesAddedInUnicode;
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues,
  12: ecma12ScriptValues,
  13: ecma13ScriptValues,
  14: ecma14ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion2) {
  var d2 = data[ecmaVersion2] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion2] + " " + unicodeGeneralCategoryValues),
    binaryOfStrings: wordsRegexp(unicodeBinaryPropertiesOfStrings[ecmaVersion2]),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion2])
    }
  };
  d2.nonBinary.Script_Extensions = d2.nonBinary.Script;
  d2.nonBinary.gc = d2.nonBinary.General_Category;
  d2.nonBinary.sc = d2.nonBinary.Script;
  d2.nonBinary.scx = d2.nonBinary.Script_Extensions;
}
for (var i = 0, list$1 = [9, 10, 11, 12, 13, 14]; i < list$1.length; i += 1) {
  var ecmaVersion = list$1[i];
  buildUnicodeData(ecmaVersion);
}
var pp$1 = Parser.prototype;
var BranchID = function BranchID2(parent, base) {
  this.parent = parent;
  this.base = base || this;
};
BranchID.prototype.separatedFrom = function separatedFrom(alt) {
  for (var self2 = this; self2; self2 = self2.parent) {
    for (var other = alt; other; other = other.parent) {
      if (self2.base === other.base && self2 !== other) {
        return true;
      }
    }
  }
  return false;
};
BranchID.prototype.sibling = function sibling() {
  return new BranchID(this.parent, this.base);
};
var RegExpValidationState = function RegExpValidationState2(parser) {
  this.parser = parser;
  this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "") + (parser.options.ecmaVersion >= 15 ? "v" : "");
  this.unicodeProperties = data[parser.options.ecmaVersion >= 14 ? 14 : parser.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchV = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = /* @__PURE__ */ Object.create(null);
  this.backReferenceNames = [];
  this.branchID = null;
};
RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
  var unicodeSets = flags.indexOf("v") !== -1;
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  if (unicodeSets && this.parser.options.ecmaVersion >= 15) {
    this.switchU = true;
    this.switchV = true;
    this.switchN = true;
  } else {
    this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
    this.switchV = false;
    this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
  }
};
RegExpValidationState.prototype.raise = function raise(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};
RegExpValidationState.prototype.at = function at2(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l2 = s.length;
  if (i2 >= l2) {
    return -1;
  }
  var c = s.charCodeAt(i2);
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l2) {
    return c;
  }
  var next = s.charCodeAt(i2 + 1);
  return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
};
RegExpValidationState.prototype.nextIndex = function nextIndex(i2, forceU) {
  if (forceU === void 0) forceU = false;
  var s = this.source;
  var l2 = s.length;
  if (i2 >= l2) {
    return l2;
  }
  var c = s.charCodeAt(i2), next;
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i2 + 1 >= l2 || (next = s.charCodeAt(i2 + 1)) < 56320 || next > 57343) {
    return i2 + 1;
  }
  return i2 + 2;
};
RegExpValidationState.prototype.current = function current(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.pos, forceU);
};
RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
  if (forceU === void 0) forceU = false;
  return this.at(this.nextIndex(this.pos, forceU), forceU);
};
RegExpValidationState.prototype.advance = function advance(forceU) {
  if (forceU === void 0) forceU = false;
  this.pos = this.nextIndex(this.pos, forceU);
};
RegExpValidationState.prototype.eat = function eat(ch2, forceU) {
  if (forceU === void 0) forceU = false;
  if (this.current(forceU) === ch2) {
    this.advance(forceU);
    return true;
  }
  return false;
};
RegExpValidationState.prototype.eatChars = function eatChars(chs, forceU) {
  if (forceU === void 0) forceU = false;
  var pos = this.pos;
  for (var i2 = 0, list2 = chs; i2 < list2.length; i2 += 1) {
    var ch2 = list2[i2];
    var current2 = this.at(pos, forceU);
    if (current2 === -1 || current2 !== ch2) {
      return false;
    }
    pos = this.nextIndex(pos, forceU);
  }
  this.pos = pos;
  return true;
};
pp$1.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;
  var u = false;
  var v2 = false;
  for (var i2 = 0; i2 < flags.length; i2++) {
    var flag = flags.charAt(i2);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i2 + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
    if (flag === "u") {
      u = true;
    }
    if (flag === "v") {
      v2 = true;
    }
  }
  if (this.options.ecmaVersion >= 15 && u && v2) {
    this.raise(state.start, "Invalid regular expression flag");
  }
};
function hasProp(obj) {
  for (var _2 in obj) {
    return true;
  }
  return false;
}
pp$1.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);
  if (!state.switchN && this.options.ecmaVersion >= 9 && hasProp(state.groupNames)) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};
pp$1.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames = /* @__PURE__ */ Object.create(null);
  state.backReferenceNames.length = 0;
  state.branchID = null;
  this.regexp_disjunction(state);
  if (state.pos !== state.source.length) {
    if (state.eat(
      41
      /* ) */
    )) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(
      93
      /* ] */
    ) || state.eat(
      125
      /* } */
    )) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i2 = 0, list2 = state.backReferenceNames; i2 < list2.length; i2 += 1) {
    var name2 = list2[i2];
    if (!state.groupNames[name2]) {
      state.raise("Invalid named capture referenced");
    }
  }
};
pp$1.regexp_disjunction = function(state) {
  var trackDisjunction = this.options.ecmaVersion >= 16;
  if (trackDisjunction) {
    state.branchID = new BranchID(state.branchID, null);
  }
  this.regexp_alternative(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (trackDisjunction) {
      state.branchID = state.branchID.sibling();
    }
    this.regexp_alternative(state);
  }
  if (trackDisjunction) {
    state.branchID = state.branchID.parent;
  }
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(
    123
    /* { */
  )) {
    state.raise("Lone quantifier brackets");
  }
};
pp$1.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
  }
};
pp$1.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true;
  }
  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }
  return false;
};
pp$1.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;
  if (state.eat(
    94
    /* ^ */
  ) || state.eat(
    36
    /* $ */
  )) {
    return true;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    if (state.eat(
      66
      /* B */
    ) || state.eat(
      98
      /* b */
    )) {
      return true;
    }
    state.pos = start;
  }
  if (state.eat(
    40
    /* ( */
  ) && state.eat(
    63
    /* ? */
  )) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(
        60
        /* < */
      );
    }
    if (state.eat(
      61
      /* = */
    ) || state.eat(
      33
      /* ! */
    )) {
      this.regexp_disjunction(state);
      if (!state.eat(
        41
        /* ) */
      )) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }
  state.pos = start;
  return false;
};
pp$1.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0) noError = false;
  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(
      63
      /* ? */
    );
    return true;
  }
  return false;
};
pp$1.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(
    42
    /* * */
  ) || state.eat(
    43
    /* + */
  ) || state.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$1.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(
    123
    /* { */
  )) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(
        44
        /* , */
      ) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(
        125
        /* } */
      )) {
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true;
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatAtom = function(state) {
  return this.regexp_eatPatternCharacters(state) || state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$1.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(
    40
    /* ( */
  )) {
    if (state.eat(
      63
      /* ? */
    )) {
      if (this.options.ecmaVersion >= 16) {
        var addModifiers = this.regexp_eatModifiers(state);
        var hasHyphen = state.eat(
          45
          /* - */
        );
        if (addModifiers || hasHyphen) {
          for (var i2 = 0; i2 < addModifiers.length; i2++) {
            var modifier = addModifiers.charAt(i2);
            if (addModifiers.indexOf(modifier, i2 + 1) > -1) {
              state.raise("Duplicate regular expression modifiers");
            }
          }
          if (hasHyphen) {
            var removeModifiers = this.regexp_eatModifiers(state);
            if (!addModifiers && !removeModifiers && state.current() === 58) {
              state.raise("Invalid regular expression modifiers");
            }
            for (var i$12 = 0; i$12 < removeModifiers.length; i$12++) {
              var modifier$1 = removeModifiers.charAt(i$12);
              if (removeModifiers.indexOf(modifier$1, i$12 + 1) > -1 || addModifiers.indexOf(modifier$1) > -1) {
                state.raise("Duplicate regular expression modifiers");
              }
            }
          }
        }
      }
      if (state.eat(
        58
        /* : */
      )) {
        this.regexp_disjunction(state);
        if (state.eat(
          41
          /* ) */
        )) {
          return true;
        }
        state.raise("Unterminated group");
      }
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatCapturingGroup = function(state) {
  if (state.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 63) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(
      41
      /* ) */
    )) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};
pp$1.regexp_eatModifiers = function(state) {
  var modifiers = "";
  var ch2 = 0;
  while ((ch2 = state.current()) !== -1 && isRegularExpressionModifier(ch2)) {
    modifiers += codePointToString(ch2);
    state.advance();
  }
  return modifiers;
};
function isRegularExpressionModifier(ch2) {
  return ch2 === 105 || ch2 === 109 || ch2 === 115;
}
pp$1.regexp_eatExtendedAtom = function(state) {
  return state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$1.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false;
};
pp$1.regexp_eatSyntaxCharacter = function(state) {
  var ch2 = state.current();
  if (isSyntaxCharacter(ch2)) {
    state.lastIntValue = ch2;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch2) {
  return ch2 === 36 || ch2 >= 40 && ch2 <= 43 || ch2 === 46 || ch2 === 63 || ch2 >= 91 && ch2 <= 94 || ch2 >= 123 && ch2 <= 125;
}
pp$1.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch2 = 0;
  while ((ch2 = state.current()) !== -1 && !isSyntaxCharacter(ch2)) {
    state.advance();
  }
  return state.pos !== start;
};
pp$1.regexp_eatExtendedPatternCharacter = function(state) {
  var ch2 = state.current();
  if (ch2 !== -1 && ch2 !== 36 && !(ch2 >= 40 && ch2 <= 43) && ch2 !== 46 && ch2 !== 63 && ch2 !== 91 && ch2 !== 94 && ch2 !== 124) {
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_groupSpecifier = function(state) {
  if (state.eat(
    63
    /* ? */
  )) {
    if (!this.regexp_eatGroupName(state)) {
      state.raise("Invalid group");
    }
    var trackDisjunction = this.options.ecmaVersion >= 16;
    var known = state.groupNames[state.lastStringValue];
    if (known) {
      if (trackDisjunction) {
        for (var i2 = 0, list2 = known; i2 < list2.length; i2 += 1) {
          var altID = list2[i2];
          if (!altID.separatedFrom(state.branchID)) {
            state.raise("Duplicate capture group name");
          }
        }
      } else {
        state.raise("Duplicate capture group name");
      }
    }
    if (trackDisjunction) {
      (known || (state.groupNames[state.lastStringValue] = [])).push(state.branchID);
    } else {
      state.groupNames[state.lastStringValue] = true;
    }
  }
};
pp$1.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
      62
      /* > */
    )) {
      return true;
    }
    state.raise("Invalid capture group name");
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch2 = state.current(forceU);
  state.advance(forceU);
  if (ch2 === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch2 = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch2)) {
    state.lastIntValue = ch2;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierStart(ch2) {
  return isIdentifierStart(ch2, true) || ch2 === 36 || ch2 === 95;
}
pp$1.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch2 = state.current(forceU);
  state.advance(forceU);
  if (ch2 === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch2 = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch2)) {
    state.lastIntValue = ch2;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierPart(ch2) {
  return isIdentifierChar(ch2, true) || ch2 === 36 || ch2 === 95 || ch2 === 8204 || ch2 === 8205;
}
pp$1.regexp_eatAtomEscape = function(state) {
  if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
    return true;
  }
  if (state.switchU) {
    if (state.current() === 99) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false;
};
pp$1.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n = state.lastIntValue;
    if (state.switchU) {
      if (n > state.maxBackReference) {
        state.maxBackReference = n;
      }
      return true;
    }
    if (n <= state.numCapturingParens) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatKGroupName = function(state) {
  if (state.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};
pp$1.regexp_eatCharacterEscape = function(state) {
  return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$1.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatZero = function(state) {
  if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlEscape = function(state) {
  var ch2 = state.current();
  if (ch2 === 116) {
    state.lastIntValue = 9;
    state.advance();
    return true;
  }
  if (ch2 === 110) {
    state.lastIntValue = 10;
    state.advance();
    return true;
  }
  if (ch2 === 118) {
    state.lastIntValue = 11;
    state.advance();
    return true;
  }
  if (ch2 === 102) {
    state.lastIntValue = 12;
    state.advance();
    return true;
  }
  if (ch2 === 114) {
    state.lastIntValue = 13;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatControlLetter = function(state) {
  var ch2 = state.current();
  if (isControlLetter(ch2)) {
    state.lastIntValue = ch2 % 32;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch2) {
  return ch2 >= 65 && ch2 <= 90 || ch2 >= 97 && ch2 <= 122;
}
pp$1.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0) forceU = false;
  var start = state.pos;
  var switchU = forceU || state.switchU;
  if (state.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 55296 && lead <= 56319) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(
          92
          /* \ */
        ) && state.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 56320 && trail <= 57343) {
            state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(state) && state.eat(
      125
      /* } */
    ) && isValidUnicode(state.lastIntValue)) {
      return true;
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }
  return false;
};
function isValidUnicode(ch2) {
  return ch2 >= 0 && ch2 <= 1114111;
}
pp$1.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true;
    }
    if (state.eat(
      47
      /* / */
    )) {
      state.lastIntValue = 47;
      return true;
    }
    return false;
  }
  var ch2 = state.current();
  if (ch2 !== 99 && (!state.switchN || ch2 !== 107)) {
    state.lastIntValue = ch2;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch2 = state.current();
  if (ch2 >= 49 && ch2 <= 57) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch2 - 48);
      state.advance();
    } while ((ch2 = state.current()) >= 48 && ch2 <= 57);
    return true;
  }
  return false;
};
var CharSetNone = 0;
var CharSetOk = 1;
var CharSetString = 2;
pp$1.regexp_eatCharacterClassEscape = function(state) {
  var ch2 = state.current();
  if (isCharacterClassEscape(ch2)) {
    state.lastIntValue = -1;
    state.advance();
    return CharSetOk;
  }
  var negate = false;
  if (state.switchU && this.options.ecmaVersion >= 9 && ((negate = ch2 === 80) || ch2 === 112)) {
    state.lastIntValue = -1;
    state.advance();
    var result;
    if (state.eat(
      123
      /* { */
    ) && (result = this.regexp_eatUnicodePropertyValueExpression(state)) && state.eat(
      125
      /* } */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Invalid property name");
      }
      return result;
    }
    state.raise("Invalid property name");
  }
  return CharSetNone;
};
function isCharacterClassEscape(ch2) {
  return ch2 === 100 || ch2 === 68 || ch2 === 115 || ch2 === 83 || ch2 === 119 || ch2 === 87;
}
pp$1.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(
    61
    /* = */
  )) {
    var name2 = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name2, value);
      return CharSetOk;
    }
  }
  state.pos = start;
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    return this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
  }
  return CharSetNone;
};
pp$1.regexp_validateUnicodePropertyNameAndValue = function(state, name2, value) {
  if (!hasOwn(state.unicodeProperties.nonBinary, name2)) {
    state.raise("Invalid property name");
  }
  if (!state.unicodeProperties.nonBinary[name2].test(value)) {
    state.raise("Invalid property value");
  }
};
pp$1.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (state.unicodeProperties.binary.test(nameOrValue)) {
    return CharSetOk;
  }
  if (state.switchV && state.unicodeProperties.binaryOfStrings.test(nameOrValue)) {
    return CharSetString;
  }
  state.raise("Invalid property name");
};
pp$1.regexp_eatUnicodePropertyName = function(state) {
  var ch2 = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch2 = state.current())) {
    state.lastStringValue += codePointToString(ch2);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch2) {
  return isControlLetter(ch2) || ch2 === 95;
}
pp$1.regexp_eatUnicodePropertyValue = function(state) {
  var ch2 = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch2 = state.current())) {
    state.lastStringValue += codePointToString(ch2);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch2) {
  return isUnicodePropertyNameCharacter(ch2) || isDecimalDigit(ch2);
}
pp$1.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};
pp$1.regexp_eatCharacterClass = function(state) {
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (!state.eat(
      93
      /* ] */
    )) {
      state.raise("Unterminated character class");
    }
    if (negate && result === CharSetString) {
      state.raise("Negated character class may contain strings");
    }
    return true;
  }
  return false;
};
pp$1.regexp_classContents = function(state) {
  if (state.current() === 93) {
    return CharSetOk;
  }
  if (state.switchV) {
    return this.regexp_classSetExpression(state);
  }
  this.regexp_nonEmptyClassRanges(state);
  return CharSetOk;
};
pp$1.regexp_nonEmptyClassRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};
pp$1.regexp_eatClassAtom = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(state)) {
      return true;
    }
    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 99 || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  var ch2 = state.current();
  if (ch2 !== 93) {
    state.lastIntValue = ch2;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatClassEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    98
    /* b */
  )) {
    state.lastIntValue = 8;
    return true;
  }
  if (state.switchU && state.eat(
    45
    /* - */
  )) {
    state.lastIntValue = 45;
    return true;
  }
  if (!state.switchU && state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$1.regexp_classSetExpression = function(state) {
  var result = CharSetOk, subResult;
  if (this.regexp_eatClassSetRange(state)) ;
  else if (subResult = this.regexp_eatClassSetOperand(state)) {
    if (subResult === CharSetString) {
      result = CharSetString;
    }
    var start = state.pos;
    while (state.eatChars(
      [38, 38]
      /* && */
    )) {
      if (state.current() !== 38 && (subResult = this.regexp_eatClassSetOperand(state))) {
        if (subResult !== CharSetString) {
          result = CharSetOk;
        }
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
    while (state.eatChars(
      [45, 45]
      /* -- */
    )) {
      if (this.regexp_eatClassSetOperand(state)) {
        continue;
      }
      state.raise("Invalid character in character class");
    }
    if (start !== state.pos) {
      return result;
    }
  } else {
    state.raise("Invalid character in character class");
  }
  for (; ; ) {
    if (this.regexp_eatClassSetRange(state)) {
      continue;
    }
    subResult = this.regexp_eatClassSetOperand(state);
    if (!subResult) {
      return result;
    }
    if (subResult === CharSetString) {
      result = CharSetString;
    }
  }
};
pp$1.regexp_eatClassSetRange = function(state) {
  var start = state.pos;
  if (this.regexp_eatClassSetCharacter(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassSetCharacter(state)) {
      var right = state.lastIntValue;
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatClassSetOperand = function(state) {
  if (this.regexp_eatClassSetCharacter(state)) {
    return CharSetOk;
  }
  return this.regexp_eatClassStringDisjunction(state) || this.regexp_eatNestedClass(state);
};
pp$1.regexp_eatNestedClass = function(state) {
  var start = state.pos;
  if (state.eat(
    91
    /* [ */
  )) {
    var negate = state.eat(
      94
      /* ^ */
    );
    var result = this.regexp_classContents(state);
    if (state.eat(
      93
      /* ] */
    )) {
      if (negate && result === CharSetString) {
        state.raise("Negated character class may contain strings");
      }
      return result;
    }
    state.pos = start;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    var result$1 = this.regexp_eatCharacterClassEscape(state);
    if (result$1) {
      return result$1;
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_eatClassStringDisjunction = function(state) {
  var start = state.pos;
  if (state.eatChars(
    [92, 113]
    /* \q */
  )) {
    if (state.eat(
      123
      /* { */
    )) {
      var result = this.regexp_classStringDisjunctionContents(state);
      if (state.eat(
        125
        /* } */
      )) {
        return result;
      }
    } else {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return null;
};
pp$1.regexp_classStringDisjunctionContents = function(state) {
  var result = this.regexp_classString(state);
  while (state.eat(
    124
    /* | */
  )) {
    if (this.regexp_classString(state) === CharSetString) {
      result = CharSetString;
    }
  }
  return result;
};
pp$1.regexp_classString = function(state) {
  var count = 0;
  while (this.regexp_eatClassSetCharacter(state)) {
    count++;
  }
  return count === 1 ? CharSetOk : CharSetString;
};
pp$1.regexp_eatClassSetCharacter = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatCharacterEscape(state) || this.regexp_eatClassSetReservedPunctuator(state)) {
      return true;
    }
    if (state.eat(
      98
      /* b */
    )) {
      state.lastIntValue = 8;
      return true;
    }
    state.pos = start;
    return false;
  }
  var ch2 = state.current();
  if (ch2 < 0 || ch2 === state.lookahead() && isClassSetReservedDoublePunctuatorCharacter(ch2)) {
    return false;
  }
  if (isClassSetSyntaxCharacter(ch2)) {
    return false;
  }
  state.advance();
  state.lastIntValue = ch2;
  return true;
};
function isClassSetReservedDoublePunctuatorCharacter(ch2) {
  return ch2 === 33 || ch2 >= 35 && ch2 <= 38 || ch2 >= 42 && ch2 <= 44 || ch2 === 46 || ch2 >= 58 && ch2 <= 64 || ch2 === 94 || ch2 === 96 || ch2 === 126;
}
function isClassSetSyntaxCharacter(ch2) {
  return ch2 === 40 || ch2 === 41 || ch2 === 45 || ch2 === 47 || ch2 >= 91 && ch2 <= 93 || ch2 >= 123 && ch2 <= 125;
}
pp$1.regexp_eatClassSetReservedPunctuator = function(state) {
  var ch2 = state.current();
  if (isClassSetReservedPunctuator(ch2)) {
    state.lastIntValue = ch2;
    state.advance();
    return true;
  }
  return false;
};
function isClassSetReservedPunctuator(ch2) {
  return ch2 === 33 || ch2 === 35 || ch2 === 37 || ch2 === 38 || ch2 === 44 || ch2 === 45 || ch2 >= 58 && ch2 <= 62 || ch2 === 64 || ch2 === 96 || ch2 === 126;
}
pp$1.regexp_eatClassControlLetter = function(state) {
  var ch2 = state.current();
  if (isDecimalDigit(ch2) || ch2 === 95) {
    state.lastIntValue = ch2 % 32;
    state.advance();
    return true;
  }
  return false;
};
pp$1.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true;
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false;
};
pp$1.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch2 = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch2 = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch2 - 48);
    state.advance();
  }
  return state.pos !== start;
};
function isDecimalDigit(ch2) {
  return ch2 >= 48 && ch2 <= 57;
}
pp$1.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch2 = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch2 = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch2);
    state.advance();
  }
  return state.pos !== start;
};
function isHexDigit(ch2) {
  return ch2 >= 48 && ch2 <= 57 || ch2 >= 65 && ch2 <= 70 || ch2 >= 97 && ch2 <= 102;
}
function hexToInt(ch2) {
  if (ch2 >= 65 && ch2 <= 70) {
    return 10 + (ch2 - 65);
  }
  if (ch2 >= 97 && ch2 <= 102) {
    return 10 + (ch2 - 97);
  }
  return ch2 - 48;
}
pp$1.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true;
  }
  return false;
};
pp$1.regexp_eatOctalDigit = function(state) {
  var ch2 = state.current();
  if (isOctalDigit(ch2)) {
    state.lastIntValue = ch2 - 48;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch2) {
  return ch2 >= 48 && ch2 <= 55;
}
pp$1.regexp_eatFixedHexDigits = function(state, length) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i2 = 0; i2 < length; ++i2) {
    var ch2 = state.current();
    if (!isHexDigit(ch2)) {
      state.pos = start;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch2);
    state.advance();
  }
  return true;
};
var Token = function Token2(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) {
    this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  }
  if (p.options.ranges) {
    this.range = [p.start, p.end];
  }
};
var pp = Parser.prototype;
pp.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  }
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }
  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};
pp.getToken = function() {
  this.next();
  return new Token(this);
};
if (typeof Symbol !== "undefined") {
  pp[Symbol.iterator] = function() {
    var this$1$1 = this;
    return {
      next: function() {
        var token = this$1$1.getToken();
        return {
          done: token.type === types$1.eof,
          value: token
        };
      }
    };
  };
}
pp.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }
  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types$1.eof);
  }
  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};
pp.readToken = function(code2) {
  if (isIdentifierStart(code2, this.options.ecmaVersion >= 6) || code2 === 92) {
    return this.readWord();
  }
  return this.getTokenFromCode(code2);
};
pp.fullCharCodeAtPos = function() {
  var code2 = this.input.charCodeAt(this.pos);
  if (code2 <= 55295 || code2 >= 56320) {
    return code2;
  }
  var next = this.input.charCodeAt(this.pos + 1);
  return next <= 56319 || next >= 57344 ? code2 : (code2 << 10) + next - 56613888;
};
pp.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    for (var nextBreak = void 0, pos = start; (nextBreak = nextLineBreak(this.input, pos, this.pos)) > -1; ) {
      ++this.curLine;
      pos = this.lineStart = nextBreak;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(
      true,
      this.input.slice(start + 2, end),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch2 = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch2)) {
    ch2 = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(
      false,
      this.input.slice(start + startSkip, this.pos),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp.skipSpace = function() {
  loop: while (this.pos < this.input.length) {
    var ch2 = this.input.charCodeAt(this.pos);
    switch (ch2) {
      case 32:
      case 160:
        ++this.pos;
        break;
      case 13:
        if (this.input.charCodeAt(this.pos + 1) === 10) {
          ++this.pos;
        }
      case 10:
      case 8232:
      case 8233:
        ++this.pos;
        if (this.options.locations) {
          ++this.curLine;
          this.lineStart = this.pos;
        }
        break;
      case 47:
        switch (this.input.charCodeAt(this.pos + 1)) {
          case 42:
            this.skipBlockComment();
            break;
          case 47:
            this.skipLineComment(2);
            break;
          default:
            break loop;
        }
        break;
      default:
        if (ch2 > 8 && ch2 < 14 || ch2 >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch2))) {
          ++this.pos;
        } else {
          break loop;
        }
    }
  }
};
pp.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;
  this.updateContext(prevType);
};
pp.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) {
    return this.readNumber(true);
  }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
    this.pos += 3;
    return this.finishToken(types$1.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types$1.dot);
  }
};
pp.readToken_slash = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.slash, 1);
};
pp.readToken_mult_modulo_exp = function(code2) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code2 === 42 ? types$1.star : types$1.modulo;
  if (this.options.ecmaVersion >= 7 && code2 === 42 && next === 42) {
    ++size;
    tokentype = types$1.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};
pp.readToken_pipe_amp = function(code2) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code2) {
    if (this.options.ecmaVersion >= 12) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 === 61) {
        return this.finishOp(types$1.assign, 3);
      }
    }
    return this.finishOp(code2 === 124 ? types$1.logicalOR : types$1.logicalAND, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(code2 === 124 ? types$1.bitwiseOR : types$1.bitwiseAND, 1);
};
pp.readToken_caret = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.bitwiseXOR, 1);
};
pp.readToken_plus_min = function(code2) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code2) {
    if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types$1.incDec, 2);
  }
  if (next === 61) {
    return this.finishOp(types$1.assign, 2);
  }
  return this.finishOp(types$1.plusMin, 1);
};
pp.readToken_lt_gt = function(code2) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code2) {
    size = code2 === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types$1.assign, size + 1);
    }
    return this.finishOp(types$1.bitShift, size);
  }
  if (next === 33 && code2 === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next === 61) {
    size = 2;
  }
  return this.finishOp(types$1.relational, size);
};
pp.readToken_eq_excl = function(code2) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types$1.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code2 === 61 && next === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types$1.arrow);
  }
  return this.finishOp(code2 === 61 ? types$1.eq : types$1.prefix, 1);
};
pp.readToken_question = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  if (ecmaVersion2 >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) {
        return this.finishOp(types$1.questionDot, 2);
      }
    }
    if (next === 63) {
      if (ecmaVersion2 >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) {
          return this.finishOp(types$1.assign, 3);
        }
      }
      return this.finishOp(types$1.coalesce, 2);
    }
  }
  return this.finishOp(types$1.question, 1);
};
pp.readToken_numberSign = function() {
  var ecmaVersion2 = this.options.ecmaVersion;
  var code2 = 35;
  if (ecmaVersion2 >= 13) {
    ++this.pos;
    code2 = this.fullCharCodeAtPos();
    if (isIdentifierStart(code2, true) || code2 === 92) {
      return this.finishToken(types$1.privateId, this.readWord1());
    }
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code2) + "'");
};
pp.getTokenFromCode = function(code2) {
  switch (code2) {
    case 46:
      return this.readToken_dot();
    case 40:
      ++this.pos;
      return this.finishToken(types$1.parenL);
    case 41:
      ++this.pos;
      return this.finishToken(types$1.parenR);
    case 59:
      ++this.pos;
      return this.finishToken(types$1.semi);
    case 44:
      ++this.pos;
      return this.finishToken(types$1.comma);
    case 91:
      ++this.pos;
      return this.finishToken(types$1.bracketL);
    case 93:
      ++this.pos;
      return this.finishToken(types$1.bracketR);
    case 123:
      ++this.pos;
      return this.finishToken(types$1.braceL);
    case 125:
      ++this.pos;
      return this.finishToken(types$1.braceR);
    case 58:
      ++this.pos;
      return this.finishToken(types$1.colon);
    case 96:
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types$1.backQuote);
    case 48:
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) {
        return this.readRadixNumber(16);
      }
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) {
          return this.readRadixNumber(8);
        }
        if (next === 98 || next === 66) {
          return this.readRadixNumber(2);
        }
      }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    case 34:
    case 39:
      return this.readString(code2);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(code2);
    case 124:
    case 38:
      return this.readToken_pipe_amp(code2);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(code2);
    case 60:
    case 62:
      return this.readToken_lt_gt(code2);
    case 61:
    case 33:
      return this.readToken_eq_excl(code2);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types$1.prefix, 1);
    case 35:
      return this.readToken_numberSign();
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString(code2) + "'");
};
pp.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};
pp.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(start, "Unterminated regular expression");
    }
    var ch2 = this.input.charAt(this.pos);
    if (lineBreak.test(ch2)) {
      this.raise(start, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch2 === "[") {
        inClass = true;
      } else if (ch2 === "]" && inClass) {
        inClass = false;
      } else if (ch2 === "/" && !inClass) {
        break;
      }
      escaped = ch2 === "\\";
    } else {
      escaped = false;
    }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e) {
  }
  return this.finishToken(types$1.regexp, { pattern, flags, value });
};
pp.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  var start = this.pos, total = 0, lastCode = 0;
  for (var i2 = 0, e = len == null ? Infinity : len; i2 < e; ++i2, ++this.pos) {
    var code2 = this.input.charCodeAt(this.pos), val = void 0;
    if (allowSeparators && code2 === 95) {
      if (isLegacyOctalNumericLiteral) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      }
      if (lastCode === 95) {
        this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      }
      if (i2 === 0) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      }
      lastCode = code2;
      continue;
    }
    if (code2 >= 97) {
      val = code2 - 97 + 10;
    } else if (code2 >= 65) {
      val = code2 - 65 + 10;
    } else if (code2 >= 48 && code2 <= 57) {
      val = code2 - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      break;
    }
    lastCode = code2;
    total = total * radix + val;
  }
  if (allowSeparators && lastCode === 95) {
    this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  }
  if (this.pos === start || len != null && this.pos - start !== len) {
    return null;
  }
  return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
pp.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types$1.num, val);
};
pp.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, void 0, true) === null) {
    this.raise(start, "Invalid number");
  }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) {
    this.raise(start, "Invalid number");
  }
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) {
      this.raise(this.pos, "Identifier directly after number");
    }
    return this.finishToken(types$1.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
    octal = false;
  }
  if (next === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) {
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) {
      ++this.pos;
    }
    if (this.readInt(10) === null) {
      this.raise(start, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types$1.num, val);
};
pp.readCodePoint = function() {
  var ch2 = this.input.charCodeAt(this.pos), code2;
  if (ch2 === 123) {
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code2 = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code2 > 1114111) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code2 = this.readHexChar(4);
  }
  return code2;
};
pp.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated string constant");
    }
    var ch2 = this.input.charCodeAt(this.pos);
    if (ch2 === quote) {
      break;
    }
    if (ch2 === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else if (ch2 === 8232 || ch2 === 8233) {
      if (this.options.ecmaVersion < 10) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
      if (this.options.locations) {
        this.curLine++;
        this.lineStart = this.pos;
      }
    } else {
      if (isNewLine(ch2)) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types$1.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }
  this.inTemplateElement = false;
};
pp.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};
pp.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated template");
    }
    var ch2 = this.input.charCodeAt(this.pos);
    if (ch2 === 96 || ch2 === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
      if (this.pos === this.start && (this.type === types$1.template || this.type === types$1.invalidTemplate)) {
        if (ch2 === 36) {
          this.pos += 2;
          return this.finishToken(types$1.dollarBraceL);
        } else {
          ++this.pos;
          return this.finishToken(types$1.backQuote);
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types$1.template, out);
    }
    if (ch2 === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch2)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch2) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch2);
          break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};
pp.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break;
        }
      case "`":
        return this.finishToken(types$1.invalidTemplate, this.input.slice(this.start, this.pos));
      case "\r":
        if (this.input[this.pos + 1] === "\n") {
          ++this.pos;
        }
      case "\n":
      case "\u2028":
      case "\u2029":
        ++this.curLine;
        this.lineStart = this.pos + 1;
        break;
    }
  }
  this.raise(this.start, "Unterminated template");
};
pp.readEscapedChar = function(inTemplate) {
  var ch2 = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch2) {
    case 110:
      return "\n";
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return codePointToString(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      }
    case 10:
      if (this.options.locations) {
        this.lineStart = this.pos;
        ++this.curLine;
      }
      return "";
    case 56:
    case 57:
      if (this.strict) {
        this.invalidStringToken(
          this.pos - 1,
          "Invalid escape sequence"
        );
      }
      if (inTemplate) {
        var codePos = this.pos - 1;
        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );
      }
    default:
      if (ch2 >= 48 && ch2 <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch2 = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch2 === 56 || ch2 === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal);
      }
      if (isNewLine(ch2)) {
        if (this.options.locations) {
          this.lineStart = this.pos;
          ++this.curLine;
        }
        return "";
      }
      return String.fromCharCode(ch2);
  }
};
pp.readHexChar = function(len) {
  var codePos = this.pos;
  var n = this.readInt(16, len);
  if (n === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n;
};
pp.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch2 = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch2, astral)) {
      this.pos += ch2 <= 65535 ? 1 : 2;
    } else if (ch2 === 92) {
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) {
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString(esc);
      chunkStart = this.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};
pp.readWord = function() {
  var word = this.readWord1();
  var type = types$1.name;
  if (this.keywords.test(word)) {
    type = keywords[word];
  }
  return this.finishToken(type, word);
};
var version$1 = "8.15.0";
Parser.acorn = {
  Parser,
  version: version$1,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node,
  TokenType,
  tokTypes: types$1,
  keywordTypes: keywords,
  TokContext,
  tokContexts: types,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parse(input, options) {
  return Parser.parse(input, options);
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x3) {
  return x3 && x3.__esModule && Object.prototype.hasOwnProperty.call(x3, "default") ? x3["default"] : x3;
}
var escodegen = {};
var estraverse = {};
(function(exports$1) {
  (function clone(exports$12) {
    var Syntax, VisitorOption, VisitorKeys, BREAK, SKIP, REMOVE;
    function deepCopy(obj) {
      var ret = {}, key, val;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          val = obj[key];
          if (typeof val === "object" && val !== null) {
            ret[key] = deepCopy(val);
          } else {
            ret[key] = val;
          }
        }
      }
      return ret;
    }
    function upperBound(array, func) {
      var diff, len, i2, current2;
      len = array.length;
      i2 = 0;
      while (len) {
        diff = len >>> 1;
        current2 = i2 + diff;
        if (func(array[current2])) {
          len = diff;
        } else {
          i2 = current2 + 1;
          len -= diff + 1;
        }
      }
      return i2;
    }
    Syntax = {
      AssignmentExpression: "AssignmentExpression",
      AssignmentPattern: "AssignmentPattern",
      ArrayExpression: "ArrayExpression",
      ArrayPattern: "ArrayPattern",
      ArrowFunctionExpression: "ArrowFunctionExpression",
      AwaitExpression: "AwaitExpression",
      // CAUTION: It's deferred to ES7.
      BlockStatement: "BlockStatement",
      BinaryExpression: "BinaryExpression",
      BreakStatement: "BreakStatement",
      CallExpression: "CallExpression",
      CatchClause: "CatchClause",
      ChainExpression: "ChainExpression",
      ClassBody: "ClassBody",
      ClassDeclaration: "ClassDeclaration",
      ClassExpression: "ClassExpression",
      ComprehensionBlock: "ComprehensionBlock",
      // CAUTION: It's deferred to ES7.
      ComprehensionExpression: "ComprehensionExpression",
      // CAUTION: It's deferred to ES7.
      ConditionalExpression: "ConditionalExpression",
      ContinueStatement: "ContinueStatement",
      DebuggerStatement: "DebuggerStatement",
      DirectiveStatement: "DirectiveStatement",
      DoWhileStatement: "DoWhileStatement",
      EmptyStatement: "EmptyStatement",
      ExportAllDeclaration: "ExportAllDeclaration",
      ExportDefaultDeclaration: "ExportDefaultDeclaration",
      ExportNamedDeclaration: "ExportNamedDeclaration",
      ExportSpecifier: "ExportSpecifier",
      ExpressionStatement: "ExpressionStatement",
      ForStatement: "ForStatement",
      ForInStatement: "ForInStatement",
      ForOfStatement: "ForOfStatement",
      FunctionDeclaration: "FunctionDeclaration",
      FunctionExpression: "FunctionExpression",
      GeneratorExpression: "GeneratorExpression",
      // CAUTION: It's deferred to ES7.
      Identifier: "Identifier",
      IfStatement: "IfStatement",
      ImportExpression: "ImportExpression",
      ImportDeclaration: "ImportDeclaration",
      ImportDefaultSpecifier: "ImportDefaultSpecifier",
      ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
      ImportSpecifier: "ImportSpecifier",
      Literal: "Literal",
      LabeledStatement: "LabeledStatement",
      LogicalExpression: "LogicalExpression",
      MemberExpression: "MemberExpression",
      MetaProperty: "MetaProperty",
      MethodDefinition: "MethodDefinition",
      ModuleSpecifier: "ModuleSpecifier",
      NewExpression: "NewExpression",
      ObjectExpression: "ObjectExpression",
      ObjectPattern: "ObjectPattern",
      PrivateIdentifier: "PrivateIdentifier",
      Program: "Program",
      Property: "Property",
      PropertyDefinition: "PropertyDefinition",
      RestElement: "RestElement",
      ReturnStatement: "ReturnStatement",
      SequenceExpression: "SequenceExpression",
      SpreadElement: "SpreadElement",
      Super: "Super",
      SwitchStatement: "SwitchStatement",
      SwitchCase: "SwitchCase",
      TaggedTemplateExpression: "TaggedTemplateExpression",
      TemplateElement: "TemplateElement",
      TemplateLiteral: "TemplateLiteral",
      ThisExpression: "ThisExpression",
      ThrowStatement: "ThrowStatement",
      TryStatement: "TryStatement",
      UnaryExpression: "UnaryExpression",
      UpdateExpression: "UpdateExpression",
      VariableDeclaration: "VariableDeclaration",
      VariableDeclarator: "VariableDeclarator",
      WhileStatement: "WhileStatement",
      WithStatement: "WithStatement",
      YieldExpression: "YieldExpression"
    };
    VisitorKeys = {
      AssignmentExpression: ["left", "right"],
      AssignmentPattern: ["left", "right"],
      ArrayExpression: ["elements"],
      ArrayPattern: ["elements"],
      ArrowFunctionExpression: ["params", "body"],
      AwaitExpression: ["argument"],
      // CAUTION: It's deferred to ES7.
      BlockStatement: ["body"],
      BinaryExpression: ["left", "right"],
      BreakStatement: ["label"],
      CallExpression: ["callee", "arguments"],
      CatchClause: ["param", "body"],
      ChainExpression: ["expression"],
      ClassBody: ["body"],
      ClassDeclaration: ["id", "superClass", "body"],
      ClassExpression: ["id", "superClass", "body"],
      ComprehensionBlock: ["left", "right"],
      // CAUTION: It's deferred to ES7.
      ComprehensionExpression: ["blocks", "filter", "body"],
      // CAUTION: It's deferred to ES7.
      ConditionalExpression: ["test", "consequent", "alternate"],
      ContinueStatement: ["label"],
      DebuggerStatement: [],
      DirectiveStatement: [],
      DoWhileStatement: ["body", "test"],
      EmptyStatement: [],
      ExportAllDeclaration: ["source"],
      ExportDefaultDeclaration: ["declaration"],
      ExportNamedDeclaration: ["declaration", "specifiers", "source"],
      ExportSpecifier: ["exported", "local"],
      ExpressionStatement: ["expression"],
      ForStatement: ["init", "test", "update", "body"],
      ForInStatement: ["left", "right", "body"],
      ForOfStatement: ["left", "right", "body"],
      FunctionDeclaration: ["id", "params", "body"],
      FunctionExpression: ["id", "params", "body"],
      GeneratorExpression: ["blocks", "filter", "body"],
      // CAUTION: It's deferred to ES7.
      Identifier: [],
      IfStatement: ["test", "consequent", "alternate"],
      ImportExpression: ["source"],
      ImportDeclaration: ["specifiers", "source"],
      ImportDefaultSpecifier: ["local"],
      ImportNamespaceSpecifier: ["local"],
      ImportSpecifier: ["imported", "local"],
      Literal: [],
      LabeledStatement: ["label", "body"],
      LogicalExpression: ["left", "right"],
      MemberExpression: ["object", "property"],
      MetaProperty: ["meta", "property"],
      MethodDefinition: ["key", "value"],
      ModuleSpecifier: [],
      NewExpression: ["callee", "arguments"],
      ObjectExpression: ["properties"],
      ObjectPattern: ["properties"],
      PrivateIdentifier: [],
      Program: ["body"],
      Property: ["key", "value"],
      PropertyDefinition: ["key", "value"],
      RestElement: ["argument"],
      ReturnStatement: ["argument"],
      SequenceExpression: ["expressions"],
      SpreadElement: ["argument"],
      Super: [],
      SwitchStatement: ["discriminant", "cases"],
      SwitchCase: ["test", "consequent"],
      TaggedTemplateExpression: ["tag", "quasi"],
      TemplateElement: [],
      TemplateLiteral: ["quasis", "expressions"],
      ThisExpression: [],
      ThrowStatement: ["argument"],
      TryStatement: ["block", "handler", "finalizer"],
      UnaryExpression: ["argument"],
      UpdateExpression: ["argument"],
      VariableDeclaration: ["declarations"],
      VariableDeclarator: ["id", "init"],
      WhileStatement: ["test", "body"],
      WithStatement: ["object", "body"],
      YieldExpression: ["argument"]
    };
    BREAK = {};
    SKIP = {};
    REMOVE = {};
    VisitorOption = {
      Break: BREAK,
      Skip: SKIP,
      Remove: REMOVE
    };
    function Reference(parent, key) {
      this.parent = parent;
      this.key = key;
    }
    Reference.prototype.replace = function replace2(node) {
      this.parent[this.key] = node;
    };
    Reference.prototype.remove = function remove() {
      if (Array.isArray(this.parent)) {
        this.parent.splice(this.key, 1);
        return true;
      } else {
        this.replace(null);
        return false;
      }
    };
    function Element(node, path, wrap, ref2) {
      this.node = node;
      this.path = path;
      this.wrap = wrap;
      this.ref = ref2;
    }
    function Controller() {
    }
    Controller.prototype.path = function path() {
      var i2, iz, j2, jz, result, element;
      function addToPath(result2, path2) {
        if (Array.isArray(path2)) {
          for (j2 = 0, jz = path2.length; j2 < jz; ++j2) {
            result2.push(path2[j2]);
          }
        } else {
          result2.push(path2);
        }
      }
      if (!this.__current.path) {
        return null;
      }
      result = [];
      for (i2 = 2, iz = this.__leavelist.length; i2 < iz; ++i2) {
        element = this.__leavelist[i2];
        addToPath(result, element.path);
      }
      addToPath(result, this.__current.path);
      return result;
    };
    Controller.prototype.type = function() {
      var node = this.current();
      return node.type || this.__current.wrap;
    };
    Controller.prototype.parents = function parents() {
      var i2, iz, result;
      result = [];
      for (i2 = 1, iz = this.__leavelist.length; i2 < iz; ++i2) {
        result.push(this.__leavelist[i2].node);
      }
      return result;
    };
    Controller.prototype.current = function current2() {
      return this.__current.node;
    };
    Controller.prototype.__execute = function __execute(callback, element) {
      var previous, result;
      result = void 0;
      previous = this.__current;
      this.__current = element;
      this.__state = null;
      if (callback) {
        result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
      }
      this.__current = previous;
      return result;
    };
    Controller.prototype.notify = function notify(flag) {
      this.__state = flag;
    };
    Controller.prototype.skip = function() {
      this.notify(SKIP);
    };
    Controller.prototype["break"] = function() {
      this.notify(BREAK);
    };
    Controller.prototype.remove = function() {
      this.notify(REMOVE);
    };
    Controller.prototype.__initialize = function(root, visitor) {
      this.visitor = visitor;
      this.root = root;
      this.__worklist = [];
      this.__leavelist = [];
      this.__current = null;
      this.__state = null;
      this.__fallback = null;
      if (visitor.fallback === "iteration") {
        this.__fallback = Object.keys;
      } else if (typeof visitor.fallback === "function") {
        this.__fallback = visitor.fallback;
      }
      this.__keys = VisitorKeys;
      if (visitor.keys) {
        this.__keys = Object.assign(Object.create(this.__keys), visitor.keys);
      }
    };
    function isNode2(node) {
      if (node == null) {
        return false;
      }
      return typeof node === "object" && typeof node.type === "string";
    }
    function isProperty(nodeType, key) {
      return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && "properties" === key;
    }
    function candidateExistsInLeaveList(leavelist, candidate) {
      for (var i2 = leavelist.length - 1; i2 >= 0; --i2) {
        if (leavelist[i2].node === candidate) {
          return true;
        }
      }
      return false;
    }
    Controller.prototype.traverse = function traverse2(root, visitor) {
      var worklist, leavelist, element, node, nodeType, ret, key, current2, current22, candidates, candidate, sentinel;
      this.__initialize(root, visitor);
      sentinel = {};
      worklist = this.__worklist;
      leavelist = this.__leavelist;
      worklist.push(new Element(root, null, null, null));
      leavelist.push(new Element(null, null, null, null));
      while (worklist.length) {
        element = worklist.pop();
        if (element === sentinel) {
          element = leavelist.pop();
          ret = this.__execute(visitor.leave, element);
          if (this.__state === BREAK || ret === BREAK) {
            return;
          }
          continue;
        }
        if (element.node) {
          ret = this.__execute(visitor.enter, element);
          if (this.__state === BREAK || ret === BREAK) {
            return;
          }
          worklist.push(sentinel);
          leavelist.push(element);
          if (this.__state === SKIP || ret === SKIP) {
            continue;
          }
          node = element.node;
          nodeType = node.type || element.wrap;
          candidates = this.__keys[nodeType];
          if (!candidates) {
            if (this.__fallback) {
              candidates = this.__fallback(node);
            } else {
              throw new Error("Unknown node type " + nodeType + ".");
            }
          }
          current2 = candidates.length;
          while ((current2 -= 1) >= 0) {
            key = candidates[current2];
            candidate = node[key];
            if (!candidate) {
              continue;
            }
            if (Array.isArray(candidate)) {
              current22 = candidate.length;
              while ((current22 -= 1) >= 0) {
                if (!candidate[current22]) {
                  continue;
                }
                if (candidateExistsInLeaveList(leavelist, candidate[current22])) {
                  continue;
                }
                if (isProperty(nodeType, candidates[current2])) {
                  element = new Element(candidate[current22], [key, current22], "Property", null);
                } else if (isNode2(candidate[current22])) {
                  element = new Element(candidate[current22], [key, current22], null, null);
                } else {
                  continue;
                }
                worklist.push(element);
              }
            } else if (isNode2(candidate)) {
              if (candidateExistsInLeaveList(leavelist, candidate)) {
                continue;
              }
              worklist.push(new Element(candidate, key, null, null));
            }
          }
        }
      }
    };
    Controller.prototype.replace = function replace2(root, visitor) {
      var worklist, leavelist, node, nodeType, target, element, current2, current22, candidates, candidate, sentinel, outer, key;
      function removeElem(element2) {
        var i2, key2, nextElem, parent;
        if (element2.ref.remove()) {
          key2 = element2.ref.key;
          parent = element2.ref.parent;
          i2 = worklist.length;
          while (i2--) {
            nextElem = worklist[i2];
            if (nextElem.ref && nextElem.ref.parent === parent) {
              if (nextElem.ref.key < key2) {
                break;
              }
              --nextElem.ref.key;
            }
          }
        }
      }
      this.__initialize(root, visitor);
      sentinel = {};
      worklist = this.__worklist;
      leavelist = this.__leavelist;
      outer = {
        root
      };
      element = new Element(root, null, null, new Reference(outer, "root"));
      worklist.push(element);
      leavelist.push(element);
      while (worklist.length) {
        element = worklist.pop();
        if (element === sentinel) {
          element = leavelist.pop();
          target = this.__execute(visitor.leave, element);
          if (target !== void 0 && target !== BREAK && target !== SKIP && target !== REMOVE) {
            element.ref.replace(target);
          }
          if (this.__state === REMOVE || target === REMOVE) {
            removeElem(element);
          }
          if (this.__state === BREAK || target === BREAK) {
            return outer.root;
          }
          continue;
        }
        target = this.__execute(visitor.enter, element);
        if (target !== void 0 && target !== BREAK && target !== SKIP && target !== REMOVE) {
          element.ref.replace(target);
          element.node = target;
        }
        if (this.__state === REMOVE || target === REMOVE) {
          removeElem(element);
          element.node = null;
        }
        if (this.__state === BREAK || target === BREAK) {
          return outer.root;
        }
        node = element.node;
        if (!node) {
          continue;
        }
        worklist.push(sentinel);
        leavelist.push(element);
        if (this.__state === SKIP || target === SKIP) {
          continue;
        }
        nodeType = node.type || element.wrap;
        candidates = this.__keys[nodeType];
        if (!candidates) {
          if (this.__fallback) {
            candidates = this.__fallback(node);
          } else {
            throw new Error("Unknown node type " + nodeType + ".");
          }
        }
        current2 = candidates.length;
        while ((current2 -= 1) >= 0) {
          key = candidates[current2];
          candidate = node[key];
          if (!candidate) {
            continue;
          }
          if (Array.isArray(candidate)) {
            current22 = candidate.length;
            while ((current22 -= 1) >= 0) {
              if (!candidate[current22]) {
                continue;
              }
              if (isProperty(nodeType, candidates[current2])) {
                element = new Element(candidate[current22], [key, current22], "Property", new Reference(candidate, current22));
              } else if (isNode2(candidate[current22])) {
                element = new Element(candidate[current22], [key, current22], null, new Reference(candidate, current22));
              } else {
                continue;
              }
              worklist.push(element);
            }
          } else if (isNode2(candidate)) {
            worklist.push(new Element(candidate, key, null, new Reference(node, key)));
          }
        }
      }
      return outer.root;
    };
    function traverse(root, visitor) {
      var controller = new Controller();
      return controller.traverse(root, visitor);
    }
    function replace(root, visitor) {
      var controller = new Controller();
      return controller.replace(root, visitor);
    }
    function extendCommentRange(comment2, tokens) {
      var target;
      target = upperBound(tokens, function search(token) {
        return token.range[0] > comment2.range[0];
      });
      comment2.extendedRange = [comment2.range[0], comment2.range[1]];
      if (target !== tokens.length) {
        comment2.extendedRange[1] = tokens[target].range[0];
      }
      target -= 1;
      if (target >= 0) {
        comment2.extendedRange[0] = tokens[target].range[1];
      }
      return comment2;
    }
    function attachComments(tree, providedComments, tokens) {
      var comments = [], comment2, len, i2, cursor;
      if (!tree.range) {
        throw new Error("attachComments needs range information");
      }
      if (!tokens.length) {
        if (providedComments.length) {
          for (i2 = 0, len = providedComments.length; i2 < len; i2 += 1) {
            comment2 = deepCopy(providedComments[i2]);
            comment2.extendedRange = [0, tree.range[0]];
            comments.push(comment2);
          }
          tree.leadingComments = comments;
        }
        return tree;
      }
      for (i2 = 0, len = providedComments.length; i2 < len; i2 += 1) {
        comments.push(extendCommentRange(deepCopy(providedComments[i2]), tokens));
      }
      cursor = 0;
      traverse(tree, {
        enter: function(node) {
          var comment3;
          while (cursor < comments.length) {
            comment3 = comments[cursor];
            if (comment3.extendedRange[1] > node.range[0]) {
              break;
            }
            if (comment3.extendedRange[1] === node.range[0]) {
              if (!node.leadingComments) {
                node.leadingComments = [];
              }
              node.leadingComments.push(comment3);
              comments.splice(cursor, 1);
            } else {
              cursor += 1;
            }
          }
          if (cursor === comments.length) {
            return VisitorOption.Break;
          }
          if (comments[cursor].extendedRange[0] > node.range[1]) {
            return VisitorOption.Skip;
          }
        }
      });
      cursor = 0;
      traverse(tree, {
        leave: function(node) {
          var comment3;
          while (cursor < comments.length) {
            comment3 = comments[cursor];
            if (node.range[1] < comment3.extendedRange[0]) {
              break;
            }
            if (node.range[1] === comment3.extendedRange[0]) {
              if (!node.trailingComments) {
                node.trailingComments = [];
              }
              node.trailingComments.push(comment3);
              comments.splice(cursor, 1);
            } else {
              cursor += 1;
            }
          }
          if (cursor === comments.length) {
            return VisitorOption.Break;
          }
          if (comments[cursor].extendedRange[0] > node.range[1]) {
            return VisitorOption.Skip;
          }
        }
      });
      return tree;
    }
    exports$12.Syntax = Syntax;
    exports$12.traverse = traverse;
    exports$12.replace = replace;
    exports$12.attachComments = attachComments;
    exports$12.VisitorKeys = VisitorKeys;
    exports$12.VisitorOption = VisitorOption;
    exports$12.Controller = Controller;
    exports$12.cloneEnvironment = function() {
      return clone({});
    };
    return exports$12;
  })(exports$1);
})(estraverse);
var utils = {};
var ast = { exports: {} };
(function() {
  function isExpression(node) {
    if (node == null) {
      return false;
    }
    switch (node.type) {
      case "ArrayExpression":
      case "AssignmentExpression":
      case "BinaryExpression":
      case "CallExpression":
      case "ConditionalExpression":
      case "FunctionExpression":
      case "Identifier":
      case "Literal":
      case "LogicalExpression":
      case "MemberExpression":
      case "NewExpression":
      case "ObjectExpression":
      case "SequenceExpression":
      case "ThisExpression":
      case "UnaryExpression":
      case "UpdateExpression":
        return true;
    }
    return false;
  }
  function isIterationStatement(node) {
    if (node == null) {
      return false;
    }
    switch (node.type) {
      case "DoWhileStatement":
      case "ForInStatement":
      case "ForStatement":
      case "WhileStatement":
        return true;
    }
    return false;
  }
  function isStatement(node) {
    if (node == null) {
      return false;
    }
    switch (node.type) {
      case "BlockStatement":
      case "BreakStatement":
      case "ContinueStatement":
      case "DebuggerStatement":
      case "DoWhileStatement":
      case "EmptyStatement":
      case "ExpressionStatement":
      case "ForInStatement":
      case "ForStatement":
      case "IfStatement":
      case "LabeledStatement":
      case "ReturnStatement":
      case "SwitchStatement":
      case "ThrowStatement":
      case "TryStatement":
      case "VariableDeclaration":
      case "WhileStatement":
      case "WithStatement":
        return true;
    }
    return false;
  }
  function isSourceElement(node) {
    return isStatement(node) || node != null && node.type === "FunctionDeclaration";
  }
  function trailingStatement(node) {
    switch (node.type) {
      case "IfStatement":
        if (node.alternate != null) {
          return node.alternate;
        }
        return node.consequent;
      case "LabeledStatement":
      case "ForStatement":
      case "ForInStatement":
      case "WhileStatement":
      case "WithStatement":
        return node.body;
    }
    return null;
  }
  function isProblematicIfStatement(node) {
    var current2;
    if (node.type !== "IfStatement") {
      return false;
    }
    if (node.alternate == null) {
      return false;
    }
    current2 = node.consequent;
    do {
      if (current2.type === "IfStatement") {
        if (current2.alternate == null) {
          return true;
        }
      }
      current2 = trailingStatement(current2);
    } while (current2);
    return false;
  }
  ast.exports = {
    isExpression,
    isStatement,
    isIterationStatement,
    isSourceElement,
    isProblematicIfStatement,
    trailingStatement
  };
})();
var astExports = ast.exports;
var code = { exports: {} };
(function() {
  var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch2;
  ES5Regex = {
    // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierStart:
    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
    // ECMAScript 5.1/Unicode v9.0.0 NonAsciiIdentifierPart:
    NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
  };
  ES6Regex = {
    // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierStart:
    NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]/,
    // ECMAScript 6/Unicode v9.0.0 NonAsciiIdentifierPart:
    NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
  };
  function isDecimalDigit2(ch3) {
    return 48 <= ch3 && ch3 <= 57;
  }
  function isHexDigit2(ch3) {
    return 48 <= ch3 && ch3 <= 57 || // 0..9
    97 <= ch3 && ch3 <= 102 || // a..f
    65 <= ch3 && ch3 <= 70;
  }
  function isOctalDigit2(ch3) {
    return ch3 >= 48 && ch3 <= 55;
  }
  NON_ASCII_WHITESPACES = [
    5760,
    8192,
    8193,
    8194,
    8195,
    8196,
    8197,
    8198,
    8199,
    8200,
    8201,
    8202,
    8239,
    8287,
    12288,
    65279
  ];
  function isWhiteSpace(ch3) {
    return ch3 === 32 || ch3 === 9 || ch3 === 11 || ch3 === 12 || ch3 === 160 || ch3 >= 5760 && NON_ASCII_WHITESPACES.indexOf(ch3) >= 0;
  }
  function isLineTerminator(ch3) {
    return ch3 === 10 || ch3 === 13 || ch3 === 8232 || ch3 === 8233;
  }
  function fromCodePoint(cp2) {
    if (cp2 <= 65535) {
      return String.fromCharCode(cp2);
    }
    var cu1 = String.fromCharCode(Math.floor((cp2 - 65536) / 1024) + 55296);
    var cu2 = String.fromCharCode((cp2 - 65536) % 1024 + 56320);
    return cu1 + cu2;
  }
  IDENTIFIER_START = new Array(128);
  for (ch2 = 0; ch2 < 128; ++ch2) {
    IDENTIFIER_START[ch2] = ch2 >= 97 && ch2 <= 122 || // a..z
    ch2 >= 65 && ch2 <= 90 || // A..Z
    ch2 === 36 || ch2 === 95;
  }
  IDENTIFIER_PART = new Array(128);
  for (ch2 = 0; ch2 < 128; ++ch2) {
    IDENTIFIER_PART[ch2] = ch2 >= 97 && ch2 <= 122 || // a..z
    ch2 >= 65 && ch2 <= 90 || // A..Z
    ch2 >= 48 && ch2 <= 57 || // 0..9
    ch2 === 36 || ch2 === 95;
  }
  function isIdentifierStartES5(ch3) {
    return ch3 < 128 ? IDENTIFIER_START[ch3] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch3));
  }
  function isIdentifierPartES5(ch3) {
    return ch3 < 128 ? IDENTIFIER_PART[ch3] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch3));
  }
  function isIdentifierStartES6(ch3) {
    return ch3 < 128 ? IDENTIFIER_START[ch3] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch3));
  }
  function isIdentifierPartES6(ch3) {
    return ch3 < 128 ? IDENTIFIER_PART[ch3] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch3));
  }
  code.exports = {
    isDecimalDigit: isDecimalDigit2,
    isHexDigit: isHexDigit2,
    isOctalDigit: isOctalDigit2,
    isWhiteSpace,
    isLineTerminator,
    isIdentifierStartES5,
    isIdentifierPartES5,
    isIdentifierStartES6,
    isIdentifierPartES6
  };
})();
var codeExports = code.exports;
var keyword$1 = { exports: {} };
(function() {
  var code2 = codeExports;
  function isStrictModeReservedWordES6(id2) {
    switch (id2) {
      case "implements":
      case "interface":
      case "package":
      case "private":
      case "protected":
      case "public":
      case "static":
      case "let":
        return true;
      default:
        return false;
    }
  }
  function isKeywordES5(id2, strict) {
    if (!strict && id2 === "yield") {
      return false;
    }
    return isKeywordES6(id2, strict);
  }
  function isKeywordES6(id2, strict) {
    if (strict && isStrictModeReservedWordES6(id2)) {
      return true;
    }
    switch (id2.length) {
      case 2:
        return id2 === "if" || id2 === "in" || id2 === "do";
      case 3:
        return id2 === "var" || id2 === "for" || id2 === "new" || id2 === "try";
      case 4:
        return id2 === "this" || id2 === "else" || id2 === "case" || id2 === "void" || id2 === "with" || id2 === "enum";
      case 5:
        return id2 === "while" || id2 === "break" || id2 === "catch" || id2 === "throw" || id2 === "const" || id2 === "yield" || id2 === "class" || id2 === "super";
      case 6:
        return id2 === "return" || id2 === "typeof" || id2 === "delete" || id2 === "switch" || id2 === "export" || id2 === "import";
      case 7:
        return id2 === "default" || id2 === "finally" || id2 === "extends";
      case 8:
        return id2 === "function" || id2 === "continue" || id2 === "debugger";
      case 10:
        return id2 === "instanceof";
      default:
        return false;
    }
  }
  function isReservedWordES5(id2, strict) {
    return id2 === "null" || id2 === "true" || id2 === "false" || isKeywordES5(id2, strict);
  }
  function isReservedWordES6(id2, strict) {
    return id2 === "null" || id2 === "true" || id2 === "false" || isKeywordES6(id2, strict);
  }
  function isRestrictedWord(id2) {
    return id2 === "eval" || id2 === "arguments";
  }
  function isIdentifierNameES5(id2) {
    var i2, iz, ch2;
    if (id2.length === 0) {
      return false;
    }
    ch2 = id2.charCodeAt(0);
    if (!code2.isIdentifierStartES5(ch2)) {
      return false;
    }
    for (i2 = 1, iz = id2.length; i2 < iz; ++i2) {
      ch2 = id2.charCodeAt(i2);
      if (!code2.isIdentifierPartES5(ch2)) {
        return false;
      }
    }
    return true;
  }
  function decodeUtf16(lead, trail) {
    return (lead - 55296) * 1024 + (trail - 56320) + 65536;
  }
  function isIdentifierNameES6(id2) {
    var i2, iz, ch2, lowCh, check;
    if (id2.length === 0) {
      return false;
    }
    check = code2.isIdentifierStartES6;
    for (i2 = 0, iz = id2.length; i2 < iz; ++i2) {
      ch2 = id2.charCodeAt(i2);
      if (55296 <= ch2 && ch2 <= 56319) {
        ++i2;
        if (i2 >= iz) {
          return false;
        }
        lowCh = id2.charCodeAt(i2);
        if (!(56320 <= lowCh && lowCh <= 57343)) {
          return false;
        }
        ch2 = decodeUtf16(ch2, lowCh);
      }
      if (!check(ch2)) {
        return false;
      }
      check = code2.isIdentifierPartES6;
    }
    return true;
  }
  function isIdentifierES5(id2, strict) {
    return isIdentifierNameES5(id2) && !isReservedWordES5(id2, strict);
  }
  function isIdentifierES6(id2, strict) {
    return isIdentifierNameES6(id2) && !isReservedWordES6(id2, strict);
  }
  keyword$1.exports = {
    isKeywordES5,
    isKeywordES6,
    isReservedWordES5,
    isReservedWordES6,
    isRestrictedWord,
    isIdentifierNameES5,
    isIdentifierNameES6,
    isIdentifierES5,
    isIdentifierES6
  };
})();
var keywordExports = keyword$1.exports;
(function() {
  utils.ast = astExports;
  utils.code = codeExports;
  utils.keyword = keywordExports;
})();
var sourceMap = {};
var sourceMapGenerator = {};
var base64Vlq = {};
var base64 = {};
var hasRequiredBase64;
function requireBase64() {
  if (hasRequiredBase64) return base64;
  hasRequiredBase64 = 1;
  var intToCharMap = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
  base64.encode = function(number2) {
    if (0 <= number2 && number2 < intToCharMap.length) {
      return intToCharMap[number2];
    }
    throw new TypeError("Must be between 0 and 63: " + number2);
  };
  base64.decode = function(charCode) {
    var bigA = 65;
    var bigZ = 90;
    var littleA = 97;
    var littleZ = 122;
    var zero = 48;
    var nine = 57;
    var plus = 43;
    var slash = 47;
    var littleOffset = 26;
    var numberOffset = 52;
    if (bigA <= charCode && charCode <= bigZ) {
      return charCode - bigA;
    }
    if (littleA <= charCode && charCode <= littleZ) {
      return charCode - littleA + littleOffset;
    }
    if (zero <= charCode && charCode <= nine) {
      return charCode - zero + numberOffset;
    }
    if (charCode == plus) {
      return 62;
    }
    if (charCode == slash) {
      return 63;
    }
    return -1;
  };
  return base64;
}
var hasRequiredBase64Vlq;
function requireBase64Vlq() {
  if (hasRequiredBase64Vlq) return base64Vlq;
  hasRequiredBase64Vlq = 1;
  var base642 = requireBase64();
  var VLQ_BASE_SHIFT = 5;
  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
  var VLQ_BASE_MASK = VLQ_BASE - 1;
  var VLQ_CONTINUATION_BIT = VLQ_BASE;
  function toVLQSigned(aValue) {
    return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
  }
  function fromVLQSigned(aValue) {
    var isNegative = (aValue & 1) === 1;
    var shifted = aValue >> 1;
    return isNegative ? -shifted : shifted;
  }
  base64Vlq.encode = function base64VLQ_encode(aValue) {
    var encoded = "";
    var digit;
    var vlq = toVLQSigned(aValue);
    do {
      digit = vlq & VLQ_BASE_MASK;
      vlq >>>= VLQ_BASE_SHIFT;
      if (vlq > 0) {
        digit |= VLQ_CONTINUATION_BIT;
      }
      encoded += base642.encode(digit);
    } while (vlq > 0);
    return encoded;
  };
  base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
    var strLen = aStr.length;
    var result = 0;
    var shift = 0;
    var continuation, digit;
    do {
      if (aIndex >= strLen) {
        throw new Error("Expected more digits in base 64 VLQ value.");
      }
      digit = base642.decode(aStr.charCodeAt(aIndex++));
      if (digit === -1) {
        throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
      }
      continuation = !!(digit & VLQ_CONTINUATION_BIT);
      digit &= VLQ_BASE_MASK;
      result = result + (digit << shift);
      shift += VLQ_BASE_SHIFT;
    } while (continuation);
    aOutParam.value = fromVLQSigned(result);
    aOutParam.rest = aIndex;
  };
  return base64Vlq;
}
var util = {};
var hasRequiredUtil;
function requireUtil() {
  if (hasRequiredUtil) return util;
  hasRequiredUtil = 1;
  (function(exports$1) {
    function getArg(aArgs, aName, aDefaultValue) {
      if (aName in aArgs) {
        return aArgs[aName];
      } else if (arguments.length === 3) {
        return aDefaultValue;
      } else {
        throw new Error('"' + aName + '" is a required argument.');
      }
    }
    exports$1.getArg = getArg;
    var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
    var dataUrlRegexp = /^data:.+\,.+$/;
    function urlParse(aUrl) {
      var match = aUrl.match(urlRegexp);
      if (!match) {
        return null;
      }
      return {
        scheme: match[1],
        auth: match[2],
        host: match[3],
        port: match[4],
        path: match[5]
      };
    }
    exports$1.urlParse = urlParse;
    function urlGenerate(aParsedUrl) {
      var url2 = "";
      if (aParsedUrl.scheme) {
        url2 += aParsedUrl.scheme + ":";
      }
      url2 += "//";
      if (aParsedUrl.auth) {
        url2 += aParsedUrl.auth + "@";
      }
      if (aParsedUrl.host) {
        url2 += aParsedUrl.host;
      }
      if (aParsedUrl.port) {
        url2 += ":" + aParsedUrl.port;
      }
      if (aParsedUrl.path) {
        url2 += aParsedUrl.path;
      }
      return url2;
    }
    exports$1.urlGenerate = urlGenerate;
    function normalize(aPath) {
      var path = aPath;
      var url2 = urlParse(aPath);
      if (url2) {
        if (!url2.path) {
          return aPath;
        }
        path = url2.path;
      }
      var isAbsolute = exports$1.isAbsolute(path);
      var parts = path.split(/\/+/);
      for (var part, up2 = 0, i2 = parts.length - 1; i2 >= 0; i2--) {
        part = parts[i2];
        if (part === ".") {
          parts.splice(i2, 1);
        } else if (part === "..") {
          up2++;
        } else if (up2 > 0) {
          if (part === "") {
            parts.splice(i2 + 1, up2);
            up2 = 0;
          } else {
            parts.splice(i2, 2);
            up2--;
          }
        }
      }
      path = parts.join("/");
      if (path === "") {
        path = isAbsolute ? "/" : ".";
      }
      if (url2) {
        url2.path = path;
        return urlGenerate(url2);
      }
      return path;
    }
    exports$1.normalize = normalize;
    function join(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      if (aPath === "") {
        aPath = ".";
      }
      var aPathUrl = urlParse(aPath);
      var aRootUrl = urlParse(aRoot);
      if (aRootUrl) {
        aRoot = aRootUrl.path || "/";
      }
      if (aPathUrl && !aPathUrl.scheme) {
        if (aRootUrl) {
          aPathUrl.scheme = aRootUrl.scheme;
        }
        return urlGenerate(aPathUrl);
      }
      if (aPathUrl || aPath.match(dataUrlRegexp)) {
        return aPath;
      }
      if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
        aRootUrl.host = aPath;
        return urlGenerate(aRootUrl);
      }
      var joined = aPath.charAt(0) === "/" ? aPath : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
      if (aRootUrl) {
        aRootUrl.path = joined;
        return urlGenerate(aRootUrl);
      }
      return joined;
    }
    exports$1.join = join;
    exports$1.isAbsolute = function(aPath) {
      return aPath.charAt(0) === "/" || urlRegexp.test(aPath);
    };
    function relative(aRoot, aPath) {
      if (aRoot === "") {
        aRoot = ".";
      }
      aRoot = aRoot.replace(/\/$/, "");
      var level = 0;
      while (aPath.indexOf(aRoot + "/") !== 0) {
        var index = aRoot.lastIndexOf("/");
        if (index < 0) {
          return aPath;
        }
        aRoot = aRoot.slice(0, index);
        if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
          return aPath;
        }
        ++level;
      }
      return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
    }
    exports$1.relative = relative;
    var supportsNullProto = function() {
      var obj = /* @__PURE__ */ Object.create(null);
      return !("__proto__" in obj);
    }();
    function identity2(s) {
      return s;
    }
    function toSetString(aStr) {
      if (isProtoString(aStr)) {
        return "$" + aStr;
      }
      return aStr;
    }
    exports$1.toSetString = supportsNullProto ? identity2 : toSetString;
    function fromSetString(aStr) {
      if (isProtoString(aStr)) {
        return aStr.slice(1);
      }
      return aStr;
    }
    exports$1.fromSetString = supportsNullProto ? identity2 : fromSetString;
    function isProtoString(s) {
      if (!s) {
        return false;
      }
      var length = s.length;
      if (length < 9) {
        return false;
      }
      if (s.charCodeAt(length - 1) !== 95 || s.charCodeAt(length - 2) !== 95 || s.charCodeAt(length - 3) !== 111 || s.charCodeAt(length - 4) !== 116 || s.charCodeAt(length - 5) !== 111 || s.charCodeAt(length - 6) !== 114 || s.charCodeAt(length - 7) !== 112 || s.charCodeAt(length - 8) !== 95 || s.charCodeAt(length - 9) !== 95) {
        return false;
      }
      for (var i2 = length - 10; i2 >= 0; i2--) {
        if (s.charCodeAt(i2) !== 36) {
          return false;
        }
      }
      return true;
    }
    function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
      var cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0 || onlyCompareOriginal) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByOriginalPositions = compareByOriginalPositions;
    function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0 || onlyCompareGenerated) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;
    function strcmp(aStr1, aStr2) {
      if (aStr1 === aStr2) {
        return 0;
      }
      if (aStr1 === null) {
        return 1;
      }
      if (aStr2 === null) {
        return -1;
      }
      if (aStr1 > aStr2) {
        return 1;
      }
      return -1;
    }
    function compareByGeneratedPositionsInflated(mappingA, mappingB) {
      var cmp = mappingA.generatedLine - mappingB.generatedLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.generatedColumn - mappingB.generatedColumn;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = strcmp(mappingA.source, mappingB.source);
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalLine - mappingB.originalLine;
      if (cmp !== 0) {
        return cmp;
      }
      cmp = mappingA.originalColumn - mappingB.originalColumn;
      if (cmp !== 0) {
        return cmp;
      }
      return strcmp(mappingA.name, mappingB.name);
    }
    exports$1.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;
    function parseSourceMapInput(str) {
      return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ""));
    }
    exports$1.parseSourceMapInput = parseSourceMapInput;
    function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
      sourceURL = sourceURL || "";
      if (sourceRoot) {
        if (sourceRoot[sourceRoot.length - 1] !== "/" && sourceURL[0] !== "/") {
          sourceRoot += "/";
        }
        sourceURL = sourceRoot + sourceURL;
      }
      if (sourceMapURL) {
        var parsed = urlParse(sourceMapURL);
        if (!parsed) {
          throw new Error("sourceMapURL could not be parsed");
        }
        if (parsed.path) {
          var index = parsed.path.lastIndexOf("/");
          if (index >= 0) {
            parsed.path = parsed.path.substring(0, index + 1);
          }
        }
        sourceURL = join(urlGenerate(parsed), sourceURL);
      }
      return normalize(sourceURL);
    }
    exports$1.computeSourceURL = computeSourceURL;
  })(util);
  return util;
}
var arraySet = {};
var hasRequiredArraySet;
function requireArraySet() {
  if (hasRequiredArraySet) return arraySet;
  hasRequiredArraySet = 1;
  var util2 = requireUtil();
  var has = Object.prototype.hasOwnProperty;
  var hasNativeMap = typeof Map !== "undefined";
  function ArraySet() {
    this._array = [];
    this._set = hasNativeMap ? /* @__PURE__ */ new Map() : /* @__PURE__ */ Object.create(null);
  }
  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
    var set = new ArraySet();
    for (var i2 = 0, len = aArray.length; i2 < len; i2++) {
      set.add(aArray[i2], aAllowDuplicates);
    }
    return set;
  };
  ArraySet.prototype.size = function ArraySet_size() {
    return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
  };
  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
    var sStr = hasNativeMap ? aStr : util2.toSetString(aStr);
    var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
    var idx = this._array.length;
    if (!isDuplicate || aAllowDuplicates) {
      this._array.push(aStr);
    }
    if (!isDuplicate) {
      if (hasNativeMap) {
        this._set.set(aStr, idx);
      } else {
        this._set[sStr] = idx;
      }
    }
  };
  ArraySet.prototype.has = function ArraySet_has(aStr) {
    if (hasNativeMap) {
      return this._set.has(aStr);
    } else {
      var sStr = util2.toSetString(aStr);
      return has.call(this._set, sStr);
    }
  };
  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
    if (hasNativeMap) {
      var idx = this._set.get(aStr);
      if (idx >= 0) {
        return idx;
      }
    } else {
      var sStr = util2.toSetString(aStr);
      if (has.call(this._set, sStr)) {
        return this._set[sStr];
      }
    }
    throw new Error('"' + aStr + '" is not in the set.');
  };
  ArraySet.prototype.at = function ArraySet_at(aIdx) {
    if (aIdx >= 0 && aIdx < this._array.length) {
      return this._array[aIdx];
    }
    throw new Error("No element indexed by " + aIdx);
  };
  ArraySet.prototype.toArray = function ArraySet_toArray() {
    return this._array.slice();
  };
  arraySet.ArraySet = ArraySet;
  return arraySet;
}
var mappingList = {};
var hasRequiredMappingList;
function requireMappingList() {
  if (hasRequiredMappingList) return mappingList;
  hasRequiredMappingList = 1;
  var util2 = requireUtil();
  function generatedPositionAfter(mappingA, mappingB) {
    var lineA = mappingA.generatedLine;
    var lineB = mappingB.generatedLine;
    var columnA = mappingA.generatedColumn;
    var columnB = mappingB.generatedColumn;
    return lineB > lineA || lineB == lineA && columnB >= columnA || util2.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
  }
  function MappingList() {
    this._array = [];
    this._sorted = true;
    this._last = { generatedLine: -1, generatedColumn: 0 };
  }
  MappingList.prototype.unsortedForEach = function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };
  MappingList.prototype.add = function MappingList_add(aMapping) {
    if (generatedPositionAfter(this._last, aMapping)) {
      this._last = aMapping;
      this._array.push(aMapping);
    } else {
      this._sorted = false;
      this._array.push(aMapping);
    }
  };
  MappingList.prototype.toArray = function MappingList_toArray() {
    if (!this._sorted) {
      this._array.sort(util2.compareByGeneratedPositionsInflated);
      this._sorted = true;
    }
    return this._array;
  };
  mappingList.MappingList = MappingList;
  return mappingList;
}
var hasRequiredSourceMapGenerator;
function requireSourceMapGenerator() {
  if (hasRequiredSourceMapGenerator) return sourceMapGenerator;
  hasRequiredSourceMapGenerator = 1;
  var base64VLQ = requireBase64Vlq();
  var util2 = requireUtil();
  var ArraySet = requireArraySet().ArraySet;
  var MappingList = requireMappingList().MappingList;
  function SourceMapGenerator(aArgs) {
    if (!aArgs) {
      aArgs = {};
    }
    this._file = util2.getArg(aArgs, "file", null);
    this._sourceRoot = util2.getArg(aArgs, "sourceRoot", null);
    this._skipValidation = util2.getArg(aArgs, "skipValidation", false);
    this._sources = new ArraySet();
    this._names = new ArraySet();
    this._mappings = new MappingList();
    this._sourcesContents = null;
  }
  SourceMapGenerator.prototype._version = 3;
  SourceMapGenerator.fromSourceMap = function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator({
      file: aSourceMapConsumer.file,
      sourceRoot
    });
    aSourceMapConsumer.eachMapping(function(mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };
      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util2.relative(sourceRoot, newMapping.source);
        }
        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };
        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }
      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util2.relative(sourceRoot, sourceFile);
      }
      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }
      var content2 = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content2 != null) {
        generator.setSourceContent(sourceFile, content2);
      }
    });
    return generator;
  };
  SourceMapGenerator.prototype.addMapping = function SourceMapGenerator_addMapping(aArgs) {
    var generated = util2.getArg(aArgs, "generated");
    var original = util2.getArg(aArgs, "original", null);
    var source = util2.getArg(aArgs, "source", null);
    var name2 = util2.getArg(aArgs, "name", null);
    if (!this._skipValidation) {
      this._validateMapping(generated, original, source, name2);
    }
    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }
    if (name2 != null) {
      name2 = String(name2);
      if (!this._names.has(name2)) {
        this._names.add(name2);
      }
    }
    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source,
      name: name2
    });
  };
  SourceMapGenerator.prototype.setSourceContent = function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util2.relative(this._sourceRoot, source);
    }
    if (aSourceContent != null) {
      if (!this._sourcesContents) {
        this._sourcesContents = /* @__PURE__ */ Object.create(null);
      }
      this._sourcesContents[util2.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      delete this._sourcesContents[util2.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };
  SourceMapGenerator.prototype.applySourceMap = function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          `SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map's "file" property. Both were omitted.`
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    if (sourceRoot != null) {
      sourceFile = util2.relative(sourceRoot, sourceFile);
    }
    var newSources = new ArraySet();
    var newNames = new ArraySet();
    this._mappings.unsortedForEach(function(mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util2.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util2.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }
      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }
      var name2 = mapping.name;
      if (name2 != null && !newNames.has(name2)) {
        newNames.add(name2);
      }
    }, this);
    this._sources = newSources;
    this._names = newNames;
    aSourceMapConsumer.sources.forEach(function(sourceFile2) {
      var content2 = aSourceMapConsumer.sourceContentFor(sourceFile2);
      if (content2 != null) {
        if (aSourceMapPath != null) {
          sourceFile2 = util2.join(aSourceMapPath, sourceFile2);
        }
        if (sourceRoot != null) {
          sourceFile2 = util2.relative(sourceRoot, sourceFile2);
        }
        this.setSourceContent(sourceFile2, content2);
      }
    }, this);
  };
  SourceMapGenerator.prototype._validateMapping = function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource, aName) {
    if (aOriginal && typeof aOriginal.line !== "number" && typeof aOriginal.column !== "number") {
      throw new Error(
        "original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values."
      );
    }
    if (aGenerated && "line" in aGenerated && "column" in aGenerated && aGenerated.line > 0 && aGenerated.column >= 0 && !aOriginal && !aSource && !aName) {
      return;
    } else if (aGenerated && "line" in aGenerated && "column" in aGenerated && aOriginal && "line" in aOriginal && "column" in aOriginal && aGenerated.line > 0 && aGenerated.column >= 0 && aOriginal.line > 0 && aOriginal.column >= 0 && aSource) {
      return;
    } else {
      throw new Error("Invalid mapping: " + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      }));
    }
  };
  SourceMapGenerator.prototype._serializeMappings = function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = "";
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;
    var mappings = this._mappings.toArray();
    for (var i2 = 0, len = mappings.length; i2 < len; i2++) {
      mapping = mappings[i2];
      next = "";
      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ";";
          previousGeneratedLine++;
        }
      } else {
        if (i2 > 0) {
          if (!util2.compareByGeneratedPositionsInflated(mapping, mappings[i2 - 1])) {
            continue;
          }
          next += ",";
        }
      }
      next += base64VLQ.encode(mapping.generatedColumn - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;
      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;
        next += base64VLQ.encode(mapping.originalLine - 1 - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;
        next += base64VLQ.encode(mapping.originalColumn - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;
        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }
      result += next;
    }
    return result;
  };
  SourceMapGenerator.prototype._generateSourcesContent = function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function(source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util2.relative(aSourceRoot, source);
      }
      var key = util2.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key) ? this._sourcesContents[key] : null;
    }, this);
  };
  SourceMapGenerator.prototype.toJSON = function SourceMapGenerator_toJSON() {
    var map2 = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map2.file = this._file;
    }
    if (this._sourceRoot != null) {
      map2.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map2.sourcesContent = this._generateSourcesContent(map2.sources, map2.sourceRoot);
    }
    return map2;
  };
  SourceMapGenerator.prototype.toString = function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };
  sourceMapGenerator.SourceMapGenerator = SourceMapGenerator;
  return sourceMapGenerator;
}
var sourceMapConsumer = {};
var binarySearch = {};
var hasRequiredBinarySearch;
function requireBinarySearch() {
  if (hasRequiredBinarySearch) return binarySearch;
  hasRequiredBinarySearch = 1;
  (function(exports$1) {
    exports$1.GREATEST_LOWER_BOUND = 1;
    exports$1.LEAST_UPPER_BOUND = 2;
    function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
      var mid = Math.floor((aHigh - aLow) / 2) + aLow;
      var cmp = aCompare(aNeedle, aHaystack[mid], true);
      if (cmp === 0) {
        return mid;
      } else if (cmp > 0) {
        if (aHigh - mid > 1) {
          return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports$1.LEAST_UPPER_BOUND) {
          return aHigh < aHaystack.length ? aHigh : -1;
        } else {
          return mid;
        }
      } else {
        if (mid - aLow > 1) {
          return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
        }
        if (aBias == exports$1.LEAST_UPPER_BOUND) {
          return mid;
        } else {
          return aLow < 0 ? -1 : aLow;
        }
      }
    }
    exports$1.search = function search(aNeedle, aHaystack, aCompare, aBias) {
      if (aHaystack.length === 0) {
        return -1;
      }
      var index = recursiveSearch(
        -1,
        aHaystack.length,
        aNeedle,
        aHaystack,
        aCompare,
        aBias || exports$1.GREATEST_LOWER_BOUND
      );
      if (index < 0) {
        return -1;
      }
      while (index - 1 >= 0) {
        if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
          break;
        }
        --index;
      }
      return index;
    };
  })(binarySearch);
  return binarySearch;
}
var quickSort = {};
var hasRequiredQuickSort;
function requireQuickSort() {
  if (hasRequiredQuickSort) return quickSort;
  hasRequiredQuickSort = 1;
  function swap(ary, x3, y) {
    var temp = ary[x3];
    ary[x3] = ary[y];
    ary[y] = temp;
  }
  function randomIntInRange(low, high) {
    return Math.round(low + Math.random() * (high - low));
  }
  function doQuickSort(ary, comparator, p, r) {
    if (p < r) {
      var pivotIndex = randomIntInRange(p, r);
      var i2 = p - 1;
      swap(ary, pivotIndex, r);
      var pivot = ary[r];
      for (var j2 = p; j2 < r; j2++) {
        if (comparator(ary[j2], pivot) <= 0) {
          i2 += 1;
          swap(ary, i2, j2);
        }
      }
      swap(ary, i2 + 1, j2);
      var q2 = i2 + 1;
      doQuickSort(ary, comparator, p, q2 - 1);
      doQuickSort(ary, comparator, q2 + 1, r);
    }
  }
  quickSort.quickSort = function(ary, comparator) {
    doQuickSort(ary, comparator, 0, ary.length - 1);
  };
  return quickSort;
}
var hasRequiredSourceMapConsumer;
function requireSourceMapConsumer() {
  if (hasRequiredSourceMapConsumer) return sourceMapConsumer;
  hasRequiredSourceMapConsumer = 1;
  var util2 = requireUtil();
  var binarySearch2 = requireBinarySearch();
  var ArraySet = requireArraySet().ArraySet;
  var base64VLQ = requireBase64Vlq();
  var quickSort2 = requireQuickSort().quickSort;
  function SourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap2 = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap2 = util2.parseSourceMapInput(aSourceMap);
    }
    return sourceMap2.sections != null ? new IndexedSourceMapConsumer(sourceMap2, aSourceMapURL) : new BasicSourceMapConsumer(sourceMap2, aSourceMapURL);
  }
  SourceMapConsumer.fromSourceMap = function(aSourceMap, aSourceMapURL) {
    return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
  };
  SourceMapConsumer.prototype._version = 3;
  SourceMapConsumer.prototype.__generatedMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_generatedMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__generatedMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__generatedMappings;
    }
  });
  SourceMapConsumer.prototype.__originalMappings = null;
  Object.defineProperty(SourceMapConsumer.prototype, "_originalMappings", {
    configurable: true,
    enumerable: true,
    get: function() {
      if (!this.__originalMappings) {
        this._parseMappings(this._mappings, this.sourceRoot);
      }
      return this.__originalMappings;
    }
  });
  SourceMapConsumer.prototype._charIsMappingSeparator = function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };
  SourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };
  SourceMapConsumer.GENERATED_ORDER = 1;
  SourceMapConsumer.ORIGINAL_ORDER = 2;
  SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
  SourceMapConsumer.LEAST_UPPER_BOUND = 2;
  SourceMapConsumer.prototype.eachMapping = function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
    var mappings;
    switch (order) {
      case SourceMapConsumer.GENERATED_ORDER:
        mappings = this._generatedMappings;
        break;
      case SourceMapConsumer.ORIGINAL_ORDER:
        mappings = this._originalMappings;
        break;
      default:
        throw new Error("Unknown order of iteration.");
    }
    var sourceRoot = this.sourceRoot;
    mappings.map(function(mapping) {
      var source = mapping.source === null ? null : this._sources.at(mapping.source);
      source = util2.computeSourceURL(sourceRoot, source, this._sourceMapURL);
      return {
        source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : this._names.at(mapping.name)
      };
    }, this).forEach(aCallback, context);
  };
  SourceMapConsumer.prototype.allGeneratedPositionsFor = function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util2.getArg(aArgs, "line");
    var needle = {
      source: util2.getArg(aArgs, "source"),
      originalLine: line,
      originalColumn: util2.getArg(aArgs, "column", 0)
    };
    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }
    var mappings = [];
    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util2.compareByOriginalPositions,
      binarySearch2.LEAST_UPPER_BOUND
    );
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (aArgs.column === void 0) {
        var originalLine = mapping.originalLine;
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;
        while (mapping && mapping.originalLine === line && mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util2.getArg(mapping, "generatedLine", null),
            column: util2.getArg(mapping, "generatedColumn", null),
            lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
          });
          mapping = this._originalMappings[++index];
        }
      }
    }
    return mappings;
  };
  sourceMapConsumer.SourceMapConsumer = SourceMapConsumer;
  function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap2 = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap2 = util2.parseSourceMapInput(aSourceMap);
    }
    var version2 = util2.getArg(sourceMap2, "version");
    var sources = util2.getArg(sourceMap2, "sources");
    var names = util2.getArg(sourceMap2, "names", []);
    var sourceRoot = util2.getArg(sourceMap2, "sourceRoot", null);
    var sourcesContent = util2.getArg(sourceMap2, "sourcesContent", null);
    var mappings = util2.getArg(sourceMap2, "mappings");
    var file = util2.getArg(sourceMap2, "file", null);
    if (version2 != this._version) {
      throw new Error("Unsupported version: " + version2);
    }
    if (sourceRoot) {
      sourceRoot = util2.normalize(sourceRoot);
    }
    sources = sources.map(String).map(util2.normalize).map(function(source) {
      return sourceRoot && util2.isAbsolute(sourceRoot) && util2.isAbsolute(source) ? util2.relative(sourceRoot, source) : source;
    });
    this._names = ArraySet.fromArray(names.map(String), true);
    this._sources = ArraySet.fromArray(sources, true);
    this._absoluteSources = this._sources.toArray().map(function(s) {
      return util2.computeSourceURL(sourceRoot, s, aSourceMapURL);
    });
    this.sourceRoot = sourceRoot;
    this.sourcesContent = sourcesContent;
    this._mappings = mappings;
    this._sourceMapURL = aSourceMapURL;
    this.file = file;
  }
  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;
  BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util2.relative(this.sourceRoot, relativeSource);
    }
    if (this._sources.has(relativeSource)) {
      return this._sources.indexOf(relativeSource);
    }
    var i2;
    for (i2 = 0; i2 < this._absoluteSources.length; ++i2) {
      if (this._absoluteSources[i2] == aSource) {
        return i2;
      }
    }
    return -1;
  };
  BasicSourceMapConsumer.fromSourceMap = function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);
    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(
      smc._sources.toArray(),
      smc.sourceRoot
    );
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function(s) {
      return util2.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });
    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];
    for (var i2 = 0, length = generatedMappings.length; i2 < length; i2++) {
      var srcMapping = generatedMappings[i2];
      var destMapping = new Mapping();
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;
      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;
        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }
        destOriginalMappings.push(destMapping);
      }
      destGeneratedMappings.push(destMapping);
    }
    quickSort2(smc.__originalMappings, util2.compareByOriginalPositions);
    return smc;
  };
  BasicSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(BasicSourceMapConsumer.prototype, "sources", {
    get: function() {
      return this._absoluteSources.slice();
    }
  });
  function Mapping() {
    this.generatedLine = 0;
    this.generatedColumn = 0;
    this.source = null;
    this.originalLine = null;
    this.originalColumn = null;
    this.name = null;
  }
  BasicSourceMapConsumer.prototype._parseMappings = function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var cachedSegments = {};
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, str, segment, end, value;
    while (index < length) {
      if (aStr.charAt(index) === ";") {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;
      } else if (aStr.charAt(index) === ",") {
        index++;
      } else {
        mapping = new Mapping();
        mapping.generatedLine = generatedLine;
        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        str = aStr.slice(index, end);
        segment = cachedSegments[str];
        if (segment) {
          index += str.length;
        } else {
          segment = [];
          while (index < end) {
            base64VLQ.decode(aStr, index, temp);
            value = temp.value;
            index = temp.rest;
            segment.push(value);
          }
          if (segment.length === 2) {
            throw new Error("Found a source, but no line and column");
          }
          if (segment.length === 3) {
            throw new Error("Found a source and line, but no column");
          }
          cachedSegments[str] = segment;
        }
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;
        if (segment.length > 1) {
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          mapping.originalLine += 1;
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;
          if (segment.length > 4) {
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }
        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === "number") {
          originalMappings.push(mapping);
        }
      }
    }
    quickSort2(generatedMappings, util2.compareByGeneratedPositionsDeflated);
    this.__generatedMappings = generatedMappings;
    quickSort2(originalMappings, util2.compareByOriginalPositions);
    this.__originalMappings = originalMappings;
  };
  BasicSourceMapConsumer.prototype._findMapping = function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName, aColumnName, aComparator, aBias) {
    if (aNeedle[aLineName] <= 0) {
      throw new TypeError("Line must be greater than or equal to 1, got " + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError("Column must be greater than or equal to 0, got " + aNeedle[aColumnName]);
    }
    return binarySearch2.search(aNeedle, aMappings, aComparator, aBias);
  };
  BasicSourceMapConsumer.prototype.computeColumnSpans = function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];
        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }
      mapping.lastGeneratedColumn = Infinity;
    }
  };
  BasicSourceMapConsumer.prototype.originalPositionFor = function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util2.compareByGeneratedPositionsDeflated,
      util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
    );
    if (index >= 0) {
      var mapping = this._generatedMappings[index];
      if (mapping.generatedLine === needle.generatedLine) {
        var source = util2.getArg(mapping, "source", null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util2.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name2 = util2.getArg(mapping, "name", null);
        if (name2 !== null) {
          name2 = this._names.at(name2);
        }
        return {
          source,
          line: util2.getArg(mapping, "originalLine", null),
          column: util2.getArg(mapping, "originalColumn", null),
          name: name2
        };
      }
    }
    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };
  BasicSourceMapConsumer.prototype.hasContentsOfAllSources = function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() && !this.sourcesContent.some(function(sc2) {
      return sc2 == null;
    });
  };
  BasicSourceMapConsumer.prototype.sourceContentFor = function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }
    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }
    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util2.relative(this.sourceRoot, relativeSource);
    }
    var url2;
    if (this.sourceRoot != null && (url2 = util2.urlParse(this.sourceRoot))) {
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url2.scheme == "file" && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)];
      }
      if ((!url2.path || url2.path == "/") && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };
  BasicSourceMapConsumer.prototype.generatedPositionFor = function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util2.getArg(aArgs, "source");
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }
    var needle = {
      source,
      originalLine: util2.getArg(aArgs, "line"),
      originalColumn: util2.getArg(aArgs, "column")
    };
    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util2.compareByOriginalPositions,
      util2.getArg(aArgs, "bias", SourceMapConsumer.GREATEST_LOWER_BOUND)
    );
    if (index >= 0) {
      var mapping = this._originalMappings[index];
      if (mapping.source === needle.source) {
        return {
          line: util2.getArg(mapping, "generatedLine", null),
          column: util2.getArg(mapping, "generatedColumn", null),
          lastColumn: util2.getArg(mapping, "lastGeneratedColumn", null)
        };
      }
    }
    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };
  sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer;
  function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
    var sourceMap2 = aSourceMap;
    if (typeof aSourceMap === "string") {
      sourceMap2 = util2.parseSourceMapInput(aSourceMap);
    }
    var version2 = util2.getArg(sourceMap2, "version");
    var sections = util2.getArg(sourceMap2, "sections");
    if (version2 != this._version) {
      throw new Error("Unsupported version: " + version2);
    }
    this._sources = new ArraySet();
    this._names = new ArraySet();
    var lastOffset = {
      line: -1,
      column: 0
    };
    this._sections = sections.map(function(s) {
      if (s.url) {
        throw new Error("Support for url field in sections not implemented.");
      }
      var offset2 = util2.getArg(s, "offset");
      var offsetLine = util2.getArg(offset2, "line");
      var offsetColumn = util2.getArg(offset2, "column");
      if (offsetLine < lastOffset.line || offsetLine === lastOffset.line && offsetColumn < lastOffset.column) {
        throw new Error("Section offsets must be ordered and non-overlapping.");
      }
      lastOffset = offset2;
      return {
        generatedOffset: {
          // The offset fields are 0-based, but we use 1-based indices when
          // encoding/decoding from VLQ.
          generatedLine: offsetLine + 1,
          generatedColumn: offsetColumn + 1
        },
        consumer: new SourceMapConsumer(util2.getArg(s, "map"), aSourceMapURL)
      };
    });
  }
  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;
  IndexedSourceMapConsumer.prototype._version = 3;
  Object.defineProperty(IndexedSourceMapConsumer.prototype, "sources", {
    get: function() {
      var sources = [];
      for (var i2 = 0; i2 < this._sections.length; i2++) {
        for (var j2 = 0; j2 < this._sections[i2].consumer.sources.length; j2++) {
          sources.push(this._sections[i2].consumer.sources[j2]);
        }
      }
      return sources;
    }
  });
  IndexedSourceMapConsumer.prototype.originalPositionFor = function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util2.getArg(aArgs, "line"),
      generatedColumn: util2.getArg(aArgs, "column")
    };
    var sectionIndex = binarySearch2.search(
      needle,
      this._sections,
      function(needle2, section2) {
        var cmp = needle2.generatedLine - section2.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }
        return needle2.generatedColumn - section2.generatedOffset.generatedColumn;
      }
    );
    var section = this._sections[sectionIndex];
    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }
    return section.consumer.originalPositionFor({
      line: needle.generatedLine - (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn - (section.generatedOffset.generatedLine === needle.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
      bias: aArgs.bias
    });
  };
  IndexedSourceMapConsumer.prototype.hasContentsOfAllSources = function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function(s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };
  IndexedSourceMapConsumer.prototype.sourceContentFor = function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i2 = 0; i2 < this._sections.length; i2++) {
      var section = this._sections[i2];
      var content2 = section.consumer.sourceContentFor(aSource, true);
      if (content2) {
        return content2;
      }
    }
    if (nullOnMissing) {
      return null;
    } else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };
  IndexedSourceMapConsumer.prototype.generatedPositionFor = function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i2 = 0; i2 < this._sections.length; i2++) {
      var section = this._sections[i2];
      if (section.consumer._findSourceIndex(util2.getArg(aArgs, "source")) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line + (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column + (section.generatedOffset.generatedLine === generatedPosition.line ? section.generatedOffset.generatedColumn - 1 : 0)
        };
        return ret;
      }
    }
    return {
      line: null,
      column: null
    };
  };
  IndexedSourceMapConsumer.prototype._parseMappings = function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i2 = 0; i2 < this._sections.length; i2++) {
      var section = this._sections[i2];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j2 = 0; j2 < sectionMappings.length; j2++) {
        var mapping = sectionMappings[j2];
        var source = section.consumer._sources.at(mapping.source);
        source = util2.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);
        var name2 = null;
        if (mapping.name) {
          name2 = section.consumer._names.at(mapping.name);
          this._names.add(name2);
          name2 = this._names.indexOf(name2);
        }
        var adjustedMapping = {
          source,
          generatedLine: mapping.generatedLine + (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn + (section.generatedOffset.generatedLine === mapping.generatedLine ? section.generatedOffset.generatedColumn - 1 : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name2
        };
        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === "number") {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }
    quickSort2(this.__generatedMappings, util2.compareByGeneratedPositionsDeflated);
    quickSort2(this.__originalMappings, util2.compareByOriginalPositions);
  };
  sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
  return sourceMapConsumer;
}
var sourceNode = {};
var hasRequiredSourceNode;
function requireSourceNode() {
  if (hasRequiredSourceNode) return sourceNode;
  hasRequiredSourceNode = 1;
  var SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator;
  var util2 = requireUtil();
  var REGEX_NEWLINE = /(\r?\n)/;
  var NEWLINE_CODE = 10;
  var isSourceNode = "$$$isSourceNode$$$";
  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
    this.children = [];
    this.sourceContents = {};
    this.line = aLine == null ? null : aLine;
    this.column = aColumn == null ? null : aColumn;
    this.source = aSource == null ? null : aSource;
    this.name = aName == null ? null : aName;
    this[isSourceNode] = true;
    if (aChunks != null) this.add(aChunks);
  }
  SourceNode.fromStringWithSourceMap = function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    var node = new SourceNode();
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      var newLine = getNextLine() || "";
      return lineContents + newLine;
      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ? remainingLines[remainingLinesIndex++] : void 0;
      }
    };
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;
    var lastMapping = null;
    aSourceMapConsumer.eachMapping(function(mapping) {
      if (lastMapping !== null) {
        if (lastGeneratedLine < mapping.generatedLine) {
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
        } else {
          var nextLine = remainingLines[remainingLinesIndex] || "";
          var code2 = nextLine.substr(0, mapping.generatedColumn - lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn - lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code2);
          lastMapping = mapping;
          return;
        }
      }
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || "";
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }
    aSourceMapConsumer.sources.forEach(function(sourceFile) {
      var content2 = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content2 != null) {
        if (aRelativePath != null) {
          sourceFile = util2.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content2);
      }
    });
    return node;
    function addMappingWithCode(mapping, code2) {
      if (mapping === null || mapping.source === void 0) {
        node.add(code2);
      } else {
        var source = aRelativePath ? util2.join(aRelativePath, mapping.source) : mapping.source;
        node.add(new SourceNode(
          mapping.originalLine,
          mapping.originalColumn,
          source,
          code2,
          mapping.name
        ));
      }
    }
  };
  SourceNode.prototype.add = function SourceNode_add(aChunk) {
    if (Array.isArray(aChunk)) {
      aChunk.forEach(function(chunk) {
        this.add(chunk);
      }, this);
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      if (aChunk) {
        this.children.push(aChunk);
      }
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };
  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
    if (Array.isArray(aChunk)) {
      for (var i2 = aChunk.length - 1; i2 >= 0; i2--) {
        this.prepend(aChunk[i2]);
      }
    } else if (aChunk[isSourceNode] || typeof aChunk === "string") {
      this.children.unshift(aChunk);
    } else {
      throw new TypeError(
        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
      );
    }
    return this;
  };
  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
    var chunk;
    for (var i2 = 0, len = this.children.length; i2 < len; i2++) {
      chunk = this.children[i2];
      if (chunk[isSourceNode]) {
        chunk.walk(aFn);
      } else {
        if (chunk !== "") {
          aFn(chunk, {
            source: this.source,
            line: this.line,
            column: this.column,
            name: this.name
          });
        }
      }
    }
  };
  SourceNode.prototype.join = function SourceNode_join(aSep) {
    var newChildren;
    var i2;
    var len = this.children.length;
    if (len > 0) {
      newChildren = [];
      for (i2 = 0; i2 < len - 1; i2++) {
        newChildren.push(this.children[i2]);
        newChildren.push(aSep);
      }
      newChildren.push(this.children[i2]);
      this.children = newChildren;
    }
    return this;
  };
  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
    var lastChild = this.children[this.children.length - 1];
    if (lastChild[isSourceNode]) {
      lastChild.replaceRight(aPattern, aReplacement);
    } else if (typeof lastChild === "string") {
      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
    } else {
      this.children.push("".replace(aPattern, aReplacement));
    }
    return this;
  };
  SourceNode.prototype.setSourceContent = function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util2.toSetString(aSourceFile)] = aSourceContent;
  };
  SourceNode.prototype.walkSourceContents = function SourceNode_walkSourceContents(aFn) {
    for (var i2 = 0, len = this.children.length; i2 < len; i2++) {
      if (this.children[i2][isSourceNode]) {
        this.children[i2].walkSourceContents(aFn);
      }
    }
    var sources = Object.keys(this.sourceContents);
    for (var i2 = 0, len = sources.length; i2 < len; i2++) {
      aFn(util2.fromSetString(sources[i2]), this.sourceContents[sources[i2]]);
    }
  };
  SourceNode.prototype.toString = function SourceNode_toString() {
    var str = "";
    this.walk(function(chunk) {
      str += chunk;
    });
    return str;
  };
  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
    var generated = {
      code: "",
      line: 1,
      column: 0
    };
    var map2 = new SourceMapGenerator(aArgs);
    var sourceMappingActive = false;
    var lastOriginalSource = null;
    var lastOriginalLine = null;
    var lastOriginalColumn = null;
    var lastOriginalName = null;
    this.walk(function(chunk, original) {
      generated.code += chunk;
      if (original.source !== null && original.line !== null && original.column !== null) {
        if (lastOriginalSource !== original.source || lastOriginalLine !== original.line || lastOriginalColumn !== original.column || lastOriginalName !== original.name) {
          map2.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
        lastOriginalSource = original.source;
        lastOriginalLine = original.line;
        lastOriginalColumn = original.column;
        lastOriginalName = original.name;
        sourceMappingActive = true;
      } else if (sourceMappingActive) {
        map2.addMapping({
          generated: {
            line: generated.line,
            column: generated.column
          }
        });
        lastOriginalSource = null;
        sourceMappingActive = false;
      }
      for (var idx = 0, length = chunk.length; idx < length; idx++) {
        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
          generated.line++;
          generated.column = 0;
          if (idx + 1 === length) {
            lastOriginalSource = null;
            sourceMappingActive = false;
          } else if (sourceMappingActive) {
            map2.addMapping({
              source: original.source,
              original: {
                line: original.line,
                column: original.column
              },
              generated: {
                line: generated.line,
                column: generated.column
              },
              name: original.name
            });
          }
        } else {
          generated.column++;
        }
      }
    });
    this.walkSourceContents(function(sourceFile, sourceContent) {
      map2.setSourceContent(sourceFile, sourceContent);
    });
    return { code: generated.code, map: map2 };
  };
  sourceNode.SourceNode = SourceNode;
  return sourceNode;
}
var hasRequiredSourceMap;
function requireSourceMap() {
  if (hasRequiredSourceMap) return sourceMap;
  hasRequiredSourceMap = 1;
  sourceMap.SourceMapGenerator = requireSourceMapGenerator().SourceMapGenerator;
  sourceMap.SourceMapConsumer = requireSourceMapConsumer().SourceMapConsumer;
  sourceMap.SourceNode = requireSourceNode().SourceNode;
  return sourceMap;
}
const version = "2.1.0";
const require$$3 = {
  version
};
(function(exports$1) {
  (function() {
    var Syntax, Precedence, BinaryPrecedence, SourceNode, estraverse$1, esutils, base, indent, json, renumber, hexadecimal, quotes, escapeless, newline, space, parentheses, semicolons, safeConcatenation, directive, extra, parse4, sourceMap2, sourceCode, preserveBlankLines, FORMAT_MINIFY, FORMAT_DEFAULTS;
    estraverse$1 = estraverse;
    esutils = utils;
    Syntax = estraverse$1.Syntax;
    function isExpression(node) {
      return CodeGenerator.Expression.hasOwnProperty(node.type);
    }
    function isStatement(node) {
      return CodeGenerator.Statement.hasOwnProperty(node.type);
    }
    Precedence = {
      Sequence: 0,
      Yield: 1,
      Assignment: 1,
      Conditional: 2,
      ArrowFunction: 2,
      Coalesce: 3,
      LogicalOR: 4,
      LogicalAND: 5,
      BitwiseOR: 6,
      BitwiseXOR: 7,
      BitwiseAND: 8,
      Equality: 9,
      Relational: 10,
      BitwiseSHIFT: 11,
      Additive: 12,
      Multiplicative: 13,
      Exponentiation: 14,
      Await: 15,
      Unary: 15,
      Postfix: 16,
      OptionalChaining: 17,
      Call: 18,
      New: 19,
      TaggedTemplate: 20,
      Member: 21,
      Primary: 22
    };
    BinaryPrecedence = {
      "??": Precedence.Coalesce,
      "||": Precedence.LogicalOR,
      "&&": Precedence.LogicalAND,
      "|": Precedence.BitwiseOR,
      "^": Precedence.BitwiseXOR,
      "&": Precedence.BitwiseAND,
      "==": Precedence.Equality,
      "!=": Precedence.Equality,
      "===": Precedence.Equality,
      "!==": Precedence.Equality,
      "is": Precedence.Equality,
      "isnt": Precedence.Equality,
      "<": Precedence.Relational,
      ">": Precedence.Relational,
      "<=": Precedence.Relational,
      ">=": Precedence.Relational,
      "in": Precedence.Relational,
      "instanceof": Precedence.Relational,
      "<<": Precedence.BitwiseSHIFT,
      ">>": Precedence.BitwiseSHIFT,
      ">>>": Precedence.BitwiseSHIFT,
      "+": Precedence.Additive,
      "-": Precedence.Additive,
      "*": Precedence.Multiplicative,
      "%": Precedence.Multiplicative,
      "/": Precedence.Multiplicative,
      "**": Precedence.Exponentiation
    };
    var F_ALLOW_IN = 1, F_ALLOW_CALL = 1 << 1, F_ALLOW_UNPARATH_NEW = 1 << 2, F_FUNC_BODY = 1 << 3, F_DIRECTIVE_CTX = 1 << 4, F_SEMICOLON_OPT = 1 << 5, F_FOUND_COALESCE = 1 << 6;
    var E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TTF = F_ALLOW_IN | F_ALLOW_CALL, E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW, E_TFF = F_ALLOW_IN, E_FFT = F_ALLOW_UNPARATH_NEW, E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW;
    var S_TFFF = F_ALLOW_IN, S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT, S_FFFF = 0, S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX, S_TTFF = F_ALLOW_IN | F_FUNC_BODY;
    function getDefaultOptions() {
      return {
        indent: null,
        base: null,
        parse: null,
        comment: false,
        format: {
          indent: {
            style: "    ",
            base: 0,
            adjustMultilineComment: false
          },
          newline: "\n",
          space: " ",
          json: false,
          renumber: false,
          hexadecimal: false,
          quotes: "single",
          escapeless: false,
          compact: false,
          parentheses: true,
          semicolons: true,
          safeConcatenation: false,
          preserveBlankLines: false
        },
        moz: {
          comprehensionExpressionStartsWithAssignment: false,
          starlessGenerator: false
        },
        sourceMap: null,
        sourceMapRoot: null,
        sourceMapWithCode: false,
        directive: false,
        raw: true,
        verbatim: null,
        sourceCode: null
      };
    }
    function stringRepeat(str, num) {
      var result = "";
      for (num |= 0; num > 0; num >>>= 1, str += str) {
        if (num & 1) {
          result += str;
        }
      }
      return result;
    }
    function hasLineTerminator(str) {
      return /[\r\n]/g.test(str);
    }
    function endsWithLineTerminator(str) {
      var len = str.length;
      return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
    }
    function merge(target, override) {
      var key;
      for (key in override) {
        if (override.hasOwnProperty(key)) {
          target[key] = override[key];
        }
      }
      return target;
    }
    function updateDeeply(target, override) {
      var key, val;
      function isHashObject(target2) {
        return typeof target2 === "object" && target2 instanceof Object && !(target2 instanceof RegExp);
      }
      for (key in override) {
        if (override.hasOwnProperty(key)) {
          val = override[key];
          if (isHashObject(val)) {
            if (isHashObject(target[key])) {
              updateDeeply(target[key], val);
            } else {
              target[key] = updateDeeply({}, val);
            }
          } else {
            target[key] = val;
          }
        }
      }
      return target;
    }
    function generateNumber(value) {
      var result, point, temp, exponent, pos;
      if (value !== value) {
        throw new Error("Numeric literal whose value is NaN");
      }
      if (value < 0 || value === 0 && 1 / value < 0) {
        throw new Error("Numeric literal whose value is negative");
      }
      if (value === 1 / 0) {
        return json ? "null" : renumber ? "1e400" : "1e+400";
      }
      result = "" + value;
      if (!renumber || result.length < 3) {
        return result;
      }
      point = result.indexOf(".");
      if (!json && result.charCodeAt(0) === 48 && point === 1) {
        point = 0;
        result = result.slice(1);
      }
      temp = result;
      result = result.replace("e+", "e");
      exponent = 0;
      if ((pos = temp.indexOf("e")) > 0) {
        exponent = +temp.slice(pos + 1);
        temp = temp.slice(0, pos);
      }
      if (point >= 0) {
        exponent -= temp.length - point - 1;
        temp = +(temp.slice(0, point) + temp.slice(point + 1)) + "";
      }
      pos = 0;
      while (temp.charCodeAt(temp.length + pos - 1) === 48) {
        --pos;
      }
      if (pos !== 0) {
        exponent -= pos;
        temp = temp.slice(0, pos);
      }
      if (exponent !== 0) {
        temp += "e" + exponent;
      }
      if ((temp.length < result.length || hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = "0x" + value.toString(16)).length < result.length) && +temp === value) {
        result = temp;
      }
      return result;
    }
    function escapeRegExpCharacter(ch2, previousIsBackslash) {
      if ((ch2 & -2) === 8232) {
        return (previousIsBackslash ? "u" : "\\u") + (ch2 === 8232 ? "2028" : "2029");
      } else if (ch2 === 10 || ch2 === 13) {
        return (previousIsBackslash ? "" : "\\") + (ch2 === 10 ? "n" : "r");
      }
      return String.fromCharCode(ch2);
    }
    function generateRegExp(reg) {
      var match, result, flags, i2, iz, ch2, characterInBrack, previousIsBackslash;
      result = reg.toString();
      if (reg.source) {
        match = result.match(/\/([^/]*)$/);
        if (!match) {
          return result;
        }
        flags = match[1];
        result = "";
        characterInBrack = false;
        previousIsBackslash = false;
        for (i2 = 0, iz = reg.source.length; i2 < iz; ++i2) {
          ch2 = reg.source.charCodeAt(i2);
          if (!previousIsBackslash) {
            if (characterInBrack) {
              if (ch2 === 93) {
                characterInBrack = false;
              }
            } else {
              if (ch2 === 47) {
                result += "\\";
              } else if (ch2 === 91) {
                characterInBrack = true;
              }
            }
            result += escapeRegExpCharacter(ch2, previousIsBackslash);
            previousIsBackslash = ch2 === 92;
          } else {
            result += escapeRegExpCharacter(ch2, previousIsBackslash);
            previousIsBackslash = false;
          }
        }
        return "/" + result + "/" + flags;
      }
      return result;
    }
    function escapeAllowedCharacter(code2, next) {
      var hex;
      if (code2 === 8) {
        return "\\b";
      }
      if (code2 === 12) {
        return "\\f";
      }
      if (code2 === 9) {
        return "\\t";
      }
      hex = code2.toString(16).toUpperCase();
      if (json || code2 > 255) {
        return "\\u" + "0000".slice(hex.length) + hex;
      } else if (code2 === 0 && !esutils.code.isDecimalDigit(next)) {
        return "\\0";
      } else if (code2 === 11) {
        return "\\x0B";
      } else {
        return "\\x" + "00".slice(hex.length) + hex;
      }
    }
    function escapeDisallowedCharacter(code2) {
      if (code2 === 92) {
        return "\\\\";
      }
      if (code2 === 10) {
        return "\\n";
      }
      if (code2 === 13) {
        return "\\r";
      }
      if (code2 === 8232) {
        return "\\u2028";
      }
      if (code2 === 8233) {
        return "\\u2029";
      }
      throw new Error("Incorrectly classified character");
    }
    function escapeDirective(str) {
      var i2, iz, code2, quote;
      quote = quotes === "double" ? '"' : "'";
      for (i2 = 0, iz = str.length; i2 < iz; ++i2) {
        code2 = str.charCodeAt(i2);
        if (code2 === 39) {
          quote = '"';
          break;
        } else if (code2 === 34) {
          quote = "'";
          break;
        } else if (code2 === 92) {
          ++i2;
        }
      }
      return quote + str + quote;
    }
    function escapeString(str) {
      var result = "", i2, len, code2, singleQuotes = 0, doubleQuotes = 0, single, quote;
      for (i2 = 0, len = str.length; i2 < len; ++i2) {
        code2 = str.charCodeAt(i2);
        if (code2 === 39) {
          ++singleQuotes;
        } else if (code2 === 34) {
          ++doubleQuotes;
        } else if (code2 === 47 && json) {
          result += "\\";
        } else if (esutils.code.isLineTerminator(code2) || code2 === 92) {
          result += escapeDisallowedCharacter(code2);
          continue;
        } else if (!esutils.code.isIdentifierPartES5(code2) && (json && code2 < 32 || !json && !escapeless && (code2 < 32 || code2 > 126))) {
          result += escapeAllowedCharacter(code2, str.charCodeAt(i2 + 1));
          continue;
        }
        result += String.fromCharCode(code2);
      }
      single = !(quotes === "double" || quotes === "auto" && doubleQuotes < singleQuotes);
      quote = single ? "'" : '"';
      if (!(single ? singleQuotes : doubleQuotes)) {
        return quote + result + quote;
      }
      str = result;
      result = quote;
      for (i2 = 0, len = str.length; i2 < len; ++i2) {
        code2 = str.charCodeAt(i2);
        if (code2 === 39 && single || code2 === 34 && !single) {
          result += "\\";
        }
        result += String.fromCharCode(code2);
      }
      return result + quote;
    }
    function flattenToString(arr) {
      var i2, iz, elem, result = "";
      for (i2 = 0, iz = arr.length; i2 < iz; ++i2) {
        elem = arr[i2];
        result += Array.isArray(elem) ? flattenToString(elem) : elem;
      }
      return result;
    }
    function toSourceNodeWhenNeeded(generated, node) {
      if (!sourceMap2) {
        if (Array.isArray(generated)) {
          return flattenToString(generated);
        } else {
          return generated;
        }
      }
      if (node == null) {
        if (generated instanceof SourceNode) {
          return generated;
        } else {
          node = {};
        }
      }
      if (node.loc == null) {
        return new SourceNode(null, null, sourceMap2, generated, node.name || null);
      }
      return new SourceNode(node.loc.start.line, node.loc.start.column, sourceMap2 === true ? node.loc.source || null : sourceMap2, generated, node.name || null);
    }
    function noEmptySpace() {
      return space ? space : " ";
    }
    function join(left, right) {
      var leftSource, rightSource, leftCharCode, rightCharCode;
      leftSource = toSourceNodeWhenNeeded(left).toString();
      if (leftSource.length === 0) {
        return [right];
      }
      rightSource = toSourceNodeWhenNeeded(right).toString();
      if (rightSource.length === 0) {
        return [left];
      }
      leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
      rightCharCode = rightSource.charCodeAt(0);
      if ((leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode) || leftCharCode === 47 && rightCharCode === 105) {
        return [left, noEmptySpace(), right];
      } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) || esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
        return [left, right];
      }
      return [left, space, right];
    }
    function addIndent(stmt) {
      return [base, stmt];
    }
    function withIndent(fn2) {
      var previousBase;
      previousBase = base;
      base += indent;
      fn2(base);
      base = previousBase;
    }
    function calculateSpaces(str) {
      var i2;
      for (i2 = str.length - 1; i2 >= 0; --i2) {
        if (esutils.code.isLineTerminator(str.charCodeAt(i2))) {
          break;
        }
      }
      return str.length - 1 - i2;
    }
    function adjustMultilineComment(value, specialBase) {
      var array, i2, len, line, j2, spaces, previousBase, sn2;
      array = value.split(/\r\n|[\r\n]/);
      spaces = Number.MAX_VALUE;
      for (i2 = 1, len = array.length; i2 < len; ++i2) {
        line = array[i2];
        j2 = 0;
        while (j2 < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j2))) {
          ++j2;
        }
        if (spaces > j2) {
          spaces = j2;
        }
      }
      if (typeof specialBase !== "undefined") {
        previousBase = base;
        if (array[1][spaces] === "*") {
          specialBase += " ";
        }
        base = specialBase;
      } else {
        if (spaces & 1) {
          --spaces;
        }
        previousBase = base;
      }
      for (i2 = 1, len = array.length; i2 < len; ++i2) {
        sn2 = toSourceNodeWhenNeeded(addIndent(array[i2].slice(spaces)));
        array[i2] = sourceMap2 ? sn2.join("") : sn2;
      }
      base = previousBase;
      return array.join("\n");
    }
    function generateComment(comment2, specialBase) {
      if (comment2.type === "Line") {
        if (endsWithLineTerminator(comment2.value)) {
          return "//" + comment2.value;
        } else {
          var result = "//" + comment2.value;
          if (!preserveBlankLines) {
            result += "\n";
          }
          return result;
        }
      }
      if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment2.value)) {
        return adjustMultilineComment("/*" + comment2.value + "*/", specialBase);
      }
      return "/*" + comment2.value + "*/";
    }
    function addComments(stmt, result) {
      var i2, len, comment2, save, tailingToStatement, specialBase, fragment, extRange, range, prevRange, prefix, infix, suffix, count;
      if (stmt.leadingComments && stmt.leadingComments.length > 0) {
        save = result;
        if (preserveBlankLines) {
          comment2 = stmt.leadingComments[0];
          result = [];
          extRange = comment2.extendedRange;
          range = comment2.range;
          prefix = sourceCode.substring(extRange[0], range[0]);
          count = (prefix.match(/\n/g) || []).length;
          if (count > 0) {
            result.push(stringRepeat("\n", count));
            result.push(addIndent(generateComment(comment2)));
          } else {
            result.push(prefix);
            result.push(generateComment(comment2));
          }
          prevRange = range;
          for (i2 = 1, len = stmt.leadingComments.length; i2 < len; i2++) {
            comment2 = stmt.leadingComments[i2];
            range = comment2.range;
            infix = sourceCode.substring(prevRange[1], range[0]);
            count = (infix.match(/\n/g) || []).length;
            result.push(stringRepeat("\n", count));
            result.push(addIndent(generateComment(comment2)));
            prevRange = range;
          }
          suffix = sourceCode.substring(range[1], extRange[1]);
          count = (suffix.match(/\n/g) || []).length;
          result.push(stringRepeat("\n", count));
        } else {
          comment2 = stmt.leadingComments[0];
          result = [];
          if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
            result.push("\n");
          }
          result.push(generateComment(comment2));
          if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push("\n");
          }
          for (i2 = 1, len = stmt.leadingComments.length; i2 < len; ++i2) {
            comment2 = stmt.leadingComments[i2];
            fragment = [generateComment(comment2)];
            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              fragment.push("\n");
            }
            result.push(addIndent(fragment));
          }
        }
        result.push(addIndent(save));
      }
      if (stmt.trailingComments) {
        if (preserveBlankLines) {
          comment2 = stmt.trailingComments[0];
          extRange = comment2.extendedRange;
          range = comment2.range;
          prefix = sourceCode.substring(extRange[0], range[0]);
          count = (prefix.match(/\n/g) || []).length;
          if (count > 0) {
            result.push(stringRepeat("\n", count));
            result.push(addIndent(generateComment(comment2)));
          } else {
            result.push(prefix);
            result.push(generateComment(comment2));
          }
        } else {
          tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
          specialBase = stringRepeat(" ", calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
          for (i2 = 0, len = stmt.trailingComments.length; i2 < len; ++i2) {
            comment2 = stmt.trailingComments[i2];
            if (tailingToStatement) {
              if (i2 === 0) {
                result = [result, indent];
              } else {
                result = [result, specialBase];
              }
              result.push(generateComment(comment2, specialBase));
            } else {
              result = [result, addIndent(generateComment(comment2))];
            }
            if (i2 !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
              result = [result, "\n"];
            }
          }
        }
      }
      return result;
    }
    function generateBlankLines(start, end, result) {
      var j2, newlineCount = 0;
      for (j2 = start; j2 < end; j2++) {
        if (sourceCode[j2] === "\n") {
          newlineCount++;
        }
      }
      for (j2 = 1; j2 < newlineCount; j2++) {
        result.push(newline);
      }
    }
    function parenthesize(text, current2, should) {
      if (current2 < should) {
        return ["(", text, ")"];
      }
      return text;
    }
    function generateVerbatimString(string2) {
      var i2, iz, result;
      result = string2.split(/\r\n|\n/);
      for (i2 = 1, iz = result.length; i2 < iz; i2++) {
        result[i2] = newline + base + result[i2];
      }
      return result;
    }
    function generateVerbatim(expr, precedence) {
      var verbatim, result, prec;
      verbatim = expr[extra.verbatim];
      if (typeof verbatim === "string") {
        result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, precedence);
      } else {
        result = generateVerbatimString(verbatim.content);
        prec = verbatim.precedence != null ? verbatim.precedence : Precedence.Sequence;
        result = parenthesize(result, prec, precedence);
      }
      return toSourceNodeWhenNeeded(result, expr);
    }
    function CodeGenerator() {
    }
    CodeGenerator.prototype.maybeBlock = function(stmt, flags) {
      var result, noLeadingComment, that = this;
      noLeadingComment = !extra.comment || !stmt.leadingComments;
      if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
        return [space, this.generateStatement(stmt, flags)];
      }
      if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
        return ";";
      }
      withIndent(function() {
        result = [
          newline,
          addIndent(that.generateStatement(stmt, flags))
        ];
      });
      return result;
    };
    CodeGenerator.prototype.maybeBlockSuffix = function(stmt, result) {
      var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
      if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
        return [result, space];
      }
      if (ends) {
        return [result, base];
      }
      return [result, newline, base];
    };
    function generateIdentifier(node) {
      return toSourceNodeWhenNeeded(node.name, node);
    }
    function generateAsyncPrefix(node, spaceRequired) {
      return node.async ? "async" + (spaceRequired ? noEmptySpace() : space) : "";
    }
    function generateStarSuffix(node) {
      var isGenerator = node.generator && !extra.moz.starlessGenerator;
      return isGenerator ? "*" + space : "";
    }
    function generateMethodPrefix(prop) {
      var func = prop.value, prefix = "";
      if (func.async) {
        prefix += generateAsyncPrefix(func, !prop.computed);
      }
      if (func.generator) {
        prefix += generateStarSuffix(func) ? "*" : "";
      }
      return prefix;
    }
    CodeGenerator.prototype.generatePattern = function(node, precedence, flags) {
      if (node.type === Syntax.Identifier) {
        return generateIdentifier(node);
      }
      return this.generateExpression(node, precedence, flags);
    };
    CodeGenerator.prototype.generateFunctionParams = function(node) {
      var i2, iz, result, hasDefault;
      hasDefault = false;
      if (node.type === Syntax.ArrowFunctionExpression && !node.rest && (!node.defaults || node.defaults.length === 0) && node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
        result = [generateAsyncPrefix(node, true), generateIdentifier(node.params[0])];
      } else {
        result = node.type === Syntax.ArrowFunctionExpression ? [generateAsyncPrefix(node, false)] : [];
        result.push("(");
        if (node.defaults) {
          hasDefault = true;
        }
        for (i2 = 0, iz = node.params.length; i2 < iz; ++i2) {
          if (hasDefault && node.defaults[i2]) {
            result.push(this.generateAssignment(node.params[i2], node.defaults[i2], "=", Precedence.Assignment, E_TTT));
          } else {
            result.push(this.generatePattern(node.params[i2], Precedence.Assignment, E_TTT));
          }
          if (i2 + 1 < iz) {
            result.push("," + space);
          }
        }
        if (node.rest) {
          if (node.params.length) {
            result.push("," + space);
          }
          result.push("...");
          result.push(generateIdentifier(node.rest));
        }
        result.push(")");
      }
      return result;
    };
    CodeGenerator.prototype.generateFunctionBody = function(node) {
      var result, expr;
      result = this.generateFunctionParams(node);
      if (node.type === Syntax.ArrowFunctionExpression) {
        result.push(space);
        result.push("=>");
      }
      if (node.expression) {
        result.push(space);
        expr = this.generateExpression(node.body, Precedence.Assignment, E_TTT);
        if (expr.toString().charAt(0) === "{") {
          expr = ["(", expr, ")"];
        }
        result.push(expr);
      } else {
        result.push(this.maybeBlock(node.body, S_TTFF));
      }
      return result;
    };
    CodeGenerator.prototype.generateIterationForStatement = function(operator2, stmt, flags) {
      var result = ["for" + (stmt.await ? noEmptySpace() + "await" : "") + space + "("], that = this;
      withIndent(function() {
        if (stmt.left.type === Syntax.VariableDeclaration) {
          withIndent(function() {
            result.push(stmt.left.kind + noEmptySpace());
            result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
          });
        } else {
          result.push(that.generateExpression(stmt.left, Precedence.Call, E_TTT));
        }
        result = join(result, operator2);
        result = [join(
          result,
          that.generateExpression(stmt.right, Precedence.Assignment, E_TTT)
        ), ")"];
      });
      result.push(this.maybeBlock(stmt.body, flags));
      return result;
    };
    CodeGenerator.prototype.generatePropertyKey = function(expr, computed) {
      var result = [];
      if (computed) {
        result.push("[");
      }
      result.push(this.generateExpression(expr, Precedence.Assignment, E_TTT));
      if (computed) {
        result.push("]");
      }
      return result;
    };
    CodeGenerator.prototype.generateAssignment = function(left, right, operator2, precedence, flags) {
      if (Precedence.Assignment < precedence) {
        flags |= F_ALLOW_IN;
      }
      return parenthesize(
        [
          this.generateExpression(left, Precedence.Call, flags),
          space + operator2 + space,
          this.generateExpression(right, Precedence.Assignment, flags)
        ],
        Precedence.Assignment,
        precedence
      );
    };
    CodeGenerator.prototype.semicolon = function(flags) {
      if (!semicolons && flags & F_SEMICOLON_OPT) {
        return "";
      }
      return ";";
    };
    CodeGenerator.Statement = {
      BlockStatement: function(stmt, flags) {
        var range, content2, result = ["{", newline], that = this;
        withIndent(function() {
          if (stmt.body.length === 0 && preserveBlankLines) {
            range = stmt.range;
            if (range[1] - range[0] > 2) {
              content2 = sourceCode.substring(range[0] + 1, range[1] - 1);
              if (content2[0] === "\n") {
                result = ["{"];
              }
              result.push(content2);
            }
          }
          var i2, iz, fragment, bodyFlags;
          bodyFlags = S_TFFF;
          if (flags & F_FUNC_BODY) {
            bodyFlags |= F_DIRECTIVE_CTX;
          }
          for (i2 = 0, iz = stmt.body.length; i2 < iz; ++i2) {
            if (preserveBlankLines) {
              if (i2 === 0) {
                if (stmt.body[0].leadingComments) {
                  range = stmt.body[0].leadingComments[0].extendedRange;
                  content2 = sourceCode.substring(range[0], range[1]);
                  if (content2[0] === "\n") {
                    result = ["{"];
                  }
                }
                if (!stmt.body[0].leadingComments) {
                  generateBlankLines(stmt.range[0], stmt.body[0].range[0], result);
                }
              }
              if (i2 > 0) {
                if (!stmt.body[i2 - 1].trailingComments && !stmt.body[i2].leadingComments) {
                  generateBlankLines(stmt.body[i2 - 1].range[1], stmt.body[i2].range[0], result);
                }
              }
            }
            if (i2 === iz - 1) {
              bodyFlags |= F_SEMICOLON_OPT;
            }
            if (stmt.body[i2].leadingComments && preserveBlankLines) {
              fragment = that.generateStatement(stmt.body[i2], bodyFlags);
            } else {
              fragment = addIndent(that.generateStatement(stmt.body[i2], bodyFlags));
            }
            result.push(fragment);
            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              if (preserveBlankLines && i2 < iz - 1) {
                if (!stmt.body[i2 + 1].leadingComments) {
                  result.push(newline);
                }
              } else {
                result.push(newline);
              }
            }
            if (preserveBlankLines) {
              if (i2 === iz - 1) {
                if (!stmt.body[i2].trailingComments) {
                  generateBlankLines(stmt.body[i2].range[1], stmt.range[1], result);
                }
              }
            }
          }
        });
        result.push(addIndent("}"));
        return result;
      },
      BreakStatement: function(stmt, flags) {
        if (stmt.label) {
          return "break " + stmt.label.name + this.semicolon(flags);
        }
        return "break" + this.semicolon(flags);
      },
      ContinueStatement: function(stmt, flags) {
        if (stmt.label) {
          return "continue " + stmt.label.name + this.semicolon(flags);
        }
        return "continue" + this.semicolon(flags);
      },
      ClassBody: function(stmt, flags) {
        var result = ["{", newline], that = this;
        withIndent(function(indent2) {
          var i2, iz;
          for (i2 = 0, iz = stmt.body.length; i2 < iz; ++i2) {
            result.push(indent2);
            result.push(that.generateExpression(stmt.body[i2], Precedence.Sequence, E_TTT));
            if (i2 + 1 < iz) {
              result.push(newline);
            }
          }
        });
        if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
          result.push(newline);
        }
        result.push(base);
        result.push("}");
        return result;
      },
      ClassDeclaration: function(stmt, flags) {
        var result, fragment;
        result = ["class"];
        if (stmt.id) {
          result = join(result, this.generateExpression(stmt.id, Precedence.Sequence, E_TTT));
        }
        if (stmt.superClass) {
          fragment = join("extends", this.generateExpression(stmt.superClass, Precedence.Unary, E_TTT));
          result = join(result, fragment);
        }
        result.push(space);
        result.push(this.generateStatement(stmt.body, S_TFFT));
        return result;
      },
      DirectiveStatement: function(stmt, flags) {
        if (extra.raw && stmt.raw) {
          return stmt.raw + this.semicolon(flags);
        }
        return escapeDirective(stmt.directive) + this.semicolon(flags);
      },
      DoWhileStatement: function(stmt, flags) {
        var result = join("do", this.maybeBlock(stmt.body, S_TFFF));
        result = this.maybeBlockSuffix(stmt.body, result);
        return join(result, [
          "while" + space + "(",
          this.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
          ")" + this.semicolon(flags)
        ]);
      },
      CatchClause: function(stmt, flags) {
        var result, that = this;
        withIndent(function() {
          var guard;
          if (stmt.param) {
            result = [
              "catch" + space + "(",
              that.generateExpression(stmt.param, Precedence.Sequence, E_TTT),
              ")"
            ];
            if (stmt.guard) {
              guard = that.generateExpression(stmt.guard, Precedence.Sequence, E_TTT);
              result.splice(2, 0, " if ", guard);
            }
          } else {
            result = ["catch"];
          }
        });
        result.push(this.maybeBlock(stmt.body, S_TFFF));
        return result;
      },
      DebuggerStatement: function(stmt, flags) {
        return "debugger" + this.semicolon(flags);
      },
      EmptyStatement: function(stmt, flags) {
        return ";";
      },
      ExportDefaultDeclaration: function(stmt, flags) {
        var result = ["export"], bodyFlags;
        bodyFlags = flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF;
        result = join(result, "default");
        if (isStatement(stmt.declaration)) {
          result = join(result, this.generateStatement(stmt.declaration, bodyFlags));
        } else {
          result = join(result, this.generateExpression(stmt.declaration, Precedence.Assignment, E_TTT) + this.semicolon(flags));
        }
        return result;
      },
      ExportNamedDeclaration: function(stmt, flags) {
        var result = ["export"], bodyFlags, that = this;
        bodyFlags = flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF;
        if (stmt.declaration) {
          return join(result, this.generateStatement(stmt.declaration, bodyFlags));
        }
        if (stmt.specifiers) {
          if (stmt.specifiers.length === 0) {
            result = join(result, "{" + space + "}");
          } else if (stmt.specifiers[0].type === Syntax.ExportBatchSpecifier) {
            result = join(result, this.generateExpression(stmt.specifiers[0], Precedence.Sequence, E_TTT));
          } else {
            result = join(result, "{");
            withIndent(function(indent2) {
              var i2, iz;
              result.push(newline);
              for (i2 = 0, iz = stmt.specifiers.length; i2 < iz; ++i2) {
                result.push(indent2);
                result.push(that.generateExpression(stmt.specifiers[i2], Precedence.Sequence, E_TTT));
                if (i2 + 1 < iz) {
                  result.push("," + newline);
                }
              }
            });
            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
              result.push(newline);
            }
            result.push(base + "}");
          }
          if (stmt.source) {
            result = join(result, [
              "from" + space,
              // ModuleSpecifier
              this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
              this.semicolon(flags)
            ]);
          } else {
            result.push(this.semicolon(flags));
          }
        }
        return result;
      },
      ExportAllDeclaration: function(stmt, flags) {
        return [
          "export" + space,
          "*" + space,
          "from" + space,
          // ModuleSpecifier
          this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
          this.semicolon(flags)
        ];
      },
      ExpressionStatement: function(stmt, flags) {
        var result, fragment;
        function isClassPrefixed(fragment2) {
          var code2;
          if (fragment2.slice(0, 5) !== "class") {
            return false;
          }
          code2 = fragment2.charCodeAt(5);
          return code2 === 123 || esutils.code.isWhiteSpace(code2) || esutils.code.isLineTerminator(code2);
        }
        function isFunctionPrefixed(fragment2) {
          var code2;
          if (fragment2.slice(0, 8) !== "function") {
            return false;
          }
          code2 = fragment2.charCodeAt(8);
          return code2 === 40 || esutils.code.isWhiteSpace(code2) || code2 === 42 || esutils.code.isLineTerminator(code2);
        }
        function isAsyncPrefixed(fragment2) {
          var code2, i2, iz;
          if (fragment2.slice(0, 5) !== "async") {
            return false;
          }
          if (!esutils.code.isWhiteSpace(fragment2.charCodeAt(5))) {
            return false;
          }
          for (i2 = 6, iz = fragment2.length; i2 < iz; ++i2) {
            if (!esutils.code.isWhiteSpace(fragment2.charCodeAt(i2))) {
              break;
            }
          }
          if (i2 === iz) {
            return false;
          }
          if (fragment2.slice(i2, i2 + 8) !== "function") {
            return false;
          }
          code2 = fragment2.charCodeAt(i2 + 8);
          return code2 === 40 || esutils.code.isWhiteSpace(code2) || code2 === 42 || esutils.code.isLineTerminator(code2);
        }
        result = [this.generateExpression(stmt.expression, Precedence.Sequence, E_TTT)];
        fragment = toSourceNodeWhenNeeded(result).toString();
        if (fragment.charCodeAt(0) === 123 || // ObjectExpression
        isClassPrefixed(fragment) || isFunctionPrefixed(fragment) || isAsyncPrefixed(fragment) || directive && flags & F_DIRECTIVE_CTX && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === "string") {
          result = ["(", result, ")" + this.semicolon(flags)];
        } else {
          result.push(this.semicolon(flags));
        }
        return result;
      },
      ImportDeclaration: function(stmt, flags) {
        var result, cursor, that = this;
        if (stmt.specifiers.length === 0) {
          return [
            "import",
            space,
            // ModuleSpecifier
            this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
            this.semicolon(flags)
          ];
        }
        result = [
          "import"
        ];
        cursor = 0;
        if (stmt.specifiers[cursor].type === Syntax.ImportDefaultSpecifier) {
          result = join(result, [
            this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
          ]);
          ++cursor;
        }
        if (stmt.specifiers[cursor]) {
          if (cursor !== 0) {
            result.push(",");
          }
          if (stmt.specifiers[cursor].type === Syntax.ImportNamespaceSpecifier) {
            result = join(result, [
              space,
              this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
            ]);
          } else {
            result.push(space + "{");
            if (stmt.specifiers.length - cursor === 1) {
              result.push(space);
              result.push(this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT));
              result.push(space + "}" + space);
            } else {
              withIndent(function(indent2) {
                var i2, iz;
                result.push(newline);
                for (i2 = cursor, iz = stmt.specifiers.length; i2 < iz; ++i2) {
                  result.push(indent2);
                  result.push(that.generateExpression(stmt.specifiers[i2], Precedence.Sequence, E_TTT));
                  if (i2 + 1 < iz) {
                    result.push("," + newline);
                  }
                }
              });
              if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
                result.push(newline);
              }
              result.push(base + "}" + space);
            }
          }
        }
        result = join(result, [
          "from" + space,
          // ModuleSpecifier
          this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
          this.semicolon(flags)
        ]);
        return result;
      },
      VariableDeclarator: function(stmt, flags) {
        var itemFlags = flags & F_ALLOW_IN ? E_TTT : E_FTT;
        if (stmt.init) {
          return [
            this.generateExpression(stmt.id, Precedence.Assignment, itemFlags),
            space,
            "=",
            space,
            this.generateExpression(stmt.init, Precedence.Assignment, itemFlags)
          ];
        }
        return this.generatePattern(stmt.id, Precedence.Assignment, itemFlags);
      },
      VariableDeclaration: function(stmt, flags) {
        var result, i2, iz, node, bodyFlags, that = this;
        result = [stmt.kind];
        bodyFlags = flags & F_ALLOW_IN ? S_TFFF : S_FFFF;
        function block() {
          node = stmt.declarations[0];
          if (extra.comment && node.leadingComments) {
            result.push("\n");
            result.push(addIndent(that.generateStatement(node, bodyFlags)));
          } else {
            result.push(noEmptySpace());
            result.push(that.generateStatement(node, bodyFlags));
          }
          for (i2 = 1, iz = stmt.declarations.length; i2 < iz; ++i2) {
            node = stmt.declarations[i2];
            if (extra.comment && node.leadingComments) {
              result.push("," + newline);
              result.push(addIndent(that.generateStatement(node, bodyFlags)));
            } else {
              result.push("," + space);
              result.push(that.generateStatement(node, bodyFlags));
            }
          }
        }
        if (stmt.declarations.length > 1) {
          withIndent(block);
        } else {
          block();
        }
        result.push(this.semicolon(flags));
        return result;
      },
      ThrowStatement: function(stmt, flags) {
        return [join(
          "throw",
          this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
        ), this.semicolon(flags)];
      },
      TryStatement: function(stmt, flags) {
        var result, i2, iz, guardedHandlers;
        result = ["try", this.maybeBlock(stmt.block, S_TFFF)];
        result = this.maybeBlockSuffix(stmt.block, result);
        if (stmt.handlers) {
          for (i2 = 0, iz = stmt.handlers.length; i2 < iz; ++i2) {
            result = join(result, this.generateStatement(stmt.handlers[i2], S_TFFF));
            if (stmt.finalizer || i2 + 1 !== iz) {
              result = this.maybeBlockSuffix(stmt.handlers[i2].body, result);
            }
          }
        } else {
          guardedHandlers = stmt.guardedHandlers || [];
          for (i2 = 0, iz = guardedHandlers.length; i2 < iz; ++i2) {
            result = join(result, this.generateStatement(guardedHandlers[i2], S_TFFF));
            if (stmt.finalizer || i2 + 1 !== iz) {
              result = this.maybeBlockSuffix(guardedHandlers[i2].body, result);
            }
          }
          if (stmt.handler) {
            if (Array.isArray(stmt.handler)) {
              for (i2 = 0, iz = stmt.handler.length; i2 < iz; ++i2) {
                result = join(result, this.generateStatement(stmt.handler[i2], S_TFFF));
                if (stmt.finalizer || i2 + 1 !== iz) {
                  result = this.maybeBlockSuffix(stmt.handler[i2].body, result);
                }
              }
            } else {
              result = join(result, this.generateStatement(stmt.handler, S_TFFF));
              if (stmt.finalizer) {
                result = this.maybeBlockSuffix(stmt.handler.body, result);
              }
            }
          }
        }
        if (stmt.finalizer) {
          result = join(result, ["finally", this.maybeBlock(stmt.finalizer, S_TFFF)]);
        }
        return result;
      },
      SwitchStatement: function(stmt, flags) {
        var result, fragment, i2, iz, bodyFlags, that = this;
        withIndent(function() {
          result = [
            "switch" + space + "(",
            that.generateExpression(stmt.discriminant, Precedence.Sequence, E_TTT),
            ")" + space + "{" + newline
          ];
        });
        if (stmt.cases) {
          bodyFlags = S_TFFF;
          for (i2 = 0, iz = stmt.cases.length; i2 < iz; ++i2) {
            if (i2 === iz - 1) {
              bodyFlags |= F_SEMICOLON_OPT;
            }
            fragment = addIndent(this.generateStatement(stmt.cases[i2], bodyFlags));
            result.push(fragment);
            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              result.push(newline);
            }
          }
        }
        result.push(addIndent("}"));
        return result;
      },
      SwitchCase: function(stmt, flags) {
        var result, fragment, i2, iz, bodyFlags, that = this;
        withIndent(function() {
          if (stmt.test) {
            result = [
              join("case", that.generateExpression(stmt.test, Precedence.Sequence, E_TTT)),
              ":"
            ];
          } else {
            result = ["default:"];
          }
          i2 = 0;
          iz = stmt.consequent.length;
          if (iz && stmt.consequent[0].type === Syntax.BlockStatement) {
            fragment = that.maybeBlock(stmt.consequent[0], S_TFFF);
            result.push(fragment);
            i2 = 1;
          }
          if (i2 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
            result.push(newline);
          }
          bodyFlags = S_TFFF;
          for (; i2 < iz; ++i2) {
            if (i2 === iz - 1 && flags & F_SEMICOLON_OPT) {
              bodyFlags |= F_SEMICOLON_OPT;
            }
            fragment = addIndent(that.generateStatement(stmt.consequent[i2], bodyFlags));
            result.push(fragment);
            if (i2 + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
              result.push(newline);
            }
          }
        });
        return result;
      },
      IfStatement: function(stmt, flags) {
        var result, bodyFlags, semicolonOptional, that = this;
        withIndent(function() {
          result = [
            "if" + space + "(",
            that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
            ")"
          ];
        });
        semicolonOptional = flags & F_SEMICOLON_OPT;
        bodyFlags = S_TFFF;
        if (semicolonOptional) {
          bodyFlags |= F_SEMICOLON_OPT;
        }
        if (stmt.alternate) {
          result.push(this.maybeBlock(stmt.consequent, S_TFFF));
          result = this.maybeBlockSuffix(stmt.consequent, result);
          if (stmt.alternate.type === Syntax.IfStatement) {
            result = join(result, ["else ", this.generateStatement(stmt.alternate, bodyFlags)]);
          } else {
            result = join(result, join("else", this.maybeBlock(stmt.alternate, bodyFlags)));
          }
        } else {
          result.push(this.maybeBlock(stmt.consequent, bodyFlags));
        }
        return result;
      },
      ForStatement: function(stmt, flags) {
        var result, that = this;
        withIndent(function() {
          result = ["for" + space + "("];
          if (stmt.init) {
            if (stmt.init.type === Syntax.VariableDeclaration) {
              result.push(that.generateStatement(stmt.init, S_FFFF));
            } else {
              result.push(that.generateExpression(stmt.init, Precedence.Sequence, E_FTT));
              result.push(";");
            }
          } else {
            result.push(";");
          }
          if (stmt.test) {
            result.push(space);
            result.push(that.generateExpression(stmt.test, Precedence.Sequence, E_TTT));
            result.push(";");
          } else {
            result.push(";");
          }
          if (stmt.update) {
            result.push(space);
            result.push(that.generateExpression(stmt.update, Precedence.Sequence, E_TTT));
            result.push(")");
          } else {
            result.push(")");
          }
        });
        result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
        return result;
      },
      ForInStatement: function(stmt, flags) {
        return this.generateIterationForStatement("in", stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
      },
      ForOfStatement: function(stmt, flags) {
        return this.generateIterationForStatement("of", stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
      },
      LabeledStatement: function(stmt, flags) {
        return [stmt.label.name + ":", this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)];
      },
      Program: function(stmt, flags) {
        var result, fragment, i2, iz, bodyFlags;
        iz = stmt.body.length;
        result = [safeConcatenation && iz > 0 ? "\n" : ""];
        bodyFlags = S_TFTF;
        for (i2 = 0; i2 < iz; ++i2) {
          if (!safeConcatenation && i2 === iz - 1) {
            bodyFlags |= F_SEMICOLON_OPT;
          }
          if (preserveBlankLines) {
            if (i2 === 0) {
              if (!stmt.body[0].leadingComments) {
                generateBlankLines(stmt.range[0], stmt.body[i2].range[0], result);
              }
            }
            if (i2 > 0) {
              if (!stmt.body[i2 - 1].trailingComments && !stmt.body[i2].leadingComments) {
                generateBlankLines(stmt.body[i2 - 1].range[1], stmt.body[i2].range[0], result);
              }
            }
          }
          fragment = addIndent(this.generateStatement(stmt.body[i2], bodyFlags));
          result.push(fragment);
          if (i2 + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
            if (preserveBlankLines) {
              if (!stmt.body[i2 + 1].leadingComments) {
                result.push(newline);
              }
            } else {
              result.push(newline);
            }
          }
          if (preserveBlankLines) {
            if (i2 === iz - 1) {
              if (!stmt.body[i2].trailingComments) {
                generateBlankLines(stmt.body[i2].range[1], stmt.range[1], result);
              }
            }
          }
        }
        return result;
      },
      FunctionDeclaration: function(stmt, flags) {
        return [
          generateAsyncPrefix(stmt, true),
          "function",
          generateStarSuffix(stmt) || noEmptySpace(),
          stmt.id ? generateIdentifier(stmt.id) : "",
          this.generateFunctionBody(stmt)
        ];
      },
      ReturnStatement: function(stmt, flags) {
        if (stmt.argument) {
          return [join(
            "return",
            this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
          ), this.semicolon(flags)];
        }
        return ["return" + this.semicolon(flags)];
      },
      WhileStatement: function(stmt, flags) {
        var result, that = this;
        withIndent(function() {
          result = [
            "while" + space + "(",
            that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
            ")"
          ];
        });
        result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
        return result;
      },
      WithStatement: function(stmt, flags) {
        var result, that = this;
        withIndent(function() {
          result = [
            "with" + space + "(",
            that.generateExpression(stmt.object, Precedence.Sequence, E_TTT),
            ")"
          ];
        });
        result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
        return result;
      }
    };
    merge(CodeGenerator.prototype, CodeGenerator.Statement);
    CodeGenerator.Expression = {
      SequenceExpression: function(expr, precedence, flags) {
        var result, i2, iz;
        if (Precedence.Sequence < precedence) {
          flags |= F_ALLOW_IN;
        }
        result = [];
        for (i2 = 0, iz = expr.expressions.length; i2 < iz; ++i2) {
          result.push(this.generateExpression(expr.expressions[i2], Precedence.Assignment, flags));
          if (i2 + 1 < iz) {
            result.push("," + space);
          }
        }
        return parenthesize(result, Precedence.Sequence, precedence);
      },
      AssignmentExpression: function(expr, precedence, flags) {
        return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
      },
      ArrowFunctionExpression: function(expr, precedence, flags) {
        return parenthesize(this.generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
      },
      ConditionalExpression: function(expr, precedence, flags) {
        if (Precedence.Conditional < precedence) {
          flags |= F_ALLOW_IN;
        }
        return parenthesize(
          [
            this.generateExpression(expr.test, Precedence.Coalesce, flags),
            space + "?" + space,
            this.generateExpression(expr.consequent, Precedence.Assignment, flags),
            space + ":" + space,
            this.generateExpression(expr.alternate, Precedence.Assignment, flags)
          ],
          Precedence.Conditional,
          precedence
        );
      },
      LogicalExpression: function(expr, precedence, flags) {
        if (expr.operator === "??") {
          flags |= F_FOUND_COALESCE;
        }
        return this.BinaryExpression(expr, precedence, flags);
      },
      BinaryExpression: function(expr, precedence, flags) {
        var result, leftPrecedence, rightPrecedence, currentPrecedence, fragment, leftSource;
        currentPrecedence = BinaryPrecedence[expr.operator];
        leftPrecedence = expr.operator === "**" ? Precedence.Postfix : currentPrecedence;
        rightPrecedence = expr.operator === "**" ? currentPrecedence : currentPrecedence + 1;
        if (currentPrecedence < precedence) {
          flags |= F_ALLOW_IN;
        }
        fragment = this.generateExpression(expr.left, leftPrecedence, flags);
        leftSource = fragment.toString();
        if (leftSource.charCodeAt(leftSource.length - 1) === 47 && esutils.code.isIdentifierPartES5(expr.operator.charCodeAt(0))) {
          result = [fragment, noEmptySpace(), expr.operator];
        } else {
          result = join(fragment, expr.operator);
        }
        fragment = this.generateExpression(expr.right, rightPrecedence, flags);
        if (expr.operator === "/" && fragment.toString().charAt(0) === "/" || expr.operator.slice(-1) === "<" && fragment.toString().slice(0, 3) === "!--") {
          result.push(noEmptySpace());
          result.push(fragment);
        } else {
          result = join(result, fragment);
        }
        if (expr.operator === "in" && !(flags & F_ALLOW_IN)) {
          return ["(", result, ")"];
        }
        if ((expr.operator === "||" || expr.operator === "&&") && flags & F_FOUND_COALESCE) {
          return ["(", result, ")"];
        }
        return parenthesize(result, currentPrecedence, precedence);
      },
      CallExpression: function(expr, precedence, flags) {
        var result, i2, iz;
        result = [this.generateExpression(expr.callee, Precedence.Call, E_TTF)];
        if (expr.optional) {
          result.push("?.");
        }
        result.push("(");
        for (i2 = 0, iz = expr["arguments"].length; i2 < iz; ++i2) {
          result.push(this.generateExpression(expr["arguments"][i2], Precedence.Assignment, E_TTT));
          if (i2 + 1 < iz) {
            result.push("," + space);
          }
        }
        result.push(")");
        if (!(flags & F_ALLOW_CALL)) {
          return ["(", result, ")"];
        }
        return parenthesize(result, Precedence.Call, precedence);
      },
      ChainExpression: function(expr, precedence, flags) {
        if (Precedence.OptionalChaining < precedence) {
          flags |= F_ALLOW_CALL;
        }
        var result = this.generateExpression(expr.expression, Precedence.OptionalChaining, flags);
        return parenthesize(result, Precedence.OptionalChaining, precedence);
      },
      NewExpression: function(expr, precedence, flags) {
        var result, length, i2, iz, itemFlags;
        length = expr["arguments"].length;
        itemFlags = flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0 ? E_TFT : E_TFF;
        result = join(
          "new",
          this.generateExpression(expr.callee, Precedence.New, itemFlags)
        );
        if (!(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
          result.push("(");
          for (i2 = 0, iz = length; i2 < iz; ++i2) {
            result.push(this.generateExpression(expr["arguments"][i2], Precedence.Assignment, E_TTT));
            if (i2 + 1 < iz) {
              result.push("," + space);
            }
          }
          result.push(")");
        }
        return parenthesize(result, Precedence.New, precedence);
      },
      MemberExpression: function(expr, precedence, flags) {
        var result, fragment;
        result = [this.generateExpression(expr.object, Precedence.Call, flags & F_ALLOW_CALL ? E_TTF : E_TFF)];
        if (expr.computed) {
          if (expr.optional) {
            result.push("?.");
          }
          result.push("[");
          result.push(this.generateExpression(expr.property, Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT));
          result.push("]");
        } else {
          if (!expr.optional && expr.object.type === Syntax.Literal && typeof expr.object.value === "number") {
            fragment = toSourceNodeWhenNeeded(result).toString();
            if (fragment.indexOf(".") < 0 && !/[eExX]/.test(fragment) && esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) && !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)) {
              result.push(" ");
            }
          }
          result.push(expr.optional ? "?." : ".");
          result.push(generateIdentifier(expr.property));
        }
        return parenthesize(result, Precedence.Member, precedence);
      },
      MetaProperty: function(expr, precedence, flags) {
        var result;
        result = [];
        result.push(typeof expr.meta === "string" ? expr.meta : generateIdentifier(expr.meta));
        result.push(".");
        result.push(typeof expr.property === "string" ? expr.property : generateIdentifier(expr.property));
        return parenthesize(result, Precedence.Member, precedence);
      },
      UnaryExpression: function(expr, precedence, flags) {
        var result, fragment, rightCharCode, leftSource, leftCharCode;
        fragment = this.generateExpression(expr.argument, Precedence.Unary, E_TTT);
        if (space === "") {
          result = join(expr.operator, fragment);
        } else {
          result = [expr.operator];
          if (expr.operator.length > 2) {
            result = join(result, fragment);
          } else {
            leftSource = toSourceNodeWhenNeeded(result).toString();
            leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
            rightCharCode = fragment.toString().charCodeAt(0);
            if ((leftCharCode === 43 || leftCharCode === 45) && leftCharCode === rightCharCode || esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode)) {
              result.push(noEmptySpace());
              result.push(fragment);
            } else {
              result.push(fragment);
            }
          }
        }
        return parenthesize(result, Precedence.Unary, precedence);
      },
      YieldExpression: function(expr, precedence, flags) {
        var result;
        if (expr.delegate) {
          result = "yield*";
        } else {
          result = "yield";
        }
        if (expr.argument) {
          result = join(
            result,
            this.generateExpression(expr.argument, Precedence.Yield, E_TTT)
          );
        }
        return parenthesize(result, Precedence.Yield, precedence);
      },
      AwaitExpression: function(expr, precedence, flags) {
        var result = join(
          expr.all ? "await*" : "await",
          this.generateExpression(expr.argument, Precedence.Await, E_TTT)
        );
        return parenthesize(result, Precedence.Await, precedence);
      },
      UpdateExpression: function(expr, precedence, flags) {
        if (expr.prefix) {
          return parenthesize(
            [
              expr.operator,
              this.generateExpression(expr.argument, Precedence.Unary, E_TTT)
            ],
            Precedence.Unary,
            precedence
          );
        }
        return parenthesize(
          [
            this.generateExpression(expr.argument, Precedence.Postfix, E_TTT),
            expr.operator
          ],
          Precedence.Postfix,
          precedence
        );
      },
      FunctionExpression: function(expr, precedence, flags) {
        var result = [
          generateAsyncPrefix(expr, true),
          "function"
        ];
        if (expr.id) {
          result.push(generateStarSuffix(expr) || noEmptySpace());
          result.push(generateIdentifier(expr.id));
        } else {
          result.push(generateStarSuffix(expr) || space);
        }
        result.push(this.generateFunctionBody(expr));
        return result;
      },
      ArrayPattern: function(expr, precedence, flags) {
        return this.ArrayExpression(expr, precedence, flags, true);
      },
      ArrayExpression: function(expr, precedence, flags, isPattern) {
        var result, multiline, that = this;
        if (!expr.elements.length) {
          return "[]";
        }
        multiline = isPattern ? false : expr.elements.length > 1;
        result = ["[", multiline ? newline : ""];
        withIndent(function(indent2) {
          var i2, iz;
          for (i2 = 0, iz = expr.elements.length; i2 < iz; ++i2) {
            if (!expr.elements[i2]) {
              if (multiline) {
                result.push(indent2);
              }
              if (i2 + 1 === iz) {
                result.push(",");
              }
            } else {
              result.push(multiline ? indent2 : "");
              result.push(that.generateExpression(expr.elements[i2], Precedence.Assignment, E_TTT));
            }
            if (i2 + 1 < iz) {
              result.push("," + (multiline ? newline : space));
            }
          }
        });
        if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
          result.push(newline);
        }
        result.push(multiline ? base : "");
        result.push("]");
        return result;
      },
      RestElement: function(expr, precedence, flags) {
        return "..." + this.generatePattern(expr.argument);
      },
      ClassExpression: function(expr, precedence, flags) {
        var result, fragment;
        result = ["class"];
        if (expr.id) {
          result = join(result, this.generateExpression(expr.id, Precedence.Sequence, E_TTT));
        }
        if (expr.superClass) {
          fragment = join("extends", this.generateExpression(expr.superClass, Precedence.Unary, E_TTT));
          result = join(result, fragment);
        }
        result.push(space);
        result.push(this.generateStatement(expr.body, S_TFFT));
        return result;
      },
      MethodDefinition: function(expr, precedence, flags) {
        var result, fragment;
        if (expr["static"]) {
          result = ["static" + space];
        } else {
          result = [];
        }
        if (expr.kind === "get" || expr.kind === "set") {
          fragment = [
            join(expr.kind, this.generatePropertyKey(expr.key, expr.computed)),
            this.generateFunctionBody(expr.value)
          ];
        } else {
          fragment = [
            generateMethodPrefix(expr),
            this.generatePropertyKey(expr.key, expr.computed),
            this.generateFunctionBody(expr.value)
          ];
        }
        return join(result, fragment);
      },
      Property: function(expr, precedence, flags) {
        if (expr.kind === "get" || expr.kind === "set") {
          return [
            expr.kind,
            noEmptySpace(),
            this.generatePropertyKey(expr.key, expr.computed),
            this.generateFunctionBody(expr.value)
          ];
        }
        if (expr.shorthand) {
          if (expr.value.type === "AssignmentPattern") {
            return this.AssignmentPattern(expr.value, Precedence.Sequence, E_TTT);
          }
          return this.generatePropertyKey(expr.key, expr.computed);
        }
        if (expr.method) {
          return [
            generateMethodPrefix(expr),
            this.generatePropertyKey(expr.key, expr.computed),
            this.generateFunctionBody(expr.value)
          ];
        }
        return [
          this.generatePropertyKey(expr.key, expr.computed),
          ":" + space,
          this.generateExpression(expr.value, Precedence.Assignment, E_TTT)
        ];
      },
      ObjectExpression: function(expr, precedence, flags) {
        var multiline, result, fragment, that = this;
        if (!expr.properties.length) {
          return "{}";
        }
        multiline = expr.properties.length > 1;
        withIndent(function() {
          fragment = that.generateExpression(expr.properties[0], Precedence.Sequence, E_TTT);
        });
        if (!multiline) {
          if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
            return ["{", space, fragment, space, "}"];
          }
        }
        withIndent(function(indent2) {
          var i2, iz;
          result = ["{", newline, indent2, fragment];
          if (multiline) {
            result.push("," + newline);
            for (i2 = 1, iz = expr.properties.length; i2 < iz; ++i2) {
              result.push(indent2);
              result.push(that.generateExpression(expr.properties[i2], Precedence.Sequence, E_TTT));
              if (i2 + 1 < iz) {
                result.push("," + newline);
              }
            }
          }
        });
        if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
          result.push(newline);
        }
        result.push(base);
        result.push("}");
        return result;
      },
      AssignmentPattern: function(expr, precedence, flags) {
        return this.generateAssignment(expr.left, expr.right, "=", precedence, flags);
      },
      ObjectPattern: function(expr, precedence, flags) {
        var result, i2, iz, multiline, property, that = this;
        if (!expr.properties.length) {
          return "{}";
        }
        multiline = false;
        if (expr.properties.length === 1) {
          property = expr.properties[0];
          if (property.type === Syntax.Property && property.value.type !== Syntax.Identifier) {
            multiline = true;
          }
        } else {
          for (i2 = 0, iz = expr.properties.length; i2 < iz; ++i2) {
            property = expr.properties[i2];
            if (property.type === Syntax.Property && !property.shorthand) {
              multiline = true;
              break;
            }
          }
        }
        result = ["{", multiline ? newline : ""];
        withIndent(function(indent2) {
          var i3, iz2;
          for (i3 = 0, iz2 = expr.properties.length; i3 < iz2; ++i3) {
            result.push(multiline ? indent2 : "");
            result.push(that.generateExpression(expr.properties[i3], Precedence.Sequence, E_TTT));
            if (i3 + 1 < iz2) {
              result.push("," + (multiline ? newline : space));
            }
          }
        });
        if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
          result.push(newline);
        }
        result.push(multiline ? base : "");
        result.push("}");
        return result;
      },
      ThisExpression: function(expr, precedence, flags) {
        return "this";
      },
      Super: function(expr, precedence, flags) {
        return "super";
      },
      Identifier: function(expr, precedence, flags) {
        return generateIdentifier(expr);
      },
      ImportDefaultSpecifier: function(expr, precedence, flags) {
        return generateIdentifier(expr.id || expr.local);
      },
      ImportNamespaceSpecifier: function(expr, precedence, flags) {
        var result = ["*"];
        var id2 = expr.id || expr.local;
        if (id2) {
          result.push(space + "as" + noEmptySpace() + generateIdentifier(id2));
        }
        return result;
      },
      ImportSpecifier: function(expr, precedence, flags) {
        var imported = expr.imported;
        var result = [imported.name];
        var local = expr.local;
        if (local && local.name !== imported.name) {
          result.push(noEmptySpace() + "as" + noEmptySpace() + generateIdentifier(local));
        }
        return result;
      },
      ExportSpecifier: function(expr, precedence, flags) {
        var local = expr.local;
        var result = [local.name];
        var exported = expr.exported;
        if (exported && exported.name !== local.name) {
          result.push(noEmptySpace() + "as" + noEmptySpace() + generateIdentifier(exported));
        }
        return result;
      },
      Literal: function(expr, precedence, flags) {
        var raw;
        if (expr.hasOwnProperty("raw") && parse4 && extra.raw) {
          try {
            raw = parse4(expr.raw).body[0].expression;
            if (raw.type === Syntax.Literal) {
              if (raw.value === expr.value) {
                return expr.raw;
              }
            }
          } catch (e) {
          }
        }
        if (expr.regex) {
          return "/" + expr.regex.pattern + "/" + expr.regex.flags;
        }
        if (typeof expr.value === "bigint") {
          return expr.value.toString() + "n";
        }
        if (expr.bigint) {
          return expr.bigint + "n";
        }
        if (expr.value === null) {
          return "null";
        }
        if (typeof expr.value === "string") {
          return escapeString(expr.value);
        }
        if (typeof expr.value === "number") {
          return generateNumber(expr.value);
        }
        if (typeof expr.value === "boolean") {
          return expr.value ? "true" : "false";
        }
        return generateRegExp(expr.value);
      },
      GeneratorExpression: function(expr, precedence, flags) {
        return this.ComprehensionExpression(expr, precedence, flags);
      },
      ComprehensionExpression: function(expr, precedence, flags) {
        var result, i2, iz, fragment, that = this;
        result = expr.type === Syntax.GeneratorExpression ? ["("] : ["["];
        if (extra.moz.comprehensionExpressionStartsWithAssignment) {
          fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
          result.push(fragment);
        }
        if (expr.blocks) {
          withIndent(function() {
            for (i2 = 0, iz = expr.blocks.length; i2 < iz; ++i2) {
              fragment = that.generateExpression(expr.blocks[i2], Precedence.Sequence, E_TTT);
              if (i2 > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
                result = join(result, fragment);
              } else {
                result.push(fragment);
              }
            }
          });
        }
        if (expr.filter) {
          result = join(result, "if" + space);
          fragment = this.generateExpression(expr.filter, Precedence.Sequence, E_TTT);
          result = join(result, ["(", fragment, ")"]);
        }
        if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
          fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
          result = join(result, fragment);
        }
        result.push(expr.type === Syntax.GeneratorExpression ? ")" : "]");
        return result;
      },
      ComprehensionBlock: function(expr, precedence, flags) {
        var fragment;
        if (expr.left.type === Syntax.VariableDeclaration) {
          fragment = [
            expr.left.kind,
            noEmptySpace(),
            this.generateStatement(expr.left.declarations[0], S_FFFF)
          ];
        } else {
          fragment = this.generateExpression(expr.left, Precedence.Call, E_TTT);
        }
        fragment = join(fragment, expr.of ? "of" : "in");
        fragment = join(fragment, this.generateExpression(expr.right, Precedence.Sequence, E_TTT));
        return ["for" + space + "(", fragment, ")"];
      },
      SpreadElement: function(expr, precedence, flags) {
        return [
          "...",
          this.generateExpression(expr.argument, Precedence.Assignment, E_TTT)
        ];
      },
      TaggedTemplateExpression: function(expr, precedence, flags) {
        var itemFlags = E_TTF;
        if (!(flags & F_ALLOW_CALL)) {
          itemFlags = E_TFF;
        }
        var result = [
          this.generateExpression(expr.tag, Precedence.Call, itemFlags),
          this.generateExpression(expr.quasi, Precedence.Primary, E_FFT)
        ];
        return parenthesize(result, Precedence.TaggedTemplate, precedence);
      },
      TemplateElement: function(expr, precedence, flags) {
        return expr.value.raw;
      },
      TemplateLiteral: function(expr, precedence, flags) {
        var result, i2, iz;
        result = ["`"];
        for (i2 = 0, iz = expr.quasis.length; i2 < iz; ++i2) {
          result.push(this.generateExpression(expr.quasis[i2], Precedence.Primary, E_TTT));
          if (i2 + 1 < iz) {
            result.push("${" + space);
            result.push(this.generateExpression(expr.expressions[i2], Precedence.Sequence, E_TTT));
            result.push(space + "}");
          }
        }
        result.push("`");
        return result;
      },
      ModuleSpecifier: function(expr, precedence, flags) {
        return this.Literal(expr, precedence, flags);
      },
      ImportExpression: function(expr, precedence, flag) {
        return parenthesize([
          "import(",
          this.generateExpression(expr.source, Precedence.Assignment, E_TTT),
          ")"
        ], Precedence.Call, precedence);
      }
    };
    merge(CodeGenerator.prototype, CodeGenerator.Expression);
    CodeGenerator.prototype.generateExpression = function(expr, precedence, flags) {
      var result, type;
      type = expr.type || Syntax.Property;
      if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
        return generateVerbatim(expr, precedence);
      }
      result = this[type](expr, precedence, flags);
      if (extra.comment) {
        result = addComments(expr, result);
      }
      return toSourceNodeWhenNeeded(result, expr);
    };
    CodeGenerator.prototype.generateStatement = function(stmt, flags) {
      var result, fragment;
      result = this[stmt.type](stmt, flags);
      if (extra.comment) {
        result = addComments(stmt, result);
      }
      fragment = toSourceNodeWhenNeeded(result).toString();
      if (stmt.type === Syntax.Program && !safeConcatenation && newline === "" && fragment.charAt(fragment.length - 1) === "\n") {
        result = sourceMap2 ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, "") : fragment.replace(/\s+$/, "");
      }
      return toSourceNodeWhenNeeded(result, stmt);
    };
    function generateInternal(node) {
      var codegen;
      codegen = new CodeGenerator();
      if (isStatement(node)) {
        return codegen.generateStatement(node, S_TFFF);
      }
      if (isExpression(node)) {
        return codegen.generateExpression(node, Precedence.Sequence, E_TTT);
      }
      throw new Error("Unknown node type: " + node.type);
    }
    function generate(node, options) {
      var defaultOptions2 = getDefaultOptions(), result, pair;
      if (options != null) {
        if (typeof options.indent === "string") {
          defaultOptions2.format.indent.style = options.indent;
        }
        if (typeof options.base === "number") {
          defaultOptions2.format.indent.base = options.base;
        }
        options = updateDeeply(defaultOptions2, options);
        indent = options.format.indent.style;
        if (typeof options.base === "string") {
          base = options.base;
        } else {
          base = stringRepeat(indent, options.format.indent.base);
        }
      } else {
        options = defaultOptions2;
        indent = options.format.indent.style;
        base = stringRepeat(indent, options.format.indent.base);
      }
      json = options.format.json;
      renumber = options.format.renumber;
      hexadecimal = json ? false : options.format.hexadecimal;
      quotes = json ? "double" : options.format.quotes;
      escapeless = options.format.escapeless;
      newline = options.format.newline;
      space = options.format.space;
      if (options.format.compact) {
        newline = space = indent = base = "";
      }
      parentheses = options.format.parentheses;
      semicolons = options.format.semicolons;
      safeConcatenation = options.format.safeConcatenation;
      directive = options.directive;
      parse4 = json ? null : options.parse;
      sourceMap2 = options.sourceMap;
      sourceCode = options.sourceCode;
      preserveBlankLines = options.format.preserveBlankLines && sourceCode !== null;
      extra = options;
      if (sourceMap2) {
        if (!exports$1.browser) {
          SourceNode = requireSourceMap().SourceNode;
        } else {
          SourceNode = commonjsGlobal.sourceMap.SourceNode;
        }
      }
      result = generateInternal(node);
      if (!sourceMap2) {
        pair = { code: result.toString(), map: null };
        return options.sourceMapWithCode ? pair : pair.code;
      }
      pair = result.toStringWithSourceMap({
        file: options.file,
        sourceRoot: options.sourceMapRoot
      });
      if (options.sourceContent) {
        pair.map.setSourceContent(
          options.sourceMap,
          options.sourceContent
        );
      }
      if (options.sourceMapWithCode) {
        return pair;
      }
      return pair.map.toString();
    }
    FORMAT_MINIFY = {
      indent: {
        style: "",
        base: 0
      },
      renumber: true,
      hexadecimal: true,
      quotes: "auto",
      escapeless: true,
      compact: true,
      parentheses: false,
      semicolons: false
    };
    FORMAT_DEFAULTS = getDefaultOptions().format;
    exports$1.version = require$$3.version;
    exports$1.generate = generate;
    exports$1.attachComments = estraverse$1.attachComments;
    exports$1.Precedence = updateDeeply({}, Precedence);
    exports$1.browser = false;
    exports$1.FORMAT_MINIFY = FORMAT_MINIFY;
    exports$1.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
  })();
})(escodegen);
const S = /* @__PURE__ */ getDefaultExportFromCjs(escodegen);
class WalkerBase {
  constructor() {
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node) => this.replacement = node
    };
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   * @param {Node} node
   */
  replace(parent, prop, index, node) {
    if (parent && prop) {
      if (index != null) {
        parent[prop][index] = node;
      } else {
        parent[prop] = node;
      }
    }
  }
  /**
   * @template {Node} Parent
   * @param {Parent | null | undefined} parent
   * @param {keyof Parent | null | undefined} prop
   * @param {number | null | undefined} index
   */
  remove(parent, prop, index) {
    if (parent && prop) {
      if (index !== null && index !== void 0) {
        parent[prop].splice(index, 1);
      } else {
        delete parent[prop];
      }
    }
  }
}
class SyncWalker extends WalkerBase {
  /**
   *
   * @param {SyncHandler} [enter]
   * @param {SyncHandler} [leave]
   */
  constructor(enter, leave) {
    super();
    this.should_skip = false;
    this.should_remove = false;
    this.replacement = null;
    this.context = {
      skip: () => this.should_skip = true,
      remove: () => this.should_remove = true,
      replace: (node) => this.replacement = node
    };
    this.enter = enter;
    this.leave = leave;
  }
  /**
   * @template {Node} Parent
   * @param {Node} node
   * @param {Parent | null} parent
   * @param {keyof Parent} [prop]
   * @param {number | null} [index]
   * @returns {Node | null}
   */
  visit(node, parent, prop, index) {
    if (node) {
      if (this.enter) {
        const _should_skip = this.should_skip;
        const _should_remove = this.should_remove;
        const _replacement = this.replacement;
        this.should_skip = false;
        this.should_remove = false;
        this.replacement = null;
        this.enter.call(this.context, node, parent, prop, index);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index);
        }
        const skipped = this.should_skip;
        const removed = this.should_remove;
        this.should_skip = _should_skip;
        this.should_remove = _should_remove;
        this.replacement = _replacement;
        if (skipped) return node;
        if (removed) return null;
      }
      let key;
      for (key in node) {
        const value = node[key];
        if (value && typeof value === "object") {
          if (Array.isArray(value)) {
            const nodes = (
              /** @type {Array<unknown>} */
              value
            );
            for (let i2 = 0; i2 < nodes.length; i2 += 1) {
              const item = nodes[i2];
              if (isNode(item)) {
                if (!this.visit(item, node, key, i2)) {
                  i2--;
                }
              }
            }
          } else if (isNode(value)) {
            this.visit(value, node, key, null);
          }
        }
      }
      if (this.leave) {
        const _replacement = this.replacement;
        const _should_remove = this.should_remove;
        this.replacement = null;
        this.should_remove = false;
        this.leave.call(this.context, node, parent, prop, index);
        if (this.replacement) {
          node = this.replacement;
          this.replace(parent, prop, index, node);
        }
        if (this.should_remove) {
          this.remove(parent, prop, index);
        }
        const removed = this.should_remove;
        this.replacement = _replacement;
        this.should_remove = _should_remove;
        if (removed) return null;
      }
    }
    return node;
  }
}
function isNode(value) {
  return value !== null && typeof value === "object" && "type" in value && typeof value.type === "string";
}
function walk(ast2, { enter, leave }) {
  const instance = new SyncWalker(enter, leave);
  return instance.visit(ast2, null);
}
let E$1 = [];
function N$2(t2) {
  E$1.push(t2);
}
let m$1 = /* @__PURE__ */ new Map();
function U$1(t2, i2) {
  m$1.set(t2, i2);
}
function d(t2, i2 = {}) {
  var _a2;
  const { wrapAsync: a = false, addReturn: l2 = true, emitMiniLocations: s = true, emitWidgets: L3 = true } = i2;
  let h2 = parse(t2, {
    ecmaVersion: 2022,
    allowAwaitOutsideFunction: true,
    locations: true
  }), u = [];
  const x3 = (e, c) => {
    const n = m$1.get("minilang");
    if (n) {
      const r = `[${e}]`, o = n.getLocations(r, c.start);
      u = u.concat(o);
    } else {
      const r = Yr(`"${e}"`, c.start, t2);
      u = u.concat(r);
    }
  };
  let f2 = [];
  walk(h2, {
    enter(e, c) {
      var _a3, _b, _c2;
      if (R(e)) {
        const { name: n } = e.tag, r = m$1.get(n), o = e.quasi.quasis[0].value.raw, y = e.quasi.start + 1;
        if (s) {
          const b2 = r.getLocations(o, y);
          u = u.concat(b2);
        }
        return this.skip(), this.replace(Q$3(n, o, y));
      }
      if (j$2(e, "tidal")) {
        const n = e.quasi.quasis[0].value.raw, r = e.quasi.start + 1;
        if (s) {
          const o = H$2(n, r);
          u = u.concat(o);
        }
        return this.skip(), this.replace(P(n, r));
      }
      if (q(e, c)) {
        const { quasis: n } = e, { raw: r } = n[0].value;
        return this.skip(), s && x3(r, e), this.replace(w(r, e));
      }
      if (k$2(e)) {
        const { value: n } = e;
        return this.skip(), s && x3(n, e), this.replace(w(n, e));
      }
      if (I$1(e))
        return L3 && f2.push({
          from: e.arguments[0].start,
          to: e.arguments[0].end,
          value: e.arguments[0].raw,
          // don't use value!
          min: ((_a3 = e.arguments[1]) == null ? void 0 : _a3.value) ?? 0,
          max: ((_b = e.arguments[2]) == null ? void 0 : _b.value) ?? 1,
          step: (_c2 = e.arguments[3]) == null ? void 0 : _c2.value,
          type: "slider"
        }), this.replace(C$2(e));
      if (M(e)) {
        const n = e.callee.property.name, r = f2.filter((y) => y.type === n).length, o = {
          to: e.end,
          index: r,
          type: n,
          id: i2.id
        };
        return L3 && f2.push(o), this.replace(_$1(e, o));
      }
      if (D$2(e, c))
        return this.replace(B$1(e));
      if (F$1(e))
        return this.replace(O$1(e));
    },
    leave(e, c, n, r) {
    }
  });
  let { body: p } = h2;
  if (!p.length)
    console.warn("empty body -> fallback to silence"), p.push({
      type: "ExpressionStatement",
      expression: {
        type: "Identifier",
        name: "silence"
      }
    });
  else if (!((_a2 = p == null ? void 0 : p[p.length - 1]) == null ? void 0 : _a2.expression))
    throw new Error("unexpected ast format without body expression");
  if (l2) {
    const { expression: e } = p[p.length - 1];
    p[p.length - 1] = {
      type: "ReturnStatement",
      argument: e
    };
  }
  let g = S.generate(h2);
  return a && (g = `(async ()=>{${g}})()`), s ? { output: g, miniLocations: u, widgets: f2 } : { output: g };
}
function k$2(t2, i2, a) {
  return t2.type !== "Literal" ? false : t2.raw[0] === '"';
}
function q(t2, i2) {
  return t2.type === "TemplateLiteral" && i2.type !== "TaggedTemplateExpression";
}
function w(t2, i2) {
  const { start: a } = i2, l2 = m$1.get("minilang");
  let s = "m";
  return l2 && l2.name && (s = l2.name), {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: s
    },
    arguments: [
      { type: "Literal", value: t2 },
      { type: "Literal", value: a }
    ],
    optional: false
  };
}
function I$1(t2) {
  return t2.type === "CallExpression" && t2.callee.name === "slider";
}
function M(t2) {
  var _a2;
  return t2.type === "CallExpression" && E$1.includes((_a2 = t2.callee.property) == null ? void 0 : _a2.name);
}
function C$2(t2) {
  const i2 = "slider_" + t2.arguments[0].start;
  return t2.arguments.unshift({
    type: "Literal",
    value: i2,
    raw: i2
  }), t2.callee.name = "sliderWithID", t2;
}
function A(t2) {
  return `${t2.id || ""}_widget_${t2.type}_${t2.index}`;
}
function _$1(t2, i2) {
  const a = A(i2);
  return t2.arguments.unshift({
    type: "Literal",
    value: a,
    raw: a
  }), t2;
}
function D$2(t2, i2) {
  return t2.type === "CallExpression" && t2.callee.name === "samples" && i2.type !== "AwaitExpression";
}
function B$1(t2) {
  return {
    type: "AwaitExpression",
    argument: t2
  };
}
function F$1(t2) {
  return t2.type === "LabeledStatement";
}
function O$1(t2) {
  return {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",
      callee: {
        type: "MemberExpression",
        object: t2.body.expression,
        property: {
          type: "Identifier",
          name: "p"
        }
      },
      arguments: [
        {
          type: "Literal",
          value: t2.label.name,
          raw: `'${t2.label.name}'`
        }
      ]
    }
  };
}
function R(t2) {
  return t2.type === "TaggedTemplateExpression" && m$1.has(t2.tag.name);
}
function j$2(t2, i2) {
  return t2.type === "TaggedTemplateExpression" && t2.tag.name === i2;
}
function H$2(t2, i2) {
  return t2.split("").reduce((a, l2, s) => (l2 !== '"' || (!a.length || a[a.length - 1].length > 1 ? a.push([s + 1]) : a[a.length - 1].push(s)), a), []).map(([a, l2]) => {
    const s = t2.slice(a, l2);
    return Yr(`"${s}"`, i2 + a - 1);
  }).flat();
}
function P(t2, i2) {
  return {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: "tidal"
    },
    arguments: [
      { type: "Literal", value: t2 },
      { type: "Literal", value: i2 }
    ],
    optional: false
  };
}
function Q$3(t2, i2, a) {
  return {
    type: "CallExpression",
    callee: {
      type: "Identifier",
      name: t2
    },
    arguments: [
      { type: "Literal", value: i2 },
      { type: "Literal", value: a }
    ],
    optional: false
  };
}
const X$2 = (t2) => Ea(t2, d);
const Transpiler = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  evaluate: X$2,
  getWidgetID: A,
  registerLanguage: U$1,
  registerWidgetType: N$2,
  transpiler: d
}, Symbol.toStringTag, { value: "Module" }));
let listenerQueue = [];
let lqIndex = 0;
const QUEUE_ITEMS_PER_LISTENER = 4;
let atom = (initialValue) => {
  let listeners = [];
  let $atom = {
    get() {
      if (!$atom.lc) {
        $atom.listen(() => {
        })();
      }
      return $atom.value;
    },
    lc: 0,
    listen(listener) {
      $atom.lc = listeners.push(listener);
      return () => {
        for (let i2 = lqIndex + QUEUE_ITEMS_PER_LISTENER; i2 < listenerQueue.length; ) {
          if (listenerQueue[i2] === listener) {
            listenerQueue.splice(i2, QUEUE_ITEMS_PER_LISTENER);
          } else {
            i2 += QUEUE_ITEMS_PER_LISTENER;
          }
        }
        let index = listeners.indexOf(listener);
        if (~index) {
          listeners.splice(index, 1);
          if (!--$atom.lc) $atom.off();
        }
      };
    },
    notify(oldValue, changedKey) {
      let runListenerQueue = !listenerQueue.length;
      for (let listener of listeners) {
        listenerQueue.push(
          listener,
          $atom.value,
          oldValue,
          changedKey
        );
      }
      if (runListenerQueue) {
        for (lqIndex = 0; lqIndex < listenerQueue.length; lqIndex += QUEUE_ITEMS_PER_LISTENER) {
          listenerQueue[lqIndex](
            listenerQueue[lqIndex + 1],
            listenerQueue[lqIndex + 2],
            listenerQueue[lqIndex + 3]
          );
        }
        listenerQueue.length = 0;
      }
    },
    /* It will be called on last listener unsubscribing.
       We will redefine it in onMount and onStop. */
    off() {
    },
    set(newValue) {
      let oldValue = $atom.value;
      if (oldValue !== newValue) {
        $atom.value = newValue;
        $atom.notify(oldValue);
      }
    },
    subscribe(listener) {
      let unbind = $atom.listen(listener);
      listener($atom.value);
      return unbind;
    },
    value: initialValue
  };
  return $atom;
};
const MOUNT = 5;
const UNMOUNT = 6;
const REVERT_MUTATION = 10;
let on = (object, listener, eventKey, mutateStore) => {
  object.events = object.events || {};
  if (!object.events[eventKey + REVERT_MUTATION]) {
    object.events[eventKey + REVERT_MUTATION] = mutateStore((eventProps) => {
      object.events[eventKey].reduceRight((event, l2) => (l2(event), event), {
        shared: {},
        ...eventProps
      });
    });
  }
  object.events[eventKey] = object.events[eventKey] || [];
  object.events[eventKey].push(listener);
  return () => {
    let currentListeners = object.events[eventKey];
    let index = currentListeners.indexOf(listener);
    currentListeners.splice(index, 1);
    if (!currentListeners.length) {
      delete object.events[eventKey];
      object.events[eventKey + REVERT_MUTATION]();
      delete object.events[eventKey + REVERT_MUTATION];
    }
  };
};
let STORE_UNMOUNT_DELAY = 1e3;
let onMount = ($store, initialize) => {
  let listener = (payload) => {
    let destroy = initialize(payload);
    if (destroy) $store.events[UNMOUNT].push(destroy);
  };
  return on($store, listener, MOUNT, (runListeners) => {
    let originListen = $store.listen;
    $store.listen = (...args) => {
      if (!$store.lc && !$store.active) {
        $store.active = true;
        runListeners();
      }
      return originListen(...args);
    };
    let originOff = $store.off;
    $store.events[UNMOUNT] = [];
    $store.off = () => {
      originOff();
      setTimeout(() => {
        if ($store.active && !$store.lc) {
          $store.active = false;
          for (let destroy of $store.events[UNMOUNT]) destroy();
          $store.events[UNMOUNT] = [];
        }
      }, STORE_UNMOUNT_DELAY);
    };
    return () => {
      $store.listen = originListen;
      $store.off = originOff;
    };
  });
};
let map = (initial = {}) => {
  let $map = atom(initial);
  $map.setKey = function(key, value) {
    let oldMap = $map.value;
    if (typeof value === "undefined" && key in $map.value) {
      $map.value = { ...$map.value };
      delete $map.value[key];
      $map.notify(oldMap, key);
    } else if ($map.value[key] !== value) {
      $map.value = {
        ...$map.value,
        [key]: value
      };
      $map.notify(oldMap, key);
    }
  };
  return $map;
};
if (typeof DelayNode < "u") {
  class t2 extends DelayNode {
    constructor(n, o, s, c) {
      super(n), o = Math.abs(o), this.delayTime.value = s;
      const a = n.createGain();
      a.gain.value = Math.min(Math.abs(c), 0.995), this.feedback = a.gain;
      const d2 = n.createGain();
      return d2.gain.value = o, this.delayGain = d2, this.connect(a), this.connect(d2), a.connect(this), this.connect = (l2) => d2.connect(l2), this;
    }
    start(n) {
      this.delayGain.gain.setValueAtTime(this.delayGain.gain.value, n + this.delayTime.value);
    }
  }
  AudioContext.prototype.createFeedbackDelay = function(e, n, o) {
    return new t2(this, e, n, o);
  };
}
var jt = {};
jt.generateReverb = function(t2, e) {
  for (var n = t2.audioContext || new AudioContext(), o = n.sampleRate, s = t2.numChannels || 2, c = t2.decayTime * 1.5, a = Math.round(t2.decayTime * o), d2 = Math.round(c * o), l2 = Math.round((t2.fadeInTime || 0) * o), i2 = Math.pow(1 / 1e3, 1 / a), r = n.createBuffer(s, d2, o), u = 0; u < s; u++) {
    for (var p = r.getChannelData(u), h2 = 0; h2 < d2; h2++)
      p[h2] = Wn() * Math.pow(i2, h2);
    for (var h2 = 0; h2 < l2; h2++)
      p[h2] *= h2 / l2;
  }
  Gn(r, t2.lpFreqStart || 0, t2.lpFreqEnd || 0, t2.decayTime, e);
};
jt.generateGraph = function(t2, e, n, o, s) {
  var c = document.createElement("canvas");
  c.width = e, c.height = n;
  var a = c.getContext("2d");
  a.fillStyle = "#000", a.fillRect(0, 0, c.width, c.height), a.fillStyle = "#fff";
  for (var d2 = e / t2.length, l2 = n / (s - o), i2 = 0; i2 < t2.length; i2++)
    a.fillRect(i2 * d2, n - (t2[i2] - o) * l2, 1, 1);
  return c;
};
var Gn = function(t2, e, n, o, s) {
  if (e == 0) {
    s(t2);
    return;
  }
  var c = Vn(t2), a = new OfflineAudioContext(t2.numberOfChannels, c[0].length, t2.sampleRate), d2 = a.createBufferSource();
  d2.buffer = t2;
  var l2 = a.createBiquadFilter();
  e = Math.min(e, t2.sampleRate / 2), n = Math.min(n, t2.sampleRate / 2), l2.type = "lowpass", l2.Q.value = 1e-4, l2.frequency.setValueAtTime(e, 0), l2.frequency.linearRampToValueAtTime(n, o), d2.connect(l2), l2.connect(a.destination), d2.start(), a.oncomplete = function(i2) {
    s(i2.renderedBuffer);
  }, a.startRendering(), window.filterNode = l2;
}, Vn = function(t2) {
  for (var e = [], n = 0; n < t2.numberOfChannels; n++)
    e[n] = t2.getChannelData(n);
  return e;
}, Wn = function() {
  return Math.random() * 2 - 1;
};
let fe = (t2) => console.log(t2);
function fn(t2, e = "superdough") {
  N$1(`[${e}] error: ${t2.message}`);
}
const N$1 = (...t2) => fe(...t2), Fo = (t2) => {
  fe = t2;
}, Mn = (t2) => {
  var _a2;
  if (typeof t2 != "string")
    return [];
  const [e, n = "", o] = ((_a2 = t2.match(/^([a-gA-G])([#bsf]*)(-?[0-9]*)$/)) == null ? void 0 : _a2.slice(1)) || [];
  return e ? [e, n, o ? Number(o) : void 0] : [];
}, xn = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 }, gn = { "#": 1, b: -1, s: 1, f: -1 }, zt = (t2, e = 3) => {
  const [n, o, s = e] = Mn(t2);
  if (!n)
    throw new Error('not a note: "' + t2 + '"');
  const c = xn[n.toLowerCase()], a = (o == null ? void 0 : o.split("").reduce((d2, l2) => d2 + gn[l2], 0)) || 0;
  return (Number(s) + 1) * 12 + c + a;
}, Me = (t2) => Math.pow(2, (t2 - 69) / 12) * 440, D$1 = (t2, e, n) => Math.min(Math.max(t2, e), n), Ln = (t2) => 12 * Math.log(t2 / 440) / Math.LN2 + 69, Kn = (t2, e) => {
  if (typeof t2 != "object")
    throw new Error("valueToMidi: expected object value");
  let { freq: n, note: o } = t2;
  return typeof n == "number" ? Ln(n) : typeof o == "string" ? zt(o) : typeof o == "number" ? o : e;
};
function O(t2, e = 0, n) {
  return isNaN(Number(t2)) ? (!n && N$1(`"${t2}" is not a number, falling back to ${e}`, "warning"), e) : t2;
}
const xe = (t2, e) => (t2 % e + e) % e, he = (t2, e) => xe(Math.round(O(t2, 0)), e);
function zn(t2, e) {
  return t2 / e;
}
function ge(t2, e) {
  const { s: n, n: o = 0 } = t2;
  let s = Kn(t2, 36), c = s - 36, a, d2 = 0;
  if (Array.isArray(e))
    d2 = he(o, e.length), a = e[d2];
  else {
    const i2 = (u) => zt(u) - s, r = Object.keys(e).filter((u) => !u.startsWith("_")).reduce(
      (u, p, h2) => !u || Math.abs(i2(p)) < Math.abs(i2(u)) ? p : u,
      null
    );
    c = -i2(r), d2 = he(o, e[r].length), a = e[r][d2];
  }
  const l2 = `${n}:${d2}`;
  return { transpose: c, url: a, index: d2, midi: s, label: l2 };
}
typeof AudioContext < "u" && (AudioContext.prototype.adjustLength = function(t2, e, n = 1, o = 0) {
  const s = Math.floor(D$1(o, 0, 1) * e.length), c = e.sampleRate * t2, a = this.createBuffer(e.numberOfChannels, e.length, e.sampleRate);
  for (let d2 = 0; d2 < e.numberOfChannels; d2++) {
    let l2 = e.getChannelData(d2), i2 = a.getChannelData(d2);
    for (let r = 0; r < c; r++) {
      let u = (s + r * Math.abs(n)) % l2.length;
      n < 1 && (u = u * -1), i2[r] = l2.at(u) || 0;
    }
  }
  return a;
}, AudioContext.prototype.createReverb = function(t2, e, n, o, s, c, a) {
  const d2 = this.createConvolver();
  return d2.generate = (l2 = 2, i2 = 0.1, r = 15e3, u = 1e3, p, h2, m2) => {
    d2.duration = l2, d2.fade = i2, d2.lp = r, d2.dim = u, d2.ir = p, d2.irspeed = h2, d2.irbegin = m2, p ? d2.buffer = this.adjustLength(l2, p, h2, m2) : jt.generateReverb(
      {
        audioContext: this,
        numChannels: 2,
        decayTime: l2,
        fadeInTime: i2,
        lpFreqStart: r,
        lpFreqEnd: u
      },
      (b2) => {
        d2.buffer = b2;
      }
    );
  }, d2.generate(t2, e, n, o, s, c, a), d2;
});
var pe = {
  a: { freqs: [660, 1120, 2750, 3e3, 3350], gains: [1, 0.5012, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  e: { freqs: [440, 1800, 2700, 3e3, 3300], gains: [1, 0.1995, 0.1259, 0.1, 0.1], qs: [70, 80, 100, 120, 120] },
  i: { freqs: [270, 1850, 2900, 3350, 3590], gains: [1, 0.0631, 0.0631, 0.0158, 0.0158], qs: [40, 90, 100, 120, 120] },
  o: { freqs: [430, 820, 2700, 3e3, 3300], gains: [1, 0.3162, 0.0501, 0.0794, 0.01995], qs: [40, 80, 100, 120, 120] },
  u: { freqs: [370, 630, 2750, 3e3, 3400], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ae: { freqs: [650, 1515, 2400, 3e3, 3350], gains: [1, 0.5, 0.1008, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  aa: { freqs: [560, 900, 2570, 3e3, 3300], gains: [1, 0.5, 0.0708, 0.0631, 0.0126], qs: [80, 90, 120, 130, 140] },
  oe: { freqs: [500, 1430, 2300, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  ue: { freqs: [250, 1750, 2150, 3200, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.01995], qs: [40, 60, 100, 120, 120] },
  y: { freqs: [400, 1460, 2400, 3e3, 3300], gains: [1, 0.2, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  uh: { freqs: [600, 1250, 2100, 3100, 3500], gains: [1, 0.3, 0.0608, 0.0316, 0.01995], qs: [40, 70, 100, 120, 130] },
  un: { freqs: [500, 1240, 2280, 3e3, 3500], gains: [1, 0.1, 0.1708, 0.0216, 0.02995], qs: [40, 60, 100, 120, 120] },
  en: { freqs: [600, 1480, 2450, 3200, 3300], gains: [1, 0.15, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  an: { freqs: [700, 1050, 2500, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  on: { freqs: [500, 1080, 2350, 3e3, 3300], gains: [1, 0.1, 0.0708, 0.0316, 0.02995], qs: [40, 60, 100, 120, 120] },
  get æ() {
    return this.ae;
  },
  get ø() {
    return this.oe;
  },
  get ɑ() {
    return this.aa;
  },
  get å() {
    return this.aa;
  },
  get ö() {
    return this.oe;
  },
  get ü() {
    return this.ue;
  },
  get ı() {
    return this.y;
  }
};
if (typeof GainNode < "u") {
  class t2 extends GainNode {
    constructor(n, o) {
      if (super(n), !pe[o])
        throw new Error("vowel: unknown vowel " + o);
      const { gains: s, qs: c, freqs: a } = pe[o], d2 = n.createGain();
      for (let l2 = 0; l2 < 5; l2++) {
        const i2 = n.createGain();
        i2.gain.value = s[l2];
        const r = n.createBiquadFilter();
        r.type = "bandpass", r.Q.value = c[l2], r.frequency.value = a[l2], this.connect(r), r.connect(i2), i2.connect(d2);
      }
      return d2.gain.value = 8, this.connect = (l2) => d2.connect(l2), this;
    }
  }
  AudioContext.prototype.createVowelFilter = function(e) {
    return new t2(this, e);
  };
}
const Tn = "data:text/javascript;base64,dmFyIF89ZnVuY3Rpb24oQyl7InVzZSBzdHJpY3QiO3ZhciBUZT1PYmplY3QuZGVmaW5lUHJvcGVydHk7dmFyIHllPShDLEQsTCk9PkQgaW4gQz9UZShDLEQse2VudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwLHZhbHVlOkx9KTpDW0RdPUw7dmFyIFN0PShDLEQsTCk9PnllKEMsdHlwZW9mIEQhPSJzeW1ib2wiP0QrIiI6RCxMKTtjbGFzcyBMIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKHQpe3N1cGVyKHQpLHRoaXMuc3RhcnRlZD0hMSx0aGlzLm5iSW5wdXRzPXQubnVtYmVyT2ZJbnB1dHMsdGhpcy5uYk91dHB1dHM9dC5udW1iZXJPZk91dHB1dHMsdGhpcy5ibG9ja1NpemU9dC5wcm9jZXNzb3JPcHRpb25zLmJsb2NrU2l6ZSx0aGlzLmhvcFNpemU9MTI4LHRoaXMubmJPdmVybGFwcz10aGlzLmJsb2NrU2l6ZS90aGlzLmhvcFNpemUsdGhpcy5pbnB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpLHRoaXMuaW5wdXRCdWZmZXJzSGVhZD1uZXcgQXJyYXkodGhpcy5uYklucHV0cyksdGhpcy5pbnB1dEJ1ZmZlcnNUb1NlbmQ9bmV3IEFycmF5KHRoaXMubmJJbnB1dHMpO2ZvcihsZXQgZT0wO2U8dGhpcy5uYklucHV0cztlKyspdGhpcy5hbGxvY2F0ZUlucHV0Q2hhbm5lbHMoZSwxKTt0aGlzLm91dHB1dEJ1ZmZlcnM9bmV3IEFycmF5KHRoaXMubmJPdXRwdXRzKSx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlPW5ldyBBcnJheSh0aGlzLm5iT3V0cHV0cyk7Zm9yKGxldCBlPTA7ZTx0aGlzLm5iT3V0cHV0cztlKyspdGhpcy5hbGxvY2F0ZU91dHB1dENoYW5uZWxzKGUsMSl9cmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxlKXtmb3IobGV0IHM9MDtzPHRoaXMubmJJbnB1dHM7cysrKXtsZXQgcj10W3NdLmxlbmd0aDtyIT10aGlzLmlucHV0QnVmZmVyc1tzXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVJbnB1dENoYW5uZWxzKHMscil9Zm9yKGxldCBzPTA7czx0aGlzLm5iT3V0cHV0cztzKyspe2xldCByPWVbc10ubGVuZ3RoO3IhPXRoaXMub3V0cHV0QnVmZmVyc1tzXS5sZW5ndGgmJnRoaXMuYWxsb2NhdGVPdXRwdXRDaGFubmVscyhzLHIpfX1hbGxvY2F0ZUlucHV0Q2hhbm5lbHModCxlKXt0aGlzLmlucHV0QnVmZmVyc1t0XT1uZXcgQXJyYXkoZSk7Zm9yKGxldCBzPTA7czxlO3MrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKzEyOCksdGhpcy5pbnB1dEJ1ZmZlcnNbdF1bc10uZmlsbCgwKTt0aGlzLmlucHV0QnVmZmVyc0hlYWRbdF09bmV3IEFycmF5KGUpLHRoaXMuaW5wdXRCdWZmZXJzVG9TZW5kW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMuaW5wdXRCdWZmZXJzSGVhZFt0XVtzXT10aGlzLmlucHV0QnVmZmVyc1t0XVtzXS5zdWJhcnJheSgwLHRoaXMuYmxvY2tTaXplKSx0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKX1hbGxvY2F0ZU91dHB1dENoYW5uZWxzKHQsZSl7dGhpcy5vdXRwdXRCdWZmZXJzW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtzXT1uZXcgRmxvYXQzMkFycmF5KHRoaXMuYmxvY2tTaXplKSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bc10uZmlsbCgwKTt0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdPW5ldyBBcnJheShlKTtmb3IobGV0IHM9MDtzPGU7cysrKXRoaXMub3V0cHV0QnVmZmVyc1RvUmV0cmlldmVbdF1bc109bmV3IEZsb2F0MzJBcnJheSh0aGlzLmJsb2NrU2l6ZSksdGhpcy5vdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZVt0XVtzXS5maWxsKDApfXJlYWRJbnB1dHModCl7aWYodFswXS5sZW5ndGgmJnRbMF1bMF0ubGVuZ3RoPT0wKXtmb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl0aGlzLmlucHV0QnVmZmVyc1tlXVtzXS5maWxsKDAsdGhpcy5ibG9ja1NpemUpO3JldHVybn1mb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl7bGV0IHI9dFtlXVtzXTt0aGlzLmlucHV0QnVmZmVyc1tlXVtzXS5zZXQocix0aGlzLmJsb2NrU2l6ZSl9fXdyaXRlT3V0cHV0cyh0KXtmb3IobGV0IGU9MDtlPHRoaXMubmJJbnB1dHM7ZSsrKWZvcihsZXQgcz0wO3M8dGhpcy5pbnB1dEJ1ZmZlcnNbZV0ubGVuZ3RoO3MrKyl7bGV0IHI9dGhpcy5vdXRwdXRCdWZmZXJzW2VdW3NdLnN1YmFycmF5KDAsMTI4KTt0W2VdW3NdLnNldChyKX19c2hpZnRJbnB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO2UrKyl0aGlzLmlucHV0QnVmZmVyc1t0XVtlXS5jb3B5V2l0aGluKDAsMTI4KX1zaGlmdE91dHB1dEJ1ZmZlcnMoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJPdXRwdXRzO3QrKylmb3IobGV0IGU9MDtlPHRoaXMub3V0cHV0QnVmZmVyc1t0XS5sZW5ndGg7ZSsrKXRoaXMub3V0cHV0QnVmZmVyc1t0XVtlXS5jb3B5V2l0aGluKDAsMTI4KSx0aGlzLm91dHB1dEJ1ZmZlcnNbdF1bZV0uc3ViYXJyYXkodGhpcy5ibG9ja1NpemUtMTI4KS5maWxsKDApfXByZXBhcmVJbnB1dEJ1ZmZlcnNUb1NlbmQoKXtmb3IobGV0IHQ9MDt0PHRoaXMubmJJbnB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5pbnB1dEJ1ZmZlcnNbdF0ubGVuZ3RoO2UrKyl0aGlzLmlucHV0QnVmZmVyc1RvU2VuZFt0XVtlXS5zZXQodGhpcy5pbnB1dEJ1ZmZlcnNIZWFkW3RdW2VdKX1oYW5kbGVPdXRwdXRCdWZmZXJzVG9SZXRyaWV2ZSgpe2ZvcihsZXQgdD0wO3Q8dGhpcy5uYk91dHB1dHM7dCsrKWZvcihsZXQgZT0wO2U8dGhpcy5vdXRwdXRCdWZmZXJzW3RdLmxlbmd0aDtlKyspZm9yKGxldCBzPTA7czx0aGlzLmJsb2NrU2l6ZTtzKyspdGhpcy5vdXRwdXRCdWZmZXJzW3RdW2VdW3NdKz10aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlW3RdW2VdW3NdL3RoaXMubmJPdmVybGFwc31wcm9jZXNzKHQsZSxzKXtjb25zdCBpPXRbMF1bMF0hPT12b2lkIDA7cmV0dXJuIHRoaXMuc3RhcnRlZCYmIWk/ITE6KHRoaXMuc3RhcnRlZD1pLHRoaXMucmVhbGxvY2F0ZUNoYW5uZWxzSWZOZWVkZWQodCxlKSx0aGlzLnJlYWRJbnB1dHModCksdGhpcy5zaGlmdElucHV0QnVmZmVycygpLHRoaXMucHJlcGFyZUlucHV0QnVmZmVyc1RvU2VuZCgpLHRoaXMucHJvY2Vzc09MQSh0aGlzLmlucHV0QnVmZmVyc1RvU2VuZCx0aGlzLm91dHB1dEJ1ZmZlcnNUb1JldHJpZXZlLHMpLHRoaXMuaGFuZGxlT3V0cHV0QnVmZmVyc1RvUmV0cmlldmUoKSx0aGlzLndyaXRlT3V0cHV0cyhlKSx0aGlzLnNoaWZ0T3V0cHV0QnVmZmVycygpLCEwKX1wcm9jZXNzT0xBKHQsZSxzKXtjb25zb2xlLmFzc2VydCghMSwiTm90IG92ZXJyaWRlbiIpfX1jbGFzcyBrdHtjb25zdHJ1Y3Rvcih0KXtpZih0aGlzLnNpemU9dHwwLHRoaXMuc2l6ZTw9MXx8dGhpcy5zaXplJnRoaXMuc2l6ZS0xKXRocm93IG5ldyBFcnJvcigiRkZUIHNpemUgbXVzdCBiZSBhIHBvd2VyIG9mIHR3byBhbmQgYmlnZ2VyIHRoYW4gMSIpO3RoaXMuX2NzaXplPXQ8PDE7Zm9yKHZhciBlPW5ldyBBcnJheSh0aGlzLnNpemUqMikscz0wO3M8ZS5sZW5ndGg7cys9Mil7Y29uc3QgYz1NYXRoLlBJKnMvdGhpcy5zaXplO2Vbc109TWF0aC5jb3MoYyksZVtzKzFdPS1NYXRoLnNpbihjKX10aGlzLnRhYmxlPWU7Zm9yKHZhciByPTAsaT0xO3RoaXMuc2l6ZT5pO2k8PD0xKXIrKzt0aGlzLl93aWR0aD1yJTI9PT0wP3ItMTpyLHRoaXMuX2JpdHJldj1uZXcgQXJyYXkoMTw8dGhpcy5fd2lkdGgpO2Zvcih2YXIgbz0wO288dGhpcy5fYml0cmV2Lmxlbmd0aDtvKyspe3RoaXMuX2JpdHJldltvXT0wO2Zvcih2YXIgYT0wO2E8dGhpcy5fd2lkdGg7YSs9Mil7dmFyIHU9dGhpcy5fd2lkdGgtYS0yO3RoaXMuX2JpdHJldltvXXw9KG8+Pj5hJjMpPDx1fX10aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGwsdGhpcy5faW52PTB9ZnJvbUNvbXBsZXhBcnJheSh0LGUpe2Zvcih2YXIgcz1lfHxuZXcgQXJyYXkodC5sZW5ndGg+Pj4xKSxyPTA7cjx0Lmxlbmd0aDtyKz0yKXNbcj4+PjFdPXRbcl07cmV0dXJuIHN9Y3JlYXRlQ29tcGxleEFycmF5KCl7Y29uc3QgdD1uZXcgQXJyYXkodGhpcy5fY3NpemUpO2Zvcih2YXIgZT0wO2U8dC5sZW5ndGg7ZSsrKXRbZV09MDtyZXR1cm4gdH10b0NvbXBsZXhBcnJheSh0LGUpe2Zvcih2YXIgcz1lfHx0aGlzLmNyZWF0ZUNvbXBsZXhBcnJheSgpLHI9MDtyPHMubGVuZ3RoO3IrPTIpc1tyXT10W3I+Pj4xXSxzW3IrMV09MDtyZXR1cm4gc31jb21wbGV0ZVNwZWN0cnVtKHQpe2Zvcih2YXIgZT10aGlzLl9jc2l6ZSxzPWU+Pj4xLHI9MjtyPHM7cis9Mil0W2Utcl09dFtyXSx0W2UtcisxXT0tdFtyKzFdfXRyYW5zZm9ybSh0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3RyYW5zZm9ybTQoKSx0aGlzLl9vdXQ9bnVsbCx0aGlzLl9kYXRhPW51bGx9cmVhbFRyYW5zZm9ybSh0LGUpe2lmKHQ9PT1lKXRocm93IG5ldyBFcnJvcigiSW5wdXQgYW5kIG91dHB1dCBidWZmZXJzIG11c3QgYmUgZGlmZmVyZW50Iik7dGhpcy5fb3V0PXQsdGhpcy5fZGF0YT1lLHRoaXMuX2ludj0wLHRoaXMuX3JlYWxUcmFuc2Zvcm00KCksdGhpcy5fb3V0PW51bGwsdGhpcy5fZGF0YT1udWxsfWludmVyc2VUcmFuc2Zvcm0odCxlKXtpZih0PT09ZSl0aHJvdyBuZXcgRXJyb3IoIklucHV0IGFuZCBvdXRwdXQgYnVmZmVycyBtdXN0IGJlIGRpZmZlcmVudCIpO3RoaXMuX291dD10LHRoaXMuX2RhdGE9ZSx0aGlzLl9pbnY9MSx0aGlzLl90cmFuc2Zvcm00KCk7Zm9yKHZhciBzPTA7czx0Lmxlbmd0aDtzKyspdFtzXS89dGhpcy5zaXplO3RoaXMuX291dD1udWxsLHRoaXMuX2RhdGE9bnVsbH1fdHJhbnNmb3JtNCgpe3ZhciB0PXRoaXMuX291dCxlPXRoaXMuX2NzaXplLHM9dGhpcy5fd2lkdGgscj0xPDxzLGk9ZS9yPDwxLG8sYSx1PXRoaXMuX2JpdHJldjtpZihpPT09NClmb3Iobz0wLGE9MDtvPGU7bys9aSxhKyspe2NvbnN0IGQ9dVthXTt0aGlzLl9zaW5nbGVUcmFuc2Zvcm0yKG8sZCxyKX1lbHNlIGZvcihvPTAsYT0wO288ZTtvKz1pLGErKyl7Y29uc3QgZD11W2FdO3RoaXMuX3NpbmdsZVRyYW5zZm9ybTQobyxkLHIpfXZhciBjPXRoaXMuX2ludj8tMToxLGg9dGhpcy50YWJsZTtmb3Iocj4+PTI7cj49MjtyPj49Mil7aT1lL3I8PDE7dmFyIGY9aT4+PjI7Zm9yKG89MDtvPGU7bys9aSlmb3IodmFyIHA9bytmLGw9byxtPTA7bDxwO2wrPTIsbSs9cil7Y29uc3QgZD1sLGI9ZCtmLEk9YitmLHY9SStmLFA9dFtkXSx3PXRbZCsxXSxUPXRbYl0sQj10W2IrMV0sQT10W0ldLHk9dFtJKzFdLE89dFt2XSxxPXRbdisxXSx4PVAsRT13LE49aFttXSxGPWMqaFttKzFdLFY9VCpOLUIqRixrPVQqRitCKk4sUj1oWzIqbV0sWD1jKmhbMiptKzFdLHR0PUEqUi15KlgsZXQ9QSpYK3kqUixzdD1oWzMqbV0scnQ9YypoWzMqbSsxXSxudD1PKnN0LXEqcnQsaXQ9TypydCtxKnN0LG90PXgrdHQsSz1FK2V0LGo9eC10dCxhdD1FLWV0LGN0PVYrbnQsWj1rK2l0LCQ9YyooVi1udCksdXQ9Yyooay1pdCksbHQ9b3QrY3QsZ3Q9SytaLGJ0PW90LWN0LEl0PUstWixfdD1qK3V0LEJ0PWF0LSQsTXQ9ai11dCxQdD1hdCskO3RbZF09bHQsdFtkKzFdPWd0LHRbYl09X3QsdFtiKzFdPUJ0LHRbSV09YnQsdFtJKzFdPUl0LHRbdl09TXQsdFt2KzFdPVB0fX19X3NpbmdsZVRyYW5zZm9ybTIodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxvPWlbZV0sYT1pW2UrMV0sdT1pW2Urc10sYz1pW2UrcysxXSxoPW8rdSxmPWErYyxwPW8tdSxsPWEtYztyW3RdPWgsclt0KzFdPWYsclt0KzJdPXAsclt0KzNdPWx9X3NpbmdsZVRyYW5zZm9ybTQodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxvPXRoaXMuX2ludj8tMToxLGE9cyoyLHU9cyozLGM9aVtlXSxoPWlbZSsxXSxmPWlbZStzXSxwPWlbZStzKzFdLGw9aVtlK2FdLG09aVtlK2ErMV0sZD1pW2UrdV0sYj1pW2UrdSsxXSxJPWMrbCx2PWgrbSxQPWMtbCx3PWgtbSxUPWYrZCxCPXArYixBPW8qKGYtZCkseT1vKihwLWIpLE89SStULHE9ditCLHg9UCt5LEU9dy1BLE49SS1ULEY9di1CLFY9UC15LGs9dytBO3JbdF09TyxyW3QrMV09cSxyW3QrMl09eCxyW3QrM109RSxyW3QrNF09TixyW3QrNV09RixyW3QrNl09VixyW3QrN109a31fcmVhbFRyYW5zZm9ybTQoKXt2YXIgdD10aGlzLl9vdXQsZT10aGlzLl9jc2l6ZSxzPXRoaXMuX3dpZHRoLHI9MTw8cyxpPWUvcjw8MSxvLGEsdT10aGlzLl9iaXRyZXY7aWYoaT09PTQpZm9yKG89MCxhPTA7bzxlO28rPWksYSsrKXtjb25zdCB3dD11W2FdO3RoaXMuX3NpbmdsZVJlYWxUcmFuc2Zvcm0yKG8sd3Q+Pj4xLHI+Pj4xKX1lbHNlIGZvcihvPTAsYT0wO288ZTtvKz1pLGErKyl7Y29uc3Qgd3Q9dVthXTt0aGlzLl9zaW5nbGVSZWFsVHJhbnNmb3JtNChvLHd0Pj4+MSxyPj4+MSl9dmFyIGM9dGhpcy5faW52Py0xOjEsaD10aGlzLnRhYmxlO2ZvcihyPj49MjtyPj0yO3I+Pj0yKXtpPWUvcjw8MTt2YXIgZj1pPj4+MSxwPWY+Pj4xLGw9cD4+PjE7Zm9yKG89MDtvPGU7bys9aSlmb3IodmFyIG09MCxkPTA7bTw9bDttKz0yLGQrPXIpe3ZhciBiPW8rbSxJPWIrcCx2PUkrcCxQPXYrcCx3PXRbYl0sVD10W2IrMV0sQj10W0ldLEE9dFtJKzFdLHk9dFt2XSxPPXRbdisxXSxxPXRbUF0seD10W1ArMV0sRT13LE49VCxGPWhbZF0sVj1jKmhbZCsxXSxrPUIqRi1BKlYsUj1CKlYrQSpGLFg9aFsyKmRdLHR0PWMqaFsyKmQrMV0sZXQ9eSpYLU8qdHQsc3Q9eSp0dCtPKlgscnQ9aFszKmRdLG50PWMqaFszKmQrMV0saXQ9cSpydC14Km50LG90PXEqbnQreCpydCxLPUUrZXQsaj1OK3N0LGF0PUUtZXQsY3Q9Ti1zdCxaPWsraXQsJD1SK290LHV0PWMqKGstaXQpLGx0PWMqKFItb3QpLGd0PUsrWixidD1qKyQsSXQ9YXQrbHQsX3Q9Y3QtdXQ7aWYodFtiXT1ndCx0W2IrMV09YnQsdFtJXT1JdCx0W0krMV09X3QsbT09PTApe3ZhciBCdD1LLVosTXQ9ai0kO3Rbdl09QnQsdFt2KzFdPU10O2NvbnRpbnVlfWlmKG0hPT1sKXt2YXIgUHQ9YXQsbWU9LWN0LHZlPUssZ2U9LWosYmU9LWMqbHQsSWU9LWMqdXQsX2U9LWMqJCxCZT0tYypaLE1lPVB0K2JlLFBlPW1lK0llLHdlPXZlK0JlLFNlPWdlLV9lLEN0PW8rcC1tLEV0PW8rZi1tO3RbQ3RdPU1lLHRbQ3QrMV09UGUsdFtFdF09d2UsdFtFdCsxXT1TZX19fX1fc2luZ2xlUmVhbFRyYW5zZm9ybTIodCxlLHMpe2NvbnN0IHI9dGhpcy5fb3V0LGk9dGhpcy5fZGF0YSxvPWlbZV0sYT1pW2Urc10sdT1vK2EsYz1vLWE7clt0XT11LHJbdCsxXT0wLHJbdCsyXT1jLHJbdCszXT0wfV9zaW5nbGVSZWFsVHJhbnNmb3JtNCh0LGUscyl7Y29uc3Qgcj10aGlzLl9vdXQsaT10aGlzLl9kYXRhLG89dGhpcy5faW52Py0xOjEsYT1zKjIsdT1zKjMsYz1pW2VdLGg9aVtlK3NdLGY9aVtlK2FdLHA9aVtlK3VdLGw9YytmLG09Yy1mLGQ9aCtwLGI9byooaC1wKSxJPWwrZCx2PW0sUD0tYix3PWwtZCxUPW0sQj1iO3JbdF09SSxyW3QrMV09MCxyW3QrMl09dixyW3QrM109UCxyW3QrNF09dyxyW3QrNV09MCxyW3QrNl09VCxyW3QrN109Qn19bGV0IER0PW49PmNvbnNvbGUubG9nKG4pO2NvbnN0IHp0PSguLi5uKT0+RHQoLi4ubikscXQ9KG4sdCxlKT0+TWF0aC5taW4oTWF0aC5tYXgobix0KSxlKSxUdD1uPT5uLygxK24pLFd0PShuLHQpPT4obiV0K3QpJXQsTHQ9KG4sdCk9PigxK3QpKm4vKDErdCpNYXRoLmFicyhuKSksWT0obix0KT0+TWF0aC50YW5oKG4qKDErdCkpLFl0PShuLHQpPT5xdCgoMSt0KSpuLC0xLDEpLHl0PShuLHQpPT57bGV0IGU9KDErLjUqdCkqbjtjb25zdCBzPVd0KGUrMSw0KTtyZXR1cm4gMS1NYXRoLmFicyhzLTIpfSxIdD0obix0KT0+TWF0aC5zaW4oTWF0aC5QSS8yKnl0KG4sdCkpLFV0PShuLHQpPT57Y29uc3QgZT1UdChNYXRoLmxvZzFwKHQpKSxzPShuLWUvMypuKm4qbikvKDEtZS8zKTtyZXR1cm4gWShzLHQpfSxBdD0obix0LGU9ITEpPT57Y29uc3Qgcz0xKzIqdCxpPS4wNypUdChNYXRoLmxvZzFwKHQpKSxvPVkobitpLDIqdCksYT1ZKGU/aTotbitpLDIqdCksdT1vLWEsYz0xL01hdGguY29zaChzKmkpLGg9YypjLGY9TWF0aC5tYXgoMWUtOCwoZT8xOjIpKnMqaCk7cmV0dXJuIFkodS9mLHQpfSxPdD17c2N1cnZlOkx0LHNvZnQ6WSxoYXJkOll0LGN1YmljOlV0LGRpb2RlOkF0LGFzeW06KG4sdCk9PkF0KG4sdCwhMCksZm9sZDp5dCxzaW5lZm9sZDpIdCxjaGVieXNoZXY6KG4sdCk9Pntjb25zdCBlPTEwKk1hdGgubG9nMXAodCk7bGV0IHM9MSxyPW4saSxvPTA7Zm9yKGxldCBhPTE7YTw2NDthKyspe2lmKGE8Mil7bys9YT09MD9zOnI7Y29udGludWV9aT0yKm4qcy1yLHI9cyxzPWksYSUyPT09MCYmKG8rPU1hdGgubWluKDEuMyplL2EsMikqaSl9cmV0dXJuIFkobyxlLzIwKX19LEc9T2JqZWN0LmZyZWV6ZShPYmplY3Qua2V5cyhPdCkpLEt0PW49PntsZXQgdD1uO3R5cGVvZiBuPT0ic3RyaW5nIiYmKHQ9Ry5pbmRleE9mKG4pLHQ9PT0tMSYmKHp0KGBbc3VwZXJkb3VnaF0gQ291bGQgbm90IGZpbmQgd2F2ZXNoYXBpbmcgYWxnb3JpdGhtICR7bn0uCiAgICAgICAgQXZhaWxhYmxlIG9wdGlvbnMgYXJlICR7Ry5qb2luKCIsICIpfS4KICAgICAgICBEZWZhdWx0aW5nIHRvICR7R1swXX0uYCksdD0wKSk7Y29uc3QgZT1HW3QlRy5sZW5ndGhdO3JldHVybiBPdFtlXX0sTT0obix0LGUpPT5NYXRoLm1pbihNYXRoLm1heChuLHQpLGUpLHh0PShuLHQpPT4obiV0K3QpJXQsanQ9KG4sdCxlKT0+ZSoodC1uKStuLFM9KG4sdCk9Pm5bdF0/P25bMF0sVz1uPT5uLU1hdGguZmxvb3IobiksZnQ9bj0+bnwwLE50PShuLHQsZSk9Pm48Mj8wOmp0KC10Ki41LHQqLjUsZS8obi0xKSksSD0obix0KT0+bipNYXRoLnBvdygyLHQvMTIpO2Z1bmN0aW9uIEZ0KG4sdD0xKXtyZXR1cm4gbj49dD9uLT10Om48MCYmKG4rPXQpLG59Y29uc3QgVT0xMjg7ZnVuY3Rpb24gWnQobix0KXtyZXR1cm4gdD1NYXRoLm1pbih0LDEtdCksbjx0PyhuLz10LG4rbi1uKm4tMSk6bj4xLXQ/KG49KG4tMSkvdCxuKm4rbituKzEpOjB9Y29uc3QgcHQ9e3RyaShuLHQ9LjUpe2NvbnN0IGU9MS10O3JldHVybiBuPj10PzEvZS1uL2U6bi90fSxzaW5lKG4pe3JldHVybiBNYXRoLnNpbihNYXRoLlBJKjIqbikqLjUrLjV9LHJhbXAobil7cmV0dXJuIG59LHNhdyhuKXtyZXR1cm4gMS1ufSxzcXVhcmUobix0PS41KXtyZXR1cm4gbj49dD8wOjF9LGN1c3RvbShuLHQ9WzAsMV0pe2NvbnN0IGU9dC5sZW5ndGgtMSxzPU1hdGguZmxvb3IobiplKSxyPTEvZSxpPU0odFtzXSwwLDEpLGE9TSh0W3MrMV0sMCwxKSx1PWksYz0wLGg9cjtyZXR1cm4oYS11KS8oaC1jKSoobi1yKnMpK2l9LHNhd2JsZXAobix0KXtyZXR1cm4gMipuLTEtWnQobix0KX19O2Z1bmN0aW9uIFEobix0KXtyZXR1cm4gdC5sZW5ndGg+MT90W25dOnRbMF19Y29uc3QgJHQ9T2JqZWN0LmtleXMocHQpO2NsYXNzIEd0IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MH0se25hbWU6InRpbWUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MH0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOi41fSx7bmFtZToic2tldyIsZGVmYXVsdFZhbHVlOi41fSx7bmFtZToiZGVwdGgiLGRlZmF1bHRWYWx1ZToxfSx7bmFtZToicGhhc2VvZmZzZXQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToic2hhcGUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToiY3VydmUiLGRlZmF1bHRWYWx1ZToxfSx7bmFtZToiZGNvZmZzZXQiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToibWluIixkZWZhdWx0VmFsdWU6MH0se25hbWU6Im1heCIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5waGFzZX1pbmNyZW1lbnRQaGFzZSh0KXt0aGlzLnBoYXNlKz10LHRoaXMucGhhc2U+MSYmKHRoaXMucGhhc2U9dGhpcy5waGFzZS0xKX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXMuYmVnaW5bMF07aWYoY3VycmVudFRpbWU+PXMuZW5kWzBdKXJldHVybiExO2lmKGN1cnJlbnRUaW1lPD1yKXJldHVybiEwO2NvbnN0IGk9ZVswXSxvPXMuZnJlcXVlbmN5WzBdLGE9cy50aW1lWzBdLHU9cy5kZXB0aFswXSxjPXMuc2tld1swXSxoPXMucGhhc2VvZmZzZXRbMF0sZj1zLmN1cnZlWzBdLHA9cy5kY29mZnNldFswXSxsPXMubWluWzBdLG09cy5tYXhbMF0sZD0kdFtzLnNoYXBlWzBdXSxiPWlbMF0ubGVuZ3RoPz8wO3RoaXMucGhhc2U9PW51bGwmJih0aGlzLnBoYXNlPXh0KGEqbytoLDEpKTtjb25zdCBJPW8vc2FtcGxlUmF0ZTtmb3IobGV0IHY9MDt2PGI7disrKXtmb3IobGV0IFA9MDtQPGkubGVuZ3RoO1ArKyl7bGV0IHc9KHB0W2RdKHRoaXMucGhhc2UsYykrcCkqdTt3PU1hdGgucG93KHcsZiksaVtQXVt2XT1NKHcsbCxtKX10aGlzLmluY3JlbWVudFBoYXNlKEkpfXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigibGZvLXByb2Nlc3NvciIsR3QpO2NsYXNzIFF0IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImNvYXJzZSIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5zdGFydGVkPSExfXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9dFswXSxpPWVbMF0sbz1yWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIW8pcmV0dXJuITE7dGhpcy5zdGFydGVkPW87bGV0IGE9cy5jb2Fyc2VbMF0/PzA7YT1NYXRoLm1heCgxLGEpO2ZvcihsZXQgdT0wO3U8VTt1KyspZm9yKGxldCBjPTA7YzxyLmxlbmd0aDtjKyspaVtjXVt1XT11JWE9PT0wP3JbY11bdV06aVtjXVt1LTFdO3JldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigiY29hcnNlLXByb2Nlc3NvciIsUXQpO2NsYXNzIEp0IGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImNydXNoIixkZWZhdWx0VmFsdWU6MH1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITF9cHJvY2Vzcyh0LGUscyl7Y29uc3Qgcj10WzBdLGk9ZVswXSxvPXJbMF0hPT12b2lkIDA7aWYodGhpcy5zdGFydGVkJiYhbylyZXR1cm4hMTt0aGlzLnN0YXJ0ZWQ9bztsZXQgYT1zLmNydXNoWzBdPz84O2E9TWF0aC5tYXgoMSxhKTtmb3IobGV0IHU9MDt1PFU7dSsrKWZvcihsZXQgYz0wO2M8ci5sZW5ndGg7YysrKXtjb25zdCBoPU1hdGgucG93KDIsYS0xKTtpW2NdW3VdPU1hdGgucm91bmQocltjXVt1XSpoKS9ofXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigiY3J1c2gtcHJvY2Vzc29yIixKdCk7Y2xhc3MgWHQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToic2hhcGUiLGRlZmF1bHRWYWx1ZTowfSx7bmFtZToicG9zdGdhaW4iLGRlZmF1bHRWYWx1ZToxfV19Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuc3RhcnRlZD0hMX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXRbMF0saT1lWzBdLG89clswXSE9PXZvaWQgMDtpZih0aGlzLnN0YXJ0ZWQmJiFvKXJldHVybiExO3RoaXMuc3RhcnRlZD1vO2xldCBhPXMuc2hhcGVbMF07YT1hPDE/YTouOTk5OTk5OTk5NixhPTIqYS8oMS1hKTtjb25zdCB1PU1hdGgubWF4KC4wMDEsTWF0aC5taW4oMSxzLnBvc3RnYWluWzBdKSk7Zm9yKGxldCBjPTA7YzxVO2MrKylmb3IobGV0IGg9MDtoPHIubGVuZ3RoO2grKylpW2hdW2NdPSgxK2EpKnJbaF1bY10vKDErYSpNYXRoLmFicyhyW2hdW2NdKSkqdTtyZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoInNoYXBlLXByb2Nlc3NvciIsWHQpO2NsYXNzIFZ0e2NvbnN0cnVjdG9yKCl7U3QodGhpcywiczAiLDApO1N0KHRoaXMsInMxIiwwKX11cGRhdGUodCxlLHM9MCl7cz1NKHMsMCwxKSxlPU0oZSwwLHNhbXBsZVJhdGUvMi0xKTtjb25zdCByPU0oMipNYXRoLnNpbihlKihkdC9zYW1wbGVSYXRlKSksMCwxLjE0KSxvPTEtTWF0aC5wb3coLjUsKHMrLjEyNSkvLjEyNSkqcjtyZXR1cm4gdGhpcy5zMD1vKnRoaXMuczAtcip0aGlzLnMxK3IqdCx0aGlzLnMxPW8qdGhpcy5zMStyKnRoaXMuczAsdGhpcy5zMX19Y2xhc3MgdGUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToidmFsdWUiLGRlZmF1bHRWYWx1ZTouNX1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLmZpbHRlcnM9W25ldyBWdCxuZXcgVnRdfXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9dFswXSxpPWVbMF0sbz1yWzBdIT09dm9pZCAwO3RoaXMuc3RhcnRlZD1vO2NvbnN0IGE9TShzLnZhbHVlWzBdLDAsMSk7bGV0IHU9Im5vbmUiLGMsaD0xO2E+LjUxPyh1PSJoaXBhc3MiLGg9KGEtLjUpKjIpOmE8LjQ5JiYodT0ibG9wYXNzIixoPWEqMiksYz1NYXRoLnBvdyhoKjExLDQpO2ZvcihsZXQgZj0wO2Y8ci5sZW5ndGg7ZisrKWZvcihsZXQgcD0wO3A8VTtwKyspdT09Im5vbmUiP2lbZl1bcF09cltmXVtwXToodGhpcy5maWx0ZXJzW2ZdLnVwZGF0ZShyW2ZdW3BdLGMsLjEpLHU9PT0ibG9wYXNzIj9pW2ZdW3BdPXRoaXMuZmlsdGVyc1tmXS5zMTp1PT09ImhpcGFzcyI/aVtmXVtwXT1yW2ZdW3BdLXRoaXMuZmlsdGVyc1tmXS5zMTppW2ZdW3BdPXJbZl1bcF0pO3JldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigiZGpmLXByb2Nlc3NvciIsdGUpO2Z1bmN0aW9uIHoobil7Y29uc3QgdD1uKm47cmV0dXJuIG4qKDI3K3QpLygyNys5KnQpfWNvbnN0IGR0PTMuMTQxNTkyNjUzNTk7Y2xhc3MgZWUgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NTAwfSx7bmFtZToicSIsZGVmYXVsdFZhbHVlOjF9LHtuYW1lOiJkcml2ZSIsZGVmYXVsdFZhbHVlOi42OX1dfWNvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITEsdGhpcy5wMD1bMCwwXSx0aGlzLnAxPVswLDBdLHRoaXMucDI9WzAsMF0sdGhpcy5wMz1bMCwwXSx0aGlzLnAzMj1bMCwwXSx0aGlzLnAzMz1bMCwwXSx0aGlzLnAzND1bMCwwXX1wcm9jZXNzKHQsZSxzKXtjb25zdCByPXRbMF0saT1lWzBdLG89clswXSE9PXZvaWQgMDtpZih0aGlzLnN0YXJ0ZWQmJiFvKXJldHVybiExO3RoaXMuc3RhcnRlZD1vO2NvbnN0IGE9cy5xWzBdLHU9TShNYXRoLmV4cChzLmRyaXZlWzBdKSwuMSwyZTMpO2xldCBjPXMuZnJlcXVlbmN5WzBdO2M9YyoyKmR0L3NhbXBsZVJhdGUsYz1jPjE/MTpjO2NvbnN0IGg9TWF0aC5taW4oOCxhKi4xMyk7bGV0IGY9MS91Kk1hdGgubWluKDEuNzUsMStoKTtmb3IobGV0IHA9MDtwPFU7cCsrKWZvcihsZXQgbD0wO2w8ci5sZW5ndGg7bCsrKXtjb25zdCBtPXRoaXMucDNbbF0qLjM2MDg5MSt0aGlzLnAzMltsXSouNDE3MjkrdGhpcy5wMzNbbF0qLjE3Nzg5Nit0aGlzLnAzNFtsXSouMDQzOTcyNTt0aGlzLnAzNFtsXT10aGlzLnAzM1tsXSx0aGlzLnAzM1tsXT10aGlzLnAzMltsXSx0aGlzLnAzMltsXT10aGlzLnAzW2xdLHRoaXMucDBbbF0rPSh6KHJbbF1bcF0qdS1oKm0pLXoodGhpcy5wMFtsXSkpKmMsdGhpcy5wMVtsXSs9KHoodGhpcy5wMFtsXSkteih0aGlzLnAxW2xdKSkqYyx0aGlzLnAyW2xdKz0oeih0aGlzLnAxW2xdKS16KHRoaXMucDJbbF0pKSpjLHRoaXMucDNbbF0rPSh6KHRoaXMucDJbbF0pLXoodGhpcy5wM1tsXSkpKmMsaVtsXVtwXT1tKmZ9cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJsYWRkZXItcHJvY2Vzc29yIixlZSk7Y2xhc3Mgc2UgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7c3RhdGljIGdldCBwYXJhbWV0ZXJEZXNjcmlwdG9ycygpe3JldHVyblt7bmFtZToiZGlzdG9ydCIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJwb3N0Z2FpbiIsZGVmYXVsdFZhbHVlOjF9XX1jb25zdHJ1Y3Rvcih7cHJvY2Vzc29yT3B0aW9uczp0fSl7c3VwZXIoKSx0aGlzLnN0YXJ0ZWQ9ITEsdGhpcy5hbGdvcml0aG09S3QodC5hbGdvcml0aG0pfXByb2Nlc3ModCxlLHMpe2NvbnN0IHI9dFswXSxpPWVbMF0sbz1yWzBdIT09dm9pZCAwO2lmKHRoaXMuc3RhcnRlZCYmIW8pcmV0dXJuITE7dGhpcy5zdGFydGVkPW87Zm9yKGxldCBhPTA7YTxVO2ErKyl7Y29uc3QgdT1NKFMocy5wb3N0Z2FpbixhKSwuMDAxLDEpLGM9TWF0aC5leHBtMShTKHMuZGlzdG9ydCxhKSk7Zm9yKGxldCBoPTA7aDxyLmxlbmd0aDtoKyspe2NvbnN0IGY9cltoXVthXTtpW2hdW2FdPXUqdGhpcy5hbGdvcml0aG0oZixjKX19cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJkaXN0b3J0LXByb2Nlc3NvciIsc2UpO2NsYXNzIHJlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnBoYXNlPVtdfXN0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLG1pbjowfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NDQwLG1pbjpOdW1iZXIuRVBTSUxPTn0se25hbWU6InBhbnNwcmVhZCIsZGVmYXVsdFZhbHVlOi40LG1pbjowLG1heDoxfSx7bmFtZToiZnJlcXNwcmVhZCIsZGVmYXVsdFZhbHVlOi4yLG1pbjowfSx7bmFtZToiZGV0dW5lIixkZWZhdWx0VmFsdWU6MCxtaW46MH0se25hbWU6InZvaWNlcyIsZGVmYXVsdFZhbHVlOjUsbWluOjF9XX1wcm9jZXNzKHQsZSxzKXtpZihjdXJyZW50VGltZTw9cy5iZWdpblswXSlyZXR1cm4hMDtpZihjdXJyZW50VGltZT49cy5lbmRbMF0pcmV0dXJuITE7Y29uc3Qgcj1lWzBdO2ZvcihsZXQgaT0wO2k8clswXS5sZW5ndGg7aSsrKXtjb25zdCBvPVMocy5kZXR1bmUsaSksYT1TKHMudm9pY2VzLGkpLHU9UyhzLmZyZXFzcHJlYWQsaSksYz1TKHMucGFuc3ByZWFkLGkpKi41Ky41LGg9TWF0aC5zcXJ0KDEtYyksZj1NYXRoLnNxcnQoYyk7bGV0IHA9UyhzLmZyZXF1ZW5jeSxpKTtwPUgocCxvLzEwMCk7Zm9yKGxldCBsPTA7bDxhO2wrKyl7Y29uc3QgbT0obCYxKT09MTtsZXQgZD1oLGI9ZjttJiYoZD1mLGI9aCk7Y29uc3QgST1IKHAsTnQoYSx1LGwpKSx2PXh0KEkvc2FtcGxlUmF0ZSwxKTt0aGlzLnBoYXNlW2xdPXRoaXMucGhhc2VbbF0/P01hdGgucmFuZG9tKCk7Y29uc3QgUD1wdC5zYXdibGVwKHRoaXMucGhhc2VbbF0sdik7clswXVtpXT1yWzBdW2ldK1AqZCxyWzFdW2ldPXJbMV1baV0rUCpiLHRoaXMucGhhc2VbbF09RnQodGhpcy5waGFzZVtsXSt2KX19cmV0dXJuITB9fXJlZ2lzdGVyUHJvY2Vzc29yKCJzdXBlcnNhdy1vc2NpbGxhdG9yIixyZSk7Y29uc3QgbmU9MjA0ODtmdW5jdGlvbiBpZShuKXtsZXQgdD1uZXcgRmxvYXQzMkFycmF5KG4pO2Zvcih2YXIgZT0wO2U8bjtlKyspdFtlXT0uNSooMS1NYXRoLmNvcygyKk1hdGguUEkqZS9uKSk7cmV0dXJuIHR9Y2xhc3Mgb2UgZXh0ZW5kcyBMe3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6InBpdGNoRmFjdG9yIixkZWZhdWx0VmFsdWU6MX1dfWNvbnN0cnVjdG9yKHQpe3QucHJvY2Vzc29yT3B0aW9ucz17YmxvY2tTaXplOm5lfSxzdXBlcih0KSx0aGlzLmZmdFNpemU9dGhpcy5ibG9ja1NpemUsdGhpcy50aW1lQ3Vyc29yPTAsdGhpcy5oYW5uV2luZG93PWllKHRoaXMuYmxvY2tTaXplKSx0aGlzLmZmdD1uZXcga3QodGhpcy5mZnRTaXplKSx0aGlzLmZyZXFDb21wbGV4QnVmZmVyPXRoaXMuZmZ0LmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkPXRoaXMuZmZ0LmNyZWF0ZUNvbXBsZXhBcnJheSgpLHRoaXMudGltZUNvbXBsZXhCdWZmZXI9dGhpcy5mZnQuY3JlYXRlQ29tcGxleEFycmF5KCksdGhpcy5tYWduaXR1ZGVzPW5ldyBGbG9hdDMyQXJyYXkodGhpcy5mZnRTaXplLzIrMSksdGhpcy5wZWFrSW5kZXhlcz1uZXcgSW50MzJBcnJheSh0aGlzLm1hZ25pdHVkZXMubGVuZ3RoKSx0aGlzLm5iUGVha3M9MH1wcm9jZXNzT0xBKHQsZSxzKXtsZXQgcj1zLnBpdGNoRmFjdG9yW3MucGl0Y2hGYWN0b3IubGVuZ3RoLTFdO3I8MCYmKHI9ciouMjUpLHI9TWF0aC5tYXgoMCxyKzEpO2Zvcih2YXIgaT0wO2k8dGhpcy5uYklucHV0cztpKyspZm9yKHZhciBvPTA7bzx0W2ldLmxlbmd0aDtvKyspe3ZhciBhPXRbaV1bb10sdT1lW2ldW29dO3RoaXMuYXBwbHlIYW5uV2luZG93KGEpLHRoaXMuZmZ0LnJlYWxUcmFuc2Zvcm0odGhpcy5mcmVxQ29tcGxleEJ1ZmZlcixhKSx0aGlzLmNvbXB1dGVNYWduaXR1ZGVzKCksdGhpcy5maW5kUGVha3MoKSx0aGlzLnNoaWZ0UGVha3MociksdGhpcy5mZnQuY29tcGxldGVTcGVjdHJ1bSh0aGlzLmZyZXFDb21wbGV4QnVmZmVyU2hpZnRlZCksdGhpcy5mZnQuaW52ZXJzZVRyYW5zZm9ybSh0aGlzLnRpbWVDb21wbGV4QnVmZmVyLHRoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkKSx0aGlzLmZmdC5mcm9tQ29tcGxleEFycmF5KHRoaXMudGltZUNvbXBsZXhCdWZmZXIsdSksdGhpcy5hcHBseUhhbm5XaW5kb3codSl9dGhpcy50aW1lQ3Vyc29yKz10aGlzLmhvcFNpemV9YXBwbHlIYW5uV2luZG93KHQpe2Zvcih2YXIgZT0wO2U8dGhpcy5ibG9ja1NpemU7ZSsrKXRbZV09dFtlXSp0aGlzLmhhbm5XaW5kb3dbZV0qMS42Mn1jb21wdXRlTWFnbml0dWRlcygpe2Zvcih2YXIgdD0wLGU9MDt0PHRoaXMubWFnbml0dWRlcy5sZW5ndGg7KXtsZXQgcz10aGlzLmZyZXFDb21wbGV4QnVmZmVyW2VdLHI9dGhpcy5mcmVxQ29tcGxleEJ1ZmZlcltlKzFdO3RoaXMubWFnbml0dWRlc1t0XT1zKioyK3IqKjIsdCs9MSxlKz0yfX1maW5kUGVha3MoKXt0aGlzLm5iUGVha3M9MDt2YXIgdD0yO2xldCBlPXRoaXMubWFnbml0dWRlcy5sZW5ndGgtMjtmb3IoO3Q8ZTspe2xldCBzPXRoaXMubWFnbml0dWRlc1t0XTtpZih0aGlzLm1hZ25pdHVkZXNbdC0xXT49c3x8dGhpcy5tYWduaXR1ZGVzW3QtMl0+PXMpe3QrKztjb250aW51ZX1pZih0aGlzLm1hZ25pdHVkZXNbdCsxXT49c3x8dGhpcy5tYWduaXR1ZGVzW3QrMl0+PXMpe3QrKztjb250aW51ZX10aGlzLnBlYWtJbmRleGVzW3RoaXMubmJQZWFrc109dCx0aGlzLm5iUGVha3MrKyx0Kz0yfX1zaGlmdFBlYWtzKHQpe3RoaXMuZnJlcUNvbXBsZXhCdWZmZXJTaGlmdGVkLmZpbGwoMCk7Zm9yKHZhciBlPTA7ZTx0aGlzLm5iUGVha3M7ZSsrKXtsZXQgbz10aGlzLnBlYWtJbmRleGVzW2VdLGE9TWF0aC5yb3VuZChvKnQpO2lmKGE+dGhpcy5tYWduaXR1ZGVzLmxlbmd0aClicmVhazt2YXIgcz0wLHI9dGhpcy5mZnRTaXplO2lmKGU+MCl7bGV0IGg9dGhpcy5wZWFrSW5kZXhlc1tlLTFdO3M9by1NYXRoLmZsb29yKChvLWgpLzIpfWlmKGU8dGhpcy5uYlBlYWtzLTEpe2xldCBoPXRoaXMucGVha0luZGV4ZXNbZSsxXTtyPW8rTWF0aC5jZWlsKChoLW8pLzIpfWxldCB1PXMtbyxjPXItbztmb3IodmFyIGk9dTtpPGM7aSsrKXtsZXQgaD1vK2ksZj1hK2k7aWYoZj49dGhpcy5tYWduaXR1ZGVzLmxlbmd0aClicmVhaztsZXQgcD0yKk1hdGguUEkqKGYtaCkvdGhpcy5mZnRTaXplLGw9TWF0aC5jb3MocCp0aGlzLnRpbWVDdXJzb3IpLG09TWF0aC5zaW4ocCp0aGlzLnRpbWVDdXJzb3IpLGQ9aCoyLGI9ZCsxLEk9dGhpcy5mcmVxQ29tcGxleEJ1ZmZlcltkXSx2PXRoaXMuZnJlcUNvbXBsZXhCdWZmZXJbYl0sUD1JKmwtdiptLHc9SSptK3YqbCxUPWYqMixCPVQrMTt0aGlzLmZyZXFDb21wbGV4QnVmZmVyU2hpZnRlZFtUXSs9UCx0aGlzLmZyZXFDb21wbGV4QnVmZmVyU2hpZnRlZFtCXSs9d319fX1yZWdpc3RlclByb2Nlc3NvcigicGhhc2Utdm9jb2Rlci1wcm9jZXNzb3IiLG9lKTtjbGFzcyBhZSBleHRlbmRzIEF1ZGlvV29ya2xldFByb2Nlc3Nvcntjb25zdHJ1Y3Rvcigpe3N1cGVyKCksdGhpcy5waT1kdCx0aGlzLnBoaT0tdGhpcy5waSx0aGlzLlkwPTAsdGhpcy5ZMT0wLHRoaXMuUFc9dGhpcy5waSx0aGlzLkI9Mi4zLHRoaXMuZHBoaWY9MCx0aGlzLmVudmY9MH1zdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH0se25hbWU6ImVuZCIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOjQ0MCxtaW46TnVtYmVyLkVQU0lMT059LHtuYW1lOiJkZXR1bmUiLGRlZmF1bHRWYWx1ZTowLG1pbjpOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX0se25hbWU6InB1bHNld2lkdGgiLGRlZmF1bHRWYWx1ZToxLG1pbjowLG1heDpOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFl9XX1wcm9jZXNzKHQsZSxzKXtpZih0aGlzLmRpc2Nvbm5lY3RlZClyZXR1cm4hMTtpZihjdXJyZW50VGltZTw9cy5iZWdpblswXSlyZXR1cm4hMDtpZihjdXJyZW50VGltZT49cy5lbmRbMF0pcmV0dXJuITE7Y29uc3Qgcj1lWzBdO2xldCBpPTEsbztmb3IobGV0IGE9MDthPChyWzBdLmxlbmd0aD8/MCk7YSsrKXtjb25zdCB1PSgxLU0oUShhLHMucHVsc2V3aWR0aCksLS45OSwuOTkpKSp0aGlzLnBpLGM9UShhLHMuZGV0dW5lKSxoPUgoUShhLHMuZnJlcXVlbmN5KSxjLzEwMCk7bz1oKih0aGlzLnBpLyhzYW1wbGVSYXRlKi41KSksdGhpcy5kcGhpZis9LjEqKG8tdGhpcy5kcGhpZiksaSo9Ljk5OTgsdGhpcy5lbnZmKz0uMSooaS10aGlzLmVudmYpLHRoaXMuQj0yLjMqKDEtMWUtNCpoKSx0aGlzLkI8MCYmKHRoaXMuQj0wKSx0aGlzLnBoaSs9dGhpcy5kcGhpZix0aGlzLnBoaT49dGhpcy5waSYmKHRoaXMucGhpLT0yKnRoaXMucGkpO2xldCBmPU1hdGguY29zKHRoaXMucGhpK3RoaXMuQip0aGlzLlkwKTt0aGlzLlkwPS41KihmK3RoaXMuWTApO2xldCBwPU1hdGguY29zKHRoaXMucGhpK3RoaXMuQip0aGlzLlkxK3UpO3RoaXMuWTE9LjUqKHArdGhpcy5ZMSk7Zm9yKGxldCBsPTA7bDxyLmxlbmd0aDtsKyspcltsXVthXT0uMTUqKGYtcCkqdGhpcy5lbnZmfXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigicHVsc2Utb3NjaWxsYXRvciIsYWUpO2NvbnN0IG10PXtiaXRDOmZ1bmN0aW9uKG4sdCxlKXtyZXR1cm4gbiZ0P2U6MH0sYnI6ZnVuY3Rpb24obix0PTgpe2lmKHQ+MzIpdGhyb3cgbmV3IEVycm9yKCJicigpIFNpemUgY2Fubm90IGJlIGdyZWF0ZXIgdGhhbiAzMiIpO3tsZXQgZT0wO2ZvcihsZXQgcz0wO3M8dC0wO3MrKyllKz1tdC5iaXRDKG4sMioqcywyKioodC0ocysxKSkpO3JldHVybiBlfX0sc2luZjpmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5zaW4obi8oMTI4L01hdGguUEkpKX0sY29zZjpmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC5jb3Mobi8oMTI4L01hdGguUEkpKX0sdGFuZjpmdW5jdGlvbihuKXtyZXR1cm4gTWF0aC50YW4obi8oMTI4L01hdGguUEkpKX0scmVnRzpmdW5jdGlvbihuLHQpe3JldHVybiB0LnRlc3Qobi50b1N0cmluZygyKSl9fTtsZXQgSixodDtmdW5jdGlvbiBjZShuKXtpZigoSnx8aHQpPT1udWxsKXtKPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE1hdGgpLGh0PUoubWFwKHM9Pk1hdGhbc10pO2NvbnN0IHQ9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobXQpLGU9dC5tYXAocz0+bXRbc10pO0oucHVzaCgiaW50Iiwid2luZG93IiwuLi50KSxodC5wdXNoKE1hdGguZmxvb3IsZ2xvYmFsVGhpcywuLi5lKX1yZXR1cm4gbmV3IEZ1bmN0aW9uKC4uLkosInQiLGByZXR1cm4gMCwKJHtufHwwfTtgKS5iaW5kKGdsb2JhbFRoaXMsLi4uaHQpfWNsYXNzIHVlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye2NvbnN0cnVjdG9yKCl7c3VwZXIoKSx0aGlzLnBvcnQub25tZXNzYWdlPXQ9PntsZXR7Y29kZVRleHQ6ZX09dC5kYXRhO2NvbnN0e2J5dGVCZWF0U3RhcnRUaW1lOnN9PXQuZGF0YTtzIT1udWxsJiYodGhpcy50PTAsdGhpcy5pbml0aWFsT2Zmc2V0PU1hdGguZmxvb3IocykpLGU9ZS50cmltKCkucmVwbGFjZSgvXmV2YWxcKHVuZXNjYXBlXChlc2NhcGUoPzpgfFwoJ3xcKCJ8XChgKSguKj8pKD86YHwnXCl8IlwpfGBcKSkucmVwbGFjZVwoXC91XChcLlwuXClcL2csWyInYF1cJDElWyInYF1cKVwpXCkkLywocixpKT0+dW5lc2NhcGUoZXNjYXBlKGkpLnJlcGxhY2UoL3UoLi4pL2csIiQxJSIpKSksdGhpcy5mdW5jPWNlKGUpfSx0aGlzLmluaXRpYWxPZmZzZXQ9bnVsbCx0aGlzLnQ9bnVsbCx0aGlzLmZ1bmM9bnVsbH1zdGF0aWMgZ2V0IHBhcmFtZXRlckRlc2NyaXB0b3JzKCl7cmV0dXJuW3tuYW1lOiJiZWdpbiIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH0se25hbWU6ImZyZXF1ZW5jeSIsZGVmYXVsdFZhbHVlOjQ0MCxtaW46TnVtYmVyLkVQU0lMT059LHtuYW1lOiJkZXR1bmUiLGRlZmF1bHRWYWx1ZTowLG1pbjpOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWX0se25hbWU6ImVuZCIsZGVmYXVsdFZhbHVlOjAsbWF4Ok51bWJlci5QT1NJVElWRV9JTkZJTklUWSxtaW46MH1dfXByb2Nlc3ModCxlLHMpe2lmKHRoaXMuZGlzY29ubmVjdGVkKXJldHVybiExO2lmKGN1cnJlbnRUaW1lPD1zLmJlZ2luWzBdKXJldHVybiEwO2lmKGN1cnJlbnRUaW1lPj1zLmVuZFswXSlyZXR1cm4hMTt0aGlzLnQ9PW51bGwmJih0aGlzLnQ9cy5iZWdpblswXSpzYW1wbGVSYXRlKTtjb25zdCByPWVbMF07Zm9yKGxldCBpPTA7aTxyWzBdLmxlbmd0aDtpKyspe2NvbnN0IG89UShpLHMuZGV0dW5lKSxhPUgoUShpLHMuZnJlcXVlbmN5KSxvLzEwMCk7bGV0IHU9dGhpcy50LyhzYW1wbGVSYXRlLzI1NikqYSt0aGlzLmluaXRpYWxPZmZzZXQ7Y29uc3QgZj0oKHRoaXMuZnVuYyh1KSYyNTUpLzEyNy41LTEpKi4yO2ZvcihsZXQgcD0wO3A8ci5sZW5ndGg7cCsrKXJbcF1baV09TShmLC0uNCwuNCk7dGhpcy50PXRoaXMudCsxfXJldHVybiEwfX1yZWdpc3RlclByb2Nlc3NvcigiYnl0ZS1iZWF0LXByb2Nlc3NvciIsdWUpO2NvbnN0IGc9T2JqZWN0LmZyZWV6ZSh7Tk9ORTowLEFTWU06MSxNSVJST1I6MixCRU5EUDozLEJFTkRNOjQsQkVORE1QOjUsU1lOQzo2LFFVQU5UOjcsRk9MRDo4LFBXTTo5LE9SQklUOjEwLFNQSU46MTEsQ0hBT1M6MTIsUFJJTUVTOjEzLEJJTkFSWToxNCxCUk9XTklBTjoxNSxSRUNJUFJPQ0FMOjE2LFdPUk1IT0xFOjE3LExPR0lTVElDOjE4LFNJR01PSUQ6MTksRlJBQ1RBTDoyMCxGTElQOjIxfSk7ZnVuY3Rpb24gaGUobil7cmV0dXJuIG49bisyMTI3OTEyMjE0KyhuPDwxMiksbj1uXjMzNDUwNzI3MDBebj4+PjE5LG49biszNzQ3NjEzOTMrKG48PDUpLG49biszNTUwNjM1MTE2Xm48PDksbj1uKzQyNTE5OTM3OTcrKG48PDMpLG49bl4zMDQyNTk0NTY5Xm4+Pj4xNixuPj4+MH1jb25zdCBSdD1uPT4oaGUobik+Pj44KS8xNjc3NzIxNjtmdW5jdGlvbiBsZShuLHQpe2xldCBlPTA7Zm9yKGxldCBzPTA7czx0O3MrKyllPWU8PDF8biYxLG4+Pj49MTtyZXR1cm4gZX1mdW5jdGlvbiBmZShuKXtjb25zdCB0PU1hdGguZmxvb3IobiksZT1uLXQscz1SdCh0KSxyPVJ0KHQrMSk7cmV0dXJuIHMrKHItcykqZX1mdW5jdGlvbiBwZShuLHQ9NCl7bGV0IGU9LjUscz0wLHI9MCxpPTE7Zm9yKGxldCBvPTA7bzx0O28rKylzKz1lKmZlKG4qaSkscis9ZSxlKj0uNSxpKj0yO3JldHVybiBzL3IqMi0xfWNvbnN0IHZ0PXt9O2NsYXNzIGRlIGV4dGVuZHMgQXVkaW9Xb3JrbGV0UHJvY2Vzc29ye3N0YXRpYyBnZXQgcGFyYW1ldGVyRGVzY3JpcHRvcnMoKXtyZXR1cm5be25hbWU6ImJlZ2luIixkZWZhdWx0VmFsdWU6MCxtaW46MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSx7bmFtZToiZW5kIixkZWZhdWx0VmFsdWU6MCxtaW46MCxtYXg6TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZfSx7bmFtZToiZnJlcXVlbmN5IixkZWZhdWx0VmFsdWU6NDQwLG1pbjpOdW1iZXIuRVBTSUxPTn0se25hbWU6ImRldHVuZSIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJmcmVxc3ByZWFkIixkZWZhdWx0VmFsdWU6LjE4LG1pbjowfSx7bmFtZToicG9zaXRpb24iLGRlZmF1bHRWYWx1ZTowLG1pbjowLG1heDoxfSx7bmFtZToid2FycCIsZGVmYXVsdFZhbHVlOjAsbWluOjAsbWF4OjF9LHtuYW1lOiJ3YXJwTW9kZSIsZGVmYXVsdFZhbHVlOjB9LHtuYW1lOiJ2b2ljZXMiLGRlZmF1bHRWYWx1ZToxLG1pbjoxfSx7bmFtZToicGFuc3ByZWFkIixkZWZhdWx0VmFsdWU6LjcsbWluOjAsbWF4OjF9LHtuYW1lOiJwaGFzZXJhbmQiLGRlZmF1bHRWYWx1ZTowLG1pbjowLG1heDoxfV19Y29uc3RydWN0b3IodCl7c3VwZXIodCksdGhpcy5mcmFtZUxlbj0wLHRoaXMubnVtRnJhbWVzPTAsdGhpcy5waGFzZT1bXSx0aGlzLmludlNSPTEvc2FtcGxlUmF0ZSx0aGlzLnBvcnQub25tZXNzYWdlPWU9Pntjb25zdHt0eXBlOnMscGF5bG9hZDpyfT1lLmRhdGF8fHt9O2lmKHM9PT0idGFibGUiKXtjb25zdCBpPXIua2V5O2lmKHRoaXMuZnJhbWVMZW49ci5mcmFtZUxlbiwhdnRbaV0pe2NvbnN0IG89W3IuZnJhbWVzXTtsZXQgYT1vWzBdO2ZvcihsZXQgdT0xO3U8MTt1Kyspe2NvbnN0IGM9YS5sZW5ndGg+PjEsaD1hLm1hcChmPT57Y29uc3QgcD1uZXcgRmxvYXQzMkFycmF5KGMpO2ZvcihsZXQgbD0wO2w8YztsKyspcFtsXT0oZlsyKmxdK2ZbMipsKzFdKS8yO3JldHVybiBwfSk7aWYoby5wdXNoKGgpLGE9aCxjPD0zMilicmVha312dFtpXT1vfXRoaXMudGFibGVzPXZ0W2ldLHRoaXMubnVtRnJhbWVzPXRoaXMudGFibGVzWzBdLmxlbmd0aH19fV9taXJyb3IodCl7cmV0dXJuIDEtTWF0aC5hYnMoMip0LTEpfV90b0JpdHModCxlPTIscz0xMil7Y29uc3Qgcj1zKyhlLXMpKnQ7cmV0dXJue2I6cixuOk1hdGgucm91bmQoTWF0aC5wb3coMixyKSl9fV93YXJwUGhhc2UodCxlLHMpe3N3aXRjaChzKXtjYXNlIGcuTk9ORTpyZXR1cm4gdDtjYXNlIGcuQVNZTTp7Y29uc3Qgcj0uMDErLjk5KmU7cmV0dXJuIHQ8cj8uNSp0L3I6LjUrLjUqKHQtcikvKDEtcil9Y2FzZSBnLk1JUlJPUjpyZXR1cm4gdGhpcy5fbWlycm9yKHRoaXMuX3dhcnBQaGFzZSh0LGUsZy5BU1lNKSk7Y2FzZSBnLkJFTkRQOnJldHVybiBNYXRoLnBvdyh0LDErMyplKTtjYXNlIGcuQkVORE06cmV0dXJuIE1hdGgucG93KHQsMS8oMSszKmUpKTtjYXNlIGcuQkVORE1QOnJldHVybiBlPC41P3RoaXMuX3dhcnBQaGFzZSh0LDEtMiplLDMpOnRoaXMuX3dhcnBQaGFzZSh0LDIqZS0xLDIpO2Nhc2UgZy5TWU5DOntjb25zdCByPU1hdGgucG93KDE2LGUqZSk7cmV0dXJuIHQqciUxfWNhc2UgZy5RVUFOVDp7Y29uc3R7bjpyfT10aGlzLl90b0JpdHMoZSk7cmV0dXJuIGZ0KHQqcikvcn1jYXNlIGcuRk9MRDp7Y29uc3QgaT0xK01hdGgubWF4KDEsTWF0aC5yb3VuZCg3KmUpKTtyZXR1cm4gTWF0aC5hYnMoVyhpKnQpLS41KSoyfWNhc2UgZy5QV006e2NvbnN0IHI9TSguNSsuNDkqKDIqZS0xKSwwLDEpO3JldHVybiB0PHI/dC9yKi41Oi41Kyh0LXIpLygxLXIpKi41fWNhc2UgZy5PUkJJVDp7Y29uc3Qgcj0uNSplO3JldHVybiBXKHQrcipNYXRoLnNpbigyKk1hdGguUEkqMyp0KSl9Y2FzZSBnLlNQSU46e2NvbnN0IHI9LjUqZSx7bjppfT10aGlzLl90b0JpdHMoZSwxLDYpO3JldHVybiBXKHQrcipNYXRoLnNpbigyKk1hdGguUEkqaSp0KSl9Y2FzZSBnLkNIQU9TOntjb25zdCBpPSgzLjcrLjMqZSkqdCooMS10KTtyZXR1cm4gTSgoMS1lKSp0K2UqaSwwLDEpfWNhc2UgZy5QUklNRVM6e2NvbnN0IHI9bz0+e2lmKG88MilyZXR1cm4hMTtpZihvJTI9PT0wKXJldHVybiBvPT09Mjtmb3IobGV0IGE9MzthKmE8PW87YSs9MilpZihvJWE9PT0wKXJldHVybiExO3JldHVybiEwfTtsZXR7bjppfT10aGlzLl90b0JpdHMoZSwzKTtmb3IoOyFyKGkpOylpKys7cmV0dXJuIGZ0KHQqaSkvaX1jYXNlIGcuQklOQVJZOntsZXR7YjpyfT10aGlzLl90b0JpdHMoZSwzKTtyPU1hdGgucm91bmQocik7Y29uc3QgaT0xPDxyLG89ZnQodCppKTtyZXR1cm4gbGUobyxyKS9pfWNhc2UgZy5NT0RVTEFSOntjb25zdHtuOnJ9PXRoaXMuX3RvQml0cyhlKSxpPS41KmUsbz1XKHQqcikvcjtyZXR1cm4gVyh0K2kqbyl9Y2FzZSBnLkJST1dOSUFOOntjb25zdCByPS4yNSplKnBlKDY0KnQsNCk7cmV0dXJuIFcodCtyKX1jYXNlIGcuUkVDSVBST0NBTDp7Y29uc3Qgcj0yKzQqZSxpPXQqcixvPXQrKDEtdCkqcixhPW8+MWUtMTI/aS9vOjA7cmV0dXJuIE0oYSwwLDEpfWNhc2UgZy5XT1JNSE9MRTp7Y29uc3Qgcj1NKC44KmUsMCwxKSxpPS41KigxLXIpLG89LjUqKDErcik7cmV0dXJuIHQ8aT90L2kqLjU6dD5vPy41KigxKyh0LW8pLygxLW8pKTouNX1jYXNlIGcuTE9HSVNUSUM6e2xldCByPXQ7Y29uc3QgaT0zLjYrLjQqZSxvPTErTWF0aC5yb3VuZCgyKmUpO2ZvcihsZXQgYT0wO2E8bzthKyspcj1pKnIqKDEtcik7cmV0dXJuIE0ociwwLDEpfWNhc2UgZy5TSUdNT0lEOntjb25zdCByPTErMTAqZSxpPXQtLjUsbz0xLygxK01hdGguZXhwKC1yKmkpKSxhPTEvKDErTWF0aC5leHAoLjUqcikpLHU9MS8oMStNYXRoLmV4cCgtLjUqcikpO3JldHVybihvLWEpLyh1LWEpfWNhc2UgZy5GUkFDVEFMOntjb25zdCByPS41Kk1hdGguc2luKDIqTWF0aC5QSSp0KSplO3JldHVybiBXKHQrcil9Y2FzZSBnLkZMSVA6cmV0dXJuIHQ7ZGVmYXVsdDpyZXR1cm4gdH19X3NhbXBsZUZyYW1lKHQsZSl7Y29uc3Qgcz10Lmxlbmd0aCxyPWUqcztsZXQgaT1yfDA7aT49cyYmKGk9MCk7Y29uc3Qgbz1yLWksYT10W2ldO2xldCB1PWkrMTt1Pj1zJiYodT0wKTtjb25zdCBjPXRbdV07cmV0dXJuIGErKGMtYSkqb31fY2hvb3NlTWlwKHQpe3ZhciByO2NvbnN0IGU9TSh0LDFlLTYsNjQpO2xldCBzPTA7Zm9yKDtzKzE8KCgocj10aGlzLnRhYmxlcyk9PW51bGw/dm9pZCAwOnIubGVuZ3RoKXx8MSkmJmU8dGhpcy50YWJsZXNbc11bMF0ubGVuZ3RoLzg7KXMrKztyZXR1cm4gc31wcm9jZXNzKHQsZSxzKXtpZihjdXJyZW50VGltZT49cy5lbmRbMF0pcmV0dXJuITE7aWYoY3VycmVudFRpbWU8PXMuYmVnaW5bMF0pcmV0dXJuITA7Y29uc3Qgcj1lWzBdWzBdLGk9ZVswXVsxXXx8ZVswXVswXTtpZighdGhpcy50YWJsZXMpcmV0dXJuIHIuZmlsbCgwKSxpIT09ciYmaS5zZXQociksITA7Zm9yKGxldCBvPTA7bzxyLmxlbmd0aDtvKyspe2NvbnN0IGE9UyhzLmRldHVuZSxvKSx1PVMocy5mcmVxc3ByZWFkLG8pLGg9TShTKHMucG9zaXRpb24sbyksMCwxKSoodGhpcy5udW1GcmFtZXMtMSksZj1ofDAscD1oLWYsbD1NKFMocy53YXJwLG8pLDAsMSksbT1TKHMud2FycE1vZGUsbyksZD1TKHMudm9pY2VzLG8pLGI9TShTKHMucGhhc2VyYW5kLG8pLDAsMSksST1kPjE/TShTKHMucGFuc3ByZWFkLG8pLDAsMSk6MCx2PU1hdGguc3FydCguNS0uNSpJKSxQPU1hdGguc3FydCguNSsuNSpJKTtsZXQgdz1TKHMuZnJlcXVlbmN5LG8pO3c9SCh3LGEvMTAwKTtjb25zdCBUPTEvTWF0aC5zcXJ0KGQpO2ZvcihsZXQgQj0wO0I8ZDtCKyspe2NvbnN0IEE9KEImMSk9PTE7bGV0IHk9dixPPVA7QSYmKHk9UCxPPXYpO2NvbnN0IHg9SCh3LE50KGQsdSxCKSkqdGhpcy5pbnZTUixFPXRoaXMuX2Nob29zZU1pcCh4KSxOPXRoaXMudGFibGVzW0VdO3RoaXMucGhhc2VbQl09dGhpcy5waGFzZVtCXT8/TWF0aC5yYW5kb20oKSpiO2NvbnN0IEY9dGhpcy5fd2FycFBoYXNlKHRoaXMucGhhc2VbQl0sbCxtKSxWPXRoaXMuX3NhbXBsZUZyYW1lKE5bZl0sRiksaz10aGlzLl9zYW1wbGVGcmFtZShOW01hdGgubWluKHRoaXMubnVtRnJhbWVzLTEsZisxKV0sRik7bGV0IFI9Visoay1WKSpwO209PT1nLkZMSVAmJnRoaXMucGhhc2VbQl08bCYmKFI9LVIpLHJbb10rPVIqeSpULGlbb10rPVIqTypULHRoaXMucGhhc2VbQl09RnQodGhpcy5waGFzZVtCXSt4KX19cmV0dXJuITB9fXJldHVybiByZWdpc3RlclByb2Nlc3Nvcigid2F2ZXRhYmxlLW9zY2lsbGF0b3ItcHJvY2Vzc29yIixkZSksQy5XYXJwTW9kZT1nLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6Ik1vZHVsZSJ9KSxDfSh7fSk7Cg==";
let Lt;
const Rn = () => (Lt = new AudioContext(), Lt), x$1 = () => Lt || Rn();
function Co() {
  return x$1().currentTime;
}
let Ct = {};
function Le(t2, e) {
  const n = x$1();
  if (Ct[t2])
    return Ct[t2];
  const o = 2 * n.sampleRate, s = n.createBuffer(1, o, n.sampleRate), c = s.getChannelData(0);
  let a = 0, d2, l2, i2, r, u, p, h2;
  d2 = l2 = i2 = r = u = p = h2 = 0;
  for (let m2 = 0; m2 < o; m2++)
    if (t2 === "white")
      c[m2] = Math.random() * 2 - 1;
    else if (t2 === "brown") {
      let b2 = Math.random() * 2 - 1;
      c[m2] = (a + 0.02 * b2) / 1.02, a = c[m2];
    } else if (t2 === "pink") {
      let b2 = Math.random() * 2 - 1;
      d2 = 0.99886 * d2 + b2 * 0.0555179, l2 = 0.99332 * l2 + b2 * 0.0750759, i2 = 0.969 * i2 + b2 * 0.153852, r = 0.8665 * r + b2 * 0.3104856, u = 0.55 * u + b2 * 0.5329522, p = -0.7616 * p - b2 * 0.016898, c[m2] = d2 + l2 + i2 + r + u + p + h2 + b2 * 0.5362, c[m2] *= 0.11, h2 = b2 * 0.115926;
    } else if (t2 === "crackle") {
      const b2 = e * 0.01;
      Math.random() < b2 ? c[m2] = Math.random() * 2 - 1 : c[m2] = 0;
    }
  return t2 !== "crackle" && (Ct[t2] = s), s;
}
function Jt(t2 = "white", e, n = 0.02) {
  const s = x$1().createBufferSource();
  return s.buffer = Le(t2, n), s.loop = true, s.start(e), {
    node: s,
    stop: (c) => s.stop(c)
  };
}
function Sn(t2, e, n) {
  const o = Jt("pink", n);
  return {
    node: Yn(t2, o.node, e),
    stop: (c) => o == null ? void 0 : o.stop(c)
  };
}
const Ke = ["pink", "white", "brown", "crackle"];
function C$1(t2) {
  const e = x$1().createGain();
  return e.gain.value = t2, e;
}
function Ut(t2, e, n) {
  const o = C$1(n);
  return t2.connect(o), o.connect(e), o;
}
const me = (t2, e, n, o) => o - n === 0 ? 0 : (e - t2) / (o - n);
function I(t2, e, n, o) {
  const s = new AudioWorkletNode(t2, e, o);
  return Object.entries(n).forEach(([c, a]) => {
    a !== void 0 && (s.parameters.get(c).value = a);
  }), s;
}
const k$1 = (t2, e, n, o, s, c, a, d2, l2, i2 = "exponential") => {
  e = O(e), n = O(n), o = O(o), s = O(s);
  const r = i2 === "exponential" ? "exponentialRampToValueAtTime" : "linearRampToValueAtTime";
  i2 === "exponential" && (c = c === 0 ? 1e-3 : c, a = a === 0 ? 1e-3 : a);
  const u = a - c, p = a, h2 = c + o * u, m2 = l2 - d2, b2 = (X2) => {
    let y;
    if (e > X2) {
      let Z2 = me(c, p, 0, e);
      y = X2 * Z2 + (c > p ? c : 0);
    } else
      y = (X2 - e) * me(p, h2, 0, n) + p;
    return i2 === "exponential" && (y = y || 1e-3), y;
  };
  t2.setValueAtTime(c, d2), e > m2 ? t2[r](b2(m2), l2) : e + n > m2 ? (t2[r](b2(e), d2 + e), t2[r](b2(m2), l2)) : (t2[r](b2(e), d2 + e), t2[r](b2(e + n), d2 + e + n), t2.setValueAtTime(h2, l2)), t2[r](c, l2 + s);
};
function Nn(t2) {
  return typeof t2 == "number" ? t2 % 5 : { tri: 0, triangle: 0, sine: 1, ramp: 2, saw: 3, square: 4 }[t2] ?? 0;
}
function Tt(t2, e, n, o = {}) {
  const { shape: s = 0, ...c } = o, { dcoffset: a = -0.5, depth: d2 = 1 } = o, l2 = {
    frequency: 1,
    depth: d2,
    skew: 0.5,
    phaseoffset: 0,
    time: e,
    begin: e,
    end: n,
    shape: Nn(s),
    dcoffset: a,
    min: a * d2,
    max: a * d2 + d2,
    curve: 1,
    ...c
  };
  return I(t2, "lfo-processor", l2);
}
function wn(t2, e, n, o, s, c) {
  const a = {
    threshold: e ?? -3,
    ratio: n ?? 10,
    knee: o ?? 10,
    attack: s ?? 5e-3,
    release: c ?? 0.05
  };
  return new DynamicsCompressorNode(t2, a);
}
const Q$2 = (t2, e = "linear", n) => {
  const [a, d2, l2, i2] = t2;
  if (a == null && d2 == null && l2 == null && i2 == null)
    return n ?? [1e-3, 1e-3, 1, 0.01];
  const r = l2 ?? (a != null && d2 == null || a == null && d2 == null ? 1 : 1e-3);
  return [Math.max(a ?? 0, 1e-3), Math.max(d2 ?? 0, 1e-3), Math.min(r, 1), Math.max(i2 ?? 0, 0.01)];
};
function be(t2, e, n, o, s, c) {
  let { amount: a, offset: d2, defaultAmount: l2 = 1, curve: i2 = "linear", values: r, holdEnd: u, defaultValues: p } = s;
  a == null && (a = r.some((M2) => M2 != null) ? l2 : 0);
  const h2 = d2 ?? 0, m2 = a + h2;
  if (Math.abs(m2 - h2)) {
    const [G2, M2, L3, z2] = Q$2(r, i2, p);
    k$1(e, G2, M2, L3, z2, h2, m2, n, u, i2);
  }
  let X2, { defaultDepth: y = 1, depth: Z2, dcoffset: W2, ...V2 } = c;
  return Z2 == null && (Z2 = Object.values(V2).some((M2) => M2 != null) ? y : 0), Z2 && (X2 = Tt(t2, n, o, {
    depth: Z2,
    dcoffset: W2,
    ...V2
  }), X2.connect(e)), { lfo: X2, disconnect: () => X2 == null ? void 0 : X2.disconnect() };
}
function Ht(t2, e, n, o, s, c, a, d2, l2, i2, r, u, p, h2) {
  const m2 = "exponential", [b2, X2, y, Z2] = Q$2([s, c, a, d2], m2, [5e-3, 0.14, 0, 0.1]);
  let W2, V2;
  if (p === "ladder" ? (W2 = I(t2, "ladder-processor", { frequency: n, q: o, drive: h2 }), V2 = W2.parameters.get("frequency")) : (W2 = t2.createBiquadFilter(), W2.type = e, W2.Q.value = o, W2.frequency.value = n, V2 = W2.frequency), (s ?? c ?? a ?? d2 ?? l2) !== void 0) {
    l2 = O(l2, 1, true), u = O(u, 0, true);
    const M2 = Math.abs(l2), L3 = M2 * u;
    let z2 = D$1(2 ** -L3 * n, 0, 2e4), S2 = D$1(2 ** (M2 - L3) * n, 0, 2e4);
    return l2 < 0 && ([z2, S2] = [S2, z2]), k$1(V2, b2, X2, y, Z2, z2, S2, i2, r, m2), W2;
  }
  return W2;
}
let Ze = (t2) => t2 < 0.5 ? 1 : 1 - (t2 - 0.5) / 0.5;
function Yn(t2, e, n = 0) {
  const o = x$1();
  if (!n)
    return t2;
  let s = o.createGain(), c = o.createGain();
  t2.connect(s), e.connect(c), s.gain.value = Ze(n), c.gain.value = Ze(1 - n);
  let a = o.createGain();
  return s.connect(a), c.connect(a), a;
}
let Fn = ["linear", "exponential"];
function ht(t2, e, n, o) {
  if ((e.pattack ?? e.pdecay ?? e.psustain ?? e.prelease ?? e.penv) === void 0)
    return;
  const c = O(e.penv, 1, true), a = Fn[e.pcurve ?? 0];
  let [d2, l2, i2, r] = Q$2(
    [e.pattack, e.pdecay, e.psustain, e.prelease],
    a,
    [0.2, 1e-3, 1, 1e-3]
  ), u = e.panchor ?? i2;
  const p = c * 100, h2 = 0 - p * u, m2 = p - p * u;
  k$1(t2, d2, l2, i2, r, h2, m2, n, o, a);
}
function pt(t2, e, n) {
  const { vibmod: o = 0.5, vib: s } = e;
  let c;
  if (s > 0) {
    c = x$1().createOscillator(), c.frequency.value = s;
    const a = x$1().createGain();
    return a.gain.value = o * 100, c.connect(a), a.connect(t2), c.start(n), c;
  }
}
function rt(t2, e, n, o) {
  const s = new ConstantSourceNode(t2), c = C$1(0);
  return c.connect(t2.destination), s.connect(c), s.onended = () => {
    try {
      c.disconnect();
    } catch {
    }
    try {
      s.disconnect();
    } catch {
    }
    e();
  }, s.start(n), s.stop(o), s;
}
const Cn = (t2, e = 1, n = "sine") => {
  const o = x$1();
  let s;
  Ke.includes(n) ? (s = o.createBufferSource(), s.buffer = Le(n, 2), s.loop = true) : (s = o.createOscillator(), s.type = n, s.frequency.value = t2), s.start();
  const c = new GainNode(o, { gain: e });
  return s.connect(c), { node: c, stop: (a) => s.stop(a) };
}, Hn = (t2, e, n, o = "sine") => {
  const c = t2.value * e, a = c * n;
  return Cn(c, a, o);
};
function Kt(t2, e, n) {
  const {
    fmh: o = 1,
    fmi: s,
    fmenv: c = "exp",
    fmattack: a,
    fmdecay: d2,
    fmsustain: l2,
    fmrelease: i2,
    fmvelocity: r,
    fmwave: u = "sine",
    duration: p
  } = e;
  let h2, m2 = () => {
  };
  if (s) {
    const X2 = x$1().createGain(), y = Hn(t2, o, s, u);
    if (h2 = y.node, m2 = y.stop, ![a, d2, l2, i2, r].some((Z2) => Z2 !== void 0))
      h2.connect(t2);
    else {
      const [Z2, W2, V2, G2] = Q$2([a, d2, l2, i2]), M2 = n + p;
      k$1(
        X2.gain,
        Z2,
        W2,
        V2,
        G2,
        0,
        1,
        n,
        M2,
        c === "exp" ? "exponential" : "linear"
      ), h2.connect(X2), X2.connect(t2);
    }
  }
  return { stop: m2 };
}
const ze = (t2) => t2 / (1 + t2), In = (t2, e) => (t2 % e + e) % e, Pn = (t2, e) => (1 + e) * t2 / (1 + e * Math.abs(t2)), nt = (t2, e) => Math.tanh(t2 * (1 + e)), kn = (t2, e) => D$1((1 + e) * t2, -1, 1), Te = (t2, e) => {
  let n = (1 + 0.5 * e) * t2;
  const o = In(n + 1, 4);
  return 1 - Math.abs(o - 2);
}, Qn = (t2, e) => Math.sin(Math.PI / 2 * Te(t2, e)), Jn = (t2, e) => {
  const n = ze(Math.log1p(e)), o = (t2 - n / 3 * t2 * t2 * t2) / (1 - n / 3);
  return nt(o, e);
}, Re = (t2, e, n = false) => {
  const o = 1 + 2 * e, c = 0.07 * ze(Math.log1p(e)), a = nt(t2 + c, 2 * e), d2 = nt(n ? c : -t2 + c, 2 * e), l2 = a - d2, i2 = 1 / Math.cosh(o * c), r = i2 * i2, u = Math.max(1e-8, (n ? 1 : 2) * o * r);
  return nt(l2 / u, e);
}, Un = (t2, e) => Re(t2, e, true), vn = (t2, e) => {
  const n = 10 * Math.log1p(e);
  let o = 1, s = t2, c, a = 0;
  for (let d2 = 1; d2 < 64; d2++) {
    if (d2 < 2) {
      a += d2 == 0 ? o : s;
      continue;
    }
    c = 2 * t2 * o - s, s = o, o = c, d2 % 2 === 0 && (a += Math.min(1.3 * n / d2, 2) * c);
  }
  return nt(a, n / 20);
}, Se = {
  scurve: Pn,
  soft: nt,
  hard: kn,
  cubic: Jn,
  diode: Re,
  asym: Un,
  fold: Te,
  sinefold: Qn,
  chebyshev: vn
}, dt = Object.freeze(Object.keys(Se)), Ho = (t2) => {
  let e = t2;
  typeof t2 == "string" && (e = dt.indexOf(t2), e === -1 && (N$1(`[superdough] Could not find waveshaping algorithm ${t2}.
        Available options are ${dt.join(", ")}.
        Defaulting to ${dt[0]}.`), e = 0));
  const n = dt[e % dt.length];
  return Se[n];
}, Bn = (t2, e, n) => I(x$1(), "distort-processor", { distort: t2, postgain: e }, { processorOptions: { algorithm: n } }), et = (t2, e = 36) => {
  let { note: n, freq: o } = t2;
  return n = n || e, typeof n == "string" && (n = zt(n)), !o && typeof n == "number" && (o = Me(n)), Number(o);
}, it = (t2) => {
  var _a2;
  t2 != null && (t2.disconnect(), (_a2 = t2.parameters.get("end")) == null ? void 0 : _a2.setValueAtTime(0, 0));
}, Ot = {}, It = {}, Io = (t2) => Ot[t2];
function jn(t2, e) {
  var n = 1024;
  if (t2 < n) return t2 + " B";
  var o = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], s = -1;
  do
    t2 /= n, ++s;
  while (t2 >= n);
  return t2.toFixed(1) + " " + o[s];
}
function On(t2, e) {
  const { speed: n = 1 } = t2, { transpose: o, url: s, index: c, midi: a, label: d2 } = ge(t2, e);
  let l2 = Math.abs(n) * Math.pow(2, o / 12);
  return { transpose: o, url: s, index: c, midi: a, label: d2, playbackRate: l2 };
}
const En = async (t2, e, n) => {
  let { url: o, label: s, playbackRate: c } = On(t2, e);
  n && (o = await n(o));
  const a = x$1(), d2 = await Ne(o, a, s);
  return t2.unit === "c" && (c = c * d2.duration), { buffer: d2, playbackRate: c };
}, Dn = async (t2, e, n) => {
  let { buffer: o, playbackRate: s } = await En(t2, e, n);
  t2.speed < 0 && (o = An(o));
  const a = x$1().createBufferSource();
  a.buffer = o, a.playbackRate.value = s;
  const { loopBegin: d2 = 0, loopEnd: l2 = 1, begin: i2 = 0, end: r = 1 } = t2, u = i2 * a.buffer.duration;
  t2.loop && (a.loop = true, a.loopStart = d2 * a.buffer.duration - u, a.loopEnd = l2 * a.buffer.duration - u);
  const h2 = a.buffer.duration / a.playbackRate.value, m2 = (r - i2) * h2;
  return { bufferSource: a, offset: u, bufferDuration: h2, sliceDuration: m2 };
}, Ne = (t2, e, n, o = 0) => {
  const s = n ? `sound "${n}:${o}"` : "sample";
  if (t2 = t2.replace("#", "%23"), !It[t2]) {
    N$1(`[sampler] load ${s}..`, "load-sample", { url: t2 });
    const c = Date.now();
    It[t2] = fetch(t2).then((a) => a.arrayBuffer()).then(async (a) => {
      const d2 = Date.now() - c, l2 = jn(a.byteLength);
      N$1(`[sampler] load ${s}... done! loaded ${l2} in ${d2}ms`, "loaded-sample", { url: t2 });
      const i2 = await e.decodeAudioData(a);
      return Ot[t2] = i2, i2;
    });
  }
  return It[t2];
};
function An(t2) {
  const e = x$1(), n = e.createBuffer(t2.numberOfChannels, t2.length, e.sampleRate);
  for (let o = 0; o < t2.numberOfChannels; o++)
    n.copyToChannel(t2.getChannelData(o).slice().reverse(), o, o);
  return n;
}
const Po = (t2) => Ot[t2];
function we(t2) {
  if (t2.startsWith("bubo:")) {
    const [e, n] = t2.split(":");
    t2 = `github:Bubobubobubobubo/dough-${n}`;
  }
  return t2;
}
function Ye(t2, e = "") {
  if (!t2.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let n = t2.slice(7);
  n = n.endsWith("/") ? n.slice(0, -1) : n;
  let o = n.split("/"), s = o[0], c = o.length >= 2 ? o[1] : "samples", a = o.length >= 3 ? o[2] : "main", d2 = o.slice(3);
  return d2.push(e || ""), d2 = d2.join("/"), `https://raw.githubusercontent.com/${s}/${c}/${a}/${d2}`;
}
const qn = (t2, e, n = t2._base || "") => Object.entries(t2).forEach(([o, s]) => {
  if (typeof s == "string" && (s = [s]), typeof s != "object")
    throw new Error("wrong sample map format for " + o);
  n = s._base || n, n = we(n), n.startsWith("github:") && (n = Ye(n, ""));
  const c = (a) => n + a;
  Array.isArray(s) ? s = s.map(c) : s = Object.fromEntries(
    Object.entries(s).map(([a, d2]) => [a, (typeof d2 == "string" ? [d2] : d2).map(c)])
  ), e(o, s);
});
let Fe = {};
function ko(t2, e) {
  Fe[t2] = e;
}
function $n(t2) {
  const e = Object.entries(Fe).find(([n]) => t2.startsWith(n));
  if (e)
    return e[1];
}
async function _n(t2) {
  const e = $n(t2);
  if (e)
    return e(t2);
  if (t2 = we(t2), t2.startsWith("github:") && (t2 = Ye(t2, "strudel.json")), t2.startsWith("local:") && (t2 = "http://localhost:5432"), t2.startsWith("shabda:")) {
    let [s, c] = t2.split("shabda:");
    t2 = `https://shabda.ndre.gr/${c}.json?strudel=1`;
  }
  if (t2.startsWith("shabda/speech")) {
    let [s, c] = t2.split("shabda/speech");
    c = c.startsWith("/") ? c.substring(1) : c;
    let [a, d2] = c.split(":"), l2 = "f", i2 = "en-GB";
    a && ([i2, l2] = a.split("/")), t2 = `https://shabda.ndre.gr/speech/${d2}.json?gender=${l2}&language=${i2}&strudel=1'`;
  }
  if (typeof fetch != "function")
    return;
  const n = t2.split("/").slice(0, -1).join("/");
  if (typeof fetch > "u")
    return;
  const o = await fetch(t2).then((s) => s.json()).catch((s) => {
    throw console.error(s), new Error(`error loading "${t2}"`);
  });
  return [o, o._base || n];
}
const to = async (t2, e = t2._base || "", n = {}) => {
  if (typeof t2 == "string") {
    const [c, a] = await _n(t2);
    return to(c, e || a, n);
  }
  const { prebake: o, tag: s } = n;
  qn(
    t2,
    (c, a) => {
      oo(c, a, { baseUrl: e, prebake: o, tag: s });
    },
    e
  );
}, Xe = [];
async function eo(t2, e, n, o, s) {
  let {
    s: c,
    nudge: a = 0,
    // TODO: is this in seconds?
    cut: d2,
    loop: l2,
    clip: i2 = void 0,
    // if set, samples will be cut off when the hap ends
    n: r = 0,
    speed: u = 1,
    // sample playback speed
    duration: p
  } = e;
  if (u === 0)
    return;
  const h2 = x$1();
  let [m2, b2, X2, y] = Q$2([e.attack, e.decay, e.sustain, e.release]);
  const { bufferSource: Z2, sliceDuration: W2, offset: V2 } = await Dn(e, o, s);
  if (h2.currentTime > t2) {
    N$1(`[sampler] still loading sound "${c}:${r}"`, "highlight");
    return;
  }
  if (!Z2) {
    N$1(`[sampler] could not load "${c}:${r}"`, "error");
    return;
  }
  let G2 = pt(Z2.detune, e, t2);
  const M2 = t2 + a;
  Z2.start(M2, V2);
  const L3 = h2.createGain(), z2 = Z2.connect(L3);
  i2 == null && l2 == null && e.release == null && (p = W2);
  let S2 = t2 + p;
  k$1(z2.gain, m2, b2, X2, y, 0, 1, t2, S2, "linear"), ht(Z2.detune, e, t2, S2);
  const R2 = h2.createGain();
  z2.connect(R2), Z2.onended = function() {
    Z2.disconnect(), G2 == null ? void 0 : G2.stop(), z2.disconnect(), R2.disconnect(), n();
  };
  let J2 = S2 + y + 0.01;
  Z2.stop(J2);
  const w2 = { node: R2, bufferSource: Z2, stop: (P2) => {
    Z2.stop(P2);
  } };
  if (d2 !== void 0) {
    const P2 = Xe[d2];
    P2 && (P2.node.gain.setValueAtTime(1, M2), P2.node.gain.linearRampToValueAtTime(0, M2 + 0.01)), Xe[d2] = w2;
  }
  return w2;
}
function no(t2, e, n) {
  j$1(t2, (o, s, c) => eo(o, s, c, e), {
    type: "sample",
    samples: e,
    ...n
  });
}
function oo(t2, e, n) {
  t2.startsWith("wt_") ? Be(t2, e, n) : no(t2, e, n);
}
let tt = (t2, e) => t2 !== void 0 && t2 !== e;
class co {
  constructor(e) {
    __publicField(this, "reverbNode");
    __publicField(this, "delayNode");
    __publicField(this, "output");
    __publicField(this, "summingNode");
    __publicField(this, "djfNode");
    __publicField(this, "audioContext");
    this.audioContext = e, this.output = new GainNode(e, { gain: 1, channelCount: 2, channelCountMode: "explicit" }), this.summingNode = new GainNode(e, { gain: 1, channelCount: 2, channelCountMode: "explicit" }), this.summingNode.connect(this.output);
  }
  disconnect() {
    var _a2, _b;
    this.output.disconnect(), this.summingNode.disconnect(), (_a2 = this.delayNode) == null ? void 0 : _a2.disconnect(), (_b = this.reverbNode) == null ? void 0 : _b.disconnect();
  }
  getDjf(e, n = 0) {
    this.djfNode == null && (this.djfNode = I(this.audioContext, "djf-processor", { value: e }), this.summingNode.disconnect(), this.summingNode.connect(this.djfNode), this.djfNode.connect(this.output)), this.djfNode.parameters.get("value").setValueAtTime(e, n);
  }
  getDelay(e = 0, n = 0.5, o) {
    var _a2, _b;
    return n = D$1(n, 0, 0.98), this.delayNode == null && (this.delayNode = this.audioContext.createFeedbackDelay(1, e, n), this.delayNode.connect(this.summingNode), (_b = (_a2 = this.delayNode).start) == null ? void 0 : _b.call(_a2, o)), this.delayNode.delayTime.value !== e && this.delayNode.delayTime.setValueAtTime(e, o), this.delayNode.feedback.value !== n && this.delayNode.feedback.setValueAtTime(n, o), this.delayNode;
  }
  getReverb(e, n, o, s, c, a, d2) {
    return this.reverbNode == null && (this.reverbNode = this.audioContext.createReverb(e, n, o, s, c, a, d2), this.reverbNode.connect(this.summingNode)), (tt(e, this.reverbNode.duration) || tt(n, this.reverbNode.fade) || tt(o, this.reverbNode.lp) || tt(s, this.reverbNode.dim) || tt(a, this.reverbNode.irspeed) || tt(d2, this.reverbNode.irbegin) || this.reverbNode.ir !== c) && this.reverbNode.generate(e, n, o, s, c, a, d2), this.reverbNode;
  }
  sendReverb(e, n) {
    Ut(e, this.reverbNode, n);
  }
  sendDelay(e, n) {
    Ut(e, this.delayNode, n);
  }
  duck(e, n = 0, o = 0.1, s = 1) {
    const c = n, a = Math.max(o, 2e-3), d2 = this.output.gain;
    rt(
      this.audioContext,
      () => {
        const l2 = this.audioContext.currentTime, i2 = d2.value;
        d2.cancelScheduledValues(l2), d2.setValueAtTime(i2, l2);
        const r = Math.max(e, l2), u = D$1(1 - Math.sqrt(s), 0.01, i2);
        d2.exponentialRampToValueAtTime(u, r + c), d2.exponentialRampToValueAtTime(1, r + c + a);
      },
      0,
      e - 0.01
    );
  }
  connectToOutput(e) {
    e.connect(this.summingNode);
  }
}
class so {
  constructor(e) {
    __publicField(this, "channelMerger");
    __publicField(this, "destinationGain");
    __publicField(this, "connectToDestination", (e, n = [0, 1]) => {
      const o = new StereoPannerNode(this.audioContext);
      e.connect(o);
      const s = new ChannelSplitterNode(this.audioContext, {
        numberOfOutputs: o.channelCount
      });
      o.connect(s), n.forEach((c, a) => {
        s.connect(this.channelMerger, a % o.channelCount, c % this.audioContext.destination.channelCount);
      });
    });
    this.audioContext = e, this.initializeAudio();
  }
  initializeAudio() {
    const e = this.audioContext, n = e.destination.maxChannelCount;
    this.audioContext.destination.channelCount = n, this.channelMerger = new ChannelMergerNode(e, { numberOfInputs: e.destination.channelCount }), this.destinationGain = new GainNode(e), this.channelMerger.connect(this.destinationGain), this.destinationGain.connect(e.destination);
  }
  reset() {
    this.disconnect(), this.initializeAudio();
  }
  disconnect() {
    this.channelMerger.disconnect(), this.destinationGain.disconnect(), this.destinationGain = null, this.channelMerger = null;
  }
}
class ao {
  constructor(e) {
    __publicField(this, "audioContext");
    __publicField(this, "output");
    __publicField(this, "nodes", {});
    this.audioContext = e, this.output = new so(e);
  }
  reset() {
    Array.from(this.nodes).forEach((e) => {
      e.disconnect();
    }), this.nodes = {}, this.output.reset();
  }
  duck(e, n, o = 0, s = 0.1, c = 1) {
    const a = [e].flat(), d2 = [o].flat(), l2 = [s].flat(), i2 = [c].flat();
    a.forEach((r, u) => {
      const p = this.nodes[r];
      if (p == null) {
        fn(new Error(`duck target orbit ${r} does not exist`), "superdough");
        return;
      }
      const h2 = d2[u] ?? d2[0], m2 = Math.max(l2[u] ?? l2[0], 2e-3), b2 = i2[u] ?? i2[0];
      p.duck(n, h2, m2, b2);
    });
  }
  getOrbit(e, n) {
    return this.nodes[e] == null && (this.nodes[e] = new co(this.audioContext), this.output.connectToDestination(this.nodes[e].output, n)), this.nodes[e];
  }
}
const Ce = 128, vt = "System Standard";
let He = Ce;
function lo(t2) {
  He = parseInt(t2) ?? Ce;
}
let Ie = false;
function io(t2) {
  Ie = t2 == true;
}
const B = map();
function j$1(t2, e, n = {}) {
  t2 = t2.toLowerCase().replace(/\s+/g, "_"), B.setKey(t2, { onTrigger: e, data: n });
}
let Pe = (t2) => t2;
function E(t2) {
  return Pe(t2);
}
function Qo(t2) {
  Pe = t2;
}
function Bt(t2) {
  for (const n in t2)
    t2[n.toLowerCase()] = t2[n];
  const e = B.get();
  for (const n in e) {
    const [o, s] = n.split("_");
    if (!s) continue;
    const c = t2[o];
    if (c) {
      if (typeof c == "string")
        e[`${c}_${s}`.toLowerCase()] = e[n];
      else if (Array.isArray(c))
        for (const a of c)
          e[`${a}_${s}`.toLowerCase()] = e[n];
    }
  }
  B.set({ ...e });
}
async function ro(t2) {
  const n = await (await fetch(t2)).json();
  Bt(n);
}
async function Jo(...t2) {
  switch (t2.length) {
    case 1:
      return typeof t2[0] == "string" ? ro(t2[0]) : Bt(t2[0]);
    case 2:
      return Bt({ [t2[0]]: t2[1] });
    default:
      throw new Error("aliasMap expects 1 or 2 arguments, received " + t2.length);
  }
}
function Uo(t2, e) {
  if (ut(t2) == null) {
    N$1("soundAlias: original sound not found");
    return;
  }
  B.setKey(e, ut(t2));
}
function ut(t2) {
  return typeof t2 != "string" ? (console.warn(`getSound: expected string got "${t2}". fall back to triangle`), B.get().triangle) : B.get()[t2.toLowerCase()];
}
const uo = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true });
  let t2 = await navigator.mediaDevices.enumerateDevices();
  t2 = t2.filter((n) => n.kind === "audiooutput" && n.deviceId !== "default");
  const e = /* @__PURE__ */ new Map();
  return e.set(vt, ""), t2.forEach((n) => {
    e.set(n.label, n.deviceId);
  }), e;
};
let mt = {
  s: "triangle",
  gain: 0.8,
  postgain: 1,
  density: ".03",
  ftype: "12db",
  fanchor: 0,
  resonance: 1,
  hresonance: 1,
  bandq: 1,
  channels: [1, 2],
  phaserdepth: 0.75,
  shapevol: 1,
  distortvol: 1,
  distorttype: 0,
  delay: 0,
  byteBeatExpression: "0",
  delayfeedback: 0.5,
  delaysync: 3 / 16,
  orbit: 1,
  i: 1,
  velocity: 1,
  fft: 8
};
const ho = Object.freeze({ ...mt });
function vo(t2, e) {
  mt[t2] = e;
}
function Bo() {
  mt = { ...ho };
}
let Et = new Map(Object.entries(mt));
function ke(t2, e) {
  Et.set(t2, e);
}
function T$1(t2) {
  return Et.get(t2);
}
function jo(t2) {
  Object.keys(t2).forEach((e) => {
    ke(e, t2[e]);
  });
}
function po() {
  Et = new Map(Object.entries(mt));
}
function Oo(t2) {
  po(), t2 === "1.0" && ke("fanchor", 0.5);
}
const Eo = () => B.set({});
let Qe = [];
function Do(t2) {
  Qe.push(t2);
}
let Pt;
function mo() {
  if (!Pt) {
    const t2 = x$1(), e = Qe.concat([Tn]);
    Pt = Promise.all(e.map((n) => t2.audioWorklet.addModule(n)));
  }
  return Pt;
}
async function bo(t2 = {}) {
  const {
    disableWorklets: e = false,
    maxPolyphony: n,
    audioDeviceName: o = vt,
    multiChannelOrbits: s = false
  } = t2;
  if (lo(n), io(s), typeof window > "u")
    return;
  const c = x$1();
  if (o != null && o != vt)
    try {
      const d2 = (await uo()).get(o), l2 = (d2 ?? "").length > 0;
      c.sinkId !== d2 && l2 && await c.setSinkId(d2), N$1(
        `[superdough] Audio Device set to ${o}, it might take a few seconds before audio plays on all output channels`
      );
    } catch {
      N$1("[superdough] failed to set audio interface", "warning");
    }
  if (await c.resume(), e) {
    N$1("[superdough]: AudioWorklets disabled with disableWorklets");
    return;
  }
  try {
    await mo(), N$1("[superdough] AudioWorklets loaded");
  } catch (a) {
    console.warn("could not load AudioWorklet effects", a);
  }
  N$1("[superdough] ready");
}
let kt;
async function Ao(t2) {
  return kt || (kt = new Promise((e) => {
    document.addEventListener("click", async function n() {
      document.removeEventListener("click", n), await bo(t2), e();
    });
  })), kt;
}
let gt;
function Je() {
  return gt == null && (gt = new ao(x$1())), gt;
}
function qo(t2, e) {
  Je().output.connectToDestination(t2, e);
}
function Zo(t2, e, n = 1, o = 0.5, s = 1e3, c = 2e3) {
  const a = x$1(), d2 = Tt(a, t2, e, { frequency: n, depth: c * 2 }), l2 = 2;
  let i2 = 0;
  const r = [];
  for (let u = 0; u < l2; u++) {
    const p = a.createBiquadFilter();
    p.type = "notch", p.gain.value = 1, p.frequency.value = s + i2, p.Q.value = 2 - Math.min(Math.max(o * 2, 0), 1.9), d2.connect(p.detune), i2 += 282, u > 0 && r[u - 1].connect(p), r.push(p);
  }
  return r[r.length - 1];
}
function Xo(t2) {
  t2 = t2 ?? 0;
  const e = ["12db", "ladder", "24db"];
  return typeof t2 == "number" ? e[Math.floor(xe(t2, e.length))] : t2;
}
let v$1 = {}, ot = {};
function yo(t2, e = 1024, n = 0.5) {
  if (!v$1[t2]) {
    const o = x$1().createAnalyser();
    o.fftSize = e, o.smoothingTimeConstant = n, v$1[t2] = o, ot[t2] = new Float32Array(v$1[t2].frequencyBinCount);
  }
  return v$1[t2].fftSize !== e && (v$1[t2].fftSize = e, ot[t2] = new Float32Array(v$1[t2].frequencyBinCount)), v$1[t2];
}
function $o(t2 = "time", e = 1) {
  const n = {
    time: () => {
      var _a2;
      return (_a2 = v$1[e]) == null ? void 0 : _a2.getFloatTimeDomainData(ot[e]);
    },
    frequency: () => {
      var _a2;
      return (_a2 = v$1[e]) == null ? void 0 : _a2.getFloatFrequencyData(ot[e]);
    }
  }[t2];
  if (!n)
    throw new Error(`getAnalyzerData: ${t2} not supported. use one of ${Object.keys(n).join(", ")}`);
  return n(), ot[e];
}
function _o() {
  gt == null ? void 0 : gt.reset(), v$1 = {}, ot = {};
}
let lt = /* @__PURE__ */ new Map();
function ye(t2) {
  return (Array.isArray(t2) ? t2 : [t2]).map((e) => e - 1);
}
const Go = async (t2, e, n, o = 0.5, s = 0.5) => {
  var _a2, _b, _c2;
  const c = x$1(), a = Je();
  let { stretch: d2 } = t2;
  if (d2 != null && (e = e - 0.04), typeof t2 != "object")
    throw new Error(
      `expected hap.value to be an object, but got "${t2}". Hint: append .note() or .s() to the end`,
      "error"
    );
  if (t2.duration = n, e < c.currentTime) {
    console.warn(
      `[superdough]: cannot schedule sounds in the past (target: ${e.toFixed(2)}, now: ${c.currentTime.toFixed(2)})`
    );
    return;
  }
  let {
    tremolo: l2,
    tremolosync: i2,
    tremolodepth: r = 1,
    tremoloskew: u,
    tremolophase: p = 0,
    tremoloshape: h2,
    s: m2 = T$1("s"),
    bank: b2,
    source: X2,
    gain: y = T$1("gain"),
    postgain: Z2 = T$1("postgain"),
    density: W2 = T$1("density"),
    duckorbit: V2,
    duckonset: G2,
    duckattack: M2,
    duckdepth: L3,
    djf: z2,
    // filters
    fanchor: S2 = T$1("fanchor"),
    drive: R2 = 0.69,
    release: J2 = 0,
    // low pass
    cutoff: g,
    lpenv: w2,
    lpattack: P2,
    lpdecay: A2,
    lpsustain: H2,
    lprelease: q2,
    resonance: U2 = T$1("resonance"),
    // high pass
    hpenv: st3,
    hcutoff: _2,
    hpattack: bt,
    hpdecay: Rt2,
    hpsustain: St2,
    hprelease: je2,
    hresonance: Oe2 = T$1("hresonance"),
    // band pass
    bpenv: Ee2,
    bandf: Dt2,
    bpattack: De2,
    bpdecay: Ae,
    bpsustain: qe,
    bprelease: $e2,
    bandq: _e2 = T$1("bandq"),
    //phaser
    phaserrate: At2,
    phaserdepth: qt2 = T$1("phaserdepth"),
    phasersweep: tn2,
    phasercenter: en2,
    //
    coarse: $t2,
    crush: _t2,
    dry: Zt2,
    shape: te2,
    shapevol: Nt = T$1("shapevol"),
    distort: ee2,
    distortvol: wt = T$1("distortvol"),
    distorttype: nn2 = T$1("distorttype"),
    pan: ne2,
    vowel: oe2,
    delay: Xt2 = T$1("delay"),
    delayfeedback: ce2 = T$1("delayfeedback"),
    delaysync: on2 = T$1("delaysync"),
    delaytime: yt,
    orbit: Gt2 = T$1("orbit"),
    room: se2,
    roomfade: cn2,
    roomlp: sn2,
    roomdim: an2,
    roomsize: dn2,
    ir: Yt2,
    irspeed: ln2,
    irbegin: rn2,
    i: ae2 = T$1("i"),
    velocity: Ft2 = T$1("velocity"),
    analyze: de2,
    // analyser wet
    fft: un2 = T$1("fft"),
    // fftSize 0 - 10
    compressor: le2,
    compressorRatio: hn2,
    compressorKnee: pn2,
    compressorAttack: mn2,
    compressorRelease: bn2
  } = t2;
  yt = yt ?? zn(on2, o);
  const Zn2 = ye(
    Ie && Gt2 > 0 ? [Gt2 * 2 - 1, Gt2 * 2] : T$1("channels")
  ), Xn2 = t2.channels != null ? ye(t2.channels) : Zn2, $2 = a.getOrbit(Gt2, Xn2);
  V2 != null && a.duck(V2, e, G2, M2, L3), y = E(O(y, 1)), Z2 = E(Z2), Nt = E(Nt), wt = E(wt), Xt2 = E(Xt2), Ft2 = E(Ft2), r = E(r), y *= Ft2;
  const Vt2 = e + n, ie2 = Vt2 + J2, re2 = Math.round(Math.random() * 1e6);
  for (let f2 = 0; f2 <= lt.size - He; f2++) {
    const F2 = lt.entries().next(), Y2 = F2.value[1], xt2 = F2.value[0], ue2 = e + 0.25;
    (_b = (_a2 = Y2 == null ? void 0 : Y2.node) == null ? void 0 : _a2.gain) == null ? void 0 : _b.linearRampToValueAtTime(0, ue2), (_c2 = Y2 == null ? void 0 : Y2.stop) == null ? void 0 : _c2.call(Y2, ue2), lt.delete(xt2);
  }
  let Wt2 = [];
  if (["-", "~", "_"].includes(m2))
    return;
  b2 && m2 && (m2 = `${b2}_${m2}`, t2.s = m2);
  let ft2;
  if (X2)
    ft2 = X2(e, t2, n, o);
  else if (ut(m2)) {
    const { onTrigger: f2 } = ut(m2), Y2 = await f2(e, t2, () => {
      Wt2.forEach((xt2) => xt2 == null ? void 0 : xt2.disconnect()), lt.delete(re2);
    }, o);
    Y2 && (ft2 = Y2.node, lt.set(re2, Y2));
  } else
    throw new Error(`sound ${m2} not found! Is it loaded?`);
  if (!ft2)
    return;
  if (c.currentTime > e) {
    N$1("[webaudio] skip hap: still loading", c.currentTime - e);
    return;
  }
  const K2 = [];
  K2.push(ft2), d2 !== void 0 && K2.push(I(c, "phase-vocoder-processor", { pitchFactor: d2 })), K2.push(C$1(y));
  const Mt2 = Xo(t2.ftype);
  if (g !== void 0) {
    let f2 = () => Ht(
      c,
      "lowpass",
      g,
      U2,
      P2,
      A2,
      H2,
      q2,
      w2,
      e,
      Vt2,
      S2,
      Mt2,
      R2
    );
    K2.push(f2()), Mt2 === "24db" && K2.push(f2());
  }
  if (_2 !== void 0) {
    let f2 = () => Ht(
      c,
      "highpass",
      _2,
      Oe2,
      bt,
      Rt2,
      St2,
      je2,
      st3,
      e,
      Vt2,
      S2
    );
    K2.push(f2()), Mt2 === "24db" && K2.push(f2());
  }
  if (Dt2 !== void 0) {
    let f2 = () => Ht(c, "bandpass", Dt2, _e2, De2, Ae, qe, $e2, Ee2, e, Vt2, S2);
    K2.push(f2()), Mt2 === "24db" && K2.push(f2());
  }
  if (oe2 !== void 0) {
    const f2 = c.createVowelFilter(oe2);
    K2.push(f2);
  }
  if ($t2 !== void 0 && K2.push(I(c, "coarse-processor", { coarse: $t2 })), _t2 !== void 0 && K2.push(I(c, "crush-processor", { crush: _t2 })), te2 !== void 0 && K2.push(I(c, "shape-processor", { shape: te2, postgain: Nt })), ee2 !== void 0 && K2.push(Bn(ee2, wt, nn2)), i2 != null && (l2 = o * i2), t2.wtPosSynced != null && (t2.wtPosRate /= o), t2.wtWarpSynced != null && (t2.wtWarpRate /= o), l2 !== void 0) {
    const f2 = Math.max(1 - r, 0), F2 = new GainNode(c, { gain: f2 }), Y2 = s / o;
    Tt(c, e, ie2, {
      skew: u ?? (h2 != null ? 0.5 : 1),
      frequency: l2,
      depth: r,
      time: Y2,
      dcoffset: 0,
      shape: h2,
      phaseoffset: p,
      min: 0,
      max: 1,
      curve: 1.5
    }).connect(F2.gain), K2.push(F2);
  }
  if (le2 !== void 0 && K2.push(
    wn(c, le2, hn2, pn2, mn2, bn2)
  ), ne2 !== void 0) {
    const f2 = c.createStereoPanner();
    f2.pan.value = 2 * ne2 - 1, K2.push(f2);
  }
  if (At2 !== void 0 && qt2 > 0) {
    const f2 = Zo(e, ie2, At2, qt2, en2, tn2);
    K2.push(f2);
  }
  const at3 = new GainNode(c, { gain: Z2 });
  if (K2.push(at3), Xt2 > 0 && yt > 0 && ce2 > 0 && ($2.getDelay(yt, ce2, e), $2.sendDelay(at3, Xt2)), se2 > 0) {
    let f2;
    if (Yt2 !== void 0) {
      let F2, Y2 = ut(Yt2);
      Array.isArray(Y2) ? F2 = Y2.data.samples[ae2 % Y2.data.samples.length] : typeof Y2 == "object" && (F2 = Object.values(Y2.data.samples).flat()[ae2 % Object.values(Y2.data.samples).length]), f2 = await Ne(F2, c, Yt2, 0);
    }
    $2.getReverb(dn2, cn2, sn2, an2, f2, ln2, rn2), $2.sendReverb(at3, se2);
  }
  if (z2 != null && $2.getDjf(z2, e), de2) {
    const f2 = yo(de2, 2 ** (un2 + 5)), F2 = Ut(at3, f2, 1);
    Wt2.push(F2);
  }
  if (Zt2 != null) {
    Zt2 = E(Zt2);
    const f2 = new GainNode(c, { gain: Zt2 });
    K2.push(f2), $2.connectToOutput(f2);
  } else
    $2.connectToOutput(at3);
  K2.slice(1).reduce((f2, F2) => f2.connect(F2), K2[0]), Wt2 = Wt2.concat(K2);
}, tc = (t2, e, n, o) => {
  Go(e, t2 - n, e.duration / o, o);
}, Vo = ["triangle", "square", "sawtooth", "sine"], Wo = [
  ["tri", "triangle"],
  ["sqr", "square"],
  ["saw", "sawtooth"],
  ["sin", "sine"]
];
function fo(t2, e) {
  const n = t2, o = new Float32Array(e);
  for (let s = 0; s < e; s++) {
    const c = s * 2 / e - 1;
    o[s] = Math.tanh(c * n);
  }
  return o;
}
function ec() {
  [...Vo].forEach((t2) => {
    j$1(
      t2,
      (e, n, o) => {
        const [s, c, a, d2] = Q$2(
          [n.attack, n.decay, n.sustain, n.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        );
        let l2 = xo(t2, e, n), { node: i2, stop: r, triggerRelease: u } = l2;
        const p = C$1(0.3), { duration: h2 } = n;
        i2.onended = () => {
          i2.disconnect(), p.disconnect(), o();
        };
        const m2 = C$1(1);
        let b2 = i2.connect(p).connect(m2);
        const X2 = e + h2;
        k$1(b2.gain, s, c, a, d2, 0, 1, e, X2, "linear");
        const y = X2 + d2 + 0.01;
        return u == null ? void 0 : u(y), r(y), {
          node: b2,
          stop: (Z2) => {
            r(Z2);
          }
        };
      },
      { type: "synth", prebake: true }
    );
  }), j$1(
    "sbd",
    (t2, e, n) => {
      const { duration: o, decay: s = 0.5, pdecay: c = 0.5, penv: a = 36, clip: d2 } = e, l2 = x$1(), i2 = 0.02, r = 1.2, u = 0.025, p = 1, h2 = l2.createOscillator();
      h2.type = "triangle", h2.frequency.value = et(e, 29), h2.detune.setValueAtTime(a * 100, 0), h2.detune.setValueAtTime(a * 100, t2), h2.detune.exponentialRampToValueAtTime(1e-3, t2 + c);
      const m2 = C$1(1);
      m2.gain.setValueAtTime(1, t2 + i2), m2.gain.exponentialRampToValueAtTime(1e-3, t2 + i2 + s), h2.start(t2);
      const b2 = Jt("brown", t2, 2), X2 = C$1(1);
      X2.gain.setValueAtTime(r, t2), X2.gain.exponentialRampToValueAtTime(1e-3, t2 + u);
      const y = new WaveShaperNode(l2);
      y.curve = fo(2, l2.sampleRate);
      const Z2 = C$1(p);
      h2.onended = () => {
        h2.disconnect(), m2.disconnect(), y.disconnect(), b2.node.disconnect(), X2.disconnect(), Z2.disconnect(), n();
      };
      const W2 = h2.connect(y).connect(m2).connect(Z2);
      b2.node.connect(X2).connect(Z2);
      let G2 = t2 + s + 0.01;
      return d2 != null && (G2 = Math.min(t2 + d2 * o, G2)), Z2.gain.setValueAtTime(p, G2 - 0.01), Z2.gain.linearRampToValueAtTime(0, G2), h2.stop(G2), b2.stop(G2), {
        node: W2,
        stop: (M2) => {
          h2.stop(M2);
        }
      };
    },
    { type: "synth", prebake: true }
  ), j$1(
    "supersaw",
    (t2, e, n) => {
      const o = x$1();
      let { duration: s, n: c, unison: a = 5, spread: d2 = 0.6, detune: l2 } = e;
      l2 = l2 ?? c ?? 0.18;
      const i2 = et(e), [r, u, p, h2] = Q$2(
        [e.attack, e.decay, e.sustain, e.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), m2 = t2 + s, b2 = m2 + h2 + 0.01, X2 = D$1(a, 1, 100);
      let y = X2 > 1 ? D$1(d2, 0, 1) : 0, Z2 = I(
        o,
        "supersaw-oscillator",
        {
          frequency: i2,
          begin: t2,
          end: b2,
          freqspread: l2,
          voices: X2,
          panspread: y
        },
        {
          outputChannelCount: [2]
        }
      );
      const W2 = 1 / Math.sqrt(X2);
      ht(Z2.parameters.get("detune"), e, t2, m2);
      const V2 = pt(Z2.parameters.get("detune"), e, t2), G2 = Kt(Z2.parameters.get("frequency"), e, t2);
      let M2 = C$1(1);
      M2 = Z2.connect(M2), k$1(M2.gain, r, u, p, h2, 0, 0.3 * W2, t2, m2, "linear");
      let L3 = rt(
        o,
        () => {
          it(Z2), M2.disconnect(), n(), G2 == null ? void 0 : G2.stop(), V2 == null ? void 0 : V2.stop();
        },
        t2,
        b2
      );
      return {
        node: M2,
        stop: (z2) => {
          L3.stop(z2);
        }
      };
    },
    { prebake: true, type: "synth" }
  ), j$1(
    "bytebeat",
    (t2, e, n) => {
      const o = [
        "(t%255 >= t/255%255)*255",
        "(t*(t*8%60 <= 300)|(-t)*(t*4%512 < 256))+t/400",
        "t",
        "t*(t >> 10^t)",
        "t&128",
        "t&t>>8",
        "((t%255+t%128+t%64+t%32+t%16+t%127.8+t%64.8+t%32.8+t%16.8)/3)",
        "((t%64+t%63.8+t%64.15+t%64.35+t%63.5)/1.25)",
        "(t&(t>>7)-t)",
        "(sin(t*PI/128)*127+127)",
        "((t^t/2+t+64*(sin((t*PI/64)+(t*PI/32768))+64))%128*2)",
        "((t^t/2+t+64*(cos >> 0))%127.85*2)",
        "((t^t/2+t+64)%128*2)",
        "(((t * .25)^(t * .25)/100+(t * .25))%128)*2",
        "((t^t/2+t+64)%7 * 24)"
      ], { n: s = 0 } = e, c = et(e), { byteBeatExpression: a = o[s % o.length], byteBeatStartTime: d2 } = e, l2 = x$1();
      let { duration: i2 } = e;
      const [r, u, p, h2] = Q$2(
        [e.attack, e.decay, e.sustain, e.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), m2 = t2 + i2, b2 = m2 + h2 + 0.01;
      let X2 = I(
        l2,
        "byte-beat-processor",
        {
          frequency: c,
          begin: t2,
          end: b2
        },
        {
          outputChannelCount: [2]
        }
      );
      X2.port.postMessage({ codeText: a, byteBeatStartTime: d2, frequency: c });
      let y = C$1(1);
      y = X2.connect(y), k$1(y.gain, r, u, p, h2, 0, 1, t2, m2, "linear");
      let Z2 = rt(
        l2,
        () => {
          it(X2), y.disconnect(), n();
        },
        t2,
        b2
      );
      return {
        node: y,
        stop: (W2) => {
          Z2.stop(W2);
        }
      };
    },
    { prebake: true, type: "synth" }
  ), j$1(
    "pulse",
    (t2, e, n) => {
      const o = x$1();
      let { pwrate: s, pwsweep: c } = e;
      c == null && (s != null ? c = 0.3 : c = 0), s == null && c != null && (s = 1);
      let { duration: a, pw: d2 = 0.5 } = e;
      const l2 = et(e), [i2, r, u, p] = Q$2(
        [e.attack, e.decay, e.sustain, e.release],
        "linear",
        [1e-3, 0.05, 0.6, 0.01]
      ), h2 = t2 + a, m2 = h2 + p + 0.01;
      let b2 = I(
        o,
        "pulse-oscillator",
        {
          frequency: l2,
          begin: t2,
          end: m2,
          pulsewidth: d2
        },
        {
          outputChannelCount: [2]
        }
      );
      ht(b2.parameters.get("detune"), e, t2, h2);
      const X2 = pt(b2.parameters.get("detune"), e, t2), y = Kt(b2.parameters.get("frequency"), e, t2);
      let Z2 = C$1(1);
      Z2 = b2.connect(Z2), k$1(Z2.gain, i2, r, u, p, 0, 1, t2, h2, "linear");
      let W2;
      c != 0 && (W2 = Tt(o, t2, m2, { frequency: s, depth: c }), W2.connect(b2.parameters.get("pulsewidth")));
      let V2 = rt(
        o,
        () => {
          it(b2), it(W2), Z2.disconnect(), n(), y == null ? void 0 : y.stop(), X2 == null ? void 0 : X2.stop();
        },
        t2,
        m2
      );
      return {
        node: Z2,
        stop: (G2) => {
          V2.stop(G2);
        }
      };
    },
    { prebake: true, type: "synth" }
  ), [...Ke].forEach((t2) => {
    j$1(
      t2,
      (e, n, o) => {
        const [s, c, a, d2] = Q$2(
          [n.attack, n.decay, n.sustain, n.release],
          "linear",
          [1e-3, 0.05, 0.6, 0.01]
        );
        let l2, { density: i2 } = n;
        l2 = Jt(t2, e, i2);
        let { node: r, stop: u, triggerRelease: p } = l2;
        const h2 = C$1(0.3), { duration: m2 } = n;
        r.onended = () => {
          r.disconnect(), h2.disconnect(), o();
        };
        const b2 = C$1(1);
        let X2 = r.connect(h2).connect(b2);
        const y = e + m2;
        k$1(X2.gain, s, c, a, d2, 0, 1, e, y, "linear");
        const Z2 = y + d2 + 0.01;
        return p == null ? void 0 : p(Z2), u(Z2), {
          node: X2,
          stop: (W2) => {
            u(W2);
          }
        };
      },
      { type: "synth", prebake: true }
    );
  }), Wo.forEach(([t2, e]) => B.set({ ...B.get(), [t2]: B.get()[e] }));
}
function Mo(t2, e) {
  const n = new Float32Array(t2 + 1), o = new Float32Array(t2 + 1), s = x$1(), c = s.createOscillator(), a = {
    sawtooth: (i2) => [0, -1 / i2],
    square: (i2) => [0, i2 % 2 === 0 ? 0 : 1 / i2],
    triangle: (i2) => [i2 % 2 === 0 ? 0 : 1 / (i2 * i2), 0]
  };
  if (!a[e])
    throw new Error(`unknown wave type ${e}`);
  n[0] = 0, o[0] = 0;
  let d2 = 1;
  for (; d2 <= t2; ) {
    const [i2, r] = a[e](d2);
    n[d2] = i2, o[d2] = r, d2++;
  }
  const l2 = s.createPeriodicWave(n, o);
  return c.setPeriodicWave(l2), c;
}
function xo(t2, e, n) {
  let { n: o, duration: s, noise: c = 0 } = n, a;
  !o || t2 === "sine" ? (a = x$1().createOscillator(), a.type = t2 || "triangle") : a = Mo(o, t2), a.frequency.value = et(n), a.start(e);
  let d2 = pt(a.detune, n, e);
  ht(a.detune, n, e, e + s);
  const l2 = Kt(a.frequency, n, e);
  let i2;
  return c && (i2 = Sn(a, c, e)), {
    node: (i2 == null ? void 0 : i2.node) || a,
    stop: (r) => {
      l2.stop(r), d2 == null ? void 0 : d2.stop(r), i2 == null ? void 0 : i2.stop(r), a.stop(r);
    },
    triggerRelease: (r) => {
    }
  };
}
function go(t2 = 1, e = 0.05, n = 220, o = 0, s = 0, c = 0.1, a = 0, d2 = 1, l2 = 0, i2 = 0, r = 0, u = 0, p = 0, h2 = 0, m2 = 0, b2 = 0, X2 = 0, y = 1, Z2 = 0, W2 = 0) {
  let V2 = Math.PI * 2, G2 = x$1().sampleRate, M2 = (st3) => st3 > 0 ? 1 : -1, L3 = l2 *= 500 * V2 / G2 / G2, z2 = n *= (1 + e * 2 * Math.random() - e) * V2 / G2, S2 = [], R2 = 0, J2 = 0, g = 0, w2 = 1, P2 = 0, A2 = 0, H2 = 0, q2, U2;
  for (o = o * G2 + 9, Z2 *= G2, s *= G2, c *= G2, X2 *= G2, i2 *= 500 * V2 / G2 ** 3, m2 *= V2 / G2, r *= V2 / G2, u *= G2, p = p * G2 | 0, U2 = o + Z2 + s + c + X2 | 0; g < U2; S2[g++] = H2)
    ++A2 % (b2 * 100 | 0) || (H2 = a ? a > 1 ? a > 2 ? a > 3 ? Math.sin((R2 % V2) ** 3) : Math.max(Math.min(Math.tan(R2), 1), -1) : 1 - (2 * R2 / V2 % 2 + 2) % 2 : 1 - 4 * Math.abs(Math.round(R2 / V2) - R2 / V2) : Math.sin(R2), H2 = (p ? 1 - W2 + W2 * Math.sin(V2 * g / p) : 1) * M2(H2) * Math.abs(H2) ** d2 * // curve 0=square, 2=pointy
    t2 * 1 * // envelope
    (g < o ? g / o : g < o + Z2 ? 1 - (g - o) / Z2 * (1 - y) : g < o + Z2 + s ? y : g < U2 - X2 ? (U2 - g - X2) / c * // release falloff
    y : 0), H2 = X2 ? H2 / 2 + (X2 > g ? 0 : (g < U2 - X2 ? 1 : (U2 - g) / X2) * // release delay
    S2[g - X2 | 0] / 2) : H2), q2 = (n += l2 += i2) * // frequency
    Math.cos(m2 * J2++), R2 += q2 - q2 * h2 * (1 - (Math.sin(g) + 1) * 1e9 % 2), w2 && ++w2 > u && (n += r, z2 += r, w2 = 0), p && !(++P2 % p) && (n = z2, l2 = L3, w2 || (w2 = 1));
  return S2;
}
const Lo = (t2, e) => {
  let {
    s: n,
    note: o = 36,
    freq: s,
    //
    zrand: c = 0,
    attack: a = 0,
    decay: d2 = 0,
    sustain: l2 = 0.8,
    release: i2 = 0.1,
    curve: r = 1,
    slide: u = 0,
    deltaSlide: p = 0,
    pitchJump: h2 = 0,
    pitchJumpTime: m2 = 0,
    lfo: b2 = 0,
    znoise: X2 = 0,
    zmod: y = 0,
    zcrush: Z2 = 0,
    zdelay: W2 = 0,
    tremolo: V2 = 0,
    duration: G2 = 0.2,
    zzfx: M2
  } = t2;
  const L3 = Math.max(G2 - a - d2, 0);
  typeof o == "string" && (o = zt(o)), !s && typeof o == "number" && (s = Me(o)), n = n.replace("z_", "");
  const z2 = ["sine", "triangle", "sawtooth", "tan", "noise"].indexOf(n) || 0;
  r = n === "square" ? 0 : r;
  const R2 = (
    /* ZZFX. */
    go(...M2 || [
      0.25,
      // volume
      c,
      s,
      a,
      L3,
      i2,
      z2,
      r,
      u,
      p,
      h2,
      m2,
      b2,
      X2,
      y,
      Z2,
      W2,
      l2,
      // sustain volume!
      d2,
      V2
    ])
  ), J2 = x$1(), g = J2.createBuffer(1, R2.length, J2.sampleRate);
  g.getChannelData(0).set(R2);
  const w2 = x$1().createBufferSource();
  return w2.buffer = g, w2.start(e), {
    node: w2
  };
};
function nc() {
  ["zzfx", "z_sine", "z_sawtooth", "z_triangle", "z_square", "z_tan", "z_noise"].forEach((t2) => {
    j$1(
      t2,
      (e, n, o) => {
        const { node: s } = Lo({ s: t2, ...n }, e);
        return s.onended = () => {
          s.disconnect(), o();
        }, {
          node: s,
          stop: () => {
          }
        };
      },
      { type: "synth", prebake: true }
    );
  });
}
let ct;
async function Ko(t2, e) {
  const n = `dsp-worklet-${Date.now()}`, o = `${e}
let __q = []; // trigger queue
class MyProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.t = 0;
    this.stopped = false;
    this.port.onmessage = (e) => {
      if(e.data==='stop') {
        this.stopped = true;
      } else if(e.data?.dough) {
        __q.push(e.data)
      } else {
        msg?.(e.data)
      }
    };
  }
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    if(__q.length) {
      for(let i=0;i<__q.length;++i) {
        const deadline = __q[i].time-currentTime;
        if(deadline<=0) {
          trigger(__q[i].dough)
          __q.splice(i,1)
        }
      }
    }
    for (let i = 0; i < output[0].length; i++) {
      const out = dsp(this.t / sampleRate);
      output.forEach((channel) => {
        channel[i] = out;
      });
      this.t++;
    }
  return !this.stopped;
  }
}
registerProcessor('${n}', MyProcessor);
`, c = `data:text/javascript;base64,${btoa(o)}`;
  await t2.audioWorklet.addModule(c);
  const a = new AudioWorkletNode(t2, n);
  return { node: a, stop: () => a.port.postMessage("stop") };
}
const Ue = () => {
  var _a2;
  ct && (ct == null ? void 0 : ct.stop(), (_a2 = ct == null ? void 0 : ct.node) == null ? void 0 : _a2.disconnect());
};
typeof window < "u" && window.addEventListener("message", (t2) => {
  var _a2;
  t2.data === "strudel-stop" ? Ue() : ((_a2 = t2.data) == null ? void 0 : _a2.dough) && (ct == null ? void 0 : ct.node.port.postMessage(t2.data));
});
const oc = async (t2) => {
  const e = x$1();
  Ue(), ct = await Ko(e, t2), ct.node.connect(e.destination);
};
function cc(t2, e, n, o) {
  window.postMessage({ time: o, dough: t2.value, currentTime: e, duration: t2.duration, cps: n });
}
const Ge = Object.freeze({
  NONE: 0,
  ASYM: 1,
  MIRROR: 2,
  BENDP: 3,
  BENDM: 4,
  BENDMP: 5,
  SYNC: 6,
  QUANT: 7,
  FOLD: 8,
  PWM: 9,
  ORBIT: 10,
  SPIN: 11,
  CHAOS: 12,
  PRIMES: 13,
  BINARY: 14,
  BROWNIAN: 15,
  RECIPROCAL: 16,
  WORMHOLE: 17,
  LOGISTIC: 18,
  SIGMOID: 19,
  FRACTAL: 20,
  FLIP: 21
}), Ve = /* @__PURE__ */ new Set();
async function zo(t2, e, n = 2048) {
  const o = `${t2},${n}`;
  if (!Ve.has(o)) {
    const c = (await No(t2, e)).getChannelData(0), a = c.length, d2 = Math.max(1, Math.floor(a / n)), l2 = new Array(d2);
    for (let i2 = 0; i2 < d2; i2++) {
      const r = i2 * n;
      l2[i2] = c.subarray(r, r + n);
    }
    return Ve.add(o), { frames: l2, frameLen: n, numFrames: d2, key: o };
  }
  return { frameLen: n, key: o };
}
function To(t2, e) {
  var n = 1024;
  if (t2 < n) return t2 + " B";
  var o = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], s = -1;
  do
    t2 /= n, ++s;
  while (t2 >= n);
  return t2.toFixed(1) + " " + o[s];
}
function Ro(t2) {
  const e = new DataView(t2);
  let n = 12;
  for (; n + 8 <= e.byteLength; ) {
    const o = String.fromCharCode(e.getUint8(n), e.getUint8(n + 1), e.getUint8(n + 2), e.getUint8(n + 3)), s = e.getUint32(n + 4, true);
    if (o === "fmt ")
      return e.getUint32(n + 12, true);
    n += 8 + s + (s & 1);
  }
  return null;
}
async function So(t2) {
  const e = Ro(t2) || 44100;
  return await new OfflineAudioContext(1, 1, e).decodeAudioData(t2);
}
const Qt = {}, No = (t2, e) => {
  if (t2 = t2.replace("#", "%23"), !Qt[t2]) {
    N$1(`[wavetable] load table ${e}..`, "load-table", { url: t2 });
    const n = Date.now();
    Qt[t2] = fetch(t2).then((o) => o.arrayBuffer()).then(async (o) => {
      const s = Date.now() - n, c = To(o.byteLength);
      return N$1(`[wavetable] load table ${e}... done! loaded ${c} in ${s}ms`, "loaded-table", { url: t2 }), await So(o);
    });
  }
  return Qt[t2];
};
function ve(t2, e = "") {
  if (!t2.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let [n, o] = t2.split("github:");
  return o = o.endsWith("/") ? o.slice(0, -1) : o, o.split("/").length === 2 && (o += "/main"), `https://raw.githubusercontent.com/${o}/${e}`;
}
const We = (t2, e, n, o = {}) => (e = t2._base || e, Object.entries(t2).forEach(([s, c]) => {
  if (s === "_base") return false;
  if (typeof c == "string" && (c = [c]), typeof c != "object")
    throw new Error("wrong json format for " + s);
  let a = e;
  a.startsWith("github:") && (a = ve(a, "")), c = c.map((d2) => a + d2).filter((d2) => d2.toLowerCase().endsWith(".wav") ? true : (N$1(`[wavetable] skipping ${d2} -- wavetables must be ".wav" format`), false)), c.length && Be(s, c, { baseUrl: e, frameLen: n });
}));
function Be(t2, e, n) {
  j$1(
    t2,
    (o, s, c, a) => wo(o, s, c, e, a, (n == null ? void 0 : n.frameLen) ?? 2048),
    {
      type: "wavetable",
      tables: e,
      ...n
    }
  );
}
const sc = async (t2, e, n, o = {}) => {
  if (n !== void 0) return We(n, t2, e);
  if (t2.startsWith("github:") && (t2 = ve(t2, "strudel.json")), t2.startsWith("local:") && (t2 = "http://localhost:5432"), typeof fetch == "function" && !(typeof fetch > "u"))
    return fetch(t2).then((s) => s.json()).then((s) => We(s, t2, e, o)).catch((s) => {
      throw console.error(s), new Error(`error loading "${t2}"`);
    });
};
async function wo(t2, e, n, o, s, c) {
  const { s: a, n: d2 = 0, duration: l2, clip: i2 } = e, r = x$1(), [u, p, h2, m2] = Q$2([e.attack, e.decay, e.sustain, e.release]);
  let { warpmode: b2 } = e;
  typeof b2 == "string" && (b2 = Ge[b2.toUpperCase()] ?? Ge.NONE);
  const X2 = et(e), { url: y, label: Z2 } = ge(e, o), W2 = await zo(y, Z2, c);
  let V2 = t2 + l2;
  i2 !== void 0 && (V2 = Math.min(t2 + i2 * l2, V2));
  const G2 = V2 + m2, M2 = G2 + 0.01, L3 = I(
    r,
    "wavetable-oscillator-processor",
    {
      begin: t2,
      end: M2,
      frequency: X2,
      freqspread: e.detune,
      position: e.wt,
      warp: e.warp,
      warpMode: b2,
      voices: Math.max(e.unison ?? 1, 1),
      panspread: e.spread,
      phaserand: e.wtphaserand ?? e.unison > 1 ? 1 : 0
    },
    { outputChannelCount: [2] }
  );
  if (L3.port.postMessage({ type: "table", payload: W2 }), r.currentTime > t2) {
    N$1(`[wavetable] still loading sound "${a}:${d2}"`, "highlight");
    return;
  }
  const z2 = [e.wtattack, e.wtdecay, e.wtsustain, e.wtrelease], S2 = [e.warpattack, e.warpdecay, e.warpsustain, e.warprelease], R2 = L3.parameters, J2 = R2.get("position"), g = R2.get("warp");
  let w2 = e.wtrate;
  e.wtsync != null && (w2 = s * e.wtsync);
  const P2 = be(
    r,
    J2,
    t2,
    G2,
    {
      offset: e.wt,
      amount: e.wtenv,
      defaultAmount: 0.5,
      values: z2,
      holdEnd: V2,
      defaultValues: [0, 0.5, 0, 0.1]
    },
    {
      frequency: w2,
      depth: e.wtdepth,
      defaultDepth: 0.5,
      shape: e.wtshape,
      skew: e.wtskew,
      dcoffset: e.wtdc ?? 0
    }
  );
  let A2 = e.warprate;
  e.warpsync != null && (A2 = A2 = s * e.warpsync);
  const H2 = be(
    r,
    g,
    t2,
    G2,
    {
      offset: e.warp,
      amount: e.warpenv,
      defaultAmount: 0.5,
      values: S2,
      holdEnd: V2,
      defaultValues: [0, 0.5, 0, 0.1]
    },
    {
      frequency: A2,
      depth: e.warpdepth,
      defaultDepth: 0.5,
      shape: e.warpshape,
      skew: e.warpskew,
      dcoffset: e.warpdc ?? 0
    }
  ), q2 = pt(L3.parameters.get("detune"), e, t2), U2 = Kt(L3.parameters.get("frequency"), e, t2), st3 = r.createGain(), _2 = L3.connect(st3);
  k$1(_2.gain, u, p, h2, m2, 0, 0.3, t2, V2, "linear"), ht(L3.parameters.get("detune"), e, t2, V2);
  const bt = { node: _2, source: L3 }, Rt2 = rt(
    r,
    () => {
      it(L3), q2 == null ? void 0 : q2.stop(), U2 == null ? void 0 : U2.stop(), _2.disconnect(), P2 == null ? void 0 : P2.disconnect(), H2 == null ? void 0 : H2.disconnect(), n();
    },
    t2,
    M2
  );
  return bt.stop = (St2) => {
    Rt2.stop(St2);
  }, bt;
}
const H$1 = "data:text/javascript;base64,dmFyIGF0PU9iamVjdC5kZWZpbmVQcm9wZXJ0eTt2YXIgaHQ9KHUsbSxmKT0+bSBpbiB1P2F0KHUsbSx7ZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITAsdmFsdWU6Zn0pOnVbbV09Zjt2YXIgZT0odSxtLGYpPT5odCh1LHR5cGVvZiBtIT0ic3ltYm9sIj9tKyIiOm0sZik7KGZ1bmN0aW9uKCl7InVzZSBzdHJpY3QiO2NvbnN0IHU9dHlwZW9mIHNhbXBsZVJhdGU8InUiP3NhbXBsZVJhdGU6NDhlMyxtPU1hdGguUEkvdSxmPTEvdTtsZXQgVj1oPT5NYXRoLnBvdyhoLDIpO2Z1bmN0aW9uIF8oaCl7cmV0dXJuIFYoaCl9ZnVuY3Rpb24gTyhoLHMsdCl7Y29uc3QgaT1NYXRoLnNpbigoMS10KSouNSpNYXRoLlBJKSxuPU1hdGguc2luKHQqLjUqTWF0aC5QSSk7cmV0dXJuIGgqaStzKm59Y2xhc3MgZ3tjb25zdHJ1Y3Rvcigpe2UodGhpcywicGhhc2UiLDApfXVwZGF0ZShzKXtjb25zdCB0PU1hdGguc2luKHRoaXMucGhhc2UqMipNYXRoLlBJKTtyZXR1cm4gdGhpcy5waGFzZT0odGhpcy5waGFzZStzL3UpJTEsdH19Y2xhc3MgSXtjb25zdHJ1Y3Rvcigpe2UodGhpcywicGhhc2UiLDApfXVwZGF0ZShzKXtyZXR1cm4gdGhpcy5waGFzZSs9ZipzLHRoaXMucGhhc2UlMSoyLTF9fWZ1bmN0aW9uIE0oaCxzKXtyZXR1cm4gaDxzPyhoLz1zLGgraC1oKmgtMSk6aD4xLXM/KGg9KGgtMSkvcyxoKmgraCtoKzEpOjB9Y2xhc3MgU3tjb25zdHJ1Y3RvcihzPXt9KXt0aGlzLnBoYXNlPXMucGhhc2U/PzB9dXBkYXRlKHMpe2NvbnN0IHQ9cy91O2xldCBpPU0odGhpcy5waGFzZSx0KSxuPTIqdGhpcy5waGFzZS0xLWk7cmV0dXJuIHRoaXMucGhhc2UrPXQsdGhpcy5waGFzZT4xJiYodGhpcy5waGFzZS09MSksbn19ZnVuY3Rpb24gVChoLHMsdCl7cmV0dXJuIGg8Mj8wOigobixsLHIpPT5yKihsLW4pK24pKC1zKi41LHMqLjUsdC8oaC0xKSl9ZnVuY3Rpb24geihoLHMpe3JldHVybiBoKk1hdGgucG93KDIscy8xMil9Y2xhc3MgRntjb25zdHJ1Y3RvcihzPXt9KXt0aGlzLnZvaWNlcz1zLnZvaWNlcz8/NSx0aGlzLmZyZXFzcHJlYWQ9cy5mcmVxc3ByZWFkPz8uMix0aGlzLnBhbnNwcmVhZD1zLnBhbnNwcmVhZD8/LjQsdGhpcy5waGFzZT1uZXcgRmxvYXQzMkFycmF5KHRoaXMudm9pY2VzKS5tYXAoKCk9Pk1hdGgucmFuZG9tKCkpfXVwZGF0ZShzKXtjb25zdCB0PU1hdGguc3FydCgxLXRoaXMucGFuc3ByZWFkKSxpPU1hdGguc3FydCh0aGlzLnBhbnNwcmVhZCk7bGV0IG49MCxsPTA7Zm9yKGxldCByPTA7cjx0aGlzLnZvaWNlcztyKyspe2NvbnN0IGE9eihzLFQodGhpcy52b2ljZXMsdGhpcy5mcmVxc3ByZWFkLHIpKS91LGM9KHImMSk9PTE7bGV0IGQ9dDtjJiYoZD1pKTtsZXQgYj1NKHRoaXMucGhhc2Vbcl0sYSksRT0yKnRoaXMucGhhc2Vbcl0tMS1iO249bitFKmQsbD1sK0UqZCx0aGlzLnBoYXNlW3JdKz1hLHRoaXMucGhhc2Vbcl0+MSYmKHRoaXMucGhhc2Vbcl0tPTEpfXJldHVybiBuK2x9fWNsYXNzIGt7Y29uc3RydWN0b3IoKXtlKHRoaXMsInBoYXNlIiwwKX11cGRhdGUocyl7dGhpcy5waGFzZSs9ZipzO2xldCB0PXRoaXMucGhhc2UlMTtyZXR1cm4odDwuNT8yKnQ6MS0yKih0LS41KSkqMi0xfX1jbGFzcyBxe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJzMCIsMCk7ZSh0aGlzLCJzMSIsMCl9dXBkYXRlKHMsdCxpPTApe2k9TWF0aC5tYXgoaSwwKSx0PU1hdGgubWluKHQsMmU0KTtjb25zdCBuPTIqTWF0aC5zaW4odCptKSxyPTEtTWF0aC5wb3coLjUsKGkrLjEyNSkvLjEyNSkqbjtyZXR1cm4gdGhpcy5zMD1yKnRoaXMuczAtbip0aGlzLnMxK24qcyx0aGlzLnMxPXIqdGhpcy5zMStuKnRoaXMuczAsdGhpcy5zMX19Y2xhc3MgQ3tjb25zdHJ1Y3RvcihzPTApe3RoaXMucGhhc2U9c31zYXcocyx0KXtsZXQgaT0odGhpcy5waGFzZStzKSUxLG49TShpLHQpO3JldHVybiAyKmktMS1ufXVwZGF0ZShzLHQ9LjUpe2NvbnN0IGk9cy91O2xldCBuPXRoaXMuc2F3KDAsaSktdGhpcy5zYXcodCxpKTtyZXR1cm4gdGhpcy5waGFzZT0odGhpcy5waGFzZStpKSUxLG4rdCoyLTF9fWNsYXNzIEx7Y29uc3RydWN0b3IoKXtlKHRoaXMsInBoYXNlIiwwKX11cGRhdGUocyx0PS41KXtyZXR1cm4gdGhpcy5waGFzZSs9ZipzLHRoaXMucGhhc2UlMTx0PzE6LTF9fWNsYXNzIFB7Y29uc3RydWN0b3IoKXtlKHRoaXMsInVwZGF0ZSIscz0+TWF0aC5yYW5kb20oKTxzKmY/TWF0aC5yYW5kb20oKTowKX19Y2xhc3MgTnt1cGRhdGUoKXtyZXR1cm4gTWF0aC5yYW5kb20oKSoyLTF9fWNsYXNzIEd7Y29uc3RydWN0b3IoKXt0aGlzLm91dD0wfXVwZGF0ZSgpe2xldCBzPU1hdGgucmFuZG9tKCkqMi0xO3JldHVybiB0aGlzLm91dD0odGhpcy5vdXQrLjAyKnMpLzEuMDIsdGhpcy5vdXR9fWNsYXNzIGp7Y29uc3RydWN0b3IoKXt0aGlzLmIwPTAsdGhpcy5iMT0wLHRoaXMuYjI9MCx0aGlzLmIzPTAsdGhpcy5iND0wLHRoaXMuYjU9MCx0aGlzLmI2PTB9dXBkYXRlKCl7Y29uc3Qgcz1NYXRoLnJhbmRvbSgpKjItMTt0aGlzLmIwPS45OTg4Nip0aGlzLmIwK3MqLjA1NTUxNzksdGhpcy5iMT0uOTkzMzIqdGhpcy5iMStzKi4wNzUwNzU5LHRoaXMuYjI9Ljk2OSp0aGlzLmIyK3MqLjE1Mzg1Mix0aGlzLmIzPS44NjY1KnRoaXMuYjMrcyouMzEwNDg1Nix0aGlzLmI0PS41NSp0aGlzLmI0K3MqLjUzMjk1MjIsdGhpcy5iNT0tLjc2MTYqdGhpcy5iNS1zKi4wMTY4OTg7Y29uc3QgdD10aGlzLmIwK3RoaXMuYjErdGhpcy5iMit0aGlzLmIzK3RoaXMuYjQrdGhpcy5iNSt0aGlzLmI2K3MqLjUzNjI7cmV0dXJuIHRoaXMuYjY9cyouMTE1OTI2LHQqLjExfX1jbGFzcyBCe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJwaGFzZSIsMSl9dXBkYXRlKHMpe3RoaXMucGhhc2UrPWYqcztsZXQgdD10aGlzLnBoYXNlPj0xPzE6MDtyZXR1cm4gdGhpcy5waGFzZT10aGlzLnBoYXNlJTEsdH19ZnVuY3Rpb24gUihoLHMsdCxpPTEpe2lmKGg8PTApcmV0dXJuIHM7aWYoaD49MSlyZXR1cm4gdDtsZXQgbjtyZXR1cm4gaT09PTA/bj1oOmk+MD9uPU1hdGgucG93KGgsaSk6bj0xLU1hdGgucG93KDEtaCwtaSkscysodC1zKSpufWNsYXNzIHZ7Y29uc3RydWN0b3Iocz17fSl7dGhpcy5zdGF0ZT0ib2ZmIix0aGlzLnN0YXJ0VGltZT0wLHRoaXMuc3RhcnRWYWw9MCx0aGlzLmRlY2F5Q3VydmU9cy5kZWNheUN1cnZlPz8xfXVwZGF0ZShzLHQsaSxuLGwscil7c3dpdGNoKHRoaXMuc3RhdGUpe2Nhc2Uib2ZmIjpyZXR1cm4gdD4wJiYodGhpcy5zdGF0ZT0iYXR0YWNrIix0aGlzLnN0YXJ0VGltZT1zLHRoaXMuc3RhcnRWYWw9MCksMDtjYXNlImF0dGFjayI6e2xldCBwPXMtdGhpcy5zdGFydFRpbWU7cmV0dXJuIHA+aT8odGhpcy5zdGF0ZT0iZGVjYXkiLHRoaXMuc3RhcnRUaW1lPXMsMSk6UihwL2ksdGhpcy5zdGFydFZhbCwxLDEpfWNhc2UiZGVjYXkiOntsZXQgcD1zLXRoaXMuc3RhcnRUaW1lLGE9UihwL24sMSxsLC10aGlzLmRlY2F5Q3VydmUpO3JldHVybiB0PD0wPyh0aGlzLnN0YXRlPSJyZWxlYXNlIix0aGlzLnN0YXJ0VGltZT1zLHRoaXMuc3RhcnRWYWw9YSxhKTpwPm4/KHRoaXMuc3RhdGU9InN1c3RhaW4iLHRoaXMuc3RhcnRUaW1lPXMsbCk6YX1jYXNlInN1c3RhaW4iOnJldHVybiB0PD0wJiYodGhpcy5zdGF0ZT0icmVsZWFzZSIsdGhpcy5zdGFydFRpbWU9cyx0aGlzLnN0YXJ0VmFsPWwpLGw7Y2FzZSJyZWxlYXNlIjp7bGV0IHA9cy10aGlzLnN0YXJ0VGltZTtpZihwPnIpcmV0dXJuIHRoaXMuc3RhdGU9Im9mZiIsMDtsZXQgYT1SKHAvcix0aGlzLnN0YXJ0VmFsLDAsLXRoaXMuZGVjYXlDdXJ2ZSk7cmV0dXJuIHQ+MCYmKHRoaXMuc3RhdGU9ImF0dGFjayIsdGhpcy5zdGFydFRpbWU9cyx0aGlzLnN0YXJ0VmFsPWEpLGF9fXRocm93ImludmFsaWQgZW52ZWxvcGUgc3RhdGUifX1jb25zdCBXPTEwO2NsYXNzIHh7Y29uc3RydWN0b3IoKXtlKHRoaXMsIndyaXRlSWR4IiwwKTtlKHRoaXMsInJlYWRJZHgiLDApO2UodGhpcywiYnVmZmVyIixuZXcgRmxvYXQzMkFycmF5KFcqdSkpfXdyaXRlKHMsdCl7dGhpcy53cml0ZUlkeD0odGhpcy53cml0ZUlkeCsxKSV0aGlzLmJ1ZmZlci5sZW5ndGgsdGhpcy5idWZmZXJbdGhpcy53cml0ZUlkeF09cztsZXQgaT1NYXRoLm1pbihNYXRoLmZsb29yKHUqdCksdGhpcy5idWZmZXIubGVuZ3RoLTEpO3RoaXMucmVhZElkeD10aGlzLndyaXRlSWR4LWksdGhpcy5yZWFkSWR4PDAmJih0aGlzLnJlYWRJZHgrPXRoaXMuYnVmZmVyLmxlbmd0aCl9dXBkYXRlKHMsdCl7cmV0dXJuIHRoaXMud3JpdGUocyx0KSx0aGlzLmJ1ZmZlclt0aGlzLnJlYWRJZHhdfX1jbGFzcyBYe2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJkZWxheSIsbmV3IHgpO2UodGhpcywibW9kdWxhdG9yIixuZXcgayl9dXBkYXRlKHMsdCxpLG4sbCl7Y29uc3Qgcj10aGlzLm1vZHVsYXRvci51cGRhdGUobikqbCxwPXRoaXMuZGVsYXkudXBkYXRlKHMsaSooMStyKSk7cmV0dXJuIE8ocyxwLHQpfX1jbGFzcyAke2NvbnN0cnVjdG9yKCl7ZSh0aGlzLCJob2xkIiwwKTtlKHRoaXMsInQiLDApfXVwZGF0ZShzLHQpe3JldHVybiB0aGlzLnQrKyV0PT09MCYmKHRoaXMudD0wLHRoaXMuaG9sZD1zKSx0aGlzLmhvbGR9fWNsYXNzIFV7dXBkYXRlKHMsdCl7dD1NYXRoLm1heCgxLHQpO2NvbnN0IGk9TWF0aC5wb3coMix0LTEpO3JldHVybiBNYXRoLnJvdW5kKHMqaSkvaX19Y2xhc3MgWXt1cGRhdGUocyx0PTAsaT0xKXtpPU1hdGgubWF4KC4wMDEsTWF0aC5taW4oMSxpKSk7Y29uc3Qgbj1NYXRoLmV4cG0xKHQpO3JldHVybigxK24pKnMvKDErbipNYXRoLmFicyhzKSkqaX19Y2xhc3Mgd3tjb25zdHJ1Y3RvcihzLHQsaSl7ZSh0aGlzLCJidWZmZXIiKTtlKHRoaXMsInNhbXBsZVJhdGUiKTtlKHRoaXMsInBvcyIsMCk7ZSh0aGlzLCJzYW1wbGVGcmVxIixBKCkpO3RoaXMuYnVmZmVyPXMsdGhpcy5zYW1wbGVSYXRlPXQsdGhpcy5kdXJhdGlvbj10aGlzLmJ1ZmZlci5sZW5ndGgvdGhpcy5zYW1wbGVSYXRlLHRoaXMuc3BlZWQ9dS90aGlzLnNhbXBsZVJhdGUsaSYmKHRoaXMuc3BlZWQqPXRoaXMuZHVyYXRpb24pfXVwZGF0ZShzKXtpZih0aGlzLnBvcz49dGhpcy5idWZmZXIubGVuZ3RoKXJldHVybiAwO2NvbnN0IHQ9cy90aGlzLnNhbXBsZUZyZXEqdGhpcy5zcGVlZDtsZXQgaT10aGlzLmJ1ZmZlcltNYXRoLmZsb29yKHRoaXMucG9zKV07cmV0dXJuIHRoaXMucG9zPXRoaXMucG9zK3QsaX19ZSh3LCJzYW1wbGVzIixuZXcgTWFwKTtjb25zdCB5PShoLHM9ImxpbmVhciIsdCk9Pntjb25zdFtyLHAsYSxjXT1oO2lmKHI9PW51bGwmJnA9PW51bGwmJmE9PW51bGwmJmM9PW51bGwpcmV0dXJuIHQ/P1suMDAxLC4wMDEsMSwuMDFdO2NvbnN0IGQ9YT8/KHIhPW51bGwmJnA9PW51bGx8fHI9PW51bGwmJnA9PW51bGw/MTouMDAxKTtyZXR1cm5bTWF0aC5tYXgocj8/MCwuMDAxKSxNYXRoLm1heChwPz8wLC4wMDEpLE1hdGgubWluKGQsMSksTWF0aC5tYXgoYz8/MCwuMDEpXX07bGV0IEQ9e3NpbmU6ZyxzYXc6Uyx6YXc6SSxzYXd0b290aDpTLHphd3Rvb3RoOkksc3VwZXJzYXc6Rix0cmk6ayx0cmlhbmdsZTprLHB1bHNlOkMsc3F1YXJlOkMscHVsemU6TCxkdXN0OlAsY3JhY2tsZTpQLGltcHVsc2U6Qix3aGl0ZTpOLGJyb3duOkcscGluazpqfTtjb25zdCBaPXtjaG9ydXM6MCxub3RlOjQ4LHM6InRyaWFuZ2xlIixiYW5rOiIiLGdhaW46MSxwb3N0Z2FpbjoxLHZlbG9jaXR5OjEsZGVuc2l0eToiLjAzIixmdHlwZToiMTJkYiIsZmFuY2hvcjowLHJlc29uYW5jZTowLGhyZXNvbmFuY2U6MCxiYW5kcTowLGNoYW5uZWxzOlsxLDJdLHBoYXNlcmRlcHRoOi43NSxzaGFwZXZvbDoxLGRpc3RvcnR2b2w6MSxkZWxheTowLGJ5dGVCZWF0RXhwcmVzc2lvbjoiMCIsZGVsYXlmZWVkYmFjazouNSxkZWxheXNwZWVkOjEsZGVsYXl0aW1lOi4yNSxvcmJpdDoxLGk6MSxmZnQ6OCx6OiJ0cmlhbmdsZSIscGFuOi41LGZtaDoxLGZtZW52OjAsc3BlZWQ6MSxwdzouNX07bGV0IG89aD0+WltoXTtjb25zdCBIPXtjOjAsZDoyLGU6NCxmOjUsZzo3LGE6OSxiOjExfSxKPXsiIyI6MSxiOi0xLHM6MSxmOi0xfSxLPShoLHM9Myk9Pnt2YXIgYTtsZXRbdCxpPSIiLG49IiJdPSgoYT1TdHJpbmcoaCkubWF0Y2goL14oW2EtZ0EtR10pKFsjYnNmXSopKFswLTldKikkLykpPT1udWxsP3ZvaWQgMDphLnNsaWNlKDEpKXx8W107aWYoIXQpdGhyb3cgbmV3IEVycm9yKCdub3QgYSBub3RlOiAiJytoKyciJyk7Y29uc3QgbD1IW3QudG9Mb3dlckNhc2UoKV0scj0oaT09bnVsbD92b2lkIDA6aS5zcGxpdCgiIikucmVkdWNlKChjLGQpPT5jK0pbZF0sMCkpfHwwO3JldHVybihOdW1iZXIobnx8cykrMSkqMTIrbCtyfSxRPWg9Pk1hdGgucG93KDIsKGgtNjkpLzEyKSo0NDAsQT1oPT4oaD1ofHxvKCJub3RlIiksdHlwZW9mIGg9PSJzdHJpbmciJiYoaD1LKGgsMykpLFEoaCkpO2NsYXNzIHR0e2NvbnN0cnVjdG9yKHMpe2UodGhpcywiaWQiLDApO2UodGhpcywib3V0IixbMCwwXSk7ZSh0aGlzLCJhdHRhY2siKTtlKHRoaXMsImRlY2F5Iik7ZSh0aGlzLCJzdXN0YWluIik7ZSh0aGlzLCJyZWxlYXNlIik7ZSh0aGlzLCJfYmVnaW4iKTtlKHRoaXMsIl9kdXJhdGlvbiIpO2UodGhpcywiX3NvdW5kIik7ZSh0aGlzLCJfY2hhbm5lbHMiLDEpO2UodGhpcywiX2J1ZmZlcnMiKTtlKHRoaXMsInVuaXQiKTtlKHRoaXMsIl9wZW52Iik7ZSh0aGlzLCJwZW52Iik7ZSh0aGlzLCJwYXR0YWNrIik7ZSh0aGlzLCJwZGVjYXkiKTtlKHRoaXMsInBzdXN0YWluIik7ZSh0aGlzLCJwcmVsZWFzZSIpO2UodGhpcywidmliIik7ZSh0aGlzLCJfdmliIik7ZSh0aGlzLCJ2aWJtb2QiKTtlKHRoaXMsIl9mbSIpO2UodGhpcywiZm1oIik7ZSh0aGlzLCJmbWkiKTtlKHRoaXMsIl9mbWVudiIpO2UodGhpcywiZm1hdHRhY2siKTtlKHRoaXMsImZtZGVjYXkiKTtlKHRoaXMsImZtc3VzdGFpbiIpO2UodGhpcywiZm1yZWxlYXNlIik7ZSh0aGlzLCJfbHBlbnYiKTtlKHRoaXMsImxwZW52Iik7ZSh0aGlzLCJscGF0dGFjayIpO2UodGhpcywibHBkZWNheSIpO2UodGhpcywibHBzdXN0YWluIik7ZSh0aGlzLCJscHJlbGVhc2UiKTtlKHRoaXMsIl9ocGVudiIpO2UodGhpcywiaHBlbnYiKTtlKHRoaXMsImhwYXR0YWNrIik7ZSh0aGlzLCJocGRlY2F5Iik7ZSh0aGlzLCJocHN1c3RhaW4iKTtlKHRoaXMsImhwcmVsZWFzZSIpO2UodGhpcywiX2JwZW52Iik7ZSh0aGlzLCJicGVudiIpO2UodGhpcywiYnBhdHRhY2siKTtlKHRoaXMsImJwZGVjYXkiKTtlKHRoaXMsImJwc3VzdGFpbiIpO2UodGhpcywiYnByZWxlYXNlIik7ZSh0aGlzLCJjdXRvZmYiKTtlKHRoaXMsImhjdXRvZmYiKTtlKHRoaXMsImJhbmRmIik7ZSh0aGlzLCJjb2Fyc2UiKTtlKHRoaXMsImNydXNoIik7ZSh0aGlzLCJkaXN0b3J0Iik7ZSh0aGlzLCJmcmVxIik7ZSh0aGlzLCJub3RlIik7ZSh0aGlzLCJfbHBmIik7ZSh0aGlzLCJfaHBmIik7ZSh0aGlzLCJfYnBmIik7ZSh0aGlzLCJfY2hvcnVzIik7ZSh0aGlzLCJfY29hcnNlIik7ZSh0aGlzLCJfY3J1c2giKTtlKHRoaXMsIl9kaXN0b3J0Iik7dmFyIGksbixsLHIscCxhLGM7dGhpcy5mcmVxPz8odGhpcy5mcmVxPUEocy5ub3RlKSksdGhpcy5fYmVnaW49cy5fYmVnaW4sdGhpcy5fZHVyYXRpb249cy5fZHVyYXRpb24sdGhpcy5yZWxlYXNlPXMucmVsZWFzZT8/MDtsZXQgdD10aGlzO2lmKE9iamVjdC5hc3NpZ24odCxzKSx0LnM9dC5zPz9vKCJzIiksdC5nYWluPV8odC5nYWluPz9vKCJnYWluIikpLHQudmVsb2NpdHk9Xyh0LnZlbG9jaXR5Pz9vKCJ2ZWxvY2l0eSIpKSx0LnBvc3RnYWluPV8odC5wb3N0Z2Fpbj8/bygicG9zdGdhaW4iKSksdC5kZW5zaXR5PXQuZGVuc2l0eT8/bygiZGVuc2l0eSIpLHQuZmFuY2hvcj10LmZhbmNob3I/P28oImZhbmNob3IiKSx0LmRyaXZlPXQuZHJpdmU/Py42OSx0LnBoYXNlcmRlcHRoPXQucGhhc2VyZGVwdGg/P28oInBoYXNlcmRlcHRoIiksdC5zaGFwZXZvbD1fKHQuc2hhcGV2b2w/P28oInNoYXBldm9sIikpLHQuZGlzdG9ydHZvbD1fKHQuZGlzdG9ydHZvbD8/bygiZGlzdG9ydHZvbCIpKSx0Lmk9dC5pPz9vKCJpIiksdC5jaG9ydXM9dC5jaG9ydXM/P28oImNob3J1cyIpLHQuZmZ0PXQuZmZ0Pz9vKCJmZnQiKSx0LnBhbj10LnBhbj8/bygicGFuIiksdC5vcmJpdD10Lm9yYml0Pz9vKCJvcmJpdCIpLHQuZm1lbnY9dC5mbWVudj8/bygiZm1lbnYiKSx0LnJlc29uYW5jZT10LnJlc29uYW5jZT8/bygicmVzb25hbmNlIiksdC5ocmVzb25hbmNlPXQuaHJlc29uYW5jZT8/bygiaHJlc29uYW5jZSIpLHQuYmFuZHE9dC5iYW5kcT8/bygiYmFuZHEiKSx0LnNwZWVkPXQuc3BlZWQ/P28oInNwZWVkIiksdC5wdz10LnB3Pz9vKCJwdyIpLFt0LmF0dGFjayx0LmRlY2F5LHQuc3VzdGFpbix0LnJlbGVhc2VdPXkoW3QuYXR0YWNrLHQuZGVjYXksdC5zdXN0YWluLHQucmVsZWFzZV0pLHQuX2hvbGRFbmQ9dC5fYmVnaW4rdC5fZHVyYXRpb24sdC5fZW5kPXQuX2hvbGRFbmQrdC5yZWxlYXNlKy4wMSx0LmZtaSYmKHQucz09PSJzYXcifHx0LnM9PT0ic2F3dG9vdGgiKSYmKHQucz0iemF3IiksRFt0LnNdKXtjb25zdCBkPURbdC5zXTt0Ll9zb3VuZD1uZXcgZCx0Ll9jaGFubmVscz0xfWVsc2UgaWYody5zYW1wbGVzLmhhcyh0LnMpKXtjb25zdCBkPXcuc2FtcGxlcy5nZXQodC5zKTt0Ll9idWZmZXJzPVtdLHQuX2NoYW5uZWxzPWQuY2hhbm5lbHMubGVuZ3RoO2ZvcihsZXQgYj0wO2I8dC5fY2hhbm5lbHM7YisrKXQuX2J1ZmZlcnMucHVzaChuZXcgdyhkLmNoYW5uZWxzW2JdLGQuc2FtcGxlUmF0ZSx0LnVuaXQ9PT0iYyIpKX1lbHNlIGNvbnNvbGUud2Fybigic291bmQgbm90IGxvYWRlZCIsdC5zKTt0LnBlbnYmJih0Ll9wZW52PW5ldyB2KHtkZWNheUN1cnZlOjR9KSxbdC5wYXR0YWNrLHQucGRlY2F5LHQucHN1c3RhaW4sdC5wcmVsZWFzZV09eShbdC5wYXR0YWNrLHQucGRlY2F5LHQucHN1c3RhaW4sdC5wcmVsZWFzZV0pKSx0LnZpYiYmKHQuX3ZpYj1uZXcgZyx0LnZpYm1vZD10LnZpYm1vZD8/bygidmlibW9kIikpLHQuZm1pJiYodC5fZm09bmV3IGcsdC5mbWg9dC5mbWg/P28oImZtaCIpLHQuZm1lbnYmJih0Ll9mbWVudj1uZXcgdih7ZGVjYXlDdXJ2ZToyfSksW3QuZm1hdHRhY2ssdC5mbWRlY2F5LHQuZm1zdXN0YWluLHQuZm1yZWxlYXNlXT15KFt0LmZtYXR0YWNrLHQuZm1kZWNheSx0LmZtc3VzdGFpbix0LmZtcmVsZWFzZV0pKSksdC5fYWRzcj1uZXcgdih7ZGVjYXlDdXJ2ZToyfSksdC5kZWxheT1fKHQuZGVsYXk/P28oImRlbGF5IikpLHQuZGVsYXlmZWVkYmFjaz10LmRlbGF5ZmVlZGJhY2s/P28oImRlbGF5ZmVlZGJhY2siKSx0LmRlbGF5c3BlZWQ9dC5kZWxheXNwZWVkPz9vKCJkZWxheXNwZWVkIiksdC5kZWxheXRpbWU9dC5kZWxheXRpbWU/P28oImRlbGF5dGltZSIpLHQubHBlbnYmJih0Ll9scGVudj1uZXcgdih7ZGVjYXlDdXJ2ZTo0fSksW3QubHBhdHRhY2ssdC5scGRlY2F5LHQubHBzdXN0YWluLHQubHByZWxlYXNlXT15KFt0LmxwYXR0YWNrLHQubHBkZWNheSx0Lmxwc3VzdGFpbix0LmxwcmVsZWFzZV0pKSx0LmhwZW52JiYodC5faHBlbnY9bmV3IHYoe2RlY2F5Q3VydmU6NH0pLFt0LmhwYXR0YWNrLHQuaHBkZWNheSx0Lmhwc3VzdGFpbix0LmhwcmVsZWFzZV09eShbdC5ocGF0dGFjayx0LmhwZGVjYXksdC5ocHN1c3RhaW4sdC5ocHJlbGVhc2VdKSksdC5icGVudiYmKHQuX2JwZW52PW5ldyB2KHtkZWNheUN1cnZlOjR9KSxbdC5icGF0dGFjayx0LmJwZGVjYXksdC5icHN1c3RhaW4sdC5icHJlbGVhc2VdPXkoW3QuYnBhdHRhY2ssdC5icGRlY2F5LHQuYnBzdXN0YWluLHQuYnByZWxlYXNlXSkpLHQuX2Nob3J1cz10LmNob3J1cz9bXTpudWxsLHQuX2xwZj10LmN1dG9mZj9bXTpudWxsLHQuX2hwZj10LmhjdXRvZmY/W106bnVsbCx0Ll9icGY9dC5iYW5kZj9bXTpudWxsLHQuX2NvYXJzZT10LmNvYXJzZT9bXTpudWxsLHQuX2NydXNoPXQuY3J1c2g/W106bnVsbCx0Ll9kaXN0b3J0PXQuZGlzdG9ydD9bXTpudWxsO2ZvcihsZXQgZD0wO2Q8dGhpcy5fY2hhbm5lbHM7ZCsrKShpPXQuX2xwZik9PW51bGx8fGkucHVzaChuZXcgcSksKG49dC5faHBmKT09bnVsbHx8bi5wdXNoKG5ldyBxKSwobD10Ll9icGYpPT1udWxsfHxsLnB1c2gobmV3IHEpLChyPXQuX2Nob3J1cyk9PW51bGx8fHIucHVzaChuZXcgWCksKHA9dC5fY29hcnNlKT09bnVsbHx8cC5wdXNoKG5ldyAkKSwoYT10Ll9jcnVzaCk9PW51bGx8fGEucHVzaChuZXcgVSksKGM9dC5fZGlzdG9ydCk9PW51bGx8fGMucHVzaChuZXcgWSl9dXBkYXRlKHMpe2lmKCF0aGlzLl9zb3VuZCYmIXRoaXMuX2J1ZmZlcnMpcmV0dXJuIDA7bGV0IHQ9KyhzPj10aGlzLl9iZWdpbiYmczw9dGhpcy5faG9sZEVuZCksaT10aGlzLmZyZXEqdGhpcy5zcGVlZDtpZih0aGlzLl9mbSYmdGhpcy5mbWghPT12b2lkIDAmJnRoaXMuZm1pIT09dm9pZCAwKXtsZXQgYT10aGlzLmZtaTtpZih0aGlzLl9mbWVudil7Y29uc3QgYj10aGlzLl9mbWVudi51cGRhdGUocyx0LHRoaXMuZm1hdHRhY2ssdGhpcy5mbWRlY2F5LHRoaXMuZm1zdXN0YWluLHRoaXMuZm1yZWxlYXNlKTthPXRoaXMuZm1lbnYqYiphfWNvbnN0IGM9aSp0aGlzLmZtaCxkPWMqYTtpPWkrdGhpcy5fZm0udXBkYXRlKGMpKmR9aWYodGhpcy5fdmliJiZ0aGlzLnZpYm1vZCE9PXZvaWQgMCYmKGk9aSoyKioodGhpcy5fdmliLnVwZGF0ZSh0aGlzLnZpYikqdGhpcy52aWJtb2QvMTIpKSx0aGlzLl9wZW52JiZ0aGlzLnBlbnYhPT12b2lkIDApe2NvbnN0IGE9dGhpcy5fcGVudi51cGRhdGUocyx0LHRoaXMucGF0dGFjayx0aGlzLnBkZWNheSx0aGlzLnBzdXN0YWluLHRoaXMucHJlbGVhc2UpO2k9aSthKnRoaXMucGVudn1sZXQgbj10aGlzLmN1dG9mZjtpZihuIT09dm9pZCAwJiZ0aGlzLl9scGVudil7Y29uc3QgYT10aGlzLl9scGVudi51cGRhdGUocyx0LHRoaXMubHBhdHRhY2ssdGhpcy5scGRlY2F5LHRoaXMubHBzdXN0YWluLHRoaXMubHByZWxlYXNlKTtuPXRoaXMubHBlbnYqYSpuK259bGV0IGw9dGhpcy5oY3V0b2ZmO2lmKGwhPT12b2lkIDAmJnRoaXMuX2hwZW52JiZ0aGlzLmhwZW52IT09dm9pZCAwKXtjb25zdCBhPXRoaXMuX2hwZW52LnVwZGF0ZShzLHQsdGhpcy5ocGF0dGFjayx0aGlzLmhwZGVjYXksdGhpcy5ocHN1c3RhaW4sdGhpcy5ocHJlbGVhc2UpO2w9MioqdGhpcy5ocGVudiphKmwrbH1sZXQgcj10aGlzLmJhbmRmO2lmKHIhPT12b2lkIDAmJnRoaXMuX2JwZW52JiZ0aGlzLmJwZW52IT09dm9pZCAwKXtjb25zdCBhPXRoaXMuX2JwZW52LnVwZGF0ZShzLHQsdGhpcy5icGF0dGFjayx0aGlzLmJwZGVjYXksdGhpcy5icHN1c3RhaW4sdGhpcy5icHJlbGVhc2UpO3I9MioqdGhpcy5icGVudiphKnIrcn1jb25zdCBwPXRoaXMuX2Fkc3IudXBkYXRlKHMsdCx0aGlzLmF0dGFjayx0aGlzLmRlY2F5LHRoaXMuc3VzdGFpbix0aGlzLnJlbGVhc2UpO2ZvcihsZXQgYT0wO2E8dGhpcy5fY2hhbm5lbHM7YSsrKXtpZih0aGlzLl9zb3VuZCYmdGhpcy5zPT09InB1bHNlIj90aGlzLm91dFthXT10aGlzLl9zb3VuZC51cGRhdGUoaSx0aGlzLnB3KTp0aGlzLl9zb3VuZD90aGlzLm91dFthXT10aGlzLl9zb3VuZC51cGRhdGUoaSk6dGhpcy5fYnVmZmVycyYmKHRoaXMub3V0W2FdPXRoaXMuX2J1ZmZlcnNbYV0udXBkYXRlKGkpKSx0aGlzLm91dFthXT10aGlzLm91dFthXSp0aGlzLmdhaW4qdGhpcy52ZWxvY2l0eSx0aGlzLl9jaG9ydXMpe2NvbnN0IGM9dGhpcy5fY2hvcnVzW2FdLnVwZGF0ZSh0aGlzLm91dFthXSx0aGlzLmNob3J1cywuMDMrLjA1KmEsMSwuMTEpO3RoaXMub3V0W2FdPWMrdGhpcy5vdXRbYV19dGhpcy5fbHBmJiYodGhpcy5fbHBmW2FdLnVwZGF0ZSh0aGlzLm91dFthXSxuLHRoaXMucmVzb25hbmNlKSx0aGlzLm91dFthXT10aGlzLl9scGZbYV0uczEpLHRoaXMuX2hwZiYmKHRoaXMuX2hwZlthXS51cGRhdGUodGhpcy5vdXRbYV0sbCx0aGlzLmhyZXNvbmFuY2UpLHRoaXMub3V0W2FdPXRoaXMub3V0W2FdLXRoaXMuX2hwZlthXS5zMSksdGhpcy5fYnBmJiYodGhpcy5fYnBmW2FdLnVwZGF0ZSh0aGlzLm91dFthXSxyLHRoaXMuYmFuZHEpLHRoaXMub3V0W2FdPXRoaXMuX2JwZlthXS5zMCksdGhpcy5fY29hcnNlJiYodGhpcy5vdXRbYV09dGhpcy5fY29hcnNlW2FdLnVwZGF0ZSh0aGlzLm91dFthXSx0aGlzLmNvYXJzZSkpLHRoaXMuX2NydXNoJiYodGhpcy5vdXRbYV09dGhpcy5fY3J1c2hbYV0udXBkYXRlKHRoaXMub3V0W2FdLHRoaXMuY3J1c2gpKSx0aGlzLl9kaXN0b3J0JiYodGhpcy5vdXRbYV09dGhpcy5fZGlzdG9ydFthXS51cGRhdGUodGhpcy5vdXRbYV0sdGhpcy5kaXN0b3J0LHRoaXMuZGlzdG9ydHZvbCkpLHRoaXMub3V0W2FdPXRoaXMub3V0W2FdKnAsdGhpcy5vdXRbYV09dGhpcy5vdXRbYV0qdGhpcy5wb3N0Z2Fpbix0aGlzLl9idWZmZXJzfHwodGhpcy5vdXRbYV09dGhpcy5vdXRbYV0qLjIpfWlmKHRoaXMuX2NoYW5uZWxzPT09MSYmKHRoaXMub3V0WzFdPXRoaXMub3V0WzBdKSx0aGlzLnBhbiE9PS41KXtjb25zdCBhPXRoaXMucGFuKk1hdGguUEkvMjt0aGlzLm91dFswXT10aGlzLm91dFswXSpNYXRoLmNvcyhhKSx0aGlzLm91dFsxXT10aGlzLm91dFsxXSpNYXRoLnNpbihhKX19fWNsYXNzIHN0e2NvbnN0cnVjdG9yKHM9NDhlMyx0PTApe2UodGhpcywidm9pY2VzIixbXSk7ZSh0aGlzLCJ2aWQiLDApO2UodGhpcywicSIsW10pO2UodGhpcywib3V0IixbMCwwXSk7ZSh0aGlzLCJkZWxheXNlbmQiLFswLDBdKTtlKHRoaXMsImRlbGF5dGltZSIsbygiZGVsYXl0aW1lIikpO2UodGhpcywiZGVsYXlmZWVkYmFjayIsbygiZGVsYXlmZWVkYmFjayIpKTtlKHRoaXMsImRlbGF5c3BlZWQiLG8oImRlbGF5c3BlZWQiKSk7ZSh0aGlzLCJ0IiwwKTt0aGlzLnNhbXBsZVJhdGU9cyx0aGlzLnQ9TWF0aC5mbG9vcih0KnMpLHRoaXMuX2RlbGF5TD1uZXcgeCx0aGlzLl9kZWxheVI9bmV3IHh9bG9hZFNhbXBsZShzLHQsaSl7dy5zYW1wbGVzLnNldChzLHtjaGFubmVsczp0LHNhbXBsZVJhdGU6aX0pfXNjaGVkdWxlU3Bhd24ocyl7aWYocy5fYmVnaW49PT12b2lkIDApdGhyb3cgbmV3IEVycm9yKCJbZG91Z2hdOiBzY2hlZHVsZVNwYXduIGV4cGVjdGVkIF9iZWdpbiB0byBiZSBzZXQiKTtpZihzLl9kdXJhdGlvbj09PXZvaWQgMCl0aHJvdyBuZXcgRXJyb3IoIltkb3VnaF06IHNjaGVkdWxlU3Bhd24gZXhwZWN0ZWQgX2R1cmF0aW9uIHRvIGJlIHNldCIpO3Muc2FtcGxlUmF0ZT10aGlzLnNhbXBsZVJhdGU7Y29uc3QgdD1NYXRoLmZsb29yKHMuX2JlZ2luKnRoaXMuc2FtcGxlUmF0ZSk7dGhpcy5zY2hlZHVsZSh7dGltZTp0LHR5cGU6InNwYXduIixhcmc6c30pfXNwYXduKHMpe3MuaWQ9dGhpcy52aWQrKztjb25zdCB0PW5ldyB0dChzKTt0aGlzLnZvaWNlcy5wdXNoKHQpO2NvbnN0IGk9TWF0aC5jZWlsKHQuX2VuZCp0aGlzLnNhbXBsZVJhdGUpO3RoaXMuc2NoZWR1bGUoe3RpbWU6aSx0eXBlOiJkZXNwYXduIixhcmc6dC5pZH0pfWRlc3Bhd24ocyl7dGhpcy52b2ljZXM9dGhpcy52b2ljZXMuZmlsdGVyKHQ9PnQuaWQhPT1zKX1zY2hlZHVsZShzKXtpZighdGhpcy5xLmxlbmd0aCl7dGhpcy5xLnB1c2gocyk7cmV0dXJufWxldCB0PTA7Zm9yKDt0PHRoaXMucS5sZW5ndGgmJnRoaXMucVt0XS50aW1lPHMudGltZTspdCsrO3RoaXMucS5zcGxpY2UodCwwLHMpfXVwZGF0ZSgpe2Zvcig7dGhpcy5xLmxlbmd0aD4wJiZ0aGlzLnFbMF0udGltZTw9dGhpcy50Oyl0aGlzW3RoaXMucVswXS50eXBlXSh0aGlzLnFbMF0uYXJnKSx0aGlzLnEuc2hpZnQoKTt0aGlzLm91dFswXT0wLHRoaXMub3V0WzFdPTA7Zm9yKGxldCBpPTA7aTx0aGlzLnZvaWNlcy5sZW5ndGg7aSsrKXRoaXMudm9pY2VzW2ldLnVwZGF0ZSh0aGlzLnQvdGhpcy5zYW1wbGVSYXRlKSx0aGlzLm91dFswXSs9dGhpcy52b2ljZXNbaV0ub3V0WzBdLHRoaXMub3V0WzFdKz10aGlzLnZvaWNlc1tpXS5vdXRbMV0sdGhpcy52b2ljZXNbaV0uZGVsYXkmJih0aGlzLmRlbGF5c2VuZFswXSs9dGhpcy52b2ljZXNbaV0ub3V0WzBdKnRoaXMudm9pY2VzW2ldLmRlbGF5LHRoaXMuZGVsYXlzZW5kWzFdKz10aGlzLnZvaWNlc1tpXS5vdXRbMV0qdGhpcy52b2ljZXNbaV0uZGVsYXksdGhpcy5kZWxheXRpbWU9dGhpcy52b2ljZXNbaV0uZGVsYXl0aW1lLHRoaXMuZGVsYXlzcGVlZD10aGlzLnZvaWNlc1tpXS5kZWxheXNwZWVkLHRoaXMuZGVsYXlmZWVkYmFjaz10aGlzLnZvaWNlc1tpXS5kZWxheWZlZWRiYWNrKTtjb25zdCBzPXRoaXMuX2RlbGF5TC51cGRhdGUodGhpcy5kZWxheXNlbmRbMF0sdGhpcy5kZWxheXRpbWUpLHQ9dGhpcy5fZGVsYXlSLnVwZGF0ZSh0aGlzLmRlbGF5c2VuZFsxXSx0aGlzLmRlbGF5dGltZSk7dGhpcy5kZWxheXNlbmRbMF09cyp0aGlzLmRlbGF5ZmVlZGJhY2ssdGhpcy5kZWxheXNlbmRbMV09dCp0aGlzLmRlbGF5ZmVlZGJhY2ssdGhpcy5vdXRbMF0rPXMsdGhpcy5vdXRbMV0rPXQsdGhpcy50Kyt9fWNvbnN0IGV0PShoLHMsdCk9Pk1hdGgubWluKE1hdGgubWF4KGgscyksdCk7Y2xhc3MgaXQgZXh0ZW5kcyBBdWRpb1dvcmtsZXRQcm9jZXNzb3J7Y29uc3RydWN0b3IoKXtzdXBlcigpLHRoaXMuZG91Z2g9bmV3IHN0KHNhbXBsZVJhdGUsY3VycmVudFRpbWUpLHRoaXMucG9ydC5vbm1lc3NhZ2U9cz0+e3MuZGF0YS5zcGF3bj90aGlzLmRvdWdoLnNjaGVkdWxlU3Bhd24ocy5kYXRhLnNwYXduKTpzLmRhdGEuc2FtcGxlP3RoaXMuZG91Z2gubG9hZFNhbXBsZShzLmRhdGEuc2FtcGxlLHMuZGF0YS5jaGFubmVscyxzLmRhdGEuc2FtcGxlUmF0ZSk6cy5kYXRhLnNhbXBsZXM/cy5kYXRhLnNhbXBsZXMuZm9yRWFjaCgoW3QsaSxuXSk9Pnt0aGlzLmRvdWdoLmxvYWRTYW1wbGUodCxpLG4pfSk6Y29uc29sZS5sb2coInVucmVjb2duaXplZCBldmVudCB0eXBlIixzLmRhdGEpfX1wcm9jZXNzKHMsdCxpKXtpZih0aGlzLmRpc2Nvbm5lY3RlZClyZXR1cm4hMTtjb25zdCBuPXRbMF07Zm9yKGxldCBsPTA7bDxuWzBdLmxlbmd0aDtsKyspe3RoaXMuZG91Z2gudXBkYXRlKCk7Zm9yKGxldCByPTA7cjxuLmxlbmd0aDtyKyspbltyXVtsXT1ldCh0aGlzLmRvdWdoLm91dFtyXSwtMSwxKX1yZXR1cm4hMH19cmVnaXN0ZXJQcm9jZXNzb3IoImRvdWdoLXByb2Nlc3NvciIsaXQpfSkoKTsK";
typeof sampleRate < "u" ? sampleRate : 48e3;
const us = H$1;
let b;
function F() {
  const e = x$1();
  b = I(
    e,
    "dough-processor",
    {},
    {
      outputChannelCount: [2]
    }
  ), qo(b);
}
const v = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map();
f.prototype.supradough = function() {
  return this.onTrigger((e, o, n, t2) => {
    e.value._begin = t2, e.value._duration = e.duration / n, !b && F();
    const s = (e.value.bank ? e.value.bank + "_" : "") + e.value.s, r = e.value.n ?? 0, l2 = `${s}:${r}`;
    if (v.has(s) && (e.value.s = l2), v.has(s) && !k.has(l2)) {
      const a = v.get(s), u = a[r % a.length];
      console.log(`load ${l2} from ${u}`);
      const d2 = K(u);
      k.set(l2, d2), d2.then(
        ({ channels: i2, sampleRate: f2 }) => b.port.postMessage({
          sample: l2,
          channels: i2,
          sampleRate: f2
        })
      );
    }
    b.port.postMessage({ spawn: e.value });
  }, 1);
};
function U(e, o = "") {
  if (!e.startsWith("github:"))
    throw new Error('expected "github:" at the start of pseudoUrl');
  let [n, t2] = e.split("github:");
  return t2 = t2.endsWith("/") ? t2.slice(0, -1) : t2, t2.split("/").length === 2 && (t2 += "/main"), `https://raw.githubusercontent.com/${t2}/${o}`;
}
async function G$1(e) {
  if (e.startsWith("github:") && (e = U(e, "strudel.json")), e.startsWith("local:") && (e = "http://localhost:5432"), e.startsWith("shabda:")) {
    let [t2, s] = e.split("shabda:");
    e = `https://shabda.ndre.gr/${s}.json?strudel=1`;
  }
  if (e.startsWith("shabda/speech")) {
    let [t2, s] = e.split("shabda/speech");
    s = s.startsWith("/") ? s.substring(1) : s;
    let [r, l2] = s.split(":"), a = "f", u = "en-GB";
    r && ([u, a] = r.split("/")), e = `https://shabda.ndre.gr/speech/${l2}.json?gender=${a}&language=${u}&strudel=1'`;
  }
  if (typeof fetch != "function")
    return;
  const o = e.split("/").slice(0, -1).join("/");
  if (typeof fetch > "u")
    return;
  const n = await fetch(e).then((t2) => t2.json()).catch((t2) => {
    throw console.error(t2), new Error(`error loading "${e}"`);
  });
  return [n, n._base || o];
}
async function K(e) {
  const o = await fetch(e).then((t2) => t2.arrayBuffer()).then((t2) => x$1().decodeAudioData(t2));
  let n = [];
  for (let t2 = 0; t2 < o.numberOfChannels; t2++)
    n.push(o.getChannelData(t2));
  return { channels: n, sampleRate: o.sampleRate };
}
async function L(e, o) {
  if (typeof e == "string") {
    const [n, t2] = await G$1(e);
    return L(n, t2);
  }
  Object.entries(e).map(async ([n, t2]) => {
    n !== "_base" && (t2 = t2.map((s) => o + s), v.set(n, t2));
  });
}
Do(us);
const { Pattern: V, logger: H, repl: J$1 } = Core;
Fo(H);
const N = (e) => (e.ensureObjectValue(), e.value), Q$1 = (e, o, n, t2, s) => {
  var _a2;
  return Go(N(e), s, n, t2, (_a2 = e.whole) == null ? void 0 : _a2.begin.valueOf());
};
function ne(e = {}) {
  return e = {
    getTime: () => x$1().currentTime,
    defaultOutput: Q$1,
    ...e
  }, J$1(e);
}
V.prototype.dough = function() {
  return this.onTrigger(cc, 1);
};
function X$1(e, {
  align: o = true,
  color: n = "white",
  thickness: t2 = 3,
  scale: s = 0.25,
  pos: r = 0.75,
  trigger: l2 = 0,
  ctx: a = Z$2(),
  id: u = 1
} = {}) {
  a.lineWidth = t2, a.strokeStyle = n;
  let d2 = a.canvas;
  if (!e) {
    a.beginPath();
    let c = r * d2.height;
    a.moveTo(0, c), a.lineTo(d2.width, c), a.stroke();
    return;
  }
  const i2 = $o("time", u);
  a.beginPath();
  const f2 = e.frequencyBinCount;
  let p = o ? Array.from(i2).findIndex((c, g, y) => g && y[g - 1] > -l2 && c <= -l2) : 0;
  p = Math.max(p, 0);
  const w2 = d2.width * 1 / f2;
  let h2 = 0;
  for (let c = p; c < f2; c++) {
    const g = i2[c] + 1, y = (r - s * (g - 1)) * d2.height;
    c === 0 ? a.moveTo(h2, y) : a.lineTo(h2, y), h2 += w2;
  }
  a.stroke();
}
function Y$1(e, { color: o = "white", scale: n = 0.25, pos: t2 = 0.75, lean: s = 0.5, min: r = -150, max: l2 = 0, ctx: a = Z$2(), id: u = 1 } = {}) {
  if (!e) {
    a.beginPath();
    let h2 = t2 * i2.height;
    a.moveTo(0, h2), a.lineTo(i2.width, h2), a.stroke();
    return;
  }
  const d2 = $o("frequency", u), i2 = a.canvas;
  a.fillStyle = o;
  const f2 = e.frequencyBinCount, p = i2.width * 1 / f2;
  let w2 = 0;
  for (let h2 = 0; h2 < f2; h2++) {
    const g = He$1((d2[h2] - r) / (l2 - r), 0, 1) * n, y = g * i2.height, M2 = (t2 - g * s) * i2.height;
    a.fillRect(w2, M2, Math.max(p, 1), y), w2 += p;
  }
}
function j(e = 0, o = "0,0,0", n = Z$2()) {
  e ? (n.fillStyle = `rgba(${o},${1 - e})`, n.fillRect(0, 0, n.canvas.width, n.canvas.height)) : n.clearRect(0, 0, n.canvas.width, n.canvas.height);
}
f.prototype.fscope = function(e = {}) {
  let o = e.id ?? 1;
  return this.analyze(o).draw(
    () => {
      j(e.smear, "0,0,0", e.ctx), v$1[o] && Y$1(v$1[o], e);
    },
    { id: o }
  );
};
f.prototype.tscope = function(e = {}) {
  let o = e.id ?? 1;
  return this.analyze(o).draw(
    (n) => {
      var _a2, _b;
      e.color = ((_b = (_a2 = n[0]) == null ? void 0 : _a2.value) == null ? void 0 : _b.color) || W$2().foreground, e.color, j(e.smear, "0,0,0", e.ctx), X$1(v$1[o], e);
    },
    { id: o }
  );
};
f.prototype.scope = f.prototype.tscope;
let _ = {};
f.prototype.spectrum = function(e = {}) {
  let o = e.id ?? 1;
  return this.analyze(o).draw(
    (n) => {
      var _a2, _b;
      e.color = ((_b = (_a2 = n[0]) == null ? void 0 : _a2.value) == null ? void 0 : _b.color) || _[o] || W$2().foreground, _[o] = e.color, Z(v$1[o], e);
    },
    { id: o }
  );
};
f.prototype.scope = f.prototype.tscope;
const $ = /* @__PURE__ */ new Map();
function Z(e, { thickness: o = 3, speed: n = 1, min: t2 = -80, max: s = 0, ctx: r = Z$2(), id: l2 = 1, color: a } = {}) {
  if (r.lineWidth = o, r.strokeStyle = a, !e)
    return;
  const u = n, d2 = $o("frequency", l2), i2 = r.canvas;
  r.fillStyle = a;
  const f2 = e.frequencyBinCount;
  let p = $.get(l2) || r.getImageData(0, 0, i2.width, i2.height);
  $.set(l2, p), r.clearRect(0, 0, r.canvas.width, r.canvas.height), r.putImageData(p, -u, 0);
  let w2 = i2.width - n;
  for (let h2 = 0; h2 < f2; h2++) {
    const c = He$1((d2[h2] - t2) / (s - t2), 0, 1);
    r.globalAlpha = c;
    const g = Math.log(h2 + 1) / Math.log(f2) * i2.height;
    r.fillRect(w2, i2.height - g, u, 2);
  }
  $.set(l2, r.getImageData(0, 0, i2.width, i2.height));
}
const Webaudio = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DEFAULT_MAX_POLYPHONY: Ce,
  Warpmode: Ge,
  aliasBank: Jo,
  get analysers() {
    return v$1;
  },
  get analysersData() {
    return ot;
  },
  applyFM: Kt,
  applyGainCurve: E,
  applyParameterModulators: be,
  connectToDestination: qo,
  createFilter: Ht,
  destroyAudioWorkletNode: it,
  distortionAlgorithms: Se,
  dough: oc,
  doughTrigger: cc,
  doughsamples: L,
  drawFrequencyScope: Y$1,
  drawTimeScope: X$1,
  drywet: Yn,
  dspWorklet: Ko,
  effectSend: Ut,
  errorLogger: fn,
  fetchSampleMap: G$1,
  gainNode: C$1,
  getADSRValues: Q$2,
  getAnalyserById: yo,
  getAnalyzerData: $o,
  getAudioContext: x$1,
  getAudioContextCurrentTime: Co,
  getAudioDevices: uo,
  getCachedBuffer: Io,
  getCompressor: wn,
  getDefaultValue: T$1,
  getDistortion: Bn,
  getDistortionAlgorithm: Ho,
  getFrequencyFromValue: et,
  getLfo: Tt,
  getLoadedBuffer: Po,
  getOscillator: xo,
  getParamADSR: k$1,
  getPitchEnvelope: ht,
  getSampleBuffer: En,
  getSampleBufferSource: Dn,
  getSampleInfo: On,
  getSound: ut,
  getVibratoOscillator: pt,
  getWorklet: I,
  getZZFX: Lo,
  initAudio: bo,
  initAudioOnFirstClick: Ao,
  loadBuffer: Ne,
  logger: N$1,
  noises: Ke,
  onTriggerSample: eo,
  onTriggerSynth: wo,
  processSampleMap: qn,
  registerSampleSource: oo,
  registerSamplesPrefix: ko,
  registerSound: j$1,
  registerSynthSounds: ec,
  registerWaveTable: Be,
  registerWorklet: Do,
  registerZZFXSounds: nc,
  resetDefaultValues: po,
  resetDefaults: Bo,
  resetGlobalEffects: _o,
  resetLoadedSounds: Eo,
  reverseBuffer: An,
  samples: to,
  setDefault: vo,
  setDefaultAudioContext: Rn,
  setDefaultValue: ke,
  setDefaultValues: jo,
  setGainCurve: Qo,
  setLogger: Fo,
  setMaxPolyphony: lo,
  setMultiChannelOrbits: io,
  setVersionDefaults: Oo,
  soundAlias: Uo,
  soundMap: B,
  superdough: Go,
  superdoughTrigger: tc,
  tables: sc,
  waveformN: Mo,
  webAudioTimeout: rt,
  webaudioOutput: Q$1,
  webaudioRepl: ne
}, Symbol.toStringTag, { value: "Module" }));
var SoundFont2 = { exports: {} };
(function(module, exports$1) {
  !function(e, t2) {
    module.exports = t2();
  }(window, function() {
    return function(e) {
      var t2 = {};
      function r(n) {
        if (t2[n]) return t2[n].exports;
        var o = t2[n] = { i: n, l: false, exports: {} };
        return e[n].call(o.exports, o, o.exports, r), o.l = true, o.exports;
      }
      return r.m = e, r.c = t2, r.d = function(e2, t3, n) {
        r.o(e2, t3) || Object.defineProperty(e2, t3, { enumerable: true, get: n });
      }, r.r = function(e2) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e2, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(e2, "__esModule", { value: true });
      }, r.t = function(e2, t3) {
        if (1 & t3 && (e2 = r(e2)), 8 & t3) return e2;
        if (4 & t3 && "object" == typeof e2 && e2 && e2.__esModule) return e2;
        var n = /* @__PURE__ */ Object.create(null);
        if (r.r(n), Object.defineProperty(n, "default", { enumerable: true, value: e2 }), 2 & t3 && "string" != typeof e2) for (var o in e2) r.d(n, o, (function(t4) {
          return e2[t4];
        }).bind(null, o));
        return n;
      }, r.n = function(e2) {
        var t3 = e2 && e2.__esModule ? function() {
          return e2.default;
        } : function() {
          return e2;
        };
        return r.d(t3, "a", t3), t3;
      }, r.o = function(e2, t3) {
        return Object.prototype.hasOwnProperty.call(e2, t3);
      }, r.p = "", r(r.s = "./src/index.ts");
    }({ "./src/chunk.ts": (
      /*!**********************!*\
        !*** ./src/chunk.ts ***!
        \**********************/
      /*! exports provided: SF2Chunk */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "SF2Chunk", function() {
          return f2;
        });
        var n = r(
          /*! ./riff */
          "./src/riff/index.ts"
        ), o = r(
          /*! ./constants */
          "./src/constants.ts"
        ), i2 = r(
          /*! ./chunks */
          "./src/chunks/index.ts"
        );
        function s(e2) {
          return (s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          })(e2);
        }
        function u(e2, t3) {
          for (var r2 = 0; r2 < t3.length; r2++) {
            var n2 = t3[r2];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
          }
        }
        function a(e2) {
          return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e3) {
            return e3.__proto__ || Object.getPrototypeOf(e3);
          })(e2);
        }
        function c(e2, t3) {
          return (c = Object.setPrototypeOf || function(e3, t4) {
            return e3.__proto__ = t4, e3;
          })(e2, t3);
        }
        function l2(e2) {
          if (void 0 === e2) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return e2;
        }
        var f2 = function(e2) {
          function t3(e3) {
            var r3, n2, o2, i3, u2, c2;
            return function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            }(this, t3), n2 = this, r3 = !(o2 = a(t3).call(this, e3.id, e3.length, e3.buffer, e3.subChunks)) || "object" !== s(o2) && "function" != typeof o2 ? l2(n2) : o2, i3 = l2(l2(r3)), c2 = void 0, (u2 = "subChunks") in i3 ? Object.defineProperty(i3, u2, { value: c2, enumerable: true, configurable: true, writable: true }) : i3[u2] = c2, r3.subChunks = e3.subChunks.map(function(e4) {
              return new t3(e4);
            }), r3;
          }
          var r2, f3;
          return function(e3, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e3.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e3, writable: true, configurable: true } }), t4 && c(e3, t4);
          }(t3, n["RIFFChunk"]), r2 = t3, (f3 = [{ key: "getMetaData", value: function() {
            if ("LIST" !== this.id) throw new n.ParseError("Unexpected chunk ID", "'LIST'", "'".concat(this.id, "'"));
            var e3 = this.subChunks.reduce(function(e4, t4) {
              if ("ifil" === t4.id || "iver" === t4.id) {
                if (t4.length !== o.SF_VERSION_LENGTH) throw new n.ParseError("Invalid size for the '".concat(t4.id, "' sub-chunk"));
                e4[t4.id] = "".concat(t4.getInt16(), ".").concat(t4.getInt16(2));
              } else e4[t4.id] = t4.getString();
              return e4;
            }, {});
            if (!e3.ifil) throw new n.ParseError("Missing required 'ifil' sub-chunk");
            if (!e3.INAM) throw new n.ParseError("Missing required 'INAM' sub-chunk");
            return { version: e3.ifil, soundEngine: e3.isng || "EMU8000", name: e3.INAM, rom: e3.irom, romVersion: e3.iver, creationDate: e3.ICRD, author: e3.IENG, product: e3.IPRD, copyright: e3.ICOP, comments: e3.ICMT, createdBy: e3.ISFT };
          } }, { key: "getSampleData", value: function() {
            if ("LIST" !== this.id) throw new n.ParseError("Unexpected chunk ID", "'LIST'", "'".concat(this.id, "'"));
            var e3 = this.subChunks[0];
            if ("smpl" !== e3.id) throw new n.ParseError("Invalid chunk signature", "'smpl'", "'".concat(e3.id, "'"));
            return e3.buffer;
          } }, { key: "getPresetData", value: function() {
            if ("LIST" !== this.id) throw new n.ParseError("Unexpected chunk ID", "'LIST'", "'".concat(this.id, "'"));
            return { presetHeaders: Object(i2.getPresetHeaders)(this.subChunks[0]), presetZones: Object(i2.getZones)(this.subChunks[1], "pbag"), presetModulators: Object(i2.getModulators)(this.subChunks[2], "pmod"), presetGenerators: Object(i2.getGenerators)(this.subChunks[3], "pgen"), instrumentHeaders: Object(i2.getInstrumentHeaders)(this.subChunks[4]), instrumentZones: Object(i2.getZones)(this.subChunks[5], "ibag"), instrumentModulators: Object(i2.getModulators)(this.subChunks[6], "imod"), instrumentGenerators: Object(i2.getGenerators)(this.subChunks[7], "igen"), sampleHeaders: Object(i2.getSampleHeaders)(this.subChunks[8]) };
          } }]) && u(r2.prototype, f3), t3;
        }();
      }
    ), "./src/chunks/generators.ts": (
      /*!**********************************!*\
        !*** ./src/chunks/generators.ts ***!
        \**********************************/
      /*! exports provided: getGenerators */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "getGenerators", function() {
          return c;
        });
        var n = r(
          /*! ~/riff */
          "./src/riff/index.ts"
        ), o = r(
          /*! ~/types */
          "./src/types/index.ts"
        ), i2 = r(
          /*! ~/constants */
          "./src/constants.ts"
        ), s = [o.GeneratorType.StartAddrsOffset, o.GeneratorType.EndAddrsOffset, o.GeneratorType.StartLoopAddrsOffset, o.GeneratorType.EndLoopAddrsOffset, o.GeneratorType.StartAddrsCoarseOffset, o.GeneratorType.EndAddrsCoarseOffset, o.GeneratorType.StartLoopAddrsCoarseOffset, o.GeneratorType.KeyNum, o.GeneratorType.Velocity, o.GeneratorType.EndLoopAddrsCoarseOffset, o.GeneratorType.SampleModes, o.GeneratorType.ExclusiveClass, o.GeneratorType.OverridingRootKey], u = [o.GeneratorType.Unused1, o.GeneratorType.Unused2, o.GeneratorType.Unused3, o.GeneratorType.Unused4, o.GeneratorType.Reserved1, o.GeneratorType.Reserved2, o.GeneratorType.Reserved3], a = [o.GeneratorType.KeyRange, o.GeneratorType.VelRange], c = function(e2, t3) {
          if (e2.id !== t3) throw new n.ParseError("Unexpected chunk ID", "'".concat(t3, "'"), "'".concat(e2.id, "'"));
          if (e2.length % i2.SF_GENERATOR_SIZE) throw new n.ParseError("Invalid size for the '".concat(t3, "' sub-chunk"));
          return e2.iterate(function(e3) {
            var r2 = e3.getInt16();
            return o.GeneratorType[r2] ? "pgen" === t3 && s.includes(r2) ? null : "igen" === t3 && u.includes(r2) ? null : a.includes(r2) ? { id: r2, range: { lo: e3.getByte(), hi: e3.getByte() } } : { id: r2, value: e3.getInt16BE() } : null;
          });
        };
      }
    ), "./src/chunks/index.ts": (
      /*!*****************************!*\
        !*** ./src/chunks/index.ts ***!
        \*****************************/
      /*! exports provided: getGenerators, getModulators, getZones, getItemsInZone, getInstrumentHeaders, getPresetHeaders, getSampleHeaders */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./instruments */
          "./src/chunks/instruments/index.ts"
        );
        r.d(t2, "getInstrumentHeaders", function() {
          return n.getInstrumentHeaders;
        });
        var o = r(
          /*! ./presets */
          "./src/chunks/presets/index.ts"
        );
        r.d(t2, "getPresetHeaders", function() {
          return o.getPresetHeaders;
        });
        var i2 = r(
          /*! ./samples */
          "./src/chunks/samples/index.ts"
        );
        r.d(t2, "getSampleHeaders", function() {
          return i2.getSampleHeaders;
        });
        var s = r(
          /*! ./generators */
          "./src/chunks/generators.ts"
        );
        r.d(t2, "getGenerators", function() {
          return s.getGenerators;
        });
        var u = r(
          /*! ./modulators */
          "./src/chunks/modulators.ts"
        );
        r.d(t2, "getModulators", function() {
          return u.getModulators;
        });
        var a = r(
          /*! ./zones */
          "./src/chunks/zones.ts"
        );
        r.d(t2, "getZones", function() {
          return a.getZones;
        }), r.d(t2, "getItemsInZone", function() {
          return a.getItemsInZone;
        });
      }
    ), "./src/chunks/instruments/headers.ts": (
      /*!*******************************************!*\
        !*** ./src/chunks/instruments/headers.ts ***!
        \*******************************************/
      /*! exports provided: getInstrumentHeaders */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "getInstrumentHeaders", function() {
          return i2;
        });
        var n = r(
          /*! ~/riff */
          "./src/riff/index.ts"
        ), o = r(
          /*! ~/constants */
          "./src/constants.ts"
        ), i2 = function(e2) {
          if ("inst" !== e2.id) throw new n.ParseError("Unexpected chunk ID", "'inst'", "'".concat(e2.id, "'"));
          if (e2.length % o.SF_INSTRUMENT_HEADER_SIZE) throw new n.ParseError("Invalid size for the 'inst' sub-chunk");
          return e2.iterate(function(e3) {
            return { name: e3.getString(), bagIndex: e3.getInt16() };
          });
        };
      }
    ), "./src/chunks/instruments/index.ts": (
      /*!*****************************************!*\
        !*** ./src/chunks/instruments/index.ts ***!
        \*****************************************/
      /*! exports provided: getInstrumentHeaders */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./headers */
          "./src/chunks/instruments/headers.ts"
        );
        r.d(t2, "getInstrumentHeaders", function() {
          return n.getInstrumentHeaders;
        });
      }
    ), "./src/chunks/modulators.ts": (
      /*!**********************************!*\
        !*** ./src/chunks/modulators.ts ***!
        \**********************************/
      /*! exports provided: getModulators */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "getModulators", function() {
          return s;
        });
        var n = r(
          /*! ~/riff */
          "./src/riff/index.ts"
        ), o = r(
          /*! ~/constants */
          "./src/constants.ts"
        ), i2 = function(e2) {
          return { type: e2 >> 10 & 63, polarity: e2 >> 9 & 1, direction: e2 >> 8 & 1, palette: e2 >> 7 & 1, index: 127 & e2 };
        }, s = function(e2, t3) {
          if (e2.id !== t3) throw new n.ParseError("Unexpected chunk ID", "'".concat(t3, "'"), "'".concat(e2.id, "'"));
          if (e2.length % o.SF_MODULATOR_SIZE) throw new n.ParseError("Invalid size for the '".concat(t3, "' sub-chunk"));
          return e2.iterate(function(e3) {
            return { source: i2(e3.getInt16BE()), id: e3.getInt16BE(), value: e3.getInt16BE(), valueSource: i2(e3.getInt16BE()), transform: e3.getInt16BE() };
          });
        };
      }
    ), "./src/chunks/presets/headers.ts": (
      /*!***************************************!*\
        !*** ./src/chunks/presets/headers.ts ***!
        \***************************************/
      /*! exports provided: getPresetHeaders */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "getPresetHeaders", function() {
          return i2;
        });
        var n = r(
          /*! ~/riff */
          "./src/riff/index.ts"
        ), o = r(
          /*! ~/constants */
          "./src/constants.ts"
        ), i2 = function(e2) {
          if ("phdr" !== e2.id) throw new n.ParseError("Invalid chunk ID", "'phdr'", "'".concat(e2.id, "'"));
          if (e2.length % o.SF_PRESET_HEADER_SIZE) throw new n.ParseError("Invalid size for the 'phdr' sub-chunk");
          return e2.iterate(function(e3) {
            return { name: e3.getString(), preset: e3.getInt16(), bank: e3.getInt16(), bagIndex: e3.getInt16(), library: e3.getUInt32(), genre: e3.getUInt32(), morphology: e3.getUInt32() };
          });
        };
      }
    ), "./src/chunks/presets/index.ts": (
      /*!*************************************!*\
        !*** ./src/chunks/presets/index.ts ***!
        \*************************************/
      /*! exports provided: getPresetHeaders */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./headers */
          "./src/chunks/presets/headers.ts"
        );
        r.d(t2, "getPresetHeaders", function() {
          return n.getPresetHeaders;
        });
      }
    ), "./src/chunks/samples/headers.ts": (
      /*!***************************************!*\
        !*** ./src/chunks/samples/headers.ts ***!
        \***************************************/
      /*! exports provided: getSampleHeaders */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "getSampleHeaders", function() {
          return i2;
        });
        var n = r(
          /*! ~/riff */
          "./src/riff/index.ts"
        ), o = r(
          /*! ~/constants */
          "./src/constants.ts"
        ), i2 = function(e2) {
          if ("shdr" !== e2.id) throw new n.ParseError("Unexpected chunk ID", "'shdr'", "'".concat(e2.id, "'"));
          if (e2.length % o.SF_SAMPLE_HEADER_SIZE) throw new n.ParseError("Invalid size for the 'shdr' sub-chunk");
          return e2.iterate(function(e3) {
            return { name: e3.getString(), start: e3.getUInt32(), end: e3.getUInt32(), startLoop: e3.getUInt32(), endLoop: e3.getUInt32(), sampleRate: e3.getUInt32(), originalPitch: e3.getByte(), pitchCorrection: e3.getChar(), link: e3.getInt16(), type: e3.getInt16() };
          });
        };
      }
    ), "./src/chunks/samples/index.ts": (
      /*!*************************************!*\
        !*** ./src/chunks/samples/index.ts ***!
        \*************************************/
      /*! exports provided: getSampleHeaders */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./headers */
          "./src/chunks/samples/headers.ts"
        );
        r.d(t2, "getSampleHeaders", function() {
          return n.getSampleHeaders;
        });
      }
    ), "./src/chunks/zones.ts": (
      /*!*****************************!*\
        !*** ./src/chunks/zones.ts ***!
        \*****************************/
      /*! exports provided: getZones, getItemsInZone */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "getZones", function() {
          return s;
        }), r.d(t2, "getItemsInZone", function() {
          return u;
        });
        var n = r(
          /*! ~/riff */
          "./src/riff/index.ts"
        ), o = r(
          /*! ~/constants */
          "./src/constants.ts"
        ), i2 = r(
          /*! ~/types */
          "./src/types/index.ts"
        ), s = function(e2, t3) {
          if (e2.id !== t3) throw new n.ParseError("Unexpected chunk ID", "'".concat(t3, "'"), "'".concat(e2.id, "'"));
          if (e2.length % o.SF_BAG_SIZE) throw new n.ParseError("Invalid size for the '".concat(t3, "' sub-chunk"));
          return e2.iterate(function(e3) {
            return { generatorIndex: e3.getInt16(), modulatorIndex: e3.getInt16() };
          });
        }, u = function(e2, t3, r2, n2, o2, s2) {
          for (var u2 = [], l3 = 0; l3 < e2.length; l3++) {
            for (var f2 = e2[l3], d2 = e2[l3 + 1], p = f2.bagIndex, h2 = d2 ? d2.bagIndex : t3.length, y = [], v2 = void 0, g = p; g < h2; g++) {
              var E2 = a(g, t3, r2), m2 = c(g, t3, n2), b2 = m2[i2.GeneratorType.KeyRange] && m2[i2.GeneratorType.KeyRange].range, S2 = m2[s2];
              if (S2) {
                var T2 = o2[S2.value];
                T2 && y.push({ keyRange: b2, modulators: E2, generators: m2, reference: T2 });
              } else g - p == 0 && (v2 = { keyRange: b2, modulators: E2, generators: m2 });
            }
            u2.push({ header: f2, globalZone: v2, zones: y });
          }
          return u2;
        }, a = function(e2, t3, r2) {
          var n2 = t3[e2], o2 = t3[e2 + 1], i3 = n2.modulatorIndex, s2 = o2 ? o2.modulatorIndex : t3.length;
          return l2(i3, s2, r2);
        }, c = function(e2, t3, r2) {
          var n2 = t3[e2], o2 = t3[e2 + 1], i3 = n2.generatorIndex, s2 = o2 ? o2.generatorIndex : t3.length;
          return l2(i3, s2, r2);
        }, l2 = function(e2, t3, r2) {
          for (var n2 = {}, o2 = e2; o2 < t3; o2++) {
            var i3 = r2[o2];
            i3 && (n2[i3.id] = i3);
          }
          return n2;
        };
      }
    ), "./src/constants.ts": (
      /*!**************************!*\
        !*** ./src/constants.ts ***!
        \**************************/
      /*! exports provided: SF_VERSION_LENGTH, SF_PRESET_HEADER_SIZE, SF_BAG_SIZE, SF_MODULATOR_SIZE, SF_GENERATOR_SIZE, SF_INSTRUMENT_HEADER_SIZE, SF_SAMPLE_HEADER_SIZE, DEFAULT_SAMPLE_RATE */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "SF_VERSION_LENGTH", function() {
          return n;
        }), r.d(t2, "SF_PRESET_HEADER_SIZE", function() {
          return o;
        }), r.d(t2, "SF_BAG_SIZE", function() {
          return i2;
        }), r.d(t2, "SF_MODULATOR_SIZE", function() {
          return s;
        }), r.d(t2, "SF_GENERATOR_SIZE", function() {
          return u;
        }), r.d(t2, "SF_INSTRUMENT_HEADER_SIZE", function() {
          return a;
        }), r.d(t2, "SF_SAMPLE_HEADER_SIZE", function() {
          return c;
        }), r.d(t2, "DEFAULT_SAMPLE_RATE", function() {
          return l2;
        });
        var n = 4, o = 38, i2 = 4, s = 10, u = 4, a = 22, c = 46, l2 = 22050;
      }
    ), "./src/index.ts": (
      /*!**********************!*\
        !*** ./src/index.ts ***!
        \**********************/
      /*! no static exports found */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./types */
          "./src/types/index.ts"
        );
        for (var o in n) "default" !== o && function(e2) {
          r.d(t2, e2, function() {
            return n[e2];
          });
        }(o);
        var i2 = r(
          /*! ./chunk */
          "./src/chunk.ts"
        );
        r.d(t2, "SF2Chunk", function() {
          return i2.SF2Chunk;
        });
        var s = r(
          /*! ./constants */
          "./src/constants.ts"
        );
        r.d(t2, "SF_VERSION_LENGTH", function() {
          return s.SF_VERSION_LENGTH;
        }), r.d(t2, "SF_PRESET_HEADER_SIZE", function() {
          return s.SF_PRESET_HEADER_SIZE;
        }), r.d(t2, "SF_BAG_SIZE", function() {
          return s.SF_BAG_SIZE;
        }), r.d(t2, "SF_MODULATOR_SIZE", function() {
          return s.SF_MODULATOR_SIZE;
        }), r.d(t2, "SF_GENERATOR_SIZE", function() {
          return s.SF_GENERATOR_SIZE;
        }), r.d(t2, "SF_INSTRUMENT_HEADER_SIZE", function() {
          return s.SF_INSTRUMENT_HEADER_SIZE;
        }), r.d(t2, "SF_SAMPLE_HEADER_SIZE", function() {
          return s.SF_SAMPLE_HEADER_SIZE;
        }), r.d(t2, "DEFAULT_SAMPLE_RATE", function() {
          return s.DEFAULT_SAMPLE_RATE;
        });
        var u = r(
          /*! ./soundFont2 */
          "./src/soundFont2.ts"
        );
        r.d(t2, "SoundFont2", function() {
          return u.SoundFont2;
        });
      }
    ), "./src/riff/chunkIterator.ts": (
      /*!***********************************!*\
        !*** ./src/riff/chunkIterator.ts ***!
        \***********************************/
      /*! exports provided: ChunkIterator */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "ChunkIterator", function() {
          return s;
        });
        var n = r(
          /*! ~/utils */
          "./src/utils/index.ts"
        );
        function o(e2, t3) {
          for (var r2 = 0; r2 < t3.length; r2++) {
            var n2 = t3[r2];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
          }
        }
        function i2(e2, t3, r2) {
          return t3 in e2 ? Object.defineProperty(e2, t3, { value: r2, enumerable: true, configurable: true, writable: true }) : e2[t3] = r2, e2;
        }
        var s = function() {
          function e2(t4) {
            var r3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
            !function(e3, t5) {
              if (!(e3 instanceof t5)) throw new TypeError("Cannot call a class as a function");
            }(this, e2), i2(this, "target", []), i2(this, "chunk", void 0), i2(this, "position", 0), this.chunk = t4, this.position = r3;
          }
          var t3, r2;
          return t3 = e2, (r2 = [{ key: "iterate", value: function(e3) {
            for (; this.position < this.chunk.length; ) {
              var t4 = e3(this);
              t4 && this.target.push(t4);
            }
          } }, { key: "getString", value: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 20, t4 = Object(n.getStringFromBuffer)(this.getBuffer(this.position, e3));
            return this.position += e3, t4;
          } }, { key: "getInt16", value: function() {
            return this.chunk.buffer[this.position++] | this.chunk.buffer[this.position++] << 8;
          } }, { key: "getInt16BE", value: function() {
            return this.getInt16() << 16 >> 16;
          } }, { key: "getUInt32", value: function() {
            return (this.chunk.buffer[this.position++] | this.chunk.buffer[this.position++] << 8 | this.chunk.buffer[this.position++] << 16 | this.chunk.buffer[this.position++] << 24) >>> 0;
          } }, { key: "getByte", value: function() {
            return this.chunk.buffer[this.position++];
          } }, { key: "getChar", value: function() {
            return this.chunk.buffer[this.position++] << 24 >> 24;
          } }, { key: "skip", value: function(e3) {
            this.position += e3;
          } }, { key: "getBuffer", value: function(e3, t4) {
            return this.chunk.buffer.subarray(e3, e3 + t4);
          } }, { key: "currentPosition", get: function() {
            return this.position;
          } }]) && o(t3.prototype, r2), e2;
        }();
      }
    ), "./src/riff/index.ts": (
      /*!***************************!*\
        !*** ./src/riff/index.ts ***!
        \***************************/
      /*! exports provided: ChunkIterator, ParseError, parseBuffer, getChunk, getChunkLength, getSubChunks, getChunkId, RIFFChunk */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./chunkIterator */
          "./src/riff/chunkIterator.ts"
        );
        r.d(t2, "ChunkIterator", function() {
          return n.ChunkIterator;
        });
        var o = r(
          /*! ./parseError */
          "./src/riff/parseError.ts"
        );
        r.d(t2, "ParseError", function() {
          return o.ParseError;
        });
        var i2 = r(
          /*! ./parser */
          "./src/riff/parser.ts"
        );
        r.d(t2, "parseBuffer", function() {
          return i2.parseBuffer;
        }), r.d(t2, "getChunk", function() {
          return i2.getChunk;
        }), r.d(t2, "getChunkLength", function() {
          return i2.getChunkLength;
        }), r.d(t2, "getSubChunks", function() {
          return i2.getSubChunks;
        }), r.d(t2, "getChunkId", function() {
          return i2.getChunkId;
        });
        var s = r(
          /*! ./riffChunk */
          "./src/riff/riffChunk.ts"
        );
        r.d(t2, "RIFFChunk", function() {
          return s.RIFFChunk;
        });
      }
    ), "./src/riff/parseError.ts": (
      /*!********************************!*\
        !*** ./src/riff/parseError.ts ***!
        \********************************/
      /*! exports provided: ParseError */
      function(e, t2, r) {
        function n(e2) {
          return (n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e3) {
            return typeof e3;
          } : function(e3) {
            return e3 && "function" == typeof Symbol && e3.constructor === Symbol && e3 !== Symbol.prototype ? "symbol" : typeof e3;
          })(e2);
        }
        function o(e2, t3) {
          return !t3 || "object" !== n(t3) && "function" != typeof t3 ? function(e3) {
            if (void 0 === e3) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e3;
          }(e2) : t3;
        }
        function i2(e2) {
          var t3 = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
          return (i2 = function(e3) {
            if (null === e3 || (r2 = e3, -1 === Function.toString.call(r2).indexOf("[native code]"))) return e3;
            var r2;
            if ("function" != typeof e3) throw new TypeError("Super expression must either be null or a function");
            if (void 0 !== t3) {
              if (t3.has(e3)) return t3.get(e3);
              t3.set(e3, n2);
            }
            function n2() {
              return s(e3, arguments, a(this).constructor);
            }
            return n2.prototype = Object.create(e3.prototype, { constructor: { value: n2, enumerable: false, writable: true, configurable: true } }), u(n2, e3);
          })(e2);
        }
        function s(e2, t3, r2) {
          return (s = function() {
            if ("undefined" == typeof Reflect || !Reflect.construct) return false;
            if (Reflect.construct.sham) return false;
            if ("function" == typeof Proxy) return true;
            try {
              return Date.prototype.toString.call(Reflect.construct(Date, [], function() {
              })), true;
            } catch (e3) {
              return false;
            }
          }() ? Reflect.construct : function(e3, t4, r3) {
            var n2 = [null];
            n2.push.apply(n2, t4);
            var o2 = new (Function.bind.apply(e3, n2))();
            return r3 && u(o2, r3.prototype), o2;
          }).apply(null, arguments);
        }
        function u(e2, t3) {
          return (u = Object.setPrototypeOf || function(e3, t4) {
            return e3.__proto__ = t4, e3;
          })(e2, t3);
        }
        function a(e2) {
          return (a = Object.setPrototypeOf ? Object.getPrototypeOf : function(e3) {
            return e3.__proto__ || Object.getPrototypeOf(e3);
          })(e2);
        }
        r.r(t2), r.d(t2, "ParseError", function() {
          return c;
        });
        var c = function(e2) {
          function t3(e3, r2, n2) {
            return function(e4, t4) {
              if (!(e4 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            }(this, t3), o(this, a(t3).call(this, "".concat(e3).concat(r2 && n2 ? ", expected ".concat(r2, ", received ").concat(n2) : "")));
          }
          return function(e3, t4) {
            if ("function" != typeof t4 && null !== t4) throw new TypeError("Super expression must either be null or a function");
            e3.prototype = Object.create(t4 && t4.prototype, { constructor: { value: e3, writable: true, configurable: true } }), t4 && u(e3, t4);
          }(t3, i2(Error)), t3;
        }();
      }
    ), "./src/riff/parser.ts": (
      /*!****************************!*\
        !*** ./src/riff/parser.ts ***!
        \****************************/
      /*! exports provided: parseBuffer, getChunk, getChunkLength, getSubChunks, getChunkId */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "parseBuffer", function() {
          return s;
        }), r.d(t2, "getChunk", function() {
          return u;
        }), r.d(t2, "getChunkLength", function() {
          return a;
        }), r.d(t2, "getSubChunks", function() {
          return c;
        }), r.d(t2, "getChunkId", function() {
          return l2;
        });
        var n = r(
          /*! ./parseError */
          "./src/riff/parseError.ts"
        ), o = r(
          /*! ~/utils/buffer */
          "./src/utils/buffer.ts"
        ), i2 = r(
          /*! ./riffChunk */
          "./src/riff/riffChunk.ts"
        ), s = function(e2) {
          var t3 = l2(e2);
          if ("RIFF" !== t3) throw new n.ParseError("Invalid file format", "RIFF", t3);
          var r2 = l2(e2, 8);
          if ("sfbk" !== r2) throw new n.ParseError("Invalid signature", "sfbk", r2);
          var o2 = e2.subarray(8), s2 = c(o2.subarray(4));
          return new i2.RIFFChunk(t3, o2.length, o2, s2);
        }, u = function(e2, t3) {
          var r2 = l2(e2, t3), n2 = a(e2, t3 + 4), o2 = [];
          return "RIFF" !== r2 && "LIST" !== r2 || (o2 = c(e2.subarray(t3 + 12))), new i2.RIFFChunk(r2, n2, e2.subarray(t3 + 8), o2);
        }, a = function(e2, t3) {
          return ((e2 = e2.subarray(t3, t3 + 4))[0] | e2[1] << 8 | e2[2] << 16 | e2[3] << 24) >>> 0;
        }, c = function(e2) {
          for (var t3 = [], r2 = 0; r2 <= e2.length - 8; ) {
            var n2 = u(e2, r2);
            t3.push(n2), r2 = (r2 += 8 + n2.length) % 2 ? r2 + 1 : r2;
          }
          return t3;
        }, l2 = function(e2) {
          var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
          return Object(o.getStringFromBuffer)(e2.subarray(t3, t3 + 4));
        };
      }
    ), "./src/riff/riffChunk.ts": (
      /*!*******************************!*\
        !*** ./src/riff/riffChunk.ts ***!
        \*******************************/
      /*! exports provided: RIFFChunk */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "RIFFChunk", function() {
          return u;
        });
        var n = r(
          /*! ./chunkIterator */
          "./src/riff/chunkIterator.ts"
        ), o = r(
          /*! ~/utils */
          "./src/utils/index.ts"
        );
        function i2(e2, t3) {
          for (var r2 = 0; r2 < t3.length; r2++) {
            var n2 = t3[r2];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
          }
        }
        function s(e2, t3, r2) {
          return t3 in e2 ? Object.defineProperty(e2, t3, { value: r2, enumerable: true, configurable: true, writable: true }) : e2[t3] = r2, e2;
        }
        var u = function() {
          function e2(t4, r3, n2, o2) {
            !function(e3, t5) {
              if (!(e3 instanceof t5)) throw new TypeError("Cannot call a class as a function");
            }(this, e2), s(this, "id", void 0), s(this, "length", void 0), s(this, "buffer", void 0), s(this, "subChunks", void 0), this.id = t4, this.length = r3, this.buffer = n2, this.subChunks = o2;
          }
          var t3, r2;
          return t3 = e2, (r2 = [{ key: "getString", value: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, t4 = arguments.length > 1 ? arguments[1] : void 0;
            return Object(o.getStringFromBuffer)(this.getBuffer(e3, t4 || this.length - e3));
          } }, { key: "getInt16", value: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            return this.buffer[e3++] | this.buffer[e3] << 8;
          } }, { key: "getUInt32", value: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            return (this.buffer[e3++] | this.buffer[e3++] << 8 | this.buffer[e3++] << 16 | this.buffer[e3] << 24) >>> 0;
          } }, { key: "getByte", value: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            return this.buffer[e3];
          } }, { key: "getChar", value: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            return this.buffer[e3] << 24 >> 24;
          } }, { key: "iterator", value: function() {
            var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            return new n.ChunkIterator(this, e3);
          } }, { key: "iterate", value: function(e3) {
            var t4 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r3 = new n.ChunkIterator(this, t4);
            return r3.iterate(e3), r3.target;
          } }, { key: "getBuffer", value: function(e3, t4) {
            return this.buffer.subarray(e3, e3 + t4);
          } }]) && i2(t3.prototype, r2), e2;
        }();
      }
    ), "./src/soundFont2.ts": (
      /*!***************************!*\
        !*** ./src/soundFont2.ts ***!
        \***************************/
      /*! exports provided: SoundFont2 */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "SoundFont2", function() {
          return d2;
        });
        var n = r(
          /*! ./types */
          "./src/types/index.ts"
        ), o = r(
          /*! ./chunk */
          "./src/chunk.ts"
        ), i2 = r(
          /*! ./riff */
          "./src/riff/index.ts"
        ), s = r(
          /*! ./chunks */
          "./src/chunks/index.ts"
        ), u = r(
          /*! ./utils */
          "./src/utils/index.ts"
        );
        function a(e2) {
          for (var t3 = 1; t3 < arguments.length; t3++) {
            var r2 = null != arguments[t3] ? arguments[t3] : {}, n2 = Object.keys(r2);
            "function" == typeof Object.getOwnPropertySymbols && (n2 = n2.concat(Object.getOwnPropertySymbols(r2).filter(function(e3) {
              return Object.getOwnPropertyDescriptor(r2, e3).enumerable;
            }))), n2.forEach(function(t4) {
              f2(e2, t4, r2[t4]);
            });
          }
          return e2;
        }
        function c(e2, t3) {
          for (var r2 = 0; r2 < t3.length; r2++) {
            var n2 = t3[r2];
            n2.enumerable = n2.enumerable || false, n2.configurable = true, "value" in n2 && (n2.writable = true), Object.defineProperty(e2, n2.key, n2);
          }
        }
        function l2(e2, t3, r2) {
          return t3 && c(e2.prototype, t3), r2 && c(e2, r2), e2;
        }
        function f2(e2, t3, r2) {
          return t3 in e2 ? Object.defineProperty(e2, t3, { value: r2, enumerable: true, configurable: true, writable: true }) : e2[t3] = r2, e2;
        }
        var d2 = function() {
          function e2(t3) {
            if (function(e3, t4) {
              if (!(e3 instanceof t4)) throw new TypeError("Cannot call a class as a function");
            }(this, e2), f2(this, "chunk", void 0), f2(this, "metaData", void 0), f2(this, "sampleData", void 0), f2(this, "samples", void 0), f2(this, "presetData", void 0), f2(this, "instruments", void 0), f2(this, "presets", void 0), f2(this, "banks", void 0), !(t3 instanceof o.SF2Chunk)) {
              var r2 = Object(i2.parseBuffer)(t3);
              t3 = new o.SF2Chunk(r2);
            }
            if (3 !== t3.subChunks.length) throw new i2.ParseError("Invalid sfbk structure", "3 chunks", "".concat(t3.subChunks.length, " chunks"));
            this.chunk = t3, this.metaData = t3.subChunks[0].getMetaData(), this.sampleData = t3.subChunks[1].getSampleData(), this.presetData = t3.subChunks[2].getPresetData(), this.samples = this.getSamples(), this.instruments = this.getInstruments(), this.presets = this.getPresets(), this.banks = this.getBanks();
          }
          return l2(e2, null, [{ key: "from", value: function(t3) {
            return new e2(t3);
          } }]), l2(e2, [{ key: "getKeyData", value: function(e3) {
            var t3 = this, r2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n2 = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
            return Object(u.memoize)(function(e4, r3, n3) {
              var o2 = t3.banks[r3];
              if (o2) {
                var i3 = o2.presets[n3];
                if (i3) {
                  var s2 = i3.zones.find(function(r4) {
                    return t3.isKeyInRange(r4, e4);
                  });
                  if (s2) {
                    var u2 = s2.instrument, c2 = u2.zones.find(function(r4) {
                      return t3.isKeyInRange(r4, e4);
                    });
                    if (c2) {
                      var l3 = c2.sample, f3 = a({}, s2.generators, c2.generators), d3 = a({}, s2.modulators, c2.modulators);
                      return { keyNumber: e4, preset: i3, instrument: u2, sample: l3, generators: f3, modulators: d3 };
                    }
                  }
                }
              }
              return null;
            })(e3, r2, n2);
          } }, { key: "isKeyInRange", value: function(e3, t3) {
            return void 0 === e3.keyRange || e3.keyRange.lo <= t3 && e3.keyRange.hi >= t3;
          } }, { key: "getBanks", value: function() {
            return this.presets.reduce(function(e3, t3) {
              var r2 = t3.header.bank;
              return e3[r2] || (e3[r2] = { presets: [] }), e3[r2].presets[t3.header.preset] = t3, e3;
            }, []);
          } }, { key: "getPresets", value: function() {
            var e3 = this.presetData, t3 = e3.presetHeaders, r2 = e3.presetZones, o2 = e3.presetGenerators, i3 = e3.presetModulators;
            return Object(s.getItemsInZone)(t3, r2, i3, o2, this.instruments, n.GeneratorType.Instrument).filter(function(e4) {
              return "EOP" !== e4.header.name;
            }).map(function(e4) {
              return { header: e4.header, globalZone: e4.globalZone, zones: e4.zones.map(function(e5) {
                return { keyRange: e5.keyRange, generators: e5.generators, modulators: e5.modulators, instrument: e5.reference };
              }) };
            });
          } }, { key: "getInstruments", value: function() {
            var e3 = this.presetData, t3 = e3.instrumentHeaders, r2 = e3.instrumentZones, o2 = e3.instrumentModulators, i3 = e3.instrumentGenerators;
            return Object(s.getItemsInZone)(t3, r2, o2, i3, this.samples, n.GeneratorType.SampleId).filter(function(e4) {
              return "EOI" !== e4.header.name;
            }).map(function(e4) {
              return { header: e4.header, globalZone: e4.globalZone, zones: e4.zones.map(function(e5) {
                return { keyRange: e5.keyRange, generators: e5.generators, modulators: e5.modulators, sample: e5.reference };
              }) };
            });
          } }, { key: "getSamples", value: function() {
            var e3 = this;
            return this.presetData.sampleHeaders.filter(function(e4) {
              return "EOS" !== e4.name;
            }).map(function(t3) {
              if ("EOS" !== t3.name && t3.sampleRate <= 0) throw new Error("Illegal sample rate of ".concat(t3.sampleRate, " hz in sample '").concat(t3.name, "'"));
              return t3.originalPitch >= 128 && t3.originalPitch <= 254 && (t3.originalPitch = 60), t3.startLoop -= t3.start, t3.endLoop -= t3.start, { header: t3, data: new Int16Array(new Uint8Array(e3.sampleData.subarray(2 * t3.start, 2 * t3.end)).buffer) };
            });
          } }]), e2;
        }();
      }
    ), "./src/types/bank.ts": (
      /*!***************************!*\
        !*** ./src/types/bank.ts ***!
        \***************************/
      /*! no static exports found */
      function(e, t2) {
      }
    ), "./src/types/generator.ts": (
      /*!********************************!*\
        !*** ./src/types/generator.ts ***!
        \********************************/
      /*! exports provided: GeneratorType, DEFAULT_GENERATOR_VALUES */
      function(e, t2, r) {
        var n, o;
        function i2(e2, t3, r2) {
          return t3 in e2 ? Object.defineProperty(e2, t3, { value: r2, enumerable: true, configurable: true, writable: true }) : e2[t3] = r2, e2;
        }
        r.r(t2), r.d(t2, "GeneratorType", function() {
          return o;
        }), r.d(t2, "DEFAULT_GENERATOR_VALUES", function() {
          return s;
        }), function(e2) {
          e2[e2.StartAddrsOffset = 0] = "StartAddrsOffset", e2[e2.EndAddrsOffset = 1] = "EndAddrsOffset", e2[e2.StartLoopAddrsOffset = 2] = "StartLoopAddrsOffset", e2[e2.EndLoopAddrsOffset = 3] = "EndLoopAddrsOffset", e2[e2.StartAddrsCoarseOffset = 4] = "StartAddrsCoarseOffset", e2[e2.ModLFOToPitch = 5] = "ModLFOToPitch", e2[e2.VibLFOToPitch = 6] = "VibLFOToPitch", e2[e2.ModEnvToPitch = 7] = "ModEnvToPitch", e2[e2.InitialFilterFc = 8] = "InitialFilterFc", e2[e2.InitialFilterQ = 9] = "InitialFilterQ", e2[e2.ModLFOToFilterFc = 10] = "ModLFOToFilterFc", e2[e2.ModEnvToFilterFc = 11] = "ModEnvToFilterFc", e2[e2.EndAddrsCoarseOffset = 12] = "EndAddrsCoarseOffset", e2[e2.ModLFOToVolume = 13] = "ModLFOToVolume", e2[e2.Unused1 = 14] = "Unused1", e2[e2.ChorusEffectsSend = 15] = "ChorusEffectsSend", e2[e2.ReverbEffectsSend = 16] = "ReverbEffectsSend", e2[e2.Pan = 17] = "Pan", e2[e2.Unused2 = 18] = "Unused2", e2[e2.Unused3 = 19] = "Unused3", e2[e2.Unused4 = 20] = "Unused4", e2[e2.DelayModLFO = 21] = "DelayModLFO", e2[e2.FreqModLFO = 22] = "FreqModLFO", e2[e2.DelayVibLFO = 23] = "DelayVibLFO", e2[e2.FreqVibLFO = 24] = "FreqVibLFO", e2[e2.DelayModEnv = 25] = "DelayModEnv", e2[e2.AttackModEnv = 26] = "AttackModEnv", e2[e2.HoldModEnv = 27] = "HoldModEnv", e2[e2.DecayModEnv = 28] = "DecayModEnv", e2[e2.SustainModEnv = 29] = "SustainModEnv", e2[e2.ReleaseModEnv = 30] = "ReleaseModEnv", e2[e2.KeyNumToModEnvHold = 31] = "KeyNumToModEnvHold", e2[e2.KeyNumToModEnvDecay = 32] = "KeyNumToModEnvDecay", e2[e2.DelayVolEnv = 33] = "DelayVolEnv", e2[e2.AttackVolEnv = 34] = "AttackVolEnv", e2[e2.HoldVolEnv = 35] = "HoldVolEnv", e2[e2.DecayVolEnv = 36] = "DecayVolEnv", e2[e2.SustainVolEnv = 37] = "SustainVolEnv", e2[e2.ReleaseVolEnv = 38] = "ReleaseVolEnv", e2[e2.KeyNumToVolEnvHold = 39] = "KeyNumToVolEnvHold", e2[e2.KeyNumToVolEnvDecay = 40] = "KeyNumToVolEnvDecay", e2[e2.Instrument = 41] = "Instrument", e2[e2.Reserved1 = 42] = "Reserved1", e2[e2.KeyRange = 43] = "KeyRange", e2[e2.VelRange = 44] = "VelRange", e2[e2.StartLoopAddrsCoarseOffset = 45] = "StartLoopAddrsCoarseOffset", e2[e2.KeyNum = 46] = "KeyNum", e2[e2.Velocity = 47] = "Velocity", e2[e2.InitialAttenuation = 48] = "InitialAttenuation", e2[e2.Reserved2 = 49] = "Reserved2", e2[e2.EndLoopAddrsCoarseOffset = 50] = "EndLoopAddrsCoarseOffset", e2[e2.CoarseTune = 51] = "CoarseTune", e2[e2.FineTune = 52] = "FineTune", e2[e2.SampleId = 53] = "SampleId", e2[e2.SampleModes = 54] = "SampleModes", e2[e2.Reserved3 = 55] = "Reserved3", e2[e2.ScaleTuning = 56] = "ScaleTuning", e2[e2.ExclusiveClass = 57] = "ExclusiveClass", e2[e2.OverridingRootKey = 58] = "OverridingRootKey", e2[e2.Unused5 = 59] = "Unused5", e2[e2.EndOper = 60] = "EndOper";
        }(o || (o = {}));
        var s = (i2(n = {}, o.StartAddrsOffset, 0), i2(n, o.EndAddrsOffset, 0), i2(n, o.StartLoopAddrsOffset, 0), i2(n, o.EndLoopAddrsOffset, 0), i2(n, o.StartAddrsCoarseOffset, 0), i2(n, o.ModLFOToPitch, 0), i2(n, o.VibLFOToPitch, 0), i2(n, o.ModEnvToPitch, 0), i2(n, o.InitialFilterFc, 13500), i2(n, o.InitialFilterQ, 0), i2(n, o.ModLFOToFilterFc, 0), i2(n, o.ModEnvToFilterFc, 0), i2(n, o.EndAddrsCoarseOffset, 0), i2(n, o.ModLFOToVolume, 0), i2(n, o.ChorusEffectsSend, 0), i2(n, o.ReverbEffectsSend, 0), i2(n, o.Pan, 0), i2(n, o.DelayModLFO, -12e3), i2(n, o.FreqModLFO, 0), i2(n, o.DelayVibLFO, -12e3), i2(n, o.FreqVibLFO, 0), i2(n, o.DelayModEnv, -12e3), i2(n, o.AttackModEnv, -12e3), i2(n, o.HoldModEnv, -12e3), i2(n, o.DecayModEnv, -12e3), i2(n, o.SustainModEnv, 0), i2(n, o.ReleaseModEnv, -12e3), i2(n, o.KeyNumToModEnvHold, 0), i2(n, o.KeyNumToModEnvDecay, 0), i2(n, o.DelayVolEnv, -12e3), i2(n, o.AttackVolEnv, -12e3), i2(n, o.HoldVolEnv, -12e3), i2(n, o.DecayVolEnv, -12e3), i2(n, o.SustainVolEnv, 0), i2(n, o.ReleaseVolEnv, -12e3), i2(n, o.KeyNumToVolEnvHold, 0), i2(n, o.KeyNumToVolEnvDecay, 0), i2(n, o.StartLoopAddrsCoarseOffset, 0), i2(n, o.KeyNum, -1), i2(n, o.Velocity, -1), i2(n, o.InitialAttenuation, 0), i2(n, o.EndLoopAddrsCoarseOffset, 0), i2(n, o.CoarseTune, 0), i2(n, o.FineTune, 0), i2(n, o.SampleModes, 0), i2(n, o.ScaleTuning, 100), i2(n, o.ExclusiveClass, 0), i2(n, o.OverridingRootKey, -1), n);
      }
    ), "./src/types/index.ts": (
      /*!****************************!*\
        !*** ./src/types/index.ts ***!
        \****************************/
      /*! no static exports found */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./bank */
          "./src/types/bank.ts"
        );
        for (var o in n) "default" !== o && function(e2) {
          r.d(t2, e2, function() {
            return n[e2];
          });
        }(o);
        var i2 = r(
          /*! ./generator */
          "./src/types/generator.ts"
        );
        r.d(t2, "GeneratorType", function() {
          return i2.GeneratorType;
        }), r.d(t2, "DEFAULT_GENERATOR_VALUES", function() {
          return i2.DEFAULT_GENERATOR_VALUES;
        });
        var s = r(
          /*! ./instrument */
          "./src/types/instrument.ts"
        );
        for (var o in s) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "default"].indexOf(o) < 0 && function(e2) {
          r.d(t2, e2, function() {
            return s[e2];
          });
        }(o);
        var u = r(
          /*! ./key */
          "./src/types/key.ts"
        );
        for (var o in u) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "default"].indexOf(o) < 0 && function(e2) {
          r.d(t2, e2, function() {
            return u[e2];
          });
        }(o);
        var a = r(
          /*! ./metaData */
          "./src/types/metaData.ts"
        );
        for (var o in a) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "default"].indexOf(o) < 0 && function(e2) {
          r.d(t2, e2, function() {
            return a[e2];
          });
        }(o);
        var c = r(
          /*! ./modulator */
          "./src/types/modulator.ts"
        );
        r.d(t2, "ControllerType", function() {
          return c.ControllerType;
        }), r.d(t2, "ControllerPolarity", function() {
          return c.ControllerPolarity;
        }), r.d(t2, "ControllerDirection", function() {
          return c.ControllerDirection;
        }), r.d(t2, "ControllerPalette", function() {
          return c.ControllerPalette;
        }), r.d(t2, "Controller", function() {
          return c.Controller;
        }), r.d(t2, "TransformType", function() {
          return c.TransformType;
        }), r.d(t2, "DEFAULT_INSTRUMENT_MODULATORS", function() {
          return c.DEFAULT_INSTRUMENT_MODULATORS;
        });
        var l2 = r(
          /*! ./preset */
          "./src/types/preset.ts"
        );
        for (var o in l2) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "ControllerType", "ControllerPolarity", "ControllerDirection", "ControllerPalette", "Controller", "TransformType", "DEFAULT_INSTRUMENT_MODULATORS", "default"].indexOf(o) < 0 && function(e2) {
          r.d(t2, e2, function() {
            return l2[e2];
          });
        }(o);
        var f2 = r(
          /*! ./presetData */
          "./src/types/presetData.ts"
        );
        for (var o in f2) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "ControllerType", "ControllerPolarity", "ControllerDirection", "ControllerPalette", "Controller", "TransformType", "DEFAULT_INSTRUMENT_MODULATORS", "default"].indexOf(o) < 0 && function(e2) {
          r.d(t2, e2, function() {
            return f2[e2];
          });
        }(o);
        var d2 = r(
          /*! ./sample */
          "./src/types/sample.ts"
        );
        r.d(t2, "SampleType", function() {
          return d2.SampleType;
        });
        var p = r(
          /*! ./zone */
          "./src/types/zone.ts"
        );
        for (var o in p) ["GeneratorType", "DEFAULT_GENERATOR_VALUES", "ControllerType", "ControllerPolarity", "ControllerDirection", "ControllerPalette", "Controller", "TransformType", "DEFAULT_INSTRUMENT_MODULATORS", "SampleType", "default"].indexOf(o) < 0 && function(e2) {
          r.d(t2, e2, function() {
            return p[e2];
          });
        }(o);
      }
    ), "./src/types/instrument.ts": (
      /*!*********************************!*\
        !*** ./src/types/instrument.ts ***!
        \*********************************/
      /*! no static exports found */
      function(e, t2) {
      }
    ), "./src/types/key.ts": (
      /*!**************************!*\
        !*** ./src/types/key.ts ***!
        \**************************/
      /*! no static exports found */
      function(e, t2) {
      }
    ), "./src/types/metaData.ts": (
      /*!*******************************!*\
        !*** ./src/types/metaData.ts ***!
        \*******************************/
      /*! no static exports found */
      function(e, t2) {
      }
    ), "./src/types/modulator.ts": (
      /*!********************************!*\
        !*** ./src/types/modulator.ts ***!
        \********************************/
      /*! exports provided: ControllerType, ControllerPolarity, ControllerDirection, ControllerPalette, Controller, TransformType, DEFAULT_INSTRUMENT_MODULATORS */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "ControllerType", function() {
          return n;
        }), r.d(t2, "ControllerPolarity", function() {
          return o;
        }), r.d(t2, "ControllerDirection", function() {
          return i2;
        }), r.d(t2, "ControllerPalette", function() {
          return s;
        }), r.d(t2, "Controller", function() {
          return u;
        }), r.d(t2, "TransformType", function() {
          return a;
        }), r.d(t2, "DEFAULT_INSTRUMENT_MODULATORS", function() {
          return l2;
        });
        var n, o, i2, s, u, a, c = r(
          /*! ./generator */
          "./src/types/generator.ts"
        );
        !function(e2) {
          e2[e2.Linear = 0] = "Linear", e2[e2.Concave = 1] = "Concave", e2[e2.Convex = 2] = "Convex", e2[e2.Switch = 3] = "Switch";
        }(n || (n = {})), function(e2) {
          e2[e2.Unipolar = 0] = "Unipolar", e2[e2.Bipolar = 1] = "Bipolar";
        }(o || (o = {})), function(e2) {
          e2[e2.Increasing = 0] = "Increasing", e2[e2.Decreasing = 1] = "Decreasing";
        }(i2 || (i2 = {})), function(e2) {
          e2[e2.GeneralController = 0] = "GeneralController", e2[e2.MidiController = 1] = "MidiController";
        }(s || (s = {})), function(e2) {
          e2[e2.NoController = 0] = "NoController", e2[e2.NoteOnVelocity = 2] = "NoteOnVelocity", e2[e2.NoteOnKeyNumber = 3] = "NoteOnKeyNumber", e2[e2.PolyPressure = 10] = "PolyPressure", e2[e2.ChannelPressure = 13] = "ChannelPressure", e2[e2.PitchWheel = 14] = "PitchWheel", e2[e2.PitchWheelSensitivity = 16] = "PitchWheelSensitivity", e2[e2.Link = 127] = "Link";
        }(u || (u = {})), function(e2) {
          e2[e2.Linear = 0] = "Linear", e2[e2.Absolute = 2] = "Absolute";
        }(a || (a = {}));
        var l2 = [{ id: c.GeneratorType.InitialAttenuation, source: { type: n.Concave, polarity: o.Unipolar, direction: i2.Decreasing, palette: s.GeneralController, index: u.NoteOnVelocity }, value: 960, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.InitialFilterFc, source: { type: n.Linear, polarity: o.Unipolar, direction: i2.Decreasing, palette: s.GeneralController, index: u.NoteOnVelocity }, value: -2400, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.VibLFOToPitch, source: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.ChannelPressure }, value: 50, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.VibLFOToPitch, source: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.MidiController, index: 1 }, value: 50, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.InitialAttenuation, source: { type: n.Concave, polarity: o.Unipolar, direction: i2.Decreasing, palette: s.MidiController, index: 7 }, value: 960, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.InitialAttenuation, source: { type: n.Linear, polarity: o.Bipolar, direction: i2.Increasing, palette: s.MidiController, index: 10 }, value: 1e3, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.InitialAttenuation, source: { type: n.Concave, polarity: o.Unipolar, direction: i2.Decreasing, palette: s.MidiController, index: 11 }, value: 960, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.ReverbEffectsSend, source: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.MidiController, index: 91 }, value: 200, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.ChorusEffectsSend, source: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.MidiController, index: 93 }, value: 200, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.NoController }, transform: a.Linear }, { id: c.GeneratorType.CoarseTune, source: { type: n.Linear, polarity: o.Bipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.PitchWheel }, value: 12700, valueSource: { type: n.Linear, polarity: o.Unipolar, direction: i2.Increasing, palette: s.GeneralController, index: u.PitchWheelSensitivity }, transform: a.Linear }];
      }
    ), "./src/types/preset.ts": (
      /*!*****************************!*\
        !*** ./src/types/preset.ts ***!
        \*****************************/
      /*! no static exports found */
      function(e, t2) {
      }
    ), "./src/types/presetData.ts": (
      /*!*********************************!*\
        !*** ./src/types/presetData.ts ***!
        \*********************************/
      /*! no static exports found */
      function(e, t2) {
      }
    ), "./src/types/sample.ts": (
      /*!*****************************!*\
        !*** ./src/types/sample.ts ***!
        \*****************************/
      /*! exports provided: SampleType */
      function(e, t2, r) {
        var n;
        r.r(t2), r.d(t2, "SampleType", function() {
          return n;
        }), function(e2) {
          e2[e2.EOS = 0] = "EOS", e2[e2.Mono = 1] = "Mono", e2[e2.Right = 2] = "Right", e2[e2.Left = 4] = "Left", e2[e2.Linked = 8] = "Linked", e2[e2.RomMono = 32769] = "RomMono", e2[e2.RomRight = 32770] = "RomRight", e2[e2.RomLeft = 32772] = "RomLeft", e2[e2.RomLinked = 32776] = "RomLinked";
        }(n || (n = {}));
      }
    ), "./src/types/zone.ts": (
      /*!***************************!*\
        !*** ./src/types/zone.ts ***!
        \***************************/
      /*! no static exports found */
      function(e, t2) {
      }
    ), "./src/utils/buffer.ts": (
      /*!*****************************!*\
        !*** ./src/utils/buffer.ts ***!
        \*****************************/
      /*! exports provided: getStringFromBuffer */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "getStringFromBuffer", function() {
          return n;
        });
        var n = function(e2) {
          return new TextDecoder("utf8").decode(e2).split(/\0/)[0].trim();
        };
      }
    ), "./src/utils/index.ts": (
      /*!****************************!*\
        !*** ./src/utils/index.ts ***!
        \****************************/
      /*! exports provided: getStringFromBuffer, memoize */
      function(e, t2, r) {
        r.r(t2);
        var n = r(
          /*! ./buffer */
          "./src/utils/buffer.ts"
        );
        r.d(t2, "getStringFromBuffer", function() {
          return n.getStringFromBuffer;
        });
        var o = r(
          /*! ./memoize */
          "./src/utils/memoize.ts"
        );
        r.d(t2, "memoize", function() {
          return o.memoize;
        });
      }
    ), "./src/utils/memoize.ts": (
      /*!******************************!*\
        !*** ./src/utils/memoize.ts ***!
        \******************************/
      /*! exports provided: memoize */
      function(e, t2, r) {
        r.r(t2), r.d(t2, "memoize", function() {
          return n;
        });
        var n = function(e2) {
          var t3 = {};
          return function() {
            for (var r2 = arguments.length, n2 = new Array(r2), o = 0; o < r2; o++) n2[o] = arguments[o];
            var i2 = JSON.stringify(n2);
            if (i2 in t3) return t3[i2];
            var s = e2.apply(void 0, n2);
            return t3[i2] = s, s;
          };
        };
      }
    ) });
  });
})(SoundFont2);
var SoundFont2Exports = SoundFont2.exports;
const m = (e) => Math.pow(2, e / 1200), Q = (e) => e / 1e3, G = (e, t2) => {
  const n = Math.pow(10, t2);
  return Math.round(e * n) / n;
};
typeof AudioParam < "u" && (AudioParam.prototype.dahdsr = function(e, t2, n, o, r, s, a, c, i2) {
  r = Math.max(G(r, 4), 1e-3), a = Math.max(G(a, 4), 1e-3), i2 = G(i2, 4), t2 = Math.max(t2, 1e-3);
  let l2 = e;
  return this.setValueAtTime(t2, l2), this.setValueAtTime(t2, l2 += o), this.exponentialRampToValueAtTime(n, l2 += r), this.setValueAtTime(n, l2 += s), this.exponentialRampToValueAtTime(Math.max(c * n, 1e-3), l2 += a), (d2, u) => {
    this.cancelAndHoldAtTime(d2);
    const f2 = Math.max(u != null ? u : t2, 1e-3);
    this.exponentialRampToValueAtTime(f2, d2 + i2);
  };
});
const T = {
  0: "startAddrOffset",
  1: "endAddrOffset",
  2: "startloopAddrsOffset",
  3: "endloopAddrsOffset",
  4: "startAddrsCoarseOffset",
  5: "modLfoToPitch",
  6: "vibLfoToPitch",
  7: "modEnvToPitch",
  8: "initialFilterFc",
  9: "initialFilterQ",
  10: "modLfoToFilterFc",
  11: "modEnvToFilterFc",
  12: "endAddrsCoarseOffset",
  13: "modLfoToVolume",
  14: "unused1",
  15: "chorusEffectsSend",
  16: "reverbEffectsSend",
  17: "pan",
  18: "unused2",
  19: "unused3",
  20: "unused4",
  21: "delayModLFO",
  22: "freqModLFO",
  23: "delayVibLFO",
  24: "freqVibLFO",
  25: "delayModEnv",
  26: "attackModEnv",
  27: "holdModEnv",
  28: "decayModEnv",
  29: "sustainModEnv",
  30: "releaseModEnv",
  31: "keyNumToModEnvHold",
  32: "keyNumToModEnvDecay",
  33: "delayVolEnv",
  34: "attackVolEnv",
  35: "holdVolEnv",
  36: "decayVolEnv",
  37: "sustainVolEnv",
  38: "releaseVolEnv",
  39: "keyNumToVolEnvHold",
  40: "keyNumToVolEnvDecay",
  41: "instrument",
  42: "reserved1",
  43: "keyRange",
  44: "velRange",
  45: "startloopAddrsCoarseOffset",
  46: "keyNum",
  47: "velocity",
  48: "initialAttenuation",
  49: "reserved2",
  50: "endloopAddrsCoarseOffset",
  51: "coarseTune",
  52: "fineTune",
  53: "sampleID",
  54: "sampleModes",
  55: "reserved3",
  56: "scaleTuning",
  57: "exclusiveClass",
  58: "overridingRootKey",
  59: "unused5",
  60: "endOper"
};
Object.fromEntries(
  Object.entries(SoundFont2Exports.DEFAULT_GENERATOR_VALUES).map(([e, t2]) => [T[e], t2])
);
const D = (e, t2, n, o, r) => {
  var h2, g, y, E2, b2, A2, O2;
  const s = SoundFont2Exports.DEFAULT_GENERATOR_VALUES[e];
  if (typeof s != "number")
    throw new Error(`no default value found for generator with index ${e}`);
  const a = t2.generators[e], c = (g = (h2 = n.globalZone) == null ? void 0 : h2.generators) == null ? void 0 : g[e], i2 = (y = o == null ? void 0 : o.generators) == null ? void 0 : y[e], l2 = (b2 = (E2 = r.globalZone) == null ? void 0 : E2.generators) == null ? void 0 : b2[e], d2 = a && "value" in a ? a.value : void 0, u = c && "value" in c ? c.value : void 0, f2 = i2 && "value" in i2 ? i2.value : void 0, v2 = l2 && "value" in l2 ? l2.value : void 0, p = (A2 = d2 != null ? d2 : u) != null ? A2 : s, M2 = (O2 = f2 != null ? f2 : v2) != null ? O2 : 0;
  return p + M2;
}, J = (e) => SoundFont2Exports.DEFAULT_GENERATOR_VALUES[e] !== void 0, W = (e, t2, n) => {
  var o, r, s, a;
  return Object.fromEntries(
    Array.from(
      new Set(
        [
          Object.keys((r = (o = n.globalZone) == null ? void 0 : o.generators) != null ? r : {}),
          Object.keys(t2.generators),
          Object.keys((a = (s = t2.instrument.globalZone) == null ? void 0 : s.generators) != null ? a : {}),
          Object.keys(e.generators)
        ].flat()
      )
    ).filter(J).map((c) => [T[c], D(parseInt(c), e, t2.instrument, t2, n)])
  );
};
async function ae(e) {
  const t2 = await fetch(e).then((o) => o.arrayBuffer()), n = new Uint8Array(t2);
  return new SoundFont2Exports.SoundFont2(n);
}
function X(e, t2, n) {
  let { time: o = e.currentTime } = n;
  const {
    midi: r,
    start: s,
    velocity: a = 0.3,
    startLoop: c,
    endLoop: i2,
    sampleRate: l2,
    originalPitch: d2,
    pitchCorrection: u,
    type: f2,
    sampleModes: v2 = 0,
    overridingRootKey: p,
    fineTune: M2 = 0,
    startloopAddrsOffset: h2 = 0,
    startloopAddrsCoarseOffset: g = 0,
    endloopAddrsOffset: y = 0,
    endloopAddrsCoarseOffset: E2 = 0,
    delayVolEnv: b2 = -12e3,
    attackVolEnv: A2 = -12e3,
    holdVolEnv: O2 = -12e3,
    decayVolEnv: N2 = -12e3,
    sustainVolEnv: F2 = 0,
    releaseVolEnv: L3 = -12e3,
    pan: P2 = 0,
    ...Z2
  } = n, B2 = 100 * (p !== void 0 && p !== -1 ? p : d2) + u - M2, I2 = r * 100 - B2, K2 = 1 * Math.pow(2, I2 / 1200);
  t2.playbackRate.value = K2;
  const j2 = c + h2 + g * 32768, S2 = i2 + y + E2 * 32768;
  S2 > j2 && v2 === 1 ? (t2.loopStart = j2 / l2, t2.loopEnd = S2 / l2, t2.loop = true) : v2 === 3 && console.warn("unimplemented sampleMode 3 (play till end on note off)"), Object.keys(Z2).filter(
    (V2) => !["name", "instrument", "keyRange", "sampleID", "end"].includes(V2)
  ).length;
  const k2 = e.createGain(), H2 = [
    o,
    0,
    a,
    m(b2),
    m(A2),
    m(O2),
    m(N2),
    F2 >= 960 ? 0 : 1 - Q(F2),
    m(L3)
  ], U2 = k2.gain.dahdsr(...H2), R2 = e.createStereoPanner();
  return R2.pan.value = P2 / 1e3, k2.connect(R2), t2.connect(k2), R2.connect(e.destination), t2.start(o), (V2 = e.currentTime) => {
    t2.stop(V2 + m(L3)), U2(V2);
  };
}
function Y(e, t2, n = {}) {
  const { header: o, data: r } = t2, s = new Float32Array(r.length);
  for (let l2 = 0; l2 < r.length; l2++)
    s[l2] = r[l2] / 32768;
  const a = e.createBuffer(1, s.length, o.sampleRate);
  a.getChannelData(0).set(s);
  const i2 = e.createBufferSource();
  return i2.buffer = a, n = { ...o, ...n }, X(e, i2, n);
}
const C = (e, t2) => !e.keyRange || e.keyRange.lo <= t2 && t2 <= e.keyRange.hi, x = (e, t2) => e.zones.filter((o) => C(o, t2) && o.instrument).map((o) => o.instrument.zones.filter((r) => C(r, t2)).map((r) => {
  const s = W(r, o, e);
  return {
    ...r,
    mergedGenerators: s
  };
})).flat(), ce = (e, t2, n, o = e.currentTime) => {
  const s = x(t2, n).map(
    (a) => Y(e, a.sample, {
      ...a.mergedGenerators,
      midi: n,
      time: o
    })
  );
  return (a = e.currentTime) => {
    s.forEach((c) => c(a));
  };
};
const gm = {
  gm_piano: [
    //'gm_acoustic_piano': [
    // Acoustic Grand Piano: Piano
    "0000_JCLive_sf2_file",
    "0000_FluidR3_GM_sf2_file",
    "0000_Aspirin_sf2_file",
    "0000_Chaos_sf2_file",
    "0000_GeneralUserGS_sf2_file",
    //0000_SBLive_sf2
    //0000_SoundBlasterOld_sf2
    "0001_FluidR3_GM_sf2_file",
    "0001_GeneralUserGS_sf2_file",
    //],
    //'gm_bright_acoustic_piano': [
    // Bright Acoustic Piano: Piano
    "0010_Aspirin_sf2_file",
    "0010_Chaos_sf2_file",
    "0010_FluidR3_GM_sf2_file",
    "0010_GeneralUserGS_sf2_file",
    "0010_JCLive_sf2_file",
    //0010_SBLive_sf2
    //0010_SoundBlasterOld_sf2
    "0011_Aspirin_sf2_file",
    "0011_FluidR3_GM_sf2_file",
    "0011_GeneralUserGS_sf2_file",
    "0012_GeneralUserGS_sf2_file",
    //],
    //'gm_electric_grand_piano': [
    // Electric Grand Piano: Piano
    "0020_Aspirin_sf2_file",
    "0020_Chaos_sf2_file",
    "0020_FluidR3_GM_sf2_file",
    "0020_GeneralUserGS_sf2_file",
    "0020_JCLive_sf2_file",
    //0020_SBLive_sf2
    //0020_SoundBlasterOld_sf2
    "0021_Aspirin_sf2_file",
    "0021_GeneralUserGS_sf2_file",
    // ?
    "0022_Aspirin_sf2_file",
    //],
    //'gm_honky_tonk_piano': [
    // Honky_tonk Piano: Piano
    "0030_Aspirin_sf2_file",
    "0030_Chaos_sf2_file",
    "0030_FluidR3_GM_sf2_file",
    "0030_GeneralUserGS_sf2_file",
    "0030_JCLive_sf2_file",
    //0030_SBLive_sf2
    //0030_SoundBlasterOld_sf2
    "0031_Aspirin_sf2_file",
    "0031_FluidR3_GM_sf2_file",
    "0031_GeneralUserGS_sf2_file"
    //0031_SoundBlasterOld_sf2 // pianos until her
  ],
  gm_epiano1: [
    // Electric Piano 1: Piano
    "0040_JCLive_sf2_file",
    "0040_FluidR3_GM_sf2_file",
    "0040_Aspirin_sf2_file",
    "0040_Chaos_sf2_file",
    "0040_GeneralUserGS_sf2_file",
    //0040_SBLive_sf2 // ?
    //0040_SoundBlasterOld_sf2 // ?
    "0041_FluidR3_GM_sf2_file",
    "0041_GeneralUserGS_sf2_file",
    //0041_SoundBlasterOld_sf2 // ?
    "0042_GeneralUserGS_sf2_file",
    "0043_GeneralUserGS_sf2_file",
    "0044_GeneralUserGS_sf2_file",
    //0045_GeneralUserGS_sf2_file // ?
    "0046_GeneralUserGS_sf2_file"
  ],
  gm_epiano2: [
    // Electric Piano 2: Piano
    "0050_JCLive_sf2_file",
    "0050_FluidR3_GM_sf2_file",
    "0050_Aspirin_sf2_file",
    "0050_Chaos_sf2_file",
    // ?
    "0050_GeneralUserGS_sf2_file",
    // cont
    //0050_SBLive_sf2 // ?
    //0050_SoundBlasterOld_sf2 // ?
    "0051_FluidR3_GM_sf2_file",
    "0051_GeneralUserGS_sf2_file",
    //0052_GeneralUserGS_sf2_file // ?
    "0053_GeneralUserGS_sf2_file",
    // normal piano...
    "0054_GeneralUserGS_sf2_file"
  ],
  gm_harpsichord: [
    // Harpsichord: Piano
    "0060_JCLive_sf2_file",
    "0060_FluidR3_GM_sf2_file",
    "0060_Aspirin_sf2_file",
    "0060_Chaos_sf2_file",
    "0060_GeneralUserGS_sf2_file",
    //0060_SBLive_sf2
    //0060_SoundBlasterOld_sf2
    "0061_Aspirin_sf2_file",
    "0061_GeneralUserGS_sf2_file",
    //0061_SoundBlasterOld_sf2
    "0062_GeneralUserGS_sf2_file"
  ],
  gm_clavinet: [
    // Clavinet: Piano
    "0070_JCLive_sf2_file",
    "0070_FluidR3_GM_sf2_file",
    "0070_Aspirin_sf2_file",
    "0070_Chaos_sf2_file"
    // 0070_GeneralUserGS_sf2_file // half broken
    //0070_SBLive_sf2
    //0070_SoundBlasterOld_sf2
    // 0071_GeneralUserGS_sf2_file // half broke
  ],
  gm_celesta: [
    // Celesta: Chromatic Percussion
    "0080_JCLive_sf2_file",
    "0080_Aspirin_sf2_file",
    "0080_Chaos_sf2_file",
    "0080_FluidR3_GM_sf2_file",
    "0080_GeneralUserGS_sf2_file",
    //0080_SBLive_sf2
    //0080_SoundBlasterOld_sf2
    "0081_FluidR3_GM_sf2_file"
    // 0081_GeneralUserGS_sf2_file // weird detuned
    //0081_SoundBlasterOld_sf
  ],
  gm_glockenspiel: [
    // Glockenspiel: Chromatic Percussion
    "0090_JCLive_sf2_file",
    "0090_Aspirin_sf2_file",
    "0090_Chaos_sf2_file",
    "0090_FluidR3_GM_sf2_file",
    "0090_GeneralUserGS_sf2_file"
    //0090_SBLive_sf2
    //0090_SoundBlasterOld_sf2
    //0091_SoundBlasterOld_sf
  ],
  gm_music_box: [
    // Music Box: Chromatic Percussion
    "0100_JCLive_sf2_file",
    "0100_Aspirin_sf2_file",
    "0100_Chaos_sf2_file",
    "0100_FluidR3_GM_sf2_file",
    "0100_GeneralUserGS_sf2_file"
    //0100_SBLive_sf2
    //0100_SoundBlasterOld_sf2
    // 0101_GeneralUserGS_sf2_file // weird detuned
    //0101_SoundBlasterOld_sf
  ],
  gm_vibraphone: [
    // Vibraphone: Chromatic Percussion
    "0110_JCLive_sf2_file",
    "0110_Aspirin_sf2_file",
    "0110_Chaos_sf2_file",
    "0110_FluidR3_GM_sf2_file",
    "0110_GeneralUserGS_sf2_file",
    //0110_SBLive_sf2
    //0110_SoundBlasterOld_sf2
    "0111_FluidR3_GM_sf2_file"
  ],
  gm_marimba: [
    // Marimba: Chromatic Percussion
    "0120_JCLive_sf2_file",
    "0120_Aspirin_sf2_file",
    "0120_Chaos_sf2_file",
    "0120_FluidR3_GM_sf2_file",
    "0120_GeneralUserGS_sf2_file",
    //0120_SBLive_sf2
    //0120_SoundBlasterOld_sf2
    "0121_FluidR3_GM_sf2_file",
    "0121_GeneralUserGS_sf2_file"
  ],
  gm_xylophone: [
    // Xylophone: Chromatic Percussion
    "0130_JCLive_sf2_file",
    "0130_Aspirin_sf2_file",
    "0130_Chaos_sf2_file",
    "0130_FluidR3_GM_sf2_file",
    "0130_GeneralUserGS_sf2_file",
    //0130_SBLive_sf2
    //0130_SoundBlasterOld_sf2
    "0131_FluidR3_GM_sf2_file"
  ],
  gm_tubular_bells: [
    // Tubular Bells: Chromatic Percussion
    "0140_JCLive_sf2_file",
    "0140_Aspirin_sf2_file",
    // 0140_Chaos_sf2_file // same as aspirin?
    "0140_FluidR3_GM_sf2_file",
    "0140_GeneralUserGS_sf2_file",
    //0140_SBLive_sf2
    //0140_SoundBlasterOld_sf2
    "0141_FluidR3_GM_sf2_file",
    //0141_GeneralUserGS_sf2_file
    "0142_GeneralUserGS_sf2_file"
    // 0143_GeneralUserGS_sf2_file // bugg
  ],
  gm_dulcimer: [
    // Dulcimer: Chromatic Percussion
    "0150_Aspirin_sf2_file",
    "0150_Chaos_sf2_file",
    "0150_FluidR3_GM_sf2_file",
    "0150_GeneralUserGS_sf2_file",
    // 0150_JCLive_sf2_file // detuned???
    //0150_SBLive_sf2
    //0150_SoundBlasterOld_sf2
    "0151_FluidR3_GM_sf2_file"
  ],
  gm_drawbar_organ: [
    // Drawbar Organ: Organ
    "0160_JCLive_sf2_file",
    "0160_Aspirin_sf2_file",
    "0160_Chaos_sf2_file",
    "0160_FluidR3_GM_sf2_file",
    "0160_GeneralUserGS_sf2_file",
    //0160_SBLive_sf2
    //0160_SoundBlasterOld_sf2
    "0161_Aspirin_sf2_file",
    "0161_FluidR3_GM_sf2_file"
    //0161_SoundBlasterOld_sf
  ],
  gm_percussive_organ: [
    // Percussive Organ: Organ
    "0170_JCLive_sf2_file",
    "0170_Aspirin_sf2_file",
    "0170_Chaos_sf2_file",
    "0170_FluidR3_GM_sf2_file",
    // 0170_GeneralUserGS_sf2_file // repitched
    //0170_SBLive_sf2
    //0170_SoundBlasterOld_sf2
    "0171_FluidR3_GM_sf2_file",
    // 0171_GeneralUserGS_sf2_file  // repitched
    "0172_FluidR3_GM_sf2_file"
  ],
  gm_rock_organ: [
    // Rock Organ: Organ
    "0180_JCLive_sf2_file",
    "0180_Aspirin_sf2_file",
    "0180_Chaos_sf2_file",
    "0180_FluidR3_GM_sf2_file",
    "0180_GeneralUserGS_sf2_file"
    //0180_SBLive_sf2
    //0180_SoundBlasterOld_sf2
    //0181_Aspirin_sf2_file // flute
    //0181_GeneralUserGS_sf2_file // marimbalike
    //0181_SoundBlasterOld_sf
  ],
  gm_church_organ: [
    // Church Organ: Organ
    "0190_JCLive_sf2_file",
    "0190_Aspirin_sf2_file",
    "0190_Chaos_sf2_file",
    "0190_FluidR3_GM_sf2_file",
    "0190_GeneralUserGS_sf2_file"
    //0190_SBLive_sf2
    //0190_SoundBlasterOld_sf2
    //0191_Aspirin_sf2_file // string??
    //0191_GeneralUserGS_sf2_file // weird organ
    //0191_SoundBlasterOld_sf
  ],
  gm_reed_organ: [
    // Reed Organ: Organ
    "0200_JCLive_sf2_file",
    "0200_Aspirin_sf2_file",
    "0200_Chaos_sf2_file",
    "0200_FluidR3_GM_sf2_file",
    "0200_GeneralUserGS_sf2_file",
    //0200_SBLive_sf2
    //0200_SoundBlasterOld_sf2
    "0201_Aspirin_sf2_file",
    "0201_FluidR3_GM_sf2_file",
    "0201_GeneralUserGS_sf2_file"
    //0201_SoundBlasterOld_sf2
    //0210_Aspirin_sf2_file // buggy
    //0210_Chaos_sf2_file // bugg
  ],
  gm_accordion: [
    // Accordion: Organ
    "0210_JCLive_sf2_file",
    "0210_FluidR3_GM_sf2_file",
    "0210_GeneralUserGS_sf2_file",
    //0210_SBLive_sf2
    //0210_SoundBlasterOld_sf2
    "0211_Aspirin_sf2_file",
    "0211_FluidR3_GM_sf2_file",
    "0211_GeneralUserGS_sf2_file",
    //0211_SoundBlasterOld_sf2
    "0212_GeneralUserGS_sf2_file"
  ],
  gm_harmonica: [
    // Harmonica: Organ
    "0220_FluidR3_GM_sf2_file",
    "0220_JCLive_sf2_file",
    "0220_Aspirin_sf2_file",
    "0220_Chaos_sf2_file",
    "0220_GeneralUserGS_sf2_file",
    //0220_SBLive_sf2
    //0220_SoundBlasterOld_sf2
    "0221_FluidR3_GM_sf2_file"
  ],
  gm_bandoneon: [
    // Tango Accordion: Organ
    "0230_Aspirin_sf2_file",
    "0230_JCLive_sf2_file",
    "0230_Chaos_sf2_file",
    "0230_FluidR3_GM_sf2_file",
    "0230_GeneralUserGS_sf2_file",
    //0230_SBLive_sf2
    //0230_SoundBlasterOld_sf2
    "0231_FluidR3_GM_sf2_file",
    "0231_GeneralUserGS_sf2_file",
    "0231_JCLive_sf2_file",
    //0231_SoundBlasterOld_sf2
    "0232_FluidR3_GM_sf2_file",
    "0233_FluidR3_GM_sf2_file"
  ],
  gm_acoustic_guitar_nylon: [
    // Acoustic Guitar (nylon): Guitar
    "0240_JCLive_sf2_file",
    "0240_Aspirin_sf2_file",
    "0240_Chaos_sf2_file",
    "0240_FluidR3_GM_sf2_file",
    "0240_GeneralUserGS_sf2_file",
    "0240_LK_Godin_Nylon_SF2_file",
    //0240_SBLive_sf2
    //0240_SoundBlasterOld_sf2
    // 0241_GeneralUserGS_sf2_file // organ like
    "0241_JCLive_sf2_file",
    "0242_JCLive_sf2_file",
    "0243_JCLive_sf2_file"
  ],
  gm_acoustic_guitar_steel: [
    // Acoustic Guitar (steel): Guitar
    "0253_Acoustic_Guitar_sf2_file",
    "0250_Aspirin_sf2_file",
    "0250_Chaos_sf2_file",
    "0250_FluidR3_GM_sf2_file",
    "0250_GeneralUserGS_sf2_file",
    // 0250_JCLive_sf2_file // detuned
    "0250_LK_AcousticSteel_SF2_file",
    //0250_SBLive_sf2
    //0250_SoundBlasterOld_sf2
    //0251_Acoustic_Guitar_sf2_file // detuned?
    // 0251_GeneralUserGS_sf2_file // broken: missing pitches
    // 0252_Acoustic_Guitar_sf2_file // detuned..
    // 0252_GeneralUserGS_sf2_file // broken: missing pitches
    "0253_Acoustic_Guitar_sf2_file",
    "0253_GeneralUserGS_sf2_file",
    "0254_Acoustic_Guitar_sf2_file",
    "0254_GeneralUserGS_sf2_file"
    //0255_GeneralUserGS_sf2_file // no guitar.
  ],
  gm_electric_guitar_jazz: [
    // Electric Guitar (jazz): Guitar
    "0260_JCLive_sf2_file",
    "0260_Aspirin_sf2_file",
    "0260_Chaos_sf2_file",
    "0260_FluidR3_GM_sf2_file",
    "0260_GeneralUserGS_sf2_file",
    //0260_SBLive_sf2
    //0260_SoundBlasterOld_sf2
    "0260_Stratocaster_sf2_file",
    "0261_GeneralUserGS_sf2_file",
    //0261_SoundBlasterOld_sf2
    "0261_Stratocaster_sf2_file",
    "0262_Stratocaster_sf2_file"
  ],
  gm_electric_guitar_clean: [
    // Electric Guitar (clean): Guitar
    "0270_Aspirin_sf2_file",
    "0270_Chaos_sf2_file",
    "0270_FluidR3_GM_sf2_file",
    "0270_GeneralUserGS_sf2_file",
    //0270_Gibson_Les_Paul_sf2_file // detuned
    // 0270_JCLive_sf2_file // broken: missing notes
    "0270_SBAWE32_sf2_file",
    //0270_SBLive_sf2
    //0270_SoundBlasterOld_sf2
    "0270_Stratocaster_sf2_file",
    "0271_GeneralUserGS_sf2_file",
    "0271_Stratocaster_sf2_file",
    "0272_Stratocaster_sf2_file"
  ],
  gm_electric_guitar_muted: [
    // Electric Guitar (muted): Guitar
    "0280_Aspirin_sf2_file",
    "0280_Chaos_sf2_file",
    // 0280_FluidR3_GM_sf2_file // broken: wrong notes
    "0280_GeneralUserGS_sf2_file",
    "0280_JCLive_sf2_file",
    //0280_LesPaul_sf2 // missing
    "0280_LesPaul_sf2_file",
    "0280_SBAWE32_sf2_file",
    //0280_SBLive_sf2
    //0280_SoundBlasterOld_sf2
    "0281_Aspirin_sf2_file",
    "0281_FluidR3_GM_sf2_file",
    "0281_GeneralUserGS_sf2_file",
    "0282_FluidR3_GM_sf2_file"
    // 0282_GeneralUserGS_sf2_file // broken: missing notes
    // 0283_GeneralUserGS_sf2_file // missin
  ],
  gm_overdriven_guitar: [
    // Overdriven Guitar: Guitar
    "0290_FluidR3_GM_sf2_file",
    "0290_Aspirin_sf2_file",
    "0290_Chaos_sf2_file",
    "0290_GeneralUserGS_sf2_file",
    //0290_JCLive_sf2_file // detuned....
    //0290_LesPaul_sf2 // broken
    "0290_LesPaul_sf2_file",
    "0290_SBAWE32_sf2_file",
    //0290_SBLive_sf2
    //0290_SoundBlasterOld_sf2
    // 0291_Aspirin_sf2_file // broken
    // 0291_LesPaul_sf2 // broken
    "0291_LesPaul_sf2_file",
    "0291_SBAWE32_sf2_file",
    //0291_SoundBlasterOld_sf2
    "0292_Aspirin_sf2_file",
    // 0292_LesPaul_sf2 // broken
    "0292_LesPaul_sf2_file"
  ],
  gm_distortion_guitar: [
    // Distortion Guitar: Guitar
    "0300_FluidR3_GM_sf2_file",
    "0300_Aspirin_sf2_file",
    "0300_Chaos_sf2_file",
    "0300_GeneralUserGS_sf2_file",
    // 0300_JCLive_sf2_file // broken
    // 0300_LesPaul_sf2 // broken
    "0300_LesPaul_sf2_file",
    //0300_SBAWE32_sf2_file // _2 octave
    //0300_SBLive_sf2
    //0300_SoundBlasterOld_sf2
    // 0301_Aspirin_sf2_file // missing
    //0301_FluidR3_GM_sf2_file // weird broken bell
    // 0301_GeneralUserGS_sf2_file // broken
    // 0301_JCLive_sf2_file // broken
    // 0301_LesPaul_sf2 // missing
    // 0301_LesPaul_sf2_file // + 1 oct?
    "0302_Aspirin_sf2_file",
    // 0302_GeneralUserGS_sf2_file // not a guitar..
    //0302_JCLive_sf2_file // broken...
    // 0303_Aspirin_sf2_file // guitar harmonic??
    "0304_Aspirin_sf2_file"
  ],
  gm_guitar_harmonics: [
    // Guitar Harmonics: Guitar
    "0310_Aspirin_sf2_file",
    "0310_FluidR3_GM_sf2_file",
    "0310_Chaos_sf2_file"
    //0310_GeneralUserGS_sf2_file // weird..
    // 0310_JCLive_sf2_file // weird
    //0310_LesPaul_sf2 // missing
    //0310_LesPaul_sf2_file // wrong pitches
    //0310_SBAWE32_sf2_file // wrong pitches
    //0310_SBLive_sf2
    //0310_SoundBlasterOld_sf2
    //0311_FluidR3_GM_sf2_file // knackt
    //0311_GeneralUserGS_sf2_file // wrong note
  ],
  gm_acoustic_bass: [
    // Acoustic Bass: Bass
    "0320_JCLive_sf2_file",
    "0320_FluidR3_GM_sf2_file",
    "0320_Aspirin_sf2_file",
    "0320_Chaos_sf2_file"
    // 0320_GeneralUserGS_sf2_file // missing notes
    //0320_SBLive_sf2
    //0320_SoundBlasterOld_sf2
    // 0321_GeneralUserGS_sf2_file // nice sound but missing notes
    // 0322_GeneralUserGS_sf2_file // missing note
  ],
  gm_electric_bass_finger: [
    // Electric Bass (finger): Bass
    "0330_JCLive_sf2_file",
    "0330_FluidR3_GM_sf2_fible",
    "0330_Aspirin_sf2_file",
    //0330_Chaos_sf2_file // same as last
    "0330_GeneralUserGS_sf2_file"
    //0330_SBLive_sf2
    //0330_SoundBlasterOld_sf2
    //0331_GeneralUserGS_sf2_file // knackt
    // 0332_GeneralUserGS_sf2_file // missin
  ],
  gm_electric_bass_pick: [
    // Electric Bass (pick): Bass
    "0340_JCLive_sf2_file",
    "0340_FluidR3_GM_sf2_file",
    "0340_Aspirin_sf2_file",
    //0340_Chaos_sf2_file // same as last
    "0340_GeneralUserGS_sf2_file",
    //0340_SBLive_sf2
    //0340_SoundBlasterOld_sf2
    "0341_Aspirin_sf2_file"
    //0341_GeneralUserGS_sf2_file // knack
  ],
  gm_fretless_bass: [
    // Fretless Bass: Bass
    "0350_Aspirin_sf2_file",
    // 0350_Chaos_sf2_file // same as last
    //0350_FluidR3_GM_sf2_file // knackt
    //0350_GeneralUserGS_sf2_file // _1 oct + knackt
    "0350_JCLive_sf2_file"
    //0350_SBLive_sf2
    //0350_SoundBlasterOld_sf2
    //0351_GeneralUserGS_sf2_file // missin
  ],
  gm_slap_bass_1: [
    // Slap Bass 1: Bass
    "0360_Aspirin_sf2_file",
    "0360_JCLive_sf2_file",
    "0360_FluidR3_GM_sf2_file",
    "0360_Chaos_sf2_file"
    //0360_GeneralUserGS_sf2_file // _1 oct
    //0360_SBLive_sf2
    //0360_SoundBlasterOld_sf2
    //0361_GeneralUserGS_sf2_file // missin
  ],
  gm_slap_bass_2: [
    // Slap Bass 2: Bass
    "0370_Aspirin_sf2_file",
    // 0370_Chaos_sf2_file // same as last
    "0370_FluidR3_GM_sf2_file",
    "0370_GeneralUserGS_sf2_fil e",
    "0370_JCLive_sf2_file"
    //0370_SBLive_sf2
    //0370_SoundBlasterOld_sf2
    //0371_GeneralUserGS_sf2_file // missing
    //0372_GeneralUserGS_sf2_file // detuned
    //0385_GeneralUserGS_sf2_file // missin
  ],
  gm_synth_bass_1: [
    // Synth Bass 1: Bass
    // '0380_Aspirin_sf2_file', // broken in safari https://codeberg.org/uzu/strudel/issues/1384
    "0380_Chaos_sf2_file",
    "0380_FluidR3_GM_sf2_file",
    // 0380_GeneralUserGS_sf2_file // laut
    "0380_JCLive_sf2_file",
    //0380_SBLive_sf2
    //0380_SoundBlasterOld_sf2
    "0381_FluidR3_GM_sf2_file",
    "0381_GeneralUserGS_sf2_file",
    //0382_FluidR3_GM_sf2_file // kein synth bass
    "0382_GeneralUserGS_sf2_file",
    "0383_GeneralUserGS_sf2_file",
    "0384_GeneralUserGS_sf2_file",
    //0386_GeneralUserGS_sf2_file // knackt
    "0387_GeneralUserGS_sf2_file"
  ],
  gm_synth_bass_2: [
    // Synth Bass 2: Bass
    "0390_Aspirin_sf2_file",
    // 0390_Chaos_sf2_file // same as last
    "0390_FluidR3_GM_sf2_file",
    "0390_GeneralUserGS_sf2_file",
    "0390_JCLive_sf2_file",
    //0390_SBLive_sf2
    //0390_SoundBlasterOld_sf2
    "0391_FluidR3_GM_sf2_file",
    // 0391_GeneralUserGS_sf2_file // missing
    //0391_SoundBlasterOld_sf2
    "0392_FluidR3_GM_sf2_file",
    //0392_GeneralUserGS_sf2_file // kein synth und _1oct
    "0393_GeneralUserGS_sf2_file"
  ],
  gm_violin: [
    // Violin: Strings
    "0400_Aspirin_sf2_file",
    "0400_Chaos_sf2_file",
    "0400_JCLive_sf2_file",
    "0400_FluidR3_GM_sf2_file",
    "0400_GeneralUserGS_sf2_file",
    //0400_SBLive_sf2
    //0400_SoundBlasterOld_sf2
    "0401_Aspirin_sf2_file",
    "0401_FluidR3_GM_sf2_file",
    "0401_GeneralUserGS_sf2_file",
    "0402_GeneralUserGS_sf2_file"
  ],
  gm_viola: [
    // Viola: Strings
    "0410_Aspirin_sf2_file",
    // 0410_Chaos_sf2_file // laut und sehr unstringy
    "0410_FluidR3_GM_sf2_file",
    "0410_GeneralUserGS_sf2_file",
    "0410_JCLive_sf2_file",
    //0410_SBLive_sf2
    //0410_SoundBlasterOld_sf2
    "0411_FluidR3_GM_sf2_file"
  ],
  gm_cello: [
    // Cello: Strings
    "0420_Aspirin_sf2_file",
    // 0420_Chaos_sf2_file // kein cello und laut
    "0420_FluidR3_GM_sf2_file",
    "0420_GeneralUserGS_sf2_file",
    "0420_JCLive_sf2_file",
    //0420_SBLive_sf2
    //0420_SoundBlasterOld_sf2
    "0421_FluidR3_GM_sf2_file",
    "0421_GeneralUserGS_sf2_file"
  ],
  gm_contrabass: [
    // Contrabass: Strings
    "0430_Aspirin_sf2_file",
    "0430_Chaos_sf2_file",
    // 0430_FluidR3_GM_sf2_file // missing notes
    "0430_GeneralUserGS_sf2_file"
    //0430_JCLive_sf2_file // _1 oct und meh
    //0430_SBLive_sf2
    //0430_SoundBlasterOld_sf2
    // 0431_FluidR3_GM_sf2_file // missing note
  ],
  gm_tremolo_strings: [
    // Tremolo Strings: Strings
    "0440_Aspirin_sf2_file",
    "0440_Chaos_sf2_file",
    //0440_FluidR3_GM_sf2_file // huuuge
    "0440_GeneralUserGS_sf2_file",
    "0440_JCLive_sf2_file",
    //0440_SBLive_sf2
    //0440_SoundBlasterOld_sf2
    "0441_GeneralUserGS_sf2_file",
    "0442_GeneralUserGS_sf2_file"
  ],
  gm_pizzicato_strings: [
    // Pizzicato Strings: Strings
    "0450_Aspirin_sf2_file",
    "0450_Chaos_sf2_file",
    "0450_FluidR3_GM_sf2_file",
    "0450_GeneralUserGS_sf2_file",
    "0450_JCLive_sf2_file",
    //0450_SBLive_sf2
    //0450_SoundBlasterOld_sf2
    "0451_FluidR3_GM_sf2_file"
  ],
  gm_orchestral_harp: [
    // Orchestral Harp: Strings
    "0460_Aspirin_sf2_file",
    // 0460_Chaos_sf2_file // knackt
    "0460_FluidR3_GM_sf2_file",
    "0460_GeneralUserGS_sf2_file",
    "0460_JCLive_sf2_file",
    //0460_SBLive_sf2
    //0460_SoundBlasterOld_sf2
    "0461_FluidR3_GM_sf2_file"
  ],
  gm_timpani: [
    // Timpani: Strings
    "0470_Aspirin_sf2_file",
    "0470_Chaos_sf2_file",
    "0470_FluidR3_GM_sf2_file",
    "0470_GeneralUserGS_sf2_file",
    // 0470_JCLive_sf2_file // wrong pitches
    //0470_SBLive_sf2
    //0470_SoundBlasterOld_sf2
    "0471_FluidR3_GM_sf2_file",
    "0471_GeneralUserGS_sf2_file"
  ],
  gm_string_ensemble_1: [
    // String Ensemble 1: Ensemble
    "0480_Aspirin_sf2_file",
    "0480_Chaos_sf2_file",
    "0480_FluidR3_GM_sf2_file",
    "0480_GeneralUserGS_sf2_file",
    "0480_JCLive_sf2_file",
    //0480_SBLive_sf2
    //0480_SoundBlasterOld_sf2
    // these dont work..
    //04810_GeneralUserGS_sf2_file // missing notes + brass
    //04811_GeneralUserGS_sf2_file  // missing notes + brass
    //04812_GeneralUserGS_sf2_file
    //04813_GeneralUserGS_sf2_file
    //04814_GeneralUserGS_sf2_file
    //04815_GeneralUserGS_sf2_file
    //04816_GeneralUserGS_sf2_file
    //04817_GeneralUserGS_sf2_file
    "0481_Aspirin_sf2_file",
    "0481_FluidR3_GM_sf2_file",
    "0481_GeneralUserGS_sf2_file",
    "0482_Aspirin_sf2_file",
    "0482_GeneralUserGS_sf2_file",
    "0483_GeneralUserGS_sf2_file"
    // another block of buggyness:
    //0484_GeneralUserGS_sf2_file // keys?! + knackt
    //0485_GeneralUserGS_sf2_file // missing notes
    //0486_GeneralUserGS_sf2_file
    //0487_GeneralUserGS_sf2_file
    //0488_GeneralUserGS_sf2_file
    //0489_GeneralUserGS_sf2_fil
  ],
  gm_string_ensemble_2: [
    // String Ensemble 2: Ensemble
    "0490_Aspirin_sf2_file",
    "0490_Chaos_sf2_file",
    "0490_FluidR3_GM_sf2_file",
    "0490_GeneralUserGS_sf2_file",
    "0490_JCLive_sf2_file",
    //0490_SBLive_sf2
    //0490_SoundBlasterOld_sf2
    "0491_GeneralUserGS_sf2_file",
    "0492_GeneralUserGS_sf2_file"
  ],
  gm_synth_strings_1: [
    // Synth Strings 1: Ensemble
    "0500_Aspirin_sf2_file",
    // 0500_Chaos_sf2_file // same as above
    //0500_FluidR3_GM_sf2_file // detune + knack
    "0500_GeneralUserGS_sf2_file",
    "0500_JCLive_sf2_file",
    //0500_SBLive_sf2
    //0500_SoundBlasterOld_sf2
    "0501_FluidR3_GM_sf2_file",
    // 0501_GeneralUserGS_sf2_file // crackles
    // 0502_FluidR3_GM_sf2_file // missing
    "0502_GeneralUserGS_sf2_file",
    "0503_FluidR3_GM_sf2_file",
    // 0504_FluidR3_GM_sf2_file // missing
    "0505_FluidR3_GM_sf2_file"
  ],
  gm_synth_strings_2: [
    // Synth Strings 2: Ensemble
    "0510_Aspirin_sf2_file",
    "0510_Chaos_sf2_file",
    // 0510_FluidR3_GM_sf2_file // detune + crackle
    "0510_GeneralUserGS_sf2_file",
    //0510_JCLive_sf2_file // laarge and meh
    //0510_SBLive_sf2 // missing
    //0510_SoundBlasterOld_sf2
    "0511_GeneralUserGS_sf2_file"
    //0511_SoundBlasterOld_sf
  ],
  gm_choir_aahs: [
    // Choir Aahs: Ensemble
    "0520_Aspirin_sf2_file",
    "0520_Chaos_sf2_file",
    "0520_FluidR3_GM_sf2_file",
    "0520_GeneralUserGS_sf2_file",
    "0520_JCLive_sf2_file",
    //0520_SBLive_sf2
    "0520_Soul_Ahhs_sf2_file",
    //0520_SoundBlasterOld_sf2
    "0521_FluidR3_GM_sf2_file",
    "0521_Soul_Ahhs_sf2_file",
    //0521_SoundBlasterOld_sf2
    "0522_Soul_Ahhs_sf2_file"
  ],
  gm_voice_oohs: [
    // Voice Oohs: Ensemble
    "0530_Aspirin_sf2_file",
    "0530_Chaos_sf2_file",
    "0530_FluidR3_GM_sf2_file",
    "0530_GeneralUserGS_sf2_file",
    //0530_JCLive_sf2_file // same as above
    //0530_SBLive_sf2
    // 0530_Soul_Ahhs_sf2_file // not ooh
    //0530_SoundBlasterOld_sf2
    "0531_FluidR3_GM_sf2_file",
    // 0531_GeneralUserGS_sf2_file // ends crackle
    "0531_JCLive_sf2_file"
    //0531_SoundBlasterOld_sf
  ],
  gm_synth_choir: [
    // Synth Choir: Ensemble
    "0540_Aspirin_sf2_file",
    "0540_Chaos_sf2_file",
    "0540_FluidR3_GM_sf2_file",
    "0540_GeneralUserGS_sf2_file",
    //0540_JCLive_sf2_file // large + crackles
    //0540_SBLive_sf2
    //0540_SoundBlasterOld_sf2
    "0541_FluidR3_GM_sf2_file"
  ],
  gm_orchestra_hit: [
    // Orchestra Hit: Ensemble
    "0550_Aspirin_sf2_file",
    "0550_Chaos_sf2_file",
    "0550_FluidR3_GM_sf2_file",
    "0550_GeneralUserGS_sf2_file",
    //0550_JCLive_sf2_file // same as above
    //0550_SBLive_sf2
    //0550_SoundBlasterOld_sf2
    //0551_Aspirin_sf2_file // not an orch hit..
    "0551_FluidR3_GM_sf2_file"
  ],
  gm_trumpet: [
    // Trumpet: Brass
    "0560_FluidR3_GM_sf2_file",
    "0560_JCLive_sf2_file",
    "0560_Aspirin_sf2_file",
    "0560_Chaos_sf2_file"
    //0560_GeneralUserGS_sf2_file // _1 oct
    //0560_SBLive_sf2
    //0560_SoundBlasterOld_sf
  ],
  gm_trombone: [
    // Trombone: Brass
    "0570_Aspirin_sf2_file",
    "0570_Chaos_sf2_file",
    "0570_FluidR3_GM_sf2_file",
    "0570_GeneralUserGS_sf2_file",
    //0570_JCLive_sf2_file // _1oct
    //0570_SBLive_sf2
    //0570_SoundBlasterOld_sf2
    "0571_GeneralUserGS_sf2_file"
  ],
  gm_tuba: [
    // Tuba: Brass
    "0580_FluidR3_GM_sf2_file",
    "0580_Aspirin_sf2_file",
    "0580_Chaos_sf2_file",
    "0580_GeneralUserGS_sf2_file"
    //0580_JCLive_sf2_file // _1oct
    //0580_SBLive_sf2
    //0580_SoundBlasterOld_sf2
    //0581_GeneralUserGS_sf2_file // missin
  ],
  gm_muted_trumpet: [
    // Muted Trumpet: Brass
    "0590_JCLive_sf2_file",
    "0590_Aspirin_sf2_file",
    "0590_Chaos_sf2_file",
    "0590_FluidR3_GM_sf2_file",
    "0590_GeneralUserGS_sf2_file"
    //0590_SBLive_sf2
    //0590_SoundBlasterOld_sf2
    // 0591_GeneralUserGS_sf2_file // missin
  ],
  gm_french_horn: [
    // French Horn: Brass
    "0600_Aspirin_sf2_file",
    //0600_Chaos_sf2_file // weird jumps
    "0600_FluidR3_GM_sf2_file",
    "0600_GeneralUserGS_sf2_file",
    "0600_JCLive_sf2_file",
    //0600_SBLive_sf2
    //0600_SoundBlasterOld_sf2
    "0601_FluidR3_GM_sf2_file"
    //0601_GeneralUserGS_sf2_file // tiny crackles
    // 0602_GeneralUserGS_sf2_file // bad gain diffs
    // 0603_GeneralUserGS_sf2_file // tiny crackle
  ],
  gm_brass_section: [
    // Brass Section: Brass
    "0610_JCLive_sf2_file",
    "0610_Aspirin_sf2_file",
    "0610_Chaos_sf2_file",
    "0610_FluidR3_GM_sf2_file",
    "0610_GeneralUserGS_sf2_file"
    //0610_SBLive_sf2
    //0610_SoundBlasterOld_sf2
    // 0611_GeneralUserGS_sf2_file // missing sounds
    // 0612_GeneralUserGS_sf2_file
    //0613_GeneralUserGS_sf2_file // _1 oct
    // 0614_GeneralUserGS_sf2_file // missing sounds
    // 0615_GeneralUserGS_sf2_file // missing sound
  ],
  gm_synth_brass_1: [
    // Synth Brass 1: Brass
    "0620_Aspirin_sf2_file",
    //0620_Chaos_sf2_file // weird gain diff
    "0620_FluidR3_GM_sf2_file",
    //0620_GeneralUserGS_sf2_file // loooud
    // 0620_JCLive_sf2_file // weird gain diff
    //0620_SBLive_sf2
    //0620_SoundBlasterOld_sf2
    "0621_Aspirin_sf2_file",
    "0621_FluidR3_GM_sf2_file"
    // 0621_GeneralUserGS_sf2_file // detune + loooud
    //0622_FluidR3_GM_sf2_file // loud..
    //0622_GeneralUserGS_sf2_file // loud + crackle
  ],
  gm_synth_brass_2: [
    // Synth Brass 2: Brass
    "0630_Aspirin_sf2_file",
    "0630_Chaos_sf2_file",
    "0630_FluidR3_GM_sf2_file",
    //0630_GeneralUserGS_sf2_file // detune + looud
    "0630_JCLive_sf2_file",
    //0630_SBLive_sf2
    //0630_SoundBlasterOld_sf2
    // 0631_Aspirin_sf2_file // looud + detune + gain diffs
    "0631_FluidR3_GM_sf2_file",
    //0631_GeneralUserGS_sf2_file // crackles
    "0632_FluidR3_GM_sf2_file",
    "0633_FluidR3_GM_sf2_file"
  ],
  gm_soprano_sax: [
    // Soprano Sax: Reed
    "0640_JCLive_sf2_file",
    "0640_Aspirin_sf2_file",
    "0640_Chaos_sf2_file",
    "0640_FluidR3_GM_sf2_file",
    // 0640_GeneralUserGS_sf2_file // crackles
    //0640_SBLive_sf2
    //0640_SoundBlasterOld_sf2
    "0641_FluidR3_GM_sf2_file"
  ],
  gm_alto_sax: [
    // Alto Sax: Reed
    //0650_Aspirin_sf2_file // this is not an alto sax
    "0650_JCLive_sf2_file",
    "0650_Chaos_sf2_file",
    "0650_FluidR3_GM_sf2_file",
    "0650_GeneralUserGS_sf2_file",
    //0650_SBLive_sf2
    //0650_SoundBlasterOld_sf2
    "0651_Aspirin_sf2_file",
    "0651_FluidR3_GM_sf2_file"
  ],
  gm_tenor_sax: [
    // Tenor Sax: Reed
    "0660_JCLive_sf2_file",
    "0660_Aspirin_sf2_file",
    "0660_Chaos_sf2_file",
    //0660_FluidR3_GM_sf2_file // weird pitches
    "0660_GeneralUserGS_sf2_file"
    //0660_SBLive_sf2
    //0660_SoundBlasterOld_sf2
    // 0661_FluidR3_GM_sf2_file // weird pitches
    // 0661_GeneralUserGS_sf2_file // missin
  ],
  gm_baritone_sax: [
    // Baritone Sax: Reed
    "0670_JCLive_sf2_file",
    "0670_Aspirin_sf2_file",
    "0670_Chaos_sf2_file",
    "0670_FluidR3_GM_sf2_file",
    "0670_GeneralUserGS_sf2_file",
    //0670_SBLive_sf2
    //0670_SoundBlasterOld_sf2
    "0671_FluidR3_GM_sf2_file"
  ],
  gm_oboe: [
    // Oboe: Reed
    //0680_Aspirin_sf2_file // tiny crackles
    "0680_JCLive_sf2_file",
    "0680_Chaos_sf2_file",
    "0680_FluidR3_GM_sf2_file",
    "0680_GeneralUserGS_sf2_file",
    //0680_SBLive_sf2
    //0680_SoundBlasterOld_sf2
    "0681_FluidR3_GM_sf2_file"
  ],
  gm_english_horn: [
    // English Horn: Reed
    "0690_JCLive_sf2_file",
    "0690_Aspirin_sf2_file",
    //0690_Chaos_sf2_file // detuned
    "0690_FluidR3_GM_sf2_file",
    //0690_GeneralUserGS_sf2_file // +1 oct
    //0690_SBLive_sf2
    //0690_SoundBlasterOld_sf2
    "0691_FluidR3_GM_sf2_file"
  ],
  gm_bassoon: [
    // Bassoon: Reed
    "0700_JCLive_sf2_file",
    //0700_Aspirin_sf2_file // detune + gain diffs
    // 0700_Chaos_sf2_file // detune + crackles
    "0700_FluidR3_GM_sf2_file",
    "0700_GeneralUserGS_sf2_file",
    //0700_SBLive_sf2
    //0700_SoundBlasterOld_sf2
    "0701_FluidR3_GM_sf2_file"
    //0701_GeneralUserGS_sf2_file // missin
  ],
  gm_clarinet: [
    // Clarinet: Reed
    "0710_JCLive_sf2_file",
    "0710_Aspirin_sf2_file",
    "0710_Chaos_sf2_file",
    "0710_FluidR3_GM_sf2_file",
    "0710_GeneralUserGS_sf2_file",
    //0710_SBLive_sf2
    //0710_SoundBlasterOld_sf2
    "0711_FluidR3_GM_sf2_file"
  ],
  gm_piccolo: [
    // Piccolo: Pipe
    "0720_JCLive_sf2_file",
    "0720_Aspirin_sf2_file",
    // 0720_Chaos_sf2_file // not a piccolo
    "0720_FluidR3_GM_sf2_file",
    "0720_GeneralUserGS_sf2_file",
    //0720_SBLive_sf2
    //0720_SoundBlasterOld_sf2
    "0721_FluidR3_GM_sf2_file"
    //0721_SoundBlasterOld_sf
  ],
  gm_flute: [
    // Flute: Pipe
    "0730_JCLive_sf2_file",
    "0730_Aspirin_sf2_file",
    //0730_Chaos_sf2_file // etune
    "0730_FluidR3_GM_sf2_file",
    "0730_GeneralUserGS_sf2_file",
    //0730_SBLive_sf2
    //0730_SoundBlasterOld_sf2
    //0731_Aspirin_sf2_file // not a flute
    "0731_FluidR3_GM_sf2_file"
    //0731_SoundBlasterOld_sf
  ],
  gm_recorder: [
    // Recorder: Pipe
    "0740_JCLive_sf2_file",
    "0740_Aspirin_sf2_file",
    "0740_Chaos_sf2_file",
    "0740_FluidR3_GM_sf2_file",
    "0740_GeneralUserGS_sf2_file"
    //0740_SBLive_sf2
    //0740_SoundBlasterOld_sf2
    // 0741_GeneralUserGS_sf2_file // missin
  ],
  gm_pan_flute: [
    // Pan Flute: Pipe
    "0750_JCLive_sf2_file",
    "0750_FluidR3_GM_sf2_file",
    "0750_Aspirin_sf2_file",
    "0750_Chaos_sf2_file",
    "0750_GeneralUserGS_sf2_file",
    //0750_SBLive_sf2
    //0750_SoundBlasterOld_sf2
    "0751_Aspirin_sf2_file",
    "0751_FluidR3_GM_sf2_file",
    "0751_GeneralUserGS_sf2_file"
    //0751_SoundBlasterOld_sf
  ],
  gm_blown_bottle: [
    // Blown bottle: Pipe
    "0760_FluidR3_GM_sf2_file",
    "0760_JCLive_sf2_file",
    // 0760_Aspirin_sf2_file // same as below w crackle
    "0760_Chaos_sf2_file",
    "0760_GeneralUserGS_sf2_file",
    //0760_SBLive_sf2
    //0760_SoundBlasterOld_sf2
    "0761_FluidR3_GM_sf2_file"
    // 0761_GeneralUserGS_sf2_file // missing
    //0761_SoundBlasterOld_sf2
    // 0762_GeneralUserGS_sf2_file // missin
  ],
  gm_shakuhachi: [
    // Shakuhachi: Pipe
    "0770_JCLive_sf2_file",
    "0771_FluidR3_GM_sf2_file",
    "0770_Aspirin_sf2_file",
    //0770_Chaos_sf2_file // not shakuhachi
    "0770_FluidR3_GM_sf2_file",
    "0770_GeneralUserGS_sf2_file"
    //0770_SBLive_sf2
    //0770_SoundBlasterOld_sf2
    // 0771_GeneralUserGS_sf2_file // missing
    // 0772_GeneralUserGS_sf2_file // missin
  ],
  gm_whistle: [
    // Whistle: Pipe
    "0780_FluidR3_GM_sf2_file",
    "0780_JCLive_sf2_file",
    "0780_Aspirin_sf2_file",
    "0780_Chaos_sf2_file"
    //0780_GeneralUserGS_sf2_file // loud..
    //0780_SBLive_sf2
    //0780_SoundBlasterOld_sf2
    // 0781_GeneralUserGS_sf2_file // detune + crackle
  ],
  gm_ocarina: [
    // Ocarina: Pipe
    "0790_FluidR3_GM_sf2_file",
    "0790_JCLive_sf2_file",
    "0790_Aspirin_sf2_file",
    //0790_Chaos_sf2_file // same as above
    "0790_GeneralUserGS_sf2_file"
    //0790_SBLive_sf2
    //0790_SoundBlasterOld_sf2
    //0791_GeneralUserGS_sf2_file // missin
  ],
  gm_lead_1_square: [
    // Lead 1 (square): Synth Lead
    "0800_Aspirin_sf2_file",
    "0800_Chaos_sf2_file",
    "0800_FluidR3_GM_sf2_file"
    // 0800_GeneralUserGS_sf2_file // detuned
    // 0800_JCLive_sf2_file // detuned
    //0800_SBLive_sf2
    //0800_SoundBlasterOld_sf2
    //0801_FluidR3_GM_sf2_file // detune
    // 0801_GeneralUserGS_sf2_file // detun
  ],
  gm_lead_2_sawtooth: [
    // Lead 2 (sawtooth): Synth Lead
    "0810_JCLive_sf2_file",
    "0810_Aspirin_sf2_file",
    "0810_Chaos_sf2_file",
    "0810_FluidR3_GM_sf2_file",
    "0810_GeneralUserGS_sf2_file",
    //0810_SBLive_sf2
    //0810_SoundBlasterOld_sf2
    "0811_Aspirin_sf2_file",
    "0811_GeneralUserGS_sf2_file"
    //0811_SoundBlasterOld_sf
  ],
  gm_lead_3_calliope: [
    // Lead 3 (calliope): Synth Lead
    "0820_JCLive_sf2_file",
    "0820_Aspirin_sf2_file",
    "0820_Chaos_sf2_file",
    "0820_FluidR3_GM_sf2_file",
    "0820_GeneralUserGS_sf2_file",
    //0820_SBLive_sf2
    //0820_SoundBlasterOld_sf2
    "0821_FluidR3_GM_sf2_file",
    "0821_GeneralUserGS_sf2_file"
    //0821_SoundBlasterOld_sf2
    // 0822_GeneralUserGS_sf2_file // missing
    //0823_GeneralUserGS_sf2_file // missin
  ],
  gm_lead_4_chiff: [
    // Lead 4 (chiff): Synth Lead
    "0830_JCLive_sf2_file",
    "0830_Aspirin_sf2_file",
    // 0830_Chaos_sf2_file // same as above
    "0830_FluidR3_GM_sf2_file",
    "0830_GeneralUserGS_sf2_file",
    //0830_SBLive_sf2
    //0830_SoundBlasterOld_sf2
    "0831_FluidR3_GM_sf2_file",
    "0831_GeneralUserGS_sf2_file"
    //0831_SoundBlasterOld_sf
  ],
  gm_lead_5_charang: [
    // Lead 5 (charang): Synth Lead
    "0840_JCLive_sf2_file",
    "0840_FluidR3_GM_sf2_file",
    "0840_Aspirin_sf2_file",
    "0840_Chaos_sf2_file",
    "0840_GeneralUserGS_sf2_file",
    //0840_SBLive_sf2
    //0840_SoundBlasterOld_sf2
    "0841_Aspirin_sf2_file",
    "0841_Chaos_sf2_file",
    "0841_FluidR3_GM_sf2_file",
    "0841_GeneralUserGS_sf2_file",
    //0841_JCLive_sf2_file // +1oct + detune
    //0841_SoundBlasterOld_sf2
    "0842_FluidR3_GM_sf2_file"
  ],
  gm_lead_6_voice: [
    // Lead 6 (voice): Synth Lead
    "0850_JCLive_sf2_file",
    "0850_Aspirin_sf2_file",
    // 0850_Chaos_sf2_file // same as above
    "0850_FluidR3_GM_sf2_file",
    // 0850_GeneralUserGS_sf2_file // no voice
    //0850_SBLive_sf2
    //0850_SoundBlasterOld_sf2
    "0851_FluidR3_GM_sf2_file",
    "0851_GeneralUserGS_sf2_file",
    "0851_JCLive_sf2_file"
    //0851_SoundBlasterOld_sf
  ],
  gm_lead_7_fifths: [
    // Lead 7 (fifths): Synth Lead
    "0860_JCLive_sf2_file",
    "0860_Aspirin_sf2_file",
    "0860_Chaos_sf2_file",
    // 0860_FluidR3_GM_sf2_file // loud and not fitting
    "0860_GeneralUserGS_sf2_file",
    //0860_SBLive_sf2
    //0860_SoundBlasterOld_sf2
    "0861_Aspirin_sf2_file"
    // 0861_FluidR3_GM_sf2_file // lout and not fitting
    //0861_SoundBlasterOld_sf
  ],
  gm_lead_8_bass_lead: [
    // Lead 8 (bass + lead): Synth Lead
    "0870_JCLive_sf2_file",
    "0870_Aspirin_sf2_file",
    "0870_Chaos_sf2_file",
    "0870_FluidR3_GM_sf2_file",
    "0870_GeneralUserGS_sf2_file"
    //0870_SBLive_sf2
    //0870_SoundBlasterOld_sf2
    // 0871_GeneralUserGS_sf2_file // loud + detune
    //0872_GeneralUserGS_sf2_file // loud
    //0873_GeneralUserGS_sf2_file // lou
  ],
  gm_pad_new_age: [
    // Pad 1 (new age): Synth Pad
    "0880_JCLive_sf2_file",
    "0880_Aspirin_sf2_file",
    "0880_Chaos_sf2_file",
    "0880_FluidR3_GM_sf2_file",
    "0880_GeneralUserGS_sf2_file",
    //0880_SBLive_sf2
    //0880_SoundBlasterOld_sf2
    "0881_Aspirin_sf2_file",
    "0881_FluidR3_GM_sf2_file",
    "0881_GeneralUserGS_sf2_file",
    //0881_SoundBlasterOld_sf2
    "0882_Aspirin_sf2_file",
    // 0882_FluidR3_GM_sf2_file // missing
    "0882_GeneralUserGS_sf2_file",
    //0883_GeneralUserGS_sf2_file // missing
    // 0884_GeneralUserGS_sf2_file // broken
    "0885_GeneralUserGS_sf2_file",
    //0886_GeneralUserGS_sf2_file // not a pad
    "0887_GeneralUserGS_sf2_file"
    //0888_GeneralUserGS_sf2_file // not a pad
    //0889_GeneralUserGS_sf2_file // not a pa
  ],
  gm_pad_warm: [
    // Pad 2 (warm): Synth Pad
    "0890_JCLive_sf2_file",
    "0890_Aspirin_sf2_file",
    "0890_Chaos_sf2_file",
    "0890_FluidR3_GM_sf2_file",
    "0890_GeneralUserGS_sf2_file",
    //0890_SBLive_sf2
    //0890_SoundBlasterOld_sf2
    "0891_Aspirin_sf2_file",
    "0891_FluidR3_GM_sf2_file"
    // 0891_GeneralUserGS_sf2_file // nois
  ],
  gm_pad_poly: [
    // Pad 3 (polysynth): Synth Pad
    //0900_Aspirin_sf2_file // same as belo
    "0900_JCLive_sf2_file",
    "0900_Chaos_sf2_file",
    "0900_FluidR3_GM_sf2_file",
    "0900_GeneralUserGS_sf2_file",
    //0900_SBLive_sf2
    //0900_SoundBlasterOld_sf2
    "0901_Aspirin_sf2_file",
    "0901_FluidR3_GM_sf2_file",
    "0901_GeneralUserGS_sf2_file"
    //0901_SoundBlasterOld_sf
  ],
  gm_pad_choir: [
    // Pad 4 (choir): Synth Pad
    "0910_FluidR3_GM_sf2_file",
    "0910_JCLive_sf2_file",
    "0910_Aspirin_sf2_file",
    //0910_Chaos_sf2_file // +1oct
    "0910_GeneralUserGS_sf2_file",
    //0910_SBLive_sf2
    //0910_SoundBlasterOld_sf2
    // 0911_Aspirin_sf2_file // fluty crackles
    "0911_GeneralUserGS_sf2_file",
    "0911_JCLive_sf2_file"
    //0911_SoundBlasterOld_sf
  ],
  gm_pad_bowed: [
    // Pad 5 (bowed): Synth Pad
    "0920_JCLive_sf2_file",
    "0920_Aspirin_sf2_file",
    //0920_Chaos_sf2_file // same as above
    //0920_FluidR3_GM_sf2_file // detuned?
    "0920_GeneralUserGS_sf2_file",
    //0920_SBLive_sf2
    //0920_SoundBlasterOld_sf2
    "0921_Aspirin_sf2_file",
    "0921_GeneralUserGS_sf2_file"
    //0921_SoundBlasterOld_sf
  ],
  gm_pad_metallic: [
    // Pad 6 (metallic): Synth Pad
    "0930_Aspirin_sf2_file",
    "0930_Chaos_sf2_file",
    "0930_FluidR3_GM_sf2_file",
    "0930_GeneralUserGS_sf2_file",
    // 0930_JCLive_sf2_file // buggy zones: guitar / synth
    //0930_SBLive_sf2
    //0930_SoundBlasterOld_sf2
    "0931_Aspirin_sf2_file",
    "0931_FluidR3_GM_sf2_file",
    "0931_GeneralUserGS_sf2_file"
    //0931_SoundBlasterOld_sf
  ],
  gm_pad_halo: [
    // Pad 7 (halo): Synth Pad
    // 0940_Aspirin_sf2_file // same as below
    "0940_Chaos_sf2_file",
    "0940_FluidR3_GM_sf2_file",
    "0940_GeneralUserGS_sf2_file",
    "0940_JCLive_sf2_file",
    //0940_SBLive_sf2
    //0940_SoundBlasterOld_sf2
    "0941_Aspirin_sf2_file",
    "0941_FluidR3_GM_sf2_file",
    "0941_GeneralUserGS_sf2_file",
    "0941_JCLive_sf2_file"
  ],
  gm_pad_sweep: [
    // Pad 8 (sweep): Synth Pad
    "0950_Aspirin_sf2_file",
    "0950_Chaos_sf2_file",
    "0950_FluidR3_GM_sf2_file",
    "0950_GeneralUserGS_sf2_file",
    "0950_JCLive_sf2_file",
    //0950_SBLive_sf2
    //0950_SoundBlasterOld_sf2
    "0951_FluidR3_GM_sf2_file",
    "0951_GeneralUserGS_sf2_file"
  ],
  gm_fx_rain: [
    // FX 1 (rain): Synth Effects
    //0960_Aspirin_sf2_file //mixed samples?
    "0960_FluidR3_GM_sf2_file",
    "0960_Chaos_sf2_file",
    "0960_GeneralUserGS_sf2_file",
    // 0960_JCLive_sf2_file // mixed samples?
    //0960_SBLive_sf2
    //0960_SoundBlasterOld_sf2
    "0961_Aspirin_sf2_file",
    "0961_FluidR3_GM_sf2_file",
    // 0961_GeneralUserGS_sf2_file // ?!?!
    //0961_SoundBlasterOld_sf2
    "0962_GeneralUserGS_sf2_file"
  ],
  gm_fx_soundtrack: [
    // FX 2 (soundtrack): Synth Effects
    "0970_FluidR3_GM_sf2_file",
    "0970_Aspirin_sf2_file",
    //0970_Chaos_sf2_file // wrong pitch
    "0970_GeneralUserGS_sf2_file",
    //0970_JCLive_sf2_file // wrong pitch
    //0970_SBLive_sf2
    //0970_SoundBlasterOld_sf2
    "0971_FluidR3_GM_sf2_file",
    "0971_GeneralUserGS_sf2_file"
    //0971_SoundBlasterOld_sf
  ],
  gm_fx_crystal: [
    // FX 3 (crystal): Synth Effects
    "0980_Aspirin_sf2_file",
    "0980_JCLive_sf2_file",
    "0980_Chaos_sf2_file",
    // 0980_FluidR3_GM_sf2_file // some notes are weird
    "0980_GeneralUserGS_sf2_file",
    "0981_FluidR3_GM_sf2_file",
    //0980_SBLive_sf2
    //0980_SoundBlasterOld_sf2
    "0981_Aspirin_sf2_file",
    "0981_GeneralUserGS_sf2_file",
    //0981_SoundBlasterOld_sf2
    "0982_GeneralUserGS_sf2_file",
    "0983_GeneralUserGS_sf2_file",
    "0984_GeneralUserGS_sf2_file"
  ],
  gm_fx_atmosphere: [
    // FX 4 (atmosphere): Synth Effects
    "0990_JCLive_sf2_file",
    "0990_Aspirin_sf2_file",
    "0990_Chaos_sf2_file",
    "0990_FluidR3_GM_sf2_file",
    "0990_GeneralUserGS_sf2_file",
    //0990_SBLive_sf2
    //0990_SoundBlasterOld_sf2
    "0991_Aspirin_sf2_file",
    "0991_FluidR3_GM_sf2_file",
    "0991_GeneralUserGS_sf2_file",
    "0991_JCLive_sf2_file",
    //0991_SoundBlasterOld_sf2
    "0992_FluidR3_GM_sf2_file",
    "0992_JCLive_sf2_file",
    "0993_JCLive_sf2_file",
    "0994_JCLive_sf2_file"
  ],
  gm_fx_brightness: [
    // FX 5 (brightness): Synth Effects
    "1000_JCLive_sf2_file",
    "1000_Aspirin_sf2_file",
    "1000_Chaos_sf2_file",
    "1000_FluidR3_GM_sf2_file",
    "1000_GeneralUserGS_sf2_file",
    //1000_SBLive_sf2
    //1000_SoundBlasterOld_sf2
    "1001_Aspirin_sf2_file",
    "1001_FluidR3_GM_sf2_file",
    "1001_GeneralUserGS_sf2_file",
    "1001_JCLive_sf2_file",
    //1001_SoundBlasterOld_sf2
    "1002_Aspirin_sf2_file",
    "1002_FluidR3_GM_sf2_file",
    "1002_GeneralUserGS_sf2_file"
  ],
  gm_fx_goblins: [
    // FX 6 (goblins): Synth Effects
    "1010_FluidR3_GM_sf2_file",
    "1010_JCLive_sf2_file",
    "1010_Aspirin_sf2_file",
    "1010_Chaos_sf2_file",
    "1010_GeneralUserGS_sf2_file",
    //1010_SBLive_sf2
    //1010_SoundBlasterOld_sf2
    "1011_Aspirin_sf2_file",
    "1011_FluidR3_GM_sf2_file",
    "1011_JCLive_sf2_file",
    "1012_Aspirin_sf2_file"
  ],
  gm_fx_echoes: [
    // FX 7 (echoes): Synth Effects
    "1020_FluidR3_GM_sf2_file",
    "1020_JCLive_sf2_file",
    "1020_Aspirin_sf2_file",
    "1020_Chaos_sf2_file",
    "1020_GeneralUserGS_sf2_file",
    //1020_SBLive_sf2
    //1020_SoundBlasterOld_sf2
    "1021_Aspirin_sf2_file",
    "1021_FluidR3_GM_sf2_file",
    "1021_GeneralUserGS_sf2_file",
    "1021_JCLive_sf2_file",
    //1021_SoundBlasterOld_sf2
    "1022_GeneralUserGS_sf2_file"
  ],
  gm_fx_sci_fi: [
    // FX 8 (sci_fi): Synth Effects
    "1030_FluidR3_GM_sf2_file",
    "1030_Aspirin_sf2_file",
    "1030_Chaos_sf2_file",
    "1030_GeneralUserGS_sf2_file",
    "1030_JCLive_sf2_file",
    //1030_SBLive_sf2
    //1030_SoundBlasterOld_sf2
    "1031_Aspirin_sf2_file",
    "1031_FluidR3_GM_sf2_file",
    "1031_GeneralUserGS_sf2_file",
    //1031_SoundBlasterOld_sf2
    "1032_FluidR3_GM_sf2_file"
  ],
  gm_sitar: [
    // Sitar: Ethnic
    "1040_Aspirin_sf2_file",
    "1040_FluidR3_GM_sf2_file",
    "1040_JCLive_sf2_file",
    "1040_Chaos_sf2_file",
    "1040_GeneralUserGS_sf2_file",
    //1040_SBLive_sf2
    //1040_SoundBlasterOld_sf2
    "1041_FluidR3_GM_sf2_file",
    "1041_GeneralUserGS_sf2_file"
  ],
  gm_banjo: [
    // Banjo: Ethnic
    "1050_FluidR3_GM_sf2_file",
    "1050_JCLive_sf2_file",
    "1050_Aspirin_sf2_file",
    "1050_Chaos_sf2_file",
    "1050_GeneralUserGS_sf2_file",
    //1050_SBLive_sf2
    //1050_SoundBlasterOld_sf2
    "1051_GeneralUserGS_sf2_file"
  ],
  gm_shamisen: [
    // Shamisen: Ethnic
    "1060_JCLive_sf2_file",
    "1060_FluidR3_GM_sf2_file",
    "1060_Aspirin_sf2_file",
    "1060_Chaos_sf2_file",
    "1060_GeneralUserGS_sf2_file",
    //1060_SBLive_sf2
    //1060_SoundBlasterOld_sf2
    "1061_FluidR3_GM_sf2_file",
    "1061_GeneralUserGS_sf2_file"
    //1061_SoundBlasterOld_sf
  ],
  gm_koto: [
    // Koto: Ethnic
    "1070_FluidR3_GM_sf2_file",
    "1070_JCLive_sf2_file",
    "1070_Aspirin_sf2_file",
    "1070_Chaos_sf2_file",
    "1070_GeneralUserGS_sf2_file",
    //1070_SBLive_sf2
    //1070_SoundBlasterOld_sf2
    "1071_FluidR3_GM_sf2_file",
    "1071_GeneralUserGS_sf2_file",
    "1072_GeneralUserGS_sf2_file",
    "1073_GeneralUserGS_sf2_file"
  ],
  gm_kalimba: [
    // Kalimba: Ethnic
    "1080_JCLive_sf2_file",
    "1080_FluidR3_GM_sf2_file",
    "1080_Aspirin_sf2_file",
    "1080_Chaos_sf2_file",
    "1080_GeneralUserGS_sf2_file"
    //1080_SBLive_sf2
    //1080_SoundBlasterOld_sf2
    //1081_SoundBlasterOld_sf
  ],
  gm_bagpipe: [
    // Bagpipe: Ethnic
    "1090_Aspirin_sf2_file"
    // '1090_Chaos_sf2_file', // broken pitches
    // '1090_GeneralUserGS_sf2_file', // broken pitches
    // '1090_FluidR3_GM_sf2_file', // broken pitches ?
    // '1090_JCLive_sf2_file', // broken pitches ?
    //1090_SBLive_sf2
    //1090_SoundBlasterOld_sf2
    //1091_SoundBlasterOld_sf
  ],
  gm_fiddle: [
    // Fiddle: Ethnic
    "1100_JCLive_sf2_file",
    "1100_Aspirin_sf2_file",
    "1100_Chaos_sf2_file",
    "1100_FluidR3_GM_sf2_file",
    "1100_GeneralUserGS_sf2_file",
    //1100_SBLive_sf2
    //1100_SoundBlasterOld_sf2
    "1101_Aspirin_sf2_file",
    "1101_FluidR3_GM_sf2_file",
    "1101_GeneralUserGS_sf2_file",
    "1102_GeneralUserGS_sf2_file"
  ],
  gm_shanai: [
    // Shanai: Ethnic
    "1110_Aspirin_sf2_file",
    "1110_FluidR3_GM_sf2_file",
    "1110_JCLive_sf2_file",
    "1110_Chaos_sf2_file",
    "1110_GeneralUserGS_sf2_file"
    //1110_SBLive_sf2
    //1110_SoundBlasterOld_sf
  ],
  gm_tinkle_bell: [
    // Tinkle Bell: Percussive
    "1120_Aspirin_sf2_file"
    // '1120_Chaos_sf2_file', // same as above
    // '1120_GeneralUserGS_sf2_file', // sounds exactly as Aspirin
    // '1120_FluidR3_GM_sf2_file', // +1oct
    // '1120_JCLive_sf2_file', // +1oct
    //1120_SBLive_sf2
    //1120_SoundBlasterOld_sf2
    //1121_SoundBlasterOld_sf
  ],
  gm_agogo: [
    // Agogo: Percussive
    "1130_JCLive_sf2_file",
    "1130_Aspirin_sf2_file",
    "1130_Chaos_sf2_file",
    "1130_FluidR3_GM_sf2_file",
    "1130_GeneralUserGS_sf2_file",
    //1130_SBLive_sf2
    //1130_SoundBlasterOld_sf2
    "1131_FluidR3_GM_sf2_file"
    //1131_SoundBlasterOld_sf
  ],
  gm_steel_drums: [
    // Steel Drums: Percussive
    "1140_FluidR3_GM_sf2_file",
    "1140_Aspirin_sf2_file",
    "1140_JCLive_sf2_file",
    "1140_Chaos_sf2_file",
    "1140_GeneralUserGS_sf2_file",
    //1140_SBLive_sf2
    //1140_SoundBlasterOld_sf2
    "1141_FluidR3_GM_sf2_file"
  ],
  gm_woodblock: [
    // Woodblock: Percussive
    "1150_JCLive_sf2_file",
    "1150_Aspirin_sf2_file",
    "1150_Chaos_sf2_file",
    "1150_FluidR3_GM_sf2_file",
    "1150_GeneralUserGS_sf2_file",
    //1150_SBLive_sf2
    //1150_SoundBlasterOld_sf2
    "1151_FluidR3_GM_sf2_file",
    "1151_GeneralUserGS_sf2_file",
    "1152_FluidR3_GM_sf2_file",
    "1152_GeneralUserGS_sf2_file"
  ],
  gm_taiko_drum: [
    // Taiko Drum: Percussive
    "1160_JCLive_sf2_file",
    "1160_FluidR3_GM_sf2_file",
    "1160_Aspirin_sf2_file",
    "1160_Chaos_sf2_file",
    "1160_GeneralUserGS_sf2_file",
    //1160_SBLive_sf2
    //1160_SoundBlasterOld_sf2
    "1161_FluidR3_GM_sf2_file",
    "1161_GeneralUserGS_sf2_file",
    //1161_SoundBlasterOld_sf2
    "1162_FluidR3_GM_sf2_file",
    "1162_GeneralUserGS_sf2_file",
    "1163_FluidR3_GM_sf2_file"
  ],
  gm_melodic_tom: [
    // Melodic Tom: Percussive
    "1170_JCLive_sf2_file",
    "1170_Aspirin_sf2_file",
    "1170_Chaos_sf2_file",
    "1170_FluidR3_GM_sf2_file",
    "1170_GeneralUserGS_sf2_file",
    //1170_SBLive_sf2
    //1170_SoundBlasterOld_sf2
    "1171_FluidR3_GM_sf2_file",
    "1171_GeneralUserGS_sf2_file",
    "1172_FluidR3_GM_sf2_file",
    "1173_FluidR3_GM_sf2_file"
  ],
  gm_synth_drum: [
    // Synth Drum: Percussive
    "1180_JCLive_sf2_file",
    "1180_Aspirin_sf2_file",
    "1180_Chaos_sf2_file",
    "1180_FluidR3_GM_sf2_file",
    "1180_GeneralUserGS_sf2_file",
    //1180_SBLive_sf2
    //1180_SoundBlasterOld_sf2
    "1181_FluidR3_GM_sf2_file",
    "1181_GeneralUserGS_sf2_file"
    //1181_SoundBlasterOld_sf
  ],
  gm_reverse_cymbal: [
    // Reverse Cymbal: Percussive
    "1190_JCLive_sf2_file",
    "1190_Aspirin_sf2_file",
    "1190_Chaos_sf2_file",
    "1190_FluidR3_GM_sf2_file",
    "1190_GeneralUserGS_sf2_file",
    //1190_SBLive_sf2
    //1190_SoundBlasterOld_sf2
    "1191_GeneralUserGS_sf2_file",
    "1192_GeneralUserGS_sf2_file",
    "1193_GeneralUserGS_sf2_file",
    "1194_GeneralUserGS_sf2_file"
  ],
  gm_guitar_fret_noise: [
    // Guitar Fret Noise: Sound effects
    "1200_JCLive_sf2_file",
    "1200_Aspirin_sf2_file",
    "1200_Chaos_sf2_file",
    "1200_FluidR3_GM_sf2_file",
    "1200_GeneralUserGS_sf2_file",
    //1200_SBLive_sf2
    //1200_SoundBlasterOld_sf2
    "1201_Aspirin_sf2_file",
    "1201_GeneralUserGS_sf2_file",
    "1202_GeneralUserGS_sf2_file"
  ],
  gm_breath_noise: [
    // Breath Noise: Sound effects
    "1210_FluidR3_GM_sf2_file",
    "1210_JCLive_sf2_file",
    "1210_Aspirin_sf2_file",
    "1210_Chaos_sf2_file",
    "1210_GeneralUserGS_sf2_file",
    //1210_SBLive_sf2
    //1210_SoundBlasterOld_sf2
    "1211_Aspirin_sf2_file",
    "1211_GeneralUserGS_sf2_file",
    "1212_GeneralUserGS_sf2_file"
  ],
  gm_seashore: [
    // Seashore: Sound effects
    "1220_JCLive_sf2_file",
    "1220_Aspirin_sf2_file",
    "1220_Chaos_sf2_file",
    "1220_FluidR3_GM_sf2_file",
    "1220_GeneralUserGS_sf2_file",
    //1220_SBLive_sf2
    //1220_SoundBlasterOld_sf2
    "1221_Aspirin_sf2_file",
    "1221_GeneralUserGS_sf2_file",
    "1221_JCLive_sf2_file",
    "1222_Aspirin_sf2_file",
    "1222_GeneralUserGS_sf2_file",
    "1223_Aspirin_sf2_file",
    "1223_GeneralUserGS_sf2_file",
    "1224_Aspirin_sf2_file",
    "1224_GeneralUserGS_sf2_file",
    "1225_GeneralUserGS_sf2_file",
    "1226_GeneralUserGS_sf2_file"
  ],
  gm_bird_tweet: [
    // Bird Tweet: Sound effects
    "1230_FluidR3_GM_sf2_file",
    "1230_JCLive_sf2_file",
    "1230_Aspirin_sf2_file",
    // '1230_Chaos_sf2_file',
    "1230_GeneralUserGS_sf2_file",
    //1230_SBLive_sf2
    //1230_SoundBlasterOld_sf2
    //'1231_Aspirin_sf2_file',
    "1231_GeneralUserGS_sf2_file",
    // dog
    // '1232_Aspirin_sf2_file',// ?
    "1232_GeneralUserGS_sf2_file",
    // horse
    // '1233_GeneralUserGS_sf2_file', //
    "1234_GeneralUserGS_sf2_file"
    // scratch
  ],
  gm_telephone: [
    // Telephone Ring: Sound effects
    "1240_JCLive_sf2_file",
    "1240_Aspirin_sf2_file",
    "1240_Chaos_sf2_file",
    "1240_FluidR3_GM_sf2_file",
    // '1240_GeneralUserGS_sf2_file',
    //1240_SBLive_sf2
    //1240_SoundBlasterOld_sf2
    "1241_Aspirin_sf2_file",
    // door?
    //'1241_GeneralUserGS_sf2_file',
    // '1242_Aspirin_sf2_file', // ?
    "1242_GeneralUserGS_sf2_file",
    // door
    "1243_Aspirin_sf2_file",
    // scratch
    "1243_GeneralUserGS_sf2_file",
    // door close?
    "1244_Aspirin_sf2_file",
    // bells
    "1244_GeneralUserGS_sf2_file"
    // bells
  ],
  gm_helicopter: [
    // Helicopter: Sound effects
    "1250_JCLive_sf2_file",
    "1250_Aspirin_sf2_file",
    // '1250_Chaos_sf2_file', // same as above
    "1250_FluidR3_GM_sf2_file",
    "1250_GeneralUserGS_sf2_file",
    //1250_SBLive_sf2
    //1250_SoundBlasterOld_sf2
    // '1251_Aspirin_sf2_file', // slooow
    "1251_FluidR3_GM_sf2_file",
    // guitar
    "1251_GeneralUserGS_sf2_file",
    // engine start with loop at end..
    "1252_Aspirin_sf2_file",
    // alien
    "1252_FluidR3_GM_sf2_file",
    // seashore
    "1252_GeneralUserGS_sf2_file",
    // carbreak
    // '1253_Aspirin_sf2_file', // plane
    "1253_GeneralUserGS_sf2_file",
    // racing car
    // '1254_Aspirin_sf2_file',
    "1254_GeneralUserGS_sf2_file",
    // breaking
    // '1255_Aspirin_sf2_file',
    "1255_GeneralUserGS_sf2_file",
    // siren
    // '1256_Aspirin_sf2_file',
    "1256_GeneralUserGS_sf2_file",
    // hmm
    // '1257_Aspirin_sf2_file',
    "1257_GeneralUserGS_sf2_file",
    // noise
    // '1258_Aspirin_sf2_file',
    "1258_GeneralUserGS_sf2_file",
    // metallic noise
    "1259_GeneralUserGS_sf2_file"
    // watery nosie
  ],
  gm_applause: [
    // Applause: Sound effects
    "1260_JCLive_sf2_file",
    "1260_Aspirin_sf2_file",
    "1260_Chaos_sf2_file",
    "1260_FluidR3_GM_sf2_file",
    "1260_GeneralUserGS_sf2_file",
    //1260_SBLive_sf2
    //1260_SoundBlasterOld_sf2
    "1261_Aspirin_sf2_file",
    "1261_GeneralUserGS_sf2_file",
    "1262_Aspirin_sf2_file",
    "1262_GeneralUserGS_sf2_file",
    "1263_Aspirin_sf2_file",
    "1263_GeneralUserGS_sf2_file",
    "1264_Aspirin_sf2_file",
    "1264_GeneralUserGS_sf2_file",
    "1265_Aspirin_sf2_file",
    "1265_GeneralUserGS_sf2_file"
  ],
  gm_gunshot: [
    // Gunshot: Sound effects
    "1270_JCLive_sf2_file",
    "1270_Aspirin_sf2_file",
    "1270_Chaos_sf2_file",
    "1270_FluidR3_GM_sf2_file",
    "1270_GeneralUserGS_sf2_file",
    //1270_SBLive_sf2
    //1270_SoundBlasterOld_sf2
    "1271_Aspirin_sf2_file",
    "1271_GeneralUserGS_sf2_file",
    "1272_Aspirin_sf2_file",
    "1272_GeneralUserGS_sf2_file",
    "1273_GeneralUserGS_sf2_file",
    "1274_GeneralUserGS_sf2_file",
    ""
  ]
};
let defaultSoundfontUrl = "https://felixroos.github.io/webaudiofontdata/sound", soundfontUrl = defaultSoundfontUrl;
function setSoundfontUrl(e) {
  soundfontUrl = e;
}
let loadCache = {};
async function loadFont(name) {
  if (loadCache[name])
    return loadCache[name];
  const load = async () => {
    const url = `${soundfontUrl}/${name}.js`, preset = await fetch(url).then((e) => e.text());
    let [_, data] = preset.split("={");
    return eval("{" + data);
  };
  return loadCache[name] = load(), loadCache[name];
}
async function getFontBufferSource(e, l2, s) {
  let { note: f2 = "c3", freq: a } = l2, r;
  if (a)
    r = Pe$1(a);
  else if (typeof f2 == "string")
    r = pt$1(f2);
  else if (typeof f2 == "number")
    r = f2;
  else
    throw new Error(`unexpected "note" type "${typeof f2}"`);
  const { buffer: n, zone: i2 } = await getFontPitch(e, r, s), G2 = s.createBufferSource();
  G2.buffer = n;
  const u = i2.originalPitch - 100 * i2.coarseTune - i2.fineTune, o = 1 * Math.pow(2, (100 * r - u) / 1200);
  return G2.playbackRate.value = o, i2.loopStart > 1 && i2.loopStart < i2.loopEnd && (G2.loop = true, G2.loopStart = i2.loopStart / i2.sampleRate, G2.loopEnd = i2.loopEnd / i2.sampleRate), G2;
}
let bufferCache = {};
async function getFontPitch(e, l2, s) {
  const f2 = `${e}:::${l2}`;
  if (bufferCache[f2])
    return bufferCache[f2];
  const a = async () => {
    const r = await loadFont(e);
    if (!r)
      throw new Error(`Could not load soundfont ${e}`);
    const n = findZone(r, l2);
    if (!n)
      throw new Error("no soundfont zone found for preset ", e, "pitch", l2);
    const i2 = await getBuffer(n, s);
    if (!i2)
      throw new Error(`no soundfont buffer found for preset ${e}, pitch: ${l2}`);
    return { buffer: i2, zone: n };
  };
  return bufferCache[f2] = a(), bufferCache[f2];
}
function findZone(e, l2) {
  return e.find((s) => s.keyRangeLow <= l2 && s.keyRangeHigh + 1 >= l2);
}
async function getBuffer(e, l2) {
  if (e.sample) {
    console.warn("zone.sample untested!");
    const f2 = atob(e.sample);
    e.buffer = l2.createBuffer(1, f2.length / 2, e.sampleRate);
    const a = e.buffer.getChannelData(0);
    let r, n, i2;
    for (var s = 0; s < f2.length / 2; s++)
      r = f2.charCodeAt(s * 2), n = f2.charCodeAt(s * 2 + 1), r < 0 && (r = 256 + r), n < 0 && (n = 256 + n), i2 = n * 256 + r, i2 >= 65536 / 2 && (i2 = i2 - 65536), a[s] = i2 / 65536;
  } else if (e.file) {
    const f2 = e.file.length, a = new ArrayBuffer(f2), r = new Uint8Array(a), n = atob(e.file);
    let i2;
    for (let G2 = 0; G2 < n.length; G2++)
      i2 = n.charCodeAt(G2), r[G2] = i2;
    return new Promise((G2) => l2.decodeAudioData(a, G2));
  }
}
function registerSoundfonts() {
  Object.entries(gm).forEach(([e, l2]) => {
    j$1(
      e,
      async (s, f2, a) => {
        const [r, n, i2, G2] = Q$2([
          f2.attack,
          f2.decay,
          f2.sustain,
          f2.release
        ]), { duration: u } = f2, o = Ha(f2.n, l2.length), C3 = l2[o], U2 = x$1(), t2 = await getFontBufferSource(C3, f2, U2);
        t2.start(s);
        const p = U2.createGain(), d2 = t2.connect(p), S2 = s + u;
        k$1(d2.gain, r, n, i2, G2, 0, 0.3, s, S2, "linear");
        let m2 = S2 + G2 + 0.01, F2 = pt(t2.detune, f2, s);
        ht(t2.detune, f2, s, S2), t2.stop(m2);
        const R2 = (M2) => {
        };
        return t2.onended = () => {
          t2.disconnect(), F2 == null ? void 0 : F2.stop(), d2.disconnect(), a();
        }, { node: d2, stop: R2 };
      },
      { type: "soundfont", prebake: true, fonts: l2 }
    );
  });
}
const instruments = [
  // Acoustic Grand Piano: Piano
  "0000_JCLive_sf2_file",
  "0000_Aspirin_sf2_file",
  "0000_Chaos_sf2_file",
  "0000_FluidR3_GM_sf2_file",
  "0000_GeneralUserGS_sf2_file",
  //'0000_SBLive_sf2',
  //'0000_SoundBlasterOld_sf2',
  "0001_FluidR3_GM_sf2_file",
  "0001_GeneralUserGS_sf2_file",
  // Bright Acoustic Piano: Piano
  "0010_Aspirin_sf2_file",
  "0010_Chaos_sf2_file",
  "0010_FluidR3_GM_sf2_file",
  "0010_GeneralUserGS_sf2_file",
  "0010_JCLive_sf2_file",
  //'0010_SBLive_sf2',
  //'0010_SoundBlasterOld_sf2',
  "0011_Aspirin_sf2_file",
  "0011_FluidR3_GM_sf2_file",
  "0011_GeneralUserGS_sf2_file",
  "0012_GeneralUserGS_sf2_file",
  // string??
  // Electric Grand Piano: Piano
  "0020_Aspirin_sf2_file",
  "0020_Chaos_sf2_file",
  "0020_FluidR3_GM_sf2_file",
  "0020_GeneralUserGS_sf2_file",
  "0020_JCLive_sf2_file",
  //'0020_SBLive_sf2',
  //'0020_SoundBlasterOld_sf2',
  "0021_Aspirin_sf2_file",
  "0021_GeneralUserGS_sf2_file",
  // ?
  "0022_Aspirin_sf2_file",
  // dx7 epiano like
  // Honky-tonk Piano: Piano
  "0030_Aspirin_sf2_file",
  "0030_Chaos_sf2_file",
  "0030_FluidR3_GM_sf2_file",
  "0030_GeneralUserGS_sf2_file",
  "0030_JCLive_sf2_file",
  //'0030_SBLive_sf2',
  //'0030_SoundBlasterOld_sf2',
  "0031_Aspirin_sf2_file",
  "0031_FluidR3_GM_sf2_file",
  "0031_GeneralUserGS_sf2_file",
  //'0031_SoundBlasterOld_sf2', // pianos until here
  // Electric Piano 1: Piano
  "0040_Aspirin_sf2_file",
  "0040_Chaos_sf2_file",
  "0040_FluidR3_GM_sf2_file",
  // rhodes
  "0040_GeneralUserGS_sf2_file",
  // staccato rhodes
  "0040_JCLive_sf2_file",
  // warbly rhodes
  //'0040_SBLive_sf2', // ?
  //'0040_SoundBlasterOld_sf2', // ?
  "0041_FluidR3_GM_sf2_file",
  // rhodes
  "0041_GeneralUserGS_sf2_file",
  // staccato rhodes
  //'0041_SoundBlasterOld_sf2', // ?
  "0042_GeneralUserGS_sf2_file",
  // staccato wurly
  "0043_GeneralUserGS_sf2_file",
  // high bell
  "0044_GeneralUserGS_sf2_file",
  // reed organ
  //'0045_GeneralUserGS_sf2_file', // ?
  "0046_GeneralUserGS_sf2_file",
  // reed organ
  // Electric Piano 2: Piano
  "0050_Aspirin_sf2_file",
  // glass piano
  "0050_Chaos_sf2_file",
  // short glass piano
  "0050_FluidR3_GM_sf2_file",
  // long glass piano !
  // ?
  "0050_GeneralUserGS_sf2_file",
  // short glass piano
  // cont
  "0050_JCLive_sf2_file",
  // glass piano
  //'0050_SBLive_sf2', // ?
  //'0050_SoundBlasterOld_sf2', // ?
  "0051_FluidR3_GM_sf2_file",
  // long lass organ
  "0051_GeneralUserGS_sf2_file",
  //'0052_GeneralUserGS_sf2_file', // ?
  "0053_GeneralUserGS_sf2_file",
  // normal piano...
  "0054_GeneralUserGS_sf2_file",
  // piano
  // Harpsichord: Piano
  "0060_Aspirin_sf2_file",
  // harpsichord
  "0060_Chaos_sf2_file",
  "0060_FluidR3_GM_sf2_file",
  // harpsichord !
  "0060_GeneralUserGS_sf2_file",
  "0060_JCLive_sf2_file",
  //'0060_SBLive_sf2',
  //'0060_SoundBlasterOld_sf2',
  "0061_Aspirin_sf2_file",
  "0061_GeneralUserGS_sf2_file",
  //'0061_SoundBlasterOld_sf2',
  "0062_GeneralUserGS_sf2_file",
  // Clavinet: Piano
  "0070_Aspirin_sf2_file",
  "0070_Chaos_sf2_file",
  "0070_FluidR3_GM_sf2_file",
  // '0070_GeneralUserGS_sf2_file', // half broken
  "0070_JCLive_sf2_file",
  //'0070_SBLive_sf2',
  //'0070_SoundBlasterOld_sf2',
  // '0071_GeneralUserGS_sf2_file', // half broken
  // Celesta: Chromatic Percussion
  "0080_Aspirin_sf2_file",
  "0080_Chaos_sf2_file",
  "0080_FluidR3_GM_sf2_file",
  "0080_GeneralUserGS_sf2_file",
  "0080_JCLive_sf2_file",
  //'0080_SBLive_sf2',
  //'0080_SoundBlasterOld_sf2',
  "0081_FluidR3_GM_sf2_file",
  // '0081_GeneralUserGS_sf2_file', // weird detuned
  //'0081_SoundBlasterOld_sf2',
  // Glockenspiel: Chromatic Percussion
  "0090_Aspirin_sf2_file",
  "0090_Chaos_sf2_file",
  "0090_FluidR3_GM_sf2_file",
  "0090_GeneralUserGS_sf2_file",
  "0090_JCLive_sf2_file",
  //'0090_SBLive_sf2',
  //'0090_SoundBlasterOld_sf2',
  //'0091_SoundBlasterOld_sf2',
  // Music Box: Chromatic Percussion
  "0100_Aspirin_sf2_file",
  "0100_Chaos_sf2_file",
  "0100_FluidR3_GM_sf2_file",
  "0100_GeneralUserGS_sf2_file",
  "0100_JCLive_sf2_file",
  //'0100_SBLive_sf2',
  //'0100_SoundBlasterOld_sf2',
  // '0101_GeneralUserGS_sf2_file', // weird detuned
  //'0101_SoundBlasterOld_sf2',
  // Vibraphone: Chromatic Percussion
  "0110_Aspirin_sf2_file",
  "0110_Chaos_sf2_file",
  "0110_FluidR3_GM_sf2_file",
  "0110_GeneralUserGS_sf2_file",
  "0110_JCLive_sf2_file",
  //'0110_SBLive_sf2',
  //'0110_SoundBlasterOld_sf2',
  "0111_FluidR3_GM_sf2_file",
  // Marimba: Chromatic Percussion
  "0120_Aspirin_sf2_file",
  "0120_Chaos_sf2_file",
  "0120_FluidR3_GM_sf2_file",
  "0120_GeneralUserGS_sf2_file",
  "0120_JCLive_sf2_file",
  //'0120_SBLive_sf2',
  //'0120_SoundBlasterOld_sf2',
  "0121_FluidR3_GM_sf2_file",
  "0121_GeneralUserGS_sf2_file",
  // not really a marimba
  // Xylophone: Chromatic Percussion
  "0130_Aspirin_sf2_file",
  "0130_Chaos_sf2_file",
  "0130_FluidR3_GM_sf2_file",
  "0130_GeneralUserGS_sf2_file",
  "0130_JCLive_sf2_file",
  //'0130_SBLive_sf2',
  //'0130_SoundBlasterOld_sf2',
  "0131_FluidR3_GM_sf2_file",
  // Tubular Bells: Chromatic Percussion
  "0140_Aspirin_sf2_file",
  // '0140_Chaos_sf2_file', // same as aspirin?
  "0140_FluidR3_GM_sf2_file",
  "0140_GeneralUserGS_sf2_file",
  "0140_JCLive_sf2_file",
  //'0140_SBLive_sf2',
  //'0140_SoundBlasterOld_sf2',
  "0141_FluidR3_GM_sf2_file",
  //'0141_GeneralUserGS_sf2_file',
  "0142_GeneralUserGS_sf2_file",
  // epiano..
  // '0143_GeneralUserGS_sf2_file', // buggy
  // Dulcimer: Chromatic Percussion
  "0150_Aspirin_sf2_file",
  "0150_Chaos_sf2_file",
  // long load?
  "0150_FluidR3_GM_sf2_file",
  "0150_GeneralUserGS_sf2_file",
  // '0150_JCLive_sf2_file', // detuned???
  //'0150_SBLive_sf2',
  //'0150_SoundBlasterOld_sf2',
  "0151_FluidR3_GM_sf2_file",
  // Drawbar Organ: Organ
  "0160_Aspirin_sf2_file",
  "0160_Chaos_sf2_file",
  "0160_FluidR3_GM_sf2_file",
  "0160_GeneralUserGS_sf2_file",
  "0160_JCLive_sf2_file",
  //'0160_SBLive_sf2',
  //'0160_SoundBlasterOld_sf2',
  "0161_Aspirin_sf2_file",
  "0161_FluidR3_GM_sf2_file",
  //'0161_SoundBlasterOld_sf2',
  // Percussive Organ: Organ
  "0170_Aspirin_sf2_file",
  "0170_Chaos_sf2_file",
  "0170_FluidR3_GM_sf2_file",
  // '0170_GeneralUserGS_sf2_file', // repitched
  "0170_JCLive_sf2_file",
  //'0170_SBLive_sf2',
  //'0170_SoundBlasterOld_sf2',
  "0171_FluidR3_GM_sf2_file",
  // '0171_GeneralUserGS_sf2_file',  // repitched
  "0172_FluidR3_GM_sf2_file",
  // Rock Organ: Organ
  "0180_Aspirin_sf2_file",
  "0180_Chaos_sf2_file",
  "0180_FluidR3_GM_sf2_file",
  "0180_GeneralUserGS_sf2_file",
  "0180_JCLive_sf2_file",
  //'0180_SBLive_sf2',
  //'0180_SoundBlasterOld_sf2',
  //'0181_Aspirin_sf2_file', // flute
  //'0181_GeneralUserGS_sf2_file', // marimbalike
  //'0181_SoundBlasterOld_sf2',
  // Church Organ: Organ
  "0190_Aspirin_sf2_file",
  "0190_Chaos_sf2_file",
  "0190_FluidR3_GM_sf2_file",
  "0190_GeneralUserGS_sf2_file",
  "0190_JCLive_sf2_file",
  //'0190_SBLive_sf2',
  //'0190_SoundBlasterOld_sf2',
  //'0191_Aspirin_sf2_file', // string??
  //'0191_GeneralUserGS_sf2_file', // weird organ
  //'0191_SoundBlasterOld_sf2',
  // Reed Organ: Organ
  "0200_Aspirin_sf2_file",
  "0200_Chaos_sf2_file",
  "0200_FluidR3_GM_sf2_file",
  "0200_GeneralUserGS_sf2_file",
  "0200_JCLive_sf2_file",
  // stringy
  //'0200_SBLive_sf2',
  //'0200_SoundBlasterOld_sf2',
  "0201_Aspirin_sf2_file",
  // stringy
  "0201_FluidR3_GM_sf2_file",
  "0201_GeneralUserGS_sf2_file",
  //'0201_SoundBlasterOld_sf2',
  //'0210_Aspirin_sf2_file', // buggy
  //'0210_Chaos_sf2_file', // buggy
  // Accordion: Organ
  "0210_FluidR3_GM_sf2_file",
  "0210_GeneralUserGS_sf2_file",
  "0210_JCLive_sf2_file",
  //'0210_SBLive_sf2',
  //'0210_SoundBlasterOld_sf2',
  "0211_Aspirin_sf2_file",
  // stringy
  "0211_FluidR3_GM_sf2_file",
  "0211_GeneralUserGS_sf2_file",
  //'0211_SoundBlasterOld_sf2',
  "0212_GeneralUserGS_sf2_file",
  // Harmonica: Organ
  "0220_Aspirin_sf2_file",
  "0220_Chaos_sf2_file",
  "0220_FluidR3_GM_sf2_file",
  "0220_GeneralUserGS_sf2_file",
  "0220_JCLive_sf2_file",
  //'0220_SBLive_sf2',
  //'0220_SoundBlasterOld_sf2',
  "0221_FluidR3_GM_sf2_file",
  // Tango Accordion: Organ
  "0230_Aspirin_sf2_file",
  "0230_Chaos_sf2_file",
  "0230_FluidR3_GM_sf2_file",
  "0230_GeneralUserGS_sf2_file",
  "0230_JCLive_sf2_file",
  //'0230_SBLive_sf2',
  //'0230_SoundBlasterOld_sf2',
  "0231_FluidR3_GM_sf2_file",
  "0231_GeneralUserGS_sf2_file",
  // warbly
  "0231_JCLive_sf2_file",
  //'0231_SoundBlasterOld_sf2',
  "0232_FluidR3_GM_sf2_file",
  "0233_FluidR3_GM_sf2_file",
  // Acoustic Guitar (nylon): Guitar
  "0240_Aspirin_sf2_file",
  "0240_Chaos_sf2_file",
  "0240_FluidR3_GM_sf2_file",
  "0240_GeneralUserGS_sf2_file",
  "0240_JCLive_sf2_file",
  "0240_LK_Godin_Nylon_SF2_file",
  //'0240_SBLive_sf2',
  //'0240_SoundBlasterOld_sf2',
  // '0241_GeneralUserGS_sf2_file', // organ like
  "0241_JCLive_sf2_file",
  "0242_JCLive_sf2_file",
  "0243_JCLive_sf2_file",
  // Acoustic Guitar (steel): Guitar
  "0253_Acoustic_Guitar_sf2_file",
  "0250_Aspirin_sf2_file",
  "0250_Chaos_sf2_file",
  "0250_FluidR3_GM_sf2_file",
  "0250_GeneralUserGS_sf2_file",
  // '0250_JCLive_sf2_file', // detuned
  "0250_LK_AcousticSteel_SF2_file",
  //'0250_SBLive_sf2',
  //'0250_SoundBlasterOld_sf2',
  //'0251_Acoustic_Guitar_sf2_file', // detuned?
  // '0251_GeneralUserGS_sf2_file', // broken: missing pitches
  // '0252_Acoustic_Guitar_sf2_file', // detuned..
  // '0252_GeneralUserGS_sf2_file', // broken: missing pitches
  "0253_Acoustic_Guitar_sf2_file",
  "0253_GeneralUserGS_sf2_file",
  "0254_Acoustic_Guitar_sf2_file",
  // bends.. detuned
  "0254_GeneralUserGS_sf2_file",
  //'0255_GeneralUserGS_sf2_file', // no guitar..
  // Electric Guitar (jazz): Guitar
  "0260_Aspirin_sf2_file",
  // sounds like an epiano
  "0260_Chaos_sf2_file",
  // weird but cool detune
  "0260_FluidR3_GM_sf2_file",
  "0260_GeneralUserGS_sf2_file",
  "0260_JCLive_sf2_file",
  //'0260_SBLive_sf2',
  //'0260_SoundBlasterOld_sf2',
  "0260_Stratocaster_sf2_file",
  // -1 octave
  "0261_GeneralUserGS_sf2_file",
  //'0261_SoundBlasterOld_sf2',
  "0261_Stratocaster_sf2_file",
  // -1 octave
  "0262_Stratocaster_sf2_file",
  // -1 octave
  // Electric Guitar (clean): Guitar
  "0270_Aspirin_sf2_file",
  "0270_Chaos_sf2_file",
  // sounds meh
  "0270_FluidR3_GM_sf2_file",
  "0270_GeneralUserGS_sf2_file",
  //'0270_Gibson_Les_Paul_sf2_file', // detuned
  // '0270_JCLive_sf2_file', // broken: missing notes
  "0270_SBAWE32_sf2_file",
  //'0270_SBLive_sf2',
  //'0270_SoundBlasterOld_sf2',
  "0270_Stratocaster_sf2_file",
  // -1 octave
  "0271_GeneralUserGS_sf2_file",
  "0271_Stratocaster_sf2_file",
  // -1 octave
  "0272_Stratocaster_sf2_file",
  // -1 octave
  // Electric Guitar (muted): Guitar
  "0280_Aspirin_sf2_file",
  "0280_Chaos_sf2_file",
  // '0280_FluidR3_GM_sf2_file', // broken: wrong notes
  "0280_GeneralUserGS_sf2_file",
  "0280_JCLive_sf2_file",
  //'0280_LesPaul_sf2', // missing
  "0280_LesPaul_sf2_file",
  // not really muted..
  "0280_SBAWE32_sf2_file",
  //'0280_SBLive_sf2',
  //'0280_SoundBlasterOld_sf2',
  "0281_Aspirin_sf2_file",
  "0281_FluidR3_GM_sf2_file",
  "0281_GeneralUserGS_sf2_file",
  "0282_FluidR3_GM_sf2_file",
  // '0282_GeneralUserGS_sf2_file', // broken: missing notes
  // '0283_GeneralUserGS_sf2_file', // missing
  // Overdriven Guitar: Guitar
  "0290_Aspirin_sf2_file",
  "0290_Chaos_sf2_file",
  "0290_FluidR3_GM_sf2_file",
  "0290_GeneralUserGS_sf2_file",
  //'0290_JCLive_sf2_file', // detuned....
  //'0290_LesPaul_sf2', // broken
  "0290_LesPaul_sf2_file",
  "0290_SBAWE32_sf2_file",
  //'0290_SBLive_sf2',
  //'0290_SoundBlasterOld_sf2',
  // '0291_Aspirin_sf2_file', // broken
  // '0291_LesPaul_sf2', // broken
  "0291_LesPaul_sf2_file",
  "0291_SBAWE32_sf2_file",
  //'0291_SoundBlasterOld_sf2',
  "0292_Aspirin_sf2_file",
  // '0292_LesPaul_sf2', // broken
  "0292_LesPaul_sf2_file",
  // Distortion Guitar: Guitar
  "0300_Aspirin_sf2_file",
  "0300_Chaos_sf2_file",
  "0300_FluidR3_GM_sf2_file",
  "0300_GeneralUserGS_sf2_file",
  // '0300_JCLive_sf2_file', // broken
  // '0300_LesPaul_sf2', // broken
  "0300_LesPaul_sf2_file",
  //'0300_SBAWE32_sf2_file', // -2 octave
  //'0300_SBLive_sf2',
  //'0300_SoundBlasterOld_sf2',
  // '0301_Aspirin_sf2_file', // missing
  //'0301_FluidR3_GM_sf2_file', // weird broken bell
  // '0301_GeneralUserGS_sf2_file', // broken
  // '0301_JCLive_sf2_file', // broken
  // '0301_LesPaul_sf2', // missing
  // '0301_LesPaul_sf2_file', // + 1 oct?
  "0302_Aspirin_sf2_file",
  // '0302_GeneralUserGS_sf2_file', // not a guitar..
  //'0302_JCLive_sf2_file', // broken...
  // '0303_Aspirin_sf2_file', // guitar harmonic??
  "0304_Aspirin_sf2_file",
  // Guitar Harmonics: Guitar
  "0310_Aspirin_sf2_file",
  "0310_Chaos_sf2_file",
  "0310_FluidR3_GM_sf2_file",
  // weird..
  //'0310_GeneralUserGS_sf2_file', // weird..
  // '0310_JCLive_sf2_file', // weird
  //'0310_LesPaul_sf2', // missing
  //'0310_LesPaul_sf2_file', // wrong pitches
  //'0310_SBAWE32_sf2_file', // wrong pitches
  //'0310_SBLive_sf2',
  //'0310_SoundBlasterOld_sf2',
  //'0311_FluidR3_GM_sf2_file', // knackt
  //'0311_GeneralUserGS_sf2_file', // wrong notes
  // Acoustic Bass: Bass
  "0320_Aspirin_sf2_file",
  "0320_Chaos_sf2_file",
  "0320_FluidR3_GM_sf2_file",
  // '0320_GeneralUserGS_sf2_file', // missing notes
  "0320_JCLive_sf2_file",
  //'0320_SBLive_sf2',
  //'0320_SoundBlasterOld_sf2',
  // '0321_GeneralUserGS_sf2_file', // nice sound but missing notes
  // '0322_GeneralUserGS_sf2_file', // missing notes
  // Electric Bass (finger): Bass
  "0330_Aspirin_sf2_file",
  //'0330_Chaos_sf2_file', // same as last
  "0330_FluidR3_GM_sf2_file",
  // knackt..
  "0330_GeneralUserGS_sf2_file",
  // -1 oct
  "0330_JCLive_sf2_file",
  //'0330_SBLive_sf2',
  //'0330_SoundBlasterOld_sf2',
  //'0331_GeneralUserGS_sf2_file', // knackt
  // '0332_GeneralUserGS_sf2_file', // missing
  // Electric Bass (pick): Bass
  "0340_Aspirin_sf2_file",
  //'0340_Chaos_sf2_file', // same as last
  "0340_FluidR3_GM_sf2_file",
  "0340_GeneralUserGS_sf2_file",
  // -1oct
  "0340_JCLive_sf2_file",
  //'0340_SBLive_sf2',
  //'0340_SoundBlasterOld_sf2',
  "0341_Aspirin_sf2_file",
  //'0341_GeneralUserGS_sf2_file', // knackt
  // Fretless Bass: Bass
  "0350_Aspirin_sf2_file",
  // '0350_Chaos_sf2_file', // same as last
  //'0350_FluidR3_GM_sf2_file', // knackt
  //'0350_GeneralUserGS_sf2_file', // -1 oct + knackt
  "0350_JCLive_sf2_file",
  // weird detuned
  //'0350_SBLive_sf2',
  //'0350_SoundBlasterOld_sf2',
  //'0351_GeneralUserGS_sf2_file', // missing
  // Slap Bass 1: Bass
  "0360_Aspirin_sf2_file",
  "0360_Chaos_sf2_file",
  "0360_FluidR3_GM_sf2_file",
  // knackt
  //'0360_GeneralUserGS_sf2_file', // -1 oct
  "0360_JCLive_sf2_file",
  //'0360_SBLive_sf2',
  //'0360_SoundBlasterOld_sf2',
  //'0361_GeneralUserGS_sf2_file', // missing
  // Slap Bass 2: Bass
  "0370_Aspirin_sf2_file",
  // '0370_Chaos_sf2_file', // same as last
  "0370_FluidR3_GM_sf2_file",
  "0370_GeneralUserGS_sf2_file",
  "0370_JCLive_sf2_file",
  //'0370_SBLive_sf2',
  //'0370_SoundBlasterOld_sf2',
  //'0371_GeneralUserGS_sf2_file', // missing
  //'0372_GeneralUserGS_sf2_file', // detuned
  //'0385_GeneralUserGS_sf2_file', // missing
  // Synth Bass 1: Bass
  "0380_Aspirin_sf2_file",
  // laut!
  "0380_Chaos_sf2_file",
  "0380_FluidR3_GM_sf2_file",
  // bisl detuned
  // '0380_GeneralUserGS_sf2_file', // laut
  "0380_JCLive_sf2_file",
  //'0380_SBLive_sf2',
  //'0380_SoundBlasterOld_sf2',
  "0381_FluidR3_GM_sf2_file",
  // bisl detuned
  "0381_GeneralUserGS_sf2_file",
  //'0382_FluidR3_GM_sf2_file', // kein synth bass
  "0382_GeneralUserGS_sf2_file",
  "0383_GeneralUserGS_sf2_file",
  "0384_GeneralUserGS_sf2_file",
  //'0386_GeneralUserGS_sf2_file', // knackt
  "0387_GeneralUserGS_sf2_file",
  // Synth Bass 2: Bass
  "0390_Aspirin_sf2_file",
  // '0390_Chaos_sf2_file', // same as last
  "0390_FluidR3_GM_sf2_file",
  "0390_GeneralUserGS_sf2_file",
  "0390_JCLive_sf2_file",
  //'0390_SBLive_sf2',
  //'0390_SoundBlasterOld_sf2',
  "0391_FluidR3_GM_sf2_file",
  // lauuut
  // '0391_GeneralUserGS_sf2_file', // missing
  //'0391_SoundBlasterOld_sf2',
  "0392_FluidR3_GM_sf2_file",
  // lauut
  //'0392_GeneralUserGS_sf2_file', // kein synth und -1oct
  "0393_GeneralUserGS_sf2_file",
  // lauuuut
  // Violin: Strings
  "0400_Aspirin_sf2_file",
  "0400_Chaos_sf2_file",
  "0400_FluidR3_GM_sf2_file",
  "0400_GeneralUserGS_sf2_file",
  "0400_JCLive_sf2_file",
  //'0400_SBLive_sf2',
  //'0400_SoundBlasterOld_sf2',
  "0401_Aspirin_sf2_file",
  // synth
  "0401_FluidR3_GM_sf2_file",
  "0401_GeneralUserGS_sf2_file",
  "0402_GeneralUserGS_sf2_file",
  // pizzicato
  // Viola: Strings
  "0410_Aspirin_sf2_file",
  // '0410_Chaos_sf2_file', // laut und sehr unstringy
  "0410_FluidR3_GM_sf2_file",
  "0410_GeneralUserGS_sf2_file",
  "0410_JCLive_sf2_file",
  // <3
  //'0410_SBLive_sf2',
  //'0410_SoundBlasterOld_sf2',
  "0411_FluidR3_GM_sf2_file",
  // Cello: Strings
  "0420_Aspirin_sf2_file",
  // '0420_Chaos_sf2_file', // kein cello und laut
  "0420_FluidR3_GM_sf2_file",
  "0420_GeneralUserGS_sf2_file",
  "0420_JCLive_sf2_file",
  //'0420_SBLive_sf2',
  //'0420_SoundBlasterOld_sf2',
  "0421_FluidR3_GM_sf2_file",
  "0421_GeneralUserGS_sf2_file",
  // pizzicato
  // Contrabass: Strings
  "0430_Aspirin_sf2_file",
  "0430_Chaos_sf2_file",
  // '0430_FluidR3_GM_sf2_file', // missing notes
  "0430_GeneralUserGS_sf2_file",
  //'0430_JCLive_sf2_file', // -1 oct und meh
  //'0430_SBLive_sf2',
  //'0430_SoundBlasterOld_sf2',
  // '0431_FluidR3_GM_sf2_file', // missing notes
  // Tremolo Strings: Strings
  "0440_Aspirin_sf2_file",
  "0440_Chaos_sf2_file",
  //'0440_FluidR3_GM_sf2_file', // huuuge
  "0440_GeneralUserGS_sf2_file",
  "0440_JCLive_sf2_file",
  //'0440_SBLive_sf2',
  //'0440_SoundBlasterOld_sf2',
  "0441_GeneralUserGS_sf2_file",
  "0442_GeneralUserGS_sf2_file",
  // Pizzicato Strings: Strings
  "0450_Aspirin_sf2_file",
  "0450_Chaos_sf2_file",
  // same as last
  "0450_FluidR3_GM_sf2_file",
  // chrono trigger flashback
  "0450_GeneralUserGS_sf2_file",
  // -1 oct?
  "0450_JCLive_sf2_file",
  // filter env
  //'0450_SBLive_sf2',
  //'0450_SoundBlasterOld_sf2',
  "0451_FluidR3_GM_sf2_file",
  // Orchestral Harp: Strings
  "0460_Aspirin_sf2_file",
  // '0460_Chaos_sf2_file', // knackt
  "0460_FluidR3_GM_sf2_file",
  "0460_GeneralUserGS_sf2_file",
  "0460_JCLive_sf2_file",
  //'0460_SBLive_sf2',
  //'0460_SoundBlasterOld_sf2',
  "0461_FluidR3_GM_sf2_file",
  // Timpani: Strings
  "0470_Aspirin_sf2_file",
  "0470_Chaos_sf2_file",
  "0470_FluidR3_GM_sf2_file",
  "0470_GeneralUserGS_sf2_file",
  // '0470_JCLive_sf2_file', // wrong pitches
  //'0470_SBLive_sf2',
  //'0470_SoundBlasterOld_sf2',
  "0471_FluidR3_GM_sf2_file",
  "0471_GeneralUserGS_sf2_file",
  // String Ensemble 1: Ensemble
  "0480_Aspirin_sf2_file",
  "0480_Chaos_sf2_file",
  "0480_FluidR3_GM_sf2_file",
  // large
  "0480_GeneralUserGS_sf2_file",
  "0480_JCLive_sf2_file",
  //'0480_SBLive_sf2',
  //'0480_SoundBlasterOld_sf2',
  // these dont work..
  //'04810_GeneralUserGS_sf2_file', // missing notes + brass
  //'04811_GeneralUserGS_sf2_file',  // missing notes + brass
  //'04812_GeneralUserGS_sf2_file',
  //'04813_GeneralUserGS_sf2_file',
  //'04814_GeneralUserGS_sf2_file',
  //'04815_GeneralUserGS_sf2_file',
  //'04816_GeneralUserGS_sf2_file',
  //'04817_GeneralUserGS_sf2_file',
  "0481_Aspirin_sf2_file",
  "0481_FluidR3_GM_sf2_file",
  // brass
  "0481_GeneralUserGS_sf2_file",
  "0482_Aspirin_sf2_file",
  // brass
  "0482_GeneralUserGS_sf2_file",
  "0483_GeneralUserGS_sf2_file",
  // brass
  // another block of buggyness:
  //'0484_GeneralUserGS_sf2_file', // keys?! + knackt
  //'0485_GeneralUserGS_sf2_file', // missing notes
  //'0486_GeneralUserGS_sf2_file',
  //'0487_GeneralUserGS_sf2_file',
  //'0488_GeneralUserGS_sf2_file',
  //'0489_GeneralUserGS_sf2_file',
  // String Ensemble 2: Ensemble
  "0490_Aspirin_sf2_file",
  "0490_Chaos_sf2_file",
  "0490_FluidR3_GM_sf2_file",
  // large
  "0490_GeneralUserGS_sf2_file",
  "0490_JCLive_sf2_file",
  //'0490_SBLive_sf2',
  //'0490_SoundBlasterOld_sf2',
  "0491_GeneralUserGS_sf2_file",
  "0492_GeneralUserGS_sf2_file",
  // Synth Strings 1: Ensemble
  "0500_Aspirin_sf2_file",
  // '0500_Chaos_sf2_file', // same as above
  //'0500_FluidR3_GM_sf2_file', // detune + knack
  "0500_GeneralUserGS_sf2_file",
  "0500_JCLive_sf2_file",
  //'0500_SBLive_sf2',
  //'0500_SoundBlasterOld_sf2',
  "0501_FluidR3_GM_sf2_file",
  // '0501_GeneralUserGS_sf2_file', // crackles
  // '0502_FluidR3_GM_sf2_file', // missing
  "0502_GeneralUserGS_sf2_file",
  "0503_FluidR3_GM_sf2_file",
  // large
  // '0504_FluidR3_GM_sf2_file', // missing
  "0505_FluidR3_GM_sf2_file",
  // Synth Strings 2: Ensemble
  "0510_Aspirin_sf2_file",
  "0510_Chaos_sf2_file",
  // '0510_FluidR3_GM_sf2_file', // detune + crackle
  "0510_GeneralUserGS_sf2_file",
  //'0510_JCLive_sf2_file', // laarge and meh
  //'0510_SBLive_sf2', // missing
  //'0510_SoundBlasterOld_sf2',
  "0511_GeneralUserGS_sf2_file",
  // crackly
  //'0511_SoundBlasterOld_sf2',
  // Choir Aahs: Ensemble
  "0520_Aspirin_sf2_file",
  "0520_Chaos_sf2_file",
  "0520_FluidR3_GM_sf2_file",
  "0520_GeneralUserGS_sf2_file",
  "0520_JCLive_sf2_file",
  //'0520_SBLive_sf2',
  "0520_Soul_Ahhs_sf2_file",
  // large
  //'0520_SoundBlasterOld_sf2',
  "0521_FluidR3_GM_sf2_file",
  "0521_Soul_Ahhs_sf2_file",
  // large
  //'0521_SoundBlasterOld_sf2',
  "0522_Soul_Ahhs_sf2_file",
  // large
  // Voice Oohs: Ensemble
  "0530_Aspirin_sf2_file",
  "0530_Chaos_sf2_file",
  "0530_FluidR3_GM_sf2_file",
  "0530_GeneralUserGS_sf2_file",
  //'0530_JCLive_sf2_file', // same as above
  //'0530_SBLive_sf2',
  // '0530_Soul_Ahhs_sf2_file', // not ooh
  //'0530_SoundBlasterOld_sf2',
  "0531_FluidR3_GM_sf2_file",
  // '0531_GeneralUserGS_sf2_file', // ends crackle
  "0531_JCLive_sf2_file",
  //'0531_SoundBlasterOld_sf2',
  // Synth Choir: Ensemble
  "0540_Aspirin_sf2_file",
  "0540_Chaos_sf2_file",
  "0540_FluidR3_GM_sf2_file",
  "0540_GeneralUserGS_sf2_file",
  //'0540_JCLive_sf2_file', // large + crackles
  //'0540_SBLive_sf2',
  //'0540_SoundBlasterOld_sf2',
  "0541_FluidR3_GM_sf2_file",
  // Orchestra Hit: Ensemble
  "0550_Aspirin_sf2_file",
  "0550_Chaos_sf2_file",
  "0550_FluidR3_GM_sf2_file",
  "0550_GeneralUserGS_sf2_file",
  //'0550_JCLive_sf2_file', // same as above
  //'0550_SBLive_sf2',
  //'0550_SoundBlasterOld_sf2',
  //'0551_Aspirin_sf2_file', // not an orch hit..
  "0551_FluidR3_GM_sf2_file",
  // Trumpet: Brass
  "0560_Aspirin_sf2_file",
  "0560_Chaos_sf2_file",
  "0560_FluidR3_GM_sf2_file",
  //'0560_GeneralUserGS_sf2_file', // -1 oct
  "0560_JCLive_sf2_file",
  //'0560_SBLive_sf2',
  //'0560_SoundBlasterOld_sf2',
  // Trombone: Brass
  "0570_Aspirin_sf2_file",
  "0570_Chaos_sf2_file",
  "0570_FluidR3_GM_sf2_file",
  "0570_GeneralUserGS_sf2_file",
  //'0570_JCLive_sf2_file', // -1oct
  //'0570_SBLive_sf2',
  //'0570_SoundBlasterOld_sf2',
  "0571_GeneralUserGS_sf2_file",
  // Tuba: Brass
  "0580_Aspirin_sf2_file",
  "0580_Chaos_sf2_file",
  "0580_FluidR3_GM_sf2_file",
  "0580_GeneralUserGS_sf2_file",
  //'0580_JCLive_sf2_file', // -1oct
  //'0580_SBLive_sf2',
  //'0580_SoundBlasterOld_sf2',
  //'0581_GeneralUserGS_sf2_file', // missing
  // Muted Trumpet: Brass
  "0590_Aspirin_sf2_file",
  "0590_Chaos_sf2_file",
  "0590_FluidR3_GM_sf2_file",
  "0590_GeneralUserGS_sf2_file",
  "0590_JCLive_sf2_file",
  // winner
  //'0590_SBLive_sf2',
  //'0590_SoundBlasterOld_sf2',
  // '0591_GeneralUserGS_sf2_file', // missing
  // French Horn: Brass
  "0600_Aspirin_sf2_file",
  //'0600_Chaos_sf2_file', // weird jumps
  "0600_FluidR3_GM_sf2_file",
  // tiny crackles
  "0600_GeneralUserGS_sf2_file",
  // tiny crackles
  "0600_JCLive_sf2_file",
  // tiny crackles
  //'0600_SBLive_sf2',
  //'0600_SoundBlasterOld_sf2',
  "0601_FluidR3_GM_sf2_file",
  //'0601_GeneralUserGS_sf2_file', // tiny crackles
  // '0602_GeneralUserGS_sf2_file', // bad gain diffs
  // '0603_GeneralUserGS_sf2_file', // tiny crackles
  // Brass Section: Brass
  "0610_Aspirin_sf2_file",
  "0610_Chaos_sf2_file",
  "0610_FluidR3_GM_sf2_file",
  // large
  "0610_GeneralUserGS_sf2_file",
  "0610_JCLive_sf2_file",
  //'0610_SBLive_sf2',
  //'0610_SoundBlasterOld_sf2',
  // '0611_GeneralUserGS_sf2_file', // missing sounds
  // '0612_GeneralUserGS_sf2_file',
  //'0613_GeneralUserGS_sf2_file', // -1 oct
  // '0614_GeneralUserGS_sf2_file', // missing sounds
  // '0615_GeneralUserGS_sf2_file', // missing sounds
  // Synth Brass 1: Brass
  "0620_Aspirin_sf2_file",
  //'0620_Chaos_sf2_file', // weird gain diff
  "0620_FluidR3_GM_sf2_file",
  //'0620_GeneralUserGS_sf2_file', // loooud
  // '0620_JCLive_sf2_file', // weird gain diff
  //'0620_SBLive_sf2',
  //'0620_SoundBlasterOld_sf2',
  "0621_Aspirin_sf2_file",
  "0621_FluidR3_GM_sf2_file",
  // '0621_GeneralUserGS_sf2_file', // detune + loooud
  //'0622_FluidR3_GM_sf2_file', // loud..
  //'0622_GeneralUserGS_sf2_file', // loud + crackles
  // Synth Brass 2: Brass
  "0630_Aspirin_sf2_file",
  "0630_Chaos_sf2_file",
  "0630_FluidR3_GM_sf2_file",
  //'0630_GeneralUserGS_sf2_file', // detune + looud
  "0630_JCLive_sf2_file",
  //'0630_SBLive_sf2',
  //'0630_SoundBlasterOld_sf2',
  // '0631_Aspirin_sf2_file', // looud + detune + gain diffs
  "0631_FluidR3_GM_sf2_file",
  //'0631_GeneralUserGS_sf2_file', // crackles
  "0632_FluidR3_GM_sf2_file",
  "0633_FluidR3_GM_sf2_file",
  // tiny crackles
  // Soprano Sax: Reed
  "0640_Aspirin_sf2_file",
  "0640_Chaos_sf2_file",
  "0640_FluidR3_GM_sf2_file",
  // '0640_GeneralUserGS_sf2_file', // crackles
  "0640_JCLive_sf2_file",
  //'0640_SBLive_sf2',
  //'0640_SoundBlasterOld_sf2',
  "0641_FluidR3_GM_sf2_file",
  // Alto Sax: Reed
  //'0650_Aspirin_sf2_file', // this is not an alto sax
  "0650_Chaos_sf2_file",
  "0650_FluidR3_GM_sf2_file",
  // sounds really stringy
  "0650_GeneralUserGS_sf2_file",
  "0650_JCLive_sf2_file",
  //'0650_SBLive_sf2',
  //'0650_SoundBlasterOld_sf2',
  "0651_Aspirin_sf2_file",
  "0651_FluidR3_GM_sf2_file",
  // really stringy
  // Tenor Sax: Reed
  "0660_Aspirin_sf2_file",
  "0660_Chaos_sf2_file",
  //'0660_FluidR3_GM_sf2_file', // weird pitches
  "0660_GeneralUserGS_sf2_file",
  "0660_JCLive_sf2_file",
  //'0660_SBLive_sf2',
  //'0660_SoundBlasterOld_sf2',
  // '0661_FluidR3_GM_sf2_file', // weird pitches
  // '0661_GeneralUserGS_sf2_file', // missing
  // Baritone Sax: Reed
  "0670_Aspirin_sf2_file",
  "0670_Chaos_sf2_file",
  "0670_FluidR3_GM_sf2_file",
  // huge
  "0670_GeneralUserGS_sf2_file",
  "0670_JCLive_sf2_file",
  //'0670_SBLive_sf2',
  //'0670_SoundBlasterOld_sf2',
  "0671_FluidR3_GM_sf2_file",
  // huge
  // Oboe: Reed
  //'0680_Aspirin_sf2_file', // tiny crackles
  "0680_Chaos_sf2_file",
  // tiny crackles
  "0680_FluidR3_GM_sf2_file",
  // tiny crackles
  "0680_GeneralUserGS_sf2_file",
  "0680_JCLive_sf2_file",
  //'0680_SBLive_sf2',
  //'0680_SoundBlasterOld_sf2',
  "0681_FluidR3_GM_sf2_file",
  // tiny crackles
  // English Horn: Reed
  "0690_Aspirin_sf2_file",
  //'0690_Chaos_sf2_file', // detuned
  "0690_FluidR3_GM_sf2_file",
  //'0690_GeneralUserGS_sf2_file', // +1 oct
  "0690_JCLive_sf2_file",
  //'0690_SBLive_sf2',
  //'0690_SoundBlasterOld_sf2',
  "0691_FluidR3_GM_sf2_file",
  // tiny crackles
  // Bassoon: Reed
  //'0700_Aspirin_sf2_file', // detune + gain diffs
  // '0700_Chaos_sf2_file', // detune + crackles
  "0700_FluidR3_GM_sf2_file",
  "0700_GeneralUserGS_sf2_file",
  // tiny crackles
  "0700_JCLive_sf2_file",
  //'0700_SBLive_sf2',
  //'0700_SoundBlasterOld_sf2',
  "0701_FluidR3_GM_sf2_file",
  // tiny crackles
  //'0701_GeneralUserGS_sf2_file', // missing
  // Clarinet: Reed
  "0710_Aspirin_sf2_file",
  // tiny crackles
  "0710_Chaos_sf2_file",
  // tiny crackles
  "0710_FluidR3_GM_sf2_file",
  "0710_GeneralUserGS_sf2_file",
  "0710_JCLive_sf2_file",
  //'0710_SBLive_sf2',
  //'0710_SoundBlasterOld_sf2',
  "0711_FluidR3_GM_sf2_file",
  // Piccolo: Pipe
  "0720_Aspirin_sf2_file",
  // +1oct
  // '0720_Chaos_sf2_file', // not a piccolo
  "0720_FluidR3_GM_sf2_file",
  "0720_GeneralUserGS_sf2_file",
  // crackles
  "0720_JCLive_sf2_file",
  //'0720_SBLive_sf2',
  //'0720_SoundBlasterOld_sf2',
  "0721_FluidR3_GM_sf2_file",
  //'0721_SoundBlasterOld_sf2',
  // Flute: Pipe
  "0730_Aspirin_sf2_file",
  //'0730_Chaos_sf2_file', // etune
  "0730_FluidR3_GM_sf2_file",
  "0730_GeneralUserGS_sf2_file",
  "0730_JCLive_sf2_file",
  //'0730_SBLive_sf2',
  //'0730_SoundBlasterOld_sf2',
  //'0731_Aspirin_sf2_file', // not a flute
  "0731_FluidR3_GM_sf2_file",
  //'0731_SoundBlasterOld_sf2',
  // Recorder: Pipe
  "0740_Aspirin_sf2_file",
  "0740_Chaos_sf2_file",
  "0740_FluidR3_GM_sf2_file",
  "0740_GeneralUserGS_sf2_file",
  "0740_JCLive_sf2_file",
  //'0740_SBLive_sf2',
  //'0740_SoundBlasterOld_sf2',
  // '0741_GeneralUserGS_sf2_file', // missing
  // Pan Flute: Pipe
  "0750_Aspirin_sf2_file",
  // staccato
  "0750_Chaos_sf2_file",
  "0750_FluidR3_GM_sf2_file",
  "0750_GeneralUserGS_sf2_file",
  // crackles
  "0750_JCLive_sf2_file",
  //'0750_SBLive_sf2',
  //'0750_SoundBlasterOld_sf2',
  "0751_Aspirin_sf2_file",
  "0751_FluidR3_GM_sf2_file",
  "0751_GeneralUserGS_sf2_file",
  // crackles
  //'0751_SoundBlasterOld_sf2',
  // Blown bottle: Pipe
  // '0760_Aspirin_sf2_file', // same as below w crackle
  "0760_Chaos_sf2_file",
  "0760_FluidR3_GM_sf2_file",
  "0760_GeneralUserGS_sf2_file",
  "0760_JCLive_sf2_file",
  //'0760_SBLive_sf2',
  //'0760_SoundBlasterOld_sf2',
  "0761_FluidR3_GM_sf2_file",
  // '0761_GeneralUserGS_sf2_file', // missing
  //'0761_SoundBlasterOld_sf2',
  // '0762_GeneralUserGS_sf2_file', // missing
  // Shakuhachi: Pipe
  "0770_Aspirin_sf2_file",
  // staccato
  //'0770_Chaos_sf2_file', // not shakuhachi
  "0770_FluidR3_GM_sf2_file",
  "0770_GeneralUserGS_sf2_file",
  "0770_JCLive_sf2_file",
  //'0770_SBLive_sf2',
  //'0770_SoundBlasterOld_sf2',
  "0771_FluidR3_GM_sf2_file",
  // '0771_GeneralUserGS_sf2_file', // missing
  // '0772_GeneralUserGS_sf2_file', // missing
  // Whistle: Pipe
  "0780_Aspirin_sf2_file",
  // crackles
  "0780_Chaos_sf2_file",
  // crackles
  "0780_FluidR3_GM_sf2_file",
  //'0780_GeneralUserGS_sf2_file', // loud..
  "0780_JCLive_sf2_file",
  // crackles
  //'0780_SBLive_sf2',
  //'0780_SoundBlasterOld_sf2',
  // '0781_GeneralUserGS_sf2_file', // detune + crackles
  // Ocarina: Pipe
  "0790_Aspirin_sf2_file",
  // tiny crackles
  //'0790_Chaos_sf2_file', // same as above
  "0790_FluidR3_GM_sf2_file",
  "0790_GeneralUserGS_sf2_file",
  "0790_JCLive_sf2_file",
  // crackles
  //'0790_SBLive_sf2',
  //'0790_SoundBlasterOld_sf2',
  //'0791_GeneralUserGS_sf2_file', // missing
  // Lead 1 (square): Synth Lead
  "0800_Aspirin_sf2_file",
  "0800_Chaos_sf2_file",
  "0800_FluidR3_GM_sf2_file",
  // '0800_GeneralUserGS_sf2_file', // detuned
  // '0800_JCLive_sf2_file', // detuned
  //'0800_SBLive_sf2',
  //'0800_SoundBlasterOld_sf2',
  //'0801_FluidR3_GM_sf2_file', // detune
  // '0801_GeneralUserGS_sf2_file', // detune
  // Lead 2 (sawtooth): Synth Lead
  "0810_Aspirin_sf2_file",
  "0810_Chaos_sf2_file",
  "0810_FluidR3_GM_sf2_file",
  "0810_GeneralUserGS_sf2_file",
  "0810_JCLive_sf2_file",
  //'0810_SBLive_sf2',
  //'0810_SoundBlasterOld_sf2',
  "0811_Aspirin_sf2_file",
  "0811_GeneralUserGS_sf2_file",
  //'0811_SoundBlasterOld_sf2',
  // Lead 3 (calliope): Synth Lead
  "0820_Aspirin_sf2_file",
  "0820_Chaos_sf2_file",
  "0820_FluidR3_GM_sf2_file",
  "0820_GeneralUserGS_sf2_file",
  "0820_JCLive_sf2_file",
  // +1 oct
  //'0820_SBLive_sf2',
  //'0820_SoundBlasterOld_sf2',
  "0821_FluidR3_GM_sf2_file",
  "0821_GeneralUserGS_sf2_file",
  //'0821_SoundBlasterOld_sf2',
  // '0822_GeneralUserGS_sf2_file', // missing
  //'0823_GeneralUserGS_sf2_file', // missing
  // Lead 4 (chiff): Synth Lead
  "0830_Aspirin_sf2_file",
  // '0830_Chaos_sf2_file', // same as above
  "0830_FluidR3_GM_sf2_file",
  "0830_GeneralUserGS_sf2_file",
  "0830_JCLive_sf2_file",
  // flute synth
  //'0830_SBLive_sf2',
  //'0830_SoundBlasterOld_sf2',
  "0831_FluidR3_GM_sf2_file",
  "0831_GeneralUserGS_sf2_file",
  //'0831_SoundBlasterOld_sf2',
  // Lead 5 (charang): Synth Lead
  "0840_Aspirin_sf2_file",
  "0840_Chaos_sf2_file",
  "0840_FluidR3_GM_sf2_file",
  "0840_GeneralUserGS_sf2_file",
  "0840_JCLive_sf2_file",
  // detune?
  //'0840_SBLive_sf2',
  //'0840_SoundBlasterOld_sf2',
  "0841_Aspirin_sf2_file",
  "0841_Chaos_sf2_file",
  "0841_FluidR3_GM_sf2_file",
  "0841_GeneralUserGS_sf2_file",
  //'0841_JCLive_sf2_file', // +1oct + detune
  //'0841_SoundBlasterOld_sf2',
  "0842_FluidR3_GM_sf2_file",
  // Lead 6 (voice): Synth Lead
  "0850_Aspirin_sf2_file",
  // '0850_Chaos_sf2_file', // same as above
  "0850_FluidR3_GM_sf2_file",
  // '0850_GeneralUserGS_sf2_file', // no voice
  "0850_JCLive_sf2_file",
  // more a flute
  //'0850_SBLive_sf2',
  //'0850_SoundBlasterOld_sf2',
  "0851_FluidR3_GM_sf2_file",
  "0851_GeneralUserGS_sf2_file",
  "0851_JCLive_sf2_file",
  //'0851_SoundBlasterOld_sf2',
  // Lead 7 (fifths): Synth Lead
  "0860_Aspirin_sf2_file",
  "0860_Chaos_sf2_file",
  // '0860_FluidR3_GM_sf2_file', // loud and not fitting
  "0860_GeneralUserGS_sf2_file",
  "0860_JCLive_sf2_file",
  //'0860_SBLive_sf2',
  //'0860_SoundBlasterOld_sf2',
  "0861_Aspirin_sf2_file",
  // '0861_FluidR3_GM_sf2_file', // lout and not fitting
  //'0861_SoundBlasterOld_sf2',
  // Lead 8 (bass + lead): Synth Lead
  "0870_Aspirin_sf2_file",
  "0870_Chaos_sf2_file",
  "0870_FluidR3_GM_sf2_file",
  "0870_GeneralUserGS_sf2_file",
  "0870_JCLive_sf2_file",
  //'0870_SBLive_sf2',
  //'0870_SoundBlasterOld_sf2',
  // '0871_GeneralUserGS_sf2_file', // loud + detune
  //'0872_GeneralUserGS_sf2_file', // loud
  //'0873_GeneralUserGS_sf2_file', // loud
  // Pad 1 (new age): Synth Pad
  "0880_Aspirin_sf2_file",
  "0880_Chaos_sf2_file",
  "0880_FluidR3_GM_sf2_file",
  "0880_GeneralUserGS_sf2_file",
  "0880_JCLive_sf2_file",
  //'0880_SBLive_sf2',
  //'0880_SoundBlasterOld_sf2',
  "0881_Aspirin_sf2_file",
  "0881_FluidR3_GM_sf2_file",
  "0881_GeneralUserGS_sf2_file",
  //'0881_SoundBlasterOld_sf2',
  "0882_Aspirin_sf2_file",
  // staccato
  // '0882_FluidR3_GM_sf2_file', // missing
  "0882_GeneralUserGS_sf2_file",
  //'0883_GeneralUserGS_sf2_file', // missing
  // '0884_GeneralUserGS_sf2_file', // broken
  "0885_GeneralUserGS_sf2_file",
  //'0886_GeneralUserGS_sf2_file', // not a pad
  "0887_GeneralUserGS_sf2_file",
  //'0888_GeneralUserGS_sf2_file', // not a pad
  //'0889_GeneralUserGS_sf2_file', // not a pad
  // Pad 2 (warm): Synth Pad
  "0890_Aspirin_sf2_file",
  "0890_Chaos_sf2_file",
  "0890_FluidR3_GM_sf2_file",
  "0890_GeneralUserGS_sf2_file",
  // 1mb large
  "0890_JCLive_sf2_file",
  //'0890_SBLive_sf2',
  //'0890_SoundBlasterOld_sf2',
  "0891_Aspirin_sf2_file",
  "0891_FluidR3_GM_sf2_file",
  // '0891_GeneralUserGS_sf2_file', // noise
  // Pad 3 (polysynth): Synth Pad
  //'0900_Aspirin_sf2_file', // same as belo
  "0900_Chaos_sf2_file",
  "0900_FluidR3_GM_sf2_file",
  "0900_GeneralUserGS_sf2_file",
  "0900_JCLive_sf2_file",
  // a bit plucky for a pad
  //'0900_SBLive_sf2',
  //'0900_SoundBlasterOld_sf2',
  "0901_Aspirin_sf2_file",
  "0901_FluidR3_GM_sf2_file",
  "0901_GeneralUserGS_sf2_file",
  //'0901_SoundBlasterOld_sf2',
  // Pad 4 (choir): Synth Pad
  "0910_Aspirin_sf2_file",
  //'0910_Chaos_sf2_file', // +1oct
  "0910_FluidR3_GM_sf2_file",
  "0910_GeneralUserGS_sf2_file",
  "0910_JCLive_sf2_file",
  //'0910_SBLive_sf2',
  //'0910_SoundBlasterOld_sf2',
  // '0911_Aspirin_sf2_file', // fluty, crackles
  "0911_GeneralUserGS_sf2_file",
  "0911_JCLive_sf2_file",
  // the only choiry pad
  //'0911_SoundBlasterOld_sf2',
  // Pad 5 (bowed): Synth Pad
  "0920_Aspirin_sf2_file",
  //'0920_Chaos_sf2_file', // same as above
  //'0920_FluidR3_GM_sf2_file', // detuned?
  "0920_GeneralUserGS_sf2_file",
  "0920_JCLive_sf2_file",
  //'0920_SBLive_sf2',
  //'0920_SoundBlasterOld_sf2',
  "0921_Aspirin_sf2_file",
  "0921_GeneralUserGS_sf2_file",
  //'0921_SoundBlasterOld_sf2',
  // Pad 6 (metallic): Synth Pad
  "0930_Aspirin_sf2_file",
  "0930_Chaos_sf2_file",
  "0930_FluidR3_GM_sf2_file",
  // little crackles
  "0930_GeneralUserGS_sf2_file",
  // '0930_JCLive_sf2_file', // buggy zones: guitar / synth
  //'0930_SBLive_sf2',
  //'0930_SoundBlasterOld_sf2',
  "0931_Aspirin_sf2_file",
  // sitar
  "0931_FluidR3_GM_sf2_file",
  "0931_GeneralUserGS_sf2_file",
  // guitar
  //'0931_SoundBlasterOld_sf2',
  // Pad 7 (halo): Synth Pad
  // '0940_Aspirin_sf2_file', // same as below
  "0940_Chaos_sf2_file",
  "0940_FluidR3_GM_sf2_file",
  "0940_GeneralUserGS_sf2_file",
  "0940_JCLive_sf2_file",
  //'0940_SBLive_sf2',
  //'0940_SoundBlasterOld_sf2',
  "0941_Aspirin_sf2_file",
  "0941_FluidR3_GM_sf2_file",
  "0941_GeneralUserGS_sf2_file",
  "0941_JCLive_sf2_file",
  // Pad 8 (sweep): Synth Pad
  "0950_Aspirin_sf2_file",
  "0950_Chaos_sf2_file",
  "0950_FluidR3_GM_sf2_file",
  "0950_GeneralUserGS_sf2_file",
  "0950_JCLive_sf2_file",
  //'0950_SBLive_sf2',
  //'0950_SoundBlasterOld_sf2',
  "0951_FluidR3_GM_sf2_file",
  "0951_GeneralUserGS_sf2_file",
  // FX 1 (rain): Synth Effects
  //'0960_Aspirin_sf2_file', //mixed samples?
  "0960_Chaos_sf2_file",
  // pad?
  "0960_FluidR3_GM_sf2_file",
  // ???
  "0960_GeneralUserGS_sf2_file",
  // pad
  // '0960_JCLive_sf2_file', // mixed samples?
  //'0960_SBLive_sf2',
  //'0960_SoundBlasterOld_sf2',
  "0961_Aspirin_sf2_file",
  "0961_FluidR3_GM_sf2_file",
  // '0961_GeneralUserGS_sf2_file', // ?!?!
  //'0961_SoundBlasterOld_sf2',
  "0962_GeneralUserGS_sf2_file",
  // FX 2 (soundtrack): Synth Effects
  "0970_Aspirin_sf2_file",
  //'0970_Chaos_sf2_file', // wrong pitch
  "0970_FluidR3_GM_sf2_file",
  "0970_GeneralUserGS_sf2_file",
  // not looping..
  //'0970_JCLive_sf2_file', // wrong pitch
  //'0970_SBLive_sf2',
  //'0970_SoundBlasterOld_sf2',
  "0971_FluidR3_GM_sf2_file",
  "0971_GeneralUserGS_sf2_file",
  //'0971_SoundBlasterOld_sf2',
  // FX 3 (crystal): Synth Effects
  "0980_Aspirin_sf2_file",
  "0980_Chaos_sf2_file",
  // '0980_FluidR3_GM_sf2_file', // some notes are weird
  "0980_GeneralUserGS_sf2_file",
  "0980_JCLive_sf2_file",
  //'0980_SBLive_sf2',
  //'0980_SoundBlasterOld_sf2',
  "0981_Aspirin_sf2_file",
  // strings
  "0981_FluidR3_GM_sf2_file",
  // mallet
  "0981_GeneralUserGS_sf2_file",
  //'0981_SoundBlasterOld_sf2',
  "0982_GeneralUserGS_sf2_file",
  "0983_GeneralUserGS_sf2_file",
  // guitar
  "0984_GeneralUserGS_sf2_file",
  // FX 4 (atmosphere): Synth Effects
  "0990_Aspirin_sf2_file",
  // pad
  "0990_Chaos_sf2_file",
  // pad
  "0990_FluidR3_GM_sf2_file",
  // guitar
  "0990_GeneralUserGS_sf2_file",
  // guitar
  "0990_JCLive_sf2_file",
  // pad
  //'0990_SBLive_sf2',
  //'0990_SoundBlasterOld_sf2',
  "0991_Aspirin_sf2_file",
  // guitar
  "0991_FluidR3_GM_sf2_file",
  // pad
  "0991_GeneralUserGS_sf2_file",
  // pad
  "0991_JCLive_sf2_file",
  // guitar
  //'0991_SoundBlasterOld_sf2',
  "0992_FluidR3_GM_sf2_file",
  // pad
  "0992_JCLive_sf2_file",
  // guitar
  "0993_JCLive_sf2_file",
  // guitar
  "0994_JCLive_sf2_file",
  // guitar
  // FX 5 (brightness): Synth Effects
  "1000_Aspirin_sf2_file",
  "1000_Chaos_sf2_file",
  "1000_FluidR3_GM_sf2_file",
  "1000_GeneralUserGS_sf2_file",
  "1000_JCLive_sf2_file",
  //'1000_SBLive_sf2',
  //'1000_SoundBlasterOld_sf2',
  "1001_Aspirin_sf2_file",
  "1001_FluidR3_GM_sf2_file",
  "1001_GeneralUserGS_sf2_file",
  "1001_JCLive_sf2_file",
  //'1001_SoundBlasterOld_sf2',
  "1002_Aspirin_sf2_file",
  "1002_FluidR3_GM_sf2_file",
  "1002_GeneralUserGS_sf2_file",
  // FX 6 (goblins): Synth Effects
  "1010_Aspirin_sf2_file",
  "1010_Chaos_sf2_file",
  "1010_FluidR3_GM_sf2_file",
  "1010_GeneralUserGS_sf2_file",
  "1010_JCLive_sf2_file",
  //'1010_SBLive_sf2',
  //'1010_SoundBlasterOld_sf2',
  "1011_Aspirin_sf2_file",
  "1011_FluidR3_GM_sf2_file",
  "1011_JCLive_sf2_file",
  "1012_Aspirin_sf2_file",
  // FX 7 (echoes): Synth Effects
  "1020_Aspirin_sf2_file",
  "1020_Chaos_sf2_file",
  "1020_FluidR3_GM_sf2_file",
  "1020_GeneralUserGS_sf2_file",
  "1020_JCLive_sf2_file",
  //'1020_SBLive_sf2',
  //'1020_SoundBlasterOld_sf2',
  "1021_Aspirin_sf2_file",
  "1021_FluidR3_GM_sf2_file",
  "1021_GeneralUserGS_sf2_file",
  "1021_JCLive_sf2_file",
  //'1021_SoundBlasterOld_sf2',
  "1022_GeneralUserGS_sf2_file",
  // FX 8 (sci-fi): Synth Effects
  "1030_Aspirin_sf2_file",
  "1030_Chaos_sf2_file",
  "1030_FluidR3_GM_sf2_file",
  "1030_GeneralUserGS_sf2_file",
  "1030_JCLive_sf2_file",
  //'1030_SBLive_sf2',
  //'1030_SoundBlasterOld_sf2',
  "1031_Aspirin_sf2_file",
  "1031_FluidR3_GM_sf2_file",
  "1031_GeneralUserGS_sf2_file",
  //'1031_SoundBlasterOld_sf2',
  "1032_FluidR3_GM_sf2_file",
  // 'Sitar: Ethnic
  "1040_Aspirin_sf2_file",
  "1040_Chaos_sf2_file",
  "1040_FluidR3_GM_sf2_file",
  "1040_GeneralUserGS_sf2_file",
  "1040_JCLive_sf2_file",
  //'1040_SBLive_sf2',
  //'1040_SoundBlasterOld_sf2',
  "1041_FluidR3_GM_sf2_file",
  "1041_GeneralUserGS_sf2_file",
  // Banjo: Ethnic
  "1050_Aspirin_sf2_file",
  "1050_Chaos_sf2_file",
  "1050_FluidR3_GM_sf2_file",
  "1050_GeneralUserGS_sf2_file",
  "1050_JCLive_sf2_file",
  //'1050_SBLive_sf2',
  //'1050_SoundBlasterOld_sf2',
  "1051_GeneralUserGS_sf2_file",
  // Shamisen: Ethnic
  "1060_Aspirin_sf2_file",
  "1060_Chaos_sf2_file",
  "1060_FluidR3_GM_sf2_file",
  "1060_GeneralUserGS_sf2_file",
  "1060_JCLive_sf2_file",
  //'1060_SBLive_sf2',
  //'1060_SoundBlasterOld_sf2',
  "1061_FluidR3_GM_sf2_file",
  "1061_GeneralUserGS_sf2_file",
  //'1061_SoundBlasterOld_sf2',
  // Koto: Ethnic
  "1070_Aspirin_sf2_file",
  "1070_Chaos_sf2_file",
  "1070_FluidR3_GM_sf2_file",
  "1070_GeneralUserGS_sf2_file",
  "1070_JCLive_sf2_file",
  //'1070_SBLive_sf2',
  //'1070_SoundBlasterOld_sf2',
  "1071_FluidR3_GM_sf2_file",
  "1071_GeneralUserGS_sf2_file",
  "1072_GeneralUserGS_sf2_file",
  "1073_GeneralUserGS_sf2_file",
  // Kalimba: Ethnic
  "1080_Aspirin_sf2_file",
  "1080_Chaos_sf2_file",
  "1080_FluidR3_GM_sf2_file",
  "1080_GeneralUserGS_sf2_file",
  "1080_JCLive_sf2_file",
  //'1080_SBLive_sf2',
  //'1080_SoundBlasterOld_sf2',
  //'1081_SoundBlasterOld_sf2',
  // Bagpipe: Ethnic
  "1090_Aspirin_sf2_file",
  "1090_Chaos_sf2_file",
  "1090_FluidR3_GM_sf2_file",
  "1090_GeneralUserGS_sf2_file",
  "1090_JCLive_sf2_file",
  //'1090_SBLive_sf2',
  //'1090_SoundBlasterOld_sf2',
  //'1091_SoundBlasterOld_sf2',
  // Fiddle: Ethnic
  "1100_Aspirin_sf2_file",
  "1100_Chaos_sf2_file",
  "1100_FluidR3_GM_sf2_file",
  "1100_GeneralUserGS_sf2_file",
  "1100_JCLive_sf2_file",
  //'1100_SBLive_sf2',
  //'1100_SoundBlasterOld_sf2',
  "1101_Aspirin_sf2_file",
  "1101_FluidR3_GM_sf2_file",
  "1101_GeneralUserGS_sf2_file",
  "1102_GeneralUserGS_sf2_file",
  // Shanai: Ethnic
  "1110_Aspirin_sf2_file",
  "1110_Chaos_sf2_file",
  "1110_FluidR3_GM_sf2_file",
  "1110_GeneralUserGS_sf2_file",
  "1110_JCLive_sf2_file",
  //'1110_SBLive_sf2',
  //'1110_SoundBlasterOld_sf2',
  // Tinkle Bell: Percussive
  "1120_Aspirin_sf2_file",
  "1120_Chaos_sf2_file",
  "1120_FluidR3_GM_sf2_file",
  "1120_GeneralUserGS_sf2_file",
  "1120_JCLive_sf2_file",
  //'1120_SBLive_sf2',
  //'1120_SoundBlasterOld_sf2',
  //'1121_SoundBlasterOld_sf2',
  // Agogo: Percussive
  "1130_Aspirin_sf2_file",
  "1130_Chaos_sf2_file",
  "1130_FluidR3_GM_sf2_file",
  "1130_GeneralUserGS_sf2_file",
  "1130_JCLive_sf2_file",
  //'1130_SBLive_sf2',
  //'1130_SoundBlasterOld_sf2',
  "1131_FluidR3_GM_sf2_file",
  //'1131_SoundBlasterOld_sf2',
  // Steel Drums: Percussive
  "1140_Aspirin_sf2_file",
  "1140_Chaos_sf2_file",
  "1140_FluidR3_GM_sf2_file",
  "1140_GeneralUserGS_sf2_file",
  "1140_JCLive_sf2_file",
  //'1140_SBLive_sf2',
  //'1140_SoundBlasterOld_sf2',
  "1141_FluidR3_GM_sf2_file",
  // Woodblock: Percussive
  "1150_Aspirin_sf2_file",
  "1150_Chaos_sf2_file",
  "1150_FluidR3_GM_sf2_file",
  "1150_GeneralUserGS_sf2_file",
  "1150_JCLive_sf2_file",
  //'1150_SBLive_sf2',
  //'1150_SoundBlasterOld_sf2',
  "1151_FluidR3_GM_sf2_file",
  "1151_GeneralUserGS_sf2_file",
  "1152_FluidR3_GM_sf2_file",
  "1152_GeneralUserGS_sf2_file",
  // Taiko Drum: Percussive
  "1160_Aspirin_sf2_file",
  "1160_Chaos_sf2_file",
  "1160_FluidR3_GM_sf2_file",
  "1160_GeneralUserGS_sf2_file",
  "1160_JCLive_sf2_file",
  //'1160_SBLive_sf2',
  //'1160_SoundBlasterOld_sf2',
  "1161_FluidR3_GM_sf2_file",
  "1161_GeneralUserGS_sf2_file",
  //'1161_SoundBlasterOld_sf2',
  "1162_FluidR3_GM_sf2_file",
  "1162_GeneralUserGS_sf2_file",
  "1163_FluidR3_GM_sf2_file",
  // Melodic Tom: Percussive
  "1170_Aspirin_sf2_file",
  "1170_Chaos_sf2_file",
  "1170_FluidR3_GM_sf2_file",
  "1170_GeneralUserGS_sf2_file",
  "1170_JCLive_sf2_file",
  //'1170_SBLive_sf2',
  //'1170_SoundBlasterOld_sf2',
  "1171_FluidR3_GM_sf2_file",
  "1171_GeneralUserGS_sf2_file",
  "1172_FluidR3_GM_sf2_file",
  "1173_FluidR3_GM_sf2_file",
  // Synth Drum: Percussive
  "1180_Aspirin_sf2_file",
  "1180_Chaos_sf2_file",
  "1180_FluidR3_GM_sf2_file",
  "1180_GeneralUserGS_sf2_file",
  "1180_JCLive_sf2_file",
  //'1180_SBLive_sf2',
  //'1180_SoundBlasterOld_sf2',
  "1181_FluidR3_GM_sf2_file",
  "1181_GeneralUserGS_sf2_file",
  //'1181_SoundBlasterOld_sf2',
  // Reverse Cymbal: Percussive
  "1190_Aspirin_sf2_file",
  "1190_Chaos_sf2_file",
  "1190_FluidR3_GM_sf2_file",
  "1190_GeneralUserGS_sf2_file",
  "1190_JCLive_sf2_file",
  //'1190_SBLive_sf2',
  //'1190_SoundBlasterOld_sf2',
  "1191_GeneralUserGS_sf2_file",
  "1192_GeneralUserGS_sf2_file",
  "1193_GeneralUserGS_sf2_file",
  "1194_GeneralUserGS_sf2_file",
  // Guitar Fret Noise: Sound effects
  "1200_Aspirin_sf2_file",
  "1200_Chaos_sf2_file",
  "1200_FluidR3_GM_sf2_file",
  "1200_GeneralUserGS_sf2_file",
  "1200_JCLive_sf2_file",
  //'1200_SBLive_sf2',
  //'1200_SoundBlasterOld_sf2',
  "1201_Aspirin_sf2_file",
  "1201_GeneralUserGS_sf2_file",
  "1202_GeneralUserGS_sf2_file",
  // Breath Noise: Sound effects
  "1210_Aspirin_sf2_file",
  "1210_Chaos_sf2_file",
  "1210_FluidR3_GM_sf2_file",
  "1210_GeneralUserGS_sf2_file",
  "1210_JCLive_sf2_file",
  //'1210_SBLive_sf2',
  //'1210_SoundBlasterOld_sf2',
  "1211_Aspirin_sf2_file",
  "1211_GeneralUserGS_sf2_file",
  "1212_GeneralUserGS_sf2_file",
  // Seashore: Sound effects
  "1220_Aspirin_sf2_file",
  "1220_Chaos_sf2_file",
  "1220_FluidR3_GM_sf2_file",
  "1220_GeneralUserGS_sf2_file",
  "1220_JCLive_sf2_file",
  //'1220_SBLive_sf2',
  //'1220_SoundBlasterOld_sf2',
  "1221_Aspirin_sf2_file",
  "1221_GeneralUserGS_sf2_file",
  "1221_JCLive_sf2_file",
  "1222_Aspirin_sf2_file",
  "1222_GeneralUserGS_sf2_file",
  "1223_Aspirin_sf2_file",
  "1223_GeneralUserGS_sf2_file",
  "1224_Aspirin_sf2_file",
  "1224_GeneralUserGS_sf2_file",
  "1225_GeneralUserGS_sf2_file",
  "1226_GeneralUserGS_sf2_file",
  // Bird Tweet: Sound effects
  "1230_Aspirin_sf2_file",
  "1230_Chaos_sf2_file",
  "1230_FluidR3_GM_sf2_file",
  "1230_GeneralUserGS_sf2_file",
  "1230_JCLive_sf2_file",
  //'1230_SBLive_sf2',
  //'1230_SoundBlasterOld_sf2',
  "1231_Aspirin_sf2_file",
  "1231_GeneralUserGS_sf2_file",
  "1232_Aspirin_sf2_file",
  "1232_GeneralUserGS_sf2_file",
  "1233_GeneralUserGS_sf2_file",
  "1234_GeneralUserGS_sf2_file",
  // Telephone Ring: Sound effects
  "1240_Aspirin_sf2_file",
  "1240_Chaos_sf2_file",
  "1240_FluidR3_GM_sf2_file",
  "1240_GeneralUserGS_sf2_file",
  "1240_JCLive_sf2_file",
  //'1240_SBLive_sf2',
  //'1240_SoundBlasterOld_sf2',
  "1241_Aspirin_sf2_file",
  "1241_GeneralUserGS_sf2_file",
  "1242_Aspirin_sf2_file",
  "1242_GeneralUserGS_sf2_file",
  "1243_Aspirin_sf2_file",
  "1243_GeneralUserGS_sf2_file",
  "1244_Aspirin_sf2_file",
  "1244_GeneralUserGS_sf2_file",
  // Helicopter: Sound effects
  "1250_Aspirin_sf2_file",
  "1250_Chaos_sf2_file",
  "1250_FluidR3_GM_sf2_file",
  "1250_GeneralUserGS_sf2_file",
  "1250_JCLive_sf2_file",
  //'1250_SBLive_sf2',
  //'1250_SoundBlasterOld_sf2',
  "1251_Aspirin_sf2_file",
  "1251_FluidR3_GM_sf2_file",
  "1251_GeneralUserGS_sf2_file",
  "1252_Aspirin_sf2_file",
  "1252_FluidR3_GM_sf2_file",
  "1252_GeneralUserGS_sf2_file",
  "1253_Aspirin_sf2_file",
  "1253_GeneralUserGS_sf2_file",
  "1254_Aspirin_sf2_file",
  "1254_GeneralUserGS_sf2_file",
  "1255_Aspirin_sf2_file",
  "1255_GeneralUserGS_sf2_file",
  "1256_Aspirin_sf2_file",
  "1256_GeneralUserGS_sf2_file",
  "1257_Aspirin_sf2_file",
  "1257_GeneralUserGS_sf2_file",
  "1258_Aspirin_sf2_file",
  "1258_GeneralUserGS_sf2_file",
  "1259_GeneralUserGS_sf2_file",
  // Applause: Sound effects
  "1260_Aspirin_sf2_file",
  "1260_Chaos_sf2_file",
  "1260_FluidR3_GM_sf2_file",
  "1260_GeneralUserGS_sf2_file",
  "1260_JCLive_sf2_file",
  //'1260_SBLive_sf2',
  //'1260_SoundBlasterOld_sf2',
  "1261_Aspirin_sf2_file",
  "1261_GeneralUserGS_sf2_file",
  "1262_Aspirin_sf2_file",
  "1262_GeneralUserGS_sf2_file",
  "1263_Aspirin_sf2_file",
  "1263_GeneralUserGS_sf2_file",
  "1264_Aspirin_sf2_file",
  "1264_GeneralUserGS_sf2_file",
  "1265_Aspirin_sf2_file",
  "1265_GeneralUserGS_sf2_file",
  // Gunshot: Sound effects
  "1270_Aspirin_sf2_file",
  "1270_Chaos_sf2_file",
  "1270_FluidR3_GM_sf2_file",
  "1270_GeneralUserGS_sf2_file",
  "1270_JCLive_sf2_file",
  //'1270_SBLive_sf2',
  //'1270_SoundBlasterOld_sf2',
  "1271_Aspirin_sf2_file",
  "1271_GeneralUserGS_sf2_file",
  "1272_Aspirin_sf2_file",
  "1272_GeneralUserGS_sf2_file",
  "1273_GeneralUserGS_sf2_file",
  "1274_GeneralUserGS_sf2_file"
], drums = [
  ////'35_0_SBLive_sf2'
  "35_0_Chaos_sf2_file",
  "35_12_JCLive_sf2_file",
  "35_16_JCLive_sf2_file",
  "35_18_JCLive_sf2_file",
  "35_4_Chaos_sf2_file",
  //'36_0_SBLive_sf2',
  "36_12_JCLive_sf2_file",
  "36_16_JCLive_sf2_file",
  "36_18_JCLive_sf2_file",
  "36_4_Chaos_sf2_file",
  //'37_0_SBLive_sf2',
  "37_12_JCLive_sf2_file",
  "37_16_JCLive_sf2_file",
  "37_18_JCLive_sf2_file",
  "37_4_Chaos_sf2_file",
  //'38_0_SBLive_sf2',
  "38_12_JCLive_sf2_file",
  "38_16_JCLive_sf2_file",
  "38_18_JCLive_sf2_file",
  "38_4_Chaos_sf2_file",
  //'39_0_SBLive_sf2',
  "39_12_JCLive_sf2_file",
  "39_16_JCLive_sf2_file",
  "39_18_JCLive_sf2_file",
  "39_4_Chaos_sf2_file",
  //'40_0_SBLive_sf2',
  "40_12_JCLive_sf2_file",
  "40_16_JCLive_sf2_file",
  "40_18_JCLive_sf2_file",
  "40_4_Chaos_sf2_file",
  //'41_0_SBLive_sf2',
  "41_12_JCLive_sf2_file",
  "41_16_JCLive_sf2_file",
  "41_18_JCLive_sf2_file",
  "41_4_Chaos_sf2_file",
  //'42_0_SBLive_sf2',
  "42_12_JCLive_sf2_file",
  "42_16_JCLive_sf2_file",
  "42_18_JCLive_sf2_file",
  "42_4_Chaos_sf2_file",
  //'43_0_SBLive_sf2',
  "43_12_JCLive_sf2_file",
  "43_16_JCLive_sf2_file",
  "43_18_JCLive_sf2_file",
  "43_4_Chaos_sf2_file",
  //'44_0_SBLive_sf2',
  "44_12_JCLive_sf2_file",
  "44_16_JCLive_sf2_file",
  "44_18_JCLive_sf2_file",
  "44_4_Chaos_sf2_file",
  //'45_0_SBLive_sf2',
  "45_12_JCLive_sf2_file",
  "45_16_JCLive_sf2_file",
  "45_18_JCLive_sf2_file",
  "45_4_Chaos_sf2_file",
  //'46_0_SBLive_sf2',
  "46_12_JCLive_sf2_file",
  "46_16_JCLive_sf2_file",
  "46_18_JCLive_sf2_file",
  "46_4_Chaos_sf2_file",
  //'47_0_SBLive_sf2',
  "47_12_JCLive_sf2_file",
  "47_16_JCLive_sf2_file",
  "47_18_JCLive_sf2_file",
  "47_4_Chaos_sf2_file",
  //'48_0_SBLive_sf2',
  "48_12_JCLive_sf2_file",
  "48_16_JCLive_sf2_file",
  "48_18_JCLive_sf2_file",
  "48_4_Chaos_sf2_file",
  //'49_0_SBLive_sf2',
  "49_12_JCLive_sf2_file",
  "49_16_JCLive_sf2_file",
  "49_18_JCLive_sf2_file",
  "49_4_Chaos_sf2_file",
  //'50_0_SBLive_sf2',
  "50_12_JCLive_sf2_file",
  "50_16_JCLive_sf2_file",
  "50_18_JCLive_sf2_file",
  "50_4_Chaos_sf2_file",
  //'51_0_SBLive_sf2',
  "51_12_JCLive_sf2_file",
  "51_16_JCLive_sf2_file",
  "51_18_JCLive_sf2_file",
  "51_4_Chaos_sf2_file",
  //'52_0_SBLive_sf2',
  "52_12_JCLive_sf2_file",
  "52_16_JCLive_sf2_file",
  "52_18_JCLive_sf2_file",
  "52_4_Chaos_sf2_file",
  //'53_0_SBLive_sf2',
  "53_12_JCLive_sf2_file",
  "53_16_JCLive_sf2_file",
  "53_18_JCLive_sf2_file",
  "53_4_Chaos_sf2_file",
  //'54_0_SBLive_sf2',
  "54_12_JCLive_sf2_file",
  "54_16_JCLive_sf2_file",
  "54_18_JCLive_sf2_file",
  "54_4_Chaos_sf2_file",
  //'55_0_SBLive_sf2',
  "55_12_JCLive_sf2_file",
  "55_16_JCLive_sf2_file",
  "55_18_JCLive_sf2_file",
  "55_4_Chaos_sf2_file",
  //'56_0_SBLive_sf2',
  "56_12_JCLive_sf2_file",
  "56_16_JCLive_sf2_file",
  "56_18_JCLive_sf2_file",
  "56_4_Chaos_sf2_file",
  //'57_0_SBLive_sf2',
  "57_12_JCLive_sf2_file",
  "57_16_JCLive_sf2_file",
  "57_18_JCLive_sf2_file",
  "57_4_Chaos_sf2_file",
  //'58_0_SBLive_sf2',
  "58_12_JCLive_sf2_file",
  "58_16_JCLive_sf2_file",
  "58_18_JCLive_sf2_file",
  "58_4_Chaos_sf2_file",
  //'59_0_SBLive_sf2',
  "59_12_JCLive_sf2_file",
  "59_16_JCLive_sf2_file",
  "59_18_JCLive_sf2_file",
  "59_4_Chaos_sf2_file",
  //'60_0_SBLive_sf2',
  "60_12_JCLive_sf2_file",
  "60_16_JCLive_sf2_file",
  "60_18_JCLive_sf2_file",
  "60_4_Chaos_sf2_file",
  //'61_0_SBLive_sf2',
  "61_12_JCLive_sf2_file",
  "61_16_JCLive_sf2_file",
  "61_18_JCLive_sf2_file",
  "61_4_Chaos_sf2_file",
  //'62_0_SBLive_sf2',
  "62_12_JCLive_sf2_file",
  "62_16_JCLive_sf2_file",
  "62_18_JCLive_sf2_file",
  "62_4_Chaos_sf2_file",
  //'63_0_SBLive_sf2',
  "63_12_JCLive_sf2_file",
  "63_16_JCLive_sf2_file",
  "63_18_JCLive_sf2_file",
  "63_4_Chaos_sf2_file",
  //'64_0_SBLive_sf2',
  "64_12_JCLive_sf2_file",
  "64_16_JCLive_sf2_file",
  "64_18_JCLive_sf2_file",
  "64_4_Chaos_sf2_file",
  //'65_0_SBLive_sf2',
  "65_12_JCLive_sf2_file",
  "65_16_JCLive_sf2_file",
  "65_18_JCLive_sf2_file",
  "65_4_Chaos_sf2_file",
  //'66_0_SBLive_sf2',
  "66_12_JCLive_sf2_file",
  "66_16_JCLive_sf2_file",
  "66_18_JCLive_sf2_file",
  "66_4_Chaos_sf2_file",
  //'67_0_SBLive_sf2',
  "67_12_JCLive_sf2_file",
  "67_16_JCLive_sf2_file",
  "67_18_JCLive_sf2_file",
  "67_4_Chaos_sf2_file",
  //'68_0_SBLive_sf2',
  "68_12_JCLive_sf2_file",
  "68_16_JCLive_sf2_file",
  "68_18_JCLive_sf2_file",
  "68_4_Chaos_sf2_file",
  //'69_0_SBLive_sf2',
  "69_12_JCLive_sf2_file",
  "69_16_JCLive_sf2_file",
  "69_18_JCLive_sf2_file",
  "69_4_Chaos_sf2_file",
  //'70_0_SBLive_sf2',
  "70_12_JCLive_sf2_file",
  "70_16_JCLive_sf2_file",
  "70_18_JCLive_sf2_file",
  "70_4_Chaos_sf2_file",
  //'71_0_SBLive_sf2',
  "71_12_JCLive_sf2_file",
  "71_16_JCLive_sf2_file",
  "71_18_JCLive_sf2_file",
  "71_4_Chaos_sf2_file",
  //'72_0_SBLive_sf2',
  "72_12_JCLive_sf2_file",
  "72_16_JCLive_sf2_file",
  "72_18_JCLive_sf2_file",
  "72_4_Chaos_sf2_file",
  //'73_0_SBLive_sf2',
  "73_12_JCLive_sf2_file",
  "73_16_JCLive_sf2_file",
  "73_18_JCLive_sf2_file",
  "73_4_Chaos_sf2_file",
  //'74_0_SBLive_sf2',
  "74_12_JCLive_sf2_file",
  "74_16_JCLive_sf2_file",
  "74_18_JCLive_sf2_file",
  "74_4_Chaos_sf2_file",
  //'75_0_SBLive_sf2',
  "75_12_JCLive_sf2_file",
  "75_16_JCLive_sf2_file",
  "75_18_JCLive_sf2_file",
  "75_4_Chaos_sf2_file",
  //'76_0_SBLive_sf2',
  "76_12_JCLive_sf2_file",
  "76_16_JCLive_sf2_file",
  "76_18_JCLive_sf2_file",
  "76_4_Chaos_sf2_file",
  //'77_0_SBLive_sf2',
  "77_12_JCLive_sf2_file",
  "77_16_JCLive_sf2_file",
  "77_18_JCLive_sf2_file",
  "77_4_Chaos_sf2_file",
  //'78_0_SBLive_sf2',
  "78_12_JCLive_sf2_file",
  "78_16_JCLive_sf2_file",
  "78_18_JCLive_sf2_file",
  "78_4_Chaos_sf2_file",
  //'79_0_SBLive_sf2',
  "79_12_JCLive_sf2_file",
  "79_16_JCLive_sf2_file",
  "79_18_JCLive_sf2_file",
  "79_4_Chaos_sf2_file",
  //'80_0_SBLive_sf2',
  "80_12_JCLive_sf2_file",
  "80_16_JCLive_sf2_file",
  "80_18_JCLive_sf2_file",
  "80_4_Chaos_sf2_file",
  //'81_0_SBLive_sf2',
  "81_12_JCLive_sf2_file",
  "81_16_JCLive_sf2_file",
  "81_18_JCLive_sf2_file",
  "81_4_Chaos_sf2_file"
], instrumentNames = [];
instrumentNames[0] = "Acoustic Grand Piano: Piano";
instrumentNames[1] = "Bright Acoustic Piano: Piano";
instrumentNames[2] = "Electric Grand Piano: Piano";
instrumentNames[3] = "Honky-tonk Piano: Piano";
instrumentNames[4] = "Electric Piano 1: Piano";
instrumentNames[5] = "Electric Piano 2: Piano";
instrumentNames[6] = "Harpsichord: Piano";
instrumentNames[7] = "Clavinet: Piano";
instrumentNames[8] = "Celesta: Chromatic Percussion";
instrumentNames[9] = "Glockenspiel: Chromatic Percussion";
instrumentNames[10] = "Music Box: Chromatic Percussion";
instrumentNames[11] = "Vibraphone: Chromatic Percussion";
instrumentNames[12] = "Marimba: Chromatic Percussion";
instrumentNames[13] = "Xylophone: Chromatic Percussion";
instrumentNames[14] = "Tubular Bells: Chromatic Percussion";
instrumentNames[15] = "Dulcimer: Chromatic Percussion";
instrumentNames[16] = "Drawbar Organ: Organ";
instrumentNames[17] = "Percussive Organ: Organ";
instrumentNames[18] = "Rock Organ: Organ";
instrumentNames[19] = "Church Organ: Organ";
instrumentNames[20] = "Reed Organ: Organ";
instrumentNames[21] = "Accordion: Organ";
instrumentNames[22] = "Harmonica: Organ";
instrumentNames[23] = "Tango Accordion: Organ";
instrumentNames[24] = "Acoustic Guitar (nylon): Guitar";
instrumentNames[25] = "Acoustic Guitar (steel): Guitar";
instrumentNames[26] = "Electric Guitar (jazz): Guitar";
instrumentNames[27] = "Electric Guitar (clean): Guitar";
instrumentNames[28] = "Electric Guitar (muted): Guitar";
instrumentNames[29] = "Overdriven Guitar: Guitar";
instrumentNames[30] = "Distortion Guitar: Guitar";
instrumentNames[31] = "Guitar Harmonics: Guitar";
instrumentNames[32] = "Acoustic Bass: Bass";
instrumentNames[33] = "Electric Bass (finger): Bass";
instrumentNames[34] = "Electric Bass (pick): Bass";
instrumentNames[35] = "Fretless Bass: Bass";
instrumentNames[36] = "Slap Bass 1: Bass";
instrumentNames[37] = "Slap Bass 2: Bass";
instrumentNames[38] = "Synth Bass 1: Bass";
instrumentNames[39] = "Synth Bass 2: Bass";
instrumentNames[40] = "Violin: Strings";
instrumentNames[41] = "Viola: Strings";
instrumentNames[42] = "Cello: Strings";
instrumentNames[43] = "Contrabass: Strings";
instrumentNames[44] = "Tremolo Strings: Strings";
instrumentNames[45] = "Pizzicato Strings: Strings";
instrumentNames[46] = "Orchestral Harp: Strings";
instrumentNames[47] = "Timpani: Strings";
instrumentNames[48] = "String Ensemble 1: Ensemble";
instrumentNames[49] = "String Ensemble 2: Ensemble";
instrumentNames[50] = "Synth Strings 1: Ensemble";
instrumentNames[51] = "Synth Strings 2: Ensemble";
instrumentNames[52] = "Choir Aahs: Ensemble";
instrumentNames[53] = "Voice Oohs: Ensemble";
instrumentNames[54] = "Synth Choir: Ensemble";
instrumentNames[55] = "Orchestra Hit: Ensemble";
instrumentNames[56] = "Trumpet: Brass";
instrumentNames[57] = "Trombone: Brass";
instrumentNames[58] = "Tuba: Brass";
instrumentNames[59] = "Muted Trumpet: Brass";
instrumentNames[60] = "French Horn: Brass";
instrumentNames[61] = "Brass Section: Brass";
instrumentNames[62] = "Synth Brass 1: Brass";
instrumentNames[63] = "Synth Brass 2: Brass";
instrumentNames[64] = "Soprano Sax: Reed";
instrumentNames[65] = "Alto Sax: Reed";
instrumentNames[66] = "Tenor Sax: Reed";
instrumentNames[67] = "Baritone Sax: Reed";
instrumentNames[68] = "Oboe: Reed";
instrumentNames[69] = "English Horn: Reed";
instrumentNames[70] = "Bassoon: Reed";
instrumentNames[71] = "Clarinet: Reed";
instrumentNames[72] = "Piccolo: Pipe";
instrumentNames[73] = "Flute: Pipe";
instrumentNames[74] = "Recorder: Pipe";
instrumentNames[75] = "Pan Flute: Pipe";
instrumentNames[76] = "Blown bottle: Pipe";
instrumentNames[77] = "Shakuhachi: Pipe";
instrumentNames[78] = "Whistle: Pipe";
instrumentNames[79] = "Ocarina: Pipe";
instrumentNames[80] = "Lead 1 (square): Synth Lead";
instrumentNames[81] = "Lead 2 (sawtooth): Synth Lead";
instrumentNames[82] = "Lead 3 (calliope): Synth Lead";
instrumentNames[83] = "Lead 4 (chiff): Synth Lead";
instrumentNames[84] = "Lead 5 (charang): Synth Lead";
instrumentNames[85] = "Lead 6 (voice): Synth Lead";
instrumentNames[86] = "Lead 7 (fifths): Synth Lead";
instrumentNames[87] = "Lead 8 (bass + lead): Synth Lead";
instrumentNames[88] = "Pad 1 (new age): Synth Pad";
instrumentNames[89] = "Pad 2 (warm): Synth Pad";
instrumentNames[90] = "Pad 3 (polysynth): Synth Pad";
instrumentNames[91] = "Pad 4 (choir): Synth Pad";
instrumentNames[92] = "Pad 5 (bowed): Synth Pad";
instrumentNames[93] = "Pad 6 (metallic): Synth Pad";
instrumentNames[94] = "Pad 7 (halo): Synth Pad";
instrumentNames[95] = "Pad 8 (sweep): Synth Pad";
instrumentNames[96] = "FX 1 (rain): Synth Effects";
instrumentNames[97] = "FX 2 (soundtrack): Synth Effects";
instrumentNames[98] = "FX 3 (crystal): Synth Effects";
instrumentNames[99] = "FX 4 (atmosphere): Synth Effects";
instrumentNames[100] = "FX 5 (brightness): Synth Effects";
instrumentNames[101] = "FX 6 (goblins): Synth Effects";
instrumentNames[102] = "FX 7 (echoes): Synth Effects";
instrumentNames[103] = "FX 8 (sci-fi): Synth Effects";
instrumentNames[104] = "Sitar: Ethnic";
instrumentNames[105] = "Banjo: Ethnic";
instrumentNames[106] = "Shamisen: Ethnic";
instrumentNames[107] = "Koto: Ethnic";
instrumentNames[108] = "Kalimba: Ethnic";
instrumentNames[109] = "Bagpipe: Ethnic";
instrumentNames[110] = "Fiddle: Ethnic";
instrumentNames[111] = "Shanai: Ethnic";
instrumentNames[112] = "Tinkle Bell: Percussive";
instrumentNames[113] = "Agogo: Percussive";
instrumentNames[114] = "Steel Drums: Percussive";
instrumentNames[115] = "Woodblock: Percussive";
instrumentNames[116] = "Taiko Drum: Percussive";
instrumentNames[117] = "Melodic Tom: Percussive";
instrumentNames[118] = "Synth Drum: Percussive";
instrumentNames[119] = "Reverse Cymbal: Percussive";
instrumentNames[120] = "Guitar Fret Noise: Sound effects";
instrumentNames[121] = "Breath Noise: Sound effects";
instrumentNames[122] = "Seashore: Sound effects";
instrumentNames[123] = "Bird Tweet: Sound effects";
instrumentNames[124] = "Telephone Ring: Sound effects";
instrumentNames[125] = "Helicopter: Sound effects";
instrumentNames[126] = "Applause: Sound effects";
instrumentNames[127] = "Gunshot: Sound effects";
const list = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  drums,
  instrumentNames,
  instruments
}, Symbol.toStringTag, { value: "Module" }));
f.prototype.soundfont = function(e, l2 = 0) {
  return this.onTrigger((s, f2, a, r) => {
    const n = x$1(), i2 = Va(s), G2 = e.presets[l2 % e.presets.length], u = r, o = [n, G2, pt$1(i2), u];
    ce(...o)(u + s.duration);
  });
};
const soundfontCache = /* @__PURE__ */ new Map();
function loadSoundfont(e) {
  if (soundfontCache.get(e))
    return soundfontCache.get(e);
  const l2 = ae(e);
  return soundfontCache.set(e, l2), l2;
}
const Soundfonts = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getFontBufferSource,
  loadSoundfont,
  registerSoundfonts,
  setSoundfontUrl,
  soundfontList: list,
  startPresetNote: ce
}, Symbol.toStringTag, { value: "Module" }));
let identity = (a) => a;
let storageEngine = {};
let eventsEngine = { addEventListener() {
}, removeEventListener() {
} };
function testSupport() {
  try {
    return typeof localStorage !== "undefined";
  } catch {
    return false;
  }
}
if (testSupport()) {
  storageEngine = localStorage;
}
let windowPersistentEvents = {
  addEventListener(key, listener, restore) {
    window.addEventListener("storage", listener);
    window.addEventListener("pageshow", restore);
  },
  removeEventListener(key, listener, restore) {
    window.removeEventListener("storage", listener);
    window.removeEventListener("pageshow", restore);
  }
};
if (typeof window !== "undefined") {
  eventsEngine = windowPersistentEvents;
}
function setPersistentEngine(storage, events) {
  storageEngine = storage;
  eventsEngine = events;
}
function persistentAtom(name2, initial = void 0, opts = {}) {
  let encode = opts.encode || identity;
  let decode = opts.decode || identity;
  let store = atom(initial);
  let set = store.set;
  store.set = (newValue) => {
    let converted = encode(newValue);
    if (typeof converted === "undefined") {
      delete storageEngine[name2];
    } else {
      storageEngine[name2] = converted;
    }
    set(newValue);
  };
  function listener(e) {
    if (e.key === name2) {
      if (e.newValue === null) {
        set(initial);
      } else {
        set(decode(e.newValue));
      }
    } else if (!storageEngine[name2]) {
      set(initial);
    }
  }
  function restore() {
    store.set(storageEngine[name2] ? decode(storageEngine[name2]) : initial);
  }
  onMount(store, () => {
    restore();
    if (opts.listen !== false) {
      eventsEngine.addEventListener(name2, listener, restore);
      return () => {
        eventsEngine.removeEventListener(name2, listener, restore);
      };
    }
  });
  return store;
}
function persistentBoolean(key, initial = false, opts = {}) {
  return persistentAtom(key, initial, {
    ...opts,
    decode(str) {
      return str === "yes";
    },
    encode(value) {
      return value ? "yes" : void 0;
    }
  });
}
function persistentMap(prefix, initial = {}, opts = {}) {
  let encode = opts.encode || identity;
  let decode = opts.decode || identity;
  let store = map();
  let setKey = store.setKey;
  let storeKey = (key, newValue) => {
    if (typeof newValue === "undefined") {
      if (opts.listen !== false && eventsEngine.perKey) {
        eventsEngine.removeEventListener(prefix + key, listener, restore);
      }
      delete storageEngine[prefix + key];
    } else {
      if (opts.listen !== false && eventsEngine.perKey && !(key in store.value)) {
        eventsEngine.addEventListener(prefix + key, listener, restore);
      }
      storageEngine[prefix + key] = encode(newValue);
    }
  };
  store.setKey = (key, newValue) => {
    storeKey(key, newValue);
    setKey(key, newValue);
  };
  let set = store.set;
  store.set = function(newObject) {
    for (let key in newObject) {
      storeKey(key, newObject[key]);
    }
    for (let key in store.value) {
      if (!(key in newObject)) {
        storeKey(key, void 0);
      }
    }
    set(newObject);
  };
  function listener(e) {
    if (!e.key) {
      set({});
    } else if (e.key.startsWith(prefix)) {
      if (e.newValue === null) {
        setKey(e.key.slice(prefix.length), void 0);
      } else {
        setKey(e.key.slice(prefix.length), decode(e.newValue));
      }
    }
  }
  function restore() {
    let data2 = { ...initial };
    for (let key in storageEngine) {
      if (key.startsWith(prefix)) {
        data2[key.slice(prefix.length)] = decode(storageEngine[key]);
      }
    }
    for (let key in data2) {
      store.setKey(key, data2[key]);
    }
  }
  onMount(store, () => {
    restore();
    if (opts.listen !== false) {
      eventsEngine.addEventListener(prefix, listener, restore);
      return () => {
        eventsEngine.removeEventListener(prefix, listener, restore);
        for (let key in store.value) {
          eventsEngine.removeEventListener(prefix + key, listener, restore);
        }
      };
    }
  });
  return store;
}
let testStorage = {};
let testListeners = [];
function useTestStorageEngine() {
  setPersistentEngine(testStorage, {
    addEventListener(key, cb) {
      testListeners.push(cb);
    },
    removeEventListener(key, cb) {
      testListeners = testListeners.filter((i2) => i2 !== cb);
    }
  });
}
function setTestStorageKey(key, newValue) {
  if (typeof newValue === "undefined") {
    delete testStorage[key];
  } else {
    testStorage[key] = newValue;
  }
  let event = { key, newValue };
  for (let listener of testListeners) {
    listener(event);
  }
}
function getTestStorage() {
  return testStorage;
}
function cleanTestStorage() {
  for (let i2 in testStorage) {
    setTestStorageKey(i2, void 0);
  }
}
const Nano = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cleanTestStorage,
  getTestStorage,
  persistentAtom,
  persistentBoolean,
  persistentMap,
  setPersistentEngine,
  setTestStorageKey,
  useTestStorageEngine,
  windowPersistentEvents
}, Symbol.toStringTag, { value: "Module" }));
let nextPropID = 0;
class NodeProp {
  /**
  Create a new node prop type.
  */
  constructor(config = {}) {
    this.id = nextPropID++;
    this.perNode = !!config.perNode;
    this.deserialize = config.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
    this.combine = config.combine || null;
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(match) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    if (typeof match != "function")
      match = NodeType.match(match);
    return (type) => {
      let result = match(type);
      return result === void 0 ? null : [this, result];
    };
  }
}
NodeProp.closedBy = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.openedBy = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.group = new NodeProp({ deserialize: (str) => str.split(" ") });
NodeProp.isolate = new NodeProp({ deserialize: (value) => {
  if (value && value != "rtl" && value != "ltr" && value != "auto")
    throw new RangeError("Invalid value for isolate: " + value);
  return value || "auto";
} });
NodeProp.contextHash = new NodeProp({ perNode: true });
NodeProp.lookAhead = new NodeProp({ perNode: true });
NodeProp.mounted = new NodeProp({ perNode: true });
const noProps = /* @__PURE__ */ Object.create(null);
class NodeType {
  /**
  @internal
  */
  constructor(name2, props, id2, flags = 0) {
    this.name = name2;
    this.props = props;
    this.id = id2;
    this.flags = flags;
  }
  /**
  Define a node type.
  */
  static define(spec) {
    let props = spec.props && spec.props.length ? /* @__PURE__ */ Object.create(null) : noProps;
    let flags = (spec.top ? 1 : 0) | (spec.skipped ? 2 : 0) | (spec.error ? 4 : 0) | (spec.name == null ? 8 : 0);
    let type = new NodeType(spec.name || "", props, spec.id, flags);
    if (spec.props)
      for (let src of spec.props) {
        if (!Array.isArray(src))
          src = src(type);
        if (src) {
          if (src[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          props[src[0].id] = src[1];
        }
      }
    return type;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(prop) {
    return this.props[prop.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(name2) {
    if (typeof name2 == "string") {
      if (this.name == name2)
        return true;
      let group = this.prop(NodeProp.group);
      return group ? group.indexOf(name2) > -1 : false;
    }
    return this.id == name2;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(map2) {
    let direct = /* @__PURE__ */ Object.create(null);
    for (let prop in map2)
      for (let name2 of prop.split(" "))
        direct[name2] = map2[prop];
    return (node) => {
      for (let groups = node.prop(NodeProp.group), i2 = -1; i2 < (groups ? groups.length : 0); i2++) {
        let found = direct[i2 < 0 ? node.name : groups[i2]];
        if (found)
          return found;
      }
    };
  }
}
NodeType.none = new NodeType(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
var IterMode;
(function(IterMode2) {
  IterMode2[IterMode2["ExcludeBuffers"] = 1] = "ExcludeBuffers";
  IterMode2[IterMode2["IncludeAnonymous"] = 2] = "IncludeAnonymous";
  IterMode2[IterMode2["IgnoreMounts"] = 4] = "IgnoreMounts";
  IterMode2[IterMode2["IgnoreOverlays"] = 8] = "IgnoreOverlays";
})(IterMode || (IterMode = {}));
new NodeProp({ perNode: true });
let nextTagID = 0;
class Tag {
  /**
  @internal
  */
  constructor(name2, set, base, modified) {
    this.name = name2;
    this.set = set;
    this.base = base;
    this.modified = modified;
    this.id = nextTagID++;
  }
  toString() {
    let { name: name2 } = this;
    for (let mod of this.modified)
      if (mod.name)
        name2 = `${mod.name}(${name2})`;
    return name2;
  }
  static define(nameOrParent, parent) {
    let name2 = typeof nameOrParent == "string" ? nameOrParent : "?";
    if (nameOrParent instanceof Tag)
      parent = nameOrParent;
    if (parent === null || parent === void 0 ? void 0 : parent.base)
      throw new Error("Can not derive from a modified tag");
    let tag = new Tag(name2, [], null, []);
    tag.set.push(tag);
    if (parent)
      for (let t2 of parent.set)
        tag.set.push(t2);
    return tag;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(name2) {
    let mod = new Modifier(name2);
    return (tag) => {
      if (tag.modified.indexOf(mod) > -1)
        return tag;
      return Modifier.get(tag.base || tag, tag.modified.concat(mod).sort((a, b2) => a.id - b2.id));
    };
  }
}
let nextModifierID = 0;
class Modifier {
  constructor(name2) {
    this.name = name2;
    this.instances = [];
    this.id = nextModifierID++;
  }
  static get(base, mods) {
    if (!mods.length)
      return base;
    let exists = mods[0].instances.find((t2) => t2.base == base && sameArray(mods, t2.modified));
    if (exists)
      return exists;
    let set = [], tag = new Tag(base.name, set, base, mods);
    for (let m2 of mods)
      m2.instances.push(tag);
    let configs = powerSet(mods);
    for (let parent of base.set)
      if (!parent.modified.length)
        for (let config of configs)
          set.push(Modifier.get(parent, config));
    return tag;
  }
}
function sameArray(a, b2) {
  return a.length == b2.length && a.every((x3, i2) => x3 == b2[i2]);
}
function powerSet(array) {
  let sets = [[]];
  for (let i2 = 0; i2 < array.length; i2++) {
    for (let j2 = 0, e = sets.length; j2 < e; j2++) {
      sets.push(sets[j2].concat(array[i2]));
    }
  }
  return sets.sort((a, b2) => b2.length - a.length);
}
function styleTags(spec) {
  let byName = /* @__PURE__ */ Object.create(null);
  for (let prop in spec) {
    let tags2 = spec[prop];
    if (!Array.isArray(tags2))
      tags2 = [tags2];
    for (let part of prop.split(" "))
      if (part) {
        let pieces = [], mode = 2, rest = part;
        for (let pos = 0; ; ) {
          if (rest == "..." && pos > 0 && pos + 3 == part.length) {
            mode = 1;
            break;
          }
          let m2 = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(rest);
          if (!m2)
            throw new RangeError("Invalid path: " + part);
          pieces.push(m2[0] == "*" ? "" : m2[0][0] == '"' ? JSON.parse(m2[0]) : m2[0]);
          pos += m2[0].length;
          if (pos == part.length)
            break;
          let next = part[pos++];
          if (pos == part.length && next == "!") {
            mode = 0;
            break;
          }
          if (next != "/")
            throw new RangeError("Invalid path: " + part);
          rest = part.slice(pos);
        }
        let last = pieces.length - 1, inner = pieces[last];
        if (!inner)
          throw new RangeError("Invalid path: " + part);
        let rule = new Rule(tags2, mode, last > 0 ? pieces.slice(0, last) : null);
        byName[inner] = rule.sort(byName[inner]);
      }
  }
  return ruleNodeProp.add(byName);
}
const ruleNodeProp = new NodeProp({
  combine(a, b2) {
    let cur, root, take;
    while (a || b2) {
      if (!a || b2 && a.depth >= b2.depth) {
        take = b2;
        b2 = b2.next;
      } else {
        take = a;
        a = a.next;
      }
      if (cur && cur.mode == take.mode && !take.context && !cur.context)
        continue;
      let copy = new Rule(take.tags, take.mode, take.context);
      if (cur)
        cur.next = copy;
      else
        root = copy;
      cur = copy;
    }
    return root;
  }
});
class Rule {
  constructor(tags2, mode, context, next) {
    this.tags = tags2;
    this.mode = mode;
    this.context = context;
    this.next = next;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(other) {
    if (!other || other.depth < this.depth) {
      this.next = other;
      return this;
    }
    other.next = this.sort(other.next);
    return other;
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Rule.empty = new Rule([], 2, null);
function tagHighlighter(tags2, options) {
  let map2 = /* @__PURE__ */ Object.create(null);
  for (let style of tags2) {
    if (!Array.isArray(style.tag))
      map2[style.tag.id] = style.class;
    else
      for (let tag of style.tag)
        map2[tag.id] = style.class;
  }
  let { scope, all = null } = options || {};
  return {
    style: (tags3) => {
      let cls = all;
      for (let tag of tags3) {
        for (let sub of tag.set) {
          let tagClass = map2[sub.id];
          if (tagClass) {
            cls = cls ? cls + " " + tagClass : tagClass;
            break;
          }
        }
      }
      return cls;
    },
    scope
  };
}
function highlightTags(highlighters, tags2) {
  let result = null;
  for (let highlighter of highlighters) {
    let value = highlighter.style(tags2);
    if (value)
      result = result ? result + " " + value : value;
  }
  return result;
}
function highlightTree(tree, highlighter, putStyle, from = 0, to2 = tree.length) {
  let builder = new HighlightBuilder(from, Array.isArray(highlighter) ? highlighter : [highlighter], putStyle);
  builder.highlightRange(tree.cursor(), from, to2, "", builder.highlighters);
  builder.flush(to2);
}
function highlightCode(code2, tree, highlighter, putText, putBreak, from = 0, to2 = code2.length) {
  let pos = from;
  function writeTo(p, classes) {
    if (p <= pos)
      return;
    for (let text = code2.slice(pos, p), i2 = 0; ; ) {
      let nextBreak = text.indexOf("\n", i2);
      let upto = nextBreak < 0 ? text.length : nextBreak;
      if (upto > i2)
        putText(text.slice(i2, upto), classes);
      if (nextBreak < 0)
        break;
      putBreak();
      i2 = nextBreak + 1;
    }
    pos = p;
  }
  highlightTree(tree, highlighter, (from2, to3, classes) => {
    writeTo(from2, "");
    writeTo(to3, classes);
  }, from, to2);
  writeTo(to2, "");
}
class HighlightBuilder {
  constructor(at3, highlighters, span) {
    this.at = at3;
    this.highlighters = highlighters;
    this.span = span;
    this.class = "";
  }
  startSpan(at3, cls) {
    if (cls != this.class) {
      this.flush(at3);
      if (at3 > this.at)
        this.at = at3;
      this.class = cls;
    }
  }
  flush(to2) {
    if (to2 > this.at && this.class)
      this.span(this.at, to2, this.class);
  }
  highlightRange(cursor, from, to2, inheritedClass, highlighters) {
    let { type, from: start, to: end } = cursor;
    if (start >= to2 || end <= from)
      return;
    if (type.isTop)
      highlighters = this.highlighters.filter((h2) => !h2.scope || h2.scope(type));
    let cls = inheritedClass;
    let rule = getStyleTags(cursor) || Rule.empty;
    let tagCls = highlightTags(highlighters, rule.tags);
    if (tagCls) {
      if (cls)
        cls += " ";
      cls += tagCls;
      if (rule.mode == 1)
        inheritedClass += (inheritedClass ? " " : "") + tagCls;
    }
    this.startSpan(Math.max(from, start), cls);
    if (rule.opaque)
      return;
    let mounted = cursor.tree && cursor.tree.prop(NodeProp.mounted);
    if (mounted && mounted.overlay) {
      let inner = cursor.node.enter(mounted.overlay[0].from + start, 1);
      let innerHighlighters = this.highlighters.filter((h2) => !h2.scope || h2.scope(mounted.tree.type));
      let hasChild = cursor.firstChild();
      for (let i2 = 0, pos = start; ; i2++) {
        let next = i2 < mounted.overlay.length ? mounted.overlay[i2] : null;
        let nextPos = next ? next.from + start : end;
        let rangeFrom = Math.max(from, pos), rangeTo = Math.min(to2, nextPos);
        if (rangeFrom < rangeTo && hasChild) {
          while (cursor.from < rangeTo) {
            this.highlightRange(cursor, rangeFrom, rangeTo, inheritedClass, highlighters);
            this.startSpan(Math.min(rangeTo, cursor.to), cls);
            if (cursor.to >= nextPos || !cursor.nextSibling())
              break;
          }
        }
        if (!next || nextPos > to2)
          break;
        pos = next.to + start;
        if (pos > from) {
          this.highlightRange(inner.cursor(), Math.max(from, next.from + start), Math.min(to2, pos), "", innerHighlighters);
          this.startSpan(Math.min(to2, pos), cls);
        }
      }
      if (hasChild)
        cursor.parent();
    } else if (cursor.firstChild()) {
      if (mounted)
        inheritedClass = "";
      do {
        if (cursor.to <= from)
          continue;
        if (cursor.from >= to2)
          break;
        this.highlightRange(cursor, from, to2, inheritedClass, highlighters);
        this.startSpan(Math.min(to2, cursor.to), cls);
      } while (cursor.nextSibling());
      cursor.parent();
    }
  }
}
function getStyleTags(node) {
  let rule = node.type.prop(ruleNodeProp);
  while (rule && rule.context && !node.matchContext(rule.context))
    rule = rule.next;
  return rule || null;
}
const t = Tag.define;
const comment = t(), name = t(), typeName = t(name), propertyName = t(name), literal = t(), string = t(literal), number = t(literal), content = t(), heading = t(content), keyword = t(), operator = t(), punctuation = t(), bracket = t(punctuation), meta = t();
const tags = {
  /**
  A comment.
  */
  comment,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: t(comment),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: t(comment),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: t(comment),
  /**
  Any kind of identifier.
  */
  name,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: t(name),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: t(typeName),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: t(propertyName),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: t(name),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: t(name),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: t(name),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: t(name),
  /**
  A literal value.
  */
  literal,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: t(string),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: t(string),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: t(string),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: t(number),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: t(number),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: t(literal),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: t(literal),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: t(literal),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: t(literal),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: t(literal),
  /**
  A language keyword.
  */
  keyword,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: t(keyword),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: t(keyword),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: t(keyword),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: t(keyword),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: t(keyword),
  /**
  An operator.
  */
  operator,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: t(operator),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: t(operator),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: t(operator),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: t(operator),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: t(operator),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: t(operator),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: t(operator),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: t(operator),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: t(operator),
  /**
  Program or markup punctuation.
  */
  punctuation,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: t(punctuation),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: t(bracket),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: t(bracket),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: t(bracket),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: t(bracket),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: t(heading),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: t(heading),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: t(heading),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: t(heading),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: t(heading),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: t(heading),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: t(content),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: t(content),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: t(content),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: t(content),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: t(content),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: t(content),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: t(content),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: t(content),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: t(),
  /**
  Deleted text.
  */
  deleted: t(),
  /**
  Changed text.
  */
  changed: t(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: t(),
  /**
  Metadata or meta-instruction.
  */
  meta,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: t(meta),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: t(meta),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: t(meta),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Tag.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Tag.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Tag.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Tag.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Tag.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Tag.defineModifier("special")
};
for (let name2 in tags) {
  let val = tags[name2];
  if (val instanceof Tag)
    val.name = name2;
}
const classHighlighter = tagHighlighter([
  { tag: tags.link, class: "tok-link" },
  { tag: tags.heading, class: "tok-heading" },
  { tag: tags.emphasis, class: "tok-emphasis" },
  { tag: tags.strong, class: "tok-strong" },
  { tag: tags.keyword, class: "tok-keyword" },
  { tag: tags.atom, class: "tok-atom" },
  { tag: tags.bool, class: "tok-bool" },
  { tag: tags.url, class: "tok-url" },
  { tag: tags.labelName, class: "tok-labelName" },
  { tag: tags.inserted, class: "tok-inserted" },
  { tag: tags.deleted, class: "tok-deleted" },
  { tag: tags.literal, class: "tok-literal" },
  { tag: tags.string, class: "tok-string" },
  { tag: tags.number, class: "tok-number" },
  { tag: [tags.regexp, tags.escape, tags.special(tags.string)], class: "tok-string2" },
  { tag: tags.variableName, class: "tok-variableName" },
  { tag: tags.local(tags.variableName), class: "tok-variableName tok-local" },
  { tag: tags.definition(tags.variableName), class: "tok-variableName tok-definition" },
  { tag: tags.special(tags.variableName), class: "tok-variableName2" },
  { tag: tags.definition(tags.propertyName), class: "tok-propertyName tok-definition" },
  { tag: tags.typeName, class: "tok-typeName" },
  { tag: tags.namespace, class: "tok-namespace" },
  { tag: tags.className, class: "tok-className" },
  { tag: tags.macroName, class: "tok-macroName" },
  { tag: tags.propertyName, class: "tok-propertyName" },
  { tag: tags.operator, class: "tok-operator" },
  { tag: tags.comment, class: "tok-comment" },
  { tag: tags.meta, class: "tok-meta" },
  { tag: tags.invalid, class: "tok-invalid" },
  { tag: tags.punctuation, class: "tok-punctuation" }
]);
const Highlight = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Tag,
  classHighlighter,
  getStyleTags,
  highlightCode,
  highlightTree,
  styleTags,
  tagHighlighter,
  tags
}, Symbol.toStringTag, { value: "Module" }));
const StrudelLib = {
  core: Core,
  draw: Draw,
  webaudio: Webaudio,
  transpiler: Transpiler,
  mini: Mini,
  soundfonts: Soundfonts,
  nano: Nano,
  highlight: Highlight
};
export {
  StrudelLib
};
