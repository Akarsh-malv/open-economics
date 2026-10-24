"use client";
import { RotateCcw } from "lucide-react";
import type { ControlConfig, ControlValues, ScenarioPreset } from "@/lib/graphs/engine";
import styles from "./graph-lab.module.css";
function formatSliderValue(value:number,unit?:string):string{
 if(unit===' ÷10')return String(Math.round(value)/10);
 return `${Math.round(value*100)/100}${unit??''}`;
}
export function GraphControls({graphId,controls,presets,values,onChange,onApplyPreset,onReset}:{graphId:string;controls:ControlConfig[];presets?:ScenarioPreset[];values:ControlValues;onChange:(id:string,value:number|string|boolean)=>void;onApplyPreset:(preset:ScenarioPreset)=>void;onReset:()=>void}){
 return <div className={styles.controlPanel}>
  <div className={styles.controlHead}><h3>Controls</h3><button type="button" onClick={onReset} className={styles.reset}><RotateCcw size={16}/>Reset</button></div>
  {presets&&presets.length>0&&<div className={styles.presetGroup}><p>Scenarios</p><div className={styles.presets}>{presets.map(preset=><button key={preset.id} type="button" onClick={()=>onApplyPreset(preset)} aria-pressed={Object.entries(preset.values).every(([key,value])=>values[key]===value)}>{preset.label}</button>)}</div></div>}
  <div className={styles.fields}>{controls.map(control=><ControlField key={`${graphId}-${control.id}`} control={control} value={values[control.id]} onChange={value=>onChange(control.id,value)}/>)}</div>
 </div>;
}
function ControlField({control,value,onChange}:{control:ControlConfig;value:number|string|boolean|undefined;onChange:(value:number|string|boolean)=>void}){
 if(control.kind==='slider'){
  const current=typeof value==='number'?value:control.defaultValue;
  const progress=(current-control.min)/(control.max-control.min)*100;
  return <label className={styles.sliderField}><span><span>{control.label}</span><output>{formatSliderValue(current,control.unit)}</output></span><input type="range" min={control.min} max={control.max} step={control.step} value={current} onChange={event=>onChange(Number(event.target.value))} style={{background:`linear-gradient(to right,#0b192c ${progress}%,#e2e8f0 ${progress}%)`}} aria-label={control.label}/></label>;
 }
 if(control.kind==='segmented'){
  const current=typeof value==='string'?value:control.defaultValue;
  return <fieldset className={styles.segmentField}><legend>{control.label}</legend><div className={styles.segments} role="radiogroup" aria-label={control.label}>{control.options.map(option=><button key={option.value} type="button" role="radio" aria-checked={option.value===current} onClick={()=>onChange(option.value)}>{option.label}</button>)}</div></fieldset>;
 }
 const current=typeof value==='boolean'?value:control.defaultValue;
 return <button type="button" role="switch" aria-checked={current} onClick={()=>onChange(!current)} className={styles.switchField}><span>{control.label}</span><span className={styles.switchTrack}><span/></span></button>;
}
