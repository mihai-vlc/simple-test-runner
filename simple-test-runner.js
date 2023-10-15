const output = {
    /**
     *
     * @param {string} text
     */
    print: function (text) {
        process.stdout.write(text);
    },
    cyan: function (text) {
        output.print("\u001b[36m" + text + "\u001b[0m");
    },
    gray: function (text) {
        output.print("\u001b[39m" + text + "\u001b[0m");
    },
    red: function (text) {
        output.print("\u001b[31m" + text + "\u001b[0m");
    },
    green: function (text) {
        output.print("\u001b[32m" + text + "\u001b[0m");
    },
    yellow: function (text) {
        output.print("\u001b[33m" + text + "\u001b[0m");
    },
};

function Assertion(obj) {
    this.flags = {
        not: false,
    };
    this.obj = obj;

    Object.defineProperty(this, "not", {
        get: function () {
            this.flags.not = true;
            return this;
        }.bind(this),
    });
}

Assertion.prototype.assert = function (truth, _msg, error, expected) {
    var msg = this.flags.not ? error : _msg;
    var ok = this.flags.not ? !truth : truth;

    if (!ok) {
        var err = new Error(msg.call(this));
        if (arguments.length > 3) {
            err.actual = this.obj;
            err.expected = expected;
            err.showDiff = true;
        }
        throw err;
    }

    this.and = new Assertion(this.obj);
};

Assertion.prototype.toBeTruthy = function () {
    this.assert(
        !!this.obj,
        function () {
            return "expected " + i(this.obj) + " to be truthy";
        },
        function () {
            return "expected " + i(this.obj) + " to be falsy";
        }
    );
};
Assertion.prototype.toBeFalsy = function () {
    this.assert(
        !this.obj,
        function () {
            return "expected " + i(this.obj) + " to be falsy";
        },
        function () {
            return "expected " + i(this.obj) + " to be truthy";
        }
    );
};

Assertion.prototype.toBeNull = function () {
    this.assert(
        this.obj === null,
        function () {
            return "expected " + i(this.obj) + " to be null";
        },
        function () {
            return "expected " + i(this.obj) + " not to be null";
        }
    );
};

Assertion.prototype.toBeNaN = function () {
    this.assert(
        Number.isNaN(this.obj),
        function () {
            return "expected " + i(this.obj) + " to be NaN";
        },
        function () {
            return "expected " + i(this.obj) + " not to be NaN";
        }
    );
};

Assertion.prototype.toBeLessThan = function (obj) {
    ensureNumber(this.obj);
    ensureNumber(obj);

    this.assert(
        this.obj < obj,
        function () {
            return "expected " + i(this.obj) + " to be less than " + i(obj);
        },
        function () {
            return "expected " + i(this.obj) + " not to be less than " + i(obj);
        }
    );
};

Assertion.prototype.toBeLessThanOrEqual = function (obj) {
    ensureNumber(this.obj);
    ensureNumber(obj);

    this.assert(
        this.obj <= obj,
        function () {
            return "expected " + i(this.obj) + " to be less than " + i(obj);
        },
        function () {
            return "expected " + i(this.obj) + " not to be less than " + i(obj);
        }
    );
};

Assertion.prototype.toBeGreaterThan = function (obj) {
    ensureNumber(this.obj);
    ensureNumber(obj);

    this.assert(
        this.obj > obj,
        function () {
            return "expected " + i(this.obj) + " to be greater than " + i(obj);
        },
        function () {
            return (
                "expected " + i(this.obj) + " not to be greater than " + i(obj)
            );
        }
    );
};

Assertion.prototype.toBeGreaterThanOrEqual = function (obj) {
    ensureNumber(this.obj);
    ensureNumber(obj);

    this.assert(
        this.obj >= obj,
        function () {
            return (
                "expected " +
                i(this.obj) +
                " to be greater than or equal " +
                i(obj)
            );
        },
        function () {
            return (
                "expected " +
                i(this.obj) +
                " not to be greater than or equal " +
                i(obj)
            );
        }
    );
};

Assertion.prototype.toBeInstanceOf = function (obj) {
    this.assert(
        this.obj instanceof obj,
        function () {
            return (
                "expected " +
                i(getType(this.obj)) +
                " to be an instance of " +
                i(getType(obj))
            );
        },
        function () {
            return (
                "expected " +
                i(getType(this.obj)) +
                " not to be an instance of " +
                i(getType(obj))
            );
        }
    );
};

Assertion.prototype.toBe = Assertion.prototype.toStrictEqual = function (obj) {
    this.assert(
        obj === this.obj,
        function () {
            return "expected " + i(this.obj) + " to equal " + i(obj);
        },
        function () {
            return "expected " + i(this.obj) + " to not equal " + i(obj);
        }
    );
    return this;
};

