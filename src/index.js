const express = require('express'); // NodeをWebサーバーとして機能させるのに必要。これでWeb APIを作る。
const app = express(); // 決まり文句みたいなもの。（全く別のAPI群を作りたいときには、別の変数にexpress()を代入すればよい）
const fetch = require('node-fetch'); // これでfetchが使えるようになって別鯖のAPIを叩けるようになる

const port = 8080;
app.listen(port); // 8080番ポートで待ち受け開始
console.log(`Server listening on ${port}`); // ただのログ出力

// 例1：/ でGETリクエストが来たとき、{test: "test"}というjsonを返す。
app.get("/", function (req, res, next) {
    res.json({test: "test"});
});

// 例2：/0001001 でGETリクエストが来たとき、そのidを読み取って、
// "testId"に値としてセットして返す。
// つまり、リクエスト時に値を受けとっている。そしてそのまま返している。
app.get("/:id", function (req, res, next) {
    res.json({ testId: req.params.id });
});

// 例3: /postcode/7830060 でGETリクエストが来た時、この郵便番号7桁を受け取って、
// 別サーバーで公開されているAPIに受け渡す。そしてその結果を、
// リクエストしてきたクライアントにレスポンスとしてまるっと返している。
app.get("/postcode/:postcode", function (req, res, next) {
    const postcode = req.params.postcode;
    console.log(postcode); // ただのログ出力
    const url = "http://zipcloud.ibsnet.co.jp/api/search?zipcode=" + postcode;
    // fetchで別鯖にぶん投げる。その結果はPromiseで返ってくる。Promiseオブジェクトはめっちゃ大事。。
    // Promiseは非同期処理を同期的に書くためにある。このPromiseが無かった少し前の時代は、
    // コールバックで同期処理を保証しなければならなかった……。そして地獄のコールバックピラミッドができあがる。
    // 返ってきたPromiseオブジェクトに対しては、.thenでその後の処理を記述できる。
    fetch(url) 
        .then(data => data.json()) // ここでレスポンスをjson化している
        .then(data => res.json(data)); // jsonをクライアントにまるっと返す。
});

// 例4: 画像を返す。 
// 上のとやっていることはさして変わらないが、画像を返す。
app.get("/yolp/:arg", function (req, res, next) {
    const arg = req.params.arg; // 受け取った、なにかしらの引数。これは例なので適当に書いてる。処理には一切反映されない。
    const yahooAppId = "dj00aiZpPTVWT2pKb2xuWG5CbyZzPWNvbnN1bWVyc2VjcmV0Jng9YmI-"; // Yahooで登録してIDを取得しないといけない。それをここに書く。
    const lat = "35.665843055555555"; // 緯度べた書き。
    const lon = "139.7309136111111"; // 経度べた書き。
    // 他のパラメータは面倒なので以下省略。
    const url = "https://map.yahooapis.jp/map/V1/static?appid=" + yahooAppId + "&lat=" + lat + "&lon=" + lon + "&z=11&width=300&height=200&mode=map&overlay=type:rainfall|date:201209011100|datelabel:on&output=jpeg"

    fetch(url)
        // 結果は画像のバイナリデータとして返ってくる。
        .then(data => data.buffer()) // ここでBuffer型オブジェクトにする。※これはブラウザであるようなfetchではなくnode-fetchだけの拡張機能。
        .then(data => {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // レスポンスとしてjpeg送るぞ！という情報をセット
            res.write(data); // レスポンスに値書き込む。
            res.send(); // レスポンス送る
        })
        .catch(err => console.error(err)); // Promiseのチェーンでエラーが起きたときにそれをログとして吐き出している。
});
