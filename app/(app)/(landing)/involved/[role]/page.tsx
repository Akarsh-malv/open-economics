import { notFound } from "next/navigation";
import { RoleDetail } from "@/components/involved/role-detail";
import roles from "@/lib/involved/roles.json";
import { buildPublicMetadata } from "@/lib/seo";
export function generateStaticParams(){return roles.map(role=>({role:role.id}));}
export async function generateMetadata({params}:{params:Promise<{role:string}>}){const {role:id}=await params;const role=roles.find(r=>r.id===id);return buildPublicMetadata({title:role?.title??"Role not found",description:role?.shortSummary??"OpenEconomics opportunities",path:`/involved/${id}`});}
export default async function Page({params}:{params:Promise<{role:string}>}){const {role}=await params;if(!roles.some(r=>r.id===role))notFound();return <RoleDetail id={role}/>;}
