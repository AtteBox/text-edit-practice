param(
    [Parameter(Mandatory = $true)][string]$InstanceIdentifier
)

$parameters = "InstanceIdentifier=$InstanceIdentifier"

aws cloudformation deploy --stack-name "Typoterminator-Stack-$InstanceIdentifier" --template-file ./infra/infra.yaml --parameter-overrides=$parameters --capabilities CAPABILITY_NAMED_IAM 