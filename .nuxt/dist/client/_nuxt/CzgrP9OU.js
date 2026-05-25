async function r(t){if(!t.trim())return[];try{const a=await $fetch("/api/dadata/suggest",{method:"POST",body:{query:t}});return Array.isArray(a?.items)?a.items:[]}catch{return[]}}export{r as d};