Assertion.prototype.toBeUndefined = function (obj) {
    this.assert(
        obj === undefined,
        function () {
            return "expected " + i(this.obj) + " to be undefined";
        },
        function () {
            return "expected " + i(this.obj) + " to not to be undefined";
        }
    );
    return this;
};

Assertion.prototype.toBeDefined = function (obj) {
    this.assert(
        obj !== undefined,
        function () {
            return "expected " + i(this.obj) + " to be defined";
        },
        function () {
            return "expected " + i(this.obj) + " to not to be defined";
        }
    );
    return this;
};

/**
 *
 * @function
 * @param {any} obj
 * @returns {Assertion}
 */
function expect(obj) {
    return new Assertion(obj);
}

/**
 * Test suite
 * @typedef {Object} Test
 * @property {string} name
 * @property {testCallback} fn
 */

/**
 * Test suite
 * @typedef {Object} ExecutionContext
 * @property {expect} expect
 * @property {function(string)} log
 */

/**
 * This callback is used to define the test content
 * @callback testCallback
 * @param {ExecutionContext} t
 */

module.exports = function (headline) {
    /**
     * @type {Array<Test>}
     */
    const suite = [];
    /**
     * @type {Array<Test>}
     */
    const only = [];

    /**
     * @type {Array<testCallback>}
     */
    const before = [];

    /**
     * @type {Array<testCallback>}
     */
    const after = [];

    /**
     *
     * @param {string} name
     * @param {testCallback} fn
     */
    function self(name, fn) {
        suite.push({ name: name, fn: fn });
    }

    /**
     *
     * @param {string} name
     * @param {testCallback} fn
     */
    self.only = function (name, fn) {
        only.push({ name: name, fn: fn });
    };

    /**
     *
     * @param {string} name
     * @param {testCallback} fn
     */
    self.before = function (fn) {
        before.push(fn);
    };
    /**
     *
     * @param {string} name
     * @param {testCallback} fn
     */
    self.after = function (fn) {
        after.push(fn);
    };
    /**
     *
     * @param {string} name
     * @param {testCallback} fn
     */
    self.skip = function () {};

    self.run = function () {
        const tests = only[0] ? only : suite;

        output.cyan(headline + "\n");

        /**
         * @type {ExecutionContext}
         */

        let passedCount = 0;
        let failedCount = 0;

        for (const test of tests) {
            const context = Object.freeze({
                name: test.name,
                expect: expect,
                log: output.print,
            });
            try {
                for (const fn of before) {
                    fn(context);
                }

                test.fn(context);

                output.gray("• ");
                passedCount++;
            } catch (e) {
                output.red(`\n\n! ${test.name} \n\n`);
                prettyError(e);
                failedCount++;
            } finally {
                for (const fn of after) {
                    fn(context);
                }
            }
        }

        output.print(`\n`);

        if (passedCount > 0) {
            output.green("✓ " + passedCount + " passed ");
        }
        if (failedCount > 0) {
            output.red("✗ " + failedCount + " failed ");
        }
        output.print(`\n\n`);
    };

    return self;
};

function prettyError(e) {
    const msg = e.stack;
    if (!msg) {
        return output.yellow(e);
    }

    const i = msg.indexOf("\n");
    output.yellow(msg.slice(0, i));
    output.gray(msg.slice(i) + "\n\n");
}

/**
 * Inspects an object.
 */
function i(obj) {
    return obj;
}

// get the type of a value with handling the edge cases like `typeof []`
// and `typeof null`
function getType(value) {
    if (value === undefined) {
        return "undefined";
    } else if (value === null) {
        return "null";
    } else if (Array.isArray(value)) {
        return "array";
    } else if (typeof value === "boolean") {
        return "boolean";
    } else if (typeof value === "function") {
        return "function";
    } else if (typeof value === "number") {
        return "number";
    } else if (typeof value === "string") {
        return "string";
    } else if (typeof value === "bigint") {
        return "bigint";
    } else if (typeof value === "object") {
        if (value != null) {
            if (value.constructor === RegExp) {
                return "regexp";
            } else if (value.constructor === Map) {
                return "map";
            } else if (value.constructor === Set) {
                return "set";
            } else if (value.constructor === Date) {
                return "date";
            }
        }
        return "object";
    } else if (typeof value === "symbol") {
        return "symbol";
    }

    throw new Error(`value of unknown type: ${value}`);
}

function ensureNumber(obj) {
    if (typeof actual !== "number" && typeof actual !== "bigint") {
        throw new Error(i(obj) + " is not a number or bigint");
    }
}
