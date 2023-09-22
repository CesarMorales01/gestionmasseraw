import React from 'react'

const CopyRight = (params) => {

    function ventana_genial_app(){
        let href="https://tupaginaweb.site/";
        window.open(href, "nuevo", "directories=no, location=no, menubar=no, scrollbars=yes, statusbar=no, tittlebar=no, width=800, height=600");
    }
    
  return (
    <div style={{textAlign: 'center', cursor: 'pointer'}} onClick={ventana_genial_app} className="footer-copyright text-center py-3 ">
        <span className="btn btn-link">© 2022 Copyright: GenialApp. Version: {params.version}</span> 
        <br/>
        <img alt="logoGenialApp" width="120" height="170" className="img-fluid centerImg" src={params.globalVars.myUrl + "Images/Config/logo_genial_trans.webp"} />
    </div>
  )
}

export default CopyRight