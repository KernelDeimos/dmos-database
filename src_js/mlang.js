module.exports = c => {
  var r = c.registry.package('rooibos.dmos.mlang');

  r.put('expr', 'literal', {
    args: [
      { name: 'Any', type: 'interface{}' }
    ],
    terminal: true,
    gocode: `
      return pred.Any;
    `
  });

  r.put('expr', 'true', {
    args: [],
    terminal: true,
    gocode: `
      return true;
    `
  });
  r.put('expr', 'false', {
    args: [],
    terminal: false,
    gocode: `
      return false;
    `
  });

  r.put('expr', 'get', {
    variadic: true,
    args: [
      { name: 'Keys', type: 'string' }
    ],
    terminal: true,
    goimports: [
      'strconv',
      'gopkg.in/mgo.v2/bson',
    ],
    gocode: `
      var value interface{}
      value = data
      for _, key := range pred.Keys {
        switch t := value.(type) {
          case map[string]interface{}:
            value = t[key]
      		case bson.M:
      			value = t[key]
          case []interface{}:
            i, _ := strconv.Atoi(key)
            value = t[i]
        }
      }

      return value;
    `
  });

  r.put('expr', 'seq', {
    variadic: true,
    args: [
      { name: 'Delegates', type: 'expr' }
    ],
    gocode: `
      var value interface{}
      value = data
      for _, p := range pred.Delegates {
        value = p.F(value)
      }
      return value;
    `
  });

  r.put('expr', 'eq', {
    variadic: true,
    args: [
      { name: 'Values', type: 'expr' }
    ],
    gocode: `
      v := pred.Values[0].F(data)
      for i := 1 ; i < len(pred.Values) ; i++ {
        v2 := pred.Values[i].F(data)

        if ( v == nil || v2 == nil ) && ( v != nil || v2 != nil ) {
          return false
        }

        if tV, ok := v.(int); ok {
          v = int64(tV)
        }
        if tV2, ok := v2.(int); ok {
          v = int64(tV2)
        }
        if _, ok := v.(float64); ok {
          if tV2, ok2 := v2.(int64); ok2 {
            v2 = float64(tV2)
          }
        }
        if _, ok := v2.(float64); ok {
          if tV, ok2 := v.(int64); ok2 {
            v = float64(tV)
          }
        }

        if ( v != v2 ) { return false }
        v = v2
      }
      return true
    `
  });

  r.put('expr', 'and', {
    variadic: true,
    args: [
      { name: 'Predicates', type: 'expr' }
    ],
    gocode: `
      for _, p := range pred.Predicates {
        if ! p.F(data).(bool) {
          return false
        }
      }
      return true
    `
  });

  r.put('expr', 'or', {
    variadic: true,
    args: [
      { name: 'Predicates', type: 'expr' }
    ],
    gocode: `
      for _, p := range pred.Predicates {
        if p.F(data).(bool) {
          return true
        }
      }
      return false
    `
  });
};
