import type {TopicId} from './story-content';
import s from './story.module.css';

// Editorial objects explain the product. They contain no simulated business records or actions.
export function StoryScene({topic}:{topic:TopicId}) {
 return <div className={s.visual} data-story-visual={topic}>
  {topic==='crm-history'&&<div className={s.historyBook} data-a3-visual-anchor>
   <div className={s.historyLeft}><span className={s.objectKicker}>Клиентская история</span><strong>О чём<br/>говорили</strong><div className={s.historyLines}><span>Обращения</span><span>История общения</span></div></div>
   <div className={s.historyRight}><span className={s.paperTab}>CRM</span><div className={s.agreement}><span>Что согласовано</span><strong>Договорённости</strong><div className={s.inkLines} aria-hidden="true"><i/><i/><i/></div></div><p>Контекст<br/>для команды</p></div>
  </div>}
  {topic==='crm-next-step'&&<div className={s.nextSheet} data-a3-visual-anchor>
   <div className={s.sheetHeader}><span className={s.objectKicker}>Продолжение разговора</span><span className={s.paperTab}>CRM</span></div>
   <div className={s.nextBookmark}><span>Не только помнить</span><strong>Знать<br/>следующий шаг</strong><div className={s.bookmarkNotch} aria-hidden="true"/></div>
   <div className={s.nextPair}><div><span>С чего продолжить</span><b>Следующий<br/>контакт</b></div><div><span>Кто продолжит</span><b>Ответственный</b></div></div>
  </div>}
  {topic==='oms-continuity'&&<div className={s.continuity} data-a3-visual-anchor>
   <div className={s.continuityHalves}><div><span>CRM</span><strong>Продажи</strong></div><div><span>OMS</span><strong>Исполнение</strong></div></div>
   <div className={`${s.agreement} ${s.sharedAgreement}`}><span>Сохраняются при переходе</span><strong>Согласованные<br/>условия</strong><div className={s.inkLines} aria-hidden="true"><i/><i/></div></div>
   <div className={s.continuityFoot}><span>История клиента</span><span>Работа над заказом</span></div>
  </div>}
  {topic==='oms-responsibility'&&<div className={s.teamFold}>
   <div className={s.foldTitle}><span className={s.objectKicker}>OMS · исполнение</span><strong>Работа над заказом</strong></div>
   <div className={s.foldLeaves} data-a3-visual-anchor><div><span>Что делаем</span><b>Задачи</b><div className={s.foldRule} aria-hidden="true"/></div><div><span>Когда</span><b>Сроки</b><div className={s.foldDial} aria-hidden="true"><i/></div></div><div><span>Кто ведёт</span><b>Ответственность</b><div className={s.foldRule} aria-hidden="true"/></div></div>
   <p>Части одного процесса</p>
  </div>}
  {topic==='custom-process'&&<div className={s.processBrief} data-a3-visual-anchor>
   <div className={s.briefTop}><span className={s.objectKicker}>Разбор задачи</span><span className={s.briefMark} aria-hidden="true"/></div>
   <strong className={s.briefTitle}>Процесс<br/>вашей компании</strong>
   <div className={s.briefQuestions}><div><span>Участники</span><b>Кто участвует<br/>в работе?</b></div><div><span>Данные</span><b>Что нужно<br/>для решения?</b></div></div>
   <div className={s.briefOutcome}><span>Нужный результат</span><b>Что должно измениться</b></div>
  </div>}
  {topic==='custom-solution'&&<div className={s.solutionObject}>
   <div className={s.readyBase} data-a3-visual-anchor><span className={s.objectKicker}>Готовая основа</span><div className={s.productNames}><b>CRM</b><span>Продажи</span><b>OMS</b><span>Исполнение</span></div></div>
   <div className={s.customExtension}><span>Индивидуальная разработка</span><strong>Под процесс<br/>компании</strong><div className={s.extensionSeam} aria-hidden="true"/></div>
   <p>Состав решения обсуждаем вместе</p>
  </div>}
 </div>;
}
