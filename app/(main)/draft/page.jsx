// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import SideMenu from "@/components/sideMenu";
// import TopNavbar from "@/components/topnavbar";
// import MainContent from "@/components/maincontent";
// import Banner from "@/components/banner";
// import ProductCard from "@/components/productCard";
// import { getUserProductsByCategory, updateProductItem, setProductStatus, reorderProducts } from "@/lib/services/product";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import withAuth from "@/lib/withAuth";

// function DraggableProductCard({ id, children }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition,  // Ensuring smooth transition
//     touchAction: 'none',
//     opacity: isDragging ? 0.5 : 1,  // Slightly reduced opacity when dragging to give visual feedback
//     zIndex: isDragging ? 1000 : 'auto',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }

// function Home() {
//   const [currentList, setCurrentList] = useState([]);
//   const [draftList, setDraft] = useState([]);
//   const currentListContainerRef = useRef(null);
//   const draftListContainerRef = useRef(null);

//   const GetAllList = async () => {
//     try {
//       const response = await getUserProductsByCategory({ category: "draft" });
//       console.log("API Response:", response.data);

//       if (response.data.status === "success") {
//         const data = response.data.data;
//         let ActiveList = data.filter((i) => i.active);
//         setCurrentList(ActiveList);
//         let DraftList = data.filter((i) => !i.active);
//         setDraft(DraftList);
//       } else {
//         console.error("API Error:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   useEffect(() => {
//     GetAllList();
//   }, []);

//   const UpdateProduct = async (id, bool) => {
//     try {
//       const response = await updateProductItem({
//         _id: id,
//         active: bool,
//       });

//       if (response.status === 200) {
//         GetAllList();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;

//     // If over is null, assume the item is being moved to an empty list
//     if (!over) {
//       const activeItemInCurrentList = currentList.find(item => item && item._id === active.id);
//       const activeItemInDraftList = draftList.find(item => item && item._id === active.id);

//       if (activeItemInCurrentList) {
//         // Move item from currentList to draftList
//         setCurrentList(items => items.filter(item => item._id !== active.id));
//         setDraft(items => [...items, activeItemInCurrentList]);
//         await setProductStatus({ _id: active.id, active: false });
//       } else if (activeItemInDraftList) {
//         // Move item from draftList to currentList
//         setDraft(items => items.filter(item => item._id !== active.id));
//         setCurrentList(items => [...items, activeItemInDraftList]);
//         await setProductStatus({ _id: active.id, active: true });
//       }

//       return;
//     }

//     if (active.id !== over.id) {
//       const activeItemInCurrentList = currentList.find(item => item && item._id === active.id);
//       const overItemInDraftList = draftList.find(item => item && item._id === over.id);

//       if (activeItemInCurrentList && overItemInDraftList) {
//         // Moving from currentList to draftList
//         setCurrentList(items => items.filter(item => item._id !== active.id));
//         setDraft(items => [...items, activeItemInCurrentList]);
//         await setProductStatus({ _id: active.id, active: false });
//       } else if (draftList.find(item => item && item._id === active.id) && currentList.find(item => item && item._id === over.id)) {
//         // Moving from draftList to currentList
//         setDraft(items => items.filter(item => item._id !== active.id));
//         setCurrentList(items => [...items, draftList.find(item => item._id === active.id)]);
//         await setProductStatus({ _id: active.id, active: true });
//       } else {
//         let newCurrentList = [...currentList];
//         let newDraftList = [...draftList];
        
//         if (currentList.some(item => item && item._id === active.id)) {
//           const oldIndex = currentList.findIndex(item => item && item._id === active.id);
//           const newIndex = currentList.findIndex(item => item && item._id === over.id);
//           newCurrentList = arrayMove(currentList, oldIndex, newIndex);
//           setCurrentList(newCurrentList);
//         }

//         if (draftList.some(item => item && item._id === active.id)) {
//           const oldIndex = draftList.findIndex(item => item && item._id === active.id);
//           const newIndex = draftList.findIndex(item => item && item._id === over.id);
//           newDraftList = arrayMove(draftList, oldIndex, newIndex);
//           setDraft(newDraftList);
//         }

//         // Call the backend API to save the new order
//         await reorderProducts({ reorderedProducts: newCurrentList.concat(newDraftList) });
//       }
//     }
//   };

//   const scrollLeft = (containerRef) => {
//     containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//   };

//   const scrollRight = (containerRef) => {
//     containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//   };

