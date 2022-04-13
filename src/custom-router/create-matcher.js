import createRouterMap from "./create-route-map"
import { createRoute } from "./history/base"

/*
 * 创建路由匹配
 * @param {*} routes 
 * 返回对路由数组处理
 * 创建路由映射关系
 * 增加路由等（权限）
 * param {*} pathList 路由path数组
 * param {*} pathMap 路由 url 路由信息对象的 映射. 路由信息对象也用来组成匹配记录数组。
 */ 

export default function createMatcher (routes) {
    const { pathList, pathMap } = createRouterMap(routes)

    /**
     * 由 history class 的 getCurrentRoute 方法提供
     * @param {*} location 路由字符串
     * @returns url 映射的路由信息，如果是匹配到有具体子组件，需要把有关的父组件也添加到映射关系中
     */
    function match(location) { // 匹配用户路径 
        // console.log('match location: ', location)
        let record = pathMap[location]
        return createRoute(record, {
            path: location
        })
    }

    function addRoutes (routes) { // 增加路由
        createRouterMap(routes, pathList, pathMap)
    }

    return {
        match,
        addRoutes
    }
}