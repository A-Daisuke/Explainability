        const pushTreeData = (OneData, parent_cat_id, level, i) => {
          treeData2.push({
            cat_id: OneData.cat_id || 0,
            cat_name: OneData.title || '',
            page_id: OneData.page_id || 0,
            parent_cat_id: parent_cat_id || 0,
            page_cat_id: parent_cat_id || 0,
            level,
            s_number: i + 1
          })
          if (OneData.hasOwnProperty('children')) {
            for (let j = 0; j < OneData.children.length; j++) {
              pushTreeData(OneData.children[j], OneData.cat_id, level + 1, j)
            }
          }
        }
