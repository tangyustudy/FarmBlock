var md5Encode = function (data) {
    // for test/debug
    function fflog(msg) {
        try {
            console.log(msg);
        } catch (e) { }
    }

    // convert number to (unsigned) 32 bit hex, zero filled string
    function to_zerofilled_hex(n) {
        var t1 = (n >>> 24).toString(16);
        var t2 = (n & 0x00FFFFFF).toString(16);
        return "00".substr(0, 2 - t1.length) + t1 +
            "000000".substr(0, 6 - t2.length) + t2;
    }

    // convert array of chars to array of bytes (note: Unicode not supported)
    function chars_to_bytes(ac) {
        var retval = [];
        for (var i = 0; i < ac.length; i++) {
            retval = retval.concat(str_to_bytes(ac[i]));
        }
        return retval;
    }


    // convert a 64 bit unsigned number to array of bytes. Little endian
    function int64_to_bytes(num) {
        var retval = [];
        for (var i = 0; i < 8; i++) {
            retval.push(num & 0xFF);
            num = num >>> 8;
        }
        return retval;
    }

    //  32 bit left-rotation
    function rol(num, places) {
        return ((num << places) & 0xFFFFFFFF) | (num >>> (32 - places));
    }

    // The 4 MD5 functions
    function fF(b, c, d) {
        return (b & c) | (~b & d);
    }

    function fG(b, c, d) {
        return (d & b) | (~d & c);
    }

    function fH(b, c, d) {
        return b ^ c ^ d;
    }

    function fI(b, c, d) {
        return c ^ (b | ~d);
    }

    // pick 4 bytes at specified offset. Little-endian is assumed
    function bytes_to_int32(arr, off) {
        return (arr[off + 3] << 24) | (arr[off + 2] << 16) | (arr[off + 1] << 8) | (arr[off]);
    }

    /*
     Conver string to array of bytes in UTF-8 encoding
     See:
     http://www.dangrossman.info/2007/05/25/handling-utf-8-in-javascript-php-and-non-utf8-databases/
     http://stackoverflow.com/questions/1240408/reading-bytes-from-a-javascript-string
     How about a String.getBytes(<ENCODING>) for Javascript!? Isn't it time to add it?
     */
    function str_to_bytes(str) {
        // alert("got " + str.length + " chars")
        var retval = [];
        for (var i = 0; i < str.length; i++)
            if (str.charCodeAt(i) <= 0x7F) {
                retval.push(str.charCodeAt(i));
            } else {
                var tmp = encodeURIComponent(str.charAt(i)).substr(1).split('%');
                for (var j = 0; j < tmp.length; j++) {
                    retval.push(parseInt(tmp[j], 0x10));
                }
            }
        return retval;
    };




    // convert the 4 32-bit buffers to a 128 bit hex string. (Little-endian is assumed)
    function int128le_to_hex(a, b, c, d) {
        var ra = "";
        var t = 0;
        var ta = 0;
        for (var i = 3; i >= 0; i--) {
            ta = arguments[i];
            t = (ta & 0xFF);
            ta = ta >>> 8;
            t = t << 8;
            t = t | (ta & 0xFF);
            ta = ta >>> 8;
            t = t << 8;
            t = t | (ta & 0xFF);
            ta = ta >>> 8;
            t = t << 8;
            t = t | ta;
            ra = ra + to_zerofilled_hex(t);
        }
        return ra;
    }

    // check input data type and perform conversions if needed
    var databytes = null;
    // String
    if (typeof data == 'string') {
        // convert string to array bytes
        databytes = str_to_bytes(data);
    } else if (data.constructor == Array) {
        if (data.length === 0) {
            // if it's empty, just assume array of bytes
            databytes = data;
        } else if (typeof data[0] == 'string') {
            databytes = chars_to_bytes(data);
        } else if (typeof data[0] == 'number') {
            databytes = data;
        } else {
            fflog("input data type mismatch");
            return null;
        }
    } else {
        fflog("input data type mismatch");
        return null;
    }

    // save original length
    var org_len = databytes.length;

    // first append the "1" + 7x "0"
    databytes.push(0x80);

    // determine required amount of padding
    var tail = databytes.length % 64;
    // no room for msg length?
    if (tail > 56) {
        // pad to next 512 bit block
        for (var i = 0; i < (64 - tail); i++) {
            databytes.push(0x0);
        }
        tail = databytes.length % 64;
    }
    for (i = 0; i < (56 - tail); i++) {
        databytes.push(0x0);
    }
    // message length in bits mod 512 should now be 448
    // append 64 bit, little-endian original msg length (in *bits*!)
    databytes = databytes.concat(int64_to_bytes(org_len * 8));

    // initialize 4x32 bit state
    var h0 = 0x67452301;
    var h1 = 0xEFCDAB89;
    var h2 = 0x98BADCFE;
    var h3 = 0x10325476;

    // temp buffers
    var a = 0,
        b = 0,
        c = 0,
        d = 0;


    function _add(n1, n2) {
        return 0x0FFFFFFFF & (n1 + n2)
    }

    // function update partial state for each run
    var updateRun = function (nf, sin32, dw32, b32) {
        var temp = d;
        d = c;
        c = b;
        //b = b + rol(a + (nf + (sin32 + dw32)), b32);
        b = _add(b,
            rol(
                _add(a,
                    _add(nf, _add(sin32, dw32))
                ), b32
            )
        );
        a = temp;
    };


    // Digest message
    for (i = 0; i < databytes.length / 64; i++) {
        // initialize run
        a = h0;
        b = h1;
        c = h2;
        d = h3;

        var ptr = i * 64;

        // do 64 runs
        updateRun(fF(b, c, d), 0xd76aa478, bytes_to_int32(databytes, ptr), 7);
        updateRun(fF(b, c, d), 0xe8c7b756, bytes_to_int32(databytes, ptr + 4), 12);
        updateRun(fF(b, c, d), 0x242070db, bytes_to_int32(databytes, ptr + 8), 17);
        updateRun(fF(b, c, d), 0xc1bdceee, bytes_to_int32(databytes, ptr + 12), 22);
        updateRun(fF(b, c, d), 0xf57c0faf, bytes_to_int32(databytes, ptr + 16), 7);
        updateRun(fF(b, c, d), 0x4787c62a, bytes_to_int32(databytes, ptr + 20), 12);
        updateRun(fF(b, c, d), 0xa8304613, bytes_to_int32(databytes, ptr + 24), 17);
        updateRun(fF(b, c, d), 0xfd469501, bytes_to_int32(databytes, ptr + 28), 22);
        updateRun(fF(b, c, d), 0x698098d8, bytes_to_int32(databytes, ptr + 32), 7);
        updateRun(fF(b, c, d), 0x8b44f7af, bytes_to_int32(databytes, ptr + 36), 12);
        updateRun(fF(b, c, d), 0xffff5bb1, bytes_to_int32(databytes, ptr + 40), 17);
        updateRun(fF(b, c, d), 0x895cd7be, bytes_to_int32(databytes, ptr + 44), 22);
        updateRun(fF(b, c, d), 0x6b901122, bytes_to_int32(databytes, ptr + 48), 7);
        updateRun(fF(b, c, d), 0xfd987193, bytes_to_int32(databytes, ptr + 52), 12);
        updateRun(fF(b, c, d), 0xa679438e, bytes_to_int32(databytes, ptr + 56), 17);
        updateRun(fF(b, c, d), 0x49b40821, bytes_to_int32(databytes, ptr + 60), 22);
        updateRun(fG(b, c, d), 0xf61e2562, bytes_to_int32(databytes, ptr + 4), 5);
        updateRun(fG(b, c, d), 0xc040b340, bytes_to_int32(databytes, ptr + 24), 9);
        updateRun(fG(b, c, d), 0x265e5a51, bytes_to_int32(databytes, ptr + 44), 14);
        updateRun(fG(b, c, d), 0xe9b6c7aa, bytes_to_int32(databytes, ptr), 20);
        updateRun(fG(b, c, d), 0xd62f105d, bytes_to_int32(databytes, ptr + 20), 5);
        updateRun(fG(b, c, d), 0x2441453, bytes_to_int32(databytes, ptr + 40), 9);
        updateRun(fG(b, c, d), 0xd8a1e681, bytes_to_int32(databytes, ptr + 60), 14);
        updateRun(fG(b, c, d), 0xe7d3fbc8, bytes_to_int32(databytes, ptr + 16), 20);
        updateRun(fG(b, c, d), 0x21e1cde6, bytes_to_int32(databytes, ptr + 36), 5);
        updateRun(fG(b, c, d), 0xc33707d6, bytes_to_int32(databytes, ptr + 56), 9);
        updateRun(fG(b, c, d), 0xf4d50d87, bytes_to_int32(databytes, ptr + 12), 14);
        updateRun(fG(b, c, d), 0x455a14ed, bytes_to_int32(databytes, ptr + 32), 20);
        updateRun(fG(b, c, d), 0xa9e3e905, bytes_to_int32(databytes, ptr + 52), 5);
        updateRun(fG(b, c, d), 0xfcefa3f8, bytes_to_int32(databytes, ptr + 8), 9);
        updateRun(fG(b, c, d), 0x676f02d9, bytes_to_int32(databytes, ptr + 28), 14);
        updateRun(fG(b, c, d), 0x8d2a4c8a, bytes_to_int32(databytes, ptr + 48), 20);
        updateRun(fH(b, c, d), 0xfffa3942, bytes_to_int32(databytes, ptr + 20), 4);
        updateRun(fH(b, c, d), 0x8771f681, bytes_to_int32(databytes, ptr + 32), 11);
        updateRun(fH(b, c, d), 0x6d9d6122, bytes_to_int32(databytes, ptr + 44), 16);
        updateRun(fH(b, c, d), 0xfde5380c, bytes_to_int32(databytes, ptr + 56), 23);
        updateRun(fH(b, c, d), 0xa4beea44, bytes_to_int32(databytes, ptr + 4), 4);
        updateRun(fH(b, c, d), 0x4bdecfa9, bytes_to_int32(databytes, ptr + 16), 11);
        updateRun(fH(b, c, d), 0xf6bb4b60, bytes_to_int32(databytes, ptr + 28), 16);
        updateRun(fH(b, c, d), 0xbebfbc70, bytes_to_int32(databytes, ptr + 40), 23);
        updateRun(fH(b, c, d), 0x289b7ec6, bytes_to_int32(databytes, ptr + 52), 4);
        updateRun(fH(b, c, d), 0xeaa127fa, bytes_to_int32(databytes, ptr), 11);
        updateRun(fH(b, c, d), 0xd4ef3085, bytes_to_int32(databytes, ptr + 12), 16);
        updateRun(fH(b, c, d), 0x4881d05, bytes_to_int32(databytes, ptr + 24), 23);
        updateRun(fH(b, c, d), 0xd9d4d039, bytes_to_int32(databytes, ptr + 36), 4);
        updateRun(fH(b, c, d), 0xe6db99e5, bytes_to_int32(databytes, ptr + 48), 11);
        updateRun(fH(b, c, d), 0x1fa27cf8, bytes_to_int32(databytes, ptr + 60), 16);
        updateRun(fH(b, c, d), 0xc4ac5665, bytes_to_int32(databytes, ptr + 8), 23);
        updateRun(fI(b, c, d), 0xf4292244, bytes_to_int32(databytes, ptr), 6);
        updateRun(fI(b, c, d), 0x432aff97, bytes_to_int32(databytes, ptr + 28), 10);
        updateRun(fI(b, c, d), 0xab9423a7, bytes_to_int32(databytes, ptr + 56), 15);
        updateRun(fI(b, c, d), 0xfc93a039, bytes_to_int32(databytes, ptr + 20), 21);
        updateRun(fI(b, c, d), 0x655b59c3, bytes_to_int32(databytes, ptr + 48), 6);
        updateRun(fI(b, c, d), 0x8f0ccc92, bytes_to_int32(databytes, ptr + 12), 10);
        updateRun(fI(b, c, d), 0xffeff47d, bytes_to_int32(databytes, ptr + 40), 15);
        updateRun(fI(b, c, d), 0x85845dd1, bytes_to_int32(databytes, ptr + 4), 21);
        updateRun(fI(b, c, d), 0x6fa87e4f, bytes_to_int32(databytes, ptr + 32), 6);
        updateRun(fI(b, c, d), 0xfe2ce6e0, bytes_to_int32(databytes, ptr + 60), 10);
        updateRun(fI(b, c, d), 0xa3014314, bytes_to_int32(databytes, ptr + 24), 15);
        updateRun(fI(b, c, d), 0x4e0811a1, bytes_to_int32(databytes, ptr + 52), 21);
        updateRun(fI(b, c, d), 0xf7537e82, bytes_to_int32(databytes, ptr + 16), 6);
        updateRun(fI(b, c, d), 0xbd3af235, bytes_to_int32(databytes, ptr + 44), 10);
        updateRun(fI(b, c, d), 0x2ad7d2bb, bytes_to_int32(databytes, ptr + 8), 15);
        updateRun(fI(b, c, d), 0xeb86d391, bytes_to_int32(databytes, ptr + 36), 21);

        // update buffers
        h0 = _add(h0, a);
        h1 = _add(h1, b);
        h2 = _add(h2, c);
        h3 = _add(h3, d);
    }
    // Done! Convert buffers to 128 bit (LE)
    return int128le_to_hex(h3, h2, h1, h0).toUpperCase();
};


