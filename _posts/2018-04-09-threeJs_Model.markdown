---
layout: post
title:  "Three.js使用模型规范"
date:   2018-05-29 12:00:00 +0800
categories: jekyll update
---
## Three.js两类常用模型模型
* 无动画模型格式为带mtl的obj文件，由3dmax导出
* 有动画模型格式为js文件，由3dmax导出，需要安装插件

## 无动画3dmax文件导出

* 如果导出模型带有材质贴图，必须导出带贴图的文件
* 3dmax导出带贴图的文件只能用max自带的贴图功能贴图，且贴图用到的图片名不能带中文，图片大小最好都PS改成像素512*512及2倍级别，如512*1024,1024*512,1024*1024等，第三方插件如VR材质贴图
* 导出步骤：

    * 在菜单栏中选择导出选项，从当前3ds Max场景中导出外部文件格式<br>
    ![pic1](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic1.jpg)
    * 在底部保存格式中选择OBJ文件格式<br>
    ![pic2](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic2.jpg)
    * 在跳出框中点选导出材质，如不点选此项，导出的是白模<br>
    ![pic3](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic3.jpg)
    * 添加设置材质路径，选择导出<br>
    ![pic4](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic4.jpg)

## 有动画3dmax文件导出
在使用中有任何问题，欢迎反馈给我，可以用以下联系方式跟我交流
OBJ导出来的仅仅是模型，MTL导出来的仅仅是材质，那么有动画的模型就不能导出成OBJ+MTL的格式了。我们需要导出为JS文件，这时候需要导出插件。

* 首先你的模型必须是一个整体，比如你的模型是熊猫吃竹子，如果你的熊猫和竹子要一块导出，那么你的熊猫和竹子必须是一个整体
* 贴图只能有一张，且贴图是png格式
* 给bone（骨骼）认真命名，js导出后你可能会发现骨骼有点偏移与错位，严格的命名有助于你在建模或者导出的时候进行修改，不过对开发来说这点会比较麻烦，这点也不是必须的。
* 模型的每一个点都必须赋予权重，如果发生破面行为，那么非常有可能是加了动作的模型却有的店没有权重
* 骨骼测试可用的有bone和CS骨骼，如果采用其他骨骼最好进行测试
* 导出的时候你的模型必须是一个Mesh，非常重要！这就意味着你不能导出一个可编辑多边形或者其他形式，在我们添加skin修改器的时候，先添加一个EditMesh修改器在我们的物体上，如果你已经是一个editable mesh，那这就不需要了。最好再使用Unwrap， UVW，中途出现warning点确定就好

## 文件导出帮助以及常见错误
* [cgdev](http://www.cgdev.net/json/download.php) 一个好用的3DMAX导出JS文件的插件
* 导出的时候选择模型就好，不要选择骨骼，如果把骨骼一起选择导出会出现如下错误<br>
![pic5](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic5.jpg)
* 添加一个XForm修改器于你的模型当你开始导出之前，他会重置你物件的位置，转向等等，将它变为初始那样，最小化在导出时可能遇到的问题<br>
![pic6](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic6.jpg)
* 如果发生错误，修复完毕后需要重新启动3dmax才能正常使用导出插件
* 可以先验证模型导出的数据量和点格式的正确与否再进行加载，一般导出文件的贴图地址会与你的地址不同，需要打开导出文件（如下图）修改贴图对应地址<br>
![pic7](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic7.jpg)<br>
![pic8](https://edisonzhang0401.github.io/CausulBlog/images/20180409/pic8.jpg)
* 加载过程中你有可能看不见模型，那么很有可能是你的模型过大或者过小，可以直接在代码中用scale函数进行调整测试
* 如果还有问题，建议在重复以上几点查看一遍

## 关于作者

```javascript
  var CausulBlog = {
    nickName  : "张小杰",
    info    : "欢迎关注我的博客，前端技术UP",
    site : "https://edisonzhang0401.github.io/CausulBlog"
  }
```
