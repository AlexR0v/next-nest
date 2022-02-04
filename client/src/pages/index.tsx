import { useRouter } from 'next/router'

function RedirectPage(){
  const router = useRouter()
  if (typeof window !== 'undefined') {
    router.push('/home')
  }
  return null
}

export default RedirectPage
