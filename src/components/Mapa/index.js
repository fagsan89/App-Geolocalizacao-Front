import React, { useEffect } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { ContainerMapa } from './styles'

function LoadMapa(props) {
  
  const [dataMap, setDataMap] = React.useState([])
  const [latitudeDefault] = React.useState(-23.550520)
  const [longitudeDefault] = React.useState(-46.633308)
  const [latitude, setLatitude] = React.useState(null)
  const [longitude, setLongitude] = React.useState(null)
  const [zommMap] = React.useState(12)

  useEffect(()=>{
    getDataClientes()
  })
  function getDataClientes(){

    const dataLatitude = props.data.map(d => d.latitude ? d.latitude : null ).filter(x => x)[0]
    const dataLongitude = props.data.map(d => d.longitude ? d.longitude : null ).filter(x => x)[0]
   
    setDataMap(props.data)
    setLatitude(dataLatitude)
    setLongitude(dataLongitude)
     
  }

return (<ContainerMapa >


  {
      dataMap.length > 0 
          ?
              <Map center={[latitude,longitude]} zoom={zommMap}>
                  <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  
                  />
      
                      {dataMap.map(end =>(
                          <Marker
                                  animate={true}
                                  key={end.id}
                                  position={[
                                      end.latitude,
                                      end.longitude
                                  ]}

                                  // onClick={()=>{
                                  //     setActiveEnd(end.nome)
                                  //     setLatitudePop(end.latitude)
                                  //     setLongitudePop(end.latitude)
                                  // }}
                          >
                              
                                      <Popup
                                      position={[
                                          end.latitude,
                                          end.longitude
                                      ]}
                                      >
                                      <div>
                                          <div style={{fontSize:'20px', fontWeight:'bold'}}>{end.nome}</div>
                                          <div style={{fontSize:'15px', display:'flex', alignItems:'center', justifyContent:'center'}}>{end.peso}Kg</div>
                                      </div>
                                   
                                      </Popup>
                              
                          </Marker>
                      )) }
              
          </Map>
      : 
      
          <Map center={[latitudeDefault,longitudeDefault]} zoom={zommMap}>
              <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          
              />                              
           </Map>
      }

 </ContainerMapa>)

}


export default LoadMapa;