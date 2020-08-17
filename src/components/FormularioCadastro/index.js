import React,{useEffect,useRef} from 'react'
import apiMaps from '../../services/api_maps'
import { post, del} from '../../services/api'
import { ContainerForm, ContainerButtonFooter } from './styles';


const API_KEY_GOOGLE = ''

function Formulario(props) {

    const[addressText, setAddressText] = React.useState('')
    const[latitude, setLatitude] = React.useState('')
    const[longitude, setLongitude] = React.useState('')
    const [dadosForm, setDadosForm] = React.useState({
        nome:'',
        peso:'',
             
    })

    const [errors, setErrors] = React.useState({})
    const [validaErrors, setValidaErrors] = React.useState(true)

    const _address = useRef(null)

    useEffect(()=>{

        
        if(Object.keys(validate()).length === 0 && validaErrors ===false){
            handleSubmit() 
        }

      },[validaErrors]) // eslint-disable-line react-hooks/exhaustive-deps
    
    async function  loadingMapAdress(){
         const endereco = addressText
   
         
        if (endereco !== '' && endereco !== undefined){

            await apiMaps.get(`json?address=${endereco}', Brasil', 'region': 'BR'&key=${API_KEY_GOOGLE}`)
            .then((resp)=>{
                //console.log(resp.data.results[0].address_components[0].types[0])
                let dataEnd =[]
                resp.data.results[0].address_components.map(item => {
                   
                   if(item.types[0] === "street_number"){

                        dataEnd.push({numero: item.long_name})

                   }else if(item.types[0] === "route"){

                        dataEnd.push({logradouro: item.long_name})

                   }else if(item.types[0] === "political"){

                        dataEnd.push({bairro: item.long_name})

                   }else if(item.types[0] === "administrative_area_level_2"){

                        dataEnd.push({cidade: item.long_name})

                   }else if(item.types[0] === "administrative_area_level_1"){

                        dataEnd.push({estado: item.long_name})

                   }else if(item.types[0] === "country"){

                        dataEnd.push({pais: item.long_name})

                   }
                       
                    return dataEnd
                })

                const  endereco = {
                        logradouro: dataEnd.map(d => d.logradouro ? d.logradouro : null ).filter(x => x)[0],
                        numero: dataEnd.map(d => d.numero ? d.numero : null ).filter(x => x)[0],
                        bairro: dataEnd.map(d => d.bairro ? d.bairro : null ).filter(x => x)[0],
                        cidade: dataEnd.map(d => d.cidade ? d.cidade : null ).filter(x => x)[0],
                        estado: dataEnd.map(d => d.estado ? d.estado : null ).filter(x => x)[0],
                        pais: dataEnd.map(d => d.pais ? d.pais : null ).filter(x => x)[0],
                }

                const geolocalizacao = {
                    latitude:resp.data.results[0].geometry.location.lat,
                    longitude:resp.data.results[0].geometry.location.lng
                }

                setDadosForm({
                    ...dadosForm,    
                    endereco : endereco,
                    geolocalizacao : geolocalizacao ,
                })

                setLatitude(geolocalizacao.latitude)
                setLongitude(geolocalizacao.longitude)
                setErrors({})
           
            })
            .catch((err)=>{
             console.log('ERRO: ',err)
            }) 
        }
       
       
    }

    function handleChange(event){
        setDadosForm({
            ...dadosForm,
            [event.target.name] : event.target.name ==='peso' ? event.target.value.replace(/\D/g,"") : event.target.value
            
        })
    }

    function handleAdress(event){
        
       if(_address.current.value === ''){

           setAddressText('')
           setLatitude('')
           setLongitude('')
                  
       }else{
            let address = event.target.value
            //deixa a primeira letra sempre maiuscula
            let formatAddress = address.toLowerCase().replace(/(?:^|\s)(?!da|de|do)\S/g, l => l.toUpperCase());
            setAddressText(formatAddress)  
       }
           
    }

    function validate(){
        let messageError = '*Campo Obrigatorio'
        let errors = {}

        if(!dadosForm.nome){
            errors.nome = messageError
        }

        if(!dadosForm.peso){
            errors.peso = messageError
        }

        if(!addressText){
            errors.address = messageError
        }

        if(!latitude){
            errors.latitude = '*Campo Obrigatorio/Clique em BUSCAR'
        }

        if(!longitude){
            errors.longitude = '*Campo Obrigatorio/Clique em BUSCAR'
        }

        Object.keys(errors).length === 0 ? setValidaErrors(false) : setValidaErrors(true)
        return errors
    }

    function handleSaved() {

        setErrors(validate())

    }
   
    async function handleSubmit(){

        await post(`/cadastrar`, dadosForm)
        .then(resp =>{
            setDadosForm({nome:'', peso:''})
            setAddressText('')
            setLatitude('')
            setLongitude('')
            props.handleSaveItemsProps('save',resp)
        })
        .catch(err => {            
            console.log('ERRO:', err)
        })
    }

    async function handleDelete(){
        
        await del(`/excluir`)
        .then(resp =>{
            setErrors({})
            props.handleSaveItemsProps('delete',resp)
        })
        .catch(err => {
            console.log('ERRO:', err)
        })
    }
   

  return (
            <div className="row">
                <div className="col-md-12" >
                    <ContainerForm>
                        <div className="col-12 col-sm-6 col-lg-12 col-xl-12 mb-2 mt-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="nome" 
                                placeholder="Nome Cliente"
                                name="nome"
                                value={dadosForm.nome}
                                autoComplete="off"
                                onChange={handleChange}
                            />
                            {errors.nome && <span style={{color:'#DC2D41', fontSize:'12px', fontWeight:'bold'}}>{errors.nome}</span>}
                        </div>
                        
                        <div className="col-12 col-sm-6 col-lg-12 col-xl-12 mb-2">
                            <input 
                                type="text" 
                                className="form-control" 
                                id="peso" 
                                placeholder={'Peso da Entrega'}
                                name="peso"
                                value={dadosForm.peso}
                                autoComplete="off"    
                                onChange={handleChange}
                                
                            />
                            {errors.peso && <span style={{color:'#DC2D41', fontSize:'12px', fontWeight:'bold'}}>{errors.peso}</span>}
                        </div> 
                      
                        <div className="input-group col-12 col-sm-8  col-lg-12 col-xl-12 mb-2">

                                <input className="form-control py-2 border-right-0 border" type="search" autoComplete="off"
                                    value={addressText}
                                    onChange={handleAdress}
                                    placeholder="Endereço Cliente" aria-label="Pesquisar"
                                    aria-describedby="search"
                                    name="address"
                                    ref={_address}
                                />
                                

                                <span id="icone-pesquisar-endereco" className="input-group-append">
                                    <button 
                                        className="button-pesquisar btn btn-outline-secondary border-left-0 border"
                                        type="button"
                                        onClick={() => loadingMapAdress()}>
                                        BUSCAR
                                    </button>
                                </span>
                               
                        </div>
                        {errors.address && <span style={{marginLeft:'12px',color:'#DC2D41', fontSize:'12px', fontWeight:'bold'}}>{errors.address}</span>}     
                        
                        <div className="d-flex justify-content-center mt-5">
                            <div className="col-6 col-sm-6 col-lg-6 col-xl-6 mb-6 mt-2">
                                <input 
                                    type="text"
                                    className="form-control" 
                                    name="latitude" 
                                    readOnly 
                                    placeholder="Latitude"
                                    value={latitude}
                                />
                                {errors.latitude && <span style={{marginLeft:'8px',color:'#DC2D41', fontSize:'12px', fontWeight:'bold'}}>{errors.latitude}</span>} 
                            </div> 
                            <div className="col-6 col-sm-6 col-lg-6 col-xl-6 mb-6 mt-2">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="longitude" 
                                    readOnly 
                                    placeholder="Longitude"
                                    value={longitude}
                                />
                                 {errors.longitude && <span style={{marginLeft:'8px',color:'#DC2D41', fontSize:'12px', fontWeight:'bold'}}>{errors.longitude}</span>}
                            </div> 
                        </div>
                            
                        <div className="p-3 mt-2">         
                            <button type="submit" className="col-12  btn btn-success" onClick={handleSaved}>
                                Cadastrar Cliente
                            </button>
                        </div>
                    </ContainerForm>
                    
                   <ContainerButtonFooter>
                        <button type="submit"  className="col-12 btn btn-danger" onClick={handleDelete}>
                            Resetar Cadastro
                        </button>
                   </ContainerButtonFooter>
                        
                </div>
            </div>
  )
}

export default Formulario;      
        
        