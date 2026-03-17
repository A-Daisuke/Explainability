function __method_wrapper__() {
  result.addEventListener('mousemove', function(ev){
    var current = result.children[selectedIndex];
    if (current) current.classList.remove('selected');

    var li = ev.target;
    while (li) {
      if (li.nodeName === 'LI') break;
      li = li.parentElement;
    }

    if (li) {
      selectedIndex = Array.prototype.indexOf.call(result.children, li);
      li.classList.add('selected');
    }
  });

}