//   return (
//     <div className="main-container">
//       <SideMenu />
//       <div className="overflow-hidden">
//         <TopNavbar />
//         <MainContent>
//           <div className="container">
//             <Banner bgImgSrc="/images/banner1.jpg" title="Your Digital Menu" />
//             <div className="text-[22px] text-white font-semibold mb-1">Current Tap List</div>
//             <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//               <SortableContext items={currentList.map(item => item._id)} strategy={rectSortingStrategy}>
//                 <div className="relative" style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>
//                   {currentList.length > 0 && (
//                     <button
//                       onClick={() => scrollLeft(currentListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         left: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {"<"}
//                     </button>
//                   )}
//                   <div
//                     ref={currentListContainerRef}
//                     className="flex space-x-4"
//                     style={{
//                       overflowX: 'auto',
//                       scrollSnapType: 'x mandatory',
//                       padding: '5px 0',
//                       WebkitOverflowScrolling: 'touch',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                     }}
//                   >
//                     {currentList.map((i) => {
//                       if (!i || !i._id) {
//                         console.error('Product item is missing or undefined:', i);
//                         return null;
//                       }
//                       const formattedItems = i?.pricintList?.map(
//                         (item) => `${item.size}oz - ${item.price}$`
//                       );
//                       return (
//                         <DraggableProductCard key={i._id} id={i._id}>
//                           <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                             <ProductCard
//                               recordId={i._id}
//                               updateAction={() => {
//                                 UpdateProduct(i._id, false);
//                               }}
//                               bgImgSrc={i?.imageUrl}
//                               num={i?.quantity}
//                               title={i?.productName}
//                               description={i?.description}
//                               members={formattedItems}
//                             />
//                           </div>
//                         </DraggableProductCard>
//                       );
//                     })}
//                     <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                       <ProductCard
//                         bgImgSrc="/images/cardbg3.png"
//                         num="+"
//                         title="Add New Draft"
//                         description="Search for new draft to add"
//                         members={[]}
//                       />
//                     </div>
//                   </div>
//                   {currentList.length > 0 && (
//                     <button
//                       onClick={() => scrollRight(currentListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         right: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {">"}
//                     </button>
//                   )}
//                 </div>
//               </SortableContext>
//               <div className="text-[22px] text-white font-semibold mt-1 mb-1">Inventory Draft</div>
//               <SortableContext items={draftList.map(item => item._id)} strategy={rectSortingStrategy}>
//                 <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
//                   {draftList.length > 0 && (
//                     <button
//                       onClick={() => scrollLeft(draftListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         left: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {"<"}
//                     </button>
//                   )}
//                   <div
//                     ref={draftListContainerRef}
//                     className="flex space-x-4"
//                     style={{
//                       overflowX: 'auto',
//                       scrollSnapType: 'x mandatory',
//                       padding: '5px 0',
//                       WebkitOverflowScrolling: 'touch',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                     }}
//                   >
//                     {draftList.map((i) => {
//                       if (!i || !i._id) {
//                         console.error('Product item is missing or undefined:', i);
//                         return null;
//                       }
//                       const formattedItems = i?.pricintList?.map(
//                         (item) => `${item.size}oz - ${item.price}$`
//                       );
//                       return (
//                         <DraggableProductCard key={i._id} id={i._id}>
//                           <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                             <ProductCard
//                               recordId={i._id}
//                               updateAction={() => {
//                                 UpdateProduct(i._id, true);
//                               }}
//                               bgImgSrc={i?.imageUrl}
//                               num={i?.quantity}
//                               title={i?.productName}
//                               description={i?.description}
//                               members={formattedItems}
//                             />
//                           </div>
//                         </DraggableProductCard>
//                       );
//                     })}
//                     <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                       <ProductCard
//                         bgImgSrc="/images/cardbg3.png"
//                         num="+"
//                         title="Add New Draft"
//                         description="Search for new draft to add"
//                         members={[]}
//                       />
//                     </div>
//                   </div>
//                   {draftList.length > 0 && (
//                     <button
//                       onClick={() => scrollRight(draftListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         right: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {">"}
//                     </button>
//                   )}
//                 </div>
//               </SortableContext>
//             </DndContext>
//           </div>
//         </MainContent>
//       </div>
//     </div>
//   );
// }

// export default withAuth(Home);


// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import SideMenu from "@/components/sideMenu";
// import TopNavbar from "@/components/topnavbar";
// import MainContent from "@/components/maincontent";
// import Banner from "@/components/banner";
// import ProductCard from "@/components/productCard";
// import { getUserProductsByCategory, updateProductItem, setProductStatus, reorderProducts } from "@/lib/services/product";
// import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
// import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import withAuth from "@/lib/withAuth";

// function DraggableProductCard({ id, children }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition,  // Ensuring smooth transition
//     touchAction: 'none',
//     opacity: isDragging ? 0.9 : 1,  // Slightly reduced opacity when dragging to give visual feedback
//     zIndex: isDragging ? 1000 : 'auto',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }

// function DroppableContainer({ id, children }) {
//   const { setNodeRef } = useDroppable({ id });

//   return (
//     <div ref={setNodeRef} style={{ padding: '10px', border: '2px dashed #ccc', borderRadius: '10px', marginBottom: '20px' }}>
//       {children}
//     </div>
//   );
// }

// function Home() {
//   const [currentList, setCurrentList] = useState([]);
//   const [draftList, setDraft] = useState([]);
//   const currentListContainerRef = useRef(null);
//   const draftListContainerRef = useRef(null);

//   const GetAllList = async () => {
//     try {
//       const response = await getUserProductsByCategory({ category: "draft" });
//       console.log("API Response:", response.data);

//       if (response.data.status === "success") {
//         const data = response.data.data;
//         let ActiveList = data.filter((i) => i.active);
//         setCurrentList(ActiveList);
//         let DraftList = data.filter((i) => !i.active);
//         setDraft(DraftList);
//       } else {
//         console.error("API Error:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   useEffect(() => {
//     GetAllList();
//   }, []);

//   const UpdateProduct = async (id, bool) => {
//     try {
//       const response = await updateProductItem({
//         _id: id,
//         active: bool,
//       });

//       if (response.status === 200) {
//         GetAllList();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;

//     if (!over) {
//       return;
//     }

//     if (active.id !== over.id) {
//       const activeItemInCurrentList = currentList.find(item => item && item._id === active.id);
//       const overItemInDraftList = draftList.find(item => item && item._id === over.id);

//       if (activeItemInCurrentList && overItemInDraftList) {
//         // Moving from currentList to draftList
//         setCurrentList(items => items.filter(item => item._id !== active.id));
//         setDraft(items => [...items, activeItemInCurrentList]);
//         await setProductStatus({ _id: active.id, active: false });
//       } else if (draftList.find(item => item && item._id === active.id) && currentList.find(item => item && item._id === over.id)) {
//         // Moving from draftList to currentList
//         setDraft(items => items.filter(item => item._id !== active.id));
//         setCurrentList(items => [...items, draftList.find(item => item._id === active.id)]);
//         await setProductStatus({ _id: active.id, active: true });
//       } else {
//         let newCurrentList = [...currentList];
//         let newDraftList = [...draftList];
        
//         if (currentList.some(item => item && item._id === active.id)) {
//           const oldIndex = currentList.findIndex(item => item && item._id === active.id);
//           const newIndex = currentList.findIndex(item => item && item._id === over.id);
//           newCurrentList = arrayMove(currentList, oldIndex, newIndex);
//           setCurrentList(newCurrentList);
//         }

//         if (draftList.some(item => item && item._id === active.id)) {
//           const oldIndex = draftList.findIndex(item => item && item._id === active.id);
//           const newIndex = draftList.findIndex(item => item && item._id === over.id);
//           newDraftList = arrayMove(draftList, oldIndex, newIndex);
//           setDraft(newDraftList);
//         }

//         // Call the backend API to save the new order
//         await reorderProducts({ reorderedProducts: newCurrentList.concat(newDraftList) });
//       }
//     }
//   };

//   const scrollLeft = (containerRef) => {
//     containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//   };

