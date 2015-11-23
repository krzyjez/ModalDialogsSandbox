/**
 * Created by krzysztof on 2015-11-19.
 */
  angular.module("ssDialog",['ngDialog'])


    .config(function(ngDialogProvider) {

      // defaults
      ngDialogProvider.setDefaults({
        disableAnimation: true
      });

      // Ogólne utilsy - dodaje format do prototypu typu string
      // see: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
      // First, checks if it isn't implemented yet.
      if (!String.prototype.format) {
        String.prototype.format = function() {
          var args = arguments;
          return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
              ;
          });
        };
      }
    })


    .service("ssDialog", function(ngDialog, $log){
      var _infoColor = '#31B0D5';
      var _warningColor = '#EC971F';
      var _errorColor = '#C9302C';
      var _questionColor = '#449D44';

      //region Public members

      // main function to show modal dialog
      // parametry (dlg:object):
      // dlg {
      //   message: string - message, mandatory!
      //   buttons: string[] - buttons caption, if empty table or null close button will be added
      //   default: number - number of default button (0-based) if not definet, las button is default
      //   confirm: number - number of button which will confirm message if not specified default button confirms
      //                     message (if user clic on that button promise is returned othervise promise is rejected)
      //   iconGlyph: string - if set, icon will be displayed
      //   iconColor: string - color of icon, default: black
      //   className: string - name of css class to be used
      // }
      this.showDialog = function(p) {

        if (!angular.isString(p.message)) {
          $log.error("ssDialog: message is mandatory!")
        }

        // wyświetlamy close butoon jeśli nie ma buttonów
        var hasButtons = _hasButtons(p.buttons);

        var template = '<p>{0}</p>'.format(p.message);
        // glyph icon
        template = _addGlyphIcon(template, p.iconGlyph, p.iconColor);

        // dodajemy buttony
        if (hasButtons)
          template += _getButtonsTemplate(p.buttons, p.default, p.confirm);

        // surround with div
        template = '<div>{0}</div>'.format(template);

        // dialog class
        cssClass = (angular.isDefined(p.className)) ? p.className : ngDialog.getDefaults().className;

        // calling
        return ngDialog.openConfirm({
          template: template,
          plain: true,
          showClose: !hasButtons,
          className: cssClass
        })
      };

      this.info = function(message){
        return this.showDialog({
          message: message,
          buttons: ['ok'],
          iconGlyph: 'glyphicon-info-sign',
          iconColor: _infoColor
        })
      };

      this.ask = function(message ){
        return this.showDialog({
          message: message,
          buttons: ['tak','nie'],
          default: 0,
          confirm: 0,
          iconGlyph: 'glyphicon-question-sign',
          iconColor: _questionColor
        })
      };

      this.warning = function(message ){
        return this.showDialog({
          message: message,
          buttons: ['cancel','ok'],
          default: 0,
          confirm: 1,
          iconGlyph: 'glyphicon-warning-sign',
          iconColor: _warningColor
        })
      };

      this.ensure = function(message ){
        return this.showDialog({
          message: message,
          buttons: ['cancel','ok'],
          default: 1,
          confirm: 1,
          iconGlyph: 'glyphicon-question-sign',
          iconColor: _warningColor
        })
      };

      this.error = function(message){
        return this.showDialog({
          message: message,
          buttons: ['ok'],
          iconGlyph: 'glyphicon-alert',
          iconColor: _errorColor
        })
      };

      this.query = function(message){
      };

      //endregion Public


      //region Private region


      // sprawdza czy ma buttony w parametrze
      // parametr jest Button[]
      function _hasButtons(buttons){
        if (!angular.isArray(buttons))
          return false;
        return (buttons.length > 0);
      }

      // params   buttons: string[], default: number
      function _getButtonsTemplate(buttons, defaultIdx, confirmIdx){
        var template = "";
        // if not set otherwise - the last button is default
        if (!angular.isNumber(defaultIdx))
          defaultIdx = buttons.length -1;
        if (!angular.isNumber(confirmIdx))
          confirmIdx = defaultIdx;
        for (var i = buttons.length -1 ; i >= 0 ; i--) {
          var btnStyle = (i == defaultIdx) ? "btn-primary" : "btn-secondary";
          var closeMethod = (i == confirmIdx)  ? "confirm()" : "closeThisDialog()";
          template += '<button class="btn {1} pull-right" ng-click="{2}">{0}</button>'.format(buttons[i], btnStyle, closeMethod);
        }
        return  '<div class="ngdialog-buttons btn-toolbar ">{0}</div>'.format(template);
      }

      // Optacza template w kod uwzględniający icon
      // message - aktualny template z tekstem
      // glyphIcon - ikonka, która ma się wyświetlić
      // iconColor - w jakim kolorze ma być ikonka
      function _addGlyphIcon (message, glyphIcon, iconColor) {
        // jeśli niezdefiniowany to zwracam template bez zmian
        if (!angular.isString(glyphIcon))
          return message;
        var color = (angular.isDefined(iconColor)) ? iconColor : "black";

        var iconTpl = '<td style="vertical-align: top; padding-top: 3px;">'
                        +'<div class="glyphicon {0}" '
                             +'style="font-size: 40px; color: {1}">'
                        +'</div></td>';
        iconTpl = iconTpl.format(glyphIcon, color);
        var msgTpl = '<td style="padding-left:10px;">{0}</td>'.format(message);

        return '<table><tr>{0}{1}</tr></table>'.format(iconTpl, msgTpl);
      }
      //endregion


    });