module.exports = {
    leaderboardName: "block_farm",
    key: "ffjoffrey100",

    sendGetRequest: function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status < 400)) {
                    if (!!callback) {
                        callback(xhr.responseText);
                    }
                } else {
                    if (!!callback) {
                        callback(null);
                    }
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },

    sendPostRequest: function (url, params, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (!!callback) {
                        callback(xhr.responseText);
                    }
                } else {
                    if (!!callback) {
                        callback(null);
                    }
                }
            }
        }
        xhr.send(params);
    },

    /*
     * type == 1, 三消排行
     * type == 2, 农场排行
     * 获取世界排行榜前50名的数据+团队成员排行榜， 成功返回json数据对象
     * 三消的：{"world": [{"uid":"", "name":"", "country":255, "level":10, "star":10}, ....], "team": [{"uid":"", "name":"", "country":255, "level":10, "star":10}, ....]}
     * 农场的：{"world": [{"uid":"", "name":"", "country":255, "fmlevel":10, "fmexp":10}, ....], "team": [{"uid":"", "name":"", "country":255, "fmlevel":10, "fmexp":10}, ....]}
     * 数据中，可以通过判断uid是否跟当前用户uid相等，找到自己的排名。世界榜中，如果没有找到，说明未上榜；
     */
    getLeaderBoardList: function (type, uid, callback) {
        var url = "https://open.puzzles-games.com/rank.php?type=" + type + "&leaderboard=" + this.leaderboardName + "&uid=" + uid;
        this.sendGetRequest(url, function (response) {
            if (response != null) {
                try {
                    var dataJson = JSON.parse(response);
                    if (dataJson.code == 0) {
                        if (!!callback) {
                            callback(dataJson.data);
                        }
                        return;
                    }
                } catch (e) { }
            }

            if (!!callback) {
                callback(null);
            }
        });
    },

    /*
     * 输入
     * 当type == 1时，表示更新数据；
     * 当type == 2时，表示更改名字，只能改一次；此时name必须有值，其他可以为空
     * params: {name:"newname", coin:0, level:255, star:0, lasttime:0(当前更新时间时间戳, 秒为单位，不能超过11位), data:"jsonstring"}
     * 
     * 
     * 返回
     * code == 0 登录成功，code !=0 失败，原因看msg提示
     * {code:0, msg:"", data:{}}
    **/
    updateData: function (type, uid, params, callback) {
        console.log(params, '363');
        let url = "https://open.puzzles-games.com/update.php";
        let extraParam = "";
        if (type == 1) {
            let enptData = md5Encode(params.data);
            let token = md5Encode(uid + params.level + this.leaderboardName + params.coin + params.star + this.key + "times" + params.lasttime + enptData).toLowerCase();
            extraParam = "&token=" + token + "&level=" + params.level + "&coin=" + params.coin + "&star=" + params.star + "&lasttime=" + params.lasttime + "&data=" + params.data;
        } else if (type == 2) {
            let name = encodeURIComponent(params.name);
            let token = md5Encode(uid + name + this.leaderboardName + this.key + "times").toLowerCase();
            extraParam = "&token=" + token + "&name=" + encodeURIComponent(name);
        }
        let param = "type=" + type + "&uid=" + uid + extraParam;

        this.sendPostRequest(url, param, function (response) {
            if (response != null) {
                try {
                    var dataJson = JSON.parse(response);
                    if (!!callback) {
                        callback(dataJson);
                    }
                    return;
                } catch (e) { }
            }

            if (!!callback) {
                callback(null);
            }
        });
    },

    /**
     * 
     * 获取好友帮助信息列表
     */
    getHelpMessage: function (uid,callback) {
        let url = "https://open.puzzles-games.com/get_help_list.php";
        let token = md5Encode(uid + this.leaderboardName + this.key + "times").toLowerCase();
        let param = "type=2&uid=" + uid + "&token=" + token;

        this.sendPostRequest(url, param, function (response) {
            if (response != null) {
                try {
                    var dataJson = JSON.parse(response);
                    if (!!callback) {
                        callback(dataJson);
                    }
                    return;
                } catch (e) { }
            }

            if (!!callback) {
                callback(null);
            }
        });
    },

    /*
     * 返回
     * code == 0 登录成功，code !=0 失败，原因看msg提示
     * {code:0, msg:"", data:{"full":0 是否可领取奖励, "inlist":0 是否在等待帮助列表里, "curtime":0 当前服务器时间, "list":[{"uid":id, "name":"U123", "country":255, "fmlevel":123, "helpcount":2, "self":0},...]}}
    **/
    getHelpList: function (uid,callback) {
        let url = "https://open.puzzles-games.com/get_help_list.php";
        let token = md5Encode(uid + this.leaderboardName + this.key + "times").toLowerCase();
        let param = "type=1&uid=" + uid + "&token=" + token;

        this.sendPostRequest(url, param, function (response) {
            if (response != null) {
                try {
                    var dataJson = JSON.parse(response);
                    if (!!callback) {
                        callback(dataJson);
                    }
                    return;
                } catch (e) { }
            }

            if (!!callback) {
                callback(null);
            }
        });
    },

    /*
     * 输入
     * 当type == 1时，表示更新常规数据；
     * 当type == 2时，表示更新好友互助记录
     * params: {coin:0, fmlevel:255, fmexp:0, fmlasttime:0(当前更新时间时间戳, 秒为单位，不能超过11位), fmdata:"jsonstring", (后面这些变量type为2时才需要)  helplist:"", "help":0 (0 默认，1 表示 领取了奖励，2表示发起了askhelp)}
     * helplist格式: [{"id":123, "time":123}, .....], 记得转换为jsonstring
     * 
     * 返回
     * code == 0 登录成功，code !=0 失败，原因看msg提示
     * {code:0, msg:"", data:{}}
    **/
    updateFarmData: function (type, uid, params, callback) {
        type += 2;
        let url = "https://open.puzzles-games.com/update.php";
        let enptData = md5Encode(params.fmdata);
        let token = uid + params.fmlevel + this.leaderboardName + params.coin + params.fmexp + this.key + "times" + params.fmlasttime + enptData;
        if (type == 4) {
            token += md5Encode(params.helplist) + params.help;
        }
        token = md5Encode(token).toLowerCase();
        let extraParam = "&token=" + token + "&fmlevel=" + params.fmlevel + '&coin=' + params.coin + "&fmexp=" + params.fmexp + "&fmlasttime=" + params.fmlasttime + "&fmdata=" + params.fmdata;
        if (type == 4) {
            extraParam += "&helplist=" + params.helplist + "&help=" + params.help;
        }
        let param = "type=" + type + "&uid=" + uid + extraParam;

        this.sendPostRequest(url, param, function (response) {
            if (response != null) {
                try {
                    var dataJson = JSON.parse(response);
                    if (!!callback) {
                        callback(dataJson);
                    }
                    return;
                } catch (e) { }
            }
            if (!!callback) {
                callback(null);
            }
        });
    },

    /*
     * 输入
     * 当type == 1时，表示正常登陆，lid可以留空；
     * 当type == 2时，表示关联facebook账号，lid必须赋值，其他参数可以为空；
     * 当type == 3时，表示登录农场，此时params可以为空
     * params: {lid:"", country:255, platform:"android"}
     * 
     * 
     * 返回
     * code == 0 登录成功，code !=0 失败，原因看msg提示
     * 三消登录结果：{code:0, msg:"", data:{"uid":"ididididididdid", "name":"U123", "country":255, "gid":123, "data":"jsonstring", "coin":0, "level":0, "star":0, "lasttime":0}}
     * 农场结果：{code:0, msg:"", data:{"uid":"ididididididdid", "name":"U123", "country":255, "gid":123, "fmdata":"jsonstring", "coin":0, "fmlevel":0, "fmexp":0, "fmlasttime":0, "curtime":0}}
     **/
    login: function (type, uid, params, callback) {
        let url = "https://open.puzzles-games.com/login.php";
        let extraParam = "";
        if (type == 1) {
            let token = md5Encode(uid + this.leaderboardName + this.key + "times").toLowerCase();
            extraParam = "&country=" + params.country + "&platform=" + params.platform + "&token=" + token;
        } else if (type == 2) {
            let token = md5Encode(uid + params.lid + this.leaderboardName + this.key + "times").toLowerCase();
            extraParam = "&token=" + token + "&lid=" + params.lid;
        } else if (type == 3) {
            let token = md5Encode(uid + this.leaderboardName + this.key + "times").toLowerCase();
            extraParam = "&token=" + token;
        }
        let param = "type=" + type + "&uid=" + uid + extraParam;

        this.sendPostRequest(url, param, function (response) {
            if (response != null) {
                try {
                    var dataJson = JSON.parse(response);
                    if (!!callback) {
                        callback(dataJson);
                    }
                    return;
                } catch (e) { }
            }

            if (!!callback) {
                callback(null);
            }
        });
    },
};
