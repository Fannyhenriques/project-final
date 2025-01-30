// import { styled } from 'styled-components';
// import { useState } from 'react';



// const HamburgerIcon = styled.div`
//   display: none; /* Default: hidden */

//   @media (max-width: 768px) {
//   position: absolute;
//   top: 1.5rem;
//   left: 1rem; /* Position the hamburger menu at the top-right */
//   width: 30px;
//   height: 25px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   cursor: pointer;

//   div {
//     width: 100%;
//     height: 4px;
//     background-color: #053332;
//     border-radius: 4px;
//   }
// }
// `;

// const MenuBox = styled.div`
//   position: fixed;
//   top: 7.2rem;
//   left: 0;
//   background-color: #053332; 
//   width: 10rem; 
//   height: 20rem;    
//   padding: 0rem 0.5rem; 
//   flex-direction: column;
//   align-items: flex-end;
//   display: ${props => (props.$isMenuOpen ? 'block' : 'none')};
//   z-index: 1000;
//   transition: all 0.3s ease-in-out;
//   padding: 0rem 0.5rem;

//   ul {
//     list-style: none;
//     padding-top: 70px;
//     text-align: center;
//   }

//   li {
//     padding: 0.5rem 0rem;
//     font-size: 1rem;
//   }

//   a {
//     color: white;
//     text-decoration: none;
//     font-weight: 300;
//     font-family: "poppins"
//   }

//    /* Hide the menu on desktop */
//    @media (min-width: 769px) {
//     display: none;
//   }


//   //Tablet
//   @media (min-width: 768px) {
//     width: 14rem; 
//     height: 16rem;
//     top: 2.84rem;
  

//   li {
//       font-size: 1.2rem;  /* Increase font size */
//     }

//     a {
//       font-size: 1.2rem;  /* Increase font size for links */
//     }
  
//   }

//   /* Desktop styling */
//   @media (min-width: 1200px) {
//     width: 15rem; 
//     height: 17rem;
  

//   li {
//       font-size: 1.5rem; 
//     }

//     a {
//       font-size: 1.5rem; 
//     }
//   }
// `;

// const CloseButton = styled.div`
//   position: absolute;
//   bottom: 1rem;
//   left: 1rem;
//   color: white;
//   cursor: pointer;
//   font-size: 0.875rem; 

  
//   //Tablet
//   @media (min-width: 768px) {
//   font-size: 1.2rem;  

//   }
    
//     /* Desktop styling */
//   @media (min-width: 1200px) {
//     font-size: 1.5rem; 
//   }
// `;


// export const HamburgerMenu = ({ menuItems }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Toggle the menu open/close
//   const toggleMenu = () => {
//     setIsMenuOpen(prevState => {
//       const newState = !prevState;
//       return newState;
//     });
//   };

//   return (
//     <>
//       <HamburgerIcon onClick={toggleMenu}>
//         <div></div>
//         <div></div>
//         <div></div>
//       </HamburgerIcon>

//       <MenuBox $isMenuOpen={isMenuOpen}>  {/* Use $isMenuOpen here */}
//         <CloseButton onClick={toggleMenu}>X</CloseButton>
//         <ul>
//           {menuItems.map((item, index) => (
//             <li key={index}>
//               <a href={item.href} onClick={toggleMenu}>
//                 {item.text}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </MenuBox>
//     </>
//   );
// };