//   const scrollRight = (containerRef) => {
//     containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//   };

//   return (
//     <div className="main-container">
//       <SideMenu />
//       <div className="overflow-hidden">
//         <TopNavbar />
//         <MainContent>
//           <div className="container">
//             <Banner bgImgSrc="/images/banner1.jpg" title="Your Digital Menu" />
//             <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//               <DroppableContainer id="droppable-container">
//                 <SortableContext items={currentList.map(item => item._id)} strategy={rectSortingStrategy}>
//                   <div className="relative" style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>
//                     {currentList.length > 0 && (
//                       <button
//                         onClick={() => scrollLeft(currentListContainerRef)}
//                         style={{
//                           position: 'absolute',
//                           left: 0,
//                           top: '50%',
//                           transform: 'translateY(-50%)',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                           padding: '8px',
//                           borderRadius: '50%',
//                           color: 'black',
//                           opacity: 0.5
//                         }}
//                       >
//                         {"<"}
//                       </button>
//                     )}
//                     <div
//                       ref={currentListContainerRef}
//                       className="flex space-x-4"
//                       style={{
//                         overflowX: 'auto',
//                         scrollSnapType: 'x mandatory',
//                         padding: '5px 0',
//                         WebkitOverflowScrolling: 'touch',
//                         scrollbarWidth: 'none',
//                         msOverflowStyle: 'none',
//                       }}
//                     >
//                       {currentList.map((i) => {
//                         if (!i || !i._id) {
//                           console.error('Product item is missing or undefined:', i);
//                           return null;
//                         }
//                         const formattedItems = i?.pricintList?.map(
//                           (item) => `${item.size}oz - ${item.price}$`
//                         );
//                         return (
//                           <DraggableProductCard key={i._id} id={i._id}>
//                             <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                               <ProductCard
//                                 recordId={i._id}
//                                 updateAction={() => {
//                                   UpdateProduct(i._id, false);
//                                 }}
//                                 bgImgSrc={i?.imageUrl}
//                                 num={i?.quantity}
//                                 title={i?.productName}
//                                 description={i?.description}
//                                 members={formattedItems}
//                               />
//                             </div>
//                           </DraggableProductCard>
//                         );
//                       })}
//                     </div>
//                     {currentList.length > 0 && (
//                       <button
//                         onClick={() => scrollRight(currentListContainerRef)}
//                         style={{
//                           position: 'absolute',
//                           right: 0,
//                           top: '50%',
//                           transform: 'translateY(-50%)',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                           padding: '8px',
//                           borderRadius: '50%',
//                           color: 'black',
//                           opacity: 0.5
//                         }}
//                       >
//                         {">"}
//                       </button>
//                     )}
//                   </div>
//                 </SortableContext>
//                 <SortableContext items={draftList.map(item => item._id)} strategy={rectSortingStrategy}>
//                   <div className="relative" style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>
//                     {draftList.length > 0 && (
//                       <button
//                         onClick={() => scrollLeft(draftListContainerRef)}
//                         style={{
//                           position: 'absolute',
//                           left: 0,
//                           top: '50%',
//                           transform: 'translateY(-50%)',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                           padding: '8px',
//                           borderRadius: '50%',
//                           color: 'black',
//                           opacity: 0.5
//                         }}
//                       >
//                         {"<"}
//                       </button>
//                     )}
//                     <div
//                       ref={draftListContainerRef}
//                       className="flex space-x-4"
//                       style={{
//                         overflowX: 'auto',
//                         scrollSnapType: 'x mandatory',
//                         padding: '5px 0',
//                         WebkitOverflowScrolling: 'touch',
//                         scrollbarWidth: 'none',
//                         msOverflowStyle: 'none',
//                       }}
//                     >
//                       {draftList.map((i) => {
//                         if (!i || !i._id) {
//                           console.error('Product item is missing or undefined:', i);
//                           return null;
//                         }
//                         const formattedItems = i?.pricintList?.map(
//                           (item) => `${item.size}oz - ${item.price}$`
//                         );
//                         return (
//                           <DraggableProductCard key={i._id} id={i._id}>
//                             <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                               <ProductCard
//                                 recordId={i._id}
//                                 updateAction={() => {
//                                   UpdateProduct(i._id, true);
//                                 }}
//                                 bgImgSrc={i?.imageUrl}
//                                 num={i?.quantity}
//                                 title={i?.productName}
//                                 description={i?.description}
//                                 members={formattedItems}
//                               />
//                             </div>
//                           </DraggableProductCard>
//                         );
//                       })}
//                     </div>
//                     {draftList.length > 0 && (
//                       <button
//                         onClick={() => scrollRight(draftListContainerRef)}
//                         style={{
//                           position: 'absolute',
//                           right: 0,
//                           top: '50%',
//                           transform: 'translateY(-50%)',
//                           zIndex: 10,
//                           backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                           padding: '8px',
//                           borderRadius: '50%',
//                           color: 'black',
//                           opacity: 0.5
//                         }}
//                       >
//                         {">"}
//                       </button>
//                     )}
//                   </div>
//                 </SortableContext>
//               </DroppableContainer>
//             </DndContext>
//           </div>
//         </MainContent>
//       </div>
//     </div>
//   );
// }

// export default withAuth(Home);




// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import SideMenu from "@/components/sideMenu";
// import TopNavbar from "@/components/topnavbar";
// import MainContent from "@/components/maincontent";
// import Banner from "@/components/banner";
// import ProductCard from "@/components/productCard";
// import { getUserProductsByCategory, updateProductItem, setProductStatus, reorderProducts } from "@/lib/services/product";
// import { DndContext, closestCenter } from "@dnd-kit/core";
// import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import withAuth from "@/lib/withAuth";

// function DraggableProductCard({ id, children }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition,  // Ensuring smooth transition
//     touchAction: 'none',
//     opacity: isDragging ? 0.5 : 1,  // Slightly reduced opacity when dragging to give visual feedback
//     zIndex: isDragging ? 1000 : 'auto',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }

// function Home() {
//   const [currentList, setCurrentList] = useState([]);
//   const [draftList, setDraft] = useState([]);
//   const currentListContainerRef = useRef(null);
//   const draftListContainerRef = useRef(null);

