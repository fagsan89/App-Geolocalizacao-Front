import React from 'react'
import { ContainerTable, Thead, Th, Td } from './styles'

function Tabela(props) {
 
  return (
          <ContainerTable >       
            <table className="table table-striped">
      
                <Thead >
                    <tr>
                        <Th>Nome</Th>
                        <Th>Rua</Th>
                        <Th>Cidade</Th>
                        <Th>País</Th>
                        <Th>Peso</Th>
                        <Th>Lat</Th>
                        <Th>Lng</Th>
                    </tr>
                </Thead>

                <tbody>
                    {
                        props.data !== undefined  ?
                            props.data.map((item, index) => {
                                    return (
                                    
                                            <tr key={index}>
                                                <Td >{item.nome}</Td>
                                                <Td >{item.logradouro}</Td>
                                                <Td >{item.cidade}</Td>
                                                <Td >{item.pais}</Td>
                                                <Td >{item.peso}</Td>
                                                <Td >{item.latitude}</Td>
                                                <Td >{item.longitude}</Td>
                                            </tr>
                                        
                                    )
                                })
                            
                        : null
                    }
                         
                        
                </tbody>
            </table>
                    
          </ContainerTable>
  )
}

export default Tabela;

