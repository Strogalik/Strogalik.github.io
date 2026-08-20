import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Overlay } from '../components/Overlay';
import { PageHeader } from '../components/PageHeader';
import { SimpleStatusPill } from '../components/StatusPill';
import { useAdminRoles } from '../api/queries';

export function AdminRolesPage(){
  const data=useAdminRoles().data??[];
  const [newOpen,setNewOpen]=useState(false);
  const [matrixRole,setMatrixRole]=useState<(typeof data)[number]|null>(null);
  return <div className="page"><PageHeader kicker="RBAC" title="Роли и права" description="Права группируются по рабочей роли, а scope ограничивает видимость организацией, филиалом или объектом." actions={<button type="button" className="btn btn--primary" onClick={()=>setNewOpen(true)}><Icon name="plus"/>Новая роль</button>}/>
    <section className="role-grid">{data.map(role=><article className="panel role-card" key={role.id}><div className="role-card__head"><div className="role-card__icon"><Icon name="shield"/></div><div><span>{role.users} польз.</span><h2>{role.name}</h2></div><SimpleStatusPill label={role.status==='system'?'Системная':'Своя'} tone={role.status==='system'?'info':'soft'}/></div><p>{role.description}</p><div className="role-card__scope"><b>Scope</b><span>{role.scope}</span></div><div className="permission-chips">{role.permissions.map(p=><span key={p}>{p}</span>)}</div><button type="button" className="btn btn--ghost" onClick={()=>setMatrixRole(role)}>Открыть матрицу</button></article>)}</section>
    <Overlay open={newOpen} onClose={()=>setNewOpen(false)} title="Новая роль" description="Создайте роль с минимально необходимыми правами. Backend остаётся источником истины для RBAC." kicker="RBAC" presentation="sheet" footer={<><button type="button" className="btn btn--ghost" onClick={()=>setNewOpen(false)}>Отмена</button><button type="button" className="btn btn--primary" onClick={()=>setNewOpen(false)}>Создать роль</button></>}><div className="overlay-form-grid"><label className="is-full"><span>Название</span><input placeholder="Например, Старший логист"/></label><label><span>Scope</span><select><option>Организация</option><option>Филиал</option><option>Объект</option></select></label><label><span>Базовая роль</span><select><option>Без шаблона</option><option>Логист</option><option>Бухгалтер</option><option>Руководитель</option></select></label><label className="is-full"><span>Описание</span><textarea placeholder="Для каких задач нужна эта роль"/></label></div></Overlay>
    <Overlay open={!!matrixRole} onClose={()=>setMatrixRole(null)} title={matrixRole?`Матрица · ${matrixRole.name}`:'Матрица роли'} description="Разрешения сгруппированы по модулям; scope дополнительно ограничивает область данных." kicker="Разрешения" size="lg"><div className="permission-matrix-demo">{['Рейсы','ГСМ','ЭПД','ЭДО','Финансы','Интеграции','Администрирование'].map(module=><div key={module}><strong>{module}</strong><span>Просмотр</span><span>Изменение</span><span>Экспорт</span><span>Администрирование</span></div>)}</div></Overlay>
  </div>
}