//   const GetAllList = async () => {
//     try {
//       const response = await getUserProductsByCategory({ category: "draft" });
//       console.log("API Response:", response.data);

//       if (response.data.status === "success") {
//         const data = response.data.data;
//         let ActiveList = data.filter((i) => i.active);
//         setCurrentList(ActiveList);
//         let DraftList = data.filter((i) => !i.active);
//         setDraft(DraftList);
//       } else {
//         console.error("API Error:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   useEffect(() => {
//     GetAllList();
//   }, []);

//   const UpdateProduct = async (id, bool) => {
//     try {
//       const response = await updateProductItem({
//         _id: id,
//         active: bool,
//       });

//       if (response.status === 200) {
//         GetAllList();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;

//     if (!over) {
//       return;
//     }

//     if (active.id !== over.id) {
//       const activeItemInCurrentList = currentList.find(item => item && item._id === active.id);
//       const overItemInDraftList = draftList.find(item => item && item._id === over.id);

//       if (activeItemInCurrentList && (!overItemInDraftList || over.id === 'draft-empty')) {
//         // Moving from currentList to draftList
//         setCurrentList(items => items.filter(item => item._id !== active.id));
//         setDraft(items => [...items, activeItemInCurrentList]);
//         await setProductStatus({ _id: active.id, active: false });
//       } else if (draftList.find(item => item && item._id === active.id) && (!currentList.find(item => item && item._id === over.id) || over.id === 'current-empty')) {
//         // Moving from draftList to currentList
//         setDraft(items => items.filter(item => item._id !== active.id));
//         setCurrentList(items => [...items, draftList.find(item => item._id === active.id)]);
//         await setProductStatus({ _id: active.id, active: true });
//       } else {
//         let newCurrentList = [...currentList];
//         let newDraftList = [...draftList];
        
//         if (currentList.some(item => item && item._id === active.id)) {
//           const oldIndex = currentList.findIndex(item => item && item._id === active.id);
//           const newIndex = currentList.findIndex(item => item && item._id === over.id);
//           newCurrentList = arrayMove(currentList, oldIndex, newIndex);
//           setCurrentList(newCurrentList);
//         }

//         if (draftList.some(item => item && item._id === active.id)) {
//           const oldIndex = draftList.findIndex(item => item && item._id === active.id);
//           const newIndex = draftList.findIndex(item => item && item._id === over.id);
//           newDraftList = arrayMove(draftList, oldIndex, newIndex);
//           setDraft(newDraftList);
//         }

//         // Call the backend API to save the new order
//         await reorderProducts({ reorderedProducts: newCurrentList.concat(newDraftList) });
//       }
//     }
//   };

//   const scrollLeft = (containerRef) => {
//     containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//   };

//   const scrollRight = (containerRef) => {
//     containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//   };

//   return (
//     <div className="main-container">
//       <SideMenu />
//       <div className="overflow-hidden">
//         <TopNavbar />
//         <MainContent>
//           <div className="container">
//             <Banner bgImgSrc="/images/banner1.jpg" title="Your Digital Menu" />
//             <div className="text-[22px] text-white font-semibold mb-1">Current Tap List</div>
//             <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//               <SortableContext items={currentList.map(item => item._id)} strategy={rectSortingStrategy}>
//                 <div className="relative" style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>
//                   {currentList.length > 0 && (
//                     <button
//                       onClick={() => scrollLeft(currentListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         left: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {"<"}
//                     </button>
//                   )}
//                   <div
//                     ref={currentListContainerRef}
//                     className="flex space-x-4"
//                     style={{
//                       overflowX: 'auto',
//                       scrollSnapType: 'x mandatory',
//                       padding: '5px 0',
//                       WebkitOverflowScrolling: 'touch',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                     }}
//                   >
//                     {currentList.map((i) => {
//                       if (!i || !i._id) {
//                         console.error('Product item is missing or undefined:', i);
//                         return null;
//                       }
//                       const formattedItems = i?.pricintList?.map(
//                         (item) => `${item.size}oz - ${item.price}$`
//                       );
//                       return (
//                         <DraggableProductCard key={i._id} id={i._id}>
//                           <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                             <ProductCard
//                               recordId={i._id}
//                               updateAction={() => {
//                                 UpdateProduct(i._id, false);
//                               }}
//                               bgImgSrc={i?.imageUrl}
//                               num={i?.quantity}
//                               title={i?.productName}
//                               description={i?.description}
//                               members={formattedItems}
//                             />
//                           </div>
//                         </DraggableProductCard>
//                       );
//                     })}
//                     <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                       <ProductCard
//                         bgImgSrc="/images/cardbg3.png"
//                         num="+"
//                         title="Add New Draft"
//                         description="Search for new draft to add"
//                         members={[]}
//                       />
//                     </div>
//                   </div>
//                   {currentList.length > 0 && (
//                     <button
//                       onClick={() => scrollRight(currentListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         right: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {">"}
//                     </button>
//                   )}
//                 </div>
//               </SortableContext>
//               <div className="text-[22px] text-white font-semibold mt-1 mb-1">Inventory Draft</div>
//               <SortableContext items={draftList.map(item => item._id)} strategy={rectSortingStrategy}>
//                 <div className="relative" style={{ display: 'flex', alignItems: 'center' }}>
//                   {draftList.length > 0 && (
//                     <button
//                       onClick={() => scrollLeft(draftListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         left: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {"<"}
//                     </button>
//                   )}
//                   <div
//                     ref={draftListContainerRef}
//                     className="flex space-x-4"
//                     style={{
//                       overflowX: 'auto',
//                       scrollSnapType: 'x mandatory',
//                       padding: '5px 0',
//                       WebkitOverflowScrolling: 'touch',
//                       scrollbarWidth: 'none',
//                       msOverflowStyle: 'none',
//                     }}
//                   >
//                     {draftList.map((i) => {
//                       if (!i || !i._id) {
//                         console.error('Product item is missing or undefined:', i);
//                         return null;
//                       }
//                       const formattedItems = i?.pricintList?.map(
//                         (item) => `${item.size}oz - ${item.price}$`
//                       );
//                       return (
//                         <DraggableProductCard key={i._id} id={i._id}>
//                           <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                             <ProductCard
//                               recordId={i._id}
//                               updateAction={() => {
//                                 UpdateProduct(i._id, true);
//                               }}
//                               bgImgSrc={i?.imageUrl}
//                               num={i?.quantity}
//                               title={i?.productName}
//                               description={i?.description}
//                               members={formattedItems}
//                             />
//                           </div>
//                         </DraggableProductCard>
//                       );
//                     })}
//                     <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                       <ProductCard
//                         bgImgSrc="/images/cardbg3.png"
//                         num="+"
//                         title="Add New Draft"
//                         description="Search for new draft to add"
//                         members={[]}
//                       />
//                     </div>
//                   </div>
//                   {draftList.length > 0 && (
//                     <button
//                       onClick={() => scrollRight(draftListContainerRef)}
//                       style={{
//                         position: 'absolute',
//                         right: 0,
//                         top: '50%',
//                         transform: 'translateY(-50%)',
//                         zIndex: 10,
//                         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                         padding: '8px',
//                         borderRadius: '50%',
//                         color: 'black',
//                         opacity: 0.5
//                       }}
//                     >
//                       {">"}
//                     </button>
//                   )}
//                 </div>
//               </SortableContext>
//             </DndContext>
//           </div>
//         </MainContent>
//       </div>
//     </div>
//   );
// }

