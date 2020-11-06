export function ajaxSend(blockClass, loaderClass) {
  //находит все аякс блоки и следит за их изменением
  let form_blocks = document.querySelectorAll(blockClass);
  if (form_blocks.length) {
    Array.prototype.forEach.call(form_blocks, function (block) {
      formSelect(block);
      var mutationObserver = new MutationObserver(function() {
        formSelect(block);
      });
      mutationObserver.observe(block, {
        childList: true,
      });
    });
  }
  function formSelect(formBlock) {
    //находит форму и лоадер в блоке
      var form = formBlock.querySelector('form');
      var blockId = formBlock.getAttribute('id');
      if (form) {
          form.onsubmit = function(e) {
              e.preventDefault();
              if (loaderClass) {
                let loader = formBlock.querySelector(loaderClass);
                if (loader) {
                  loader.style.display = 'block';
                }
              }
              AJAXSubmit(form, blockId);
          }
      }
  }
  function AJAXSubmit (oFormElement, id) {
    //отправка формы
    if (!oFormElement.action) { return; }
    var oReq = new XMLHttpRequest();
    oReq.onloadstart = function() {
      oReq.responseType = 'document';
    }
    oReq.onload = ajaxSuccess;
    if (oFormElement.method.toLowerCase() === "post") {
      oReq.open("post", oFormElement.action || window.location.href, true);
      oReq.send(new FormData(oFormElement));
    } else {
      var oField, sFieldType, nFile, sSearch = "";
      for (var nItem = 0; nItem < oFormElement.elements.length; nItem++) {
        oField = oFormElement.elements[nItem];
        if (!oField.hasAttribute("name")) { continue; }
        sFieldType = oField.nodeName.toUpperCase() === "INPUT" ? oField.getAttribute("type").toUpperCase() : "TEXT";
        if (sFieldType === "FILE") {
          for (nFile = 0; nFile < oField.files.length; sSearch += "&" + escape(oField.name) + "=" + escape(oField.files[nFile++].name));
        } else if ((sFieldType !== "RADIO" && sFieldType !== "CHECKBOX") || oField.checked) {
          sSearch += "&" + escape(oField.name) + "=" + escape(oField.value);
        }
      }
      oReq.open("get", oFormElement.action.replace(/(?:\?.*)?$/, sSearch.replace(/^&/, "?")), true);
      oReq.send(null);
    }
    function ajaxSuccess () {
      //обновление блоков
      var currentURL = window.location.href;
      var responseURL = this.responseURL || this.response.URL;
      if (responseURL === currentURL) {
        let selectorString = blockClass;
        if (id) {
          selectorString = '#' + id + blockClass;
        }
        var responseBlock = this.response.documentElement.querySelector(selectorString);
        var changeBlock = document.querySelector(selectorString);
        changeBlock.innerHTML = responseBlock.innerHTML;
      }
      else {
        window.location.href = responseURL;
      }
    }
  }
}