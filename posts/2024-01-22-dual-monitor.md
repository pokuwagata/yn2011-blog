---
title: Mac でデュアルモニター環境を作った
date: 2024-01-22
public: true
---

# Mac でデュアルモニター環境を作った

![著者の作業デスクの画像](/images/posts/dual-monitor.jpg)

## 環境

- Macbook Pro
- macOS 12.7.2

## 今まで

外部ディスプレイ 1 つと Macbook の画面で作業していた。

業務のミーティングで、共有された画面をメインの外部ディスプレイに写し、Macbook の画面からブラウザを開いて共同作業をしたいときがある。23 インチの外部ディスプレイに対して、Macbook の画面が小さいので作業がやりにくかった。そこで、もう 1 つ外部ディスプレイを用意したいと考えた。

## 課題

調べてみると、デイジーチェーンという仕組みに対応しているディスプレイ同士は直接 HDMI ケーブル等で接続してデュアルモニターとして使えることが分かった。しかし、macOS はこの仕組みに対応していないので仮にデイジーチェーンに対応しているディスプレイを 2 台用意しても、MacBook と 1 つのディスプレイのミラーリングにしか使えないようだ。[^1]

## 解決策

[Anker 563](https://www.ankerjapan.com/products/a8386) というアダプターを利用して macOS でも 2 台の外部ディスプレイを利用したデュアルモニター環境を作ることができた。

Anker 563 に HDMI ケーブルを 2 本接続し、Silicon Motion ドライバをインストールすると macOS のディスプレイ設定から外部ディスプレイ 2 台と MacBook の 3 つのスクリーン設定が可能になる。

## DisplayPort to HDMI 変換ケーブルは使えない

 Anker 563 は DisplayPort to HDMI 変換ケーブルだとデュアルモニターとして認識しなかった。通常の HDMI ケーブルなら正常に認識した。

[^1]: [Displayport MST support](https://discussions.apple.com/thread/254942699?sortBy=best)