// export default withAuth(Home);





// "use client";
// import React, { useEffect, useState, useRef } from "react";
// import SideMenu from "@/components/sideMenu";
// import TopNavbar from "@/components/topnavbar";
// import MainContent from "@/components/maincontent";
// import Banner from "@/components/banner";
// import ProductCard from "@/components/productCard";
// import { getUserProductsByCategory, updateProductItem, setProductStatus, reorderProducts } from "@/lib/services/product";
// import { DndContext, closestCenter, useDroppable, DragOverlay } from "@dnd-kit/core";
// import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import withAuth from "@/lib/withAuth";

// function DraggableProductCard({ id, children }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition: transition,
//     touchAction: 'none',
//     opacity: isDragging ? 0.5 : 1,
//     zIndex: isDragging ? 1000 : 'auto',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// }

// function DroppableContainer({ id, children, containerRef }) {
//   const { setNodeRef } = useDroppable({
//     id: id,
//   });

//   return (
//     <div ref={setNodeRef} className="flex space-x-4" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '5px 0', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//       <div ref={containerRef} className="flex space-x-4" style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '5px 0', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//         {children}
//       </div>
//     </div>
//   );
// }

// function Home() {
//   const [currentList, setCurrentList] = useState([]);
//   const [draftList, setDraft] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const currentListContainerRef = useRef(null);
//   const draftListContainerRef = useRef(null);

//   const GetAllList = async () => {
//     try {
//       const response = await getUserProductsByCategory({ category: "draft" });
//       console.log("API Response:", response.data);

//       if (response.data.status === "success") {
//         const data = response.data.data;
//         let ActiveList = data.filter((i) => i.active);
//         setCurrentList(ActiveList);
//         let DraftList = data.filter((i) => !i.active);
//         setDraft(DraftList);
//       } else {
//         console.error("API Error:", response.data.message);
//       }
//     } catch (error) {
//       console.error("Fetch Error:", error);
//     }
//   };

//   useEffect(() => {
//     GetAllList();
//   }, []);

//   const UpdateProduct = async (id, bool) => {
//     try {
//       const response = await updateProductItem({
//         _id: id,
//         active: bool,
//       });

//       if (response.status === 200) {
//         GetAllList();
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDragStart = (event) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;
//     setActiveId(null);

//     if (!over) return;

//     const activeId = active.id;
//     const overId = over.id;

//     if (activeId !== overId) {
//       if (currentList.some(item => item && item._id === activeId) && currentList.some(item => item && item._id === overId)) {
//         const oldIndex = currentList.findIndex(item => item && item._id === activeId);
//         const newIndex = currentList.findIndex(item => item && item._id === overId);
//         const newCurrentList = arrayMove(currentList, oldIndex, newIndex);
//         setCurrentList(newCurrentList);
//         await reorderProducts({ reorderedProducts: newCurrentList.concat(draftList) });
//       }

//       if (draftList.some(item => item && item._id === activeId) && draftList.some(item => item && item._id === overId)) {
//         const oldIndex = draftList.findIndex(item => item && item._id === activeId);
//         const newIndex = draftList.findIndex(item => item && item._id === overId);
//         const newDraftList = arrayMove(draftList, oldIndex, newIndex);
//         setDraft(newDraftList);
//         await reorderProducts({ reorderedProducts: currentList.concat(newDraftList) });
//       }

//       if (currentList.some(item => item && item._id === activeId) && (overId === "empty-draft-list" || draftList.some(item => item && item._id === overId))) {
//         const activeItem = currentList.find(item => item && item._id === activeId);
//         const newCurrentList = currentList.filter(item => item && item._id !== activeId);
//         const newDraftList = [...draftList, activeItem];
//         setCurrentList(newCurrentList);
//         setDraft(newDraftList);
//         await setProductStatus({ _id: activeId, active: false });
//       }

//       if (draftList.some(item => item && item._id === activeId) && (overId === "empty-current-list" || currentList.some(item => item && item._id === overId))) {
//         const activeItem = draftList.find(item => item && item._id === activeId);
//         const newDraftList = draftList.filter(item => item && item._id !== activeId);
//         const newCurrentList = [...currentList, activeItem];
//         setDraft(newDraftList);
//         setCurrentList(newCurrentList);
//         await setProductStatus({ _id: activeId, active: true });
//       }
//     } else if (overId === "empty-current-list" || overId === "empty-draft-list") {
//       if (overId === "empty-current-list") {
//         const activeItem = draftList.find(item => item && item._id === activeId);
//         const newDraftList = draftList.filter(item => item && item._id !== activeId);
//         const newCurrentList = [...currentList, activeItem];
//         setDraft(newDraftList);
//         setCurrentList(newCurrentList);
//         await setProductStatus({ _id: activeId, active: true });
//       } else if (overId === "empty-draft-list") {
//         const activeItem = currentList.find(item => item && item._id === activeId);
//         const newCurrentList = currentList.filter(item => item && item._id !== activeId);
//         const newDraftList = [...draftList, activeItem];
//         setCurrentList(newCurrentList);
//         setDraft(newDraftList);
//         await setProductStatus({ _id: activeId, active: false });
//       }
//     }
//   };

