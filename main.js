const test = require("./sfcc-test")("my-app");

test.before(function (t) {
    t.log(t.name + "   ");
});

test.after(function (t) {
    t.log("\n");
});

test("should calculate 2 + 2", function (t) {
    t.expect(2 + 2).toStrictEqual(4);
    t.expect(44).toStrictEqual(44);
    t.expect(44).toStrictEqual(44);
});

test("should calculate 2 + 3", function (t) {
    t.expect(2 + 3).toStrictEqual(5);
    t.expect(44).toStrictEqual(44);
});

test("should calculate 2 + 4", function (t) {
    t.expect(2 + 4).toStrictEqual(6);
    t.expect(44).toStrictEqual(44);
});

test("should calculate 2 + 5", function (t) {
    t.expect(2 + 5).toStrictEqual(7);
    t.expect(44).toStrictEqual(44);
});

test.run();
