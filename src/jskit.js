/*!
 * jskit.js v0.1
 *
 * Copyright 2013, arthur87
 * https://github.com/arthur87/JSKit
 * Dual licensed under the MIT.
 * http://www.opensource.org/licenses/mit-license.php
 */

var JSKit = (function() {
    function JSKit() {
        
    }
    
    /**
     * 連想配列をJSON形式に変換します。
     * @param values 連想配列
     * @return JSON形式
     */
    JSKit.json_encode = function(values) {
        var flag = true;
        var str = "{";
        for(var i in values) {
            if(!flag) str += ',';
            str += '"' + i.replace('"', '\\"', 'g') + '":';
            if(isNaN(values[i])) { // 文字列の場合
                str += '"' + values[i].replace('"', '\\"', 'g') + '"';			
            }else if(values[i] == "") { // 空のとき
                str += '""';
            }else { // 数字のとき
                str += values[i];
            }
            flag = false;
        }
        str += '}';
        return str;
    };
    
    /**
     * 指定したGETパラメータを取得します。
     * @params key 取得したいGETパラメータ
     * @params value GETパラメータが存在しないときに返す値
     * @return 
     */
    JSKit.getURLParams = function(key, value) {
        var query = window.location.search.substring(1);
        params = query.split('&');
        for(var i = 0; i < params.length; i++) {
            var position = params[i].indexOf('=');
            if(position > 0 && key == params[i].substring(0, position)) {
                return params[i].substring(position+1);
            }
        }
        return value;
    };
    
    /**
     * タッチイベントをサポートしているとき、trueを返します。
     * @return
     */
    JSKit.isSupportedTouchEvent = function() {
        return ('createTouch' in document) || ('ontouchstart' in document);
    };
    
    /**
     * iOSがイメージピッカーをサポートしているとき、trueを返します。
     *
     * @return
     */
    JSKit.isSupportedImagePicker = function() {
        var uas = { iphone: 'iphone os ' };
        var ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf(uas.iphone > 0)) {
        	// iOS 6以上のときtrueを返します。
            return (ua.substr(ua.indexOf(uas.iphone) + uas.iphone.length, 1) >= 6);
        }
        return true;
    };
    
    /**
     * 数値を指定した範囲の中に収めます。
     * xがa以上b以下のときxがそのまま返ります。またxがaより小さいときはb、bより大きいときはbが返ります。
     * @param x 計算対象の値です。
     * @param a 範囲の下限です。
     * @param b 範囲の上限です。
     * @return 計算結果
     */
    JSKit.constrain = function(x, a, b) {
        if(a <= x && x <= b) {
            return x;
        }
        return (a > x) ? a : b;
    };
    
    /**
     * 数値をある範囲から別の範囲に変換します。
     * @param x 変換したい数値です。
     * @param in_min 現在の範囲の下限です。
     * @param in_max 現在の範囲の上限です。
     * @param out_min 変換後の範囲の下限です。
     * @param out_max 変換後の範囲の上限です。
     * @return 計算結果
     */
    JSKit.map = function(x, in_min, in_max, out_min, out_max) {
        return Math.floor((x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
    };
    
    /**
     * 擬似乱数を生成します。
     * @param min 生成する乱数の上限です。
     * @param max 生成する乱数の下限です。
     * @return 計算結果
     */
    JSKit.mt_rand = function(max, min) {
        return Math.floor((max - min + 1) * Math.random() + min);
    };
    
    /**
     * 数値を指定した小数部の桁数で打ち切ります。
     * @param x 数値
     * @param y 小数部の桁数
     * @return 計算結果
     * 
     * <listing version="3.0">
     * JSKit.format(3.14159, 3); // 3.141
     * </listing>
     */
    JSKit.format = function(x, y) {
        return Math.floor(x * Math.pow(10, y)) / Math.pow(10, y);
    };

    /**
     * ランダムな文字列を生成します。
     * typeには、num、alpha、alnumが指定できます。
     * @params length 文字列長
     * @params type 文字列を構成する文字種
     */
    JSKit.random = function(length, type) {
        var alphas = 'abcdefghijklmnopqestuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var nums = '1234567890';
        var list = '';
        var result = '';
        
        if(type == 'num') {
            list = nums;
        }else if(type == 'alpha') {
            list = alphas;
        }else if(type == 'alnum') {
            list = alphas+nums;
        }else {
            return '';
        }
        for(var i = 0; i < length; i++) {
            result += list.substr(JSKit.mt_rand(0, list.length), 1); 
        }
        return result;
    };
    
    /**
     * UNIX時間を取得します。
     */
    JSKit.time = function() {
        return new Date/1000|0;
    };
    
    /**
     * Cookieの値を取得します。
     * http://www9.plala.or.jp/oyoyon/html/script/cookie.html
     * 
     * @param name 名前
     * @param value Cookieが存在しないときに返す値
     */
    JSKit.getCookie = function(name, value) {
        if (!name || !document.cookie) {
            return value;
        }
        var cookies = document.cookie.split("; ");
        for (var i = 0; i < cookies.length; i++) {
            var str = cookies[i].split("=");
            if (str[0] == name) { 
                return unescape(str[1]);
            }
        }
        return value;
    };

    /**
     * Cookieの値を設定します。
     * http://www9.plala.or.jp/oyoyon/html/script/cookie.html
     *
     * @param name 名前
     * @param value 値
     * @param domain 参照可能なドメインを指定します。0のとき発行したサーバ、1のとき発行したドメインを含むサーバ。
     * @param path 参照可能なパスを指定します。0のとき発行したディレクトリ、1のとき発行したページ。
     * @param expires 有効期限を日数で指定します。0を指定するとセッション中、-1を指定するとCookieを削除。
     * @param secure 1のときSSL通信時のCookieの暗号化を有効にします。
     */
    JSKit.setCookie = function(name, value, domain, path, expires, secure) {
        var str = name + "=" + escape(value);
        if (domain) {
            if (domain == 1) domain = location.hostname.replace(/^[^\.]*/, "");
             str += "; domain=" + domain;
        }
        if (path) {
            if (path == 1) path = location.pathname;
            str += "; path=" + path;
        }
        if (expires) {
            expires = new Date(new Date().getTime() + (60 * 60 * 24 * 1000 * expires));
            expires = expires.toGMTString();
            str += "; expires=" + expires;
        }
        if (secure && location.protocol == "https:") {
            str += "; secure";
        }
        
        document.cookie = str;    
    };
    
    return JSKit;
}());