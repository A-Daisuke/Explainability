function __method_wrapper__() {
  $("#page_md_content img").click(function() {
    var img_url = $(this).attr("src");
    //如果不在iframe里，则直接当前窗口打开
    if (self == top) {
      var json = {
        "title": "", //相册标题
        "id": 123, //相册id
        "start": 0, //初始显示的图片序号，默认0
        "data": [ //相册包含的图片，数组格式
          {
            "alt": "",
            "pid": 666, //图片id
            "src": img_url, //原图地址
            "thumb": img_url //缩略图地址
          }
        ]
      }

      $.photos({
        photos: json,
        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
      });

    } else {
      //如果在iframe里，则直接传url给父窗口
      top.postMessage(img_url, '*');
    }

  });

}
