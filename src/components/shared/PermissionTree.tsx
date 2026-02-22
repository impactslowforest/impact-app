import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ChevronRight, ChevronDown, CheckSquare, Square,
    Globe, Building2, Settings
} from 'lucide-react';

export interface PermissionNode {
    key: string;
    label: string;
    icon?: any;
    children?: PermissionNode[];
}

interface PermissionTreeProps {
    selectedPermissions: string[];
    onPermissionToggle: (keys: string[]) => void; // Support multiple keys for cascading
    defaultExpandedKeys?: string[];
}

const ACTIONS = [
    { key: 'view', label: 'View', short: 'V' },
    { key: 'create', label: 'Add', short: 'A' },
    { key: 'edit', label: 'Edit', short: 'E' },
    { key: 'delete', label: 'Delete', short: 'D' },
];

export function PermissionTree({
    selectedPermissions,
    onPermissionToggle,
    defaultExpandedKeys = ['region', 'system']
}: PermissionTreeProps) {
    const { t } = useTranslation(['common', 'system', 'nav']);
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(defaultExpandedKeys));

    const permissionTree: PermissionNode[] = [
        {
            key: 'ghg',
            label: t('nav:ghg_sbti'),
            icon: Globe,
        },
        {
            key: 'eudr',
            label: t('nav:eudr_compliance'),
            icon: Globe,
        },
        {
            key: 'client_carbon',
            label: t('nav:client_carbon'),
            icon: Globe,
        },
        {
            key: 'region',
            label: t('nav:region'),
            icon: Globe,
            children: [
                {
                    key: 'certification',
                    label: t('nav:certification'),
                },
                {
                    key: 'impact',
                    label: t('nav:impact_implementation'),
                    children: [
                        { key: 'budget', label: t('nav:budget') },
                        { key: 'goals', label: t('nav:goals') },
                        { key: 'kpis', label: t('nav:kpis') },
                    ]
                },
            ]
        },
        {
            key: 'country_data',
            label: 'Country-Specific Data',
            icon: Building2,
            children: [
                { key: 'staff', label: t('nav:staff_info') },
                { key: 'cooperative', label: t('nav:cooperative_management') },
                { key: 'farm_op', label: t('nav:farm_operation') },
                { key: 'dnh', label: t('nav:do_no_harm') },
                { key: 'prices', label: 'Raw Material Prices' },
                { key: 'facilities', label: t('nav:slow_facilities') },
                { key: 'offices', label: t('nav:slow_offices') },
                { key: 'warehouse', label: t('nav:warehouse') },
                { key: 'inventory', label: t('nav:tree_inventory') },
            ]
        },
        {
            key: 'system',
            label: t('nav:system'),
            icon: Settings,
            children: [
                { key: 'settings', label: t('nav:settings') },
                { key: 'users', label: t('nav:user_management') },
                { key: 'roles', label: 'Roles & Permissions' },
                { key: 'system_config', label: 'System Configuration' },
            ]
        }
    ];

    const getAllKeys = (node: PermissionNode): string[] => {
        let keys = [node.key];
        if (node.children) {
            node.children.forEach(child => {
                keys = [...keys, ...getAllKeys(child)];
            });
        }
        return keys;
    };

    const handleActionToggle = (node: PermissionNode, action: string) => {
        const nodeKeys = getAllKeys(node);
        const permissionKeys = nodeKeys.map(k => `${action}_${k}`);

        // Determine if we are selecting or deselecting

        onPermissionToggle(permissionKeys);
    };

    const handlePreset = (type: 'view' | 'all' | 'none') => {
        let keys: string[] = [];
        const allBaseKeys: string[] = [];
        const traverse = (nodes: PermissionNode[]) => {
            nodes.forEach(n => {
                allBaseKeys.push(n.key);
                if (n.children) traverse(n.children);
            });
        };
        traverse(permissionTree);

        if (type === 'view') {
            keys = allBaseKeys.map(k => `view_${k}`);
        } else if (type === 'all') {
            ACTIONS.forEach(a => {
                allBaseKeys.forEach(k => keys.push(`${a.key}_${k}`));
            });
        }

        if (type === 'none') {
            onPermissionToggle([]); // Signal clear all via empty array
        } else {
            onPermissionToggle(keys);
        }
    };

    const toggleExpand = (key: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const renderNode = (node: PermissionNode, depth = 0) => {
        const isExpanded = expandedNodes.has(node.key);
        const hasChildren = node.children && node.children.length > 0;

        return (
            <div key={node.key} className="select-none">
                <div
                    className="group flex items-center py-1.5 px-3 border-b border-gray-50/50 hover:bg-gray-50/80 transition-colors"
                >
                    <div className="flex items-center gap-2 flex-1 min-w-0" style={{ paddingLeft: `${depth * 20}px` }}>
                        {hasChildren ? (
                            <div
                                className="p-1 cursor-pointer text-gray-400 hover:text-indigo-500 transition-colors"
                                onClick={() => toggleExpand(node.key)}
                            >
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </div>
                        ) : (
                            <div className="w-6" />
                        )}

                        <span className={`text-[13px] truncate ${depth === 0 ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                            {node.label}
                        </span>
                    </div>

                    {/* CRUD Columns */}
                    <div className="flex items-center gap-2 sm:gap-6 px-4">
                        {ACTIONS.map(action => {
                            const fullKey = `${action.key}_${node.key}`;
                            const isSelected = selectedPermissions.includes(fullKey);

                            // Check child status for partial indicators
                            const nodeKeys = getAllKeys(node);
                            const childKeysWithAction = nodeKeys.map(k => `${action.key}_${k}`);
                            const selectedChildCount = childKeysWithAction.filter(k => selectedPermissions.includes(k)).length;
                            const isPartial = hasChildren && selectedChildCount > 0 && selectedChildCount < childKeysWithAction.length;

                            return (
                                <div
                                    key={action.key}
                                    className="flex flex-col items-center justify-center w-8 group/action"
                                    title={`${action.label}: ${node.label}`}
                                    onClick={() => handleActionToggle(node, action.key)}
                                >
                                    <div className={`
                                        cursor-pointer rounded-md p-0.5 transition-all
                                        ${isSelected ? 'text-indigo-600' : 'text-gray-300 hover:text-gray-400'}
                                        ${isPartial ? 'bg-indigo-50/50' : ''}
                                    `}>
                                        {isSelected ? (
                                            <CheckSquare className="h-5 w-5" />
                                        ) : isPartial ? (
                                            <div className="h-5 w-5 flex items-center justify-center">
                                                <div className="w-3.5 h-3.5 bg-indigo-400/30 rounded-sm border border-indigo-400/50" />
                                            </div>
                                        ) : (
                                            <Square className="h-5 w-5" />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {hasChildren && isExpanded && (
                    <div className="mt-0">
                        {node.children!.map(child => renderNode(child, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="border border-gray-100 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden border-indigo-100/30">
            <div className="flex items-center bg-gray-50/80 px-4 py-2.5 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <div className="flex-1">Hạng mục hệ thống</div>
                <div className="flex items-center gap-2 sm:gap-6 px-4">
                    {ACTIONS.map(a => (
                        <div key={a.key} className="w-8 text-center" title={a.label}>{a.short}</div>
                    ))}
                </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-0.5">
                {permissionTree.map(node => renderNode(node))}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 p-3 bg-indigo-50/30 border-t border-gray-100 no-print">
                <div className="flex gap-2">
                    <button type="button" className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 px-2 py-1 rounded bg-white shadow-sm border border-indigo-100/50 transition-all hover:scale-105 active:scale-95" onClick={() => handlePreset('view')}>
                        Chế độ xem (V)
                    </button>
                    <button type="button" className="text-[10px] font-bold text-green-700 hover:text-green-900 px-2 py-1 rounded bg-white shadow-sm border border-green-100/50 transition-all hover:scale-105 active:scale-95" onClick={() => handlePreset('all')}>
                        Toàn quyền (V-A-E-D)
                    </button>
                    <button type="button" className="text-[10px] font-bold text-red-700 hover:text-red-900 px-2 py-1 rounded bg-white shadow-sm border border-red-100/50 transition-all hover:scale-105 active:scale-95" onClick={() => handlePreset('none')}>
                        Xoá hết
                    </button>
                </div>

                <div className="h-4 w-px bg-gray-200 self-center hidden sm:block" />

                <div className="flex gap-3">
                    <button type="button" className="text-[11px] font-semibold text-gray-600 hover:text-indigo-600" onClick={() => setExpandedNodes(new Set(['region', 'country_data', 'system']))}>
                        Mở rộng
                    </button>
                    <button type="button" className="text-[11px] font-semibold text-gray-600 hover:text-indigo-600" onClick={() => setExpandedNodes(new Set())}>
                        Thu gọn
                    </button>
                </div>

                <div className="ml-auto text-[10px] text-gray-400 font-medium self-center hidden lg:block">
                    V: View | A: Add | E: Edit | D: Delete
                </div>
            </div>
        </div>
    );
}
