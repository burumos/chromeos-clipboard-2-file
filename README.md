# chromeos側のクリップボードの内容をファイルに反映するツール

## セットアップ
1. ソース取得
```bash
cd ~/Downloads
git clone https://github.com/burumos/chromeos-clipboard-2-file.git
```

1. chrome extensionを追加  
[拡張機能管理ページ](chrome://extensions)の「パッケージされていない拡張機能を読み込む」から`~/Downloads/chromeos-clipboard-2-file/ex-src`を追加する

1. `.bashrc`に`node ~/Downloads/chrome-clipboard-2-file/server/server.js > /dev/null 2>&1 &`を追記する


## emacsとの連携
下記のコードをinit.elなどに追記して自動で読み込ませればOK

```elisp
(let ((file-path "~/Downloads/clipboard/server/clipboard.txt"))
  (defun yank-browser-clipboard ()
    "chrome os側のクリップボード内容からヤンク"
    (interactive)
    (insert (with-current-buffer (find-file-noselect file-path)
              (copy-region-as-kill (point-min) (point-max))
              (buffer-string))))

  (if (file-exists-p file-path)
      (let ((timer nil)
            (latest-content nil))
        (defun start-monitor-browser-clipboard ()
          "browserのクリップボードを監視、変更されたらemacsのクリップボードに追加する"
          (interactive)
          (setq timer
                (run-at-time
                 1 1 (lambda ()
                       (let  ((clipboard-buffer (find-file-noselect file-path)))
                         (with-current-buffer clipboard-buffer
                           (let ((clipboard-string (buffer-substring-no-properties (point-min) (point-max))))
                             (unless (or (equal clipboard-string (car kill-ring-yank-pointer))
                                         (equal clipboard-string latest-content))
                               (copy-region-as-kill (point-min) (point-max)))
                             (setq latest-content clipboard-string)
                             (kill-buffer clipboard-buffer))))))))

        (defun stop-monitor-browser-clipboard ()
          "クリップボードの監視を止める"
          (interactive)
          (if (timerp timer)
              (cancel-timer timer)))

        (start-monitor-browser-clipboard)
        )))
```

