import React, {useEffect} from 'react'
import FormCadastro from '../components/FormularioCadastro'
import Mapa from '../components/Mapa'
import TabelaCliente from '../components/TabelaCliente'
import OpenNotificationWithIcon from '../components/Notificacoes/notification'
import 'antd/dist/antd.css';
import {get} from '../services/api'
import { SpanInfo } from './styles'

function Home() {

  const [media, setMedia] = React.useState(null)
  const [totalClientes, setTotalClientes] = React.useState(null)
  const [totalPeso, setTotalPeso] = React.useState(null)
  const [dataClient, setDataCliente] = React.useState([])

  useEffect(()=>{

    getDataClientes()

  },[]) 

  async function getDataClientes(){

     await get('/listar')
    .then((resp) =>{   
 
       const data = []
       resp.data.clientes.map((item) => {
         
           let newdata = {
               id:item._id,
               nome:item.nome,
               peso:item.peso,
               logradouro: item.endereco.logradouro ? item.endereco.logradouro : null,
               numero:item.endereco.numero,
               bairro:item.endereco.bairro,
               cidade:item.endereco.cidade,
               estado:item.endereco.estado,
               pais:item.endereco.pais,
               latitude:item.geolocalizacao.latitude,
               longitude:item.geolocalizacao.longitude
 
           }          
          
           return data.push(newdata)
          
         
          
       })
        
        setTotalClientes(resp.data.total_clientes)
        setTotalPeso(resp.data.total_peso)
        setMedia(resp.data.media)
        setDataCliente(data)
    })
    .catch((err) =>{
        console.log(err)
    })
  }
  
  
  function handleSaveItems(action,dataResp){

    const message = dataResp.data.message

    if(action === 'save'){
      OpenNotificationWithIcon('success',`${message}`,'')
      getDataClientes()
    }else if(action === 'delete'){
      OpenNotificationWithIcon('success',`${message}`,'')
      getDataClientes()
    }
    
  }
  

  return (

      
   
          <div className="container-fluid">
              <div className="row">

                  <div className="col-md-3 mt-3" style={{borderRight:'1px solid #000000'}}>
                     <FormCadastro  handleSaveItemsProps={(action,dataResp) => handleSaveItems(action, dataResp)} />
                  </div>

                  <div className="col-md-9 mt-3">                      
                      <div className="row">
                          <div className="col-md-12">
                              <Mapa data={dataClient} />
                          </div>
                      </div>
                      <div className="row">
                          <div className="col-md-12 mt-1 mb-1">

                            <SpanInfo>Total de Clientes: {totalClientes};</SpanInfo>
                            <SpanInfo>Peso Total: {totalPeso};</SpanInfo>
                            <SpanInfo>Ticket Médio*: {media} </SpanInfo>
                           
                          </div>
                      </div>
                      <TabelaCliente data={dataClient} />
                      <SpanInfo>*Peso Total/Total de Clientes</SpanInfo>
                  </div>

            </div>
        </div>
  )
}

export default Home;