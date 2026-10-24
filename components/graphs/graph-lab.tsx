"use client";
import { ChevronDown, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CustomDiagram } from "@/components/graphs/custom-diagrams";
import { GraphCanvas } from "@/components/graphs/graph-canvas";
import { GraphControls } from "@/components/graphs/graph-controls";
import { getGraphDefinition, graphLibrary } from "@/lib/graphs";
import { type ControlValues, defaultControlValues, type ScenarioPreset, } from "@/lib/graphs/engine";
import { cn } from "@/lib/ui";
import styles from "./graph-lab.module.css";
export function GraphLab({ initialGraphId }: {
    initialGraphId: string;
}) {
    const [selectedId, setSelectedId] = useState(initialGraphId);
    const [search, setSearch] = useState("");
    const [showLabels, setShowLabels] = useState(true);
    const [showEquilibrium, setShowEquilibrium] = useState(true);
    const [showRegions, setShowRegions] = useState(true);
    const definition = getGraphDefinition(selectedId) ?? getGraphDefinition(initialGraphId);
    // Control values are plain state so every change re-renders and recomputes;
    // the ref only preserves each graph's values across graph switches.
    const savedValues = useRef(new Map<string, ControlValues>());
    const [values, setValues] = useState<ControlValues>(() => definition ? defaultControlValues(definition) : {});
    const switchTo = useCallback((id: string, current: {
        id: string;
        values: ControlValues;
    } | null) => {
        const next = getGraphDefinition(id);
        if (!next)
            return;
        if (current)
            savedValues.current.set(current.id, current.values);
        setSelectedId(id);
        setValues(savedValues.current.get(id) ?? defaultControlValues(next));
    }, []);
    const selectGraph = useCallback((id: string) => {
        if (!definition || id === definition.id)
            return;
        switchTo(id, { id: definition.id, values });
        window.history.pushState(null, "", `/graphs/${id}`);
    }, [definition, values, switchTo]);
    // Keep the selected graph in sync with browser back/forward navigation.
    useEffect(() => {
        const onPopState = () => {
            const match = window.location.pathname.match(/^\/graphs\/([^/]+)\/?$/);
            const id = match ? decodeURIComponent(match[1]) : initialGraphId;
            if (getGraphDefinition(id)) {
                switchTo(id, null);
            }
        };
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [initialGraphId, switchTo]);
    const handleControlChange = useCallback((id: string, value: number | string | boolean) => {
        setValues((current) => ({ ...current, [id]: value }));
    }, []);
    const handlePreset = useCallback((preset: ScenarioPreset) => {
        setValues((current) => ({ ...current, ...preset.values }));
    }, []);
    const handleReset = useCallback(() => {
        if (!definition)
            return;
        setValues(defaultControlValues(definition));
    }, [definition]);
    const filteredLibrary = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query)
            return graphLibrary;
        return graphLibrary.map((group) => ({
            ...group,
            categories: group.categories
                .map((category) => ({
                ...category,
                graphs: category.graphs.filter((graph) => graph.title.toLowerCase().includes(query) ||
                    category.name.toLowerCase().includes(query)),
            }))
                .filter((category) => category.graphs.length > 0),
        }));
    }, [search]);
    if (!definition)
        return null;
    const computed = definition.compute?.(values) ?? null;
    return (<div className={styles.container}>
      <h1 className={styles.srOnly}>Interactive Graphs</h1>
      <div className={styles.layout}>
        <div className={styles.picker}>
          <label>Choose a graph<div className={styles.selectWrap}>
            <select value={definition.id} onChange={event=>selectGraph(event.target.value)}>
              {graphLibrary.map(group=>group.categories.map(category=><optgroup key={`${group.course}-${category.name}`} label={`${group.courseLabel} — ${category.name}`}>
                {category.graphs.map(graph=><option key={graph.id} value={graph.id}>{graph.title}</option>)}
              </optgroup>))}
            </select><ChevronDown size={16} aria-hidden="true"/>
          </div></label>
        </div>
        <aside className={styles.library}>
          <div className={styles.libraryInner}>
            <div className={styles.searchArea}><label className={styles.search}>
              <Search size={18} aria-hidden="true"/>
              <input type="search" value={search} onChange={event=>setSearch(event.target.value)} placeholder="Search graphs…" aria-label="Search graphs"/>
            </label></div>
            <nav className={styles.libraryNav} aria-label="Graph library">
              {filteredLibrary.map(group=><div key={group.course} className={styles.courseGroup}>
                {group.categories.length>0&&<p className={styles.courseTitle}><span>{group.courseLabel}</span><span className={styles.count}>{group.categories.reduce((sum,c)=>sum+c.graphs.length,0)}</span></p>}
                {group.categories.map(category=><div key={category.name} className={styles.category}>
                  <p className={styles.categoryTitle}>{category.name}</p>
                  <ul>{category.graphs.map(graph=><li key={graph.id}><button type="button" onClick={()=>selectGraph(graph.id)} data-graph-id={graph.id} aria-current={graph.id===definition.id?'page':undefined} className={styles.graphLink}>{graph.title}{graph.id===definition.id&&<span className={styles.activeDot} aria-hidden="true"/>}</button></li>)}</ul>
                </div>)}
              </div>)}
              {filteredLibrary.every(group=>group.categories.length===0)&&<p className={styles.empty}>No graphs match “{search}”.</p>}
            </nav>
            <div className={styles.libraryFooter}>Interactive Graph Studio<span>{graphLibrary.reduce((sum,g)=>sum+g.categories.reduce((n,c)=>n+c.graphs.length,0),0)} models</span></div>
          </div>
        </aside>
        <section className={styles.workspace} aria-label="Graph workspace">
          <header className={styles.workspaceHead}>
            <div className={styles.headingCopy}>
              <p className={styles.breadcrumb}>{definition.course==='ap-micro'?'AP Microeconomics':'AP Macroeconomics'} · {definition.category}</p>
              <h2>{definition.title}</h2><p className={styles.description}>{definition.description}</p>
            </div>
            {!definition.hideStandardToggles&&computed&&<div className={styles.viewToggles} role="group" aria-label="Graph overlays">
              <ViewToggle label="Labels" active={showLabels} onClick={()=>setShowLabels(v=>!v)}/>
              <ViewToggle label="Equilibrium" active={showEquilibrium} onClick={()=>setShowEquilibrium(v=>!v)}/>
              <ViewToggle label="Areas" active={showRegions} onClick={()=>setShowRegions(v=>!v)}/>
            </div>}
          </header>
          <div className={styles.workArea}>
            <div className={styles.diagram} data-graph-diagram>
              <div className={styles.stage}>
                <div className={styles.stageHead}><span className={styles.statusDot} aria-hidden="true"/>Interactive model<span className={styles.stageHint}>Adjust the controls to explore</span></div>
                {computed?<div className={cn(styles.scenes,computed.scenes.length>1&&styles.paired)}>
                  {computed.scenes.map((scene,index)=><div key={scene.caption??`scene-${index}`} className={styles.scene}><GraphCanvas scene={scene} graphId={`${definition.id}-${index}`} showLabels={showLabels} showEquilibrium={showEquilibrium} showRegions={showRegions}/></div>)}
                </div>:definition.custom?<div data-graph-custom className={styles.custom}><CustomDiagram kind={definition.custom} values={values}/></div>:null}
                {computed?.readouts&&computed.readouts.length>0&&<div className={styles.telemetry} aria-live="polite">{computed.readouts.map(readout=><span key={readout.label}>{readout.label}: <strong>{readout.value}</strong></span>)}</div>}
              </div>
              {computed&&<div className={styles.explanation}><h3>What changed?</h3><p>{computed.explanation}</p></div>}
              {definition.details&&<div className={styles.detailList}>
                {definition.details.interpretation&&<DetailSection title="Key interpretation" body={definition.details.interpretation}/>}
                {definition.details.mistake&&<DetailSection title="Common mistake" body={definition.details.mistake}/>}
                {definition.details.examTip&&<DetailSection title="AP exam tip" body={definition.details.examTip}/>}
              </div>}
            </div>
            <div className={styles.controls}><GraphControls graphId={definition.id} controls={definition.controls} presets={definition.presets} values={values} onChange={handleControlChange} onApplyPreset={handlePreset} onReset={handleReset}/></div>
          </div>
        </section>
      </div>
    </div>);
}
function ViewToggle({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}){
 return <button type="button" aria-pressed={active} onClick={onClick}>{label}</button>;
}

function DetailSection({ title, body }: {
    title: string;
    body: string;
}) {
    return (<details className={styles.detail}>
      <summary className={styles.detailSummary}>
        <span>{title}</span>
        <ChevronDown className={styles.detailChevron} aria-hidden="true"/>
      </summary>
      <p className={styles.detailBody}>{body}</p>
    </details>);
}
