const test = require("./simple-test-runner")("my-app");

let startTime;
test.before(function (t) {
    startTime = new Date().getTime();
    t.log(t.name + "   ");
});

test.after(function (t) {
    const time = new Date().getTime() - startTime;
    t.log("  " + time + "ms \n");
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
