import type { GroupSchemeName, Scheme } from "./declares";
import groupColors from "./Mocks/groupColors";


// 非时间种子的随机数
export const uuid = () => {
    const tempUrl = URL.createObjectURL(new Blob());
    const tempId = tempUrl.toString()
    URL.revokeObjectURL(tempUrl)
    return tempId.substring(tempId.lastIndexOf("/") + 1)
}

export const groupSchemeList = (groupSchemeNames: GroupSchemeName[], schemeList: Scheme[]): Record<string, Scheme[]> => {
    const schemeListMap = schemeList.reduce((acc: Record<string, Scheme>, cur: Scheme) => {
        acc[cur.schemeName] = cur;
        return acc;
    }, {});
    const ret: Record<string, Scheme[]> = {};
    for (let groupSchemeName of groupSchemeNames) {
        if (!ret[groupSchemeName.groupName]) {
            ret[groupSchemeName.groupName] = [];
        }
        for (let schemeName of groupSchemeName.schemeNames) {
            ret[groupSchemeName.groupName].push(schemeListMap[schemeName]);
        }
    }
    return ret;
}

export const groupedSchemeListToGroupSchemeNames = (groupedSchemeList: Record<string, Scheme[]>): GroupSchemeName[] => {
    return Object.keys(groupedSchemeList).map(key => {
        return {
            groupName: key,
            hidden: false,
            schemeNames: groupedSchemeList[key].map(scheme => scheme.schemeName)
        }
    });
}


export const deepClone = <T>(obj: T): T => {
    if (obj === null) return null as unknown as T;
    if (typeof obj !== 'object') return obj;

    let clone: any = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            clone[key] = deepClone(obj[key]);
        }
    }

    return clone;
}

export const deepEqual = (a: any, b: any): boolean => {
    // 如果两者都是对象或者数组，进行深度比较
    if (typeof a === 'object' && typeof b === 'object') {
        if (Array.isArray(a) !== Array.isArray(b)) {
            return false;
        }
        if (a === null || b === null) {
            return a === b;
        }
        if (a.prototype !== b.prototype) {
            return false;
        }

        let keysA = Object.keys(a);
        let keysB = Object.keys(b);

        if (keysA.length !== keysB.length) {
            return false;
        }

        for (let key of keysA) {
            if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
                return false;
            }
        }

        return true;
    } else {
        // 如果不是对象或数组，直接比较值
        return a === b;
    }
}


export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number = 100): T => {
    let timerId: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn(...args);
        }, delay);
    }) as T;
}

export const throttle = <T extends (...args: any[]) => any>(fn: T, delay: number = 100): T => {
    let timerId: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            fn(...args);
        }, delay);
    }) as T;
}

export const getGroupColor = (groupName: string): string => {
    // 计算hash值
    let sum = 0;
    for (let i = 0; i < groupName.length; i++) {
        sum += groupName.charCodeAt(i);
    }
    return groupColors[sum % groupColors.length];
}

export const getAncestorBySelector = (element: HTMLElement, selector: string): HTMLElement => {
    // 从当前元素开始向上遍历DOM树
    let ancestor = element;
    while (ancestor !== null) {
        // 检查当前元素是否匹配选择器
        if (ancestor.matches(selector)) {
            return ancestor; // 返回匹配的祖先元素
        }
        ancestor = ancestor.parentElement; // 移动到父元素
    }
    // 如果没有找到匹配的祖先元素，则返回null
    return null;
}