//   const scrollLeft = (containerRef) => {
//     containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//   };

//   const scrollRight = (containerRef) => {
//     containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//   };

//   return (
//     <div className="main-container">
//       <SideMenu />
//       <div className="overflow-hidden">
//         <TopNavbar />
//         <MainContent>
//           <div className="container">
//             <Banner bgImgSrc="/images/banner1.jpg" title="Your Digital Menu" />
//             <div className="text-[22px] text-white font-semibold mb-1">Current Tap List</div>
//             <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//               <SortableContext items={currentList.map(item => item._id)} strategy={rectSortingStrategy}>
//                 <DroppableContainer id="current-list" containerRef={currentListContainerRef}>
//                   {currentList.length === 0 && (
//                     <div
//                       style={{ width: '355px', height: '300px', flexShrink: 0 }}
//                       id="empty-current-list"
//                     >
//                       <ProductCard
//                         bgImgSrc="/images/cardbg3.png"
//                         num="+"
//                         title="Add New Draft"
//                         description="Search for new draft to add"
//                         members={[]}
//                       />
//                     </div>
//                   )}
//                   {currentList.map((i) => {
//                     if (!i || !i._id) {
//                       console.error('Product item is missing or undefined:', i);
//                       return null;
//                     }
//                     const formattedItems = i?.pricintList?.map(
//                       (item) => ${item.size}oz - ${item.price}$
//                     );
//                     return (
//                       <DraggableProductCard key={i._id} id={i._id}>
//                         <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                           <ProductCard
//                             recordId={i._id}
//                             updateAction={() => {
//                               UpdateProduct(i._id, false);
//                             }}
//                             bgImgSrc={i?.imageUrl}
//                             num={i?.quantity}
//                             title={i?.productName}
//                             description={i?.description}
//                             members={formattedItems}
//                           />
//                         </div>
//                       </DraggableProductCard>
//                     );
//                   })}
//                 </DroppableContainer>
//               </SortableContext>
//               <div className="text-[22px] text-white font-semibold mt-1 mb-1">Inventory Draft</div>
//               <SortableContext items={draftList.map(item => item._id)} strategy={rectSortingStrategy}>
//                 <DroppableContainer id="draft-list" containerRef={draftListContainerRef}>
//                   {draftList.length === 0 && (
//                     <div
//                       style={{ width: '355px', height: '300px', flexShrink: 0 }}
//                       id="empty-draft-list"
//                     >
//                       <ProductCard
//                         bgImgSrc="/images/cardbg3.png"
//                         num="+"
//                         title="Add New Draft"
//                         description="Search for new draft to add"
//                         members={[]}
//                       />
//                     </div>
//                   )}
//                   {draftList.map((i) => {
//                     if (!i || !i._id) {
//                       console.error('Product item is missing or undefined:', i);
//                       return null;
//                     }
//                     const formattedItems = i?.pricintList?.map(
//                       (item) => ${item.size}oz - ${item.price}$
//                     );
//                     return (
//                       <DraggableProductCard key={i._id} id={i._id}>
//                         <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                           <ProductCard
//                             recordId={i._id}
//                             updateAction={() => {
//                               UpdateProduct(i._id, true);
//                             }}
//                             bgImgSrc={i?.imageUrl}
//                             num={i?.quantity}
//                             title={i?.productName}
//                             description={i?.description}
//                             members={formattedItems}
//                           />
//                         </div>
//                       </DraggableProductCard>
//                     );
//                   })}
//                 </DroppableContainer>
//               </SortableContext>
//               <DragOverlay>
//                 {activeId ? (
//                   <div style={{ width: '355px', height: '300px', flexShrink: 0 }}>
//                     <ProductCard
//                       bgImgSrc={currentList.find(item => item && item._id === activeId)?.imageUrl || draftList.find(item => item && item._id === activeId)?.imageUrl}
//                       num={currentList.find(item => item && item._id === activeId)?.quantity || draftList.find(item => item && item._id === activeId)?.quantity}
//                       title={currentList.find(item => item && item._id === activeId)?.productName || draftList.find(item => item && item._id === activeId)?.productName}
//                       description={currentList.find(item => item && item._id === activeId)?.description || draftList.find(item => item && item._id === activeId)?.description}
//                       members={currentList.find(item => item && item._id === activeId)?.pricintList?.map(item => ${item.size}oz - ${item.price}$) || draftList.find(item => item && item._id === activeId)?.pricintList?.map(item => ${item.size}oz - ${item.price}$)}
//                     />
//                   </div>
//                 ) : null}
//               </DragOverlay>
//             </DndContext>
//           </div>
//         </MainContent>
//       </div>
//     </div>
//   );
// }

// export default withAuth(Home);



