export function ajaxSendjquery(blockClass, loaderClass) {
  $(blockClass).each(function(){
    let block = this;
    jquerySend(block);
    var mutationObserver = new MutationObserver(function() {
      jquerySend(block);
    });
    mutationObserver.observe(this, {
      childList: true,
    });
    function jquerySend(block) {
      let $block = $(block);
      let $blockid = $block.attr('id');
      let $loader = $block.find(loaderClass);
      let findString = blockClass;
      if ($blockid) {
        findString = '#' + $blockid + findString;
      }
      $loader.hide();
      let $form = $block.find('form');
      $form.submit(function(e){
        e.preventDefault();
        $loader.show();
        $.ajax({
          type: $(this).attr('method'),
          url: $(this).attr('action'),
          data: $(this).serialize(),
            success: function (data) {
              $loader.hide();
              let updateBlock = $(data).find(findString);
              $block.html(updateBlock.html());
              console.log('success');
            },
            error: function (data) {
              console.log('error');
            },
        });
      });
    }
  });
}