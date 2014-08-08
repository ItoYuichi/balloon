enchant();
window.onload = function() {
    var game = new Core(256, 224);
    game.preload('images/player.png', 'images/wave.png', 'images/start.png', 'images/gameover.png');
    game.fps = 15;
    game.scale = 2;
    game.onload = function() {
        var createStartScene = function() {
            var scene = new Scene();
            scene.backgroundColor = '#000000';
            var startImage = new Sprite(236, 48);
            startImage.image = game.assets['images/start.png'];
            startImage.x = 10;
            startImage.y = 88;
            scene.addChild(startImage);
            startImage.addEventListener(Event.TOUCH_START, function() {
                game.replaceScene(createGameScene());
            });
            return scene;
        };
        var createGameScene = function() {
            var map = new Map(16, 16);
            map.image = game.assets['images/wave.png'];
            map.loadData([
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1 ],
                [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ]
            ]);
            map.addEventListener(Event.ENTER_FRAME, function() {
                this.x--;
                if (this.x <= -this.tileWidth) {
                    this.x = 0;
                }
            });

            var scoreLabel = new ScoreLabel(120, 5);
            scoreLabel.scaleX = 0.5;
            scoreLabel.scaleY = 0.8;
            scoreLabel.addEventListener(Event.ENTER_FRAME, function() {
                this.score = game.frame;
            });

            var player = new Sprite(16, 24);
            player.image = game.assets['images/player.png'];
            player.x = 10;
            player.y = 10;
            player.vx = 0;
            player.vy = 2;
            player.frame = 1;
            player.direction = 1;   // 1:右向き -1:左向き
            player.scaleX *= -1;    // キャラクタを右向きに反転
            player.addEventListener(Event.ENTER_FRAME, function() {
                // Aボタン押下中は上方向へ加速度を追加しつつ羽ばたき動作
                if (game.input.a) {
                    this.frame = this.age % 2;
                    this.vy -= 2;
                }
                else {
                    this.frame = 1;
                }
                // 左押下時は左方向へ加速度を追加しつつ左向きに
                if (game.input.left || game.input.analogX < 0) {
                    this.direction = -1;
                    this.vx--;
                }
                // 右押下時は右方向へ加速度を追加しつつ右向きに
                else if (game.input.right || game.input.analogX > 0) {
                    this.direction = 1;
                    this.vx++;
                }
                if (game.input.analogX / 4)
                // 「現在左向き(scaleX > 0)で右押下(direction > 0)」もしくは
                // 「現在右向き(scaleX < 0)で左押下(direction < 0)」のとき
                // キャラクタの向きを反転
                if (this.scaleX * this.direction > 0) {
                    this.scaleX *= -1;
                }
                // 現在位置に加速度を加算
                this.x += this.vx;
                this.y += this.vy;
                // 画面左端処理(跳ね返り時加速度半減)
                if (this.x < 0) {
                    this.x = 0;
                    this.vx /= 2;
                    this.vx *= -1;
                }
                // 画面右端処理(跳ね返り時加速度半減)
                if (this.x > game.width - this.width) {
                    this.x = game.width - this.width;
                    this.vx /= 2;
                    this.vx *= -1;
                }
                // 画面上端処理(跳ね返り時加速度半減)
                if (this.y < 0) {
                    this.y = 0;
                    this.vy /= 2;
                    this.vy *= -1;
                }
                // 画面下端処理
                if (this.y > 240 - this.height) {
                    game.replaceScene(createGameOverScene());
                }
                // 毎フレーム下方向への加速度を追加
                this.vy++;
            });

            var scene = new Scene();
            scene.backgroundColor = '#000000';
            scene.addChild(player);
            scene.addChild(scoreLabel);
            scene.addChild(map);

            scene.addEventListener(Event.TOUCH_START, function() {
                game.input.a = true;
            });
            scene.addEventListener(Event.TOUCH_END, function() {
                game.input.a = false;
            });
            return scene;
        };

        var createGameOverScene = function() {
            var scene = new Scene();
            scene.backgroundColor = '#000000';
            var gameoverImage = new Sprite(189, 97);
            gameoverImage.image = game.assets['images/gameover.png'];
            gameoverImage.x = 33;
            gameoverImage.y = 63;
            scene.addChild(gameoverImage);
            gameoverImage.addEventListener(Event.TOUCH_START, function() {
                game.replaceScene(createStartScene());
            });
            return scene;
        };

        game.keybind(32, "a"); // Aボタンとしてスペースキー(32)を設定
        game.pushScene(createStartScene());
    }
    // 傾きセンサーを設定
    window.addEventListener("deviceorientation", function(evt) {
        var x = evt.gamma; // 横方向の傾斜角度
        game.input.analogX = x;
    }, false);
    game.start();
}
