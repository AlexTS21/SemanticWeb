<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" />
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Agenda de contactos</title>
        <link rel="stylesheet" href="style.css"></link>
      </head>
      <body>
        <h2>Agenda de Contactos</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Parentezco</th>
              <th>Correo</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="agenda/contacto">
              <tr>
                <td><xsl:value-of select="@id"/></td>
                <td><xsl:value-of select="normalize-space(nombre)"/></td>
                <td><xsl:value-of select="normalize-space(telefono)"/></td>
                <td><xsl:value-of select="normalize-space(parentezco)"/></td>
                <td><xsl:value-of select="normalize-space(correo)"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
