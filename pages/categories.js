import Layout from "@/components/Layout";
import { Category } from "@/model/Category";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}){
    const [editedCategory, setEditedCategory] = useState(null);
    const [name,setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [categories,setCategories] = useState([]) 
    const [properties,setProperties] = useState([]) 
    useEffect(() => {
        fetchCategories();
      }, [])
      function fetchCategories() {
        axios.get('/api/categories').then(result => {
          setCategories(result.data);// Lưu danh sách danh mục vào state
        });
      }
    async function saveCategories(ev){
        
        ev.preventDefault()
        const data = {name,parentCategory,properties }
        if (editedCategory)
        {     // Nếu đang sửa, gọi API PUT
            data._id = editedCategory._id
            await axios.put('/api/categories', data)
            setEditedCategory(null);
        }else{   // Nếu là tạo mới, gọi API POST
            await axios.post('/api/categories', data)
          
        }  // Reset form sau khi submit
        setName(''); 
        setParentCategory('')
        setProperties([])
        fetchCategories();
    
     }
     function editCategory(category){
         // Lưu danh mục đang chỉnh sửa vào state, để hiển thị dữ liệu lên form và phân biệt giữa tạo mới và sửa
        setEditedCategory(category)
        // Gán tên danh mục vào input thông qua state
        setName(category.name)
        // Gán ID của danh mục cha (nếu có) vào select box
        setParentCategory(category.parent?._id)
        // Gán các thuộc tính (properties) vào form chỉnh sửa
        setProperties(category.properties.map(({name, values}) => ({
            name,
            values: Array.isArray(values) ? values.join(',') : values
        })))
     }
     function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true,
          }).then(async result => {
            if (result.isConfirmed) {
              const {_id} = category;
              await axios.delete('/api/categories?_id='+_id);
              fetchCategories();
            }
          });
     }// Hàm thêm một thuộc tính mới vào danh sách
     function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'', values:''}]
        })
     }// Hàm xử lý khi thay đổi tên thuộc tính
     function handlePropertyNameChange(index,_property,newName){
        setProperties(prev => {
            const properties = [...prev] // Sao chép mảng cũ ra mảng mới để không thay đổi trực tiếp state
            properties[index].name = newName // Gán tên mới cho thuộc tính tại vị trí 'index'
            return properties
        })
          
     }   // Hàm xử lý khi thay đổi giá trị của thuộc tính
     function handlePropertyValuesChange(index,_property,newValues){
        setProperties(prev => {
            const properties = [...prev]// Tạo bản sao của mảng thuộc tính cũ
            properties[index].values = newValues  // Gán giá trị mới cho thuộc tính tại vị trí 'index'
            return properties
        })
        
     } //Hàm xóa thuộc tính
     function removeProperty(indexToRemove){
        setProperties(prev => {
            // Cập nhật state bằng cách lọc ra các phần tử không trùng index cần xóa
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove
            })
        })
     }
     //Phần giao diện hiển thị categories
     return (
        <Layout>
             <h1>Danh mục</h1>
             <label>{editedCategory 
             ? `Edit category ${editedCategory.name}`
              : 'Tên danh mục mới'}</label>
             <form onSubmit={saveCategories} >
             <div className="gap-1 flex">
             <input required type="text" placeholder={'Danh mục mới'}
                    onChange={ev => setName(ev.target.value)}
                    value={name}/>
            <select   onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}>
                <option value="">Không có danh mục phụ</option> 
                {categories.length > 0 && categories.map(category => (
                        
                        <option key={category._id} value={category._id}>{category.name}</option>
                        
                    ))}
            </select>
             </div>
            <div className="mb-2">
                <label className="block">Thuộc tính</label>
                <button type="button" onClick={addProperty} className="btn-default text-sm mb-2 ">Thêm thuộc tính mới</button>
                {properties.length  > 0 && properties.map((property, index) => (
                  
                    <div key={index} className="flex gap-1 mb-2">
                        <input type="text" className="mb-0" value={property.name} onChange={ev => handlePropertyNameChange(index, property, ev.target.value) } placeholder="Tên thuộc tính(VD: Màu)"/>
                        <input type="text" className="mb-0"  value={property.values} onChange={ev => handlePropertyValuesChange(index, property, ev.target.value) } placeholder="Giá trị (cách nhau bằng dấu ,)"/>
                        <button onClick={() => removeProperty(index)} type="button" className="btn-red">Xóa</button>
                   
                    </div>
                    
                ))}
                    <div className="flex gap-1">
                    {editedCategory && (
                 <button type="button" onClick={() => {setEditedCategory(null)
                                                        setName('')
                                                        setParentCategory('')
                                                        setProperties([])
                                                      
                 }} className="btn-default">Hủy bỏ</button>
                    )}
                 <button type="submit" className="btn-primary py-1">Lưu</button>
                
             </div>
            </div>
            
        
            
             </form>
             { !editedCategory && (
                <table className="basic mt-2" >
                <thead>
                    <tr>
                        <td>Tên danh mục</td>
                        <td>Danh mục phụ</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        
                        <tr key={category._id}>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                
                                <button onClick={() => editCategory(category)} className="btn-default mr-1">Sửa</button>
                                <button onClick={() => deleteCategory(category)}  className="btn-red">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
             )}
             
             
        </Layout>
    )
 
}

export default withSwal(({swal}, ref) => (
    <Categories swal={swal} />
  ));