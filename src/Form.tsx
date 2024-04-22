import { ReactNode, useEffect, useState } from "react"
import { Input } from "./components/ui/input"
import { Button } from "./components/ui/button"
import { IUser, getAccessToken, listCustomers } from "./api/axios"

const mask = (v: string) => {
  v = v.replace(/\D/g, "")

  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d)/, "$1.$2")
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  } else {
    v = v.replace(/^(\d{2})(\d)/, "$1.$2")
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
    v = v.replace(/(\d{4})(\d)/, "$1-$2")
  }

  return v
}

export function CheckUserForm() {
  const [accessToken, setAccessToken] = useState<string>();
  const [inputValue, setInputValue] = useState('')
  const [document, setDocument] = useState('')
  const [message, setMessage] = useState<ReactNode>();

  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await getAccessToken();
        setAccessToken(token);
      } catch (error) {
        console.error('Erro ao obter o token de acesso:', error);
      }
    };

    fetchAccessToken();
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (

    <div className="flex flex-col w-2/3 sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 2xl:w-1/4 justify-center items-center gap-6">
      <div className="flex flex-col w-full justify-center items-center gap-3">

        <label htmlFor="input" className="w-full text-xs text-gray-500">CPF/CNPJ</label>
        <Input type='text' name='input' className='' onChange={(e) => {
          const { value } = e.target
          setDocument(() => {
            return value.replace(/\D/g, '')
          })
          setInputValue(mask(value))
        }} value={inputValue} maxLength={18} placeholder="CPF/CNPJ" />

        <Button className="w-1/3" onClick={async () => {
          if (!document) {
            setMessage("Campo não pode estar vazio")
            return;
          }
          const user: IUser | string = await listCustomers(accessToken as string, document)
          if (typeof user == 'string') {
            return setMessage(<span>
              {user}
            </span>)
          }
          return setMessage(<span>
            Nome: {user.name} <br />
            Status: {user.status}
          </span>)
        }}>Verificar Usuário</Button>
        <span className="text-sm">
          {message || ""}
        </span>
      </div>
    </div>
  )
}
