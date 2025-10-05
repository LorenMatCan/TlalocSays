import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 256 256"
      >
      <rect width="256" height="256" fill="none"/>
      <path d="M83.4,216a80,80,0,0,1-49.7-142.9,80,80,0,0,1,149.2-25.8,80,80,0,0,1-43.3,144.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
      <path d="M168,140a40,40,0,0,1-76.4-15.5,40,40,0,0,1,64.2-35.3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"/>
    </svg>
  )
}
