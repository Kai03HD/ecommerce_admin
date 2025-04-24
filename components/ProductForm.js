import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";



export default function ProductForm({_id, title:existingTitle,description:existingDes,price:existingPrice,
                                    images:existingImages,category:assignedCategory,properties:assignedProperties}){
        // Khai báo các state để lưu thông tin sản phẩm, nếu có dữ liệu cũ thì dùng, nếu không thì để trống
        const [title,setTitle] = useState(existingTitle  || '');
        const [category, setCategory] = useState(assignedCategory  || '');
        const [description,setDescription] = useState(existingDes || '');
        const [images,setImages] = useState(existingImages || []);
        const [price,setPrice] = useState(existingPrice || '');
        const [productProperties,setProductProperties] = useState(assignedProperties || {})
        const [goToProducts,setGoToProducts] = useState(false);// Trạng thái để chuyển hướng sau khi lưu
        const [isUploading, setIsUpLoading] = useState(false); // Trạng thái loading khi upload ảnh
        const [categories, setCategories] = useState([]);// Lưu danh sách danh mục
        
        const router = useRouter();// Khởi tạo router
        useEffect(() => {
            axios.get('/api/categories').then(result => {
               
              setCategories(result.data);
            })
          }, []);
        // Hàm xử lý khi bấm nút lưu sản phẩm
        async function saveProduct(ev){
            ev.preventDefault();// Ngăn chặn hành vi mặc định của form
            const data = {title,description,price,images,category,properties: productProperties}
            if(_id){
                //update
               
                await axios.put('/api/products', {...data,_id}); 
            }
            else{
                //create
           
                await axios.post('/api/products', data); 
               
            }
            setGoToProducts(true)// Kích hoạt chuyển hướng sau khi lưu
        }
        // Nếu goToProducts = true, điều hướng về trang danh sách sản phẩm
        if (goToProducts){
            router.push('/products');
        }
        // Hàm xử lý upload ảnh
        async function uploadImages(ev){
            const files = ev.target?.files;
            if (files?.length >0){
                setIsUpLoading(true)
                const data = new FormData();
                for (const file of files)
                {
                    data.append('file', file)
                    }
                    
                const res = await axios.post('/api/upload', data)// Gửi ảnh lên server
                setImages(oldImages => {
                    return [...oldImages, ...res.data.links];// Cập nhật danh sách ảnh
                })
                setIsUpLoading(false)
            }
        }
        // Cập nhật lại thứ tự ảnh sau khi kéo thả
        function updateImagesOrder(images   ){
            setImages(images)
        }
        // Cập nhật giá trị của các thuộc tính sản phẩm
        function setProductProp(propName, value){
            setProductProperties(prev => {
                const newProductProp = {...prev}
                newProductProp[propName] = value
                return newProductProp
            })
        }
        function formatPrice(value) {
            if (!value) return '';
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
        // Xử lý lấy ra các property cần hiển thị theo danh mục
        const propertiesToFill = [];
        if (categories.length > 0 && category) {
          let catInfo = categories.find(({_id}) => _id === category);
          if (catInfo?.properties) {
            propertiesToFill.push(...catInfo.properties);
          }
          while(catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            if (parentCat?.properties) {
                propertiesToFill.push(...parentCat.properties);
              }
            catInfo = parentCat;
          }
        }
      
           return(
           
                <form onSubmit={saveProduct}>
               
                <label>Tên sản phẩm</label>
                <input type="text" placeholder="tên sản phẩm" value={title} onChange={ev =>setTitle(ev.target.value)}/>
                <label>Danh mục</label>
                <select value={category} onChange={ev => setCategory(ev.target.value)}>
                    <option value="">Uncategorized</option>
                    {categories.length > 0 && categories.map(c => (
                       
                        <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                </select>
                
                {propertiesToFill.length > 0 && propertiesToFill.map(p => {
               const values = Array.isArray(p.values) ? p.values : p.values?.split(',') || [];


    return (
        <div key={p.name} className="">
            <label>{p?.name?.[0]?.toUpperCase() + p?.name?.substring(1) }</label>

            <div>
                <select
                    value={productProperties[p.name]}
                    onChange={ev => setProductProp(p.name, ev.target.value)}>
                   <option value="">Chọn {p.name}</option>
                    {values.map(v => (
                        <option value={v} key={v}>{v}</option>
                    ))}
                </select>
            </div>
        </div>
    );
})}

                <label>Hình ảnh</label>
                    
                <div className="mb-2 gap-1 flex flex-wrap">
                <ReactSortable list={images} setList={updateImagesOrder} className="gap-1 flex flex-wrap">
                {!!images?.length && images.map(link => (
              <div key={link} className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200">
                <img src={link} alt="" className="rounded-lg"/>
              </div>
            ))}
                  </ReactSortable>
                    {isUploading && (
                        <div className="h-24 flex items-center">
                           <Spinner/>
                        </div>
                    )}
                    <label className="w-24 h-24 flex items-center justify-center cursor-pointer bg-gray-200 text-gray-500 rounded-lg border border-gray-200 bg-white shadow-sm text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
  <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
</svg>

                    <div>Upload</div>
                    <input type="file" name="file" multiple onChange={uploadImages} className="hidden"/>
                    </label>
                    {!images?.length && (
                        <div> Chưa có ảnh </div>
                    )}
                </div>
                <label>Mô tả</label>
                <textarea placeholder="description" value={description} onChange={ev => setDescription(ev.target.value)}/>
                <label>Giá ( theo VND)</label>
                <input type="number" placeholder="price" value={price} onChange={ev =>setPrice(ev.target.value)}/>
                <button type="submit" className="btn-primary">Save</button>
                </form>
         
        );
}