define("typings/input", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("typings/output", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("store", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Store = void 0;
    var Store = (function () {
        function Store(entities) {
            var _this = this;
            this.sprints = {};
            this.sprintIds = [];
            this.commits = [];
            this.users = {};
            this.comments = [];
            this.issues = [];
            this.summaries = {};
            this.projects = [];
            this.commitsBySprint = {};
            this.commentsBySprint = {};
            this.summariesByCommit = {};
            entities.forEach(function (entity) {
                switch (entity.type) {
                    case 'Sprint':
                        _this.sprints[entity.id] = entity;
                        _this.sprintIds.push(entity.id);
                        break;
                    case 'Commit':
                        _this.commits.push(entity);
                        break;
                    case 'User':
                        _this.users[entity.id] = entity;
                        break;
                    case 'Comment':
                        _this.comments.push(entity);
                        break;
                    case 'Issue':
                        _this.issues.push(entity);
                        break;
                    case 'Summary':
                        _this.summaries[entity.id] = entity;
                        break;
                    case 'Project':
                        _this.projects.push(entity);
                        break;
                    default:
                        console.warn("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0442\u0438\u043F \u0432\u043E \u0432\u0445\u043E\u0434\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445: " + entity.type);
                }
            });
        }
        Store.prototype.getSprint = function (sprintId) {
            return this.sprints[sprintId] || null;
        };
        Store.prototype.getUser = function (userId) {
            return this.users[userId] || null;
        };
        Store.prototype.getSprintCommits = function (sprint) {
            if (!sprint)
                return [];
            if (this.commitsBySprint[sprint.id] === undefined) {
                this.commitsBySprint[sprint.id] = this.commits.filter(function (commit) { return (commit.timestamp >= sprint.startAt && commit.timestamp < sprint.finishAt); });
            }
            return this.commitsBySprint[sprint.id];
        };
        Store.prototype.getSprintComments = function (sprint) {
            if (this.commentsBySprint[sprint.id] === undefined) {
                this.commentsBySprint[sprint.id] = this.comments.filter(function (comment) { return (comment.createdAt >= sprint.startAt && comment.createdAt < sprint.finishAt); });
            }
            return this.commentsBySprint[sprint.id];
        };
        Store.prototype.getCommitSummaries = function (commit) {
            var _this = this;
            var results = [];
            commit.summaries.forEach(function (summaryOrId) {
                var summary = typeof summaryOrId === 'number' ? _this.summaries[summaryOrId] : summaryOrId;
                if (summary)
                    results.push(summary);
            });
            return results;
        };
        return Store;
    }());
    exports.Store = Store;
});
define("helpers/helpers", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCommitSizeCategories = exports.getCommitSizeInterval = exports.getCommitSize = exports.getDayOfWeek = exports.getUsers = exports.userFilter = exports.userVoteMapper = exports.userCommitsMapper = exports.commentReducer = exports.commitReducer = exports.numberDifferentText = exports.numberOfCommits = exports.declOfNum = void 0;
    function declOfNum(number, words) {
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
    }
    exports.declOfNum = declOfNum;
    function numberOfCommits(number) {
        return number + " " + declOfNum(Math.abs(number), ['коммит', 'коммита', 'коммитов']);
    }
    exports.numberOfCommits = numberOfCommits;
    function numberDifferentText(number) {
        if (number < 0) {
            return "-" + -number;
        }
        if (number === 0) {
            return number;
        }
        return "+" + number;
    }
    exports.numberDifferentText = numberDifferentText;
    function commitReducer(acc, commit) {
        var userId = typeof commit.author === 'number' ? commit.author : commit.author.id;
        if (!acc[userId]) {
            acc[userId] = 0;
        }
        acc[userId]++;
        return acc;
    }
    exports.commitReducer = commitReducer;
    function commentReducer(acc, comment) {
        var userId = typeof comment.author === 'number' ? comment.author : comment.author.id;
        if (!acc[userId]) {
            acc[userId] = 0;
        }
        acc[userId] += Number(comment.likes.length);
        return acc;
    }
    exports.commentReducer = commentReducer;
    function userCommitsMapper(store, record) {
        var userId = record[0], commitsCount = record[1];
        var user = store.getUser(Number(userId));
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            valueText: String(commitsCount),
        };
    }
    exports.userCommitsMapper = userCommitsMapper;
    function userVoteMapper(store, record) {
        var userId = record[0], commentsCount = record[1];
        var user = store.getUser(Number(userId));
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            valueText: commentsCount + " " + declOfNum(commentsCount, ['голос', 'голоса', 'голосов']),
        };
    }
    exports.userVoteMapper = userVoteMapper;
    function userFilter(user) {
        return Boolean(user);
    }
    exports.userFilter = userFilter;
    function getUsers(store, sprint) {
        var commits = store.getSprintCommits(sprint);
        var userCommitsCount = Object.entries(commits.reduce(commitReducer, {}));
        userCommitsCount.sort(function (a, b) { return b[1] - a[1]; });
        return userCommitsCount.map(userCommitsMapper.bind(null, store)).filter(userFilter);
    }
    exports.getUsers = getUsers;
    function getDayOfWeek(dayNumber) {
        var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        return days[dayNumber];
    }
    exports.getDayOfWeek = getDayOfWeek;
    function getCommitSize(store, commit) {
        var summariesByCommit = store.getCommitSummaries(commit);
        var size = 0;
        summariesByCommit.reduce(function (acc, summary) {
            size = size + summary.added + summary.removed;
            return acc;
        }, size);
        return size;
    }
    exports.getCommitSize = getCommitSize;
    function getCommitSizeInterval(size) {
        switch (true) {
            case size > 0 && size < 101:
                return 3;
            case size >= 101 && size < 501:
                return 2;
            case size >= 501 && size < 1001:
                return 1;
            default:
                return 0;
        }
    }
    exports.getCommitSizeInterval = getCommitSizeInterval;
    function getCommitSizeCategories(store, commits) {
        var result = [0, 0, 0, 0];
        Object.entries(commits).reduce(function (acc, _a) {
            var commit = _a[1];
            var commitSize = getCommitSize(store, commit);
            var resultPosition = getCommitSizeInterval(commitSize);
            acc[resultPosition]++;
            return acc;
        }, result);
        return result;
    }
    exports.getCommitSizeCategories = getCommitSizeCategories;
});
define("slides/leaders", ["require", "exports", "helpers/helpers"], function (require, exports, helpers_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareLeadersSlide = void 0;
    var SLIDE_ALIAS = 'leaders';
    var SLIDE_TITLE = 'Больше всего коммитов';
    var SLIDE_EMOJI = '👑';
    function prepareLeadersSlide(store, sprint) {
        return {
            alias: SLIDE_ALIAS,
            data: {
                title: SLIDE_TITLE,
                subtitle: sprint.name,
                emoji: SLIDE_EMOJI,
                users: helpers_1.getUsers(store, sprint),
            },
        };
    }
    exports.prepareLeadersSlide = prepareLeadersSlide;
});
define("slides/vote", ["require", "exports", "helpers/helpers"], function (require, exports, helpers_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareVoteSlide = void 0;
    var SLIDE_ALIAS = 'vote';
    var SLIDE_TITLE = 'Самый 🔎 внимательный разработчик';
    var SLIDE_EMOJI = '🔎';
    function prepareVoteSlide(store, sprint) {
        var comments = store.getSprintComments(sprint);
        var userLikeCommentsCount = Object.entries(comments.reduce(helpers_2.commentReducer, {}));
        userLikeCommentsCount.sort(function (a, b) { return b[1] - a[1]; });
        var commits = store.getSprintCommits(sprint);
        var users = commits.length
            ? userLikeCommentsCount.map(helpers_2.userVoteMapper.bind(null, store)).filter(helpers_2.userFilter) : [];
        return {
            alias: SLIDE_ALIAS,
            data: {
                title: SLIDE_TITLE,
                subtitle: sprint.name,
                emoji: SLIDE_EMOJI,
                users: users,
            },
        };
    }
    exports.prepareVoteSlide = prepareVoteSlide;
});
define("slides/chart", ["require", "exports", "helpers/helpers"], function (require, exports, helpers_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareChartSlide = void 0;
    var SLIDE_ALIAS = 'chart';
    var SLIDE_TITLE = 'Коммиты';
    function prepareChartSlide(store, sprint) {
        var commits = store.getSprintCommits(sprint);
        var values = commits.length ? Object.entries(store.sprints).map(function (_a) {
            var sprintItem = _a[1];
            return ({
                title: sprintItem.id.toString(),
                hint: sprintItem.name,
                value: store.getSprintCommits(sprintItem).length,
                active: sprintItem.id === sprint.id || undefined,
            });
        }) : [];
        return {
            alias: SLIDE_ALIAS,
            data: {
                title: SLIDE_TITLE,
                subtitle: sprint.name,
                values: values,
                users: helpers_3.getUsers(store, sprint),
            },
        };
    }
    exports.prepareChartSlide = prepareChartSlide;
});
define("slides/diagram", ["require", "exports", "helpers/helpers"], function (require, exports, helpers_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareDiagramSlide = void 0;
    var SLIDE_ALIAS = 'diagram';
    var SLIDE_TITLE = 'Размер коммитов';
    function prepareDiagramSlide(store, sprint) {
        var _a;
        var differenceText;
        var categories = [
            {
                title: '> 1001 строки',
                valueText: '0 коммитов',
                differenceText: '0 коммитов',
            },
            {
                title: '501 — 1000 строк',
                valueText: '0 коммитов',
                differenceText: '0 коммитов',
            },
            {
                title: '101 — 500 строк',
                valueText: '0 коммитов',
                differenceText: '0 коммитов',
            },
            {
                title: '1 — 100 строк',
                valueText: '0 коммитов',
                differenceText: '0 коммитов',
            },
        ];
        var commits = store.getSprintCommits(sprint);
        var sprintIds = store.sprintIds;
        sprintIds.sort(function (a, b) { return a - b; });
        var prevSprintId = (_a = sprintIds[sprintIds.indexOf(sprint.id) - 1]) !== null && _a !== void 0 ? _a : sprint.id;
        var prevSprint = store.getSprint(prevSprintId);
        var prevCommits = store.getSprintCommits(prevSprint);
        var totalText = "" + helpers_4.numberOfCommits(commits.length);
        differenceText = helpers_4.numberDifferentText(commits.length - prevCommits.length) + " \u0441 \u043F\u0440\u043E\u0448\u043B\u043E\u0433\u043E \u0441\u043F\u0440\u0438\u043D\u0442\u0430";
        var sizeCommitsCategories = helpers_4.getCommitSizeCategories(store, commits);
        var sizePrevCommitsCategories = helpers_4.getCommitSizeCategories(store, prevCommits);
        if (prevSprintId === sprintIds[0]) {
            differenceText = helpers_4.numberDifferentText(commits.length) + " \u0441 \u043F\u0440\u043E\u0448\u043B\u043E\u0433\u043E \u0441\u043F\u0440\u0438\u043D\u0442\u0430";
            sizePrevCommitsCategories = [0, 0, 0, 0];
        }
        for (var i = 0; i < categories.length; ++i) {
            var diffCount = sizeCommitsCategories[i] - sizePrevCommitsCategories[i];
            Object.assign(categories[i], {
                valueText: "" + helpers_4.numberOfCommits(sizeCommitsCategories[i]),
                differenceText: helpers_4.numberDifferentText(diffCount) + " " + helpers_4.declOfNum(Math.abs(diffCount), ['коммит', 'коммита', 'коммитов']),
            });
        }
        return {
            alias: SLIDE_ALIAS,
            data: {
                title: SLIDE_TITLE,
                subtitle: sprint.name,
                totalText: totalText,
                differenceText: differenceText,
                categories: categories,
            },
        };
    }
    exports.prepareDiagramSlide = prepareDiagramSlide;
});
define("slides/activity", ["require", "exports", "helpers/helpers"], function (require, exports, helpers_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareActivitySlide = void 0;
    var SLIDE_ALIAS = 'activity';
    var SLIDE_TITLE = 'Коммиты';
    function prepareActivitySlide(store, sprint) {
        var commits = store.getSprintCommits(sprint);
        var result = {
            mon: Array(24).fill(0),
            tue: Array(24).fill(0),
            wed: Array(24).fill(0),
            thu: Array(24).fill(0),
            fri: Array(24).fill(0),
            sat: Array(24).fill(0),
            sun: Array(24).fill(0),
        };
        Object.entries(commits).reduce(function (acc, _a) {
            var commit = _a[1];
            var date = new Date(commit.timestamp);
            var dayOfWeekCommit = helpers_5.getDayOfWeek(date.getDay());
            var hourCommit = date.getHours();
            acc[dayOfWeekCommit][hourCommit]++;
            return acc;
        }, result);
        return {
            alias: SLIDE_ALIAS,
            data: {
                title: SLIDE_TITLE,
                subtitle: sprint.name,
                data: result,
            },
        };
    }
    exports.prepareActivitySlide = prepareActivitySlide;
});
define("index", ["require", "exports", "store", "slides/leaders", "slides/vote", "slides/chart", "slides/diagram", "slides/activity"], function (require, exports, store_1, leaders_1, vote_1, chart_1, diagram_1, activity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareData = void 0;
    function prepareData(entities, options) {
        if (!Array.isArray(entities))
            return [];
        if (!options || !options.sprintId)
            return [];
        var store = new store_1.Store(entities);
        var sprint = store.getSprint(options.sprintId);
        if (!sprint) {
            return [
                {
                    alias: 'leaders',
                    data: {
                        title: '',
                        subtitle: '',
                        emoji: '',
                        users: [],
                    },
                },
                {
                    alias: 'vote',
                    data: {
                        title: '',
                        subtitle: '',
                        emoji: '',
                        users: [],
                    },
                },
                {
                    alias: 'chart',
                    data: {
                        title: '',
                        subtitle: '',
                        values: [],
                        users: [],
                    },
                },
                {
                    alias: 'diagram',
                    data: {
                        title: '',
                        subtitle: '',
                        totalText: '',
                        differenceText: '',
                        categories: [],
                    },
                },
                {
                    alias: 'activity',
                    data: {
                        title: '',
                        subtitle: '',
                        data: {
                            sun: [],
                            mon: [],
                            tue: [],
                            wed: [],
                            thu: [],
                            fri: [],
                            sat: [],
                        },
                    },
                },
            ];
        }
        return [
            leaders_1.prepareLeadersSlide(store, sprint),
            vote_1.prepareVoteSlide(store, sprint),
            chart_1.prepareChartSlide(store, sprint),
            diagram_1.prepareDiagramSlide(store, sprint),
            activity_1.prepareActivitySlide(store, sprint),
        ];
    }
    exports.prepareData = prepareData;
});
var modules;
function define(name, args, cb) {
    if (!modules) modules = {};

    // NodeJS
    if (typeof window === "undefined") {
        var moduleExports = {};
        var actualArgs = args.map(function(arg) {
            if (arg === "require") return require;
            if (arg === "exports") return moduleExports;
            return modules[arg];
        });

        cb.apply(null, actualArgs);

        modules[name] = moduleExports;

        // Main module
        if (name === "index") {
            module.exports = moduleExports;
        }
    }

    // Browser
    else {
        // Not implemented...
    }
}
