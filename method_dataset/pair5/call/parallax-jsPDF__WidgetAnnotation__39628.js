            function WidgetAnnotation(params) {
              var _this2;

              _classCallCheck(this, WidgetAnnotation);

              _this2 = _possibleConstructorReturn(
                this,
                _getPrototypeOf(WidgetAnnotation).call(this, params)
              );
              var dict = params.dict;
              var data = _this2.data;
              data.annotationType = _util.AnnotationType.WIDGET;
              data.fieldName = _this2._constructFieldName(dict);
              data.fieldValue = (0, _core_utils.getInheritableProperty)({
                dict: dict,
                key: "V",
                getArray: true
              });
              data.alternativeText = (0, _util.stringToPDFString)(
                dict.get("TU") || ""
              );
              data.defaultAppearance =
                (0, _core_utils.getInheritableProperty)({
                  dict: dict,
                  key: "DA"
                }) || "";
              var fieldType = (0, _core_utils.getInheritableProperty)({
                dict: dict,
                key: "FT"
              });
              data.fieldType = (0, _primitives.isName)(fieldType)
                ? fieldType.name
                : null;
              _this2.fieldResources =
                (0, _core_utils.getInheritableProperty)({
                  dict: dict,
                  key: "DR"
                }) || _primitives.Dict.empty;
              data.fieldFlags = (0, _core_utils.getInheritableProperty)({
                dict: dict,
                key: "Ff"
              });

              if (!Number.isInteger(data.fieldFlags) || data.fieldFlags < 0) {
                data.fieldFlags = 0;
              }

              data.readOnly = _this2.hasFieldFlag(
                _util.AnnotationFieldFlag.READONLY
              );

              if (data.fieldType === "Sig") {
                data.fieldValue = null;

                _this2.setFlags(_util.AnnotationFlag.HIDDEN);
              }

              return _this2;
            }
