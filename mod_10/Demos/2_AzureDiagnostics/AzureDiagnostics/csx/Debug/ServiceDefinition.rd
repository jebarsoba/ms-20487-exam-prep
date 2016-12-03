<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="AzureDiagnostics" generation="1" functional="0" release="0" Id="aefc611b-8f57-47d9-a363-0b2c4c2c7f26" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="AzureDiagnosticsGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="DiagnosticsWebRole:Endpoint1" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/LB:DiagnosticsWebRole:Endpoint1" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="DiagnosticsWebRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/MapDiagnosticsWebRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="DiagnosticsWebRoleInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/MapDiagnosticsWebRoleInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:DiagnosticsWebRole:Endpoint1">
          <toPorts>
            <inPortMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/DiagnosticsWebRole/Endpoint1" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapDiagnosticsWebRole:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/DiagnosticsWebRole/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapDiagnosticsWebRoleInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/DiagnosticsWebRoleInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="DiagnosticsWebRole" generation="1" functional="0" release="0" software="C:\dev\ms-20487-exam-prep\mod_10\Demos\2_AzureDiagnostics\AzureDiagnostics\csx\Debug\roles\DiagnosticsWebRole" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="-1" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="Endpoint1" protocol="http" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;DiagnosticsWebRole&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;DiagnosticsWebRole&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/DiagnosticsWebRoleInstances" />
            <sCSPolicyUpdateDomainMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/DiagnosticsWebRoleUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/DiagnosticsWebRoleFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="DiagnosticsWebRoleUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="DiagnosticsWebRoleFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="DiagnosticsWebRoleInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="5ef3cf32-356d-43a5-907f-7323e805179e" ref="Microsoft.RedDog.Contract\ServiceContract\AzureDiagnosticsContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="583070fb-5659-4e1b-adc3-b6deb5eeb978" ref="Microsoft.RedDog.Contract\Interface\DiagnosticsWebRole:Endpoint1@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/AzureDiagnostics/AzureDiagnosticsGroup/DiagnosticsWebRole:Endpoint1" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>