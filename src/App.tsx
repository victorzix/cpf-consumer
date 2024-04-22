import { CheckUserForm } from './Form';


function App() {
  return (
    <div className='w-screen h-screen flex items-center gap-20 pt-36 flex-col'>
      <img src="/banner.png" className='sm:w-1/2 md:w-2/5 lg:w-2/6 xl:w-2/7 2xl:w-1/5' alt="" />
      <CheckUserForm />
    </div>
  )
}

export default App