// "use client"
// import React, { useState } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   rectIntersection,
//   useDroppable
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
//   sortableKeyboardCoordinates,
//   rectSortingStrategy
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const Item = ({ id, text }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     padding: '8px',
//     margin: '4px',
//     backgroundColor: 'lightblue',
//     cursor: 'move',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {text}
//     </div>
//   );
// };

// const DroppableContainer = ({ id, items }) => {
//   const { setNodeRef, isOver } = useDroppable({
//     id,
//   });

//   const style = {
//     backgroundColor: isOver ? 'lightgreen' : 'white',
//     padding: '16px',
//     border: '1px solid black',
//     marginBottom: '16px',
//     minHeight: '50px',
//     display: 'flex',
//     flexDirection: 'row',
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       <SortableContext items={items} strategy={rectSortingStrategy}>
//         {items.map((item) => (
//           <Item key={item.id} id={item.id} text={item.text} />
//         ))}
//         {items.length === 0 && <div style={{ padding: '8px', color: 'grey' }}>Drop items here</div>}
//       </SortableContext>
//     </div>
//   );
// };

// const Home = () => {
//   const [items, setItems] = useState([
//     { id: '1', text: 'Card 1', container: 'list1' },
//     { id: '2', text: 'Card 2', container: 'list1' },
//     { id: '3', text: 'Card 3', container: 'list1' },
//     { id: '4', text: 'Card 4', container: 'list2' },
//     { id: '5', text: 'Card 5', container: 'list2' },
//     { id: '6', text: 'Card 6', container: 'list2' },
//   ]);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragEnd = (event) => {
//     const { active, over } = event;

//     if (!over) return;

//     const activeIndex = items.findIndex((item) => item.id === active.id);
//     const overIndex = items.findIndex((item) => item.id === over.id);

//     const activeItem = items[activeIndex];

//     if (over.id === 'list1' || over.id === 'list2') {
//       // Dropping into an empty container
//       setItems((items) => {
//         const newItems = [...items];
//         newItems[activeIndex] = { ...activeItem, container: over.id };
//         return newItems;
//       });
//     } else if (activeItem.container === items[overIndex].container) {
//       // Moving within the same container
//       setItems((items) => arrayMove(items, activeIndex, overIndex));
//     } else {
//       // Moving to a different container
//       setItems((items) => {
//         const newItems = [...items];
//         newItems[activeIndex] = { ...activeItem, container: items[overIndex].container };
//         return arrayMove(newItems, activeIndex, overIndex);
//       });
//     }
//   };

//   const list1Items = items.filter((item) => item.container === 'list1');
//   const list2Items = items.filter((item) => item.container === 'list2');

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={rectIntersection}
//       onDragEnd={handleDragEnd}
//     >
//       <div>
//         <h2>List 1</h2>
//         <DroppableContainer id="list1" items={list1Items} />
//         <h2>List 2</h2>
//         <DroppableContainer id="list2" items={list2Items} />
//       </div>
//     </DndContext>
//   );
// };

// export default Home;


//^^ working example


"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from 'next/link';
import SideMenu from "@/components/sideMenu";
import TopNavbar from "@/components/topnavbar";
import MainContent from "@/components/maincontent";
import Banner from "@/components/banner";
import ProductCard from "@/components/productCard";
import { getUserProductsByCategory, updateProductItem, setProductStatus, reorderProducts } from "@/lib/services/product";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, rectIntersection, useDroppable, DragOverlay } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import withAuth from "@/lib/withAuth";
import Loader from "@/components/loader"

