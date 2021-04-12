export class DegreeMath {
  static toRadians(d: number) { return (d * Math.PI) / 180.0; }
  static toDegree(r: number) { return (r * 180.0) / Math.PI; }

  static sin(d: number) { return Math.sin(DegreeMath.toRadians(d)); }
  static cos(d: number) { return Math.cos(DegreeMath.toRadians(d)); }
  static tan(d: number) { return Math.tan(DegreeMath.toRadians(d)); }

  static arcsin(d: number) { return DegreeMath.toDegree(Math.asin(d)); }
  static arccos(d: number) { return DegreeMath.toDegree(Math.acos(d)); }
  static arctan(d: number) { return DegreeMath.toDegree(Math.atan(d)); }

  static arccot(x: number) { return DegreeMath.toDegree(Math.atan(1 / x)); }
  static arctan2(y: number, x: number) { return DegreeMath.toDegree(Math.atan2(y, x)); }

  static fixAngle(a: number) { return DegreeMath.fix(a, 360); }
  static fixHour(a: number) { return DegreeMath.fix(a, 24); }

  static fix(a: number, b: number) {
    a = a - b * (Math.floor(a / b));
    return (a < 0) ? a + b : a;
  }
}
