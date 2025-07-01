export const useStripTags = () => ({
  stripTags: (html: string): string => 
    html?.replace(/<[^>]*>/g, '') || ''
})