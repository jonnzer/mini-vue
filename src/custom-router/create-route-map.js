/**
 * （1）添加所有路由映射，包括子级路由
 * （2）可添加单个路由
 * @returns 
 */
function addRouteRecord (route, pathList, pathMap, parentRecord) {
    route.parent = parentRecord
    let record = { // 标记当下的路由信息，便于子节点找寻路径
        path: parentRecord ? `${parentRecord.path}/${route.path}` :route.path,
        component: route.component
    }
    let { path } = record
    if (!pathMap[path]) { // add
        pathList.push(path)
        pathMap[path] = route // url => route info 而不是 component
    }
    if (route.children) { // children
        route.children.forEach(r => {
            r.parent = record
            addRouteRecord(r, pathList, pathMap, record)
        })
    }
}

/**
 * 
 * @param {*} routes 路由列表配置 types：array
 * @param {*} oldList 旧路由path数组
 * @param {*} oldMap 旧路由 url 路由信息对象的 映射
 * @returns 
 */
export default function createRouterMap (routes, oldList, oldMap) {
    let pathList = oldList || [] // eg: ['/a', '/b', '/a/c', '/a/d', '/b/c']
    let pathMap = oldMap || {} // eg: { url: component, url1: component1, ... }

    routes.forEach(route => {
        addRouteRecord(route, pathList, pathMap)
    })
    // eg：add route
    // addRouteRecord(
    //     {
    //         path: '/test',
    //         component: null
    //     }
    // , pathList, pathMap)

    return {
        pathList,
        pathMap
    }
}