function DraggableProductCard({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    touchAction: 'none',
    opacity: isDragging ? 0.0 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    marginRight: '16px',
    flex: '0 0 auto',
    width: '100%',
    maxWidth: '355px',
    height: 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}

function DroppableContainer({ id, children }) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const style = {
    marginBottom: '5px',
    minHeight: '290px',
    display: 'flex',
    flexDirection: 'row',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    padding: '5px 0',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
}

function AddNewCard() {
  const style = {
    flex: '0 0 auto',
    width: '100%',
    maxWidth: '355px',
    height: 'auto',
    flexShrink: 0,
  };

  return (
    <div style={style}>
      <Link href="/edit">
        <div style={{ width: '100%', height: '100%' }}>
          <ProductCard
            bgImgSrc="/images/cardbg3.png"
            num="+"
            title="Add New Draft"
            description="Search for new draft to add"
            members={[]}
          />
        </div>
      </Link>
    </div>
  );
}

function Home() {
  const [currentList, setCurrentList] = useState([]);
  const [draftList, setDraft] = useState([]);
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentListContainerRef = useRef(null);
  const draftListContainerRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const response = await getUserProductsByCategory({ category: "draft" });
      if (response.data.status === "success") {
        const data = response.data.data;
        let ActiveList = data.filter((i) => i.active);
        let DraftList = data.filter((i) => !i.active);

        setCurrentList(ActiveList);
        setDraft(DraftList);

        setItems(
          ActiveList.map((item) => ({ ...item, container: 'currentList' })).concat(
            DraftList.map((item) => ({ ...item, container: 'draftList' }))
          )
        );
      } else {
        console.error("API Error:", response.data.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const UpdateProduct = async (id, bool) => {
    try {
      const response = await updateProductItem({
        _id: id,
        active: bool,
      });

      if (response.status === 200) {
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    document.body.style.overflow = 'hidden';
  };

  const handleDragEnd = async (event) => {
    document.body.style.overflow = 'auto';
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeIndex = items.findIndex((item) => item._id === active.id);
    const overIndex = items.findIndex((item) => item._id === over.id);

    if (activeIndex === overIndex) return; // No change in position

    const activeItem = items[activeIndex];

    if (over.id === 'currentList' || over.id === 'draftList') {
      // Dropping into an empty container
      const newItems = [...items];
      newItems[activeIndex] = { ...activeItem, container: over.id };
      setItems(newItems);

      if (over.id === 'currentList') {
        await setProductStatus({ _id: activeItem._id, active: true });
      } else {
        await setProductStatus({ _id: activeItem._id, active: false });
      }
      await reorderProducts({ reorderedProducts: newItems });
    } else if (activeItem.container === items[overIndex].container) {
      // Moving within the same container
      const newItems = arrayMove(items, activeIndex, overIndex);
      setItems(newItems);
      await reorderProducts({ reorderedProducts: newItems });
    } else {
      // Moving to a different container
      const newItems = arrayMove(items, activeIndex, overIndex);
      newItems[overIndex] = { ...activeItem, container: items[overIndex].container };
      setItems(newItems);

      if (items[overIndex].container === 'currentList') {
        await setProductStatus({ _id: activeItem._id, active: true });
      } else {
        await setProductStatus({ _id: activeItem._id, active: false });
      }
      await reorderProducts({ reorderedProducts: newItems });
    }
  };

  const currentListItems = items.filter((item) => item.container === 'currentList');
  const draftListItems = items.filter((item) => item.container === 'draftList');

  const scrollLeft = (containerRef) => {
    containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = (containerRef) => {
    containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const getItemById = (id) => items.find((item) => item._id === id);

  return (
    <div className="main-container">
      {loading && <Loader />}
      {!loading && (
        <>
          <SideMenu />
          <div className="overflow-hidden">
            <TopNavbar />
            <MainContent>
              <div className="container">
                <Banner bgImgSrc="/images/banner1.jpg" title="Your Digital Menu" />
                <div className="text-[22px] text-white font-semibold mb-1">Current Tap List</div>
                <DndContext sensors={sensors} collisionDetection={rectIntersection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                  <SortableContext items={currentListItems.map(item => item._id)} strategy={rectSortingStrategy}>
                    <DroppableContainer id="currentList" containerRef={currentListContainerRef}>
                      {currentListItems.map((i) => {
                        if (!i || !i._id) {
                          console.error('Product item is missing or undefined:', i);
                          return null;
                        }
                        const formattedItems = i?.pricintList?.map(
                          (item) => `${item.size}oz - ${item.price}$`
                        );
                        return (
                          <DraggableProductCard key={i._id} id={i._id}>
                            <div className="flex-0 flex-shrink-0 w-full max-w-[355px] h-auto">
                              <ProductCard
                                recordId={i._id}
                                updateAction={() => {
                                  UpdateProduct(i._id, false);
                                }}
                                bgImgSrc={i?.imageUrl}
                                num={i?.quantity}
                                title={i?.productName}
                                description={i?.description}
                                members={formattedItems}
                              />
                            </div>
                          </DraggableProductCard>
                        );
                      })}
                      <AddNewCard />
                    </DroppableContainer>
                  </SortableContext>
                  <div className="text-[22px] text-white font-semibold mt-1 mb-1">Inventory Draft</div>
                  <SortableContext items={draftListItems.map(item => item._id)} strategy={rectSortingStrategy}>
                    <DroppableContainer id="draftList" containerRef={draftListContainerRef}>
                      {draftListItems.map((i) => {
                        if (!i || !i._id) {
                          console.error('Product item is missing or undefined:', i);
                          return null;
                        }
                        const formattedItems = i?.pricintList?.map(
                          (item) => `${item.size}oz - ${item.price}$`
                        );
                        return (
                          <DraggableProductCard key={i._id} id={i._id}>
                            <div className="flex-0 flex-shrink-0 w-full max-w-[355px] h-auto">
                              <ProductCard
                                recordId={i._id}
                                updateAction={() => {
                                  UpdateProduct(i._id, true);
                                }}
                                bgImgSrc={i?.imageUrl}
                                num={i?.quantity}
                                title={i?.productName}
                                description={i?.description}
                                members={formattedItems}
                              />
                            </div>
                          </DraggableProductCard>
                        );
                      })}
                    </DroppableContainer>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? (
                      <div className="flex-0 flex-shrink-0 w-full max-w-[355px] h-auto">
                        <ProductCard
                          bgImgSrc={getItemById(activeId)?.imageUrl}
                          num={getItemById(activeId)?.quantity}
                          title={getItemById(activeId)?.productName}
                          description={getItemById(activeId)?.description}
                          members={getItemById(activeId)?.pricintList?.map(item => `${item.size}oz - ${item.price}$`)}
                        />
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </div>
            </MainContent>
          </div>
        </>
      )}
    </div>
  );
}

export default withAuth(Home);




// "use client";
// import React, { useState } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   rectIntersection,
//   useDroppable,
//   DragOverlay,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
//   sortableKeyboardCoordinates,
//   rectSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const itemStyles = {
//   padding: '8px',
//   margin: '4px',
//   backgroundColor: 'lightblue',
//   cursor: 'move',
//   width: '100px',
//   height: '50px',
// };

// const Item = ({ id, text }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//   const style = {
//     ...itemStyles,
//     transform: CSS.Transform.toString(transform),
//     transition,
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {text}
//     </div>
//   );
// };

// const DroppableContainer = ({ id, items }) => {
//   const { setNodeRef, isOver } = useDroppable({
//     id,
//   });

//   const style = {
//     backgroundColor: isOver ? 'lightgreen' : 'white',
//     padding: '16px',
//     border: '1px solid black',
//     marginBottom: '16px',
//     minHeight: '50px',
//     display: 'flex',
//     flexDirection: 'row',
//   };

//   return (
//     <div ref={setNodeRef} style={style}>
//       <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
//         {items.map((item) => (
//           <Item key={item.id} id={item.id} text={item.text} />
//         ))}
//         {items.length === 0 && <div style={{ padding: '8px', color: 'grey' }}>Drop items here</div>}
//       </SortableContext>
//     </div>
//   );
// };

// const Home = () => {
//   const [items, setItems] = useState([
//     { id: '1', text: 'Card 1', container: 'list1' },
//     { id: '2', text: 'Card 2', container: 'list1' },
//     { id: '3', text: 'Card 3', container: 'list1' },
//     { id: '4', text: 'Card 4', container: 'list2' },
//     { id: '5', text: 'Card 5', container: 'list2' },
//     { id: '6', text: 'Card 6', container: 'list2' },
//   ]);
//   const [activeId, setActiveId] = useState(null);

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragStart = (event) => {
//     setActiveId(event.active.id);
//   };

//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//     setActiveId(null);

//     if (!over) return;

//     const activeIndex = items.findIndex((item) => item.id === active.id);
//     const overIndex = items.findIndex((item) => item.id === over.id);

//     if (over.id === 'list1' || over.id === 'list2') {
//       // Dropping into an empty container
//       setItems((items) => {
//         const newItems = [...items];
//         newItems[activeIndex] = { ...items[activeIndex], container: over.id };
//         return newItems;
//       });
//     } else if (items[activeIndex].container === items[overIndex].container) {
//       // Moving within the same container
//       setItems((items) => arrayMove(items, activeIndex, overIndex));
//     } else {
//       // Moving to a different container
//       setItems((items) => {
//         const newItems = [...items];
//         newItems[activeIndex] = { ...items[activeIndex], container: items[overIndex].container };
//         return arrayMove(newItems, activeIndex, overIndex);
//       });
//     }
//   };

//   const list1Items = items.filter((item) => item.container === 'list1');
//   const list2Items = items.filter((item) => item.container === 'list2');

//   const getItemById = (id) => items.find((item) => item.id === id);

//   return (
//     <DndContext
//       sensors={sensors}
//       collisionDetection={rectIntersection}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//       autoScroll={{ layoutShiftCompensation: false, enable: false }}
//     >
//       <div>
//         <h2>List 1</h2>
//         <DroppableContainer id="list1" items={list1Items} />
//         <h2>List 2</h2>
//         <DroppableContainer id="list2" items={list2Items} />
//         <DragOverlay>
//           {activeId ? (
//             <div style={itemStyles}>
//               {getItemById(activeId).text}
//             </div>
//           ) : null}
//         </DragOverlay>
//       </div>
//     </DndContext>
//   );
// };

// export default Home;
